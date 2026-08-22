#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PACKAGE_KINDS } from "../helpers/packageKinds.js";
import { readPackageKindResolver } from "../helpers/packageKindsFile.js";
import {
  coverageThresholdFailures,
  formatCoverageSummary,
  mapWithConcurrency,
  validateCoverageConcurrency,
} from "../helpers/workspaceCoverage.js";
import { readWorkspaceRecords } from "../helpers/workspaceInventoryFile.js";

const require = createRequire(import.meta.url);
const { Report: makeCoverageReport } = require("c8");
const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const uvuBin = path.join(repositoryRoot, "node_modules/uvu/bin.js");

function readConcurrency(argv) {
  if (argv.length === 0) {
    return 8;
  }
  if (argv.length === 2 && argv[0] === "--concurrency") {
    return validateCoverageConcurrency(argv[1]);
  }
  throw new TypeError(
    "Usage: node ops/scripts/coverage-workspaces.js [--concurrency <n>]",
  );
}

function coveredWorkspaces() {
  const packageKinds = readPackageKindResolver(repositoryRoot);
  return readWorkspaceRecords(repositoryRoot)
    .filter(
      ({ manifest }) =>
        packageKinds.kindFor(manifest.name) !== PACKAGE_KINDS.GENERATED_DATA,
    )
    .map((record, index) => ({
      ...record,
      coverageDirectory: String(index).padStart(3, "0"),
    }));
}

function runUnitSuite(record, rawCoverageRoot) {
  const workspace = path.join(repositoryRoot, record.directory);
  const coverageDirectory = path.join(
    rawCoverageRoot,
    record.coverageDirectory,
  );
  mkdirSync(coverageDirectory, { recursive: true });
  process.stdout.write(`Starting ${record.manifest.name}\n`);

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [uvuBin, "test", "--no-color"], {
      cwd: workspace,
      env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory },
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("close", (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `${record.manifest.name}: unit suite ${signal ? `received ${signal}` : `exited ${code}`}`,
          ),
        );
      }
    });
  });
}

async function reportWorkspaceCoverage(record, rawCoverageRoot) {
  const workspace = path.join(repositoryRoot, record.directory);
  const config = record.manifest.c8;
  const originalDirectory = process.cwd();
  process.chdir(workspace);
  try {
    const report = makeCoverageReport({
      all: config.all ?? false,
      allowExternal: false,
      exclude: config.exclude,
      excludeAfterRemap: false,
      excludeNodeModules: true,
      extension: undefined,
      include: config.include ?? [],
      mergeAsync: false,
      omitRelative: true,
      reporter: [],
      reportsDirectory: path.join(
        rawCoverageRoot,
        "reports",
        record.coverageDirectory,
      ),
      resolve: "",
      skipFull: false,
      src: undefined,
      tempDirectory: path.join(rawCoverageRoot, record.coverageDirectory),
      watermarks: undefined,
      wrapperLength: undefined,
    });
    const coverageMap = await report.getCoverageMapFromAllCoverageFiles();
    const summary = coverageMap.getCoverageSummary().toJSON();
    const failures = coverageThresholdFailures(
      record.manifest.name,
      config,
      summary,
    );
    if (failures.length) {
      report.reporter = ["text"];
      await report.run();
    }
    return { failures, summary };
  } finally {
    process.chdir(originalDirectory);
  }
}

async function main() {
  const concurrency = readConcurrency(process.argv.slice(2));
  const records = coveredWorkspaces();
  const rawCoverageRoot = mkdtempSync(
    path.join(tmpdir(), "codsen-workspace-coverage-"),
  );
  try {
    console.log(
      `Running ${records.length} package unit suites under one coverage orchestrator with ${concurrency} workers.`,
    );
    const unitResults = await mapWithConcurrency(
      records,
      concurrency,
      (record) => runUnitSuite(record, rawCoverageRoot),
    );
    const unitFailures = unitResults.flatMap((result) =>
      result.status === "rejected" ? [result.reason.message] : [],
    );
    if (unitFailures.length) {
      throw new Error(`Unit coverage failed:\n- ${unitFailures.join("\n- ")}`);
    }

    const thresholdFailures = [];
    for (const record of records) {
      const { failures, summary } = await reportWorkspaceCoverage(
        record,
        rawCoverageRoot,
      );
      console.log(formatCoverageSummary(record.manifest.name, summary));
      thresholdFailures.push(...failures);
    }
    if (thresholdFailures.length) {
      throw new Error(
        `Coverage thresholds failed:\n- ${thresholdFailures.join("\n- ")}`,
      );
    }
    console.log(`Coverage passed for all ${records.length} packages.`);
  } finally {
    rmSync(rawCoverageRoot, { force: true, recursive: true });
  }
}

try {
  await main();
} catch (error) {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
}
