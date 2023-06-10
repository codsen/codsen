import fs from "fs-extra";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";
import pMap from "p-map";

// import pack from "../package.json";
import {
  testFileContents,
  // sortedTestFileContents,
  testFilePaths,
  sortedTabbedTestFileContents,
  // minifiedContents,
  // prettifiedContents,
} from "./util/data.js";

// -----------------------------------------------------------------------------

test("01 - sort, -t (tabs) mode", async () => {
  // 1. fetch us an empty, random, temporary folder:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  // The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  fs.ensureDirSync(path.join(tempFolder, "test1"));
  fs.ensureDirSync(path.join(tempFolder, "test1/folder1"));
  fs.ensureDirSync(path.join(tempFolder, "test2"));

  // asynchronously write all test files

  let processedFileContents = pMap(
    testFilePaths,
    (oneOfTestFilePaths, testIndex) =>
      fs.writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        testFileContents[testIndex]
      )
  )
    .then(
      () => execa("./roast", [tempFolder]) // all test files have been written successfully, let's process them with our CLI
    )
    .then(() =>
      pMap(testFilePaths, (oneOfPaths) =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      )
    )
    .then((contentsArray) =>
      pMap(contentsArray, (oneOfArrays) =>
        JSON.stringify(oneOfArrays, null, "\t")
      )
    )
    .then((received) =>
      // execa(`rm -rf ${path.join(path.resolve(), "../temp")}`, { shell: true }).then(
      execa(`rm -rf ${tempFolder}`, { shell: true }).then(() => received)
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFileContents, sortedTabbedTestFileContents, "01.01");
});

test.run();
