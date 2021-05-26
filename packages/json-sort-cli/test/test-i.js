import fs from "fs-extra";
import path from "path";
import tap from "tap";
import execa from "execa";
import tempy from "tempy";
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

tap.test("01 - indentationCount set to 3, spaces", async (t) => {
  const originalContents = `{\n  "z": 1,\n  "a": 2\n}\n`;
  const sortedContents = `{\n   "a": 2,\n   "z": 1\n}\n`;

  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTestFile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(pathOfTestFile, originalContents);

  await execa("./cli.js", [tempFolder, "-i 3"]).catch((err) => t.fail(err));

  t.strictSame(fs.readFileSync(pathOfTestFile, "utf8"), sortedContents, "01");

  await execa.command(`rm -rf ${tempFolder}`).catch((err) => t.fail(err));
  t.end();
});

tap.test("02 - indentationCount set to 3, tabs", async (t) => {
  const originalContents = `{\n  "z": 1,\n  "a": 2\n}\n`;
  const sortedContents = `{\n\t\t\t"a": 2,\n\t\t\t"z": 1\n}\n`;

  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTestFile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(pathOfTestFile, originalContents);

  await execa("./cli.js", [tempFolder, "-i 3", "-t"]).catch((err) =>
    t.fail(err)
  );

  t.strictSame(fs.readFileSync(pathOfTestFile, "utf8"), sortedContents, "02");

  await execa.command(`rm -rf ${tempFolder}`).catch((err) => t.fail(err));
  t.end();
});

tap.test("03 - indentationCount set to 3, tabs, array", async (t) => {
  const originalContents = `[\n  "z",\n  "a"\n]\n`;
  const sortedContents = `[\n\t\t\t"a",\n\t\t\t"z"\n]\n`;

  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTestFile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(pathOfTestFile, originalContents);

  await execa("./cli.js", [tempFolder, "-i 3", "-t", "-a"]).catch((err) =>
    t.fail(err)
  );

  t.strictSame(fs.readFileSync(pathOfTestFile, "utf8"), sortedContents, "03");

  await execa.command(`rm -rf ${tempFolder}`).catch((err) => t.fail(err));
  t.end();
});
