import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  baselineOf,
  classifyPerfRun,
  nextHistoricalData,
  readPerfPolicy,
  resolvePerfPolicy,
} from "../perfPolicy.js";

const policy = {
  packageOverrides: {
    "string-strip-html": { regressionThresholdPercent: 5 },
  },
  regressionThresholdPercent: 10,
  unchangedTolerancePercent: 2,
  waivers: {
    "noisy-package": {
      reason:
        "the workload measures filesystem throughput, which the runner cannot hold steady",
    },
  },
};

const strict = { regressionThresholdPercent: 10, unchangedTolerancePercent: 2 };

test("01 - resolves the repository defaults for an ordinary package", () => {
  equal(
    resolvePerfPolicy(policy, "ranges-push"),
    {
      failOnRegression: true,
      regressionThresholdPercent: 10,
      unchangedTolerancePercent: 2,
      waiverReason: null,
    },
    "01.01",
  );
});

test("02 - lets a package override its own threshold", () => {
  equal(
    resolvePerfPolicy(policy, "string-strip-html").regressionThresholdPercent,
    5,
    "02.01",
  );
});

test("03 - a waiver reports the regression without failing the run", () => {
  const resolved = resolvePerfPolicy(policy, "noisy-package");

  equal(resolved.failOnRegression, false, "03.01");
  equal(typeof resolved.waiverReason, "string", "03.02");
});

test("04 - rejects a waiver with no substantive reason", () => {
  throws(
    () =>
      resolvePerfPolicy(
        { ...policy, waivers: { x: { reason: "noisy" } } },
        "x",
      ),
    /substantive reason/u,
    "04.01",
  );
});

test("05 - rejects a threshold hidden inside the unchanged tolerance", () => {
  throws(
    () =>
      resolvePerfPolicy(
        { regressionThresholdPercent: 1, unchangedTolerancePercent: 2 },
        "x",
      ),
    /must not sit inside the unchanged tolerance/u,
    "05.01",
  );
});

test("06 - rejects a percentage which is not a non-negative number", () => {
  throws(
    () =>
      resolvePerfPolicy(
        { regressionThresholdPercent: "10", unchangedTolerancePercent: 2 },
        "x",
      ),
    /non-negative finite number/u,
    "06.01",
  );
});

test("07 - treats an empty history as the first run", () => {
  equal(
    classifyPerfRun({ baseline: undefined, resolvedPolicy: strict, score: 90 }),
    { changePercent: 0, verdict: "baseline" },
    "07.01",
  );
});

test("08 - treats movement inside the tolerance as unchanged", () => {
  equal(
    classifyPerfRun({ baseline: 100, resolvedPolicy: strict, score: 101 })
      .verdict,
    "unchanged",
    "08.01",
  );
  equal(
    classifyPerfRun({ baseline: 100, resolvedPolicy: strict, score: 98 })
      .verdict,
    "unchanged",
    "08.02",
  );
});

test("09 - reports a faster run with a positive change", () => {
  equal(
    classifyPerfRun({ baseline: 100, resolvedPolicy: strict, score: 110 }),
    { changePercent: 10, verdict: "faster" },
    "09.01",
  );
});

test("10 - a slowdown at the threshold is slower, not yet a regression", () => {
  equal(
    classifyPerfRun({ baseline: 100, resolvedPolicy: strict, score: 90 }),
    { changePercent: -10, verdict: "slower" },
    "10.01",
  );
});

test("11 - a slowdown beyond the threshold is a regression", () => {
  equal(
    classifyPerfRun({ baseline: 100, resolvedPolicy: strict, score: 89 }),
    { changePercent: -11, verdict: "regression" },
    "11.01",
  );
});

test("12 - a faster run advances the baseline and clears a stale slow run", () => {
  equal(
    nextHistoricalData({
      historicalData: { "1.0.0": 100, lastSlowerRun: 80, lastVersion: 100 },
      score: 120,
      verdict: "faster",
      version: "1.0.1",
    }),
    { "1.0.0": 100, "1.0.1": 120, lastVersion: 120 },
    "12.01",
  );
});

test("13 - a slower run keeps the baseline and records the measurement", () => {
  equal(
    nextHistoricalData({
      historicalData: { "1.0.0": 100, lastVersion: 100 },
      score: 92,
      verdict: "slower",
      version: "1.0.0",
    }),
    { "1.0.0": 100, lastSlowerRun: 92, lastVersion: 100 },
    "13.01",
  );
});

test("14 - a regression cannot overwrite the baseline it lost against", () => {
  const historicalData = { "1.0.0": 100, lastVersion: 100 };
  const next = nextHistoricalData({
    historicalData,
    score: 70,
    verdict: "regression",
    version: "1.0.0",
  });

  // the exact REV-044 failure mode: without this, the next run compares
  // against 70 and calls a 30% regression "just as fast as before"
  equal(baselineOf(next, "1.0.0"), 100, "14.01");
  equal(next.lastSlowerRun, 70, "14.02");
  equal(historicalData, { "1.0.0": 100, lastVersion: 100 }, "14.03");
});

test("15 - drops the obsolete housekeeping keys", () => {
  equal(
    nextHistoricalData({
      historicalData: { lastPublished: 1, lastRan: 2 },
      score: 50,
      verdict: "baseline",
      version: "1.0.0",
    }),
    { "1.0.0": 50, lastVersion: 50 },
    "15.01",
  );
});

test("16 - rejects a verdict it does not know how to record", () => {
  throws(
    () =>
      nextHistoricalData({
        historicalData: {},
        score: 1,
        verdict: "quicker",
        version: "1.0.0",
      }),
    /unknown verdict/u,
    "16.01",
  );
});

test("17 - reads the baseline from lastVersion before the version key", () => {
  equal(baselineOf({ "1.0.0": 10, lastVersion: 20 }, "1.0.0"), 20, "17.01");
  equal(baselineOf({ "1.0.0": 10 }, "1.0.0"), 10, "17.02");
  equal(baselineOf({}, "1.0.0"), undefined, "17.03");
});

test("18 - the shipped policy resolves for a real package", () => {
  const resolved = resolvePerfPolicy(readPerfPolicy(), "string-strip-html");

  equal(resolved.failOnRegression, true, "18.01");
  equal(typeof resolved.regressionThresholdPercent, "number", "18.02");
});

test.run();
