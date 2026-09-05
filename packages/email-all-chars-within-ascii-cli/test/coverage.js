import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import { temporaryDirectoryTask } from "tempy";
import { test } from "uvu";
import { equal, match } from "uvu/assert";

const cliPath = fileURLToPath(new URL("../cli.js", import.meta.url));
const selectionPrompt = "Which file would you like to check?";

function childEnvironment() {
  const environment = { ...process.env, NO_UPDATE_NOTIFIER: "1" };
  delete environment.FORCE_COLOR;
  delete environment.NO_COLOR;
  return environment;
}

function runCli(cwd, ...args) {
  return execa(process.execPath, [cliPath, ...args], {
    cwd,
    env: childEnvironment(),
    extendEnv: false,
    reject: false,
  });
}

function selectFile(cwd, answer, ...args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, ...args], {
      cwd,
      env: childEnvironment(),
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let answered = false;
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, 10000);
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      if (!answered && stdout.includes(selectionPrompt)) {
        answered = true;
        child.stdin.write(answer);
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
      clearTimeout(timeout);
      child.kill("SIGKILL");
      reject(error);
    });
    child.once("close", (status, signal) => {
      clearTimeout(timeout);
      resolve({ status, signal, stdout, stderr, answered, timedOut });
    });
  });
}

test("01 - interactive selection checks the selected file without changing it", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const inputPath = path.join(tempFolder, "input.html");
    await writeFile(inputPath, "<p>All ASCII</p>");
    const result = await selectFile(tempFolder, "\r");

    equal(result.timedOut, false, "01.01");
    equal(result.signal, null, "01.02");
    equal(result.status, 0, "01.03");
    equal(result.answered, true, "01.04");
    match(result.stdout, /ALL OK/, "01.05");
    equal(result.stderr, "", "01.06");
    equal(await readFile(inputPath, "utf8"), "<p>All ASCII</p>", "01.07");
    equal(await readdir(tempFolder), ["input.html"], "01.08");
  });
});

test("02 - a missing operand falls back to interactive file selection", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    await writeFile(path.join(tempFolder, "input.html"), "ASCII");
    const result = await selectFile(tempFolder, "\r", "missing.html");

    equal(result.timedOut, false, "02.01");
    equal(result.signal, null, "02.02");
    equal(result.status, 0, "02.03");
    equal(result.answered, true, "02.04");
    match(result.stdout, /THROW_ID_03/, "02.05");
    match(result.stdout, /ALL OK/, "02.06");
    equal(result.stderr, "", "02.07");
  });
});

test("03 - no operands in an empty directory report that no files are available", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const result = await runCli(tempFolder);

    equal(result.exitCode, 1, "03.01");
    match(result.stdout, /THROW_ID_01/, "03.02");
    match(result.stdout, /there are no files in this folder/, "03.03");
    equal(result.stdout.includes(selectionPrompt), false, "03.04");
    equal(result.stderr, "", "03.05");
    equal(await readdir(tempFolder), [], "03.06");
  });
});

test("04 - missing files are reported while a valid operand is still checked", async () => {
  for (const missing of [["missing.html"], ["missing.html", "absent.html"]]) {
    await temporaryDirectoryTask(async (tempFolder) => {
      const inputPath = path.join(tempFolder, "input.html");
      await writeFile(inputPath, "ASCII");
      const result = await runCli(tempFolder, "input.html", ...missing);

      equal(result.exitCode, 0, "04.01");
      match(result.stdout, /THROW_ID_02/, "04.02");
      match(
        result.stdout,
        missing.length === 1
          ? 'the following file doesn\'t exist: "missing.html"'
          : 'the following files don\'t exist: "missing.html", "absent.html"',
        "04.03",
      );
      match(result.stdout, /ALL OK/, "04.04");
      equal(result.stderr, "", "04.05");
      equal(await readFile(inputPath, "utf8"), "ASCII", "04.06");
      equal(await readdir(tempFolder), ["input.html"], "04.07");
    });
  }
});

test("05 - a custom line limit reports long lines with indented context", async () => {
  for (const flag of ["-l", "--len"]) {
    await temporaryDirectoryTask(async (tempFolder) => {
      const inputPath = path.join(tempFolder, "input.html");
      const contents = "  abcdef\r\n";
      await writeFile(inputPath, contents);
      const result = await runCli(tempFolder, "input.html", flag, "3");

      equal(result.exitCode, 1, "05.01");
      match(result.stdout, /8 character-long line \(limit 3\)/, "05.02");
      match(result.stdout, /abcdef/, "05.03");
      match(result.stdout, /~/, "05.04");
      equal(result.stdout.includes("bad character"), false, "05.05");
      equal(result.stderr, "", "05.06");
      equal(await readFile(inputPath, "utf8"), contents, "05.07");
    });
  }
});

test("06 - a directory operand reports a read failure", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    await mkdir(path.join(tempFolder, "input.html"));
    const result = await runCli(tempFolder, "input.html");

    equal(result.exitCode, 1, "06.01");
    match(result.stdout, /THROW_ID_04/, "06.02");
    match(result.stdout, /Couldn't fetch the file "input.html"/, "06.03");
    equal(result.stderr, "", "06.04");
    equal(await readdir(tempFolder), ["input.html"], "06.05");
  });
});

test("07 - cancelling file selection exits unsuccessfully without checking a file", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const inputPath = path.join(tempFolder, "input.html");
    await writeFile(inputPath, "ASCII");
    const result = await selectFile(tempFolder, "\u0003");

    equal(result.timedOut, false, "07.01");
    equal(result.signal, null, "07.02");
    equal(result.status, 1, "07.03");
    equal(result.answered, true, "07.04");
    equal(result.stdout.includes("ALL OK"), false, "07.05");
    equal(result.stderr, "", "07.06");
    equal(await readFile(inputPath, "utf8"), "ASCII", "07.07");
    equal(await readdir(tempFolder), ["input.html"], "07.08");
  });
});

test.run();
