/* eslint ava/prefer-async-await:0 */

import fs from "fs-extra";
import path from "path";
import test from "ava";
import execa from "execa";
// import tempy from "tempy";
import pMap from "p-map";
import pack from "../package.json";

// -----------------------------------------------------------------------------

// # Here's the test file/folder tree which will be temporary written:

// •
// ├── test1/
// │   ├── folder1/
// │   │   └── file3.json
// │   ├── file1.json
// │   ├── broken.json
// │   ├── .sneakyrc
// │   ├── .something.yml
// │   └── .somethinginyml
// ├── test2/
// │   └── file4.json
// └── file5.json

// File contents:
// -----------------------------------------------------------------------------

const testFileContents = [
  {
    // test1/file1.json
    b: "bbb1", // <------------ NOTICE THE ORDER OF THE KEYS IS NOT SORTED
    a: "aaa1",
    c: "ccc1"
  },
  {
    // test1/.sneakyrc
    c: "ccc2",
    b: "bbb2",
    a: "aaa2"
  },
  {
    // test1/folder1/file3.json
    d: "ddd3",
    c: "ccc3",
    b: "bbb3",
    a: "aaa3"
  },
  {
    // test2/file4.json
    a: "aaa4",
    c: [
      {
        z: "adasad",
        a: "sdfgdfgd",
        m: "dfgdfgdf"
      }
    ],
    b: "bbb4"
  },
  {
    // file5.json
    package: true
  }
];

const sortedTestFileContents = [
  // test1/file1.json
  `{
  "a": "aaa1",
  "b": "bbb1",
  "c": "ccc1"
}`,
  // test1/.sneakyrc
  `{
  "a": "aaa2",
  "b": "bbb2",
  "c": "ccc2"
}`,
  // test1/folder1/file3.json
  `{
  "a": "aaa3",
  "b": "bbb3",
  "c": "ccc3",
  "d": "ddd3"
}`,
  // test2/file4.json
  `{
  "a": "aaa4",
  "b": "bbb4",
  "c": [
    {
      "a": "sdfgdfgd",
      "m": "dfgdfgdf",
      "z": "adasad"
    }
  ]
}`,
  // file5.json
  `{
  "package": true
}`
];

const testFilePaths = [
  "test1/file1.json",
  "test1/.sneakyrc",
  "test1/folder1/file3.json",
  "test2/file4.json",
  "file5.json"
];

const sortedTabbedTestFileContents = [
  // test1/file1.json
  `{
\t"a": "aaa1",
\t"b": "bbb1",
\t"c": "ccc1"
}`,
  // test1/.sneakyrc - cheeky config file in JSON format
  `{
\t"a": "aaa2",
\t"b": "bbb2",
\t"c": "ccc2"
}`,
  // test1/folder1/file3.json
  `{
\t"a": "aaa3",
\t"b": "bbb3",
\t"c": "ccc3",
\t"d": "ddd3"
}`,
  // test2/file4.json
  `{
\t"a": "aaa4",
\t"b": "bbb4",
\t"c": [
\t\t{
\t\t\t"a": "sdfgdfgd",
\t\t\t"m": "dfgdfgdf",
\t\t\t"z": "adasad"
\t\t}
\t]
}`,
  // file5.json
  `{
\t"package": true
}`
];

// Finally, unit tests...
// -----------------------------------------------------------------------------

test("01.01 - default sort, called on the whole folder", async t => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = tempy.directory();
  const tempFolder = "temp";

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
    .then(() => execa("./cli.js", [tempFolder]))
    .then(() =>
      pMap(testFilePaths, oneOfPaths =>
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
    .catch(err => t.fail(err));

  t.deepEqual(await processedFileContents, sortedTestFileContents);
});

test.serial("01.02 - sort, -t (tabs) mode", async t => {
  // 1. fetch us an empty, random, temporary folder:
  // const tempFolder = tempy.directory();
  const tempFolder = "temp";
  // The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  fs.ensureDirSync(path.join(tempFolder, "test1"));
  fs.ensureDirSync(path.join(tempFolder, "test1/folder1"));
  fs.ensureDirSync(path.join(tempFolder, "test2"));

  // asynchronously write all test files

  const processedFileContents = pMap(
    testFilePaths,
    (oneOfTestFilePaths, testIndex) =>
      fs.writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        testFileContents[testIndex]
      )
  )
    .then(
      () => execa("./cli.js", ["-t", tempFolder]) // all test files have been written successfully, let's process them with our CLI
    )
    .then(() =>
      pMap(testFilePaths, oneOfPaths =>
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
    .catch(err => t.fail(err));

  t.deepEqual(await processedFileContents, sortedTabbedTestFileContents);
});

test.serial("01.03 - sort, there's a broken JSON among files", async t => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = tempy.directory();
  const tempFolder = "temp";

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
        path.join(tempFolder, "test1/.something.yml"), // - dotfile in yml with yml extension
        "foo:\n  bar"
      )
    )
    .then(() =>
      fs.writeFile(
        path.join(tempFolder, "test1/.somethinginyml"), // - dotfile in yml without yml extension
        "foo:\n  bar"
      )
    )
    .then(() =>
      fs.writeFile(path.join(tempFolder, "test1/broken.json"), '{a": "b"}\n')
    )
    .then(() => execa("./cli.js", [tempFolder]))
    .then(receivedStdOut => {
      t.regex(receivedStdOut.stdout, /broken\.json/);
      return pMap(testFilePaths, oneOfPaths =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      ).then(contentsArray => {
        return pMap(contentsArray, oneOfArrays =>
          JSON.stringify(oneOfArrays, null, 2)
        );
      });
    })
    .then(received =>
      execa
        .shell(`rm -rf ${path.join(__dirname, "../temp")}`)
        .then(() => received)
    )
    .catch(err => t.fail(err));

  t.deepEqual(await processedFileContents, sortedTestFileContents);
});

test.serial("01.04 - silent mode", async t => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = tempy.directory();
  const tempFolder = "temp";

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
        path.join(tempFolder, "test1/.something.yml"), // - dotfile in yml with yml extension
        "foo:\n  bar"
      )
    )
    .then(() =>
      fs.writeFile(
        path.join(tempFolder, "test1/.somethinginyml"), // - dotfile in yml without yml extension
        "foo:\n  bar"
      )
    )
    .then(() =>
      fs.writeFile(path.join(tempFolder, "test1/broken.json"), '{a": "b"}\n')
    )
    .then(() => execa("./cli.js", [tempFolder, "-s"]))
    .then(receivedStdOut => {
      t.regex(receivedStdOut.stdout, /5 files sorted/);
      t.notRegex(receivedStdOut.stdout, /OK/);
      return pMap(testFilePaths, oneOfPaths =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      ).then(contentsArray => {
        return pMap(contentsArray, oneOfArrays =>
          JSON.stringify(oneOfArrays, null, 2)
        );
      });
    })
    .then(received =>
      execa
        .shell(`rm -rf ${path.join(__dirname, "../temp")}`)
        .then(() => received)
    )
    .catch(err => t.fail(err));

  t.deepEqual(await processedFileContents, sortedTestFileContents);
});

test.serial("01.05 - version output mode", async t => {
  const reportedVersion1 = await execa("./cli.js", ["-v"]);
  t.is(reportedVersion1.stdout, pack.version);

  const reportedVersion2 = await execa("./cli.js", ["--version"]);
  t.is(reportedVersion2.stdout, pack.version);
});

test.serial("01.06 - help output mode", async t => {
  const reportedVersion1 = await execa("./cli.js", ["-h"]);
  t.regex(reportedVersion1.stdout, /Usage/);
  t.regex(reportedVersion1.stdout, /Options/);
  t.regex(reportedVersion1.stdout, /Example/);

  const reportedVersion2 = await execa("./cli.js", ["--help"]);
  t.regex(reportedVersion2.stdout, /Usage/);
  t.regex(reportedVersion2.stdout, /Options/);
  t.regex(reportedVersion2.stdout, /Example/);
});

test.serial("01.07 - no files found in the given directory", async t => {
  // fetch us a random temp folder
  // const tempFolder = tempy.directory();
  const tempFolder = "temp";

  // call execa on that empty folder
  const stdOutContents = await execa("./cli.js", [tempFolder]);
  // CLI will complain no files could be found
  t.regex(
    stdOutContents.stdout,
    /The inputs don't lead to any json files! Exiting./
  );
});
