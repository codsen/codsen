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

test("01 - only node_modules with one file, flag disabled", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  mkdirSync(path.resolve(path.join(tempFolder, "/node_modules/")), {
    recursive: true,
  });
  let pathOfTheTestfile = path.join(tempFolder, "/node_modules/sortme.json");
  let originalContents = '{\n  "z": 1,\n  "a": 2\n}\n';

  let processedFilesContents = writeFile(pathOfTheTestfile, originalContents)
    .then(() => execa("./cli.js", [tempFolder]))
    .then(() => readFile(pathOfTheTestfile, "utf8"))
    .then((testFile) =>
      execaCommand(`rm -rf ${tempFolder}`)
        .then(() => testFile)
        .catch((err) => {
          throw new Error(err);
        }),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFilesContents, originalContents, "01.01");
});

test("02 - only node_modules with one file, flag enabled", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  mkdirSync(path.resolve(path.join(tempFolder, "/node_modules/")), {
    recursive: true,
  });
  let pathOfTheTestfile = path.join(tempFolder, "/node_modules/sortme.json");

  let processedFilesContents = writeFile(
    pathOfTheTestfile,
    '{\n  "z": 1,\n  "a": 2\n}\n',
  )
    .then(() => execa("./cli.js", [tempFolder, "-n"]))
    .then(() => readFile(pathOfTheTestfile, "utf8"))
    .then((testFile) =>
      execaCommand(`rm -rf ${tempFolder}`)
        .then(() => testFile)
        .catch((err) => {
          throw new Error(err);
        }),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFilesContents, '{\n  "a": 2,\n  "z": 1\n}\n', "02.01");
});

test("03 - files inside and outside node_modules, flag enabled", async () => {
  let originalContents = '{\n  "z": 1,\n  "a": 2\n}\n';
  let sortedContents = '{\n  "a": 2,\n  "z": 1\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  mkdirSync(path.resolve(path.join(tempFolder, "/node_modules/")), {
    recursive: true,
  });
  let pathOfTestFile1 = path.join(tempFolder, "/node_modules/sortme.json");
  let pathOfTestFile2 = path.join(tempFolder, "sortme.json");

  writeFileSync(pathOfTestFile1, originalContents);
  writeFileSync(pathOfTestFile2, originalContents);

  await execa("./cli.js", [tempFolder, "-n"]).catch((err) => {
    throw new Error(err);
  });

  equal(readFileSync(pathOfTestFile1, "utf8"), sortedContents, "03.01");
  equal(readFileSync(pathOfTestFile2, "utf8"), sortedContents, "03.02");

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });
});

test("04 - files inside and outside node_modules, flag disabled", async () => {
  let originalContents = '{\n  "z": 1,\n  "a": 2\n}\n';
  let sortedContents = '{\n  "a": 2,\n  "z": 1\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  mkdirSync(path.resolve(path.join(tempFolder, "/node_modules/dir1/")), {
    recursive: true,
  });
  let pathOfTestFile1 = path.join(tempFolder, "/node_modules/dir1/sortme.json");
  let pathOfTestFile2 = path.join(tempFolder, "sortme.json");

  writeFileSync(pathOfTestFile1, originalContents);
  writeFileSync(pathOfTestFile2, originalContents);

  await execa("./cli.js", [tempFolder]).catch((err) => {
    throw new Error(err);
  });

  equal(readFileSync(pathOfTestFile1, "utf8"), originalContents, "04.01");
  equal(readFileSync(pathOfTestFile2, "utf8"), sortedContents, "04.02");

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });
});

test.run();
