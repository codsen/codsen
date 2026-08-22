import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, ok } from "uvu/assert";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

// npm pins a workflow filename per trusted publisher and every package is
// registered against `ci.yml`, so the publishing lane owns that filename and
// the pull-request lane is `verify.yml`
const checksWorkflow = ".github/workflows/verify.yml";
const releaseWorkflow = ".github/workflows/ci.yml";

const sharedAction = ".github/actions/verify-repository/action.yml";
const sharedActionUse = "uses: ./.github/actions/verify-repository";
const gateCommand = "npm run test:ops-helpers";
const packageBuild = "npm run ci:verify:info";

// every policy gate the hosted lanes must run, whichever lane triggered them
const requiredGates = [
  "node ops/scripts/audit-production-dependencies.js --check-policy",
  "npm run ci:verify:package-kinds",
  "npm run ci:verify:debug-log-production-cost",
  "npm run ci:verify:test-numbering",
  "npm run ci:verify:coverage-policy",
  "npm run test:coverage",
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
  const ci = readRepositoryFile(checksWorkflow);
  const release = readRepositoryFile(releaseWorkflow);

  equal(occurrences(ci, sharedActionUse), 2, "04.01");
  equal(occurrences(ci, "phase: prepare"), 1, "04.02");
  equal(occurrences(ci, "phase: validate"), 1, "04.03");
  equal(occurrences(release, sharedActionUse), 1, "04.04");
  // a gate spelled out in a lane again is that lane drifting from the action
  equal(
    requiredGates.filter((gate) => ci.includes(gate)),
    [],
    "04.05",
  );
  equal(
    requiredGates.filter((gate) => release.includes(gate)),
    [],
    "04.06",
  );
});

test("05 - the Windows lane smokes the examples runner", () => {
  const manifest = JSON.parse(readRepositoryFile("package.json"));
  const windows = jobSection(
    readRepositoryFile(checksWorkflow),
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
  const workflow = readRepositoryFile(releaseWorkflow);
  const verify = workflow.indexOf(sharedActionUse);

  ok(verify > -1, "06.01");
  ok(verify < workflow.indexOf("npm-release.js pack"), "06.02");
});

test("07 - compatibility consumers share one artifact boundary per trigger", () => {
  const checks = readRepositoryFile(checksWorkflow);
  const release = readRepositoryFile(releaseWorkflow);
  const artifacts = jobSection(checks, "artifacts");
  const validate = jobSection(checks, "validate");
  const repositoryValidation = jobSection(checks, "repository_validation");
  const packageCompatibility = jobSection(checks, "package-node-compatibility");
  const browser = jobSection(checks, "browser-iife-compatibility");
  const windows = jobSection(checks, "windows-smoke");
  const releaseWindows = jobSection(release, "windows-smoke");
  const publish = jobSection(release, "publish");

  equal(occurrences(artifacts, ".github/npm-release-plan.json"), 1, "07.01");
  ok(repositoryValidation.includes("needs: artifacts"), "07.02");
  for (const [index, section] of [
    packageCompatibility,
    browser,
    windows,
  ].entries()) {
    ok(
      section.includes("needs: artifacts"),
      `07.${String(index * 2 + 3).padStart(2, "0")}`,
    );
    ok(
      section.includes("release_push != 'true'"),
      `07.${String(index * 2 + 4).padStart(2, "0")}`,
    );
  }
  ok(releaseWindows.includes("needs: pack"), "07.09");
  ok(publish.includes("- windows-smoke"), "07.10");
  equal(
    [
      "lint-workflows",
      "artifacts",
      "repository_validation",
      "package-node-compatibility",
      "browser-iife-compatibility",
      "windows-smoke",
    ].filter((job) => !validate.includes(`- ${job}`)),
    [],
    "07.11",
  );
});

test.run();
