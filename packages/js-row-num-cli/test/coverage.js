import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import { temporaryDirectoryTask } from "tempy";
import { test } from "uvu";
import { equal, match, ok } from "uvu/assert";
import { ProcessingError, processFiles } from "../process-files.js";

const cliPath = fileURLToPath(new URL("../cli.js", import.meta.url));

function runCli(cwd, ...args) {
  const environment = { ...process.env, NO_UPDATE_NOTIFIER: "1" };
  delete environment.FORCE_COLOR;
  delete environment.NO_COLOR;
  return execa(process.execPath, [cliPath, ...args], {
    cwd,
    env: environment,
    extendEnv: false,
    reject: false,
  });
}

test("01 - short and long help flags print usage without updating files", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const inputPath = path.join(tempFolder, "cli.js");
    const contents = "log('999 source');";
    await writeFile(inputPath, contents);
    for (const flag of ["-h", "--help"]) {
      const result = await runCli(tempFolder, flag);

      equal(result.exitCode, 0, "01.01");
      match(result.stdout, /Call either way:/, "01.02");
      match(result.stdout, /--trigger/, "01.03");
      equal(result.stderr, "", "01.04");
      equal(await readFile(inputPath, "utf8"), contents, "01.05");
      equal(await readdir(tempFolder), ["cli.js"], "01.06");
    }
  });
});

test("02 - short and long version flags print the package version", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const { version } = JSON.parse(
      await readFile(new URL("../package.json", import.meta.url), "utf8"),
    );
    for (const flag of ["-v", "--version"]) {
      const result = await runCli(tempFolder, flag);

      equal(result.exitCode, 0, "02.01");
      equal(result.stdout, version, "02.02");
      equal(result.stderr, "", "02.03");
      equal(await readdir(tempFolder), [], "02.04");
    }
  });
});

test("03 - an empty directory reports that nothing needs fixing", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const result = await runCli(tempFolder);

    equal(result.exitCode, 0, "03.01");
    match(result.stdout, /Nothing to fix\./, "03.02");
    equal(result.stderr, "", "03.03");
    equal(await readdir(tempFolder), [], "03.04");
  });
});

test("04 - an invalid filesystem name reports a glob failure", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    // A single component exceeds the supported filename length on every lane.
    const result = await runCli(tempFolder, `${"x".repeat(300)}.js`);

    equal(result.exitCode, 1, "04.01");
    match(result.stdout, /Could not process the requested files/, "04.02");
    equal(result.stdout.includes("file updated"), false, "04.03");
    equal(result.stdout.includes("Nothing to fix"), false, "04.04");
    equal(result.stderr, "", "04.05");
    equal(await readdir(tempFolder), [], "04.06");
  });
});

test("05 - atomic writing can create a file whose contents were supplied separately", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const inputPath = path.join(tempFolder, "new.js");
    const logs = [];
    const result = await processFiles([inputPath], {
      logger: (message) => logs.push(message),
      readFile: async () => "log('999 source');",
      transformOptions: { triggerKeywords: ["log"], padStart: 2 },
    });

    equal(result, { successful: [inputPath], failures: [] }, "05.01");
    equal(await readFile(inputPath, "utf8"), "log('01 source');", "05.02");
    equal(await readdir(tempFolder), ["new.js"], "05.03");
    match(logs.join("\n"), /1 file updated/, "05.04");
  });
});

test("06 - a failed atomic rename removes its temporary file and preserves the destination", async () => {
  await temporaryDirectoryTask(async (tempFolder) => {
    const destination = path.join(tempFolder, "destination.js");
    await mkdir(destination);
    await writeFile(path.join(destination, "keep.txt"), "keep this content");
    const logs = [];
    let receivedError;
    try {
      await processFiles([destination], {
        logger: (message) => logs.push(message),
        readFile: async () => "const source = 1;",
      });
    } catch (error) {
      receivedError = error;
    }

    ok(receivedError instanceof ProcessingError, "06.01");
    equal(receivedError.successful, [], "06.02");
    equal(receivedError.failures.length, 1, "06.03");
    equal(receivedError.failures[0].path, destination, "06.04");
    equal(receivedError.failures[0].stage, "write", "06.05");
    equal(await readdir(tempFolder), ["destination.js"], "06.06");
    equal(await readdir(destination), ["keep.txt"], "06.07");
    equal(
      await readFile(path.join(destination, "keep.txt"), "utf8"),
      "keep this content",
      "06.08",
    );
    match(logs.join("\n"), /BAD.*\(write\)/, "06.09");
    equal(logs.join("\n").includes("\u001b[32m"), false, "06.10");
  });
});

test("07 - non-Error failures are normalized and every failed stage is reported", async () => {
  const logs = [];
  let receivedError;
  try {
    await processFiles(["read.js", "transform.js", "write.js"], {
      logger: (message) => logs.push(message),
      readFile: async (filePath) => {
        if (filePath === "read.js") {
          throw "read failure";
        }
        return filePath;
      },
      transform: (contents) => {
        if (contents === "transform.js") {
          throw 17;
        }
        return contents;
      },
      writeFile: async () => {
        throw null;
      },
    });
  } catch (error) {
    receivedError = error;
  }

  ok(receivedError instanceof ProcessingError, "07.01");
  equal(receivedError.message, "3 files could not be updated", "07.02");
  equal(receivedError.successful, [], "07.03");
  equal(
    receivedError.failures.map(({ path: filePath, stage, error }) => ({
      path: filePath,
      stage,
      message: error.message,
    })),
    [
      { path: "read.js", stage: "read", message: "read failure" },
      { path: "transform.js", stage: "transform", message: "17" },
      { path: "write.js", stage: "write", message: "null" },
    ],
    "07.04",
  );
  equal(
    receivedError.errors.every((error) => error instanceof Error),
    true,
    "07.05",
  );
  match(logs.join("\n"), /3 files could not be updated/, "07.06");
  match(logs.join("\n"), /read\.js - transform\.js - write\.js/, "07.07");
});

test("08 - a successful batch reports every written file in operand order", async () => {
  const logs = [];
  const writes = [];
  const result = await processFiles(["first.js", "second.js"], {
    logger: (message) => logs.push(message),
    readFile: async (filePath) => `contents of ${filePath}`,
    transform: (contents) => contents.toUpperCase(),
    writeFile: async (filePath, contents) => {
      writes.push([filePath, contents]);
    },
  });

  equal(
    result,
    { successful: ["first.js", "second.js"], failures: [] },
    "08.01",
  );
  equal(
    writes,
    [
      ["first.js", "CONTENTS OF FIRST.JS"],
      ["second.js", "CONTENTS OF SECOND.JS"],
    ],
    "08.02",
  );
  match(logs.join("\n"), /2 files updated/, "08.03");
  equal(logs.length, 3, "08.04");
});

test.run();
