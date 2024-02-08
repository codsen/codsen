import { promises } from "fs";
import { ensureDirSync } from "fs-extra";
import writeFileAtomic from "write-file-atomic";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa, execaCommand } from "execa";
import { temporaryDirectory } from "tempy";
import pMap from "p-map";
import rfdc from "rfdc";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const clone = rfdc();

const require = createRequire(import.meta.url);
const pack = require("../package.json");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------------------------

// # Here's the test file/folder tree which will be written temporarily:

// Test #1. Monorepo.
// ==================

// •
// ├── packages/
// │   ├── lib1/
// │   │   └── package.json
// │   └── lib2/
// │       └── package.json
// ├── node_modules/
// │   └── lib3
// │       └── package.json
// └── package.json

// The point of the test is to make sure lib1/package.json and lib2/package.json
// are updated, but also that the node_modules/lib3/package.json is not touched.
// Also, the package.json in the root should be updated as well.

// Test #2. Single repo
// ====================

// •
// ├── node_modules/
// │   └── lib3
// │       └── package.json
// └── package.json

// In normal, single repo scenario, package.json in the root should be updated
// but also that node_modules/lib1/package.json should not be touched.

const test1FilePaths = [
  "packages/lib1/package.json",
  "packages/lib2/package.json",
  "node_modules/lib3/package.json",
  "package.json",
];

const test2FilePaths = ["node_modules/lib3/package.json", "package.json"];

// Contents
// -----------------------------------------------------------------------------

const packBefore = {
  name: "codsen-monorepo",
  version: "0.0.0-ignore",
  description: "Monorepo of all our npm libraries",
  dependencies: {},
  devDependencies: {
    "@pectin/cli": "^3.0.1",
    commitizen: "*", // notice glob flag asterisk
    slfjdlkjglkdflgjdlkjljf: "^1.0.0",
    "cz-conventional-changelog": "workspace:^2.1.0",
    eslint: "^5.12.1",
    "eslint-config-prettier": "^3.6.0",
    "eslint-plugin-import": "^2.15.0",
    "eslint-plugin-no-unsanitized": "^3.0.2",
    "eslint-plugin-prettier": "^3.0.1",
    husky: "latest", // notice "latest" is not legal in Lerna
    prettier: "1.16.1", // notice there's no ^
  },
};

// test1: packages/lib1/package.json
const packTest1Lib1 = clone(packBefore);
packTest1Lib1.dependencies["check-types-mini"] = "^4.0.0";

// test1: packages/lib2/package.json
const packTest1Lib2 = clone(packBefore);
packTest1Lib2.dependencies["check-types-mini"] = "latest";

// test1/test2: node_modules/lib3/package.json
const packTest12Lib3 = clone(packBefore);
packTest12Lib3.dependencies["check-types-mini"] = "*";

// test1/test2: ./package.json (root)
const rootPack = clone(packBefore);
rootPack.dependencies.detergent = "^1.0.0";

// !IMPORTANT!
// array below coordinates with array "test1FilePaths" / "test2FilePaths"
const test1FileContents = [
  packTest1Lib1,
  packTest1Lib2,
  packTest12Lib3,
  rootPack,
];

const test2FileContents = [packTest12Lib3, rootPack];

// Unit tests
// -----------------------------------------------------------------------------

test("01 - monorepo", async () => {
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();

  // 1. The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  ensureDirSync(path.join(tempFolder, "packages/lib1"));
  ensureDirSync(path.join(tempFolder, "packages/lib2"));
  ensureDirSync(path.join(tempFolder, "node_modules/lib3"));

  // 2. asynchronously write all test files

  await pMap(test1FilePaths, (oneOfTestFilePaths, testIndex) =>
    writeFileAtomic(
      path.join(tempFolder, oneOfTestFilePaths),
      JSON.stringify(test1FileContents[testIndex], null, 2),
    ),
  )
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")}`, {
        shell: true,
      }),
    )
    .then((received) => {
      if (
        received &&
        received.stdout &&
        received.stdout.includes("FetchError")
      ) {
        not.ok("Internet is down");
      }
    })
    .then(() =>
      pMap(test1FilePaths, (oneOfPaths) =>
        promises.readFile(path.join(tempFolder, oneOfPaths), "utf8"),
      ),
    )
    // .then(received =>
    //   execa(`rm -rf ${path.join(__dirname, "../temp")}`, { shell: true }).then(
    //     () => received
    //   )
    // )
    .then((receivedContents) => {
      // array comes in, but each JSON inside in unparsed and in string format:
      let contents = receivedContents.map((arr) => JSON.parse(arr));

      // lib1:
      match(contents[0].dependencies["check-types-mini"], /\^\d+\.\d+\.\d+/);
      match(contents[0].devDependencies.husky, /\^\d+\.\d+\.\d+/);
      match(contents[0].devDependencies.commitizen, /\^\d+\.\d+\.\d+/);
      match(contents[0].devDependencies.prettier, /\^\d+\.\d+\.\d+/);
      // lib2:
      match(contents[1].dependencies["check-types-mini"], /\^\d+\.\d+\.\d+/);
      match(contents[1].devDependencies.husky, /\^\d+\.\d+\.\d+/);
      match(contents[1].devDependencies.commitizen, /\^\d+\.\d+\.\d+/);
      match(contents[1].devDependencies.prettier, /\^\d+\.\d+\.\d+/);

      // workspace: should be retained
      match(
        contents[1].devDependencies["cz-conventional-changelog"],
        /workspace:\^\d+\.\d+\.\d+/,
      );

      // lib3 in node_modules should be intact:
      equal(contents[2].dependencies["check-types-mini"], "*");
      equal(contents[2].devDependencies.husky, "latest");
      equal(contents[2].devDependencies.commitizen, "*");
      equal(contents[2].devDependencies.prettier, "1.16.1");

      // root package.json:
      // at the time of writing this, latest Detergent is 4.0.4. We set original
      // version in root as ^1.0.0, so check is, is the second digit greater than
      // or equal to 4.
      ok(
        Number.parseInt(contents[3].dependencies.detergent.slice(1, 2), 10) >=
          4,
      );
    })
    .catch((err) => {
      throw new Error(err);
    });
});

test("02 - normal repo", async () => {
  let tempFolder = temporaryDirectory();

  // 1. create folders:
  ensureDirSync(path.join(tempFolder, "node_modules/lib3"));

  // asynchronously write all test files

  await pMap(test2FilePaths, (oneOfTestFilePaths, testIndex) =>
    writeFileAtomic(
      path.join(tempFolder, oneOfTestFilePaths),
      JSON.stringify(test2FileContents[testIndex], null, 2),
    ),
  )
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")}`, {
        shell: true,
      }),
    )
    .then((received) => {
      if (
        received &&
        received.stdout &&
        received.stdout.includes("FetchError")
      ) {
        not.ok("Internet is down");
      }
    })
    .then(() =>
      pMap(test2FilePaths, (oneOfPaths) =>
        promises.readFile(path.join(tempFolder, oneOfPaths), "utf8"),
      ),
    )
    .then((received) =>
      execa(`rm -rf ${path.join(__dirname, "../temp")}`, { shell: true }).then(
        () => received,
      ),
    )
    .then((incomingContents) => {
      // array comes in, but each JSON inside in unparsed and in string format:
      let contents = incomingContents.map((arr) => JSON.parse(arr));

      // node_modules/lib3/package.json:
      equal(contents[0].dependencies["check-types-mini"], "*");
      equal(contents[0].devDependencies.husky, "latest");
      equal(contents[0].devDependencies.commitizen, "*");
      equal(contents[0].devDependencies.prettier, "1.16.1");

      // root package.json:
      match(contents[1].dependencies.detergent, /\^\d+\.\d+\.\d+/);
      match(contents[1].devDependencies.husky, /\^\d+\.\d+\.\d+/);
      match(contents[1].devDependencies.commitizen, /\^\d+\.\d+\.\d+/);
      match(contents[1].devDependencies.prettier, /\^\d+\.\d+\.\d+/);
    })
    .catch((err) => {
      throw new Error(err);
    });
});

test("03 - deletes deps from dev-deps if they are among normal deps", async () => {
  let tempFolder = temporaryDirectory();

  // 0. We need to add redundant deps onto normal deps key in package.json:
  let tweakedContents = clone(test2FileContents);
  tweakedContents[1].dependencies.commitizen = "*";
  // it will contain commitizen on both deps and dev deps

  // 1. create folders:
  ensureDirSync(path.join(tempFolder, "node_modules/lib3"));

  // asynchronously write all test files

  await pMap(test2FilePaths, (oneOfTestFilePaths, testIndex) =>
    writeFileAtomic(
      path.join(tempFolder, oneOfTestFilePaths),
      JSON.stringify(tweakedContents[testIndex], null, 2),
    ),
  )
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")}`, {
        shell: true,
      }),
    )
    .then((received) => {
      if (
        received &&
        received.stdout &&
        received.stdout.includes("FetchError")
      ) {
        not.ok("Internet is down");
      }
    })
    .then(() =>
      pMap(test2FilePaths, (oneOfPaths) =>
        promises.readFile(path.join(tempFolder, oneOfPaths), "utf8"),
      ),
    )
    .then((received) =>
      execa(`rm -rf ${path.join(__dirname, "../temp")}`, {
        shell: true,
      }).then(() => received),
    )
    .then((incomingContents) => {
      // array comes in, but each JSON inside in unparsed and in string format:
      let contents = incomingContents.map((arr) => JSON.parse(arr));
      // root package.json dev-deps should not contain the commitizen:
      ok(!Object.keys(contents[1].devDependencies).includes("commitizen"));
    })
    .catch((err) => {
      throw new Error(err);
    });
});

test("04 - version output mode", async () => {
  let reportedVersion1 = await execa("./cli.js", ["-v"]);
  equal(reportedVersion1.stdout, pack.version, "04.01");

  let reportedVersion2 = await execa("./cli.js", ["--version"]);
  equal(reportedVersion2.stdout, pack.version, "04.02");
});

test("05 - help output mode", async () => {
  let reportedVersion1 = await execa("./cli.js", ["-h"]);
  match(reportedVersion1.stdout, /Usage/, "05.01");
  match(reportedVersion1.stdout, /Options/, "05.02");

  let reportedVersion2 = await execa("./cli.js", ["--help"]);
  match(reportedVersion2.stdout, /Usage/, "05.03");
  match(reportedVersion2.stdout, /Options/, "05.04");
});

test("06 - no files found in the given directory", async () => {
  let tempFolder = temporaryDirectory();
  // create folder:
  ensureDirSync(path.resolve(tempFolder));

  // call execa on that empty folder
  let stdOutContents = await execa(
    `cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")}`,
    { shell: true },
  );

  // CLI should exit with a non-error code zero:
  equal(stdOutContents.exitCode, 0, "06.01");

  // delete folder:
  await execaCommand(`rm -rf ${path.join(__dirname, "../temp")}`);
});

test.run();
