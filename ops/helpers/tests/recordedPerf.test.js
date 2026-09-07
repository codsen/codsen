import { test } from "uvu";
import { equal, throws } from "uvu/assert";
import { checkRecordedPerf } from "../recordedPerf.js";

const policy = { unchangedTolerancePercent: 2, regressionThresholdPercent: 10 };
const history = (score) => ({
  "1.0.0": 100,
  lastVersion: 100,
  lastSlowerRun: { against: 100, score, worst: score, version: "1.0.1" },
});

test("01 - passes a recorded baseline without a pending slowdown", () => {
  equal(
    checkRecordedPerf({ "1.0.0": 100, lastVersion: 100 }, policy, "example"),
    { failed: false, score: 100, verdict: "recorded" },
    "01.01",
  );
});
test("02 - an empty reset history needs a fresh measurement", () => {
  equal(
    checkRecordedPerf({}, policy, "example"),
    { failed: true, verdict: "unmeasured" },
    "02.01",
  );
});
test("03 - distinguishes a visible slowdown from a strict failure", () => {
  equal(
    checkRecordedPerf(history(95), policy, "example").failed,
    false,
    "03.01",
  );
  equal(
    checkRecordedPerf(history(90), policy, "example").failed,
    false,
    "03.02",
  );
  equal(
    checkRecordedPerf(history(89), policy, "example").failed,
    true,
    "03.03",
  );
});
test("04 - a documented waiver keeps the slowdown visible", () => {
  const reason =
    "The repaired transformation now processes content that the old implementation skipped.";
  const result = checkRecordedPerf(
    history(70),
    { ...policy, waivers: { example: { reason } } },
    "example",
  );
  equal(result.failed, false, "04.01");
  equal(result.verdict, "regression", "04.02");
  equal(result.waiverReason, reason, "04.03");
});
test("05 - applies package thresholds to the latest measurement", () => {
  equal(
    checkRecordedPerf(
      history(94),
      {
        ...policy,
        packageOverrides: { example: { regressionThresholdPercent: 5 } },
      },
      "example",
    ).failed,
    true,
    "05.01",
  );
});
test("06 - rejects incomplete and inconsistent records", () => {
  for (const data of [
    null,
    [],
    { lastVersion: 0 },
    { lastVersion: Infinity },
    { ...history(80), lastVersion: 110 },
    { ...history(80), lastSlowerRun: null },
    {
      ...history(80),
      lastSlowerRun: { ...history(80).lastSlowerRun, worst: 90 },
    },
  ]) {
    throws(
      () => checkRecordedPerf(data, policy, "example"),
      undefined,
      "06.01",
    );
  }
});
test("07 - checks do not mutate retained history or hide the worst score", () => {
  const data = history(95);
  data.lastSlowerRun.worst = 50;
  const before = JSON.stringify(data);
  equal(checkRecordedPerf(data, policy, "example").failed, false, "07.01");
  equal(JSON.stringify(data), before, "07.02");
});
test.run();
