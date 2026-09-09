import { spawnSync } from "node:child_process";
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";

import { addDays, packageFile, serializeNdjson } from "../npmDownloads.js";
import {
  createNpmDownloadsExport,
  exportNpmDownloads,
} from "../npmDownloadsExport.js";
import { createNpmDownloadsSnapshot, jsonText } from "../npmDownloadsFile.js";

const cli = fileURLToPath(
  new URL("../../scripts/export-npm-downloads.js", import.meta.url),
);

function rows(start, end, downloads = 10) {
  const result = [];
  for (let day = start; day <= end; day = addDays(day, 1)) {
    result.push({ day, downloads });
    if (day === end) break;
  }
  return result;
}

function snapshot(definitions = { example: {} }, through = "2020-02-02") {
  const roster = {};
  const series = {};
  const availability = {};
  for (const [name, definition] of Object.entries(definitions)) {
    roster[name] = {
      status: definition.status ?? "current",
      includedInPortfolio: definition.includedInPortfolio ?? true,
      firstPublishedDay: Object.hasOwn(definition, "firstPublishedDay")
        ? definition.firstPublishedDay
        : "2020-01-01",
    };
    series[name] = definition.rows ?? rows("2020-01-01", through);
    availability[name] = definition.availability ?? "available";
  }
  return createNpmDownloadsSnapshot({
    roster,
    series,
    availability,
    through,
    observedAt: "2020-02-03T00:00:00.000Z",
  });
}

async function withArchive(value, callback) {
  const root = await mkdtemp(path.join(tmpdir(), "npm-downloads-export-"));
  const archiveDirectory = path.join(root, "archive");
  const outputDirectory = path.join(root, "charts");
  try {
    await mkdir(archiveDirectory);
    for (const [name, downloads] of Object.entries(value.series)) {
      const filename = path.join(archiveDirectory, packageFile(name));
      await mkdir(path.dirname(filename), { recursive: true });
      await writeFile(filename, serializeNdjson(downloads));
    }
    await writeFile(
      path.join(archiveDirectory, "manifest.json"),
      jsonText(value.manifest),
    );
    await callback({ root, archiveDirectory, outputDirectory });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function rejects(callback, pattern) {
  let caught;
  try {
    await callback();
  } catch (error) {
    caught = error;
  }
  match(caught?.message ?? "No error thrown", pattern);
}

test("01 - retains every daily observation and calculates complete and partial months", () => {
  const source = snapshot();
  const { charts, index } = createNpmDownloadsExport(source);
  equal(charts.example.downloads, source.series.example, "01.01");
  equal(
    charts.example.monthly,
    [
      {
        month: "2020-01",
        downloads: 310,
        observedDownloads: 310,
        complete: true,
        provisional: false,
      },
      {
        month: "2020-02",
        downloads: 20,
        observedDownloads: 20,
        complete: false,
        provisional: false,
      },
    ],
    "01.02",
  );
  equal(
    index.packages.example.recent7,
    {
      start: "2020-01-27",
      end: "2020-02-02",
      downloads: 70,
      observedDownloads: 70,
      complete: true,
      provisional: false,
    },
    "01.03",
  );
  equal(index.packages.example.recent30.downloads, 300, "01.04");
  equal(index.revision, source.manifest.revision, "01.05");
  equal(charts.example.revision, index.revision, "01.06");
  equal(
    index.packages.example.sourceSha256,
    source.manifest.packages.example.sha256,
    "01.07",
  );
});

test("02 - known publication dates allow zero before publication in totals", () => {
  const { charts, index } = createNpmDownloadsExport(
    snapshot({
      example: {
        firstPublishedDay: "2020-01-20",
        rows: rows("2020-01-20", "2020-02-02"),
      },
    }),
  );
  equal(
    charts.example.monthly[0],
    {
      month: "2020-01",
      downloads: 120,
      observedDownloads: 120,
      complete: true,
      provisional: false,
    },
    "02.01",
  );
  equal(index.packages.example.recent30.downloads, 140, "02.02");
  equal(index.packages.example.recent30.complete, true, "02.03");
});

test("03 - unknown publication dates cannot hide missing history", () => {
  const { charts, index } = createNpmDownloadsExport(
    snapshot({
      example: {
        firstPublishedDay: null,
        rows: rows("2020-01-20", "2020-02-02"),
      },
    }),
  );
  equal(
    charts.example.monthly.find(({ month }) => month === "2020-01"),
    {
      month: "2020-01",
      downloads: null,
      observedDownloads: 120,
      complete: false,
      provisional: false,
    },
    "03.01",
  );
  equal(index.packages.example.recent30.downloads, null, "03.02");
  equal(index.packages.example.recent30.complete, false, "03.03");
  equal(index.packages.example.recent7.downloads, 70, "03.04");
  equal(charts.example.monthly[0].month, "2015-01", "03.05");
});

test("04 - an interior gap makes affected package and portfolio totals unknown", () => {
  const { charts, index } = createNpmDownloadsExport(
    snapshot({
      example: {
        rows: rows("2020-01-01", "2020-02-02").filter(
          ({ day }) => day !== "2020-01-31",
        ),
      },
      other: {},
    }),
  );
  equal(charts.example.monthly[0].downloads, null, "04.01");
  equal(index.packages.example.recent7.downloads, null, "04.02");
  equal(index.packages.other.recent7.downloads, 70, "04.03");
  equal(
    index.portfolio.recent7,
    {
      start: "2020-01-27",
      end: "2020-02-02",
      downloads: null,
      observedDownloads: 130,
      complete: false,
      provisional: false,
      missingPackages: ["example"],
    },
    "04.04",
  );
});

test("05 - shared-zero anomalies mark affected windows and excluded packages stay out of totals", () => {
  const observations = rows("2020-01-01", "2020-02-02", 100).map((row) =>
    row.day === "2020-01-30" ? { ...row, downloads: 0 } : row,
  );
  const { charts, index } = createNpmDownloadsExport(
    snapshot({
      alpha: { rows: observations },
      beta: { rows: observations },
      "@codsen/data": {
        rows: observations,
        status: "auxiliary",
        includedInPortfolio: false,
      },
    }),
  );
  equal(
    charts.alpha.monthly[0],
    {
      month: "2020-01",
      downloads: 3000,
      observedDownloads: 3000,
      complete: true,
      provisional: true,
    },
    "05.01",
  );
  equal(charts.alpha.monthly[1].provisional, false, "05.02");
  equal(index.portfolio.packageCount, 2, "05.03");
  equal(
    index.portfolio.recent7,
    {
      start: "2020-01-27",
      end: "2020-02-02",
      downloads: 1200,
      observedDownloads: 1200,
      complete: true,
      provisional: true,
      missingPackages: [],
    },
    "05.04",
  );
  equal(
    index.packages["@codsen/data"].file,
    "packages/@codsen/data.json",
    "05.05",
  );
  equal(charts.alpha.anomalies[0].day, "2020-01-30", "05.06");
});

test("06 - unavailable packages remain unknown while future publications contribute zero", () => {
  const { charts, index } = createNpmDownloadsExport(
    snapshot({
      unavailable: { rows: [], availability: "unavailable" },
      future: {
        firstPublishedDay: "2020-03-01",
        rows: [],
        availability: "not-yet-published",
      },
    }),
  );
  equal(index.packages.unavailable.recent7.downloads, null, "06.01");
  equal(index.packages.future.recent30.downloads, 0, "06.02");
  equal(index.packages.future.recent30.complete, true, "06.03");
  equal(charts.future.monthly, [], "06.04");
  equal(charts.unavailable.downloads, [], "06.05");
  equal(charts.unavailable.monthly[0].downloads, null, "06.06");
});

test("07 - an initial source month before available history is incomplete", () => {
  const { charts } = createNpmDownloadsExport(
    snapshot(
      {
        unknown: {
          firstPublishedDay: null,
          rows: rows("2015-01-10", "2015-01-31"),
        },
        known: {
          firstPublishedDay: "2015-01-10",
          rows: rows("2015-01-10", "2015-01-31"),
        },
        older: {
          firstPublishedDay: "2014-01-01",
          rows: rows("2015-01-10", "2015-01-31"),
        },
      },
      "2015-01-31",
    ),
  );
  equal(
    charts.unknown.monthly[0],
    {
      month: "2015-01",
      downloads: null,
      observedDownloads: 220,
      complete: false,
      provisional: false,
    },
    "07.01",
  );
  equal(
    charts.known.monthly[0],
    {
      month: "2015-01",
      downloads: 220,
      observedDownloads: 220,
      complete: true,
      provisional: false,
    },
    "07.02",
  );
  equal(charts.older.monthly[0], charts.unknown.monthly[0], "07.03");
});

test("08 - exports verified scoped histories deterministically and replaces an owned export", async () => {
  const source = snapshot({ "@codsen/example": {} });
  await withArchive(
    source,
    async ({ root, archiveDirectory, outputDirectory }) => {
      await mkdir(outputDirectory);
      const first = await exportNpmDownloads({
        archiveDirectory,
        outputDirectory,
      });
      const firstText = await readFile(
        path.join(outputDirectory, "index.json"),
        "utf8",
      );
      const chart = JSON.parse(
        await readFile(
          path.join(outputDirectory, "packages/@codsen/example.json"),
          "utf8",
        ),
      );
      equal(first.index.revision, source.manifest.revision, "08.01");
      equal(chart.downloads, source.series["@codsen/example"], "08.02");
      equal(chart.package, "@codsen/example", "08.03");
      await exportNpmDownloads({ archiveDirectory, outputDirectory });
      equal(
        await readFile(path.join(outputDirectory, "index.json"), "utf8"),
        firstText,
        "08.04",
      );
      equal((await readdir(root)).sort(), ["archive", "charts"], "08.05");
      equal(first.outputDirectory, outputDirectory, "08.06");
    },
  );
});

test("09 - rejects a corrupt source before replacing an existing export", async () => {
  await withArchive(
    snapshot(),
    async ({ archiveDirectory, outputDirectory }) => {
      await exportNpmDownloads({ archiveDirectory, outputDirectory });
      const original = await readFile(
        path.join(outputDirectory, "index.json"),
        "utf8",
      );
      const filename = path.join(archiveDirectory, "packages/example.ndjson");
      await writeFile(
        filename,
        (await readFile(filename, "utf8")).replace(
          '"downloads":10',
          '"downloads":11',
        ),
      );
      await rejects(
        () => exportNpmDownloads({ archiveDirectory, outputDirectory }),
        /mismatch/,
      );
      equal(
        await readFile(path.join(outputDirectory, "index.json"), "utf8"),
        original,
        "09.01",
      );
    },
  );
});

test("10 - refuses non-export directories and preserves unrelated entries", async () => {
  await withArchive(
    snapshot(),
    async ({ archiveDirectory, outputDirectory }) => {
      await mkdir(outputDirectory);
      const note = path.join(outputDirectory, "personal.txt");
      await writeFile(note, "keep me\n");
      await rejects(
        () => exportNpmDownloads({ archiveDirectory, outputDirectory }),
        /non-export directory/,
      );
      equal(await readFile(note, "utf8"), "keep me\n", "10.01");
      await rm(note);
      await exportNpmDownloads({ archiveDirectory, outputDirectory });
      await mkdir(path.join(outputDirectory, "unrelated-empty-directory"));
      await rejects(
        () => exportNpmDownloads({ archiveDirectory, outputDirectory }),
        /unrelated entries/,
      );
      equal(
        (await readdir(outputDirectory)).includes("unrelated-empty-directory"),
        true,
        "10.02",
      );
    },
  );
});

test("11 - requires explicit paths and rejects every archive overlap including symlink aliases", async () => {
  await rejects(() => exportNpmDownloads(), /explicit archive and output/);
  await withArchive(snapshot(), async ({ root, archiveDirectory }) => {
    for (const outputDirectory of [
      archiveDirectory,
      root,
      path.parse(root).root,
      path.join(archiveDirectory, "charts"),
    ]) {
      await rejects(
        () => exportNpmDownloads({ archiveDirectory, outputDirectory }),
        /must not overlap/,
      );
    }
    const alias = path.join(root, "alias");
    await symlink(archiveDirectory, alias);
    await rejects(
      () =>
        exportNpmDownloads({
          archiveDirectory,
          outputDirectory: path.join(alias, "charts"),
        }),
      /must not overlap/,
    );
    equal(
      (await readdir(archiveDirectory)).sort(),
      ["manifest.json", "packages"],
      "11.01",
    );
  });
});

test("12 - rejects output symbolic links and leaves their targets untouched", async () => {
  await withArchive(
    snapshot(),
    async ({ root, archiveDirectory, outputDirectory }) => {
      const target = path.join(root, "target");
      await mkdir(target);
      await symlink(target, outputDirectory);
      await rejects(
        () => exportNpmDownloads({ archiveDirectory, outputDirectory }),
        /symbolic link/,
      );
      equal(await readdir(target), [], "12.01");
    },
  );
});

test("13 - refuses unsafe cross-package aggregates", () => {
  const maximum = Number.MAX_SAFE_INTEGER;
  const source = snapshot({
    alpha: {
      rows: [{ day: "2020-02-02", downloads: maximum }],
      firstPublishedDay: "2020-02-02",
    },
    beta: {
      rows: [{ day: "2020-02-02", downloads: maximum }],
      firstPublishedDay: "2020-02-02",
    },
  });
  throws(() => createNpmDownloadsExport(source), /unsafe download aggregate/);
});

test("14 - CLI requires an output, supports help and exports without network", async () => {
  const help = spawnSync(process.execPath, [cli, "--help"], {
    encoding: "utf8",
  });
  equal(help.status, 0, "14.01");
  match(help.stdout, /--output <directory>/);
  const missing = spawnSync(process.execPath, [cli], { encoding: "utf8" });
  equal(missing.status, 1, "14.02");
  match(missing.stderr, /--output is required/);
  const unknown = spawnSync(process.execPath, [cli, "--force"], {
    encoding: "utf8",
  });
  equal(unknown.status, 1, "14.03");
  match(unknown.stderr, /Unknown argument/);
  await withArchive(
    snapshot(),
    async ({ archiveDirectory, outputDirectory }) => {
      const result = spawnSync(
        process.execPath,
        [cli, "--archive", archiveDirectory, "--output", outputDirectory],
        { encoding: "utf8" },
      );
      equal(result.status, 0, "14.04");
      match(result.stdout, /Exported 1 packages through 2020-02-02/);
      equal(
        JSON.parse(
          await readFile(path.join(outputDirectory, "index.json"), "utf8"),
        ).schemaVersion,
        1,
        "14.05",
      );
    },
  );
});

test("15 - rejects symbolic links inside an otherwise valid export", async () => {
  await withArchive(
    snapshot(),
    async ({ root, archiveDirectory, outputDirectory }) => {
      await exportNpmDownloads({ archiveDirectory, outputDirectory });
      const target = path.join(root, "unrelated.txt");
      await writeFile(target, "retain this file\n");
      await symlink(target, path.join(outputDirectory, "linked.txt"));
      await rejects(
        () => exportNpmDownloads({ archiveDirectory, outputDirectory }),
        /unsupported output entry/,
      );
      equal(await readFile(target, "utf8"), "retain this file\n", "15.01");
    },
  );
});

test("16 - rejects modified ownership markers and missing generated files", async () => {
  await withArchive(
    snapshot(),
    async ({ archiveDirectory, outputDirectory }) => {
      await exportNpmDownloads({ archiveDirectory, outputDirectory });
      const filename = path.join(outputDirectory, "index.json");
      const contents = await readFile(filename, "utf8");
      const index = JSON.parse(contents);
      index.kind = "some-other-data";
      await writeFile(filename, jsonText(index));
      await rejects(
        () => exportNpmDownloads({ archiveDirectory, outputDirectory }),
        /invalid existing export marker/,
      );
      equal(
        JSON.parse(await readFile(filename, "utf8")).kind,
        "some-other-data",
        "16.01",
      );
      await writeFile(filename, contents);
      await rm(path.join(outputDirectory, "packages/example.json"));
      await rejects(
        () => exportNpmDownloads({ archiveDirectory, outputDirectory }),
        /missing or unrelated entries/,
      );
      equal(await readFile(filename, "utf8"), contents, "16.02");
    },
  );
});

test("17 - retains observed subtotals across partial and unavailable portfolio members", () => {
  const { charts, index } = createNpmDownloadsExport(
    snapshot({
      complete: {},
      partial: {
        rows: rows("2020-01-01", "2020-02-02").filter(
          ({ day }) => day !== "2020-01-31",
        ),
      },
      unavailable: {
        firstPublishedDay: null,
        rows: [],
        availability: "unavailable",
      },
      excluded: {
        includedInPortfolio: false,
        rows: [],
        availability: "unavailable",
      },
    }),
  );
  equal(
    index.packages.partial.recent7,
    {
      start: "2020-01-27",
      end: "2020-02-02",
      downloads: null,
      observedDownloads: 60,
      complete: false,
      provisional: false,
    },
    "17.01",
  );
  equal(
    charts.partial.monthly[0],
    {
      month: "2020-01",
      downloads: null,
      observedDownloads: 300,
      complete: false,
      provisional: false,
    },
    "17.02",
  );
  equal(
    index.portfolio.recent7,
    {
      start: "2020-01-27",
      end: "2020-02-02",
      downloads: null,
      observedDownloads: 130,
      complete: false,
      provisional: false,
      missingPackages: ["partial", "unavailable"],
    },
    "17.03",
  );
  equal(index.portfolio.recent30.observedDownloads, 590, "17.04");
  equal(index.packages.unavailable.recent7.observedDownloads, 0, "17.05");
  equal(index.packages.unavailable.recent7.downloads, null, "17.06");
});

test("18 - earlier source observations remain charted after publication metadata becomes known", () => {
  const observations = rows("2020-01-10", "2020-02-02").map((row) =>
    row.day === "2020-01-11" ? { ...row, downloads: 0 } : row,
  );
  const { charts } = createNpmDownloadsExport(
    snapshot({
      example: { firstPublishedDay: "2020-02-01", rows: observations },
    }),
  );
  equal(charts.example.firstPublishedDay, "2020-02-01", "18.01");
  equal(charts.example.downloads, observations, "18.02");
  equal(
    charts.example.monthly[0],
    {
      month: "2020-01",
      downloads: 210,
      observedDownloads: 210,
      complete: true,
      provisional: false,
    },
    "18.03",
  );
});

test("19 - gaps after early retained observations remain unknown despite later publication metadata", () => {
  const { charts, index } = createNpmDownloadsExport(
    snapshot({
      example: {
        firstPublishedDay: "2020-02-01",
        rows: [
          { day: "2020-01-10", downloads: 10 },
          { day: "2020-01-11", downloads: 0 },
          { day: "2020-02-01", downloads: 20 },
          { day: "2020-02-02", downloads: 30 },
        ],
      },
    }),
  );
  equal(
    charts.example.monthly[0],
    {
      month: "2020-01",
      downloads: null,
      observedDownloads: 10,
      complete: false,
      provisional: false,
    },
    "19.01",
  );
  equal(
    index.packages.example.recent7,
    {
      start: "2020-01-27",
      end: "2020-02-02",
      downloads: null,
      observedDownloads: 50,
      complete: false,
      provisional: false,
    },
    "19.02",
  );
  equal(index.portfolio.recent7.missingPackages, ["example"], "19.03");
});

test.run();
