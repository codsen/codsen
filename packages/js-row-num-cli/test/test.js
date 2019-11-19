import fs from "fs-extra";
import test from "ava";
import path from "path";
import execa from "execa";
import tempy from "tempy";

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

test("01.01 - there are no usable files at all", async t => {
  const tempFolder = tempy.directory();
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), "zzz")
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js`, {
        shell: true
      })
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch(err => t.fail(err));
  // confirm that the existing file is intact:
  t.is(await processedFileContents, "zzz");
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

test("01.02 - cli.js in the root", async t => {
  const originalFile = "console.log('123 zzz');\nconsole.log('123 zzz');";

  const intendedFile = "console.log('001 zzz');\nconsole.log('002 zzz');";

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js`, {
        shell: true
      })
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch(err => t.fail(err));

  // 3. compare:
  t.is(await processedFileContents, intendedFile);
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

test("01.03/1 - pad override, -p", async t => {
  const originalFile = "console.log('123 zzz');\nconsole.log('123 zzz');";

  const intendedFile = "console.log('01 zzz');\nconsole.log('02 zzz');";

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js -p 2`, {
        shell: true
      })
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch(err => t.fail(err));

  // 3. compare:
  t.is(await processedFileContents, intendedFile);
});

test("01.03/2 - pad override, --pad", async t => {
  const originalFile = "console.log('123 zzz');\nconsole.log('123 zzz');";

  const intendedFile = "console.log('01 zzz');\nconsole.log('02 zzz');";

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js --pad 2`,
        {
          shell: true
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch(err => t.fail(err));

  // 3. compare:
  t.is(await processedFileContents, intendedFile);
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

test("01.04 - one file called with glob, another not processed", async t => {
  const originalFile = "console.log('123 zzz');\nconsole.log('123 zzz');";
  const intendedFile = "console.log('0001 zzz');\nconsole.log('0002 zzz');";

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  const file1contents = await fs
    .writeFile(path.join(tempFolder, "file1.js"), originalFile)
    .then(
      () => fs.writeFile(path.join(tempFolder, "file2.js"), originalFile) // <---- we write second file here
    )
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname,
          "../"
        )}/cli.js -p 4 file1.js`,
        { shell: true }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "file1.js"), "utf8"))
    .catch(err => t.fail(err));

  const file2contents = await fs.readFile(
    path.join(tempFolder, "file2.js"),
    "utf8"
  );

  // 3. compare:
  t.is(file1contents, intendedFile);
  t.is(file2contents, originalFile); // <---- should not been touched!
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

test("01.05 - two files processed by calling glob with wildcard", async t => {
  const originalFile = "console.log('123 zzz');\nconsole.log('123 zzz');";
  const intendedFile = "console.log('0001 zzz');\nconsole.log('0002 zzz');";

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  const file1contents = await fs
    .writeFile(path.join(tempFolder, "file1.js"), originalFile)
    .then(
      () => fs.writeFile(path.join(tempFolder, "file2.js"), originalFile) // <---- we write second file here
    )
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js -p 4 "*.js"`,
        { shell: true }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "file1.js"), "utf8"))
    .catch(err => t.fail(err));

  const file2contents = await fs.readFile(
    path.join(tempFolder, "file2.js"),
    "utf8"
  );

  // 3. compare:
  t.is(file1contents, intendedFile);
  t.is(file2contents, intendedFile); // both updated
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

test('01.06/1 - "t" flag, -t', async t => {
  const originalFile = "log('123 zzz');\nlog('123 zzz');";

  const intendedFile = "log('001 zzz');\nlog('002 zzz');";

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js -t "log"`,
        {
          shell: true
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch(err => t.fail(err));

  // 3. compare:
  t.is(await processedFileContents, intendedFile);
});

test('01.06/2 - "t" flag, --trigger', async t => {
  const originalFile = "log('123 zzz');\nlog('123 zzz');";

  const intendedFile = "log('001 zzz');\nlog('002 zzz');";

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname,
          "../"
        )}/cli.js --trigger "log"`,
        {
          shell: true
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch(err => t.fail(err));

  // 3. compare:
  t.is(await processedFileContents, intendedFile);
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
