// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { spawn as spawnChild, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { temporaryDirectory, temporaryDirectoryTask } from "tempy";
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

function spawnInteractive(tempFolder, answers, ...args) {
  return new Promise((resolve, reject) => {
    // Exercise the actual prompts with pipes, while selecting the TTY-only mode.
    const child = spawnChild(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        `import { pathToFileURL } from "node:url";
process.stdin.isTTY = true;
await import(pathToFileURL(process.argv[1]).href);`,
        path.resolve(__dirname2, "../cli.js"),
        ...args,
      ],
      {
        cwd: tempFolder,
        env: childEnvironment(),
        stdio: ["pipe", "pipe", "pipe"],
      },
    );
    let stdout = "";
    let stderr = "";
    let answersSent = 0;
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, 10000);
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      const answer = answers[answersSent];
      if (answer && stdout.includes(answer.prompt)) {
        answersSent += 1;
        child.stdin.write(answer.input);
      }
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.stdin.once("error", (error) => {
      child.kill("SIGKILL");
      clearTimeout(timeout);
      reject(error);
    });
    child.once("close", (status, signal) => {
      clearTimeout(timeout);
      resolve({ status, signal, stdout, stderr, answersSent, timedOut });
    });
  });
}

const selectFirstCsv = {
  prompt: "Which CSV would you like to check?",
  input: "\r",
};
const overwritePrompt =
  "Do you want to overwrite this file with a sorted result?";

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

test("14 - --overwrite replaces a nested relative path", async () => {
  await temporaryDirectoryTask((tempFolder) => {
    let nestedFolder = path.join(tempFolder, "nested");
    let inputPath = path.join(nestedFolder, "input.csv");
    fs.mkdirSync(nestedFolder);
    fs.writeFileSync(inputPath, pipelineInput);

    let result = spawnWithInput(
      tempFolder,
      undefined,
      "nested/input.csv",
      "--overwrite",
    );

    equal(result.status, 0, "14.01");
    equal(result.stdout, "", "14.02");
    equal(fs.readFileSync(inputPath, "utf8"), pipelineOutput, "14.03");
    equal(fs.readdirSync(tempFolder), ["nested"], "14.04");
    equal(fs.readdirSync(nestedFolder), ["input.csv"], "14.05");
  });
});

test("15 - --overwrite keeps same-basename relative and absolute paths separate", async () => {
  await temporaryDirectoryTask((tempFolder) => {
    let relativeFolder = path.join(tempFolder, "relative");
    let absoluteFolder = path.join(tempFolder, "absolute");
    let relativePath = path.join(relativeFolder, "input.csv");
    let absolutePath = path.join(absoluteFolder, "input.csv");
    let absoluteInput = pipelineInput.replaceAll("123456", "654321");
    let absoluteOutput = pipelineOutput.replaceAll("123456", "654321");
    fs.mkdirSync(relativeFolder);
    fs.mkdirSync(absoluteFolder);
    fs.writeFileSync(relativePath, pipelineInput);
    fs.writeFileSync(absolutePath, absoluteInput);

    let result = spawnWithInput(
      tempFolder,
      undefined,
      "relative/input.csv",
      absolutePath,
      "--overwrite",
    );

    equal(result.status, 0, "15.01");
    equal(result.stdout, "", "15.02");
    equal(fs.readFileSync(relativePath, "utf8"), pipelineOutput, "15.03");
    equal(fs.readFileSync(absolutePath, "utf8"), absoluteOutput, "15.04");
    equal(fs.readdirSync(tempFolder).sort(), ["absolute", "relative"], "15.05");
    equal(fs.readdirSync(relativeFolder), ["input.csv"], "15.06");
    equal(fs.readdirSync(absoluteFolder), ["input.csv"], "15.07");
  });
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

test("16 - short and long help flags print usage without processing input", async () => {
  await temporaryDirectoryTask((tempFolder) => {
    for (const flag of ["-h", "--help"]) {
      const result = spawnWithInput(tempFolder, "not a sortable CSV", flag);

      equal(result.status, 0, "16.01");
      match(result.stdout, /Usage/, "16.02");
      match(result.stdout, /csvsort YOURFILE\.csv/, "16.03");
      equal(result.stderr, "", "16.04");
      equal(fs.readdirSync(tempFolder), [], "16.05");
    }
  });
});

test("17 - short and long version flags print the package version", async () => {
  await temporaryDirectoryTask((tempFolder) => {
    const { version } = JSON.parse(
      fs.readFileSync(path.resolve(__dirname2, "../package.json"), "utf8"),
    );
    for (const flag of ["-v", "--version"]) {
      const result = spawnWithInput(tempFolder, "not a sortable CSV", flag);

      equal(result.status, 0, "17.01");
      equal(result.stdout, `${version}\n`, "17.02");
      equal(result.stderr, "", "17.03");
      equal(fs.readdirSync(tempFolder), [], "17.04");
    }
  });
});

test("18 - interactive selection can keep the original file", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const inputPath = path.join(tempFolder, "input.csv");
    fs.writeFileSync(inputPath, pipelineInput);
    const result = await spawnInteractive(tempFolder, [
      selectFirstCsv,
      { prompt: overwritePrompt, input: "n\r" },
    ]);

    equal(result.timedOut, false, "18.01");
    equal(result.signal, null, "18.02");
    equal(result.status, 0, "18.03");
    equal(result.answersSent, 2, "18.04");
    match(result.stderr, /A new file, input-1\.csv has been created/, "18.05");
    equal(fs.readFileSync(inputPath, "utf8"), pipelineInput, "18.06");
    equal(
      fs.readFileSync(path.join(tempFolder, "input-1.csv"), "utf8"),
      pipelineOutput,
      "18.07",
    );
    equal(fs.readdirSync(tempFolder), ["input-1.csv", "input.csv"], "18.08");
  });
});

test("19 - interactive selection can confirm overwriting the original", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const inputPath = path.join(tempFolder, "input.csv");
    fs.writeFileSync(inputPath, pipelineInput);
    const result = await spawnInteractive(tempFolder, [
      selectFirstCsv,
      { prompt: overwritePrompt, input: "y\r" },
    ]);

    equal(result.timedOut, false, "19.01");
    equal(result.signal, null, "19.02");
    equal(result.status, 0, "19.03");
    equal(result.answersSent, 2, "19.04");
    match(result.stderr, /input\.csv has been fixed and overwritten/, "19.05");
    equal(fs.readFileSync(inputPath, "utf8"), pipelineOutput, "19.06");
    equal(fs.readdirSync(tempFolder), ["input.csv"], "19.07");
  });
});

test("20 - interactive mode reports an empty directory without prompting", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const result = await spawnInteractive(tempFolder, []);

    equal(result.timedOut, false, "20.01");
    equal(result.signal, null, "20.02");
    equal(result.status, 1, "20.03");
    equal(result.stdout, "", "20.04");
    match(result.stderr, /couldn't find any CSV files in this folder/, "20.05");
    equal(fs.readdirSync(tempFolder), [], "20.06");
  });
});

test("21 - missing operands fall back to selection and preserve -o", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const inputPath = path.join(tempFolder, "input.csv");
    fs.writeFileSync(inputPath, pipelineInput);
    const result = await spawnInteractive(
      tempFolder,
      [selectFirstCsv],
      "missing.csv",
      "-o",
    );

    equal(result.timedOut, false, "21.01");
    equal(result.signal, null, "21.02");
    equal(result.status, 0, "21.03");
    equal(result.answersSent, 1, "21.04");
    equal(result.stdout.includes(overwritePrompt), false, "21.05");
    match(
      result.stderr,
      /didn't recognise any CSV files in your input/,
      "21.06",
    );
    match(result.stderr, /But it recognised your "-o" flag/, "21.07");
    match(result.stderr, /input\.csv has been fixed and overwritten/, "21.08");
    equal(fs.readFileSync(inputPath, "utf8"), pipelineOutput, "21.09");
    equal(fs.readdirSync(tempFolder), ["input.csv"], "21.10");
  });
});

test("22 - missing operands fail when no fallback CSV is available", async () => {
  await temporaryDirectoryTask((tempFolder) => {
    const result = spawnWithInput(tempFolder, undefined, "missing.csv");

    equal(result.status, 1, "22.01");
    equal(result.stdout, "", "22.02");
    match(
      result.stderr,
      /didn't recognise any CSV files in your input/,
      "22.03",
    );
    match(result.stderr, /couldn't find any CSV files in this folder/, "22.04");
    equal(result.stderr.includes('recognised your "-o" flag'), false, "22.05");
    equal(fs.readdirSync(tempFolder), [], "22.06");
  });
});

test("23 - valid operands are sorted while missing files are reported", async () => {
  for (const missing of [["missing.csv"], ["missing.csv", "absent.csv"]]) {
    await temporaryDirectoryTask((tempFolder) => {
      const inputPath = path.join(tempFolder, "input.csv");
      fs.writeFileSync(inputPath, pipelineInput);
      const result = spawnWithInput(
        tempFolder,
        undefined,
        "input.csv",
        ...missing,
      );
      const expectedWarning =
        missing.length === 1
          ? 'the following file doesn\'t exist: "missing.csv"'
          : 'the following files don\'t exist: "missing.csv", "absent.csv"';

      equal(result.status, 0, "23.01");
      equal(result.stdout, "", "23.02");
      match(result.stderr, expectedWarning, "23.03");
      match(
        result.stderr,
        /A new file, input-1\.csv has been created/,
        "23.04",
      );
      equal(fs.readFileSync(inputPath, "utf8"), pipelineInput, "23.05");
      equal(
        fs.readFileSync(path.join(tempFolder, "input-1.csv"), "utf8"),
        pipelineOutput,
        "23.06",
      );
      equal(fs.readdirSync(tempFolder), ["input-1.csv", "input.csv"], "23.07");
    });
  }
});

test("24 - skips occupied output names and processes duplicate operands once", async () => {
  await temporaryDirectoryTask((tempFolder) => {
    const inputPath = path.join(tempFolder, "input.csv");
    const existingPath = path.join(tempFolder, "input-1.csv");
    fs.writeFileSync(inputPath, pipelineInput);
    fs.writeFileSync(existingPath, "existing output");
    const result = spawnWithInput(
      tempFolder,
      undefined,
      "input.csv",
      "input.csv",
    );

    equal(result.status, 0, "24.01");
    equal(result.stdout, "", "24.02");
    match(result.stderr, /A new file, input-2\.csv has been created/, "24.03");
    equal(result.stderr.match(/has been created/g)?.length, 1, "24.04");
    equal(fs.readFileSync(inputPath, "utf8"), pipelineInput, "24.05");
    equal(fs.readFileSync(existingPath, "utf8"), "existing output", "24.06");
    equal(
      fs.readFileSync(path.join(tempFolder, "input-2.csv"), "utf8"),
      pipelineOutput,
      "24.07",
    );
    equal(
      fs.readdirSync(tempFolder),
      ["input-1.csv", "input-2.csv", "input.csv"],
      "24.08",
    );
  });
});

test("25 - output-name exhaustion reports an error and preserves every file", async () => {
  await temporaryDirectoryTask((tempFolder) => {
    const inputPath = path.join(tempFolder, "input.csv");
    fs.writeFileSync(inputPath, pipelineInput);
    const occupiedPaths = Array.from({ length: 1000 }, (_, index) =>
      path.join(tempFolder, `input-${index + 1}.csv`),
    );
    for (const occupiedPath of occupiedPaths) {
      fs.writeFileSync(occupiedPath, "existing output");
    }
    const originalNames = fs.readdirSync(tempFolder);
    const result = spawnWithInput(tempFolder, undefined, "input.csv");

    equal(result.status, 1, "25.01");
    equal(result.stdout, "", "25.02");
    match(
      result.stderr,
      /csv-sort-cli: Alas, we encountered an error/,
      "25.03",
    );
    match(
      result.stderr,
      /Could not create an output file for "input\.csv" because names 1–1000 are already taken/,
      "25.04",
    );
    equal(result.stderr.includes("Yay!"), false, "25.05");
    equal(fs.readFileSync(inputPath, "utf8"), pipelineInput, "25.06");
    equal(fs.readdirSync(tempFolder), originalNames, "25.07");
    equal(
      occupiedPaths.every(
        (occupiedPath) =>
          fs.readFileSync(occupiedPath, "utf8") === "existing output",
      ),
      true,
      "25.08",
    );
  });
});

test.run();
