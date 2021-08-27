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
  // minifiedContents,
  // prettifiedContents,
} from "./util/data.js";

// -----------------------------------------------------------------------------

tap.test("01 - sort, -s (silent) mode", async (t) => {
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

  const processedFileContents = await pMap(
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
    .then(() => {
      // t.notMatch(receivedStdOut.stdout, /OK/);
      // t.notMatch(receivedStdOut.stdout, /sorted/);
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

  t.strictSame(processedFileContents, sortedTestFileContents, "01");
  t.end();
});
