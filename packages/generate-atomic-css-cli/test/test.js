// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { processFiles } from "../process-files.js";

const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename2);

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
  let processedFileContents = writeFile(
    path.join(tempFolder, "index.html"),
    "zzz",
  )
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname2,
          "../",
          "cli.js",
        )} "index.html"`,
        {
          shell: true,
        },
      ),
    )
    .then(() => readFile(path.join(tempFolder, "index.html"), "utf8"))
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

test("02 - index.html in the root", async () => {
  let originalFile = `111
222
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pt$$$ { padding-top: $$$px !important; } | 0 | 3 |
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
test 02
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
333
444
`;

  let intendedFile = `111
222
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pt$$$ { padding-top: $$$px !important; } | 0 | 3 |
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pt0 { padding-top:   0 !important; }
.pt1 { padding-top: 1px !important; }
.pt2 { padding-top: 2px !important; }
.pt3 { padding-top: 3px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
333
444
`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  // console.log(`tempFolder = ${tempFolder}`);

  // 2. asynchronously write all test files
  let processedFileContents = writeFile(
    path.join(tempFolder, "index.html"),
    originalFile,
  )
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname2,
          "../",
          "cli.js",
        )} "index.html"`,
        {
          shell: true,
        },
      ),
    )
    .then(() => readFile(path.join(tempFolder, "index.html"), "utf8"))
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

test("03 - two files processed by calling glob with wildcard", async () => {
  let file1 = `111
222
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pt$$$ { padding-top: $$$px !important; } | 0 | 3 |
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS
GENERATE-ATOMIC-CSS-CONTENT-ENDS */
333
444
`;
  let file2 = `111
222
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.mt$$$ { margin-top: $$$px !important; } | 0 | 3 |
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS
GENERATE-ATOMIC-CSS-CONTENT-ENDS */
333
444
`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  let file1contents = await writeFile(
    path.join(tempFolder, "file1.html"),
    file1,
  )
    .then(
      () => writeFile(path.join(tempFolder, "file2.html"), file2), // <---- we write second file here
    )
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname2, "../", "cli.js")} "*.html"`,
        {
          shell: true,
        },
      ),
    )
    .then(() => readFile(path.join(tempFolder, "file1.html"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  let file2contents = await readFile(
    path.join(tempFolder, "file2.html"),
    "utf8",
  );

  // 3. compare:
  match(file1contents, /\.pt3 { padding-top: 3px !important; }/g, "03.01");
  match(file2contents, /\.mt3 { margin-top: 3px !important; }/g, "03.02"); // both updated
});

test("04 - a directory operand expands recursively", async () => {
  let tempFolder = temporaryDirectory();
  let templatesFolder = path.join(tempFolder, "templates");
  let nestedFolder = path.join(templatesFolder, "nested");
  let dependencyFolder = path.join(templatesFolder, "node_modules");
  let originalFile = `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pt$$$ { padding-top: $$$px !important; } | 0 | 1 |
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS
GENERATE-ATOMIC-CSS-CONTENT-ENDS */`;

  await Promise.all([
    mkdir(nestedFolder, { recursive: true }),
    mkdir(dependencyFolder, { recursive: true }),
  ]);
  await Promise.all([
    writeFile(path.join(templatesFolder, "first.html"), originalFile),
    writeFile(path.join(nestedFolder, "second.html"), originalFile),
    writeFile(path.join(dependencyFolder, "dependency.html"), originalFile),
  ]);

  await execa(
    `cd ${tempFolder} && ${path.join(__dirname2, "../", "cli.js")} templates`,
    { shell: true },
  );

  match(
    await readFile(path.join(templatesFolder, "first.html"), "utf8"),
    /\.pt1 { padding-top: 1px !important; }/,
    "04.01",
  );
  match(
    await readFile(path.join(nestedFolder, "second.html"), "utf8"),
    /\.pt1 { padding-top: 1px !important; }/,
    "04.02",
  );
  equal(
    await readFile(path.join(dependencyFolder, "dependency.html"), "utf8"),
    originalFile,
    "04.03",
  );
});

test("05 - a read failure rejects with its processing stage", async () => {
  let receivedError;
  const logs = [];

  try {
    await processFiles(["unreadable.html"], {
      logger: (message) => logs.push(message),
      readFile: async () => {
        throw new Error("injected read failure");
      },
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.name, "ProcessingError", "05.01");
  equal(
    receivedError?.failures.map(({ path: filePath, stage }) => ({
      path: filePath,
      stage,
    })),
    [{ path: "unreadable.html", stage: "read" }],
    "05.02",
  );
  equal(receivedError?.successful, [], "05.03");
  equal(logs.join("\n").includes("\u001b[32m"), false, "05.04");
});

test("06 - a transform failure rejects with its processing stage", async () => {
  let receivedError;

  try {
    await processFiles(["invalid.html"], {
      logger: () => {},
      readFile: async () => "source",
      transform: () => {
        throw new Error("injected transform failure");
      },
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.failures[0].stage, "transform", "06.01");
  equal(
    receivedError?.failures[0].error.message,
    "injected transform failure",
    "06.02",
  );
});

test("07 - a write failure rejects with its processing stage", async () => {
  let receivedError;

  try {
    await processFiles(["unwritable.html"], {
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

  equal(receivedError?.failures[0].stage, "write", "07.01");
  equal(
    receivedError?.failures[0].error.message,
    "injected write failure",
    "07.02",
  );
});

test("08 - a mixed batch updates valid files and exits nonzero", async () => {
  let tempFolder = temporaryDirectory();
  let validPath = path.join(tempFolder, "valid.html");
  let invalidPath = path.join(tempFolder, "invalid.html");
  let validContents = `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pt$$$ { padding-top: $$$px !important; } | 0 | 1 |
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS
GENERATE-ATOMIC-CSS-CONTENT-ENDS */`;
  let invalidContents = `GENERATE-ATOMIC-CSS-CONFIG-STARTS
GENERATE-ATOMIC-CSS-CONTENT-STARTS
GENERATE-ATOMIC-CSS-CONFIG-ENDS
$$$`;

  await Promise.all([
    writeFile(validPath, validContents),
    writeFile(invalidPath, invalidContents),
  ]);
  let result = await execa(path.join(__dirname2, "../cli.js"), ["*.html"], {
    cwd: tempFolder,
    reject: false,
  });

  equal(result.exitCode, 1, "08.01");
  match(result.stdout, /1 file updated/, "08.02");
  match(result.stdout, /1 file could not be updated/, "08.03");
  match(
    await readFile(validPath, "utf8"),
    /\.pt1 { padding-top: 1px !important; }/,
    "08.04",
  );
  equal(await readFile(invalidPath, "utf8"), invalidContents, "08.05");
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
