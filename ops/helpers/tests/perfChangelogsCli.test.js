import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, ok } from "uvu/assert";

const script = fileURLToPath(
  new URL("../../scripts/sync-perf-changelogs.js", import.meta.url),
);
const changelog = "# Change Log\n\n## 1.0.0 (2026-08-18)\n\n- First release.\n";
const history = '{ "1.0.0": 1_000, "1.0.1": 1_200, "lastVersion": 1_200 }\n';

function runGit(root, args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: "Test Author",
      GIT_AUTHOR_EMAIL: "author@example.com",
      GIT_COMMITTER_NAME: "Test Author",
      GIT_COMMITTER_EMAIL: "author@example.com",
      GIT_AUTHOR_DATE: "2026-08-19T12:00:00Z",
      GIT_COMMITTER_DATE: "2026-08-20T12:00:00Z",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function fixture({
  tagged = true,
  source = changelog,
  version = "1.0.1",
} = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "perf-changelogs-"));
  mkdirSync(path.join(root, "packages/example/perf"), { recursive: true });
  mkdirSync(path.join(root, "ops"));
  writeFileSync(
    path.join(root, "ops/perf-policy.json"),
    JSON.stringify({
      unchangedTolerancePercent: 2,
      regressionThresholdPercent: 10,
    }),
  );
  writeFileSync(path.join(root, "package.json"), '{ "name": "codsen-mono" }\n');
  writeFileSync(
    path.join(root, "packages/example/package.json"),
    JSON.stringify({ name: "example", version }),
  );
  writeFileSync(path.join(root, "packages/example/CHANGELOG.md"), source);
  writeFileSync(
    path.join(root, "packages/example/perf/historical.json"),
    history,
  );
  runGit(root, ["init", "--quiet"]);
  runGit(root, ["add", "."]);
  runGit(root, [
    "-c",
    "core.hooksPath=/dev/null",
    "-c",
    "commit.gpgSign=false",
    "commit",
    "--quiet",
    "-m",
    "test fixture",
  ]);
  if (tagged) {
    runGit(root, [
      "-c",
      "tag.gpgSign=false",
      "tag",
      "-a",
      "example@1.0.1",
      "-m",
      "example@1.0.1",
    ]);
  }
  return root;
}

function run(root, args = []) {
  const output = spawnSync(
    process.execPath,
    [script, "--root", root, ...args],
    { encoding: "utf8" },
  );
  return {
    ...output,
    report: output.stdout ? JSON.parse(output.stdout) : null,
  };
}

test("01 - check reports missing gains without writing and verifies exact tags", () => {
  const root = fixture();
  try {
    const { status, report } = run(root, ["--check"]);
    equal(status, 1, "01.01");
    equal(report.changedPackages, ["example"], "01.02");
    equal(
      report.changes[0].evidence,
      { date: "2026-08-20", source: "git tag example@1.0.1" },
      "01.03",
    );
    equal(report.unresolved, [], "01.04");
    equal(
      readFileSync(path.join(root, "packages/example/CHANGELOG.md"), "utf8"),
      changelog,
      "01.05",
    );
    equal(
      readFileSync(
        path.join(root, "packages/example/perf/historical.json"),
        "utf8",
      ),
      history,
      "01.06",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("02 - write reconciles once and subsequent check passes", () => {
  const root = fixture();
  try {
    const first = run(root);
    equal(first.status, 0, "02.01");
    equal(first.report.written, true, "02.02");
    const contents = readFileSync(
      path.join(root, "packages/example/CHANGELOG.md"),
      "utf8",
    );
    ok(contents.includes("## 1.0.1 (2026-08-20)"), "02.03");
    ok(contents.includes("(1,000 → 1,200)"), "02.04");
    const second = run(root, ["--check"]);
    equal(second.status, 0, "02.05");
    equal(second.report.changes, [], "02.06");
    equal(
      readFileSync(
        path.join(root, "packages/example/perf/historical.json"),
        "utf8",
      ),
      history,
      "02.07",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("03 - dry-run shows resolved changes without writing", () => {
  const root = fixture();
  try {
    const { status, report } = run(root, ["--dry-run"]);
    equal(status, 0, "03.01");
    equal(report.written, false, "03.02");
    equal(
      readFileSync(path.join(root, "packages/example/CHANGELOG.md"), "utf8"),
      changelog,
      "03.03",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("04 - an unverified tag leaves the date unresolved and prevents all writes", () => {
  const root = fixture({ version: "1.0.0" });
  try {
    const other = path.join(root, "packages/other");
    mkdirSync(path.join(other, "perf"), { recursive: true });
    writeFileSync(
      path.join(other, "package.json"),
      '{ "name": "other", "version": "1.0.1" }',
    );
    const otherChangelog = "## 1.0.1 (2026-08-20)\n\n- Existing release.\n";
    writeFileSync(path.join(other, "CHANGELOG.md"), otherChangelog);
    writeFileSync(path.join(other, "perf/historical.json"), history);
    const { status, report } = run(root);
    equal(status, 1, "04.01");
    equal(
      report.unresolved.map(({ package: name, version }) => ({
        name,
        version,
      })),
      [{ name: "example", version: "1.0.1" }],
      "04.02",
    );
    equal(report.written, false, "04.03");
    equal(
      readFileSync(path.join(other, "CHANGELOG.md"), "utf8"),
      otherChangelog,
      "04.04",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("05 - recovers an omitted release date from its own historical heading", () => {
  const root = fixture({
    tagged: false,
    source:
      "## 1.0.1 (2026-08-17)\n\n**Note:** Version bump only for package example\n",
  });
  try {
    writeFileSync(path.join(root, "packages/example/CHANGELOG.md"), changelog);
    const { status, report } = run(root, ["--dry-run"]);
    equal(status, 0, "05.01");
    equal(report.changes[0].date, "2026-08-17", "05.02");
    ok(report.changes[0].evidence.source.startsWith("git "), "05.03");
    ok(
      report.changes[0].evidence.source.endsWith(
        ":packages/example/CHANGELOG.md",
      ),
      "05.04",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("06 - malformed history reports an error without mutating it", () => {
  const root = fixture();
  try {
    const filename = path.join(root, "packages/example/perf/historical.json");
    writeFileSync(filename, '{ "1.0.0": 0, "1.0.1": 120 }\n');
    const { status, report } = run(root);
    equal(status, 1, "06.01");
    equal(report.errors.length, 1, "06.02");
    equal(report.written, false, "06.03");
    equal(
      readFileSync(filename, "utf8"),
      '{ "1.0.0": 0, "1.0.1": 120 }\n',
      "06.04",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("07 - rejects unsupported arguments before scanning", () => {
  const root = fixture();
  try {
    const result = run(root, ["--unknown"]);
    equal(result.status, 1, "07.01");
    ok(result.stderr.includes("Unsupported argument: --unknown"), "07.02");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("08 - honors package noise overrides", () => {
  const root = fixture();
  try {
    writeFileSync(
      path.join(root, "ops/perf-policy.json"),
      JSON.stringify({
        unchangedTolerancePercent: 2,
        regressionThresholdPercent: 30,
        packageOverrides: { example: { unchangedTolerancePercent: 25 } },
      }),
    );
    const { status, report } = run(root, ["--check"]);
    equal(status, 0, "08.01");
    equal(report.changes, [], "08.02");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("09 - recovers linked release headings outside the current Git ancestry", () => {
  const root = fixture({
    tagged: false,
    source:
      "## [1.0.1](https://example.com/compare) (2021-12-24)\n\n**Note:** Version bump only for package example\n",
  });
  try {
    runGit(root, ["tag", "archived-history"]);
    writeFileSync(path.join(root, "packages/example/CHANGELOG.md"), changelog);
    runGit(root, ["add", "."]);
    const tree = runGit(root, ["write-tree"]).trim();
    const commit = runGit(root, [
      "commit-tree",
      tree,
      "-m",
      "independent current history",
    ]).trim();
    runGit(root, ["update-ref", "HEAD", commit]);
    const { status, report } = run(root, ["--dry-run"]);
    equal(status, 0, "09.01");
    equal(report.changes[0].date, "2021-12-24", "09.02");
    ok(report.changes[0].evidence.source.startsWith("git "), "09.03");
    equal(report.unresolved, [], "09.04");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test.run();
