#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import { parseHistorical } from "../../../../ops/scripts/historicalJson.js";

const NOISE_THRESHOLD_PCT = 2;
const TOP_LIMIT = 10;

function parseArgs(argv) {
  let root = process.cwd();
  let includeAll = false;

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--root") {
      if (!argv[i + 1]) {
        throw new Error("--root requires a directory path");
      }
      root = path.resolve(argv[i + 1]);
      i += 1;
    } else if (argv[i] === "--all") {
      includeAll = true;
    } else {
      throw new Error(`Unknown argument: ${argv[i]}`);
    }
  }

  return { includeAll, root: path.resolve(root) };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// historical.json numbers carry underscore separators, plain JSON.parse can't
function readHistoricalJson(filePath) {
  return parseHistorical(fs.readFileSync(filePath, "utf8"));
}

function round(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function classify(deltaPct) {
  if (Math.abs(deltaPct) <= NOISE_THRESHOLD_PCT) return "roughlyUnchanged";
  return deltaPct > 0 ? "faster" : "slower";
}

// `lastSlowerRun` is written by ops/scripts/perf.js when a run loses to the
// baseline by more than the noise band. The baseline is deliberately kept, so
// `lastVersion` still holds the older, better score: reading only that would
// report the package as unchanged when its latest measurement was slower.
function readPendingRegression(data) {
  const pending = data.lastSlowerRun;
  if (!pending || typeof pending !== "object") {
    return undefined;
  }
  const { against, score, version, worst } = pending;
  if (
    typeof against !== "number" ||
    !Number.isFinite(against) ||
    against <= 0 ||
    typeof score !== "number" ||
    !Number.isFinite(score) ||
    score <= 0
  ) {
    throw new Error("lastSlowerRun must record positive against and score");
  }
  return {
    against,
    score,
    version: typeof version === "string" ? version : undefined,
    worst: typeof worst === "number" && Number.isFinite(worst) ? worst : score,
  };
}

function findBaseline(entries, currentVersion, latest) {
  if (!entries.length) return undefined;

  const latestEntry = entries.at(-1);
  if (latestEntry.version === currentVersion && latestEntry.score === latest) {
    return entries.at(-2);
  }

  return latestEntry;
}

function analyzeFile(filePath, packageDirName) {
  const data = readHistoricalJson(filePath);
  const packageJsonPath = path.join(
    path.dirname(path.dirname(filePath)),
    "package.json",
  );
  const packageJson = readJson(packageJsonPath);
  const marker = "lastVersion";

  if (!Object.keys(data).length) {
    return {
      status: "pendingBaseline",
      package: packageJson.name || packageDirName,
      packageDir: packageDirName,
      currentVersion: packageJson.version,
    };
  }

  if (!Object.hasOwn(data, marker)) {
    throw new Error("missing lastVersion key");
  }

  const latest = data[marker];
  if (typeof latest !== "number" || !Number.isFinite(latest) || latest <= 0) {
    throw new Error(`${marker} must be a positive finite number`);
  }

  const versionEntries = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === marker) break;
    if (
      /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(key) &&
      typeof value === "number" &&
      Number.isFinite(value) &&
      value > 0
    ) {
      versionEntries.push({ version: key, score: value });
    }
  }

  // A kept regression is the newest thing known about the package, and it is
  // not in `lastVersion` by design, so it decides the comparison when present.
  const pending = readPendingRegression(data);
  if (pending) {
    const baselineEntry = versionEntries.find(
      ({ score }) => score === pending.against,
    );
    const ratio = pending.score / pending.against;
    return {
      status: "comparison",
      package: packageJson.name || packageDirName,
      packageDir: packageDirName,
      currentVersion: packageJson.version,
      measuredVersion: pending.version ?? packageJson.version,
      baselineVersion: baselineEntry ? baselineEntry.version : null,
      baselineOpsPerSec: round(pending.against, 6),
      latestOpsPerSec: round(pending.score, 6),
      worstOpsPerSec: round(pending.worst, 6),
      worstPct: round((pending.worst / pending.against - 1) * 100),
      deltaPct: round((ratio - 1) * 100),
      classification: "pendingRegression",
      marker: "lastSlowerRun",
      ratio,
    };
  }

  const baseline = findBaseline(versionEntries, packageJson.version, latest);
  if (!baseline) {
    return {
      status: "freshBaseline",
      package: packageJson.name || packageDirName,
      packageDir: packageDirName,
      currentVersion: packageJson.version,
      latestOpsPerSec: round(latest, 6),
    };
  }

  const ratio = latest / baseline.score;
  const deltaPct = (ratio - 1) * 100;

  return {
    status: "comparison",
    package: packageJson.name || packageDirName,
    packageDir: packageDirName,
    currentVersion: packageJson.version,
    baselineVersion: baseline.version,
    baselineOpsPerSec: round(baseline.score, 6),
    latestOpsPerSec: round(latest, 6),
    deltaPct: round(deltaPct),
    classification: classify(deltaPct),
    marker,
    ratio,
  };
}

function main() {
  const { includeAll, root } = parseArgs(process.argv.slice(2));
  const rootPackageJsonPath = path.join(root, "package.json");
  const packagesDir = path.join(root, "packages");

  if (!fs.existsSync(rootPackageJsonPath) || !fs.existsSync(packagesDir)) {
    throw new Error(`Not a monorepo root: ${root}`);
  }

  const rootPackageJson = readJson(rootPackageJsonPath);
  if (rootPackageJson.name !== "codsen-mono") {
    throw new Error(
      `Expected package.json name codsen-mono, got ${rootPackageJson.name}`,
    );
  }

  const historicalFiles = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      packageDirName: entry.name,
      filePath: path.join(packagesDir, entry.name, "perf", "historical.json"),
    }))
    .filter(({ filePath }) => fs.existsSync(filePath))
    .sort((a, b) => a.packageDirName.localeCompare(b.packageDirName));

  const comparisons = [];
  const freshBaselines = [];
  const pendingBaselines = [];
  const issues = [];

  for (const { filePath, packageDirName } of historicalFiles) {
    try {
      const analysis = analyzeFile(filePath, packageDirName);
      if (analysis.status === "comparison") {
        const { status: _status, ...comparison } = analysis;
        comparisons.push(comparison);
      } else if (analysis.status === "freshBaseline") {
        const { status: _status, ...baseline } = analysis;
        freshBaselines.push(baseline);
      } else {
        const { status: _status, ...baseline } = analysis;
        pendingBaselines.push(baseline);
      }
    } catch (error) {
      issues.push({
        packageDir: packageDirName,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const deltas = comparisons.map(({ deltaPct }) => deltaPct);
  const ratios = comparisons.map(({ ratio }) => ratio);
  const counts = {
    faster: comparisons.filter(
      ({ classification }) => classification === "faster",
    ).length,
    roughlyUnchanged: comparisons.filter(
      ({ classification }) => classification === "roughlyUnchanged",
    ).length,
    slower: comparisons.filter(
      ({ classification }) => classification === "slower",
    ).length,
    // measured, deliberately not absorbed into the baseline: a different thing
    // from "slower", which is a baseline that already moved
    pendingRegression: comparisons.filter(
      ({ classification }) => classification === "pendingRegression",
    ).length,
  };
  const aggregate = comparisons.length
    ? {
        medianPct: round(median(deltas)),
        geometricMeanPct: round(
          (Math.exp(
            ratios.reduce((sum, ratio) => sum + Math.log(ratio), 0) /
              ratios.length,
          ) -
            1) *
            100,
        ),
        arithmeticMeanPct: round(
          deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length,
        ),
      }
    : {
        medianPct: null,
        geometricMeanPct: null,
        arithmeticMeanPct: null,
      };

  const cleanComparisons = comparisons.map(
    ({ ratio: _ratio, ...comparison }) => comparison,
  );
  const byDeltaDescending = [...cleanComparisons].sort(
    (a, b) => b.deltaPct - a.deltaPct,
  );

  const result = {
    thresholdPct: NOISE_THRESHOLD_PCT,
    totals: {
      historicalFiles: historicalFiles.length,
      compared: comparisons.length,
      freshBaselines: freshBaselines.length,
      pendingBaselines: pendingBaselines.length,
      skipped: issues.length,
      ...counts,
    },
    aggregate,
    largestImprovements: byDeltaDescending
      .filter(({ deltaPct }) => deltaPct > NOISE_THRESHOLD_PCT)
      .slice(0, TOP_LIMIT),
    largestRegressions: byDeltaDescending
      .filter(({ deltaPct }) => deltaPct < -NOISE_THRESHOLD_PCT)
      .slice(-TOP_LIMIT)
      .reverse(),
    // listed in full rather than truncated: each one is a regression the
    // harness measured and refused to adopt as the new baseline
    pendingRegressions: cleanComparisons.filter(
      ({ classification }) => classification === "pendingRegression",
    ),
    freshBaselines,
    pendingBaselines,
    issues,
  };

  if (includeAll) {
    result.comparisons = cleanComparisons;
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(
    `analyze-perf: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
}
