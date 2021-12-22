import fs from "fs-extra";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa, execaCommand } from "execa";
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

test("01 - only node_modules with one file, flag disabled", async () => {
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(path.join(tempFolder, "/node_modules/")));
  let pathOfTheTestfile = path.join(tempFolder, "/node_modules/sortme.json");
  let originalContents = `{\n  "z": 1,\n  "a": 2\n}\n`;

  let processedFilesContents = fs
    .writeFile(pathOfTheTestfile, originalContents)
    .then(() => execa("./cli.js", [tempFolder]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((testFile) =>
      execaCommand(`rm -rf ${tempFolder}`)
        .then(() => testFile)
        .catch((err) => {
          throw new Error(err);
        })
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFilesContents, originalContents, "01");
});

test("02 - only node_modules with one file, flag enabled", async () => {
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(path.join(tempFolder, "/node_modules/")));
  let pathOfTheTestfile = path.join(tempFolder, "/node_modules/sortme.json");

  let processedFilesContents = fs
    .writeFile(pathOfTheTestfile, `{\n  "z": 1,\n  "a": 2\n}\n`)
    .then(() => execa("./cli.js", [tempFolder, "-n"]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((testFile) =>
      execaCommand(`rm -rf ${tempFolder}`)
        .then(() => testFile)
        .catch((err) => {
          throw new Error(err);
        })
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFilesContents, `{\n  "a": 2,\n  "z": 1\n}\n`, "02");
});

test("03 - files inside and outside node_modules, flag enabled", async () => {
  let originalContents = `{\n  "z": 1,\n  "a": 2\n}\n`;
  let sortedContents = `{\n  "a": 2,\n  "z": 1\n}\n`;

  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(path.join(tempFolder, "/node_modules/")));
  let pathOfTestFile1 = path.join(tempFolder, "/node_modules/sortme.json");
  let pathOfTestFile2 = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(pathOfTestFile1, originalContents);
  fs.writeFileSync(pathOfTestFile2, originalContents);

  await execa("./cli.js", [tempFolder, "-n"]).catch((err) => {
    throw new Error(err);
  });

  equal(
    fs.readFileSync(pathOfTestFile1, "utf8"),
    sortedContents,
    "03.01 - sorted within node_modules"
  );
  equal(
    fs.readFileSync(pathOfTestFile2, "utf8"),
    sortedContents,
    "03.02 - sorted outside node_modules"
  );

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });
});

test("04 - files inside and outside node_modules, flag disabled", async () => {
  let originalContents = `{\n  "z": 1,\n  "a": 2\n}\n`;
  let sortedContents = `{\n  "a": 2,\n  "z": 1\n}\n`;

  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(path.join(tempFolder, "/node_modules/dir1/")));
  let pathOfTestFile1 = path.join(tempFolder, "/node_modules/dir1/sortme.json");
  let pathOfTestFile2 = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(pathOfTestFile1, originalContents);
  fs.writeFileSync(pathOfTestFile2, originalContents);

  await execa("./cli.js", [tempFolder]).catch((err) => {
    throw new Error(err);
  });

  equal(
    fs.readFileSync(pathOfTestFile1, "utf8"),
    originalContents,
    "04.01 - not sorted within node_modules"
  );
  equal(
    fs.readFileSync(pathOfTestFile2, "utf8"),
    sortedContents,
    "04.02 - sorted outside node_modules"
  );

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });
});

test.run();
