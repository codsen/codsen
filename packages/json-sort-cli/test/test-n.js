import fs from "fs-extra";
import path from "path";
import tap from "tap";
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

tap.test("01 - only node_modules with one file, flag disabled", async (t) => {
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(path.join(tempFolder, "/node_modules/")));
  const pathOfTheTestfile = path.join(tempFolder, "/node_modules/sortme.json");
  const originalContents = `{\n  "z": 1,\n  "a": 2\n}\n`;

  const processedFilesContents = fs
    .writeFile(pathOfTheTestfile, originalContents)
    .then(() => execa("./cli.js", [tempFolder]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((testFile) =>
      execaCommand(`rm -rf ${tempFolder}`)
        .then(() => testFile)
        .catch((err) => t.fail(err))
    )
    .catch((err) => t.fail(err));

  t.strictSame(await processedFilesContents, originalContents, "01");
  t.end();
});

tap.test("02 - only node_modules with one file, flag enabled", async (t) => {
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(path.join(tempFolder, "/node_modules/")));
  const pathOfTheTestfile = path.join(tempFolder, "/node_modules/sortme.json");

  const processedFilesContents = fs
    .writeFile(pathOfTheTestfile, `{\n  "z": 1,\n  "a": 2\n}\n`)
    .then(() => execa("./cli.js", [tempFolder, "-n"]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((testFile) =>
      execaCommand(`rm -rf ${tempFolder}`)
        .then(() => testFile)
        .catch((err) => t.fail(err))
    )
    .catch((err) => t.fail(err));

  t.strictSame(
    await processedFilesContents,
    `{\n  "a": 2,\n  "z": 1\n}\n`,
    "02"
  );
  t.end();
});

tap.test(
  "03 - files inside and outside node_modules, flag enabled",
  async (t) => {
    const originalContents = `{\n  "z": 1,\n  "a": 2\n}\n`;
    const sortedContents = `{\n  "a": 2,\n  "z": 1\n}\n`;

    const tempFolder = tempy.directory();
    // const tempFolder = "temp";
    fs.ensureDirSync(path.resolve(tempFolder));
    fs.ensureDirSync(path.resolve(path.join(tempFolder, "/node_modules/")));
    const pathOfTestFile1 = path.join(tempFolder, "/node_modules/sortme.json");
    const pathOfTestFile2 = path.join(tempFolder, "sortme.json");

    fs.writeFileSync(pathOfTestFile1, originalContents);
    fs.writeFileSync(pathOfTestFile2, originalContents);

    await execa("./cli.js", [tempFolder, "-n"]).catch((err) => t.fail(err));

    t.strictSame(
      fs.readFileSync(pathOfTestFile1, "utf8"),
      sortedContents,
      "03.01 - sorted within node_modules"
    );
    t.strictSame(
      fs.readFileSync(pathOfTestFile2, "utf8"),
      sortedContents,
      "03.02 - sorted outside node_modules"
    );

    await execaCommand(`rm -rf ${tempFolder}`).catch((err) => t.fail(err));
    t.end();
  }
);

tap.test(
  "04 - files inside and outside node_modules, flag disabled",
  async (t) => {
    const originalContents = `{\n  "z": 1,\n  "a": 2\n}\n`;
    const sortedContents = `{\n  "a": 2,\n  "z": 1\n}\n`;

    const tempFolder = tempy.directory();
    // const tempFolder = "temp";
    fs.ensureDirSync(path.resolve(tempFolder));
    fs.ensureDirSync(
      path.resolve(path.join(tempFolder, "/node_modules/dir1/"))
    );
    const pathOfTestFile1 = path.join(
      tempFolder,
      "/node_modules/dir1/sortme.json"
    );
    const pathOfTestFile2 = path.join(tempFolder, "sortme.json");

    fs.writeFileSync(pathOfTestFile1, originalContents);
    fs.writeFileSync(pathOfTestFile2, originalContents);

    await execa("./cli.js", [tempFolder]).catch((err) => t.fail(err));

    t.strictSame(
      fs.readFileSync(pathOfTestFile1, "utf8"),
      originalContents,
      "04.01 - not sorted within node_modules"
    );
    t.strictSame(
      fs.readFileSync(pathOfTestFile2, "utf8"),
      sortedContents,
      "04.02 - sorted outside node_modules"
    );

    await execaCommand(`rm -rf ${tempFolder}`).catch((err) => t.fail(err));
    t.end();
  }
);
