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

test("01.01 - there are no usable files at all", t => {
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  const error1 = t.throws(() => {
    fs.writeFileSync(path.join(tempFolder, "file.md"), "zzz");
    execa.shellSync(
      `cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js`
    );
  });
  t.truthy(error1.message.includes("Alas"));

  // confirm that the existing file is intact:
  t.deepEqual(fs.readFileSync(path.join(tempFolder, "file.md"), "utf8"), "zzz");
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

test("01.02 - only changelog present in the root - default (not --loud)", async t => {
  const originalCSV = `Acc Number,Description,Debit Amount,Credit Amount,Balance,
123456,Client #1 payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`;

  const intendedCSV = `Acc Number,Description,Debit Amount,Credit Amount,Balance
123456,Client #1 payment,,1000,1940
123456,Bought table,10,,940
123456,Bought carpet,30,,950
123456,Bought chairs,20,,980
123456,Bought pens,10,,1000`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. write CSV, process it and read the new file
  const newlyGeneratedCsvFile = fs
    .writeFile(path.join(tempFolder, "testfile.csv"), originalCSV)
    .then(() =>
      execa.shell(
        `cd ${tempFolder} && ${path.join(__dirname, "../")}/cli.js testfile.csv`
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "testfile-1.csv"), "utf8"))
    .catch(err => t.fail(err));

  t.deepEqual(await newlyGeneratedCsvFile, intendedCSV);

  // 3. check, is original file intact
  const originalCsvFile = fs.readFile(
    path.join(tempFolder, "testfile.csv"),
    "utf8"
  );
  t.deepEqual(await originalCsvFile, originalCSV);
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
