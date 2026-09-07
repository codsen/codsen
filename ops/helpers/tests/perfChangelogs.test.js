import { test } from "uvu";
import { equal, ok, throws } from "uvu/assert";

import {
  changelogReleases,
  perfGainBullet,
  perfVersionComparisons,
  syncPerfChangelog,
  validReleaseDate,
} from "../perfChangelogs.js";

const history = { "1.0.0": 100, "1.0.1": 120, lastVersion: 120 };
const bullet =
  "- Recorded a 20% higher normalized benchmark score than v1.0.0 (100 → 120).";

test("01 - compares all retained versions in SemVer order", () => {
  const input = {
    "1.10.0": 240,
    lastVersion: 9000,
    "1.2.0": 100,
    "1.10.0-rc.10": 200,
    "1.10.0-rc.2": 150,
    lastSlowerRun: { version: "2.0.0", against: 240, score: 9000 },
  };
  const snapshot = JSON.stringify(input);
  equal(
    perfVersionComparisons(input).map(
      ({ version, baselineVersion, materialGain }) => ({
        version,
        baselineVersion,
        materialGain,
      }),
    ),
    [
      { version: "1.10.0-rc.2", baselineVersion: "1.2.0", materialGain: true },
      {
        version: "1.10.0-rc.10",
        baselineVersion: "1.10.0-rc.2",
        materialGain: true,
      },
      {
        version: "1.10.0",
        baselineVersion: "1.10.0-rc.10",
        materialGain: true,
      },
    ],
    "01.01",
  );
  equal(JSON.stringify(input), snapshot, "01.02");
});

test("02 - ignores noise, decreases and baseline-only histories", () => {
  equal(perfVersionComparisons({}), [], "02.01");
  equal(
    perfVersionComparisons({ "1.0.0": 100, lastVersion: 200 }),
    [],
    "02.02",
  );
  equal(
    perfVersionComparisons({ "1.0.0": 100, "1.0.1": 102, "1.0.2": 80 }).map(
      ({ materialGain }) => materialGain,
    ),
    [false, false],
    "02.03",
  );
});

test("03 - rejects invalid and ambiguously ordered history", () => {
  for (const input of [
    null,
    [],
    { unknown: 100 },
    { "1.0.0": 0 },
    { "1.0.0": NaN },
    { "1.0.0": "100" },
    { "1.0.0+one": 100, "1.0.0+two": 120 },
  ]) {
    throws(() => perfVersionComparisons(input));
  }
});

test("04 - creates a missing performance heading before bump-only prose", () => {
  const changelog =
    "# Change Log\n\n## 1.0.1 (2026-08-19)\n\n**Note:** Version bump only for package example\n\n## 1.0.0 (2026-08-18)\n\n- First release.\n";
  const { result } = syncPerfChangelog({ changelog, history });
  ok(
    result.includes(
      `## 1.0.1 (2026-08-19)\n\n### Performance Improvements\n\n${bullet}`,
    ),
    "04.01",
  );
  ok(
    result.includes("**Note:** Version bump only for package example"),
    "04.02",
  );
  equal(
    syncPerfChangelog({ changelog: result, history }).result,
    result,
    "04.03",
  );
});

test("05 - preserves custom performance notes and other headings", () => {
  const changelog =
    "## 1.0.1 (2026-08-19)\n\n### Bug Fixes\n\n- Preserve **this** prose.\n\n### Performance Improvements\n\n- Faster loops on long strings.\n\n### Features\n\n- A new API.\n";
  const { result } = syncPerfChangelog({ changelog, history });
  equal(
    result,
    changelog.replace(
      "### Performance Improvements",
      `### Performance Improvements\n\n${bullet}`,
    ),
    "05.01",
  );
  equal(
    syncPerfChangelog({ changelog: result, history }).result,
    result,
    "05.02",
  );
});

test("06 - refreshes and deduplicates only standardized gain bullets", () => {
  const changelog =
    "## 1.0.1 (2026-08-19)\n\n### Performance Improvements\n\n- Recorded a 10% higher normalized benchmark score than v1.0.0.\n- Custom result: 10% faster than before.\n- Recorded a 12% higher normalized benchmark score than v1.0.0 (100 → 112).\n";
  const { result } = syncPerfChangelog({ changelog, history });
  equal(result.match(/Recorded a/g)?.length, 1, "06.01");
  ok(result.includes(bullet), "06.02");
  ok(result.includes("- Custom result: 10% faster than before."), "06.03");
  equal(
    syncPerfChangelog({ changelog: result, history }).result,
    result,
    "06.04",
  );
});

test("07 - inserts missing patch releases in descending SemVer order", () => {
  const changelog =
    "# Change Log\n\n## 1.0.3 (2026-08-22)\n\n- Latest.\n\n## 1.0.0 (2026-08-18)\n\n- First.\n";
  const input = {
    changelog,
    history: { "1.0.2": 150, "1.0.0": 100, "1.0.1": 120 },
    versionDates: {
      "1.0.1": "2026-08-19",
      "1.0.2": { date: "2026-08-20", source: "git tag example@1.0.2" },
    },
  };
  const { result, changes, unresolved } = syncPerfChangelog(input);
  equal(
    changelogReleases(result).map(({ version }) => version),
    ["1.0.3", "1.0.2", "1.0.1", "1.0.0"],
    "07.01",
  );
  equal(
    changes.map(({ kind }) => kind),
    ["release", "release"],
    "07.02",
  );
  equal(unresolved, [], "07.03");
  equal(
    syncPerfChangelog({ ...input, changelog: result }).result,
    result,
    "07.04",
  );
});

test("08 - leaves missing dates unresolved without guessing", () => {
  const changelog = "# Change Log\n\n## 1.0.0 (2026-08-18)\n\n- First.\n";
  const result = syncPerfChangelog({
    changelog,
    history,
    versionDates: { "1.0.1": "2026-02-30" },
  });
  equal(result.result, changelog, "08.01");
  equal(
    result.unresolved.map(({ version }) => version),
    ["1.0.1"],
    "08.02",
  );
  equal(result.changes, [], "08.03");
  equal(validReleaseDate("2024-02-29"), true, "08.04");
  equal(validReleaseDate("2025-02-29"), false, "08.05");
});

test("09 - preserves historical notes after a workload reset", () => {
  const changelog = `## 1.0.1 (2026-08-19)\n\n### Performance Improvements\n\n${bullet}\n`;
  equal(
    syncPerfChangelog({ changelog, history: {} }).result,
    changelog,
    "09.01",
  );
  equal(
    syncPerfChangelog({ changelog, history: { "1.0.1": 120 } }).result,
    changelog,
    "09.02",
  );
  const updated = syncPerfChangelog({
    changelog,
    history: { "1.0.0": 100, "1.0.1": 101 },
  });
  equal(updated.changes[0].kind, "remove-stale", "09.03");
  ok(!updated.result.includes("Recorded a"), "09.04");
  ok(updated.result.includes("### Performance Improvements"), "09.05");
});

test("10 - parses linked headings and ignores fenced examples", () => {
  const changelog =
    "# Change Log\n\n```md\n## 1.0.1 (2020-01-01)\n\n- Recorded a 99% higher normalized benchmark score than v1.0.0.\n```\n\n## [1.0.1](https://example.com/compare) (2026-08-19)\n\n- Preserve `## 1.0.0` literally.\n";
  equal(
    changelogReleases(changelog),
    [{ version: "1.0.1", date: "2026-08-19" }],
    "10.01",
  );
  const { result } = syncPerfChangelog({ changelog, history });
  ok(result.startsWith(changelog.slice(0, changelog.indexOf("## ["))), "10.02");
  ok(result.includes(bullet), "10.03");
  ok(result.includes("- Preserve `## 1.0.0` literally."), "10.04");
});

test("11 - preserves CRLF and supports header-only changelogs", () => {
  const changelog = "# Change Log\r\n";
  const input = { changelog, history, versionDates: { "1.0.1": "2026-08-19" } };
  const { result } = syncPerfChangelog(input);
  ok(result.includes(`\r\n${bullet}\r\n`), "11.01");
  ok(!result.replaceAll("\r\n", "").includes("\n"), "11.02");
  equal(
    syncPerfChangelog({ ...input, changelog: result }).result,
    result,
    "11.03",
  );
});

test("12 - requires unique release headings", () => {
  throws(
    () =>
      syncPerfChangelog({
        changelog: "## 1.0.1 (2026-08-19)\n\n## 1.0.1 (2026-08-20)\n",
        history,
      }),
    /Duplicate changelog release/,
  );
});

test("13 - does not round a material gain into the noise band", () => {
  const result = syncPerfChangelog({
    changelog: "## 1.0.1 (2026-08-19)\n",
    history: { "1.0.0": 100, "1.0.1": 102.0001 },
  });
  ok(result.result.includes("Recorded a 2.0001%"), "13.01");
  ok(result.result.includes("(100 → 102.0001)"), "13.02");
});

test("14 - moves a leading bump note behind existing performance content", () => {
  for (const content of ["- Faster loops.", bullet]) {
    const changelog = `## 1.0.1 (2026-08-19)\n\n**Note:** Version bump only for package example\n\n### Performance Improvements\n\n${content}\n`;
    const { result } = syncPerfChangelog({ changelog, history });
    ok(result.indexOf("**Note:**") > result.indexOf(bullet), "14.01");
    ok(
      result.indexOf("### Performance Improvements") <
        result.indexOf("**Note:**"),
      "14.02",
    );
    equal(
      syncPerfChangelog({ changelog: result, history }).result,
      result,
      "14.03",
    );
  }
});

test("15 - keeps inserted list items separate from adjacent prose", () => {
  const changelog = "## 1.0.1 (2026-08-19)\nKeep this prose.\n";
  const { result } = syncPerfChangelog({ changelog, history });
  ok(result.includes(`${bullet}\n\nKeep this prose.`), "15.01");
  equal(
    syncPerfChangelog({ changelog: result, history }).result,
    result,
    "15.02",
  );
});

test("16 - reconciles wrapped standard notes and configured tolerance", () => {
  const changelog =
    "## 1.0.1 (2026-08-19)\n\n### Performance Improvements\n\n- Recorded a 10% higher normalized benchmark\n  score than v1.0.0.\n";
  const { result } = syncPerfChangelog({ changelog, history });
  equal(result.match(/Recorded a/g).length, 1, "16.01");
  ok(result.includes(bullet), "16.02");
  equal(
    perfVersionComparisons(history, { unchangedTolerancePercent: 20 })[0]
      .materialGain,
    false,
    "16.03",
  );
  throws(() =>
    perfVersionComparisons(history, { unchangedTolerancePercent: -1 }),
  );
});

test("17 - groups large scores without changing decimals or version identifiers", () => {
  const [comparison] = perfVersionComparisons({
    "1000.2000.3000": 1234567.89012345,
    "1000.2000.3001": 2469135.7802469,
  });
  equal(
    perfGainBullet(comparison),
    "- Recorded a 100% higher normalized benchmark score than v1000.2000.3000 (1,234,567.89012345 → 2,469,135.7802469).",
    "17.01",
  );
});

test("18 - groups large percentages after their existing rounding", () => {
  const [comparison] = perfVersionComparisons({
    "1.0.0": 1,
    "1.0.1": 12346.6789,
  });
  equal(
    perfGainBullet(comparison),
    "- Recorded a 1,234,567.89% higher normalized benchmark score than v1.0.0 (1 → 12,346.6789).",
    "18.01",
  );
});

test("19 - migrates and deduplicates grouped and ungrouped gain claims", () => {
  const changelog =
    "## 1.0.1 (2026-08-19)\n\n### Performance Improvements\n\n- Recorded a 1200% higher normalized benchmark score than v1.0.0 (1000.125 → 13001.625).\n- Recorded a 1,200% higher normalized benchmark score than v1.0.0 (1,000.125 → 13,001.625).\n- The 1,000-row sample now finishes faster.\n";
  const history = { "1.0.0": 1000.125, "1.0.1": 14001.75 };
  const { result } = syncPerfChangelog({ changelog, history });
  equal(result.match(/Recorded a/g).length, 1, "19.01");
  ok(
    result.includes(
      "- Recorded a 1,300% higher normalized benchmark score than v1.0.0 (1,000.125 → 14,001.75).",
    ),
    "19.02",
  );
  ok(result.includes("- The 1,000-row sample now finishes faster."), "19.03");
  equal(
    syncPerfChangelog({ changelog: result, history }).result,
    result,
    "19.04",
  );
  const stale = syncPerfChangelog({
    changelog: result,
    history: { "1.0.0": 1000.125, "1.0.1": 1001 },
  });
  ok(!stale.result.includes("Recorded a"), "19.05");
  ok(
    stale.result.includes("- The 1,000-row sample now finishes faster."),
    "19.06",
  );
});

test.run();
