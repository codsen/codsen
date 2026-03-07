// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { spawn } from "../../../ops/helpers/spawn.js";

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
  // const tempFolder = "temp";

  fs.writeFileSync(path.join(tempFolder, "file.md"), "zzz");
  try {
    spawn(tempFolder, __dirname2);
    not.ok("01");
  } catch {
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
  spawn(tempFolder, __dirname2, "testfile.csv");

  // execaCommandSync(
  //   `cd ${tempFolder} && ${path.join(__dirname, "../cli.js")} testfile.csv`,
  //   { shell: true }
  // );
  let generatedCSVFile = fs.readFileSync(
    path.join(tempFolder, "testfile-1.csv"),
    "utf8",
  );
  equal(generatedCSVFile, intendedCSV, "02.01");

  // 3. check, is original file intact
  let originalCsvFile = fs.readFileSync(
    path.join(tempFolder, "testfile.csv"),
    "utf8",
  );
  equal(originalCsvFile, originalCSV, "02.02");
});

test("03 - waits for all requested files", () => {
  let originalCSV = `Acc Number,Description,Debit Amount,Credit Amount,Balance,
123456,Client #1 payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`;

  let tempFolder = temporaryDirectory();
  fs.writeFileSync(path.join(tempFolder, "first.csv"), originalCSV);
  fs.writeFileSync(path.join(tempFolder, "second.csv"), originalCSV);

  spawn(tempFolder, __dirname2, "first.csv", "second.csv");

  ok(fs.existsSync(path.join(tempFolder, "first-1.csv")), "03.01");
  ok(fs.existsSync(path.join(tempFolder, "second-1.csv")), "03.02");
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
