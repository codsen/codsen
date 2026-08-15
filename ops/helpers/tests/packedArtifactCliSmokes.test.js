import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  assertFunctionalCliSmokeCoverage,
  assertFunctionalCliSmokeInventory,
  FUNCTIONAL_CLI_SMOKES,
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

test.run();
