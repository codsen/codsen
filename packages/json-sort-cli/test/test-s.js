// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { execa, execaCommand } from "execa";
import pMap from "p-map";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { readJson, writeJson } from "../json-file.js";

// import pack from "../package.json";
import {
  sortedTestFileContents,
  testFileContents,
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
  mkdirSync(path.join(tempFolder, "test1"), { recursive: true });
  mkdirSync(path.join(tempFolder, "test1/folder1"), { recursive: true });
  mkdirSync(path.join(tempFolder, "test2"), { recursive: true });

  // 2. asynchronously write all test files

  let processedFileContents = await pMap(
    testFilePaths,
    (oneOfTestFilePaths, testIndex) =>
      writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        testFileContents[testIndex],
      ),
  )
    .then(() =>
      writeFile(
        path.join(tempFolder, "test1/.something.yml"), // - dotfile in yml with yml extension
        "foo:\n  bar",
      ),
    )
    .then(() =>
      writeFile(
        path.join(tempFolder, "test1/.somethinginyml"), // - dotfile in yml without yml extension
        "foo:\n  bar",
      ),
    )
    .then(() =>
      writeFile(path.join(tempFolder, "test1/broken.json"), '{a": "b"}\n'),
    )
    .then(() => execa("./cli.js", [tempFolder, "-s"]))
    .then(() => {
      // not.match(receivedStdOut.stdout, /OK/);
      // not.match(receivedStdOut.stdout, /sorted/);
      return pMap(testFilePaths, (oneOfPaths) =>
        readJson(path.join(tempFolder, oneOfPaths), "utf8"),
      ).then((contentsArray) => {
        return pMap(contentsArray, (oneOfArrays) =>
          JSON.stringify(oneOfArrays, null, 2),
        );
      });
    })
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(processedFileContents, sortedTestFileContents, "01.01");
});

test.run();
