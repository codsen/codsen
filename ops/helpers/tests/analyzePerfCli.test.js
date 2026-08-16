import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, ok } from "uvu/assert";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const analyzeScript = path.join(
  repositoryRoot,
  ".agents/skills/calculate-the-perf-performance/scripts/analyze-perf.mjs",
);

// the smallest tree the analyser accepts as a monorepo root
function createMonorepo(packages) {
  const root = mkdtempSync(path.join(tmpdir(), "analyze-perf-"));
  writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({ name: "codsen-mono", version: "0.0.0" }),
  );
  for (const [name, { history, version }] of Object.entries(packages)) {
    const perfDirectory = path.join(root, "packages", name, "perf");
    mkdirSync(perfDirectory, { recursive: true });
    writeFileSync(
      path.join(root, "packages", name, "package.json"),
      JSON.stringify({ name, version }),
    );
    writeFileSync(path.join(perfDirectory, "historical.json"), history);
  }
  return root;
}

function analyze(root) {
  const result = spawnSync(process.execPath, [analyzeScript, "--root", root], {
    encoding: "utf8",
  });
  return {
    ...result,
    report: result.stdout ? JSON.parse(result.stdout) : null,
  };
}

test("01 - names a kept regression and its percentage", () => {
  const root = createMonorepo({
    "ranges-sort": {
      version: "6.1.3",
      history: `{
  "6.1.2": 2_688_120,
  "lastSlowerRun": {
    "against": 2_688_120,
    "score": 1_881_684,
    "version": "6.1.3",
    "worst": 1_800_000
  },
  "lastVersion": 2_688_120
}
`,
    },
  });

  try {
    const { report, status } = analyze(root);

    // The baseline is deliberately retained, so reading `lastVersion` alone
    // reports 0% and "roughlyUnchanged" for a 30% regression. That was the
    // REV-046 failure mode.
    equal(status, 0, "01.01");
    equal(report.totals.pendingRegression, 1, "01.02");
    equal(report.pendingRegressions.length, 1, "01.03");
    const [pending] = report.pendingRegressions;
    equal(pending.classification, "pendingRegression", "01.04");
    equal(pending.deltaPct, -30, "01.05");
    equal(pending.baselineOpsPerSec, 2688120, "01.06");
    equal(pending.latestOpsPerSec, 1881684, "01.07");
    equal(pending.baselineVersion, "6.1.2", "01.08");
    equal(pending.measuredVersion, "6.1.3", "01.09");
    // the worst measurement survives a partial recovery
    equal(pending.worstOpsPerSec, 1800000, "01.10");
    equal(pending.worstPct, -33.04, "01.11");
    // and it ranks with the other regressions rather than only in its own list
    equal(report.largestRegressions[0].packageDir, "ranges-sort", "01.12");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test("02 - counts a kept regression apart from a moved baseline", () => {
  const root = createMonorepo({
    kept: {
      version: "2.0.0",
      history: `{
  "1.0.0": 100,
  "lastSlowerRun": { "against": 100, "score": 70, "version": "2.0.0", "worst": 70 },
  "lastVersion": 100
}
`,
    },
    moved: {
      version: "2.0.0",
      history: `{
  "1.0.0": 100,
  "2.0.0": 70,
  "lastVersion": 70
}
`,
    },
  });

  try {
    const { report } = analyze(root);

    // both are 30% down, but one was absorbed into the baseline and one was not
    equal(report.totals.pendingRegression, 1, "02.01");
    equal(report.totals.slower, 1, "02.02");
    equal(report.totals.compared, 2, "02.03");
    // the aggregate reflects the measurement, not the retained baseline
    equal(report.aggregate.medianPct, -30, "02.04");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test("03 - leaves an ordinary history unchanged", () => {
  const root = createMonorepo({
    plain: {
      version: "1.0.1",
      history: `{
  "1.0.0": 100,
  "1.0.1": 120,
  "lastVersion": 120
}
`,
    },
  });

  try {
    const { report } = analyze(root);

    equal(report.totals.pendingRegression, 0, "03.01");
    equal(report.pendingRegressions, [], "03.02");
    equal(report.totals.faster, 1, "03.03");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test("04 - reports a malformed record instead of ignoring it", () => {
  const root = createMonorepo({
    broken: {
      version: "1.0.0",
      history: `{
  "1.0.0": 100,
  "lastSlowerRun": { "against": 0, "score": 70 },
  "lastVersion": 100
}
`,
    },
  });

  try {
    const { report } = analyze(root);

    equal(report.totals.skipped, 1, "04.01");
    ok(report.issues[0].error.includes("lastSlowerRun"), "04.02");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test.run();
