function parseTurboSummary(output) {
  if (typeof output !== "string") {
    return null;
  }
  const tasks = output.match(/Tasks:\s+(\d+) successful,\s+(\d+) total/u);
  const cached = output.match(/Cached:\s+(\d+) cached,\s+(\d+) total/u);
  if (!tasks && !cached) {
    return null;
  }
  return {
    cached: cached ? Number(cached[1]) : null,
    successful: tasks ? Number(tasks[1]) : null,
    total: tasks ? Number(tasks[2]) : Number(cached[2]),
  };
}

function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    return "—";
  }
  if (milliseconds < 1_000) {
    return `${Math.round(milliseconds)}ms`;
  }
  const seconds = Math.round(milliseconds / 100) / 10;
  return seconds < 60
    ? `${seconds.toFixed(1)}s`
    : `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(1)}s`;
}

function markdownCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function renderVerificationSummary(telemetry, finishedAt) {
  const records = Array.isArray(telemetry?.records) ? telemetry.records : [];
  const gates = records.filter(({ kind }) => kind === "gate");
  const caches = records.filter(({ kind }) => kind === "cache");
  const startedAt = Date.parse(telemetry?.startedAt);
  const endedAt = Date.parse(finishedAt);
  const lines = [
    "## Repository verification timings",
    "",
    `Critical verification path: **${formatDuration(endedAt - startedAt)}**. ` +
      `Recorded gate runner time: **${formatDuration(
        gates.reduce((total, gate) => total + gate.durationMs, 0),
      )}**.`,
    "",
  ];
  if (caches.length > 0) {
    lines.push(
      "| Cache | Outcome | Matched key |",
      "| --- | --- | --- |",
      ...caches.map((record) =>
        [
          `| ${markdownCell(record.name)}`,
          markdownCell(record.outcome),
          `${markdownCell(record.matchedKey || "—")} |`,
        ].join(" | "),
      ),
      "",
    );
  }
  lines.push(
    "| Gate | Status | Wall time | Turbo tasks | Turbo cache |",
    "| --- | --- | ---: | ---: | ---: |",
    ...gates.map((record) => {
      const turbo = record.turbo;
      return [
        `| ${markdownCell(record.name)}`,
        markdownCell(record.status),
        formatDuration(record.durationMs),
        turbo?.total ?? "—",
        turbo?.cached === null || turbo?.cached === undefined
          ? "—"
          : `${turbo.cached}/${turbo.total}`,
        "|",
      ].join(" | ");
    }),
    "",
  );
  return `${lines.join("\n")}\n`;
}

export { formatDuration, parseTurboSummary, renderVerificationSummary };
