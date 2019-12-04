const fs = require("fs-extra");
const t = require("tap");
const path = require("path");
const execa = require("execa");
const tempy = require("tempy");

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

t.test("01 - there are no usable files at all", async t => {
  const tempFolder = tempy.directory();
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "index.html"), "zzz")
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname,
          "../",
          "cli.js"
        )} "index.html"`,
        {
          shell: true
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "index.html"), "utf8"))
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

t.test("02 - index.html in the root", async t => {
  const originalFile = `111
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

  const intendedFile = `111
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
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  // console.log(`tempFolder = ${tempFolder}`);

  // 2. asynchronously write all test files
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "index.html"), originalFile)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(
          __dirname,
          "../",
          "cli.js"
        )} "index.html"`,
        {
          shell: true
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "index.html"), "utf8"))
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

t.test("03 - two files processed by calling glob with wildcard", async t => {
  const file1 = `111
222
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pt$$$ { padding-top: $$$px !important; } | 0 | 3 |
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS
GENERATE-ATOMIC-CSS-CONTENT-ENDS */
333
444
`;
  const file2 = `111
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
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write all test files
  const file1contents = await fs
    .writeFile(path.join(tempFolder, "file1.html"), file1)
    .then(
      () => fs.writeFile(path.join(tempFolder, "file2.html"), file2) // <---- we write second file here
    )
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")} "*.html"`,
        {
          shell: true
        }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "file1.html"), "utf8"))
    .catch(err => t.fail(err));

  const file2contents = await fs.readFile(
    path.join(tempFolder, "file2.html"),
    "utf8"
  );

  // 3. compare:
  t.match(file1contents, /\.pt3 { padding-top: 3px !important; }/g, "03.01");
  t.match(file2contents, /\.mt3 { margin-top: 3px !important; }/g, "03.02"); // both updated

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
