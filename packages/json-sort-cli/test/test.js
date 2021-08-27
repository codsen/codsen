import fs from "fs-extra";
import path from "path";
import tap from "tap";
import execa from "execa";
import tempy from "tempy";
import pMap from "p-map";
// import pack from "../package.json";
import {
  testFileContents,
  sortedTestFileContents,
  testFilePaths,
  // sortedTabbedTestFileContents,
  minifiedContents,
  prettifiedContents,
} from "./util/data.js";

// -----------------------------------------------------------------------------

tap.test("01 - default sort, called on the whole folder", async (t) => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

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
      pMap(testFilePaths, (oneOfPaths) =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      ).then((contentsArray) => {
        return pMap(contentsArray, (oneOfArrays) =>
          JSON.stringify(oneOfArrays, null, 2)
        );
      })
    )
    .then((received) =>
      execa
        // .command(`rm -rf ${path.join(path.resolve(), "../temp")}`)
        .command(`rm -rf ${tempFolder}`)
        .then(() => received)
    )
    .catch((err) => t.fail(err));

  t.strictSame(await processedFileContents, sortedTestFileContents, "01");
  t.end();
});

tap.test("02 - sort, there's a broken JSON among files", async (t) => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

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
    .then((receivedStdOut) => {
      t.match(receivedStdOut.stdout, /broken\.json/);
      return pMap(testFilePaths, (oneOfPaths) =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      ).then((contentsArray) => {
        return pMap(contentsArray, (oneOfArrays) =>
          JSON.stringify(oneOfArrays, null, 2)
        );
      });
    })
    .then((received) =>
      execa
        // .command(`rm -rf ${path.join(path.resolve(), "../temp")}`)
        .command(`rm -rf ${tempFolder}`)
        .then(() => received)
    )
    .catch((err) => t.fail(err));

  t.strictSame(await processedFileContents, sortedTestFileContents, "02");
  t.end();
});

tap.test("03 - fixes minified dotfiles in JSON format", async (t) => {
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTheTestfile = path.join(tempFolder, ".eslintrc.json");

  const processedFileContents = fs
    .writeFile(pathOfTheTestfile, minifiedContents)
    .then(() => execa("./cli.js", [tempFolder, ".eslintrc.json"]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      execa
        // .command(`rm -rf ${path.join(path.resolve(), "../temp")}`)
        .command(`rm -rf ${tempFolder}`)
        .then(() => received)
    )
    .catch((err) => t.fail(err));

  t.strictSame(await processedFileContents, prettifiedContents, "03");
  t.end();
});

tap.test("04 - topmost level is array", async (t) => {
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  const processedFileContents = fs
    .writeFile(
      pathOfTheTestfile,
      JSON.stringify(
        [
          {
            x: "y",
            a: "b",
          },
          {
            p: "r",
            c: "d",
          },
        ],
        null,
        2
      )
    )
    .then(() => execa("./cli.js", [tempFolder, "sortme.json"]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      execa
        // .command(`rm -rf ${path.join(path.resolve(), "../temp")}`)
        .command(`rm -rf ${tempFolder}`)
        .then(() => received)
    )
    .catch((err) => t.fail(err));

  t.strictSame(
    await processedFileContents,
    `[
  {
    "a": "b",
    "x": "y"
  },
  {
    "c": "d",
    "p": "r"
  }
]\n`,
    "04"
  );
  t.end();
});

tap.test("05 - no files found in the given directory", async (t) => {
  // fetch us a random temp folder
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // call execa on that empty folder
  const stdOutContents = await execa("./cli.js", [tempFolder]);
  // CLI will complain no files could be found
  t.match(
    stdOutContents.stdout,
    /The inputs don't lead to any json files! Exiting./,
    "05"
  );
  t.end();
});
