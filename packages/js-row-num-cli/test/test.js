import fs from "fs-extra";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import path from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";
import tempy from "tempy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// we need to escape to prevent accidental "fixing" of this file through
// build scripts
const letterC = "\x63";

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  1
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test("01 - there are no usable files at all", async () => {
  let tempFolder = tempy.directory();
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), "zzz")
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")}`, {
        shell: true,
      })
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });
  // confirm that the existing file is intact:
  equal(await processedFileContents, "zzz", "01");
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  2
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test("02 - cli.js in the root", async () => {
  let originalFile = `${letterC}onsole.log('052 zzz');\n${letterC}onsole.log('052 zzz');`;
  let intendedFile = `${letterC}onsole.log('001 zzz');\n${letterC}onsole.log('002 zzz');`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")}`, {
        shell: true,
      })
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  // 3. compare:
  equal(await processedFileContents, intendedFile, "02");
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  3
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test("03/1 - pad override, -p", async () => {
  let originalFile = `${letterC}onsole.log('094 zzz');\n${letterC}onsole.log('094 zzz');`;
  let intendedFile = `${letterC}onsole.log('01 zzz');\n${letterC}onsole.log('02 zzz');`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")} -p 2`,
        {
          shell: true,
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  // 3. compare:
  equal(await processedFileContents, intendedFile, "03");
});

test("04/2 - pad override, --pad", async () => {
  let originalFile = `${letterC}onsole.log('125 zzz');\n${letterC}onsole.log('125 zzz');`;
  let intendedFile = `${letterC}onsole.log('01 zzz');\n${letterC}onsole.log('02 zzz');`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")} --pad 2`,
        {
          shell: true,
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  // 3. compare:
  equal(await processedFileContents, intendedFile, "04");
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  4
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test("05 - one file called with glob, another not processed", async () => {
  let originalFile = `${letterC}onsole.log('170 zzz');\n${letterC}onsole.log('170 zzz');`;
  let intendedFile = `${letterC}onsole.log('0001 zzz');\n${letterC}onsole.log('0002 zzz');`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let file1contents = await fs
    .writeFile(path.join(tempFolder, "file1.js"), originalFile)
    .then(
      () => fs.writeFile(path.join(tempFolder, "file2.js"), originalFile) // <---- we write second file here
    )
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname,
          "../",
          "cli.js"
        )} -p 4 file1.js`,
        { shell: true }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "file1.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  let file2contents = await fs.readFile(
    path.join(tempFolder, "file2.js"),
    "utf8"
  );

  // 3. compare:
  equal(file1contents, intendedFile, "05.01");
  equal(file2contents, originalFile, "05.02"); // <---- should not been touched!
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  5
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test("06 - two files processed by calling glob with wildcard", async () => {
  let originalFile = `${letterC}onsole.log('225 zzz');\n${letterC}onsole.log('225 zzz');`;
  let intendedFile = `${letterC}onsole.log('0001 zzz');\n${letterC}onsole.log('0002 zzz');`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let file1contents = await fs
    .writeFile(path.join(tempFolder, "file1.js"), originalFile)
    .then(
      () => fs.writeFile(path.join(tempFolder, "file2.js"), originalFile) // <---- we write second file here
    )
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname,
          "../",
          "cli.js"
        )} -p 4 "*.js"`,
        { shell: true }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "file1.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  let file2contents = await fs.readFile(
    path.join(tempFolder, "file2.js"),
    "utf8"
  );

  // 3. compare:
  equal(file1contents, intendedFile, "06.01");
  equal(file2contents, intendedFile, "06.02"); // both updated
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  ?
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test('07/1 - "t" flag, -t', async () => {
  let originalFile = "log('123 zzz');\nlog('123 zzz');";

  let intendedFile = "log('001 zzz');\nlog('002 zzz');";

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")} -t "log"`,
        {
          shell: true,
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  // 3. compare:
  equal(await processedFileContents, intendedFile, "07");
});

test('08/2 - "t" flag, --trigger', async () => {
  let originalFile = "log('123 zzz');\nlog('123 zzz');";

  let intendedFile = "log('001 zzz');\nlog('002 zzz');";

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname,
          "../"
        )}/cli.js --trigger "log"`,
        {
          shell: true,
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  // 3. compare:
  equal(await processedFileContents, intendedFile, "08");
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  ?
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test.run();
