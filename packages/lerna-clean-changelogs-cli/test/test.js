// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { execa, execaCommand } from "execa";
import pMap from "p-map";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

const require2 = createRequire(import.meta.url);
const pack = require2("../package.json");

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

test(`01 - general parts - version output mode`, async () => {
  let reportedVersion1 = await execa("./cli.js", ["-v"]);
  equal(reportedVersion1.stdout, pack.version, "01.01");

  let reportedVersion2 = await execa("./cli.js", ["--version"]);
  equal(reportedVersion2.stdout, pack.version, "01.02");
});

test(`02 - general parts - help output mode`, async () => {
  let reportedVersion1 = await execa("./cli.js", ["-h"]);
  match(reportedVersion1.stdout, /Usage/, "02.01");
  match(reportedVersion1.stdout, /Options/, "02.02");

  let reportedVersion2 = await execa("./cli.js", ["--help"]);
  match(reportedVersion2.stdout, /Usage/, "02.03");
  match(reportedVersion2.stdout, /Options/, "02.04");
});

test(`03 - general parts - no files found in the given directory`, async () => {
  // fetch us a random temp folder
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  mkdirSync(path.resolve(tempFolder), { recursive: true });

  // call execa on that empty folder
  let stdOutContents = await execa("./cli.js", [tempFolder]);
  // CLI will complain no files could be found
  match(stdOutContents.stdout, /no changelogs found/, "03.01");

  await execaCommand(`rm -rf ${path.resolve(path.resolve(), "../temp")}`);
});

// Main unit tests
// -----------------------------------------------------------------------------

test(`04 - functionality - pointed directly at a file`, async () => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  mkdirSync(path.resolve(tempFolder), { recursive: true });

  // write a changelog:
  let processedFileContents = writeFile(
    path.join(tempFolder, "changelog.md"),
    changelog1,
  )
    .then(() =>
      execa(`cd ${tempFolder} && ${path.resolve()}/cli.js changelog.md`, {
        shell: true,
      }),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /1 updated/, "04.01");
      return readFile(path.join(tempFolder, "changelog.md"), "utf8");
    })
    .then((received) =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }).then(() => received),
    );

  equal(await processedFileContents, changelog1Fixed, "04.02");
});

test(`05 - functionality - globs, multiple written multiple skipped`, async () => {
  // 1. set up in which folder to write:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();

  // The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  let foldersToCreate = [
    "fol1/fol11",
    "fol1/fol12",
    "fol2/fol21",
    "fol2/fol22",
    "fol3/fol31",
  ];

  foldersToCreate.forEach((p) => {
    mkdirSync(path.join(tempFolder, p), { recursive: true });
  });

  // define files that will be written:
  let testFilePaths = [
    "fol1/fol11/changelog.md",
    "fol1/fol12/changelog.md",
    "fol2/fol21/changelog.md",
    "fol2/fol22/changelog.md",
    "fol3/changelog.md",
  ].map((p) => path.join(tempFolder, p));

  // 2. asynchronously write test files, all get the same messy changelog:
  await pMap(testFilePaths, (oneOfTestFilePaths) =>
    writeFile(oneOfTestFilePaths, changelog1),
  )
    .then(() =>
      writeFile(
        path.join(tempFolder, "fol3/fol31/changelog.md"), // <--- clean file
        changelog1Fixed,
      ),
    )
    .then(() =>
      execa(`cd ${tempFolder} && ${path.resolve()}/cli.js "**"`, {
        shell: true,
      }),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /5 updated, 1 skipped/, "05.01");
    })
    // .then(() => execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`))
    .then(() => execaCommand(`rm -rf ${tempFolder}`))
    .catch((err) => {
      throw new Error(err);
    });
});

test.run();
