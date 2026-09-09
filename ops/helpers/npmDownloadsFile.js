import { createHash } from "node:crypto";
import {
  cp,
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import {
  assertDay,
  findSharedZeroDays,
  missingRanges,
  NPM_HISTORY_START,
  packageFile,
  parseNdjson,
  serializeNdjson,
} from "./npmDownloads.js";

const SOURCE = {
  api: "https://api.npmjs.org",
  documentation:
    "https://github.com/npm/registry/blob/main/docs/download-counts.md",
  earliestDay: NPM_HISTORY_START,
};
const STATUSES = new Set(["current", "deprecated", "archived", "auxiliary"]);
const AVAILABILITIES = new Set([
  "available",
  "unavailable",
  "not-yet-published",
  "not-collected",
]);

function jsonText(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function expectedStart(entry) {
  return entry.firstPublishedDay && entry.firstPublishedDay > NPM_HISTORY_START
    ? entry.firstPublishedDay
    : NPM_HISTORY_START;
}

function coverageStart(entry, rows) {
  const publicationStart = expectedStart(entry);
  // Publication metadata is the earliest known release, not proof that older
  // observations should be discarded when a previously unknown date is learned.
  return rows[0]?.day < publicationStart ? rows[0].day : publicationStart;
}

function createNpmDownloadsSnapshot({
  through,
  roster,
  series,
  availability,
  previousManifest = null,
  observedAt,
  retired = null,
}) {
  assertDay(through);
  if (through < NPM_HISTORY_START) {
    throw new Error("npm downloads: cutoff precedes available history");
  }
  if (
    typeof observedAt !== "string" ||
    !Number.isFinite(Date.parse(observedAt)) ||
    new Date(observedAt).toISOString() !== observedAt
  ) {
    throw new Error("npm downloads: invalid observation timestamp");
  }
  if (!roster || !Object.keys(roster).length) {
    throw new Error("npm downloads: empty package roster");
  }
  const names = Object.keys(roster).sort();
  if (JSON.stringify(Object.keys(series).sort()) !== JSON.stringify(names)) {
    throw new Error("npm downloads: series and roster differ");
  }
  const retiredSnapshot =
    retired === null ? null : validateRetiredSnapshot(retired, names);
  const packages = Object.fromEntries(
    names.map((name) => {
      const entry = roster[name];
      const file = packageFile(name);
      if (
        !STATUSES.has(entry.status) ||
        typeof entry.includedInPortfolio !== "boolean" ||
        !AVAILABILITIES.has(availability[name])
      ) {
        throw new Error(`npm downloads: invalid package metadata for ${name}`);
      }
      if (entry.firstPublishedDay !== null) {
        assertDay(entry.firstPublishedDay);
      }
      const rows = series[name];
      const contents = serializeNdjson(rows);
      const start = coverageStart(entry, rows);
      if (
        rows.some((row) => row.day < NPM_HISTORY_START || row.day > through)
      ) {
        throw new Error(
          `npm downloads: out-of-coverage observation for ${name}`,
        );
      }
      if (start > through !== (availability[name] === "not-yet-published")) {
        throw new Error(
          `npm downloads: inconsistent publication state for ${name}`,
        );
      }
      let total = null;
      if (rows.length) {
        total = rows.reduce((sum, row) => sum + row.downloads, 0);
        if (!Number.isSafeInteger(total)) {
          throw new Error(`npm downloads: unsafe aggregate for ${name}`);
        }
      }
      return [
        name,
        {
          status: entry.status,
          includedInPortfolio: entry.includedInPortfolio,
          firstPublishedDay: entry.firstPublishedDay,
          availability: availability[name],
          file,
          sha256: sha256(contents),
          coverage: {
            start: rows[0]?.day ?? null,
            end: rows.at(-1)?.day ?? null,
            days: rows.length,
            missing: start > through ? [] : missingRanges(rows, start, through),
          },
          total,
        },
      ];
    }),
  );
  const content = {
    schemaVersion: 1,
    source: SOURCE,
    through,
    packages,
    anomalies: findSharedZeroDays(series).map((entry) => ({
      day: entry.day,
      kind: "suspected-shared-zero",
      packages: entry.packages,
    })),
    ...(retiredSnapshot
      ? { retiredRevision: retiredSnapshot.manifest.revision }
      : {}),
  };
  const revision = sha256(jsonText(content));
  return {
    manifest: {
      ...content,
      revision,
      updatedAt:
        previousManifest?.revision === revision
          ? previousManifest.updatedAt
          : observedAt,
    },
    series,
    ...(retiredSnapshot ? { retired: retiredSnapshot } : {}),
  };
}

function validateRetiredSnapshot(retired, activeNames) {
  if (
    !retired ||
    typeof retired !== "object" ||
    !retired.manifest ||
    !retired.series ||
    !retired.manifest.packages
  ) {
    throw new Error("npm downloads: invalid retired snapshot");
  }
  if (
    Object.hasOwn(retired, "retired") ||
    Object.hasOwn(retired.manifest, "retiredRevision")
  ) {
    throw new Error("npm downloads: retired snapshots cannot be nested");
  }
  const availability = {};
  for (const [name, entry] of Object.entries(retired.manifest.packages)) {
    if (activeNames.includes(name)) {
      throw new Error(
        `npm downloads: retired package also in main archive: ${name}`,
      );
    }
    if (entry.includedInPortfolio !== false) {
      throw new Error(
        `npm downloads: retired package included in portfolio: ${name}`,
      );
    }
    availability[name] = entry.availability;
  }
  const expected = createNpmDownloadsSnapshot({
    through: retired.manifest.through,
    roster: retired.manifest.packages,
    series: retired.series,
    availability,
    observedAt: retired.manifest.updatedAt,
  });
  if (jsonText(retired.manifest) !== jsonText(expected.manifest)) {
    throw new Error(
      "npm downloads: retired snapshot metadata, hashes, or revision mismatch",
    );
  }
  return expected;
}

async function filesBelow(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) {
      throw new Error(`npm downloads: symbolic link in archive: ${entry.name}`);
    }
    if (entry.isDirectory()) {
      files.push(
        ...(await filesBelow(path.join(directory, entry.name))).map(
          (name) => `${entry.name}/${name}`,
        ),
      );
    } else if (entry.isFile()) {
      files.push(entry.name);
    } else {
      throw new Error(
        `npm downloads: unsupported archive entry: ${entry.name}`,
      );
    }
  }
  return files.sort();
}

async function readNpmDownloadsSnapshot(
  directory,
  { allowMissing = false } = {},
) {
  return readSnapshot(directory, allowMissing, 0);
}

async function readSnapshot(directory, allowMissing, depth) {
  let contents;
  try {
    contents = await readFile(path.join(directory, "manifest.json"), "utf8");
  } catch (error) {
    if (error.code !== "ENOENT" || !allowMissing) {
      throw error;
    }
    let files = [];
    try {
      files = await filesBelow(directory);
    } catch (scanError) {
      if (scanError.code !== "ENOENT") throw scanError;
    }
    if (files.some((file) => file !== "README.md")) {
      throw new Error("npm downloads: archive files exist without a manifest");
    }
    return null;
  }
  const manifest = JSON.parse(contents);
  if (
    manifest.schemaVersion !== 1 ||
    !manifest.packages ||
    Array.isArray(manifest.packages)
  ) {
    throw new Error("npm downloads: invalid manifest schema");
  }
  let retired = null;
  if (Object.hasOwn(manifest, "retiredRevision")) {
    if (depth > 0) {
      throw new Error("npm downloads: retired snapshots cannot be nested");
    }
    if (
      typeof manifest.retiredRevision !== "string" ||
      !/^[a-f0-9]{64}$/.test(manifest.retiredRevision)
    ) {
      throw new Error("npm downloads: invalid retired snapshot revision");
    }
    retired = await readSnapshot(
      path.join(directory, "retired"),
      false,
      depth + 1,
    );
    if (retired.manifest.revision !== manifest.retiredRevision) {
      throw new Error(
        "npm downloads: retired snapshot revision does not match parent",
      );
    }
  }
  const series = {};
  const availability = {};
  for (const [name, entry] of Object.entries(manifest.packages)) {
    const file = packageFile(name);
    if (entry.file !== file) {
      throw new Error(`npm downloads: invalid archive path for ${name}`);
    }
    const text = await readFile(path.join(directory, file), "utf8");
    series[name] = parseNdjson(text, name);
    if (serializeNdjson(series[name]) !== text) {
      throw new Error(`npm downloads: noncanonical NDJSON for ${name}`);
    }
    availability[name] = entry.availability;
  }
  const expected = createNpmDownloadsSnapshot({
    through: manifest.through,
    roster: manifest.packages,
    series,
    availability,
    observedAt: manifest.updatedAt,
    retired,
  });
  if (contents !== jsonText(expected.manifest)) {
    throw new Error(
      "npm downloads: manifest metadata, hashes, or revision mismatch",
    );
  }
  const actualFiles = (await filesBelow(directory)).filter(
    (file) => file !== "README.md",
  );
  const expectedFiles = [
    "manifest.json",
    ...Object.values(manifest.packages).map((entry) => entry.file),
    ...(retired
      ? [
          "retired/manifest.json",
          ...Object.values(retired.manifest.packages).map(
            (entry) => `retired/${entry.file}`,
          ),
        ]
      : []),
  ].sort();
  if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) {
    throw new Error("npm downloads: archive file inventory mismatch");
  }
  return expected;
}

// The two directory renames are recoverable, not a multi-file atomic commit.
// Readers validate the complete manifest before accepting a snapshot.
async function recoverNpmDownloadsPromotion(directory, workDirectory) {
  const backup = path.join(workDirectory, "backup");
  try {
    await readdir(backup);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  try {
    await readdir(directory);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await rename(backup, directory);
    return;
  }
  // A successfully promoted valid candidate can survive a crash before cleanup.
  await readNpmDownloadsSnapshot(directory);
  await rm(backup, { recursive: true });
}

async function writeNpmDownloadsSnapshot(
  directory,
  workDirectory,
  snapshot,
  { renameImpl = rename } = {},
) {
  const candidate = path.join(workDirectory, "candidate");
  const backup = path.join(workDirectory, "backup");
  await mkdir(workDirectory, { recursive: true });
  await recoverNpmDownloadsPromotion(directory, workDirectory);
  await rm(candidate, { recursive: true, force: true });
  await mkdir(candidate, { recursive: true });
  // Preserve the hand-maintained archive documentation during replacement.
  try {
    await cp(
      path.join(directory, "README.md"),
      path.join(candidate, "README.md"),
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await writeSnapshotFiles(candidate, snapshot);
  if (snapshot.retired) {
    // Both manifests and all observations share the same validated promotion.
    validateRetiredSnapshot(snapshot.retired, Object.keys(snapshot.series));
    await writeSnapshotFiles(path.join(candidate, "retired"), snapshot.retired);
  }
  await readNpmDownloadsSnapshot(candidate);
  await mkdir(path.dirname(directory), { recursive: true });
  let backedUp = false;
  try {
    await renameImpl(directory, backup);
    backedUp = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  try {
    await renameImpl(candidate, directory);
  } catch (error) {
    if (backedUp) await rename(backup, directory);
    throw error;
  }
  if (backedUp) await rm(backup, { recursive: true });
}

async function writeSnapshotFiles(directory, snapshot) {
  await mkdir(directory, { recursive: true });
  for (const [name, rows] of Object.entries(snapshot.series)) {
    const file = path.join(directory, packageFile(name));
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, serializeNdjson(rows));
  }
  await writeFile(
    path.join(directory, "manifest.json"),
    jsonText(snapshot.manifest),
  );
}

export {
  coverageStart,
  createNpmDownloadsSnapshot,
  expectedStart,
  jsonText,
  readNpmDownloadsSnapshot,
  recoverNpmDownloadsPromotion,
  sha256,
  writeNpmDownloadsSnapshot,
};
