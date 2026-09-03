import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  assertFunctionalCliSmokeCoverage,
  assertFunctionalCliSmokeInventory,
  FUNCTIONAL_CLI_SMOKES,
  runFunctionalCliSmoke,
} from "../packedArtifactCliSmokes.js";
import { readWorkspaceRecords } from "../workspaceInventoryFile.js";

const REPOSITORY_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

test("01 - meaningful smoke registrations exactly cover every current CLI", () => {
  const clis = readWorkspaceRecords(REPOSITORY_ROOT)
    .filter(({ manifest }) => manifest.bin)
    .map(({ manifest }) => ({ name: manifest.name }));
  assertFunctionalCliSmokeInventory(clis);
  equal(Object.keys(FUNCTIONAL_CLI_SMOKES).length, clis.length, "01.01");
});

test("02 - release subsets require a meaningful smoke for every selected CLI", () => {
  assertFunctionalCliSmokeCoverage([{ name: "json-sort-cli" }]);
  equal(true, true, "02.01");
  throws(
    () => assertFunctionalCliSmokeCoverage([{ name: "unknown-cli" }]),
    /No meaningful packed-artifact smoke test is registered/,
    "02.02",
  );
});

test("03 - json-sort-cli smoke forwards stdin and checks clean stdout", () => {
  const consumerDirectory = temporaryDirectory();
  const calls = [];
  runFunctionalCliSmoke({
    cli: {
      bins: { jsonsort: "cli.js" },
      name: "json-sort-cli",
    },
    consumerDirectory,
    runBinary(options) {
      calls.push(options);
      if (options.input !== undefined) {
        return {
          stderr: "",
          stdout: '{\n  "a": 2,\n  "z": 1\n}\n',
        };
      }
      const filename = path.join(options.cwd, options.args[0]);
      const parsed = JSON.parse(readFileSync(filename, "utf8"));
      writeFileSync(
        filename,
        `${JSON.stringify({ a: parsed.a, z: parsed.z }, null, 2)}\n`,
      );
      return { stderr: "", stdout: "" };
    },
  });

  equal(calls.length, 2, "03.01");
  equal(calls[0].args, ["sort me.json"], "03.02");
  equal(calls[0].input, undefined, "03.03");
  equal(calls[1].args, [], "03.04");
  equal(calls[1].input, '{"z":1,"a":2}\n', "03.05");
});

test.run();
