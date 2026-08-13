import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "uvu";
import { equal, match } from "uvu/assert";

const cliPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../cli.js",
);

function runCli(...args) {
  const env = { ...process.env, NO_UPDATE_NOTIFIER: "1" };
  delete env.FORCE_COLOR;
  delete env.NO_COLOR;
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
    env,
  });
}

test("01 - prints the default banner", () => {
  const result = runCli();

  equal(result.status, 0, "01.01");
  equal(result.stdout.trim(), "C O D S E N", "01.02");
  equal(result.stderr, "", "01.03");
});

test("02 - reports the version through both flags", () => {
  const shortResult = runCli("-v");
  const longResult = runCli("--version");

  equal(shortResult.status, 0, "02.01");
  match(shortResult.stdout.trim(), /^\d+\.\d+\.\d+$/, "02.02");
  equal(longResult.status, 0, "02.03");
  equal(longResult.stdout, shortResult.stdout, "02.04");
});

test("03 - reports help through both flags", () => {
  const shortResult = runCli("-h");
  const longResult = runCli("--help");

  equal(shortResult.status, 0, "03.01");
  match(shortResult.stdout, /Usage/, "03.02");
  match(shortResult.stdout, /Options/, "03.03");
  equal(longResult.status, 0, "03.04");
  equal(longResult.stdout, shortResult.stdout, "03.05");
});

test.run();
