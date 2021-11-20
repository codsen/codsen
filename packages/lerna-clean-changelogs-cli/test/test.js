import fs from "fs-extra";
import path from "path";
import tap from "tap";
import { execa, execaCommand } from "execa";
import tempy from "tempy";
import pMap from "p-map";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pack = require("../package.json");

// Test file contents
// -----------------------------------------------------------------------------

const changelog1 = `# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.9.2 (2018-12-27)







**Note:** Version bump only for package ranges-apply



## [2.9.1](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)

**Note:** Version bump only for package ranges-apply

## 2.9.0 (2018-12-26)

### Bug Fixes

- aaa

### Features

- bbb
`;

const changelog1Fixed = `# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.9.0 (2018-12-26)

### Bug Fixes

- aaa

### Features

- bbb
`;

// Quick, general unit tests
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`general parts`}\u001b[${39}m`} - version output mode`,
  async (t) => {
    const reportedVersion1 = await execa("./cli.js", ["-v"]);
    t.equal(reportedVersion1.stdout, pack.version, "01.01");

    const reportedVersion2 = await execa("./cli.js", ["--version"]);
    t.equal(reportedVersion2.stdout, pack.version, "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`general parts`}\u001b[${39}m`} - help output mode`,
  async (t) => {
    const reportedVersion1 = await execa("./cli.js", ["-h"]);
    t.match(reportedVersion1.stdout, /Usage/, "02.01");
    t.match(reportedVersion1.stdout, /Options/, "02.02");

    const reportedVersion2 = await execa("./cli.js", ["--help"]);
    t.match(reportedVersion2.stdout, /Usage/, "02.03");
    t.match(reportedVersion2.stdout, /Options/, "02.04");
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`general parts`}\u001b[${39}m`} - no files found in the given directory`,
  async (t) => {
    // fetch us a random temp folder
    // const tempFolder = "temp";
    const tempFolder = tempy.directory();
    fs.ensureDirSync(path.resolve(tempFolder));

    // call execa on that empty folder
    const stdOutContents = await execa("./cli.js", [tempFolder]);
    // CLI will complain no files could be found
    t.match(stdOutContents.stdout, /no changelogs found/, "03.01");

    await execaCommand(`rm -rf ${path.resolve(path.resolve(), "../temp")}`);
  }
);

// Main unit tests
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${35}m${`functionality`}\u001b[${39}m`} - pointed directly at a file`,
  async (t) => {
    // 1. fetch us an empty, random, temporary folder:

    // Re-route the test files into `temp/` folder instead for easier access when
    // troubleshooting. Just comment out one of two:
    // const tempFolder = "temp";
    const tempFolder = tempy.directory();
    fs.ensureDirSync(path.resolve(tempFolder));

    // write a changelog:
    const processedFileContents = fs
      .writeFile(path.join(tempFolder, "changelog.md"), changelog1)
      .then(() =>
        execa(`cd ${tempFolder} && ${path.resolve()}/cli.js changelog.md`, {
          shell: true,
        })
      )
      .then((execasMsg) => {
        t.match(
          execasMsg.stdout,
          /1 updated/,
          "02.01.01 - prints a message that all went OK"
        );
        return fs.readFile(path.join(tempFolder, "changelog.md"), "utf8");
      })
      .then((received) =>
        execaCommand(`rm -rf ${tempFolder}`, {
          shell: true,
        }).then(() => received)
      );

    t.strictSame(await processedFileContents, changelog1Fixed, "04.01");
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`functionality`}\u001b[${39}m`} - globs, multiple written multiple skipped`,
  async (t) => {
    // 1. set up in which folder to write:
    // const tempFolder = "temp";
    const tempFolder = tempy.directory();

    // The temp folder needs subfolders. Those have to be in place before we start
    // writing the files:
    const foldersToCreate = [
      "fol1/fol11",
      "fol1/fol12",
      "fol2/fol21",
      "fol2/fol22",
      "fol3/fol31",
    ];

    foldersToCreate.forEach((p) => {
      fs.ensureDirSync(path.join(tempFolder, p));
    });

    // define files that will be written:
    const testFilePaths = [
      "fol1/fol11/changelog.md",
      "fol1/fol12/changelog.md",
      "fol2/fol21/changelog.md",
      "fol2/fol22/changelog.md",
      "fol3/changelog.md",
    ].map((p) => path.join(tempFolder, p));

    // 2. asynchronously write test files, all get the same messy changelog:
    await pMap(testFilePaths, (oneOfTestFilePaths) =>
      fs.writeFile(oneOfTestFilePaths, changelog1)
    )
      .then(() =>
        fs.writeFile(
          path.join(tempFolder, "fol3/fol31/changelog.md"), // <--- clean file
          changelog1Fixed
        )
      )
      .then(() =>
        execa(`cd ${tempFolder} && ${path.resolve()}/cli.js "**"`, {
          shell: true,
        })
      )
      .then((execasMsg) =>
        t.match(
          execasMsg.stdout,
          /5 updated, 1 skipped/,
          "02.02.01 - prints a message that all went OK"
        )
      )
      // .then(() => execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`))
      .then(() => execaCommand(`rm -rf ${tempFolder}`))
      .catch((err) => t.fail(err));
  }
);
