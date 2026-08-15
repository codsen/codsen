import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// How a benchmark run is judged, and what it is allowed to record.
//
// Two rules matter here. A run which is materially slower than the baseline
// must not become the next baseline, or one regression is reported once and
// then reported as "just as fast as before" forever. And a regression past the
// configured threshold must be distinguishable from a pass by exit code,
// because a message nobody reads is not a gate.

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const policyFilename = path.join(repositoryRoot, "ops/perf-policy.json");

const VERDICTS = new Set([
  "baseline",
  "faster",
  "unchanged",
  "slower",
  "regression",
]);

function readPerfPolicy(filename = policyFilename) {
  return JSON.parse(readFileSync(filename, "utf8"));
}

function assertPercent(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(
      `ops/helpers/perfPolicy.js: ${label} must be a non-negative finite number, received ${JSON.stringify(value)}`,
    );
  }
}

// the thresholds one package is measured against
function resolvePerfPolicy(policy, packageName) {
  const {
    packageOverrides = {},
    regressionThresholdPercent,
    unchangedTolerancePercent,
    waivers = {},
  } = policy;
  const override = packageOverrides[packageName] ?? {};
  const waiver = waivers[packageName];

  const resolved = {
    failOnRegression: true,
    regressionThresholdPercent:
      override.regressionThresholdPercent ?? regressionThresholdPercent,
    unchangedTolerancePercent:
      override.unchangedTolerancePercent ?? unchangedTolerancePercent,
    waiverReason: null,
  };

  if (waiver) {
    if (typeof waiver.reason !== "string" || waiver.reason.trim().length < 20) {
      throw new Error(
        `ops/helpers/perfPolicy.js: the "${packageName}" perf waiver needs a substantive reason`,
      );
    }
    resolved.failOnRegression = false;
    resolved.waiverReason = waiver.reason;
  }

  assertPercent(
    resolved.unchangedTolerancePercent,
    "unchangedTolerancePercent",
  );
  assertPercent(
    resolved.regressionThresholdPercent,
    "regressionThresholdPercent",
  );
  if (
    resolved.regressionThresholdPercent < resolved.unchangedTolerancePercent
  ) {
    throw new Error(
      `ops/helpers/perfPolicy.js: the regression threshold must not sit inside the unchanged tolerance for "${packageName}"`,
    );
  }
  return resolved;
}

// what this run was, relative to the baseline it is compared against
function classifyPerfRun({ baseline, resolvedPolicy, score }) {
  const { regressionThresholdPercent, unchangedTolerancePercent } =
    resolvedPolicy;

  if (typeof baseline !== "number" || !Number.isFinite(baseline) || !baseline) {
    return { changePercent: 0, verdict: "baseline" };
  }

  // positive means faster than the baseline
  const changePercent = ((score - baseline) / baseline) * 100;
  const rounded = Math.round(changePercent * 100) / 100;

  if (Math.abs(rounded) <= unchangedTolerancePercent) {
    return { changePercent: rounded, verdict: "unchanged" };
  }
  if (rounded > 0) {
    return { changePercent: rounded, verdict: "faster" };
  }
  return {
    changePercent: rounded,
    verdict:
      Math.abs(rounded) > regressionThresholdPercent ? "regression" : "slower",
  };
}

// A materially slower run records its measurement under `lastSlowerRun` and
// leaves the baseline where it was, so the comparison point survives and the
// evidence is not lost either. Anything else advances the baseline and clears
// a stale slow-run record.
function nextHistoricalData({ historicalData, score, verdict, version }) {
  if (!VERDICTS.has(verdict)) {
    throw new Error(
      `ops/helpers/perfPolicy.js: unknown verdict ${JSON.stringify(verdict)}`,
    );
  }
  const next = { ...historicalData };
  delete next.lastPublished;
  delete next.lastRan;

  if (verdict === "slower" || verdict === "regression") {
    next.lastSlowerRun = score;
    return next;
  }

  next[version] = score;
  next.lastVersion = score;
  delete next.lastSlowerRun;
  return next;
}

function baselineOf(historicalData, version) {
  return historicalData.lastVersion ?? historicalData[version];
}

export {
  baselineOf,
  classifyPerfRun,
  nextHistoricalData,
  policyFilename,
  readPerfPolicy,
  resolvePerfPolicy,
};
