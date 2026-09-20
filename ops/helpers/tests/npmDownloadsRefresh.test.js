import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { test } from "uvu";
import { equal, match, ok } from "uvu/assert";

import { addDays, NPM_HISTORY_START } from "../npmDownloads.js";
import {
  createNpmDownloadsSnapshot,
  readNpmDownloadsSnapshot,
  writeNpmDownloadsSnapshot,
} from "../npmDownloadsFile.js";
import { planRequests, refreshNpmDownloads } from "../npmDownloadsRefresh.js";

function entry(firstPublishedDay, status = "current") {
  return { firstPublishedDay, status, includedInPortfolio: true };
}

function daily(start, end, count = () => 7) {
  const rows = [];
  for (let day = start; day <= end; day = addDays(day, 1)) {
    rows.push({ day, downloads: count(day) });
  }
  return rows;
}

function clientFor(through, calls, count = () => 7) {
  return {
    async latestDay() {
      return through;
    },
    async range(names, start, end) {
      calls.push({ names, start, end });
      return Object.fromEntries(
        names.map((name) => [
          name,
          daily(start, end, (day) => count(day, name)),
        ]),
      );
    },
  };
}

async function withArchive(operation) {
  const repositoryRoot = await mkdtemp(
    path.join(os.tmpdir(), "npm-downloads-refresh-"),
  );
  const fixture = {
    repositoryRoot,
    archiveDirectory: path.join(repositoryRoot, "archive"),
    workDirectory: path.join(repositoryRoot, "scratch"),
    now: () => Date.parse("2026-09-09T12:00:00.000Z"),
  };
  try {
    await operation(fixture);
  } finally {
    await rm(repositoryRoot, { recursive: true, force: true });
  }
}

async function seed(fixture, roster, through, series, availability) {
  const snapshot = createNpmDownloadsSnapshot({
    roster,
    through,
    series,
    availability:
      availability ??
      Object.fromEntries(
        Object.keys(roster).map((name) => [name, "available"]),
      ),
    observedAt: "2026-09-08T12:00:00.000Z",
  });
  await writeNpmDownloadsSnapshot(
    fixture.archiveDirectory,
    fixture.workDirectory,
    snapshot,
  );
  return snapshot;
}

async function archiveBytes(fixture) {
  const snapshot = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
  const files = [
    "manifest.json",
    ...Object.values(snapshot.manifest.packages).map(({ file }) => file),
    ...(snapshot.retired
      ? [
          "retired/manifest.json",
          ...Object.values(snapshot.retired.manifest.packages).map(
            ({ file }) => `retired/${file}`,
          ),
        ]
      : []),
  ];
  return Object.fromEntries(
    await Promise.all(
      files.map(async (file) => [
        file,
        await readFile(path.join(fixture.archiveDirectory, file), "utf8"),
      ]),
    ),
  );
}

async function captureError(operation) {
  try {
    await operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected operation to reject");
}

test("01 - backfills package histories and trims prepublication data", async () => {
  await withArchive(async (fixture) => {
    const roster = {
      alpha: entry("2026-09-01"),
      beta: entry("2026-09-02", "archived"),
      future: entry("2026-09-05"),
      "@codsen/data": entry("2026-09-01", "auxiliary"),
    };
    const calls = [];
    const report = await refreshNpmDownloads({
      ...fixture,
      readRoster: () => roster,
      client: clientFor("2026-09-03", calls),
    });
    const snapshot = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(
      snapshot.series,
      {
        alpha: daily("2026-09-01", "2026-09-03"),
        beta: daily("2026-09-02", "2026-09-03"),
        future: [],
        "@codsen/data": daily("2026-09-01", "2026-09-03"),
      },
      "01.01",
    );
    equal(report.addedDays, 8, "01.02");
    equal(report.correctedDays, 0, "01.03");
    equal(report.changed, true, "01.04");
    equal(
      snapshot.manifest.packages.future.availability,
      "not-yet-published",
      "01.05",
    );
    equal(snapshot.manifest.packages.future.coverage.missing, [], "01.06");
    ok(
      calls.every(({ names }) => !names.includes("future")),
      "01.07",
    );
    ok(
      calls.every(
        ({ names }) =>
          !names.some((name) => name.startsWith("@")) || names.length === 1,
      ),
      "01.08",
    );
  });
});

test("02 - plans at most 365 days across leap years and bounds package batches", () => {
  const names = Array.from(
    { length: 130 },
    (_, i) => `package-${String(i).padStart(3, "0")}`,
  );
  names.push("@codsen/data");
  const roster = Object.fromEntries(
    names.map((name) => [name, entry("2024-01-01")]),
  );
  const requests = planRequests(roster, null, "2024-12-31", false);
  ok(
    requests.every(
      ({ start, end }) =>
        (Date.parse(end) - Date.parse(start)) / 86_400_000 + 1 <= 365,
    ),
    "02.01",
  );
  ok(
    requests.every(
      ({ names: batch }) =>
        batch.length <= 128 &&
        (!batch.some((name) => name.startsWith("@")) || batch.length === 1),
    ),
    "02.02",
  );
  for (const name of names) {
    const ranges = requests
      .filter(({ names: batch }) => batch.includes(name))
      .map(({ start, end }) => ({ start, end }));
    equal(
      ranges,
      [
        { start: "2024-01-01", end: "2024-12-30" },
        { start: "2024-12-31", end: "2024-12-31" },
      ],
      "02.03",
    );
  }
});

test("03 - merges corrections in the sixty-day overlap without changing older days", async () => {
  await withArchive(async (fixture) => {
    const roster = { alpha: entry("2026-01-01") };
    await seed(fixture, roster, "2026-04-10", {
      alpha: daily("2026-01-01", "2026-04-10"),
    });
    const calls = [];
    const report = await refreshNpmDownloads({
      ...fixture,
      readRoster: () => roster,
      client: clientFor("2026-04-10", calls, (day) =>
        day === "2026-02-10" ? 19 : 7,
      ),
    });
    const snapshot = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(
      calls,
      [{ names: ["alpha"], start: "2026-02-10", end: "2026-04-10" }],
      "03.01",
    );
    equal(report.correctedDays, 1, "03.02");
    equal(report.addedDays, 0, "03.03");
    equal(
      report.corrections,
      [{ package: "alpha", day: "2026-02-10", previous: 7, downloads: 19 }],
      "03.04",
    );
    equal(
      snapshot.series.alpha.find(({ day }) => day === "2026-02-09").downloads,
      7,
      "03.05",
    );
    equal(
      snapshot.series.alpha.find(({ day }) => day === "2026-02-10").downloads,
      19,
      "03.06",
    );
  });
});

test("04 - fills a multi-year refresh gap with contiguous bounded requests", async () => {
  await withArchive(async (fixture) => {
    const roster = { alpha: entry("2024-01-01") };
    await seed(fixture, roster, "2024-01-02", {
      alpha: daily("2024-01-01", "2024-01-02"),
    });
    const calls = [];
    const report = await refreshNpmDownloads({
      ...fixture,
      readRoster: () => roster,
      client: clientFor("2026-04-10", calls),
    });
    const snapshot = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(snapshot.series.alpha, daily("2024-01-01", "2026-04-10"), "04.01");
    equal(snapshot.manifest.packages.alpha.coverage.missing, [], "04.02");
    equal(report.addedDays, daily("2024-01-03", "2026-04-10").length, "04.03");
    ok(calls.length >= 3, "04.04");
    ok(
      calls.every(({ start, end }) => daily(start, end).length <= 365),
      "04.05",
    );
    equal(calls[0].start, "2024-01-03", "04.06");
    for (let i = 1; i < calls.length; i += 1) {
      equal(calls[i].start, addDays(calls[i - 1].end, 1), "04.07");
    }
  });
});

test("05 - unavailable packages with unknown publication dates retain saved history", async () => {
  await withArchive(async (fixture) => {
    const roster = { legacy: entry(null, "archived") };
    const initial = await seed(fixture, roster, "2015-01-11", {
      legacy: daily(NPM_HISTORY_START, "2015-01-11"),
    });
    let rosterArguments;
    const calls = [];
    const report = await refreshNpmDownloads({
      ...fixture,
      readRoster(root, previousPackages) {
        rosterArguments = { root, previousPackages };
        return roster;
      },
      client: {
        async latestDay() {
          return "2015-01-12";
        },
        async range(names, start, end) {
          calls.push({ names, start, end });
          return { legacy: null };
        },
      },
    });
    const snapshot = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(snapshot.series.legacy, initial.series.legacy, "05.01");
    equal(
      snapshot.manifest.packages.legacy.availability,
      "unavailable",
      "05.02",
    );
    equal(
      snapshot.manifest.packages.legacy.coverage.missing,
      [{ start: "2015-01-12", end: "2015-01-12" }],
      "05.03",
    );
    equal(report.unavailable, ["legacy"], "05.04");
    equal(report.addedDays, 0, "05.05");
    equal(
      rosterArguments,
      {
        root: fixture.repositoryRoot,
        previousPackages: initial.manifest.packages,
      },
      "05.06",
    );
    equal(calls[0].start, NPM_HISTORY_START, "05.07");
  });
});

test("06 - partial fetch failures preserve every canonical file", async () => {
  await withArchive(async (fixture) => {
    const roster = {
      alpha: entry("2026-09-01"),
      "@codsen/data": entry("2026-09-01", "auxiliary"),
    };
    await seed(fixture, roster, "2026-09-02", {
      alpha: daily("2026-09-01", "2026-09-02"),
      "@codsen/data": daily("2026-09-01", "2026-09-02"),
    });
    const before = await archiveBytes(fixture);
    let calls = 0;
    const error = await captureError(() =>
      refreshNpmDownloads({
        ...fixture,
        readRoster: () => roster,
        client: {
          async latestDay() {
            return "2026-09-03";
          },
          async range(names, start, end) {
            calls += 1;
            if (calls === 2) throw new Error("injected network failure");
            return Object.fromEntries(
              names.map((name) => [name, daily(start, end, () => 99)]),
            );
          },
        },
      }),
    );
    match(error.message, /injected network failure/, "06.01");
    equal(await archiveBytes(fixture), before, "06.02");
    equal(calls, 2, "06.03");
    equal(
      (await captureError(() => stat(path.join(fixture.workDirectory, "lock"))))
        .code,
      "ENOENT",
      "06.04",
    );
  });
});

test("07 - resumes failed request caches but refetches after a successful refresh", async () => {
  await withArchive(async (fixture) => {
    const roster = {
      alpha: entry("2026-09-01"),
      "@codsen/data": entry("2026-09-01", "auxiliary"),
    };
    let failedCalls = 0;
    await captureError(() =>
      refreshNpmDownloads({
        ...fixture,
        readRoster: () => roster,
        client: {
          async latestDay() {
            return "2026-09-03";
          },
          async range(names, start, end) {
            failedCalls += 1;
            if (failedCalls === 2) throw new Error("injected request failure");
            return Object.fromEntries(
              names.map((name) => [name, daily(start, end)]),
            );
          },
        },
      }),
    );
    const resumedCalls = [];
    const resumed = await refreshNpmDownloads({
      ...fixture,
      readRoster: () => roster,
      client: clientFor("2026-09-03", resumedCalls),
    });
    equal(resumed.cachedRequests, 1, "07.01");
    equal(
      resumedCalls.map(({ names }) => names),
      [["@codsen/data"]],
      "07.02",
    );
    equal(resumed.requests, 2, "07.03");
    const freshCalls = [];
    const fresh = await refreshNpmDownloads({
      ...fixture,
      readRoster: () => roster,
      client: clientFor("2026-09-03", freshCalls),
    });
    equal(fresh.cachedRequests, 0, "07.04");
    equal(freshCalls.length, 2, "07.05");
    equal(fresh.changed, false, "07.06");
  });
});

test("08 - unchanged observations preserve manifest time, file bytes, and inode", async () => {
  await withArchive(async (fixture) => {
    const roster = { alpha: entry("2026-09-01") };
    const initial = await seed(fixture, roster, "2026-09-03", {
      alpha: daily("2026-09-01", "2026-09-03"),
    });
    const before = await archiveBytes(fixture);
    const manifestPath = path.join(fixture.archiveDirectory, "manifest.json");
    const previousStat = await stat(manifestPath, { bigint: true });
    const calls = [];
    const report = await refreshNpmDownloads({
      ...fixture,
      readRoster: () => roster,
      client: clientFor("2026-09-03", calls),
    });
    const currentStat = await stat(manifestPath, { bigint: true });
    const snapshot = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(await archiveBytes(fixture), before, "08.01");
    equal(snapshot.manifest.updatedAt, initial.manifest.updatedAt, "08.02");
    equal(
      [currentStat.ino, currentStat.mtimeNs],
      [previousStat.ino, previousStat.mtimeNs],
      "08.03",
    );
    equal(report.changed, false, "08.04");
    equal([report.addedDays, report.correctedDays], [0, 0], "08.05");
    equal(calls.length, 1, "08.06");
  });
});

test("09 - rejects a regressed watermark before fetching or replacing history", async () => {
  await withArchive(async (fixture) => {
    const roster = { alpha: entry("2026-09-01") };
    await seed(fixture, roster, "2026-09-03", {
      alpha: daily("2026-09-01", "2026-09-03"),
    });
    const before = await archiveBytes(fixture);
    const calls = [];
    const error = await captureError(() =>
      refreshNpmDownloads({
        ...fixture,
        readRoster: () => roster,
        client: clientFor("2026-09-02", calls),
      }),
    );
    match(
      error.message,
      /watermark 2026-09-02 precedes saved 2026-09-03/,
      "09.01",
    );
    equal(calls, [], "09.02");
    equal(await archiveBytes(fixture), before, "09.03");
  });
});

test("10 - rechecks older flagged days and removes resolved anomaly flags", async () => {
  await withArchive(async (fixture) => {
    const names = ["alpha", "beta", "gamma"];
    const roster = Object.fromEntries(
      names.map((name) => [name, entry("2026-01-01")]),
    );
    const initial = await seed(
      fixture,
      roster,
      "2026-04-10",
      Object.fromEntries(
        names.map((name) => [
          name,
          daily("2026-01-01", "2026-04-10", (day) =>
            day === "2026-01-15" ? 0 : 150,
          ),
        ]),
      ),
    );
    equal(
      initial.manifest.anomalies.map(({ day }) => day),
      ["2026-01-15"],
      "10.01",
    );
    const calls = [];
    const report = await refreshNpmDownloads({
      ...fixture,
      readRoster: () => roster,
      client: clientFor("2026-04-10", calls, () => 150),
    });
    ok(
      calls.some(
        ({ start, end }) => start <= "2026-01-15" && end >= "2026-01-15",
      ),
      "10.02",
    );
    equal(report.correctedDays, 3, "10.03");
    equal(report.anomalies, [], "10.04");
    equal(
      (await readNpmDownloadsSnapshot(fixture.archiveDirectory)).manifest
        .anomalies,
      [],
      "10.05",
    );
  });
});

test("11 - malformed or incomplete client results cannot replace canonical data", async () => {
  await withArchive(async (fixture) => {
    const roster = { alpha: entry("2026-09-01") };
    await seed(fixture, roster, "2026-09-02", {
      alpha: daily("2026-09-01", "2026-09-02"),
    });
    const before = await archiveBytes(fixture);
    for (const result of [
      {},
      { alpha: [] },
      { alpha: daily("2026-09-01", "2026-09-02") },
      { alpha: null, other: null },
    ]) {
      const error = await captureError(() =>
        refreshNpmDownloads({
          ...fixture,
          readRoster: () => roster,
          client: {
            async latestDay() {
              return "2026-09-03";
            },
            async range() {
              return result;
            },
          },
        }),
      );
      ok(error, "11.01");
      equal(await archiveBytes(fixture), before, "11.02");
    }
  });
});

test("12 - full refresh rechecks unflagged history outside the rolling overlap", async () => {
  await withArchive(async (fixture) => {
    const roster = { alpha: entry("2026-01-01") };
    await seed(fixture, roster, "2026-04-10", {
      alpha: daily("2026-01-01", "2026-04-10"),
    });
    const calls = [];
    const report = await refreshNpmDownloads({
      ...fixture,
      full: true,
      readRoster: () => roster,
      client: clientFor("2026-04-10", calls, (day) =>
        day === "2026-01-01" ? 50 : 7,
      ),
    });
    equal(
      calls,
      [{ names: ["alpha"], start: "2026-01-01", end: "2026-04-10" }],
      "12.01",
    );
    equal(report.correctedDays, 1, "12.02");
    equal(
      (await readNpmDownloadsSnapshot(fixture.archiveDirectory)).series
        .alpha[0],
      { day: "2026-01-01", downloads: 50 },
      "12.03",
    );
  });
});

test("13 - newly known publication metadata preserves and rechecks earlier observations", async () => {
  await withArchive(async (fixture) => {
    const unknownRoster = { alpha: entry(null) };
    const initial = await seed(fixture, unknownRoster, "2015-03-20", {
      alpha: daily(NPM_HISTORY_START, "2015-03-20", (day) =>
        day === NPM_HISTORY_START ? 0 : 7,
      ),
    });
    const knownRoster = { alpha: entry("2015-01-12") };
    await refreshNpmDownloads({
      ...fixture,
      readRoster: () => knownRoster,
      client: clientFor("2015-03-20", []),
    });
    const retained = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(retained.series.alpha, initial.series.alpha, "13.01");
    equal(
      retained.manifest.packages.alpha.firstPublishedDay,
      "2015-01-12",
      "13.02",
    );
    equal(
      retained.manifest.packages.alpha.coverage.start,
      NPM_HISTORY_START,
      "13.03",
    );
    equal(retained.manifest.packages.alpha.coverage.missing, [], "13.04");
    const calls = [];
    const report = await refreshNpmDownloads({
      ...fixture,
      full: true,
      readRoster: () => knownRoster,
      client: clientFor("2015-03-20", calls, (day) =>
        day === NPM_HISTORY_START ? 9 : day === "2015-01-11" ? 11 : 7,
      ),
    });
    equal(calls[0].start, NPM_HISTORY_START, "13.05");
    equal(report.correctedDays, 2, "13.06");
    equal(
      (
        await readNpmDownloadsSnapshot(fixture.archiveDirectory)
      ).series.alpha.slice(0, 2),
      [
        { day: NPM_HISTORY_START, downloads: 9 },
        { day: "2015-01-11", downloads: 11 },
      ],
      "13.07",
    );
  });
});

test("14 - retained observations take precedence over a newly known publication date after cutoff", async () => {
  await withArchive(async (fixture) => {
    const initial = await seed(fixture, { alpha: entry(null) }, "2015-01-11", {
      alpha: daily(NPM_HISTORY_START, "2015-01-11"),
    });
    const calls = [];
    await refreshNpmDownloads({
      ...fixture,
      readRoster: () => ({ alpha: entry("2015-01-12") }),
      client: clientFor("2015-01-11", calls),
    });
    const retained = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(retained.series.alpha, initial.series.alpha, "14.01");
    equal(retained.manifest.packages.alpha.availability, "available", "14.02");
    equal(
      retained.manifest.packages.alpha.firstPublishedDay,
      "2015-01-12",
      "14.03",
    );
    equal(
      calls,
      [{ names: ["alpha"], start: NPM_HISTORY_START, end: "2015-01-11" }],
      "14.04",
    );
  });
});

test("15 - moves excluded histories to retired without querying or changing their observations", async () => {
  await withArchive(async (fixture) => {
    const initial = await seed(
      fixture,
      {
        alpha: entry("2026-09-01"),
        bitsausage: entry("2026-09-01", "deprecated"),
        "posthtml-ast-compare": entry("2026-09-01"),
        "@codsen/data": entry("2026-09-01", "auxiliary"),
      },
      "2026-09-02",
      {
        alpha: daily("2026-09-01", "2026-09-02"),
        bitsausage: daily("2026-09-01", "2026-09-02", () => 23),
        "posthtml-ast-compare": daily("2026-09-01", "2026-09-02", () => 29),
        "@codsen/data": daily("2026-09-01", "2026-09-02", () => 17),
      },
    );
    const calls = [];
    const options = {
      ...fixture,
      readRoster: () => ({ alpha: entry("2026-09-01") }),
    };
    const report = await refreshNpmDownloads({
      ...options,
      client: clientFor("2026-09-03", calls),
    });
    const migrated = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(Object.keys(migrated.manifest.packages), ["alpha"], "15.01");
    equal(
      migrated.retired.series,
      {
        "@codsen/data": initial.series["@codsen/data"],
        bitsausage: initial.series.bitsausage,
        "posthtml-ast-compare": initial.series["posthtml-ast-compare"],
      },
      "15.02",
    );
    equal(migrated.retired.manifest.through, "2026-09-02", "15.03");
    equal(
      report.movedToRetired,
      ["@codsen/data", "bitsausage", "posthtml-ast-compare"],
      "15.04",
    );
    equal(report.retiredPackages, 3, "15.05");
    equal(
      calls.map(({ names }) => names),
      [["alpha"]],
      "15.06",
    );
    equal(
      Object.values(migrated.retired.manifest.packages).map(
        ({ includedInPortfolio }) => includedInPortfolio,
      ),
      [false, false, false],
      "15.07",
    );
    equal(
      migrated.retired.manifest.packages.bitsausage.status,
      "deprecated",
      "15.08",
    );
    equal(
      migrated.retired.manifest.packages["@codsen/data"].status,
      "auxiliary",
      "15.09",
    );
    equal(
      migrated.retired.manifest.packages["posthtml-ast-compare"].status,
      "deprecated",
      "15.10",
    );
    await refreshNpmDownloads({
      ...options,
      client: clientFor("2026-09-04", []),
    });
    const refreshed = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(refreshed.retired, migrated.retired, "15.11");
  });
});

test("16 - reinstates a retired package using its saved history and publication metadata", async () => {
  await withArchive(async (fixture) => {
    const roster = { alpha: entry("2026-01-01"), beta: entry("2026-01-01") };
    const initial = await seed(fixture, roster, "2026-01-02", {
      alpha: daily("2026-01-01", "2026-01-02"),
      beta: daily("2026-01-01", "2026-01-02", () => 99),
    });
    await refreshNpmDownloads({
      ...fixture,
      readRoster: () => ({ alpha: roster.alpha }),
      client: clientFor("2026-04-10", []),
    });
    let oldMetadata;
    const calls = [];
    await refreshNpmDownloads({
      ...fixture,
      readRoster: (_root, previousPackages) => {
        oldMetadata = previousPackages.beta;
        return roster;
      },
      client: clientFor("2026-04-10", calls),
    });
    const restored = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(restored.series.beta.slice(0, 2), initial.series.beta, "16.01");
    equal(
      restored.series.beta.slice(2),
      daily("2026-01-03", "2026-04-10"),
      "16.02",
    );
    equal(oldMetadata.firstPublishedDay, "2026-01-01", "16.03");
    equal(restored.retired, undefined, "16.04");
    equal(restored.manifest.retiredRevision, undefined, "16.05");
    equal(restored.manifest.packages.beta.includedInPortfolio, true, "16.06");
    ok(
      calls.some(
        ({ names, start }) => names.includes("beta") && start === "2026-01-03",
      ),
      "16.07",
    );
  });
});

test("17 - later retirements preserve older archived rows and expose uncollected tails", async () => {
  await withArchive(async (fixture) => {
    const roster = {
      alpha: entry("2026-09-01"),
      beta: entry("2026-09-01"),
      gamma: entry("2026-09-01"),
    };
    await seed(
      fixture,
      roster,
      "2026-09-02",
      Object.fromEntries(
        Object.keys(roster).map((name) => [
          name,
          daily("2026-09-01", "2026-09-02"),
        ]),
      ),
    );
    await refreshNpmDownloads({
      ...fixture,
      readRoster: () => ({ alpha: roster.alpha, gamma: roster.gamma }),
      client: clientFor("2026-09-04", []),
    });
    const before = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    await refreshNpmDownloads({
      ...fixture,
      readRoster: () => ({ gamma: roster.gamma }),
      client: clientFor("2026-09-05", []),
    });
    const after = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(after.retired.series.beta, before.retired.series.beta, "17.01");
    equal(after.retired.series.alpha, before.series.alpha, "17.02");
    equal(after.retired.manifest.through, "2026-09-04", "17.03");
    equal(
      after.retired.manifest.packages.beta.coverage.missing,
      [{ start: "2026-09-03", end: "2026-09-04" }],
      "17.04",
    );
    equal(after.retired.manifest.packages.alpha.coverage.missing, [], "17.05");
  });
});

test("18 - failed refresh cannot partially move a package into an existing retired snapshot", async () => {
  await withArchive(async (fixture) => {
    const roster = {
      alpha: entry("2026-09-01"),
      beta: entry("2026-09-01"),
      gamma: entry("2026-09-01"),
    };
    await seed(
      fixture,
      roster,
      "2026-09-02",
      Object.fromEntries(
        Object.keys(roster).map((name) => [
          name,
          daily("2026-09-01", "2026-09-02"),
        ]),
      ),
    );
    await refreshNpmDownloads({
      ...fixture,
      readRoster: () => ({ alpha: roster.alpha, gamma: roster.gamma }),
      client: clientFor("2026-09-03", []),
    });
    const before = await archiveBytes(fixture);
    const error = await captureError(() =>
      refreshNpmDownloads({
        ...fixture,
        readRoster: () => ({ gamma: roster.gamma }),
        client: {
          async latestDay() {
            return "2026-09-04";
          },
          async range() {
            throw new Error("injected migration failure");
          },
        },
      }),
    );
    match(error.message, /injected migration failure/, "18.01");
    equal(await archiveBytes(fixture), before, "18.02");
  });
});

test("19 - advancing retired coverage marks newly elapsed publications as uncollected", async () => {
  await withArchive(async (fixture) => {
    const roster = {
      alpha: entry("2026-09-01"),
      beta: entry("2026-09-01"),
      future: entry("2026-09-03"),
    };
    await seed(
      fixture,
      roster,
      "2026-09-01",
      {
        alpha: daily("2026-09-01", "2026-09-01"),
        beta: daily("2026-09-01", "2026-09-01"),
        future: [],
      },
      { alpha: "available", beta: "available", future: "not-yet-published" },
    );
    const calls = [];
    await refreshNpmDownloads({
      ...fixture,
      readRoster: () => ({ alpha: roster.alpha, beta: roster.beta }),
      client: clientFor("2026-09-04", calls),
    });
    const before = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(
      before.retired.manifest.packages.future.availability,
      "not-yet-published",
      "19.01",
    );
    await refreshNpmDownloads({
      ...fixture,
      readRoster: () => ({ alpha: roster.alpha }),
      client: clientFor("2026-09-05", calls),
    });
    const after = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(after.retired.manifest.through, "2026-09-04", "19.02");
    equal(
      after.retired.manifest.packages.future.availability,
      "not-collected",
      "19.03",
    );
    equal(
      after.retired.manifest.packages.future.coverage.missing,
      [{ start: "2026-09-03", end: "2026-09-04" }],
      "19.04",
    );
    equal(after.retired.series.future, [], "19.05");
    equal(
      after.retired.manifest.packages.future.sha256,
      before.retired.manifest.packages.future.sha256,
      "19.06",
    );
    equal(
      calls.some(({ names }) => names.includes("future")),
      false,
      "19.07",
    );
    equal(after.retired.series.beta, before.series.beta, "19.08");
    await refreshNpmDownloads({
      ...fixture,
      readRoster: () => ({ alpha: roster.alpha, future: roster.future }),
      client: clientFor("2026-09-06", []),
    });
    const restored = await readNpmDownloadsSnapshot(fixture.archiveDirectory);
    equal(restored.manifest.packages.future.availability, "available", "19.09");
    equal(restored.series.future, daily("2026-09-03", "2026-09-06"), "19.10");
    equal(restored.manifest.packages.future.coverage.missing, [], "19.11");
    equal(Object.keys(restored.retired.manifest.packages), ["beta"], "19.12");
  });
});

test.run();
