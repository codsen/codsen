import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match } from "uvu/assert";

const script = fileURLToPath(
  new URL("../../scripts/package-node-compatibility.js", import.meta.url),
);

function run(args) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: path.resolve(path.dirname(script), "../.."),
    encoding: "utf8",
  });
}

test("01 - documents pack, verify, and smoke command boundaries", () => {
  const result = run(["--help"]);

  equal(result.status, 0, "01.01");
  match(result.stdout, / pack --output <directory>/, "01.02");
  match(result.stdout, / verify --artifacts <directory>/, "01.03");
  match(result.stdout, / smoke --artifacts <directory>/, "01.04");
  equal(result.stderr, "", "01.05");
});

test("02 - smoke rejects verify-only options", () => {
  const result = run([
    "smoke",
    "--artifacts",
    "/controlled/artifacts",
    "--node-major",
    "24",
  ]);

  equal(result.status, 1, "02.01");
  match(result.stderr, /Unknown option for smoke: --node-major/, "02.02");
});

test("03 - smoke requires artifacts before performing effects", () => {
  const result = run(["smoke"]);

  equal(result.status, 1, "03.01");
  match(result.stderr, /Option --artifacts is required/, "03.02");
});

test.run();
