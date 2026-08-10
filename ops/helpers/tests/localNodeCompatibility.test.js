import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";
import {
  assertCanonicalNodeVersion,
  localCompatibilityLanePlan,
} from "../localNodeCompatibility.js";
import {
  supportedNodeEngines,
  supportedNodeMajors,
} from "../nodeCompatibility.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const localScript = path.join(
  repositoryRoot,
  "ops/scripts/test-node-compatibility.js",
);
const packageScript = path.join(
  repositoryRoot,
  "ops/scripts/package-node-compatibility.js",
);
const auditScript = path.join(
  repositoryRoot,
  "ops/scripts/audit-package-units.js",
);

function runScript(script, args) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
}

test("01 - local orchestrator exposes bounded concurrency", () => {
  const help = runScript(localScript, ["--help"]);
  equal(help.status, 0, "01.01");
  match(help.stdout, /--concurrency <n>/, "01.02");
  match(help.stdout, /builds\nand packs once/, "01.03");

  const invalid = runScript(localScript, ["--concurrency", "0"]);
  equal(invalid.status, 1, "01.04");
  match(invalid.stderr, /positive integer/, "01.05");

  const invalidAudit = runScript(auditScript, ["--concurrency", "0"]);
  equal(invalidAudit.status, 1, "01.06");
  match(invalidAudit.stderr, /positive integer/, "01.07");
});

test("02 - package verification rejects a non-canonical patch", () => {
  const actualMajor = supportedNodeMajors[0];
  const canonicalVersion = supportedNodeEngines
    .get(actualMajor)
    .replace(/^>=/, "");
  equal(
    assertCanonicalNodeVersion(actualMajor, canonicalVersion),
    canonicalVersion,
    "02.01",
  );
  const [major, minor, patch] = canonicalVersion.split(".").map(Number);
  const wrongSameMajorPatch = `${major}.${minor}.${patch === 0 ? 1 : 0}`;
  throws(
    () => assertCanonicalNodeVersion(actualMajor, wrongSameMajorPatch),
    new RegExp(
      `canonical Node ${canonicalVersion}; received ${wrongSameMajorPatch}`,
    ),
    "02.02",
  );

  const differentMajor = supportedNodeMajors.find(
    (major) => !supportedNodeEngines.get(major).endsWith(process.versions.node),
  );
  const expectedVersion = supportedNodeEngines
    .get(differentMajor)
    .replace(/^>=/, "");
  const result = runScript(packageScript, [
    "verify",
    "--artifacts",
    tmpdir(),
    "--node-major",
    String(differentMajor),
    "--npm-cache",
    path.join(tmpdir(), "codsen-unused-npm-cache"),
    "--temp-root",
    tmpdir(),
    "--unit-concurrency",
    "2",
  ]);

  equal(result.status, 1, "02.03");
  match(
    result.stderr,
    new RegExp(`canonical Node ${expectedVersion}`),
    "02.04",
  );
  match(
    result.stderr,
    new RegExp(`received ${process.versions.node}`),
    "02.05",
  );
});

test("03 - audit runner executes a bounded package selection", () => {
  const temporaryDirectory = mkdtempSync(
    path.join(tmpdir(), "codsen-unit-concurrency-test-"),
  );
  const reportFilename = path.join(temporaryDirectory, "report.json");
  try {
    const result = runScript(auditScript, [
      "--node",
      process.execPath,
      "--concurrency",
      "2",
      "--package",
      "arrayiffy-if-string",
      "--package",
      "ranges-sort",
      "--output",
      reportFilename,
    ]);
    equal(result.status, 0, "03.01");
    const report = JSON.parse(readFileSync(reportFilename, "utf8"));
    equal(report.summary.total, 2, "03.02");
    equal(report.summary.passed, 2, "03.03");
    equal(
      report.packages.map(({ name }) => name),
      ["arrayiffy-if-string", "ranges-sort"],
      "03.04",
    );
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});

test("04 - local lane plans skip only leading empty majors", () => {
  const records = [
    {
      directory: "packages/node-20",
      manifest: {
        name: "node-20",
        engines: { node: ">=20.19.4" },
      },
    },
  ];
  const plan = localCompatibilityLanePlan(records);

  equal(
    plan.map(({ nodeMajor }) => nodeMajor),
    [20, 22, 24, 26],
    "04.01",
  );
  equal(
    plan.map(({ packageCount }) => packageCount),
    [1, 1, 1, 1],
    "04.02",
  );
});

test.run();
