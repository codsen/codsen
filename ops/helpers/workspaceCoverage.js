const COVERAGE_THRESHOLD_NAMES = Object.freeze([
  "branches",
  "functions",
  "lines",
  "statements",
]);

function validateCoverageConcurrency(value) {
  const concurrency = Number(value);
  if (!Number.isSafeInteger(concurrency) || concurrency < 1) {
    throw new TypeError("Coverage concurrency must be a positive integer");
  }
  return concurrency;
}

async function mapWithConcurrency(items, concurrency, worker) {
  const limit = Math.min(
    validateCoverageConcurrency(concurrency),
    items.length,
  );
  const results = new Array(items.length);
  let nextIndex = 0;

  async function consume() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      try {
        results[index] = {
          status: "fulfilled",
          value: await worker(items[index], index),
        };
      } catch (reason) {
        results[index] = { reason, status: "rejected" };
      }
    }
  }

  await Promise.all(Array.from({ length: limit }, consume));
  return results;
}

function coverageThresholdFailures(packageName, config, summary) {
  const failures = [];
  for (const threshold of COVERAGE_THRESHOLD_NAMES) {
    if (!Object.hasOwn(config, threshold)) {
      continue;
    }
    const actual = summary[threshold]?.pct;
    if (actual < config[threshold]) {
      failures.push(
        `${packageName}: ${threshold} coverage ${actual}% is below ${config[threshold]}%`,
      );
    }
  }
  return failures;
}

function formatCoverageSummary(packageName, summary) {
  return `${packageName}: ${COVERAGE_THRESHOLD_NAMES.map(
    (name) => `${name} ${summary[name]?.pct}%`,
  ).join(", ")}`;
}

export {
  COVERAGE_THRESHOLD_NAMES,
  coverageThresholdFailures,
  formatCoverageSummary,
  mapWithConcurrency,
  validateCoverageConcurrency,
};
