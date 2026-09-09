import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";

import { addDays } from "../npmDownloads.js";
import { createNpmDownloadsSnapshot } from "../npmDownloadsFile.js";
import { buildDownloadCharts } from "../statisticsChartsDownloads.js";

function rows(start, end, downloads = 1) {
  const result = [];
  for (let day = start; day <= end; day = addDays(day, 1)) {
    result.push({ day, downloads });
    if (day === end) break;
  }
  return result;
}

function snapshot(definitions, through = "2021-12-31") {
  const roster = {};
  const series = {};
  const availability = {};
  for (const [name, definition] of Object.entries(definitions)) {
    roster[name] = {
      status: definition.status ?? "current",
      includedInPortfolio: definition.includedInPortfolio ?? true,
      firstPublishedDay: Object.hasOwn(definition, "firstPublishedDay")
        ? definition.firstPublishedDay
        : "2021-01-01",
    };
    series[name] =
      definition.rows ?? rows("2021-01-01", through, definition.downloads ?? 1);
    availability[name] = definition.availability ?? "available";
  }
  return createNpmDownloadsSnapshot({
    roster,
    series,
    availability,
    through,
    observedAt: "2022-01-01T00:00:00.000Z",
  });
}

test("01 - reports an exact 80/20 distribution over an inclusive 365-day window", () => {
  const { files, summary } = buildDownloadCharts(
    snapshot({
      alpha: { downloads: 80 },
      beta: { downloads: 5 },
      gamma: { downloads: 5 },
      delta: { downloads: 5 },
      epsilon: { downloads: 5 },
    }),
  );
  equal(summary.recent.start, "2021-01-01", "01.01");
  equal(summary.recent.end, "2021-12-31", "01.02");
  equal(summary.recent.days, 365, "01.03");
  equal(summary.recent.totalDownloads, 36_500, "01.04");
  equal(summary.recent.packagesFor80Percent, 1, "01.05");
  equal(summary.recent.packageShareFor80Percent, 20, "01.06");
  equal(summary.recent.achieved80PercentShare, 80, "01.07");
  equal(summary.recent.top20PercentCount, 1, "01.08");
  equal(summary.recent.top20PercentDownloadShare, 80, "01.09");
  equal(summary.recent.ranked.at(-1).cumulativeShare, 100, "01.10");
  equal(
    Object.keys(files).sort(),
    [
      "download-concentration-history.svg",
      "download-concentration.svg",
      "download-ranking.svg",
    ],
    "01.11",
  );
  match(
    files["download-ranking.svg"],
    /href="https:\/\/codsen.com\/os\/alpha"/,
  );
});

test("02 - ranks ties deterministically and rounds the top fifth up with zero-count packages retained", () => {
  const { recent } = buildDownloadCharts(
    snapshot({
      zeta: { downloads: 10 },
      gamma: { downloads: 10 },
      beta: { downloads: 10 },
      alpha: { downloads: 50 },
      epsilon: { downloads: 10 },
      delta: { downloads: 10 },
      zero: { downloads: 0 },
    }),
  ).summary;
  equal(
    recent.ranked.map(({ name }) => name),
    ["alpha", "beta", "delta", "epsilon", "gamma", "zeta", "zero"],
    "02.01",
  );
  equal(recent.packageCount, 7, "02.02");
  equal(recent.top20PercentCount, 2, "02.03");
  equal(recent.top20PercentDownloadShare, 60, "02.04");
  equal(recent.packagesFor80Percent, 4, "02.05");
  equal(recent.ranked.at(-1).downloads, 0, "02.06");
});

test("03 - excludes unavailable, retired, deprecated, auxiliary and generated-data entries", () => {
  const source = snapshot({
    active: {},
    deprecated: { status: "deprecated" },
    archived: { status: "archived" },
    auxiliary: { status: "auxiliary" },
    unavailable: { availability: "unavailable", rows: [] },
    "not-collected": { availability: "not-collected", rows: [] },
    "not-published": {
      availability: "not-yet-published",
      firstPublishedDay: "2022-01-01",
      rows: [],
    },
    outside: { includedInPortfolio: false },
    "@codsen/data": {},
  });
  source.retired = {
    manifest: { packages: { retired: {} } },
    series: { retired: rows("2021-01-01", "2021-12-31", 100_000) },
  };
  const { summary } = buildDownloadCharts(source);
  equal(summary.recent.packageCount, 1, "03.01");
  equal(summary.recent.totalDownloads, 365, "03.02");
  equal(
    summary.excludedPackages.map(({ name }) => name),
    [
      "@codsen/data",
      "archived",
      "auxiliary",
      "deprecated",
      "not-collected",
      "not-published",
      "outside",
      "unavailable",
    ],
    "03.03",
  );
});

test("04 - missing observations invalidate the cohort ratio instead of silently shrinking its denominator", () => {
  const { summary, files } = buildDownloadCharts(
    snapshot({
      complete: {},
      gap: {
        rows: rows("2021-01-01", "2021-12-31").filter(
          ({ day }) => day !== "2021-06-02",
        ),
      },
    }),
  );
  equal(summary.recent.packageCount, 2, "04.01");
  equal(summary.recent.missingPackages, ["gap"], "04.02");
  equal(summary.recent.observedDownloads, 729, "04.03");
  equal(summary.recent.totalDownloads, null, "04.04");
  equal(summary.recent.packagesFor80Percent, null, "04.05");
  equal(summary.recent.top20PercentDownloadShare, null, "04.06");
  equal(summary.recent.ranked, [], "04.07");
  match(files["download-concentration.svg"], /concentration is unavailable/);
});

test("05 - accepts known prepublication zeros but preserves uncertainty with unknown publication dates", () => {
  const known = buildDownloadCharts(
    snapshot({
      new: {
        firstPublishedDay: "2021-12-31",
        rows: rows("2021-12-31", "2021-12-31", 10),
      },
    }),
  ).summary.recent;
  const unknown = buildDownloadCharts(
    snapshot({
      new: {
        firstPublishedDay: null,
        rows: rows("2021-12-31", "2021-12-31", 10),
      },
    }),
  ).summary.recent;
  equal(known.complete, true, "05.01");
  equal(known.totalDownloads, 10, "05.02");
  equal(known.packagesFor80Percent, 1, "05.03");
  equal(unknown.complete, false, "05.04");
  equal(unknown.totalDownloads, null, "05.05");
  equal(unknown.observedDownloads, 10, "05.06");
});

test("06 - observations older than publication metadata prevent a false prepublication zero", () => {
  const recent = buildDownloadCharts(
    snapshot({
      new: {
        firstPublishedDay: "2021-01-03",
        rows: [
          { day: "2021-01-01", downloads: 10 },
          ...rows("2021-01-03", "2021-12-31"),
        ],
      },
    }),
  ).summary.recent;
  equal(recent.complete, false, "06.01");
  equal(recent.missingPackages, ["new"], "06.02");
});

test("07 - keeps suspicious recorded zeros in provisional figures and ignores unrelated anomalies", () => {
  const source = snapshot({ alpha: {}, beta: { status: "deprecated" } });
  source.manifest.anomalies = [
    { day: "2021-02-03", kind: "suspected-shared-zero", packages: ["alpha"] },
    { day: "2021-02-04", kind: "suspected-shared-zero", packages: ["beta"] },
    { day: "2020-02-04", kind: "suspected-shared-zero", packages: ["alpha"] },
  ];
  source.series.alpha.find(({ day }) => day === "2021-02-03").downloads = 0;
  const { files, summary } = buildDownloadCharts(source);
  equal(summary.recent.complete, true, "07.01");
  equal(summary.recent.provisional, true, "07.02");
  equal(summary.recent.totalDownloads, 364, "07.03");
  equal(summary.recent.anomalyDays, ["2021-02-03"], "07.04");
  match(files["download-concentration.svg"], /1 suspected shared-zero days/);
});

test("08 - historical calendar years keep a fixed cohort, respect leap years and omit the partial current year", () => {
  const source = snapshot(
    {
      alpha: {
        firstPublishedDay: "2019-01-01",
        rows: [
          ...rows("2019-01-01", "2020-12-31", 9),
          ...rows("2021-01-01", "2022-06-15", 1),
        ],
      },
      beta: {
        firstPublishedDay: "2021-01-01",
        rows: rows("2021-01-01", "2022-06-15", 1),
      },
    },
    "2022-06-15",
  );
  const { history, recent } = buildDownloadCharts(source).summary;
  equal(
    history.map(({ year }) => year),
    [2019, 2020, 2021],
    "08.01",
  );
  equal(
    history.map(({ packageCount }) => packageCount),
    [2, 2, 2],
    "08.02",
  );
  equal(
    history.map(({ days }) => days),
    [365, 366, 365],
    "08.03",
  );
  equal(
    history.map(({ top20PercentDownloadShare }) => top20PercentDownloadShare),
    [100, 100, 50],
    "08.04",
  );
  equal(
    history.map(({ packagesFor80Percent }) => packagesFor80Percent),
    [1, 1, 2],
    "08.05",
  );
  equal(recent.days, 365, "08.06");
  equal(recent.start, "2021-06-16", "08.07");
});

test("09 - zero downloads and an empty eligible cohort never invent concentration percentages", () => {
  const zeros = buildDownloadCharts(snapshot({ zero: { downloads: 0 } }));
  const empty = buildDownloadCharts(
    snapshot({ deprecated: { status: "deprecated" } }),
  );
  equal(zeros.summary.recent.totalDownloads, 0, "09.01");
  equal(zeros.summary.recent.packagesFor80Percent, null, "09.02");
  equal(zeros.summary.recent.top20PercentDownloadShare, null, "09.03");
  equal(empty.summary.recent.packageCount, 0, "09.04");
  equal(empty.summary.recent.packageShareFor80Percent, null, "09.05");
  equal(empty.summary.history, [], "09.06");
  match(
    zeros.files["download-concentration.svg"],
    /concentration is undefined/,
  );
  match(empty.files["download-concentration.svg"], /No eligible packages/);
  equal(
    [...Object.values(zeros.files), ...Object.values(empty.files)].some((svg) =>
      /NaN|Infinity/.test(svg),
    ),
    false,
    "09.07",
  );
});

test("10 - rejects an unsafe aggregate across packages", () => {
  const source = snapshot({
    alpha: {
      firstPublishedDay: "2021-12-31",
      rows: [{ day: "2021-12-31", downloads: Number.MAX_SAFE_INTEGER }],
    },
    beta: {
      firstPublishedDay: "2021-12-31",
      rows: [{ day: "2021-12-31", downloads: 1 }],
    },
  });
  throws(() => buildDownloadCharts(source), /unsafe download aggregate/);
});

test("11 - output is deterministic and does not mutate the verified snapshot", () => {
  const source = snapshot({ zeta: {}, alpha: {} });
  const before = JSON.stringify(source);
  const first = buildDownloadCharts(source);
  const second = buildDownloadCharts(source);
  equal(JSON.stringify(first), JSON.stringify(second), "11.01");
  equal(JSON.stringify(source), before, "11.02");
  equal(JSON.parse(JSON.stringify(first.summary)), first.summary, "11.03");
});

test("12 - missing historical observations leave a gap without invalidating a later complete window", () => {
  const source = snapshot({
    alpha: {
      firstPublishedDay: "2019-01-01",
      rows: rows("2019-01-01", "2021-12-31").filter(
        ({ day }) => day !== "2020-05-03",
      ),
    },
  });
  const { files, summary } = buildDownloadCharts(source);
  equal(summary.recent.complete, true, "12.01");
  equal(
    summary.history.map(({ complete }) => complete),
    [true, false, true],
    "12.02",
  );
  equal(
    summary.history.map(({ packagesFor80Percent }) => packagesFor80Percent),
    [1, null, 1],
    "12.03",
  );
  equal(summary.history[1].missingPackages, ["alpha"], "12.04");
  match(files["download-concentration-history.svg"], />n\/a<\/text>/);
});

test.run();
