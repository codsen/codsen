// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { spawn as spawnChild, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { spawn } from "../../../ops/helpers/spawn.js";

const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename2);

const pipelineInput = `Acc Number,Description,Debit Amount,Credit Amount,Balance,
123456,Client #1 payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`;

const pipelineOutput = `Acc Number,Description,Debit Amount,Credit Amount,Balance
123456,Client #1 payment,,1000,1940
123456,Bought table,10,,940
123456,Bought carpet,30,,950
123456,Bought chairs,20,,980
123456,Bought pens,10,,1000`;

function childEnvironment() {
  const childEnv = {
    ...process.env,
    NO_UPDATE_NOTIFIER: "1",
  };
  delete childEnv.FORCE_COLOR;
  delete childEnv.NO_COLOR;
  return childEnv;
}

function spawnWithInput(tempFolder, input, ...args) {
  return spawnSync(
    process.execPath,
    [path.resolve(__dirname2, "../cli.js"), ...args],
    {
      cwd: tempFolder,
      encoding: "utf8",
      env: childEnvironment(),
      input,
      maxBuffer: 100000000,
      shell: false,
    },
  );
}

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

test("01 - zero-byte non-TTY stdin stays in filter mode", () => {
  let tempFolder = temporaryDirectory();
  fs.writeFileSync(path.join(tempFolder, "file.md"), "zzz");
  let result = spawnWithInput(tempFolder, undefined);

  equal(result.status, 0, "01.01");
  equal(result.stdout, "", "01.02");
  equal(result.stderr, "", "01.03");
  equal(fs.readdirSync(tempFolder), ["file.md"], "01.04");
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
  let result = spawn(tempFolder, __dirname2, "testfile.csv");

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
  equal(result.stdout, "", "02.03");
  match(result.stderr, /A new file, testfile-1\.csv has been created/, "02.04");
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

test("04 - reads piped stdin and prints only the sorted CSV", () => {
  let tempFolder = temporaryDirectory();
  let result = spawnWithInput(tempFolder, pipelineInput);

  equal(result.status, 0, "04.01");
  equal(result.stdout, pipelineOutput, "04.02");
  equal(result.stderr, "", "04.03");
  equal(fs.readdirSync(tempFolder), [], "04.04");
});

test('05 - accepts "-" as the stdin operand', () => {
  let tempFolder = temporaryDirectory();
  let result = spawnWithInput(tempFolder, pipelineInput, "-");

  equal(result.status, 0, "05.01");
  equal(result.stdout, pipelineOutput, "05.02");
  equal(result.stderr, "", "05.03");
  equal(fs.readdirSync(tempFolder), [], "05.04");
});

test("06 - --stdout reads a file without creating an output file", () => {
  let tempFolder = temporaryDirectory();
  let inputPath = path.join(tempFolder, "testfile.csv");
  fs.writeFileSync(inputPath, pipelineInput);

  let result = spawnWithInput(
    tempFolder,
    undefined,
    "testfile.csv",
    "--stdout",
  );

  equal(result.status, 0, "06.01");
  equal(result.stdout, pipelineOutput, "06.02");
  equal(result.stderr, "", "06.03");
  equal(fs.readFileSync(inputPath, "utf8"), pipelineInput, "06.04");
  equal(fs.readdirSync(tempFolder), ["testfile.csv"], "06.05");
});

test("07 - --stdout takes precedence over --overwrite", () => {
  let tempFolder = temporaryDirectory();
  let inputPath = path.join(tempFolder, "testfile.csv");
  fs.writeFileSync(inputPath, pipelineInput);

  let result = spawnWithInput(
    tempFolder,
    undefined,
    "--overwrite",
    "testfile.csv",
    "--stdout",
  );

  equal(result.status, 0, "07.01");
  equal(result.stdout, pipelineOutput, "07.02");
  equal(result.stderr, "", "07.03");
  equal(fs.readFileSync(inputPath, "utf8"), pipelineInput, "07.04");
  equal(fs.readdirSync(tempFolder), ["testfile.csv"], "07.05");
});

test("08 - filter mode sends failures to stderr", () => {
  let tempFolder = temporaryDirectory();
  let result = spawnWithInput(tempFolder, "not a sortable CSV", "-");

  equal(result.status, 1, "08.01");
  equal(result.stdout, "", "08.02");
  match(result.stderr, /csv-sort-cli: Alas, we encountered an error/, "08.03");
  equal(fs.readdirSync(tempFolder), [], "08.04");
});

test("09 - --stdout reports a missing input without creating files", () => {
  let tempFolder = temporaryDirectory();
  let result = spawnWithInput(tempFolder, undefined, "missing.csv", "--stdout");

  equal(result.status, 1, "09.01");
  equal(result.stdout, "", "09.02");
  match(result.stderr, /couldn't fetch the file "missing\.csv"/, "09.03");
  equal(fs.readdirSync(tempFolder), [], "09.04");
});

test("10 - piped stdin takes precedence over --overwrite", () => {
  let tempFolder = temporaryDirectory();
  let result = spawnWithInput(tempFolder, pipelineInput, "--overwrite");

  equal(result.status, 0, "10.01");
  equal(result.stdout, pipelineOutput, "10.02");
  equal(result.stderr, "", "10.03");
  equal(fs.readdirSync(tempFolder), [], "10.04");
});

test("11 - zero-byte stdin never prompts for or rewrites an existing CSV", () => {
  let tempFolder = temporaryDirectory();
  let inputPath = path.join(tempFolder, "testfile.csv");
  fs.writeFileSync(inputPath, pipelineInput);

  let result = spawnWithInput(tempFolder, "");

  equal(result.status, 0, "11.01");
  equal(result.stdout, "", "11.02");
  equal(result.stderr, "", "11.03");
  equal(fs.readFileSync(inputPath, "utf8"), pipelineInput, "11.04");
  equal(fs.readdirSync(tempFolder), ["testfile.csv"], "11.05");
});

test("12 - multi-source stdout is atomic when a later source fails", () => {
  let tempFolder = temporaryDirectory();
  let validPath = path.join(tempFolder, "valid.csv");
  let brokenPath = path.join(tempFolder, "broken.csv");
  fs.writeFileSync(validPath, pipelineInput);
  fs.writeFileSync(brokenPath, "not a sortable CSV");

  let result = spawnWithInput(
    tempFolder,
    undefined,
    "valid.csv",
    "broken.csv",
    "--stdout",
  );

  equal(result.status, 1, "12.01");
  equal(result.stdout, "", "12.02");
  match(result.stderr, /csv-sort-cli: Alas, we encountered an error/, "12.03");
  equal(fs.readFileSync(validPath, "utf8"), pipelineInput, "12.04");
  equal(fs.readFileSync(brokenPath, "utf8"), "not a sortable CSV", "12.05");
  equal(fs.readdirSync(tempFolder), ["broken.csv", "valid.csv"], "12.06");
});

test("13 - an earlier file error does not wait for a later stdin operand", async () => {
  let tempFolder = temporaryDirectory();
  let stdout = "";
  let stderr = "";
  let timedOut = false;
  const child = spawnChild(
    process.execPath,
    [path.resolve(__dirname2, "../cli.js"), "missing.csv", "-", "--stdout"],
    {
      cwd: tempFolder,
      env: childEnvironment(),
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  const result = await new Promise((resolve, reject) => {
    child.once("error", reject);
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, 3000);
    child.once("close", (status, signal) => {
      clearTimeout(timeout);
      resolve({ signal, status });
    });
  });

  equal(timedOut, false, "13.01");
  equal(result, { signal: null, status: 1 }, "13.02");
  equal(stdout, "", "13.03");
  match(stderr, /couldn't fetch the file "missing\.csv"/, "13.04");
  equal(fs.readdirSync(tempFolder), [], "13.05");
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
