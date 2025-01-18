import fs from "fs-extra";
import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import path from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";

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
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "index.html"), "zzz")
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
    .then(() => fs.readFile(path.join(tempFolder, "index.html"), "utf8"))
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
  let processedFileContents = fs
    .writeFile(path.join(tempFolder, "index.html"), originalFile)
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
    .then(() => fs.readFile(path.join(tempFolder, "index.html"), "utf8"))
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
  let file1contents = await fs
    .writeFile(path.join(tempFolder, "file1.html"), file1)
    .then(
      () => fs.writeFile(path.join(tempFolder, "file2.html"), file2), // <---- we write second file here
    )
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname2, "../", "cli.js")} "*.html"`,
        {
          shell: true,
        },
      ),
    )
    .then(() => fs.readFile(path.join(tempFolder, "file1.html"), "utf8"))
    .catch((err) => {
      throw new Error(err);
    });

  let file2contents = await fs.readFile(
    path.join(tempFolder, "file2.html"),
    "utf8",
  );

  // 3. compare:
  match(file1contents, /\.pt3 { padding-top: 3px !important; }/g, "03.01");
  match(file2contents, /\.mt3 { margin-top: 3px !important; }/g, "03.02"); // both updated
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
