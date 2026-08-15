// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import * as fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { processFiles } from "../process-files.js";

const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename2);

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
  let tempFolder = temporaryDirectory();
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), "zzz")
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname2, "../", "cli.js")}`, {
        shell: true,
      }),
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });
  // confirm that the existing file is intact:
  equal(await processedFileContents, "zzz", "01.01");
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
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname2, "../", "cli.js")}`, {
        shell: true,
      }),
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  // 3. compare:
  equal(await processedFileContents, intendedFile, "02.01");
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

test("03 - /1 - pad override, -p", async () => {
  let originalFile = `${letterC}onsole.log('094 zzz');\n${letterC}onsole.log('094 zzz');`;
  let intendedFile = `${letterC}onsole.log('01 zzz');\n${letterC}onsole.log('02 zzz');`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname2, "../", "cli.js")} -p 2`,
        {
          shell: true,
        },
      ),
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  // 3. compare:
  equal(await processedFileContents, intendedFile, "03.01");
});

test("04 - /2 - pad override, --pad", async () => {
  let originalFile = `${letterC}onsole.log('125 zzz');\n${letterC}onsole.log('125 zzz');`;
  let intendedFile = `${letterC}onsole.log('01 zzz');\n${letterC}onsole.log('02 zzz');`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname2, "../", "cli.js")} --pad 2`,
        {
          shell: true,
        },
      ),
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  // 3. compare:
  equal(await processedFileContents, intendedFile, "04.01");
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
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let file1contents = await fs
    .writeFile(path.join(tempFolder, "file1.js"), originalFile)
    .then(
      () => fs.writeFile(path.join(tempFolder, "file2.js"), originalFile), // <---- we write second file here
    )
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname2,
          "../",
          "cli.js",
        )} -p 4 file1.js`,
        { shell: true },
      ),
    )
    .then(() => fs.readFile(path.join(tempFolder, "file1.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  let file2contents = await fs.readFile(
    path.join(tempFolder, "file2.js"),
    "utf8",
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
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let file1contents = await fs
    .writeFile(path.join(tempFolder, "file1.js"), originalFile)
    .then(
      () => fs.writeFile(path.join(tempFolder, "file2.js"), originalFile), // <---- we write second file here
    )
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname2,
          "../",
          "cli.js",
        )} -p 4 "*.js"`,
        { shell: true },
      ),
    )
    .then(() => fs.readFile(path.join(tempFolder, "file1.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  let file2contents = await fs.readFile(
    path.join(tempFolder, "file2.js"),
    "utf8",
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

test('07 - /1 - "t" flag, -t', async () => {
  let originalFile = "log('123 zzz');\nlog('123 zzz');";

  let intendedFile = "log('001 zzz');\nlog('002 zzz');";

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname2, "../", "cli.js")} -t "log"`,
        {
          shell: true,
        },
      ),
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  // 3. compare:
  equal(await processedFileContents, intendedFile, "07.01");
});

test('08 - /2 - "t" flag, --trigger', async () => {
  let originalFile = "log('123 zzz');\nlog('123 zzz');";

  let intendedFile = "log('001 zzz');\nlog('002 zzz');";

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "cli.js"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname2,
          "../",
        )}/cli.js --trigger "log"`,
        {
          shell: true,
        },
      ),
    )
    .then(() => fs.readFile(path.join(tempFolder, "cli.js"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  // 3. compare:
  equal(await processedFileContents, intendedFile, "08.01");
});

test("09 - a directory operand expands recursively", async () => {
  let tempFolder = temporaryDirectory();
  let sourceFolder = path.join(tempFolder, "source");
  let nestedFolder = path.join(sourceFolder, "nested");
  let dependencyFolder = path.join(sourceFolder, "node_modules");
  let originalFile = `${letterC}onsole.log('123 zzz');`;
  let intendedFile = `${letterC}onsole.log('001 zzz');`;

  await Promise.all([
    fs.mkdir(nestedFolder, { recursive: true }),
    fs.mkdir(dependencyFolder, { recursive: true }),
  ]);
  await Promise.all([
    fs.writeFile(path.join(sourceFolder, "first.js"), originalFile),
    fs.writeFile(path.join(nestedFolder, "second.js"), originalFile),
    fs.writeFile(path.join(dependencyFolder, "dependency.js"), originalFile),
  ]);

  await execa(
    `cd ${tempFolder} && ${path.join(__dirname2, "../", "cli.js")} source`,
    { shell: true },
  );

  equal(
    await fs.readFile(path.join(sourceFolder, "first.js"), "utf8"),
    intendedFile,
    "09.01",
  );
  equal(
    await fs.readFile(path.join(nestedFolder, "second.js"), "utf8"),
    intendedFile,
    "09.02",
  );
  equal(
    await fs.readFile(path.join(dependencyFolder, "dependency.js"), "utf8"),
    originalFile,
    "09.03",
  );
});

test("10 - a read failure rejects with its processing stage", async () => {
  let receivedError;
  const logs = [];

  try {
    await processFiles(["unreadable.js"], {
      logger: (message) => logs.push(message),
      readFile: async () => {
        throw new Error("injected read failure");
      },
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.name, "ProcessingError", "10.01");
  equal(receivedError?.failures[0].stage, "read", "10.02");
  equal(receivedError?.successful, [], "10.03");
  equal(logs.join("\n").includes("\u001b[32m"), false, "10.04");
});

test("11 - a transform failure rejects with its processing stage", async () => {
  let receivedError;

  try {
    await processFiles(["invalid.js"], {
      logger: () => {},
      readFile: async () => "source",
      transform: () => {
        throw new Error("injected transform failure");
      },
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.failures[0].stage, "transform", "11.01");
  equal(
    receivedError?.failures[0].error.message,
    "injected transform failure",
    "11.02",
  );
});

test("12 - a write failure rejects with its processing stage", async () => {
  let receivedError;

  try {
    await processFiles(["unwritable.js"], {
      logger: () => {},
      readFile: async () => "source",
      transform: (contents) => contents,
      writeFile: async () => {
        throw new Error("injected write failure");
      },
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.failures[0].stage, "write", "12.01");
  equal(
    receivedError?.failures[0].error.message,
    "injected write failure",
    "12.02",
  );
});

test("13 - a mixed batch updates valid files and exits nonzero", async () => {
  let tempFolder = temporaryDirectory();
  let validPath = path.join(tempFolder, "plain.js");
  let invalidPath = path.join(tempFolder, "numbered.js");
  let invalidContents = `${letterC}onsole.log('123 zzz');`;

  await Promise.all([
    fs.writeFile(validPath, "const value = 1;"),
    fs.writeFile(invalidPath, invalidContents),
  ]);
  let result = await execa(
    path.join(__dirname2, "../cli.js"),
    ["--pad", "1000000000000", "*.js"],
    { cwd: tempFolder, reject: false },
  );

  equal(result.exitCode, 1, "13.01");
  match(result.stdout, /1 file updated/, "13.02");
  match(result.stdout, /1 file could not be updated/, "13.03");
  equal(await fs.readFile(validPath, "utf8"), "const value = 1;", "13.04");
  equal(await fs.readFile(invalidPath, "utf8"), invalidContents, "13.05");
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
