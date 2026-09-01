// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { execa, execaCommand } from "execa";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

// import pMap from "p-map";
// import pack from "../package.json";
// import {
//   testFileContents,
//   sortedTestFileContents,
//   testFilePaths,
//   sortedTabbedTestFileContents,
//   minifiedContents,
//   prettifiedContents,
// } from "./util/data.js";

// -----------------------------------------------------------------------------

test("01 - when asked, sorts arrays which contain only strings", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  let processedFileContents = writeFile(
    pathOfTheTestfile,
    JSON.stringify(["a", "A", "z", "Z", "m", "M"], null, 2),
  )
    .then(() => execa("./cli.js", [tempFolder, "-a", "sortme.json"]))
    .then(() => readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(
    await processedFileContents,
    `[
  "A",
  "M",
  "Z",
  "a",
  "m",
  "z"
]\n`,
    "01.01",
  );
});

test("02 - when not asked, does not sort arrays which contain only strings", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");
  let sourceArr = ["Z", "A", "z", "m", "M", "a"];

  let processedFileContents = writeFile(
    pathOfTheTestfile,
    JSON.stringify(sourceArr, null, 2),
  )
    .then(() => execa("./cli.js", [tempFolder, "sortme.json"]))
    .then(() => readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received),
    )
    .catch((err) => {
      throw new Error(err);
    });
  equal(
    await processedFileContents,
    `${JSON.stringify(sourceArr, null, 2)}\n`,
    "02.01",
  );
});

test("03 - array in deeper levels sorted (upon request)", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  let processedFileContents = writeFile(
    pathOfTheTestfile,
    JSON.stringify(
      {
        a: {
          b: [
            {
              c: "d",
            },
            ["z", "m", "A"],
          ],
        },
      },
      null,
      2,
    ),
  )
    .then(() => execa("./cli.js", [tempFolder, "-a", "sortme.json"]))
    .then(() => readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(
    await processedFileContents,
    `{
  "a": {
    "b": [
      {
        "c": "d"
      },
      [
        "A",
        "m",
        "z"
      ]
    ]
  }
}\n`,
    "03.01",
  );
});

test.run();
