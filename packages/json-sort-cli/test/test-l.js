import fs from "fs-extra";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa, execaCommand } from "execa";
import { temporaryDirectory } from "tempy";
// import pMap from "p-map";

// import pack from "../package.json";
// import {
//   testFileContents,
//   sortedTestFileContents,
//   testFilePaths,
// sortedTabbedTestFileContents,
//   minifiedContents,
//   prettifiedContents,
// } from "./util/data.js";

// -----------------------------------------------------------------------------

test("01 - array, CRLF line endings, no setting", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestFile = path.join(tempFolder, "sortme.json");

  let processedFileContents = fs
    .writeFile(
      pathOfTheTestFile,
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
      ).replace(/\n/g, "\r\n")
    )
    .then(() => execa("./cli.js", [tempFolder, "sortme.json"]))
    .then(() => fs.readFile(pathOfTheTestFile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received)
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(
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
]\n`.replace(/\n/g, "\r\n"),
    "01.01"
  );
});

test("02 - CRLF in, CR out", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  let processedFileContents = fs
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
      ).replace(/\n/g, "\r\n")
    )
    .then(() => execa("./cli.js", [tempFolder, "sortme.json", "-l", "cr"]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received)
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(
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
]\n`.replace(/\n/g, "\r"),
    "02.01"
  );
});

test.run();
