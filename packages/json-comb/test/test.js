import fs from "fs-extra";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";
import pMap from "p-map";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pack = require("../package.json");

// File contents:
// -----------------------------------------------------------------------------

const testFileContents = [
  {
    // test1/file1.json
    a: "aaa1",
    c: [
      {
        x: "xxx1",
      },
      {
        y: "yyy1",
      },
    ],
  },
  {
    // test1/folder1/file2.json
    b: "bbb2",
    a: "aaa2",
  },
  {
    // test2/file3.json
    c: [
      {
        z: "zzz3",
        x: "xxx3",
        y: "yyy3",
      },
    ],
    b: "bbb3",
  },
  {
    // file4.json
    a: "aaa4",
  },
];

const normalisedFileContents = [
  `{
  "a": "aaa1",
  "b": false,
  "c": [
    {
      "x": "xxx1",
      "y": false,
      "z": false
    },
    {
      "x": false,
      "y": "yyy1",
      "z": false
    }
  ]
}\n`,
  `{
  "a": "aaa2",
  "b": "bbb2",
  "c": [
    {
      "x": false,
      "y": false,
      "z": false
    }
  ]
}\n`,
  `{
  "a": false,
  "b": "bbb3",
  "c": [
    {
      "x": "xxx3",
      "y": "yyy3",
      "z": "zzz3"
    }
  ]
}\n`,
  `{
  "a": "aaa4",
  "b": false,
  "c": [
    {
      "x": false,
      "y": false,
      "z": false
    }
  ]
}\n`,
];

const testFilePaths = [
  "test1/file1.json",
  "test1/folder1/file2.json",
  "test2/file3.json",
  "file4.json",
];

// Finally, unit tests...
// -----------------------------------------------------------------------------

test("01 - version output mode", async () => {
  let reportedVersion1 = await execa("./cli.js", ["-v"]);
  equal(reportedVersion1.stdout, pack.version, "01.01");

  let reportedVersion2 = await execa("./cli.js", ["--version"]);
  equal(reportedVersion2.stdout, pack.version, "01.02");
});

test("02 - help output mode", async () => {
  let reportedVersion1 = await execa("./cli.js", ["-h"]);
  match(reportedVersion1.stdout, /Usage/g, "02.01");
  match(reportedVersion1.stdout, /Options/g, "02.02");

  let reportedVersion2 = await execa("./cli.js", ["--help"]);
  match(reportedVersion2.stdout, /Usage/g, "02.03");
  match(reportedVersion2.stdout, /Options/g, "02.04");
});

test("03 - no files found in the given directory [ID_1]", async () => {
  // fetch us a random temp folder
  let tempFolder = temporaryDirectory();
  // call execa on that empty folder
  let stdOutContents = await execa("./cli.js", [tempFolder]);
  // CLI will complain no files could be found
  match(stdOutContents.stdout, /Nothing found!/g, "03.01");
  match(stdOutContents.stdout, /ID_1/g, "03.02");
});

test("04 - normalisation, called on the directory with subdirectories", async () => {
  // 1. fetch us an empty, random, temporary folder:

  // 1.1 For debug purposes, you can temporarily  re-route the test files into
  // `temp/` folder instead for easier access. Just comment either one of two lines:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // ---------------------------------------------------------------------------

  // The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  fs.ensureDirSync(path.join(tempFolder, "test1"));
  fs.ensureDirSync(path.join(tempFolder, "test1/folder1"));
  fs.ensureDirSync(path.join(tempFolder, "test2"));

  // 2. asynchronously write all test files

  let processedFileContents = pMap(
    testFilePaths,
    (oneOfTestFilePaths, testIndex) =>
      fs.writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        testFileContents[testIndex],
      ),
  )
    .then(() =>
      fs.writeFile(
        path.join(tempFolder, "test1/.something.yml"), //  - dotfile in yml with yml extension
        "foo:\n  bar",
      ),
    )
    .then(() =>
      fs.writeFile(
        path.join(tempFolder, "test1/.somethinginyml"), // - dotfile in yml without yml extension
        "foo:\n  bar",
      ),
    )
    .then(() => execa("./cli.js", ["-n", tempFolder]))
    .then(() =>
      pMap(testFilePaths, (oneOfPaths) =>
        fs.readFile(path.join(tempFolder, oneOfPaths), "utf8"),
      ),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFileContents, normalisedFileContents, "04.01");
});

test("05 - normalisation stops if one file is given [ID_2]", async () => {
  // fetch us a random temp folder
  // const tempFolder = "temp";
  // fs.ensureDirSync(path.join(tempFolder));
  let tempFolder = temporaryDirectory();

  let stdOutContents = await fs
    .writeJson(path.join(tempFolder, "data.json"), {
      a: "b",
      c: "d",
    })
    .then(() => execa("./cli.js", ["--normalise", tempFolder]))
    .catch((err) => {
      throw new Error(err);
    });

  // CLI will complain no files could be found
  match(stdOutContents.stdout, /ID_2/g, "05.01");
});

// tap.todo("01.05 - sort, there's a broken JSON among files");

test.run();
