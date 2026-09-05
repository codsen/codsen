import { spawnSync } from "node:child_process";
import { chmod, mkdir, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { version as apiVersion } from "generate-atomic-css";
import { temporaryDirectoryTask } from "tempy";
import { test } from "uvu";
import { equal, match, ok } from "uvu/assert";
import { ProcessingError, processFiles } from "../process-files.js";

const cliPath = fileURLToPath(new URL("../cli.js", import.meta.url));
const { version } = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);

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

test("01 - help flags print usage", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    for (const flag of ["-h", "--help"]) {
      const result = runCli(cwd, flag);
      equal(result.status, 0, "01.01");
      match(result.stdout, /Call either way/, "01.02");
      match(result.stdout, /gac index\.html/, "01.03");
      equal(result.stderr, "", "01.04");
      equal(await readdir(cwd), [], "01.05");
    }
  });
});

test("02 - version flags report the CLI and API versions as documented", async () => {
  await temporaryDirectoryTask((cwd) => {
    const short = runCli(cwd, "-v");
    const long = runCli(cwd, "--version");
    equal(short.status, 0, "02.01");
    equal(short.stdout.trim(), `cli: ${version}; api: ${apiVersion}`, "02.02");
    equal(short.stderr, "", "02.03");
    equal(long.status, 0, "02.04");
    equal(long.stdout.trim(), version, "02.05");
    equal(long.stderr, "", "02.06");
  });
});

test("03 - empty input and unmatched globs do not create files", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    const empty = runCli(cwd);
    const unmatched = runCli(cwd, "*.html");
    equal(empty.status, 0, "03.01");
    equal(empty.stdout, "", "03.02");
    equal(empty.stderr, "", "03.03");
    equal(unmatched.status, 0, "03.04");
    match(unmatched.stdout, /Nothing to process\./, "03.05");
    equal(unmatched.stderr, "", "03.06");
    equal(await readdir(cwd), [], "03.07");
  });
});

test("04 - invalid filesystem paths report discovery failures", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    const result = runCli(cwd, `${"a".repeat(1024)}.html`);
    equal(result.status, 1, "04.01");
    match(result.stdout, /Could not process the requested files/, "04.02");
    equal(result.stdout.includes("Nothing to process"), false, "04.03");
    equal(await readdir(cwd), [], "04.04");
  });
});

test("05 - atomic output creates a missing destination with default mode", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    const filename = path.join(cwd, "new.html");
    const logs = [];
    const result = await processFiles([filename], {
      readFile: async () => "plain text",
      logger: (message) => logs.push(message),
    });
    equal(result, { failures: [], successful: [filename] }, "05.01");
    equal(await readFile(filename, "utf8"), "plain text", "05.02");
    equal(await readdir(cwd), ["new.html"], "05.03");
    match(logs.join("\n"), /1 file updated/, "05.04");
  });
});

test("06 - failed atomic replacement cleans up its temporary file", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    const filename = path.join(cwd, "directory.html");
    await mkdir(filename);
    const logs = [];
    let failure;
    try {
      await processFiles([filename], {
        readFile: async () => "plain text",
        logger: (message) => logs.push(message),
      });
    } catch (error) {
      failure = error;
    }
    ok(failure instanceof ProcessingError, "06.01");
    equal(failure.successful, [], "06.02");
    equal(failure.failures[0].stage, "write", "06.03");
    equal(failure.failures[0].path, filename, "06.04");
    equal(await readdir(cwd), ["directory.html"], "06.05");
    equal((await stat(filename)).isDirectory(), true, "06.06");
    match(logs.join("\n"), /1 file could not be updated/, "06.07");
  });
});

test("07 - string failures are normalized and plural summaries retain successes", async () => {
  const logs = [];
  const writes = [];
  let failure;
  try {
    await processFiles(
      ["bad-1.html", "good-1.html", "bad-2.html", "good-2.html"],
      {
        logger: (message) => logs.push(message),
        readFile: async (filename) => {
          if (filename.startsWith("bad")) {
            throw "read rejected";
          }
          return "unchanged";
        },
        writeFile: async (...args) => writes.push(args),
      },
    );
  } catch (error) {
    failure = error;
  }
  ok(failure instanceof ProcessingError, "07.01");
  equal(failure.message, "2 files could not be updated", "07.02");
  equal(failure.successful, ["good-1.html", "good-2.html"], "07.03");
  equal(
    failure.errors.map((error) => error.message),
    ["read rejected", "read rejected"],
    "07.04",
  );
  equal(
    writes,
    [
      ["good-1.html", "unchanged"],
      ["good-2.html", "unchanged"],
    ],
    "07.05",
  );
  match(logs.join("\n"), /2 files updated/, "07.06");
  match(logs.join("\n"), /2 files could not be updated/, "07.07");
  match(logs.join("\n"), /bad-1\.html - bad-2\.html/, "07.08");
});

test("08 - an existing destination retains its mode after replacement", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    const filename = path.join(cwd, "existing.html");
    await processFiles([filename], {
      readFile: async () => "original",
      logger: () => {},
    });
    await chmod(filename, 0o640);
    const originalMode = (await stat(filename)).mode;
    await processFiles([filename], {
      transform: () => "replacement",
      logger: () => {},
    });
    equal(await readFile(filename, "utf8"), "replacement", "08.01");
    equal((await stat(filename)).mode, originalMode, "08.02");
    equal(await readdir(cwd), ["existing.html"], "08.03");
  });
});

test.run();
