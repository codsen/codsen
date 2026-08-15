import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, ok } from "uvu/assert";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const gateCommand = "npm run test:ops-helpers";
const packageBuild = "npm run ci:verify:info";

function readRepositoryFile(relative) {
  return readFileSync(path.join(repositoryRoot, relative), "utf8");
}

function occurrences(source, needle) {
  return source.split(needle).length - 1;
}

test("01 - one root script defines the ops tooling suite", () => {
  const manifest = JSON.parse(readRepositoryFile("package.json"));

  equal(manifest.scripts["test:ops-helpers"], "uvu ops/helpers", "01.01");
  ok(manifest.scripts.unit.includes(gateCommand), "01.02");
  ok(manifest.scripts.verify.includes(gateCommand), "01.03");
});

test("02 - hosted CI runs the suite after the package build", () => {
  const workflow = readRepositoryFile(".github/workflows/ci.yml");
  const build = workflow.indexOf(packageBuild);

  equal(occurrences(workflow, gateCommand), 1, "02.01");
  ok(build > -1, "02.02");
  // the suite audits real package unit runs, so it needs built dist output
  ok(build < workflow.indexOf(gateCommand), "02.03");
});

test("03 - the release pack job runs the suite before packing", () => {
  const workflow = readRepositoryFile(".github/workflows/release.yml");
  const build = workflow.indexOf(packageBuild);
  const gate = workflow.indexOf(gateCommand);

  equal(occurrences(workflow, gateCommand), 1, "03.01");
  ok(build > -1, "03.02");
  ok(build < gate, "03.03");
  ok(gate < workflow.indexOf("npm-release.js pack"), "03.04");
});

test.run();
