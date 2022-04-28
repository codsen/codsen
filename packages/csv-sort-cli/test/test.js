import fs from "fs-extra";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import path from "path";
import { temporaryDirectory } from "tempy";
import { fileURLToPath } from "url";

import { spawn } from "../../../ops/helpers/spawn.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  // const tempFolder = "temp";

  await fs.writeFile(path.join(tempFolder, "file.md"), "zzz");
  try {
    spawn(tempFolder, __dirname);
    not.ok("01");
  } catch (error) {
    ok("01");
  }
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

test("02 - sorts a file", async () => {
  let originalCSV = `Acc Number,Description,Debit Amount,Credit Amount,Balance,
123456,Client #1 payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`;

  let intendedCSV = `Acc Number,Description,Debit Amount,Credit Amount,Balance
123456,Client #1 payment,,1000,1940
123456,Bought table,10,,940
123456,Bought carpet,30,,950
123456,Bought chairs,20,,980
123456,Bought pens,10,,1000`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // let tempFolder = "temp";
  // fs.ensureDirSync(path.resolve(tempFolder));

  // 2. write CSV, process it and read the new file
  fs.writeFileSync(path.join(tempFolder, "testfile.csv"), originalCSV);
  spawn(tempFolder, __dirname, "testfile.csv");

  // execaCommandSync(
  //   `cd ${tempFolder} && ${path.join(__dirname, "../cli.js")} testfile.csv`,
  //   { shell: true }
  // );
  let generatedCSVFile = fs.readFileSync(
    path.join(tempFolder, "testfile-1.csv"),
    "utf8"
  );
  equal(generatedCSVFile, intendedCSV, "01.01");

  // 3. check, is original file intact
  let originalCsvFile = fs.readFileSync(
    path.join(tempFolder, "testfile.csv"),
    "utf8"
  );
  equal(originalCsvFile, originalCSV, "01.02");
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
