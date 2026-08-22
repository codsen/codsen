import { test } from "uvu";
import { equal, match } from "uvu/assert";

import {
  genericRunMetrics,
  releaseRunMetrics,
  renderGithubRunSummary,
} from "../githubRunTiming.js";

function job(name, startedAt, completedAt) {
  return { completed_at: completedAt, name, started_at: startedAt };
}

const createdAt = "2026-08-22T10:00:00.000Z";

test("01 - separates critical-path time from aggregate runner time", () => {
  const jobs = [
    job(
      "Build and validate",
      "2026-08-22T10:00:05.000Z",
      "2026-08-22T10:02:05.000Z",
    ),
    job("Node 18", "2026-08-22T10:02:05.000Z", "2026-08-22T10:03:05.000Z"),
    job("CI timing summary", "2026-08-22T10:03:05.000Z", null),
  ];
  equal(
    genericRunMetrics(jobs, { createdAt, excludedName: "CI timing summary" }),
    { aggregateRunnerMs: 180_000, criticalPathMs: 185_000, jobCount: 2 },
    "01.01",
  );
});

test("02 - separates release approval wait from compute jobs", () => {
  const jobs = [
    job(
      "Verify and pack the exact release",
      "2026-08-22T10:00:05.000Z",
      "2026-08-22T10:02:05.000Z",
    ),
    job(
      "Release examples",
      "2026-08-22T10:02:05.000Z",
      "2026-08-22T10:03:05.000Z",
    ),
    job(
      "Publish to npm",
      "2026-08-22T10:05:05.000Z",
      "2026-08-22T10:06:05.000Z",
    ),
    job(
      "Push package tags",
      "2026-08-22T10:06:05.000Z",
      "2026-08-22T10:06:35.000Z",
    ),
  ];
  const metrics = releaseRunMetrics(jobs, {
    createdAt,
    excludedName: "Release timing summary",
  });
  equal(metrics.validationComputeMs, 120_000, "02.01");
  equal(metrics.approvalWaitMs, 120_000, "02.02");
  equal(metrics.publishComputeMs, 60_000, "02.03");
  equal(metrics.tagComputeMs, 30_000, "02.04");
  match(
    renderGithubRunSummary(jobs, {
      createdAt,
      excludedName: "Release timing summary",
      mode: "release",
    }).markdown,
    /Approval and publish-queue wait \| 2m 0s/,
    "02.05",
  );
});

test.run();
