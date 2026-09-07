import { classifyPerfRun, resolvePerfPolicy } from "./perfPolicy.js";

function positiveScore(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive finite normalized score`);
  }
}

export function checkRecordedPerf(historicalData, policy, packageName) {
  const resolvedPolicy = resolvePerfPolicy(policy, packageName);
  if (
    !historicalData ||
    typeof historicalData !== "object" ||
    Array.isArray(historicalData)
  ) {
    throw new Error("performance history must be an object");
  }
  if (!Object.keys(historicalData).length) {
    return { failed: true, verdict: "unmeasured" };
  }
  positiveScore(historicalData.lastVersion, "lastVersion");
  const pending = historicalData.lastSlowerRun;
  if (pending === undefined) {
    return {
      failed: false,
      score: historicalData.lastVersion,
      verdict: "recorded",
    };
  }
  if (!pending || typeof pending !== "object" || Array.isArray(pending)) {
    throw new Error("lastSlowerRun must be an object");
  }
  positiveScore(pending.against, "lastSlowerRun.against");
  positiveScore(pending.score, "lastSlowerRun.score");
  positiveScore(pending.worst, "lastSlowerRun.worst");
  if (
    pending.against !== historicalData.lastVersion ||
    pending.worst > pending.score ||
    typeof pending.version !== "string" ||
    !pending.version
  ) {
    throw new Error(
      "lastSlowerRun must name its version, retain the current baseline and preserve its worst score",
    );
  }
  const result = classifyPerfRun({
    baseline: pending.against,
    resolvedPolicy,
    score: pending.score,
  });
  return {
    ...result,
    failed: result.verdict === "regression" && resolvedPolicy.failOnRegression,
    score: pending.score,
    baseline: pending.against,
    waiverReason: resolvedPolicy.waiverReason,
  };
}
