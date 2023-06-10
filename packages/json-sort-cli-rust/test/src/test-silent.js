import fs from "fs-extra";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa, execaCommand } from "execa";
import { temporaryDirectory } from "tempy";
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

test("01 - sort, -s (silent) mode", async () => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  fs.ensureDirSync(path.join(tempFolder, "test1"));
  fs.ensureDirSync(path.join(tempFolder, "test1/folder1"));
  fs.ensureDirSync(path.join(tempFolder, "test2"));

  // 2. asynchronously write all test files

  let processedFileContents = await pMap(
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
    .then(() => execa("./roast", [tempFolder, "--silent"]))
    .then(() => {
      // not.match(receivedStdOut.stdout, /OK/);
      // not.match(receivedStdOut.stdout, /sorted/);
      return pMap(testFilePaths, (oneOfPaths) =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      ).then((contentsArray) => {
        return pMap(contentsArray, (oneOfArrays) =>
          JSON.stringify(oneOfArrays, null, 2)
        );
      });
    })
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received)
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(processedFileContents, sortedTestFileContents, "01.01");
});

test.run();
