import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stripVTControlCharacters } from "node:util";
import { test } from "uvu";
import { equal } from "uvu/assert";

const cli = fileURLToPath(new URL("../cli.js", import.meta.url));

async function fixture({ malformed = false, operation } = {}, check) {
  const directory = await mkdtemp(path.join(tmpdir(), "json comb errors "));
  const first = path.join(directory, "first.json");
  const second = path.join(directory, "second.json");
  const contents = malformed ? "{" : '{"a":"first"}\n';
  try {
    await writeFile(first, contents);
    await writeFile(second, '{"b":"second"}\n');
    const args = [];
    if (operation) {
      const preload = path.join(directory, "filesystem.cjs");
      // Inject a portable filesystem failure while exercising the actual CLI.
      // Only this fixture path changes; module loading and file discovery remain real.
      await writeFile(
        preload,
        `const io = require("node:fs/promises");
const path = require("node:path");
const { syncBuiltinESMExports } = require("node:module");
const operation = ${JSON.stringify(operation)};
const original = io[operation];
io[operation] = function (filename, ...args) {
  if (path.resolve(String(filename)) === path.resolve(${JSON.stringify(first)})) {
    const error = new Error("EACCES: simulated " + operation + " failure, '" + filename + "'");
    error.code = "EACCES";
    return Promise.reject(error);
  }
  return original(filename, ...args);
};
syncBuiltinESMExports();
`,
      );
      args.push("--require", preload);
    }
    const env = { ...process.env, CI: "true", NO_UPDATE_NOTIFIER: "1" };
    delete env.FORCE_COLOR;
    const result = spawnSync(
      process.execPath,
      [...args, cli, "--normalise", directory],
      {
        encoding: "utf8",
        timeout: 10000,
        env,
      },
    );
    if (result.error) throw result.error;
    await check({
      ...result,
      stderr: stripVTControlCharacters(result.stderr).split(path.sep).join("/"),
      first,
      errorPath: first.split(path.sep).join("/"),
      second,
      contents,
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("01 - malformed JSON is reported without an unhandled rejection", async () => {
  await fixture({ malformed: true }, async (result) => {
    equal(result.status, 1, "01.01");
    equal(result.signal, null, "01.02");
    equal(result.stderr.startsWith("✨ JSON Comb: [ID_3] "), true, "01.03");
    equal(result.stderr.includes(result.errorPath), true, "01.04");
    equal(result.stderr.includes("\n    at "), false, "01.05");
    equal(result.stdout, "", "01.06");
    equal(await readFile(result.first, "utf8"), result.contents, "01.07");
    equal(await readFile(result.second, "utf8"), '{"b":"second"}\n', "01.08");
  });
});

test("02 - filesystem read failures produce a diagnostic and failing exit", async () => {
  await fixture({ operation: "readFile" }, async (result) => {
    equal(result.status, 1, "02.01");
    equal(result.signal, null, "02.02");
    equal(
      result.stderr.startsWith("✨ JSON Comb: [ID_3] EACCES:"),
      true,
      "02.03",
    );
    equal(result.stderr.includes(result.errorPath), true, "02.04");
    equal(result.stderr.includes("\n    at "), false, "02.05");
    equal(result.stdout, "", "02.06");
    equal(await readFile(result.first, "utf8"), result.contents, "02.07");
    equal(await readFile(result.second, "utf8"), '{"b":"second"}\n', "02.08");
  });
});

test("03 - filesystem write failures produce a diagnostic and failing exit", async () => {
  await fixture({ operation: "writeFile" }, async (result) => {
    equal(result.status, 1, "03.01");
    equal(result.signal, null, "03.02");
    equal(
      result.stderr.startsWith("✨ JSON Comb: [ID_3] EACCES:"),
      true,
      "03.03",
    );
    equal(result.stderr.includes(result.errorPath), true, "03.04");
    equal(result.stderr.includes("\n    at "), false, "03.05");
    equal(await readFile(result.first, "utf8"), result.contents, "03.06");
  });
});

test.run();
