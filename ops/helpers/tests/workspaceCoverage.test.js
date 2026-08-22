import { deepEqual, equal, match } from "node:assert/strict";
import { test } from "uvu";

import {
  coverageThresholdFailures,
  formatCoverageSummary,
  mapWithConcurrency,
  validateCoverageConcurrency,
} from "../workspaceCoverage.js";

test("01 - validates bounded coverage concurrency", () => {
  equal(validateCoverageConcurrency("4"), 4, "01.01");
  for (const value of [0, -1, 1.5, "nope"]) {
    let error;
    try {
      validateCoverageConcurrency(value);
    } catch (caught) {
      error = caught;
    }
    match(
      error?.message,
      /positive integer/u,
      `01.${value === 0 ? "02" : value === -1 ? "03" : value === 1.5 ? "04" : "05"}`,
    );
  }
});

test("02 - runs a fixed worker pool and retains input order", async () => {
  let active = 0;
  let peak = 0;
  const results = await mapWithConcurrency([30, 5, 10, 1], 2, async (value) => {
    active += 1;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, value));
    active -= 1;
    if (value === 10) {
      throw new Error("synthetic failure");
    }
    return value * 2;
  });

  equal(peak, 2, "02.01");
  deepEqual(
    results.map(({ status }) => status),
    ["fulfilled", "fulfilled", "rejected", "fulfilled"],
    "02.02",
  );
  equal(results[0].value, 60, "02.03");
  match(results[2].reason.message, /synthetic failure/u, "02.04");
});

test("03 - checks each package's own coverage thresholds", () => {
  const summary = {
    branches: { pct: 98 },
    functions: { pct: 100 },
    lines: { pct: 97.5 },
    statements: { pct: 99 },
  };
  deepEqual(
    coverageThresholdFailures(
      "example",
      { branches: 99, lines: 97, statements: 100 },
      summary,
    ),
    [
      "example: branches coverage 98% is below 99%",
      "example: statements coverage 99% is below 100%",
    ],
    "03.01",
  );
  equal(
    formatCoverageSummary("example", summary),
    "example: branches 98%, functions 100%, lines 97.5%, statements 99%",
    "03.02",
  );
});

test.run();
