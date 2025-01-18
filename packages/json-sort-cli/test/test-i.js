import fs from "fs-extra";
import path from "path";
import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa, execaCommand } from "execa";
import { temporaryDirectory } from "tempy";
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
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTestFile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(pathOfTestFile, originalContents);

  await execa("./cli.js", [tempFolder, "-i 3"]).catch((err) => {
    throw new Error(err);
  });

  equal(fs.readFileSync(pathOfTestFile, "utf8"), sortedContents, "01.01");

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });
});

test("02 - indentationCount set to 3, tabs", async () => {
  let originalContents = '{\n  "z": 1,\n  "a": 2\n}\n';
  let sortedContents = '{\n\t\t\t"a": 2,\n\t\t\t"z": 1\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTestFile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(pathOfTestFile, originalContents);

  await execa("./cli.js", [tempFolder, "-i 3", "-t"]).catch((err) => {
    throw new Error(err);
  });

  equal(fs.readFileSync(pathOfTestFile, "utf8"), sortedContents, "02.01");

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });
});

test("03 - indentationCount set to 3, tabs, array", async () => {
  let originalContents = '[\n  "z",\n  "a"\n]\n';
  let sortedContents = '[\n\t\t\t"a",\n\t\t\t"z"\n]\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTestFile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(pathOfTestFile, originalContents);

  await execa("./cli.js", [tempFolder, "-i 3", "-t", "-a"]).catch((err) => {
    throw new Error(err);
  });

  equal(fs.readFileSync(pathOfTestFile, "utf8"), sortedContents, "03.01");

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });
});

test.run();
