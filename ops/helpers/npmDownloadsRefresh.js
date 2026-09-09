import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { deprecated } from "./codsenPackages.js";
import {
  addDays,
  mergeDownloads,
  missingRanges,
  planRanges,
  validateRangeResponse,
} from "./npmDownloads.js";
import { createNpmDownloadsClient } from "./npmDownloadsClient.js";
import {
  coverageStart,
  createNpmDownloadsSnapshot,
  jsonText,
  readNpmDownloadsSnapshot,
  recoverNpmDownloadsPromotion,
  sha256,
  writeNpmDownloadsSnapshot,
} from "./npmDownloadsFile.js";
import { readNpmDownloadsRoster } from "./npmDownloadsRoster.js";

function planRequests(roster, previous, through, full) {
  const needs = {};
  for (const [name, entry] of Object.entries(roster)) {
    const rows = previous?.series[name] ?? [];
    const start = coverageStart(entry, rows);
    if (start > through) continue;
    needs[name] = full
      ? [{ start, end: through }]
      : [
          ...missingRanges(rows, start, through),
          { start: [start, addDays(through, -59)].sort().at(-1), end: through },
          ...(previous?.manifest.anomalies ?? [])
            .filter((entry) => entry.packages.includes(name))
            .map(({ day }) => ({ start: day, end: day })),
        ];
  }
  const starts = Object.values(needs).flatMap((ranges) =>
    ranges.map((x) => x.start),
  );
  if (!starts.length) return [];
  const requests = [];
  // Share bounded windows across packages. Some requests intentionally include
  // extra days so the initial history needs tens of requests rather than thousands.
  for (const window of planRanges(starts.sort()[0], through)) {
    const intersections = Object.entries(needs)
      .map(([name, ranges]) => [
        name,
        ranges
          .filter(
            (range) => range.start <= window.end && range.end >= window.start,
          )
          .map((range) => ({
            start: range.start > window.start ? range.start : window.start,
            end: range.end < window.end ? range.end : window.end,
          })),
      ])
      .filter(([, ranges]) => ranges.length);
    if (!intersections.length) continue;
    const start = intersections
      .flatMap(([, ranges]) => ranges.map((x) => x.start))
      .sort()[0];
    const end = intersections
      .flatMap(([, ranges]) => ranges.map((x) => x.end))
      .sort()
      .at(-1);
    const names = intersections.map(([name]) => name).sort();
    const unscoped = names.filter((name) => !name.startsWith("@"));
    for (let offset = 0; offset < unscoped.length; offset += 64) {
      requests.push({ names: unscoped.slice(offset, offset + 64), start, end });
    }
    for (const name of names.filter((name) => name.startsWith("@"))) {
      requests.push({ names: [name], start, end });
    }
  }
  return requests;
}

async function acquireLock(directory) {
  await mkdir(path.dirname(directory), { recursive: true });
  try {
    await mkdir(directory);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    let pid;
    try {
      pid = Number(await readFile(path.join(directory, "pid"), "utf8"));
    } catch {
      throw new Error(
        `npm downloads: refresh lock needs inspection: ${directory}`,
      );
    }
    if (!Number.isSafeInteger(pid) || pid < 1) {
      throw new Error(`npm downloads: invalid refresh lock: ${directory}`);
    }
    try {
      process.kill(pid, 0);
      throw new Error(`npm downloads: refresh already running with PID ${pid}`);
    } catch (processError) {
      if (processError.code !== "ESRCH") throw processError;
    }
    await rm(directory, { recursive: true });
    await mkdir(directory);
  }
  await writeFile(path.join(directory, "pid"), String(process.pid));
}

function validateCachedResult(request, result) {
  if (
    !result ||
    JSON.stringify(Object.keys(result).sort()) !==
      JSON.stringify([...request.names].sort())
  ) {
    throw new Error("npm downloads: invalid cached package inventory");
  }
  for (const name of request.names) {
    if (result[name] !== null) {
      validateRangeResponse(name, request.start, request.end, {
        package: name,
        start: request.start,
        end: request.end,
        downloads: result[name],
      });
    }
  }
  return result;
}

async function cachedRange(client, request, cacheDirectory, now) {
  const file = path.join(cacheDirectory, `${sha256(jsonText(request))}.json`);
  try {
    const saved = JSON.parse(await readFile(file, "utf8"));
    const age = now() - Date.parse(saved.savedAt);
    if (Number.isFinite(age) && age >= 0 && age < 3_600_000) {
      return {
        result: validateCachedResult(request, saved.result),
        cached: true,
      };
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      // Invalid scratch data is disposable. Canonical archive errors are fatal.
      await rm(file, { force: true });
    }
  }
  const result = validateCachedResult(
    request,
    await client.range(request.names, request.start, request.end),
  );
  await mkdir(cacheDirectory, { recursive: true });
  const temporary = `${file}.tmp`;
  await writeFile(
    temporary,
    jsonText({ savedAt: new Date(now()).toISOString(), result }),
  );
  await rename(temporary, file);
  return { result, cached: false };
}

function retainedHistory(previous, roster, observedAt) {
  if (!previous) return null;
  const oldRetired = previous.retired;
  const removed = Object.keys(previous.manifest.packages).filter(
    (name) => !Object.hasOwn(roster, name),
  );
  const retained = Object.keys(oldRetired?.manifest.packages ?? {}).filter(
    (name) => !Object.hasOwn(roster, name),
  );
  if (
    !removed.length &&
    retained.length === Object.keys(oldRetired?.series ?? {}).length
  ) {
    return oldRetired ?? null;
  }
  const names = [...removed, ...retained].sort();
  if (!names.length) return null;
  const packages = {
    ...oldRetired?.manifest.packages,
    ...previous.manifest.packages,
  };
  const series = { ...oldRetired?.series, ...previous.series };
  const through = removed.length
    ? [previous.manifest.through, oldRetired?.manifest.through ?? ""]
        .sort()
        .at(-1)
    : oldRetired.manifest.through;
  return createNpmDownloadsSnapshot({
    // A membership-only change never implies that retired history was fetched.
    // Retained packages can have an explicit missing tail at the newer cutoff.
    through,
    roster: Object.fromEntries(
      names.map((name) => [
        name,
        {
          ...packages[name],
          status: deprecated.includes(name)
            ? "deprecated"
            : name === "@codsen/data"
              ? "auxiliary"
              : "archived",
          includedInPortfolio: false,
        },
      ]),
    ),
    series: Object.fromEntries(names.map((name) => [name, series[name]])),
    availability: Object.fromEntries(
      names.map((name) => [
        name,
        packages[name].availability === "not-yet-published" &&
        coverageStart(packages[name], series[name]) <= through
          ? "not-collected"
          : packages[name].availability,
      ]),
    ),
    previousManifest: oldRetired?.manifest,
    observedAt,
  });
}

async function refreshNpmDownloads({
  repositoryRoot,
  archiveDirectory = path.join(repositoryRoot, "statistics/npm-downloads"),
  workDirectory = path.join(repositoryRoot, ".cache/npm-downloads"),
  client = createNpmDownloadsClient(),
  full = false,
  now = Date.now,
  onProgress = () => {},
  readRoster = readNpmDownloadsRoster,
}) {
  const lock = path.join(workDirectory, "lock");
  await acquireLock(lock);
  try {
    await recoverNpmDownloadsPromotion(archiveDirectory, workDirectory);
    const previous = await readNpmDownloadsSnapshot(archiveDirectory, {
      allowMissing: true,
    });
    const priorPackages = {
      ...previous?.retired?.manifest.packages,
      ...previous?.manifest.packages,
    };
    const priorSeries = { ...previous?.retired?.series, ...previous?.series };
    const roster = readRoster(repositoryRoot, priorPackages);
    const through = await client.latestDay();
    if (previous && through < previous.manifest.through) {
      throw new Error(
        `npm downloads: watermark ${through} precedes saved ${previous.manifest.through}`,
      );
    }
    const series = Object.fromEntries(
      Object.keys(roster).map((name) => [name, priorSeries[name] ?? []]),
    );
    const availability = Object.fromEntries(
      Object.entries(roster).map(([name, entry]) => [
        name,
        coverageStart(entry, series[name]) > through
          ? "not-yet-published"
          : "available",
      ]),
    );
    const report = {
      through,
      previousThrough: previous?.manifest.through ?? null,
      packages: Object.keys(roster).length,
      retiredPackages: 0,
      movedToRetired: Object.keys(previous?.manifest.packages ?? {})
        .filter((name) => !Object.hasOwn(roster, name))
        .sort(),
      requests: 0,
      cachedRequests: 0,
      addedDays: 0,
      correctedDays: 0,
      corrections: [],
      unavailable: [],
    };
    const requests = planRequests(
      roster,
      {
        series: priorSeries,
        manifest: {
          anomalies: [
            ...(previous?.manifest.anomalies ?? []),
            ...(previous?.retired?.manifest.anomalies ?? []),
          ],
        },
      },
      through,
      full,
    );
    onProgress(
      `Collecting ${report.packages} packages through ${through}; ${requests.length} bounded requests planned.`,
    );
    const cacheDirectory = path.join(workDirectory, "ranges", through);
    for (const planned of requests) {
      const request = {
        ...planned,
        names: planned.names.filter(
          (name) => availability[name] !== "unavailable",
        ),
      };
      if (!request.names.length) continue;
      const { result, cached } = await cachedRange(
        client,
        request,
        cacheDirectory,
        now,
      );
      report.requests += 1;
      if (cached) report.cachedRequests += 1;
      for (const name of request.names) {
        if (result[name] === null) {
          availability[name] = "unavailable";
          report.unavailable.push(name);
          continue;
        }
        const incoming = result[name].filter(
          (row) => row.day >= coverageStart(roster[name], series[name]),
        );
        const oldValues = new Map(
          series[name].map((row) => [row.day, row.downloads]),
        );
        for (const row of incoming) {
          if (
            oldValues.has(row.day) &&
            oldValues.get(row.day) !== row.downloads
          ) {
            report.corrections.push({
              package: name,
              day: row.day,
              previous: oldValues.get(row.day),
              downloads: row.downloads,
            });
          }
        }
        const merged = mergeDownloads(series[name], incoming);
        series[name] = merged.rows;
        report.addedDays += merged.added;
        report.correctedDays += merged.corrected;
      }
      onProgress(
        `${report.requests}/${requests.length}: ${request.start}..${request.end}, ${request.names.length} packages${cached ? " (resumed)" : ""}`,
      );
    }
    const observedAt = new Date(now()).toISOString();
    const retired = retainedHistory(previous, roster, observedAt);
    const snapshot = createNpmDownloadsSnapshot({
      through,
      roster,
      series,
      availability,
      previousManifest: previous?.manifest,
      observedAt,
      retired,
    });
    for (const [name, entry] of Object.entries(snapshot.manifest.packages)) {
      if (entry.availability === "available" && entry.coverage.missing.length) {
        throw new Error(
          `npm downloads: incomplete candidate history for ${name}`,
        );
      }
    }
    report.unavailable.sort();
    report.retiredPackages = Object.keys(
      retired?.manifest.packages ?? {},
    ).length;
    report.anomalies = snapshot.manifest.anomalies;
    report.changed = snapshot.manifest.revision !== previous?.manifest.revision;
    report.revision = snapshot.manifest.revision;
    if (report.changed) {
      await writeNpmDownloadsSnapshot(
        archiveDirectory,
        workDirectory,
        snapshot,
      );
    }
    await writeFile(
      path.join(workDirectory, "last-refresh.json"),
      jsonText(report),
    );
    // Only failed attempts retain request cache. A subsequent successful refresh
    // must re-fetch overlapping days even when npm's watermark has not advanced.
    await rm(path.join(workDirectory, "ranges"), {
      recursive: true,
      force: true,
    });
    return report;
  } finally {
    await rm(lock, { recursive: true, force: true });
  }
}

export { planRequests, refreshNpmDownloads };
