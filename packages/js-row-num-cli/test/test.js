const fs = require("fs-extra");
const t = require("tap");
const path = require("path");
const execa = require("execa");
const tempy = require("tempy");

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

t.test("01.01 - there are no usable files at all", async t => {
  const tempFolder = tempy.directory();
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), "zzz")
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")}`, {
        shell: true
      })
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch(err => t.fail(err));
  // confirm that the existing file is intact:
  t.equal(await processedFileContents, "zzz");
  t.end();
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

t.test("01.02 - cli.js in the root", async t => {
  const originalFile = `${letterC}onsole.log('052 zzz');\n${letterC}onsole.log('052 zzz');`;
  const intendedFile = `${letterC}onsole.log('001 zzz');\n${letterC}onsole.log('002 zzz');`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")}`, {
        shell: true
      })
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch(err => t.fail(err));

  // 3. compare:
  t.equal(await processedFileContents, intendedFile);
  t.end();
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

t.test("01.03/1 - pad override, -p", async t => {
  const originalFile = `${letterC}onsole.log('094 zzz');\n${letterC}onsole.log('094 zzz');`;
  const intendedFile = `${letterC}onsole.log('01 zzz');\n${letterC}onsole.log('02 zzz');`;

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
        `cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")} -p 2`,
        {
          shell: true
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch(err => t.fail(err));

  // 3. compare:
  t.equal(await processedFileContents, intendedFile);
  t.end();
});

t.test("01.03/2 - pad override, --pad", async t => {
  const originalFile = `${letterC}onsole.log('125 zzz');\n${letterC}onsole.log('125 zzz');`;
  const intendedFile = `${letterC}onsole.log('01 zzz');\n${letterC}onsole.log('02 zzz');`;

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
        `cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")} --pad 2`,
        {
          shell: true
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch(err => t.fail(err));

  // 3. compare:
  t.equal(await processedFileContents, intendedFile);
  t.end();
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

t.test("01.04 - one file called with glob, another not processed", async t => {
  const originalFile = `${letterC}onsole.log('170 zzz');\n${letterC}onsole.log('170 zzz');`;
  const intendedFile = `${letterC}onsole.log('0001 zzz');\n${letterC}onsole.log('0002 zzz');`;

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
          "../",
          "cli.js"
        )} -p 4 file1.js`,
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
  t.equal(file1contents, intendedFile);
  t.equal(file2contents, originalFile); // <---- should not been touched!
  t.end();
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

t.test("01.05 - two files processed by calling glob with wildcard", async t => {
  const originalFile = `${letterC}onsole.log('225 zzz');\n${letterC}onsole.log('225 zzz');`;
  const intendedFile = `${letterC}onsole.log('0001 zzz');\n${letterC}onsole.log('0002 zzz');`;

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
          "../",
          "cli.js"
        )} -p 4 "*.js"`,
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
  t.equal(file1contents, intendedFile);
  t.equal(file2contents, intendedFile); // both updated
  t.end();
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

t.test('01.06/1 - "t" flag, -t', async t => {
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
        `cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")} -t "log"`,
        {
          shell: true
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch(err => t.fail(err));

  // 3. compare:
  t.equal(await processedFileContents, intendedFile);
  t.end();
});

t.test('01.06/2 - "t" flag, --trigger', async t => {
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
  t.equal(await processedFileContents, intendedFile);
  t.end();
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
