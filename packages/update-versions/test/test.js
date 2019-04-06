/* eslint ava/prefer-async-await:0 */

import fs from "fs-extra";
import path from "path";
import test from "ava";
import execa from "execa";
import pMap from "p-map";
import pack from "../package.json";
import clone from "lodash.clonedeep";

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
  "package.json"
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
    commitizen: "^3.0.5",
    slfjdlkjglkdflgjdlkjljf: "^1.0.0",
    "cz-conventional-changelog": "^2.1.0",
    eslint: "^5.12.1",
    "eslint-config-prettier": "^3.6.0",
    "eslint-plugin-import": "^2.15.0",
    "eslint-plugin-no-unsanitized": "^3.0.2",
    "eslint-plugin-prettier": "^3.0.1",
    husky: "latest", // notice "latest" is not legal in Lerna
    lerna: "*", // notice glob flag asterisk
    prettier: "1.16.1" // notice there's no ^
  }
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
  rootPack
];

const test2FileContents = [packTest12Lib3, rootPack];

// Unit tests
// -----------------------------------------------------------------------------

test.serial("01 - monorepo", async t => {
  const tempFolder = "temp";

  // 1. The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  fs.ensureDirSync(path.join(tempFolder, "packages/lib1"));
  fs.ensureDirSync(path.join(tempFolder, "packages/lib2"));
  fs.ensureDirSync(path.join(tempFolder, "node_modules/lib3"));

  // 2. asynchronously write all test files

  await pMap(test1FilePaths, (oneOfTestFilePaths, testIndex) =>
    fs.writeJson(
      path.join(tempFolder, oneOfTestFilePaths),
      test1FileContents[testIndex],
      { spaces: 2 }
    )
  )
    .then(() =>
      execa.shell(`cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js`)
    )
    .then(received => {
      if (
        received &&
        received.stdout &&
        received.stdout.includes("FetchError")
      ) {
        t.fail("Internet is down");
      }
    })
    .then(() =>
      pMap(test1FilePaths, oneOfPaths =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      ).then(contentsArray => {
        return pMap(contentsArray, oneOfArrays =>
          JSON.stringify(oneOfArrays, null, 2)
        );
      })
    )
    .then(received =>
      execa
        .shell(`rm -rf ${path.join(__dirname, "../temp")}`)
        .then(() => received)
    )
    .then(contents => {
      // array comes in, but each JSON inside in unparsed and in string format:
      contents = contents.map(arr => JSON.parse(arr));

      // lib1:
      t.regex(contents[0].dependencies["check-types-mini"], /\^\d+\.\d+\.\d+/);
      t.regex(contents[0].devDependencies.husky, /\^\d+\.\d+\.\d+/);
      t.regex(contents[0].devDependencies.lerna, /\^\d+\.\d+\.\d+/);
      t.regex(contents[0].devDependencies.prettier, /\^\d+\.\d+\.\d+/);
      // lib2:
      t.regex(contents[1].dependencies["check-types-mini"], /\^\d+\.\d+\.\d+/);
      t.regex(contents[1].devDependencies.husky, /\^\d+\.\d+\.\d+/);
      t.regex(contents[1].devDependencies.lerna, /\^\d+\.\d+\.\d+/);
      t.regex(contents[1].devDependencies.prettier, /\^\d+\.\d+\.\d+/);

      // lib3 in node_modules should be intact:
      t.is(contents[2].dependencies["check-types-mini"], "*");
      t.is(contents[2].devDependencies.husky, "latest");
      t.is(contents[2].devDependencies.lerna, "*");
      t.is(contents[2].devDependencies.prettier, "1.16.1");

      // root package.json:
      // at the time of writing this, latest Detergent is 4.0.4. We set original
      // version in root as ^1.0.0, so check is, is the second digit greater than
      // or equal to 4.
      t.true(
        Number.parseInt(contents[3].dependencies.detergent.slice(1, 2)) >= 4
      );
    })
    .catch(err => t.fail(err));
});

test.serial("02 - normal repo", async t => {
  const tempFolder = "temp";

  // 1. create folders:
  fs.ensureDirSync(path.join(tempFolder, "node_modules/lib3"));

  // asynchronously write all test files

  await pMap(test2FilePaths, (oneOfTestFilePaths, testIndex) =>
    fs.writeJson(
      path.join(tempFolder, oneOfTestFilePaths),
      test2FileContents[testIndex],
      { spaces: 2 }
    )
  )
    .then(() =>
      execa.shell(`cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js`)
    )
    .then(received => {
      if (
        received &&
        received.stdout &&
        received.stdout.includes("FetchError")
      ) {
        t.fail("Internet is down");
      }
    })
    .then(() =>
      pMap(test2FilePaths, oneOfPaths =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      )
    )
    .then(contentsArray => {
      return pMap(contentsArray, oneOfArrays =>
        JSON.stringify(oneOfArrays, null, "\t")
      );
    })
    .then(received =>
      execa
        .shell(`rm -rf ${path.join(__dirname, "../temp")}`)
        .then(() => received)
    )
    .then(contents => {
      // array comes in, but each JSON inside in unparsed and in string format:
      contents = contents.map(arr => JSON.parse(arr));

      // node_modules/lib3/package.json:
      t.is(contents[0].dependencies["check-types-mini"], "*");
      t.is(contents[0].devDependencies.husky, "latest");
      t.is(contents[0].devDependencies.lerna, "*");
      t.is(contents[0].devDependencies.prettier, "1.16.1");

      // root package.json:
      t.regex(contents[1].dependencies.detergent, /\^\d+\.\d+\.\d+/);
      t.regex(contents[1].devDependencies.husky, /\^\d+\.\d+\.\d+/);
      t.regex(contents[1].devDependencies.lerna, /\^\d+\.\d+\.\d+/);
      t.regex(contents[1].devDependencies.prettier, /\^\d+\.\d+\.\d+/);
    })
    .catch(err => t.fail(err));
});

test.serial(
  "03 - deletes deps from devdeps if they are among normal deps",
  async t => {
    const tempFolder = "temp";

    // 0. We need to add redundant deps onto normal deps key in package.json:
    const tweakedContents = clone(test2FileContents);
    tweakedContents[1].dependencies.lerna = "*";
    // it will contain lerna on both deps and dev deps

    // 1. create folders:
    fs.ensureDirSync(path.join(tempFolder, "node_modules/lib3"));

    // asynchronously write all test files

    await pMap(test2FilePaths, (oneOfTestFilePaths, testIndex) =>
      fs.writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        tweakedContents[testIndex],
        { spaces: 2 }
      )
    )
      .then(() =>
        execa.shell(`cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js`)
      )
      .then(received => {
        if (
          received &&
          received.stdout &&
          received.stdout.includes("FetchError")
        ) {
          t.fail("Internet is down");
        }
      })
      .then(() =>
        pMap(test2FilePaths, oneOfPaths =>
          fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
        )
      )
      .then(contentsArray => {
        return pMap(contentsArray, oneOfArrays =>
          JSON.stringify(oneOfArrays, null, "\t")
        );
      })
      .then(received =>
        execa
          .shell(`rm -rf ${path.join(__dirname, "../temp")}`)
          .then(() => received)
      )
      .then(contents => {
        // array comes in, but each JSON inside in unparsed and in string format:
        contents = contents.map(arr => JSON.parse(arr));
        // root package.json devdeps should not contain the lerna:
        t.true(!Object.keys(contents[1].devDependencies).includes("lerna"));
      })
      .catch(err => t.fail(err));
  }
);

test.serial("91 - version output mode", async t => {
  const reportedVersion1 = await execa("./cli.js", ["-v"]);
  t.is(reportedVersion1.stdout, pack.version);

  const reportedVersion2 = await execa("./cli.js", ["--version"]);
  t.is(reportedVersion2.stdout, pack.version);
});

test.serial("91 - help output mode", async t => {
  const reportedVersion1 = await execa("./cli.js", ["-h"]);
  t.regex(reportedVersion1.stdout, /Usage/);
  t.regex(reportedVersion1.stdout, /Options/);

  const reportedVersion2 = await execa("./cli.js", ["--help"]);
  t.regex(reportedVersion2.stdout, /Usage/);
  t.regex(reportedVersion2.stdout, /Options/);
});

test.serial("93 - no files found in the given directory", async t => {
  const tempFolder = "temp";
  // create folder:
  fs.ensureDirSync(path.resolve(tempFolder));

  // call execa on that empty folder
  const stdOutContents = await execa.shell(
    `cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js`
  );
  // CLI should exit with a non-error code zero:
  t.is(stdOutContents.code, 0);

  // delete folder:
  await execa.shell(`rm -rf ${path.join(__dirname, "../temp")}`);
});
