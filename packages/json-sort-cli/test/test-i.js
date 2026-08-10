// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

test("01 - indentationCount set to 3, spaces", async () => {
  let originalContents = '{\n  "z": 1,\n  "a": 2\n}\n';
  let sortedContents = '{\n   "a": 2,\n   "z": 1\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTestFile = path.join(tempFolder, "sortme.json");

  writeFileSync(pathOfTestFile, originalContents);

  await execa("./cli.js", [tempFolder, "-i 3"]).catch((err) => {
    throw new Error(err);
  });

  equal(readFileSync(pathOfTestFile, "utf8"), sortedContents, "01.01");

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });
});

test("02 - indentationCount set to 3, tabs", async () => {
  let originalContents = '{\n  "z": 1,\n  "a": 2\n}\n';
  let sortedContents = '{\n\t\t\t"a": 2,\n\t\t\t"z": 1\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTestFile = path.join(tempFolder, "sortme.json");

  writeFileSync(pathOfTestFile, originalContents);

  await execa("./cli.js", [tempFolder, "-i 3", "-t"]).catch((err) => {
    throw new Error(err);
  });

  equal(readFileSync(pathOfTestFile, "utf8"), sortedContents, "02.01");

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });
});

test("03 - indentationCount set to 3, tabs, array", async () => {
  let originalContents = '[\n  "z",\n  "a"\n]\n';
  let sortedContents = '[\n\t\t\t"a",\n\t\t\t"z"\n]\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTestFile = path.join(tempFolder, "sortme.json");

  writeFileSync(pathOfTestFile, originalContents);

  await execa("./cli.js", [tempFolder, "-i 3", "-t", "-a"]).catch((err) => {
    throw new Error(err);
  });

  equal(readFileSync(pathOfTestFile, "utf8"), sortedContents, "03.01");

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });
});

test.run();
