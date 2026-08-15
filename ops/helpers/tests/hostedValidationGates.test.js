import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, ok } from "uvu/assert";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const sharedAction = ".github/actions/verify-repository/action.yml";
const sharedActionUse = "uses: ./.github/actions/verify-repository";
const gateCommand = "npm run test:ops-helpers";
const packageBuild = "npm run ci:verify:info";

// every policy gate the hosted lanes must run, whichever lane triggered them
const requiredGates = [
  "node ops/scripts/audit-production-dependencies.js --check-policy",
  "npm run ci:verify:package-kinds",
  "npm run ci:verify:debug-log-line-labels",
  "npm run ci:verify:debug-log-production-cost",
  "npm run ci:verify:test-numbering",
  "npm run ci:verify:coverage-policy",
  "npm run test:quality",
  "npm run ci:verify:node-compatibility",
  "npm run ci:verify:browser-iifes",
  "npm run ci:verify:data",
  "npm run lint:markdown",
  "npm run typecheck",
  gateCommand,
];

function readRepositoryFile(relative) {
  return readFileSync(path.join(repositoryRoot, relative), "utf8");
}

function occurrences(source, needle) {
  return source.split(needle).length - 1;
}

// one job's steps, so a later job cannot satisfy an assertion about this one
function jobSection(workflow, job) {
  const start = workflow.indexOf(`\n  ${job}:\n`);
  const next = workflow.slice(start + 1).search(/\n {2}[\w-]+:\n/u);
  return next === -1
    ? workflow.slice(start)
    : workflow.slice(start, start + 1 + next);
}

test("01 - one root script defines the ops tooling suite", () => {
  const manifest = JSON.parse(readRepositoryFile("package.json"));

  equal(manifest.scripts["test:ops-helpers"], "uvu ops/helpers", "01.01");
  ok(manifest.scripts.unit.includes(gateCommand), "01.02");
  ok(manifest.scripts.verify.includes(gateCommand), "01.03");
});

test("02 - the shared action runs the suite after the package build", () => {
  const action = readRepositoryFile(sharedAction);
  const build = action.indexOf(packageBuild);

  equal(occurrences(action, gateCommand), 1, "02.01");
  ok(build > -1, "02.02");
  // the suite audits real package unit runs, so it needs built dist output
  ok(build < action.indexOf(gateCommand), "02.03");
});

test("03 - the shared action defines every required gate once", () => {
  const action = readRepositoryFile(sharedAction);

  equal(
    requiredGates.filter((gate) => occurrences(action, gate) !== 1),
    [],
    "03.01",
  );
});

test("04 - both hosted lanes validate through the shared action alone", () => {
  const ci = readRepositoryFile(".github/workflows/ci.yml");
  const release = readRepositoryFile(".github/workflows/release.yml");

  equal(occurrences(ci, sharedActionUse), 1, "04.01");
  equal(occurrences(release, sharedActionUse), 1, "04.02");
  // a gate spelled out in a lane again is that lane drifting from the action
  equal(
    requiredGates.filter((gate) => ci.includes(gate)),
    [],
    "04.03",
  );
  equal(
    requiredGates.filter((gate) => release.includes(gate)),
    [],
    "04.04",
  );
});

test("05 - the Windows lane smokes the examples runner", () => {
  const manifest = JSON.parse(readRepositoryFile("package.json"));
  const windows = jobSection(
    readRepositoryFile(".github/workflows/ci.yml"),
    "windows-smoke",
  );

  equal(
    manifest.scripts["test:examples-runner"],
    "uvu ops/helpers runExamplesCli",
    "05.01",
  );
  equal(occurrences(windows, "npm run test:examples-runner"), 1, "05.02");
  // the runner and its test both need the root dependencies
  ok(
    windows.indexOf("npm ci") < windows.indexOf("test:examples-runner"),
    "05.03",
  );
});

test("06 - the release pack job validates before packing", () => {
  const workflow = readRepositoryFile(".github/workflows/release.yml");
  const verify = workflow.indexOf(sharedActionUse);

  ok(verify > -1, "06.01");
  ok(verify < workflow.indexOf("npm-release.js pack"), "06.02");
});

test.run();
