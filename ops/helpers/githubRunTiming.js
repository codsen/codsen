function timestamp(value, context) {
  const result = Date.parse(value);
  if (!Number.isFinite(result)) {
    throw new TypeError(`${context} must be an ISO timestamp`);
  }
  return result;
}

function jobDuration(job) {
  if (!job.started_at || !job.completed_at) {
    return null;
  }
  return (
    timestamp(job.completed_at, `${job.name} completion`) -
    timestamp(job.started_at, `${job.name} start`)
  );
}

function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    return "—";
  }
  const seconds = Math.round(milliseconds / 1_000);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remainder}s` : `${remainder}s`;
}

function completedJobs(jobs, excludedName) {
  if (!Array.isArray(jobs)) {
    throw new TypeError("GitHub run jobs must be an array");
  }
  return jobs.filter(
    (job) =>
      job &&
      typeof job.name === "string" &&
      job.name !== excludedName &&
      job.started_at &&
      job.completed_at,
  );
}

function genericRunMetrics(jobs, { createdAt, excludedName }) {
  const completed = completedJobs(jobs, excludedName);
  const created = timestamp(createdAt, "workflow creation");
  const completedTimes = completed.map((job) =>
    timestamp(job.completed_at, `${job.name} completion`),
  );
  return {
    aggregateRunnerMs: completed.reduce(
      (total, job) => total + jobDuration(job),
      0,
    ),
    criticalPathMs:
      completedTimes.length > 0 ? Math.max(...completedTimes) - created : 0,
    jobCount: completed.length,
  };
}

function namedJob(jobs, name) {
  return jobs.find((job) => job.name === name);
}

function releaseRunMetrics(jobs, options) {
  const generic = genericRunMetrics(jobs, options);
  const completed = completedJobs(jobs, options.excludedName);
  const publish = namedJob(completed, "Publish to npm");
  const tags = namedJob(completed, "Push package tags");
  const validation = namedJob(completed, "Verify and pack the exact release");
  const prerequisites = completed.filter(
    ({ name }) =>
      name !== "Publish to npm" &&
      name !== "Push package tags" &&
      name !== options.excludedName,
  );
  const prerequisitesCompletedAt = prerequisites.map((job) =>
    timestamp(job.completed_at, `${job.name} completion`),
  );
  const approvalWaitMs =
    publish && prerequisitesCompletedAt.length > 0
      ? Math.max(
          0,
          timestamp(publish.started_at, "publish start") -
            Math.max(...prerequisitesCompletedAt),
        )
      : null;
  return {
    ...generic,
    approvalWaitMs,
    publishComputeMs: publish ? jobDuration(publish) : null,
    tagComputeMs: tags ? jobDuration(tags) : null,
    validationComputeMs: validation ? jobDuration(validation) : null,
  };
}

function renderGithubRunSummary(jobs, options) {
  const metrics =
    options.mode === "release"
      ? releaseRunMetrics(jobs, options)
      : genericRunMetrics(jobs, options);
  const lines = [
    `## ${options.mode === "release" ? "Release" : "CI"} workflow timing`,
    "",
    "| Metric | Duration |",
    "| --- | ---: |",
    `| Critical path | ${formatDuration(metrics.criticalPathMs)} |`,
    `| Aggregate completed runner time | ${formatDuration(metrics.aggregateRunnerMs)} |`,
  ];
  if (options.mode === "release") {
    lines.push(
      `| Validation and packing compute | ${formatDuration(metrics.validationComputeMs)} |`,
      `| Approval and publish-queue wait | ${formatDuration(metrics.approvalWaitMs)} |`,
      `| Publish job compute | ${formatDuration(metrics.publishComputeMs)} |`,
      `| Tag job compute | ${formatDuration(metrics.tagComputeMs)} |`,
    );
  }
  lines.push("", `Completed jobs measured: ${metrics.jobCount}.`, "");
  return { markdown: `${lines.join("\n")}\n`, metrics };
}

export {
  formatDuration,
  genericRunMetrics,
  jobDuration,
  releaseRunMetrics,
  renderGithubRunSummary,
};
