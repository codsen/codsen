import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { parseHistorical } from "../scripts/historicalJson.js";

// Two quality gates the repository already enforces, reduced to figures the
// website can quote. Neither derivation measures anything on its own: coverage
// reads the thresholds `lect` generates into each manifest, and perf reads the
// baselines the benchmark runs have already recorded. Both gates fail the build
// when they are missed, so a threshold here is a fact about released code
// rather than an intention.

const FULL_COVERAGE_THRESHOLDS = Object.freeze([
  "branches",
  "functions",
  "statements",
]);

// keys `runPerf` writes alongside the per-version scores
const PERF_BOOKKEEPING_KEYS = new Set(["lastSlowerRun", "lastVersion"]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// `c8` is generated from ops/coverage-policy.json, so the manifests are the
// resolved policy — profile, full-coverage list, overrides and waivers already
// merged. Reading them keeps this derivation from re-implementing that merge.
function coverageStatsFrom(manifests) {
  const checked = [];
  const fullyCovered = [];
  const lineThresholds = [];

  for (const manifest of manifests) {
    const config = manifest?.c8;
    if (
      !isObject(config) ||
      config["check-coverage"] !== true ||
      !Number.isFinite(config.lines)
    ) {
      continue;
    }
    checked.push(manifest.name);
    lineThresholds.push(config.lines);
    if (FULL_COVERAGE_THRESHOLDS.every((key) => config[key] === 100)) {
      fullyCovered.push(manifest.name);
    }
  }

  if (!checked.length) {
    throw new Error(
      "ops/helpers/qualityStats.js: no package enforces a c8 line threshold; the coverage policy did not reach the manifests",
    );
  }

  return {
    checked: checked.sort(),
    fullyCovered: fullyCovered.sort(),
    lowestLineThreshold: Math.min(...lineThresholds),
  };
}

// A package's perf history is its own file, written by ops/scripts/perf.js. A
// package without one is not benchmarked; one with a history but no baseline
// has never completed a run, and is counted as benchmarked without a score.
function perfStatsFrom(packageNames, repositoryRoot, policy) {
  const { regressionThresholdPercent, unchangedTolerancePercent } = policy;
  for (const [label, value] of [
    ["regressionThresholdPercent", regressionThresholdPercent],
    ["unchangedTolerancePercent", unchangedTolerancePercent],
  ]) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(
        `ops/helpers/qualityStats.js: perf policy ${label} must be a non-negative finite number, received ${JSON.stringify(value)}`,
      );
    }
  }

  const benchmarked = [];
  const baselines = {};
  let recordedRuns = 0;

  for (const name of [...packageNames].sort()) {
    const filename = path.join(
      repositoryRoot,
      "packages",
      name,
      "perf",
      "historical.json",
    );
    if (!existsSync(filename)) {
      continue;
    }
    let history;
    try {
      history = parseHistorical(readFileSync(filename, "utf8"));
    } catch (error) {
      throw new Error(
        `ops/helpers/qualityStats.js: could not read the ${name} benchmark history`,
        { cause: error },
      );
    }
    benchmarked.push(name);
    recordedRuns += Object.keys(history).filter(
      (key) => !PERF_BOOKKEEPING_KEYS.has(key),
    ).length;
    if (Number.isFinite(history.lastVersion)) {
      baselines[name] = history.lastVersion;
    }
  }

  return {
    baselines,
    benchmarked,
    recordedRuns,
    regressionThresholdPercent,
    unchangedTolerancePercent,
  };
}

// The declarations the generator emits above each payload. They live here so
// that the shape and the derivation which fills it cannot drift apart.
const COVERAGE_STATS_TYPINGS = `interface CoverageStats {
  /** Packages whose unit suite runs under an enforced c8 line threshold. */
  checked: string[];
  /** Of those, packages also held to 100% branches, functions and statements. */
  fullyCovered: string[];
  /** The lowest line-coverage percentage enforced across \`checked\`. Every
   * checked package is gated at this percentage or above; a package missing its
   * threshold fails the build, so this describes released code. */
  lowestLineThreshold: number;
}
`;

const PERF_STATS_TYPINGS = `interface NumberValueObj {
  [key: string]: number;
}

interface PerfStats {
  /** Package name -> the score its next benchmark run is judged against.
   * Scores are ops/sec normalised against the \`perf-ref\` reference program, so
   * they are comparable between packages and between machines, but they are not
   * raw ops/sec. Packages whose history holds no baseline yet are absent. */
  baselines: NumberValueObj;
  /** Packages carrying a checked-in benchmark history. */
  benchmarked: string[];
  /** Benchmark runs recorded across every history. */
  recordedRuns: number;
  /** A run slower than its baseline by more than this percentage fails the
   * build, and never replaces the baseline it lost against. */
  regressionThresholdPercent: number;
  /** A run within this percentage of its baseline counts as unchanged. */
  unchangedTolerancePercent: number;
}
`;

export {
  COVERAGE_STATS_TYPINGS,
  coverageStatsFrom,
  PERF_STATS_TYPINGS,
  perfStatsFrom,
};
