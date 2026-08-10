// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync } from "node:fs";
import path from "node:path";
import { execa } from "execa";
import pMap from "p-map";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { readJson, writeJson } from "../json-file.js";

// import pack from "../package.json";
import {
  sortedTabbedTestFileContents,
  testFileContents,
  // sortedTestFileContents,
  testFilePaths,
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
  mkdirSync(path.join(tempFolder, "test1"), { recursive: true });
  mkdirSync(path.join(tempFolder, "test1/folder1"), { recursive: true });
  mkdirSync(path.join(tempFolder, "test2"), { recursive: true });

  // asynchronously write all test files

  let processedFileContents = pMap(
    testFilePaths,
    (oneOfTestFilePaths, testIndex) =>
      writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        testFileContents[testIndex],
      ),
  )
    .then(
      () => execa("./cli.js", ["-t", tempFolder]), // all test files have been written successfully, let's process them with our CLI
    )
    .then(() =>
      pMap(testFilePaths, (oneOfPaths) =>
        readJson(path.join(tempFolder, oneOfPaths), "utf8"),
      ),
    )
    .then((contentsArray) =>
      pMap(contentsArray, (oneOfArrays) =>
        JSON.stringify(oneOfArrays, null, "\t"),
      ),
    )
    .then((received) =>
      // execa(`rm -rf ${path.join(path.resolve(), "../temp")}`, { shell: true }).then(
      execa(`rm -rf ${tempFolder}`, { shell: true }).then(() => received),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFileContents, sortedTabbedTestFileContents, "01.01");
});

test.run();
