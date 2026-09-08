import { spawnSync } from "node:child_process";
import { readdir, readFile, stat, utimes, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { temporaryDirectoryTask } from "tempy";
import { test } from "uvu";
import { equal, match } from "uvu/assert";
import { processFiles } from "../process-files.js";

const cliPath = fileURLToPath(new URL("../cli.js", import.meta.url));
const bumpOnly =
  "  ## 1.0.0\n\n**Note:** Version bump only for package example  ";

function runCli(cwd, ...args) {
  const env = { ...process.env, NO_UPDATE_NOTIFIER: "1" };
  delete env.FORCE_COLOR;
  delete env.NO_COLOR;
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    env,
    encoding: "utf8",
    timeout: 10000,
  });
}

async function writeFixture(filename, contents) {
  await writeFile(filename, contents);
  const timestamp = new Date("2000-01-01T00:00:00Z");
  await utimes(filename, timestamp, timestamp);
  return (await stat(filename)).mtimeMs;
}

test("01 - actual CLI preserves a source whose cleaned result has zero length", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    const filename = path.join(cwd, "changelog.md");
    const originalMtime = await writeFixture(filename, bumpOnly);
    const result = runCli(cwd, "changelog.md");
    equal(result.status, 0, "01.01");
    equal(result.stderr, "", "01.02");
    match(result.stdout, /1 skipped/, "01.03");
    equal(await readFile(filename, "utf8"), bumpOnly, "01.04");
    equal((await stat(filename)).mtimeMs, originalMtime, "01.05");
    equal(await readdir(cwd), ["changelog.md"], "01.06");
  });
});

test("02 - both extras flags retain the original WIP-only source when cleaning is empty", async () => {
  for (const flag of ["-e", "--extras"]) {
    await temporaryDirectoryTask(async (cwd) => {
      const filename = path.join(cwd, "changelog.md");
      const input = "  WIP: unfinished  ";
      const originalMtime = await writeFixture(filename, input);
      const result = runCli(cwd, flag, "changelog.md");
      equal(result.status, 0, `02.01 - ${flag}`);
      match(result.stdout, /1 skipped/, `02.02 - ${flag}`);
      equal(await readFile(filename, "utf8"), input, `02.03 - ${flag}`);
      equal((await stat(filename)).mtimeMs, originalMtime, `02.04 - ${flag}`);
    });
  }
});

test("03 - actual CLI writes retained LF and CRLF then skips an unchanged repeat", async () => {
  for (const eol of ["\n", "\r\n"]) {
    await temporaryDirectoryTask(async (cwd) => {
      const filename = path.join(cwd, "changelog.md");
      const input = bumpOnly.replace(/\n/g, eol) + eol;
      await writeFixture(filename, input);
      const result = runCli(cwd, "changelog.md");
      equal(result.status, 0, `03.01 - ${JSON.stringify(eol)}`);
      match(result.stdout, /1 updated/, `03.02 - ${JSON.stringify(eol)}`);
      equal(
        await readFile(filename, "utf8"),
        eol,
        `03.03 - ${JSON.stringify(eol)}`,
      );
      const updatedMtime = (await stat(filename)).mtimeMs;
      const repeat = runCli(cwd, "changelog.md");
      equal(repeat.status, 0, `03.04 - ${JSON.stringify(eol)}`);
      match(repeat.stdout, /1 skipped/, `03.05 - ${JSON.stringify(eol)}`);
      equal(
        (await stat(filename)).mtimeMs,
        updatedMtime,
        `03.06 - ${JSON.stringify(eol)}`,
      );
      equal(
        await readdir(cwd),
        ["changelog.md"],
        `03.07 - ${JSON.stringify(eol)}`,
      );
    });
  }
});

test("04 - actual cleaner batch reports empty skips and retained writes separately", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    const inputs = [
      bumpOnly,
      `${bumpOnly}\n`,
      `${bumpOnly.replace(/\n/g, "\r\n")}\r\n`,
      "## 1.0.0\n\n- WIP: unfinished\n- Published fix",
    ];
    const paths = inputs.map((_, i) => path.join(cwd, `changelog-${i}.md`));
    for (let i = 0; i < paths.length; i += 1)
      await writeFixture(paths[i], inputs[i]);
    const messages = [];
    const result = await processFiles(paths, {
      transformOptions: { extras: true },
      logger: (message) => messages.push(message),
    });
    equal(
      result,
      { failures: [], skipped: [paths[0]], successful: paths.slice(1) },
      "04.01",
    );
    equal(
      await Promise.all(paths.map((filename) => readFile(filename, "utf8"))),
      [bumpOnly, "\n", "\r\n", "## 1.0.0\n\n- Published fix"],
      "04.02",
    );
    match(messages.join("\n"), /3 updated, 1 skipped/, "04.03");
    const repeated = await processFiles(paths, {
      transformOptions: { extras: true },
      logger: () => {},
    });
    equal(repeated, { failures: [], skipped: paths, successful: [] }, "04.04");
  });
});

test("05 - actual CLI leaves blank input and default WIP text unchanged", async () => {
  for (const input of ["", " \t ", "\n\n", "\r\n \t\r\n", "WIP"]) {
    await temporaryDirectoryTask(async (cwd) => {
      const filename = path.join(cwd, "changelog.md");
      const originalMtime = await writeFixture(filename, input);
      const result = runCli(cwd, "changelog.md");
      equal(result.status, 0, `05.01 - ${JSON.stringify(input)}`);
      match(result.stdout, /1 skipped/, `05.02 - ${JSON.stringify(input)}`);
      equal(
        await readFile(filename, "utf8"),
        input,
        `05.03 - ${JSON.stringify(input)}`,
      );
      equal(
        (await stat(filename)).mtimeMs,
        originalMtime,
        `05.04 - ${JSON.stringify(input)}`,
      );
    });
  }
});

test.run();
