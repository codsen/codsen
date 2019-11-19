import fs from "fs-extra";
import path from "path";
import test from "ava";
import execa from "execa";
import tempy from "tempy";
import pMap from "p-map";
import pack from "../package";

// File contents:
// -----------------------------------------------------------------------------

const testFileContents = [
  {
    // test1/file1.json
    a: "aaa1",
    c: [
      {
        x: "xxx1"
      },
      {
        y: "yyy1"
      }
    ]
  },
  {
    // test1/folder1/file2.json
    b: "bbb2",
    a: "aaa2"
  },
  {
    // test2/file3.json
    c: [
      {
        z: "zzz3",
        x: "xxx3",
        y: "yyy3"
      }
    ],
    b: "bbb3"
  },
  {
    // file4.json
    a: "aaa4"
  }
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
}\n`
];

const testFilePaths = [
  "test1/file1.json",
  "test1/folder1/file2.json",
  "test2/file3.json",
  "file4.json"
];

// Finally, unit tests...
// -----------------------------------------------------------------------------

test.serial("01.01 - version output mode", async t => {
  const reportedVersion1 = await execa("./cli.js", ["-v"]);
  t.is(reportedVersion1.stdout, pack.version);

  const reportedVersion2 = await execa("./cli.js", ["--version"]);
  t.is(reportedVersion2.stdout, pack.version);
});

test.serial("01.02 - help output mode", async t => {
  const reportedVersion1 = await execa("./cli.js", ["-h"]);
  t.regex(reportedVersion1.stdout, /Usage/);
  t.regex(reportedVersion1.stdout, /Options/);

  const reportedVersion2 = await execa("./cli.js", ["--help"]);
  t.regex(reportedVersion2.stdout, /Usage/);
  t.regex(reportedVersion2.stdout, /Options/);
});

test.serial("01.03 - no files found in the given directory [ID_1]", async t => {
  // fetch us a random temp folder
  const tempFolder = tempy.directory();
  // call execa on that empty folder
  const stdOutContents = await execa("./cli.js", [tempFolder]);
  // CLI will complain no files could be found
  t.regex(stdOutContents.stdout, /Nothing found!/);
  t.regex(stdOutContents.stdout, /ID_1/);
});

test.serial(
  "01.04 - normalisation, called on the directory with subdirectories",
  async t => {
    // 1. fetch us an empty, random, temporary folder:

    // 1.1 For debug purposes, you can temporarily  re-route the test files into
    // `temp/` folder instead for easier access. Just comment either one of two lines:
    const tempFolder = tempy.directory();
    // const tempFolder = "temp";

    // ---------------------------------------------------------------------------

    // The temp folder needs subfolders. Those have to be in place before we start
    // writing the files:
    fs.ensureDirSync(path.join(tempFolder, "test1"));
    fs.ensureDirSync(path.join(tempFolder, "test1/folder1"));
    fs.ensureDirSync(path.join(tempFolder, "test2"));

    // 2. asynchronously write all test files

    const processedFileContents = pMap(
      testFilePaths,
      (oneOfTestFilePaths, testIndex) =>
        fs.writeJson(
          path.join(tempFolder, oneOfTestFilePaths),
          testFileContents[testIndex]
        )
    )
      .then(() =>
        fs.writeFile(
          path.join(tempFolder, "test1/.something.yml"), //  - dotfile in yml with yml extension
          "foo:\n  bar"
        )
      )
      .then(() =>
        fs.writeFile(
          path.join(tempFolder, "test1/.somethinginyml"), // - dotfile in yml without yml extension
          "foo:\n  bar"
        )
      )
      .then(() => execa("./cli.js", ["-n", tempFolder]))
      .then(() =>
        pMap(testFilePaths, oneOfPaths =>
          fs.readFile(path.join(tempFolder, oneOfPaths), "utf8")
        )
      )
      .catch(err => t.fail(err));

    t.deepEqual(await processedFileContents, normalisedFileContents);
  }
);

test.serial(
  "01.05 - normalisation stops if one file is given [ID_2]",
  async t => {
    // fetch us a random temp folder
    // const tempFolder = "temp";
    // fs.ensureDirSync(path.join(tempFolder));
    const tempFolder = tempy.directory();

    const stdOutContents = await fs
      .writeJson(path.join(tempFolder, "data.json"), {
        a: "b",
        c: "d"
      })
      .then(() => execa("./cli.js", ["--normalise", tempFolder]))
      .catch(err => t.fail(err));

    // CLI will complain no files could be found
    t.regex(stdOutContents.stdout, /ID_2/);
  }
);

// test.todo("01.05 - sort, there's a broken JSON among files");
