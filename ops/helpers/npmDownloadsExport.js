import {
  lstat,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  realpath,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import { addDays, packageFile } from "./npmDownloads.js";
import {
  coverageStart,
  jsonText,
  readNpmDownloadsSnapshot,
} from "./npmDownloadsFile.js";

const EXPORT_KIND = "codsen-npm-downloads-chart-export";

function chartFile(name) {
  return packageFile(name).replace(/\.ndjson$/, ".json");
}

function safeSum(left, right) {
  const result = left + right;
  if (!Number.isSafeInteger(result)) {
    throw new Error("npm downloads export: unsafe download aggregate");
  }
  return result;
}

function windowSummary(context, start, end, through = end) {
  const observedEnd = end < through ? end : through;
  let downloads = 0;
  let missing = false;
  let provisional = false;
  for (let day = start; day <= observedEnd; day = addDays(day, 1)) {
    if (context.anomalyDays.has(day)) provisional = true;
    const observed = context.byDay.get(day);
    if (observed !== undefined) {
      downloads = safeSum(downloads, observed);
    } else if (
      context.knownZeroBeforeDay === null ||
      day >= context.knownZeroBeforeDay
    ) {
      missing = true;
    }
    if (day === observedEnd) break;
  }
  return {
    start,
    end: observedEnd,
    downloads: missing ? null : downloads,
    observedDownloads: downloads,
    complete: !missing && end <= through,
    provisional,
  };
}

function nextMonthStart(month) {
  const [year, number] = month.split("-").map(Number);
  return number === 12
    ? `${String(year + 1).padStart(4, "0")}-01-01`
    : `${year}-${String(number + 1).padStart(2, "0")}-01`;
}

function monthlyDownloads(context, through) {
  const monthly = [];
  if (context.start > through) return monthly;
  let month = context.start.slice(0, 7);
  while (month <= through.slice(0, 7)) {
    const nextStart = nextMonthStart(month);
    const summary = windowSummary(
      context,
      `${month}-01`,
      addDays(nextStart, -1),
      through,
    );
    monthly.push({
      month,
      downloads: summary.downloads,
      observedDownloads: summary.observedDownloads,
      complete: summary.complete,
      provisional: summary.provisional,
    });
    month = nextStart.slice(0, 7);
  }
  return monthly;
}

function portfolioWindow(packages, window) {
  let observedDownloads = 0;
  const missingPackages = [];
  let provisional = false;
  for (const [name, entry] of packages) {
    const summary = entry[window];
    observedDownloads = safeSum(observedDownloads, summary.observedDownloads);
    if (!summary.complete) missingPackages.push(name);
    provisional ||= summary.provisional;
  }
  const complete = missingPackages.length === 0;
  return {
    downloads: complete ? observedDownloads : null,
    observedDownloads,
    complete,
    provisional,
    missingPackages: missingPackages.sort(),
  };
}

function createNpmDownloadsExport({ manifest, series }) {
  const charts = {};
  const packages = {};
  const windows = {
    recent7: { start: addDays(manifest.through, -6), end: manifest.through },
    recent30: { start: addDays(manifest.through, -29), end: manifest.through },
  };
  for (const [name, entry] of Object.entries(manifest.packages)) {
    const anomalies = manifest.anomalies.filter((anomaly) =>
      anomaly.packages.includes(name),
    );
    const start = coverageStart(entry, series[name]);
    const context = {
      start,
      knownZeroBeforeDay:
        entry.firstPublishedDay === null
          ? null
          : entry.firstPublishedDay < start
            ? entry.firstPublishedDay
            : start,
      byDay: new Map(series[name].map((row) => [row.day, row.downloads])),
      anomalyDays: new Set(anomalies.map((anomaly) => anomaly.day)),
    };
    charts[name] = {
      schemaVersion: 1,
      package: name,
      revision: manifest.revision,
      through: manifest.through,
      firstPublishedDay: entry.firstPublishedDay,
      coverage: entry.coverage,
      anomalies,
      downloads: series[name],
      monthly: monthlyDownloads(context, manifest.through),
    };
    packages[name] = {
      status: entry.status,
      includedInPortfolio: entry.includedInPortfolio,
      firstPublishedDay: entry.firstPublishedDay,
      availability: entry.availability,
      file: chartFile(name),
      sourceSha256: entry.sha256,
      coverage: entry.coverage,
      total: entry.total,
      ...Object.fromEntries(
        Object.entries(windows).map(([key, { start, end }]) => [
          key,
          windowSummary(context, start, end),
        ]),
      ),
    };
  }
  const included = Object.entries(packages).filter(
    ([, entry]) => entry.includedInPortfolio,
  );
  const index = {
    schemaVersion: 1,
    kind: EXPORT_KIND,
    source: manifest.source,
    revision: manifest.revision,
    through: manifest.through,
    packages,
    portfolio: {
      packageCount: included.length,
      ...Object.fromEntries(
        Object.entries(windows).map(([key, bounds]) => [
          key,
          { ...bounds, ...portfolioWindow(included, key) },
        ]),
      ),
    },
  };
  return { index, charts };
}

async function resolvedPath(directory) {
  try {
    return await realpath(directory);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    const parent = path.dirname(directory);
    if (parent === directory) throw error;
    return path.join(await resolvedPath(parent), path.basename(directory));
  }
}

function overlaps(left, right) {
  const relative = path.relative(right, left);
  return (
    relative === "" ||
    (relative !== ".." &&
      !relative.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relative))
  );
}

async function directoryEntries(directory, prefix = "") {
  const entries = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isSymbolicLink() || (!entry.isFile() && !entry.isDirectory())) {
      throw new Error(
        `npm downloads export: unsupported output entry ${relative}`,
      );
    }
    entries.push(entry.isDirectory() ? `${relative}/` : relative);
    if (entry.isDirectory()) {
      entries.push(
        ...(await directoryEntries(
          path.join(directory, entry.name),
          `${relative}/`,
        )),
      );
    }
  }
  return entries.sort();
}

async function assertExportDirectory(directory) {
  try {
    const stat = await lstat(directory);
    if (!stat.isDirectory() || stat.isSymbolicLink()) {
      throw new Error(
        "npm downloads export: output must be a directory, not a symbolic link",
      );
    }
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
  const entries = await directoryEntries(directory);
  if (!entries.length) return true;
  let index;
  try {
    index = JSON.parse(
      await readFile(path.join(directory, "index.json"), "utf8"),
    );
  } catch {
    throw new Error(
      "npm downloads export: refusing to overwrite a non-export directory",
    );
  }
  if (
    index?.schemaVersion !== 1 ||
    index.kind !== EXPORT_KIND ||
    !/^[a-f0-9]{64}$/.test(index.revision) ||
    index.source?.api !== "https://api.npmjs.org" ||
    !index.packages ||
    typeof index.packages !== "object" ||
    Array.isArray(index.packages)
  ) {
    throw new Error("npm downloads export: invalid existing export marker");
  }
  const expected = new Set(["index.json"]);
  for (const [name, entry] of Object.entries(index.packages)) {
    const file = chartFile(name);
    if (entry?.file !== file) {
      throw new Error(
        `npm downloads export: invalid existing chart path for ${name}`,
      );
    }
    expected.add(file);
    let parent = path.posix.dirname(file);
    while (parent !== ".") {
      expected.add(`${parent}/`);
      parent = path.posix.dirname(parent);
    }
  }
  if (JSON.stringify(entries) !== JSON.stringify([...expected].sort())) {
    throw new Error(
      "npm downloads export: existing directory contains missing or unrelated entries",
    );
  }
  return true;
}

async function exportNpmDownloads({ archiveDirectory, outputDirectory } = {}) {
  if (
    typeof archiveDirectory !== "string" ||
    !archiveDirectory.trim() ||
    typeof outputDirectory !== "string" ||
    !outputDirectory.trim()
  ) {
    throw new Error(
      "npm downloads export: explicit archive and output directories are required",
    );
  }
  const archive = await resolvedPath(path.resolve(archiveDirectory));
  const output = path.resolve(outputDirectory);
  const resolvedOutput = await resolvedPath(output);
  if (overlaps(archive, resolvedOutput) || overlaps(resolvedOutput, archive)) {
    throw new Error(
      "npm downloads export: archive and output directories must not overlap",
    );
  }
  await assertExportDirectory(output);
  const snapshot = await readNpmDownloadsSnapshot(archive);
  const { index, charts } = createNpmDownloadsExport(snapshot);
  await mkdir(path.dirname(output), { recursive: true });
  const staging = await mkdtemp(
    path.join(path.dirname(output), `.${path.basename(output)}.npm-export-`),
  );
  const candidate = path.join(staging, "candidate");
  const backup = path.join(staging, "backup");
  let backedUp = false;
  let promoted = false;
  try {
    await mkdir(candidate);
    for (const [name, chart] of Object.entries(charts)) {
      const filename = path.join(candidate, chartFile(name));
      await mkdir(path.dirname(filename), { recursive: true });
      await writeFile(filename, jsonText(chart));
    }
    await writeFile(path.join(candidate, "index.json"), jsonText(index));
    if (await assertExportDirectory(output)) {
      await rename(output, backup);
      backedUp = true;
    }
    try {
      await rename(candidate, output);
      promoted = true;
    } catch (error) {
      if (backedUp) {
        await rename(backup, output);
        backedUp = false;
      }
      throw error;
    }
  } finally {
    // If restoring a backup itself fails, retain it for recovery.
    if (!backedUp || promoted) {
      await rm(staging, { recursive: true, force: true });
    }
  }
  return { outputDirectory: output, index };
}

export { createNpmDownloadsExport, exportNpmDownloads };
