// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

test("01 - unsorted package.json, targetting two folders simultaneously", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(path.join(tempFolder, "fol1")), { recursive: true });
  mkdirSync(path.resolve(path.join(tempFolder, "fol2")), { recursive: true });
  let pathOfTheTestfile1 = path.join(
    path.join(tempFolder, "fol1"),
    "package.json",
  );
  let pathOfTheTestfile2 = path.join(
    path.join(tempFolder, "fol2"),
    "package.json",
  );
  let contents = `{
  "dependencies": {
    "ast-monkey-traverse": "^1.11.31"
  },
  "name": "tester"
}`;

  writeFileSync(pathOfTheTestfile1, contents);
  writeFileSync(pathOfTheTestfile2, contents);

  await execa("./cli.js", [
    path.join(tempFolder, "fol1"),
    path.join(tempFolder, "fol2"),
  ]);

  let file1 = readFileSync(pathOfTheTestfile1, "utf8");
  let file2 = readFileSync(pathOfTheTestfile2, "utf8");

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });

  equal(
    file1,
    `{
  "name": "tester",
  "dependencies": {
    "ast-monkey-traverse": "^1.11.31"
  }
}\n`,
    "01.01",
  );

  equal(
    file2,
    `{
  "name": "tester",
  "dependencies": {
    "ast-monkey-traverse": "^1.11.31"
  }
}\n`,
    "01.02",
  );
});

test("02 - already sorted package.json", async () => {
  let tempFolder = temporaryDirectory();
  let source = `{
  "dependencies": {
    "ast-monkey-traverse": "^1.11.31"
  },
  "name": "tester"
}
`;
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, "package.json");

  let processedFileContents = writeFile(pathOfTheTestfile, source)
    .then(() => execa("./cli.js", [tempFolder, "-p", "package.json"]))
    .then(() => readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFileContents, source, "02.01");
});

test("03 - empty array as package.json", async () => {
  let tempFolder = temporaryDirectory();
  let source = "[]\n";
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, "package.json");

  let processedFileContents = writeFile(pathOfTheTestfile, source)
    .then(() => execa("./cli.js", [tempFolder]))
    .then(() => readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFileContents, source, "03.01");
});

test.run();
