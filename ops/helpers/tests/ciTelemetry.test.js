import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match } from "uvu/assert";

import {
  formatDuration,
  parseTurboSummary,
  renderVerificationSummary,
} from "../ciTelemetry.js";

const script = fileURLToPath(
  new URL("../../scripts/ci-telemetry.js", import.meta.url),
);

test("01 - parses Turbo totals and formats stable durations", () => {
  equal(
    parseTurboSummary(
      "Tasks: 103 successful, 103 total\nCached: 82 cached, 103 total",
    ),
    { cached: 82, successful: 103, total: 103 },
    "01.01",
  );
  equal(parseTurboSummary("ordinary command"), null, "01.02");
  equal(formatDuration(950), "950ms", "01.03");
  equal(formatDuration(65_400), "1m 5.4s", "01.04");
});

test("02 - renders cache and gate telemetry as a concise summary", () => {
  const summary = renderVerificationSummary(
    {
      records: [
        {
          kind: "cache",
          matchedKey: "turbo-v2-Linux-old",
          name: "Turbo",
          outcome: "restored",
        },
        {
          durationMs: 2_000,
          kind: "gate",
          name: "Build",
          status: "passed",
          turbo: { cached: 4, successful: 5, total: 5 },
        },
      ],
      startedAt: "2026-08-22T10:00:00.000Z",
    },
    "2026-08-22T10:00:03.000Z",
  );
  match(summary, /Critical verification path: \*\*3\.0s\*\*/, "02.01");
  match(summary, /\| Build \| passed \| 2\.0s \| 5 \| 4\/5 \|/, "02.02");
});

test("03 - records failures without changing their exit status or output", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "codsen-ci-telemetry-"));
  const filename = path.join(fixture, "telemetry.json");
  const environment = { ...process.env, CODSEN_CI_TELEMETRY_FILE: filename };
  try {
    equal(
      spawnSync(process.execPath, [script, "init"], {
        encoding: "utf8",
        env: environment,
      }).status,
      0,
      "03.01",
    );
    const result = spawnSync(
      process.execPath,
      [
        script,
        "run",
        "--name",
        "Injected failure",
        "--",
        process.execPath,
        "-e",
        "console.error('useful failure'); process.exit(7)",
      ],
      { encoding: "utf8", env: environment },
    );
    equal(result.status, 7, "03.02");
    match(result.stderr, /useful failure/, "03.03");
    const telemetry = JSON.parse(readFileSync(filename, "utf8"));
    equal(telemetry.records[0].status, "failed (7)", "03.04");
  } finally {
    rmSync(fixture, { force: true, recursive: true });
  }
});

test.run();
