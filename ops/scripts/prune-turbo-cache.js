#!/usr/bin/env node

// Evicts stale entries from .turbo/cache.
//
// Turbo never prunes its local cache, so it grows without bound — every task
// hash ever built stays on disk forever. This removes entries nobody has read
// in a while, rather than wiping the folder: an old entry for a package you
// haven't touched is exactly the one you don't want to rebuild, so age of
// *last read* is the signal, not age of creation.
//
// Deliberately not wired into `house`/`test`. Eviction should be something you
// choose to do, never a surprise cold rebuild in the middle of a commit.

import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const CACHE = path.join(ROOT, ".turbo", "cache");
const DEFAULT_DAYS = 30;
const DAY_MS = 86_400_000;

const USAGE = `Usage: node ops/scripts/prune-turbo-cache.js [options]

  --days=N     evict entries untouched for more than N days (default: ${DEFAULT_DAYS})
  --by=FIELD   staleness signal: "atime" (last read, default) or "mtime" (last written)
  --dry-run    report what would be evicted, delete nothing
  --help       show this
`;

function fail(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const options = { days: DEFAULT_DAYS, by: "atime", dryRun: false };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg.startsWith("--days=")) {
      const days = Number(arg.slice("--days=".length));
      if (!Number.isFinite(days) || days < 0) {
        fail(`--days needs a non-negative number, got "${arg.slice(7)}"`);
      }
      options.days = days;
    } else if (arg.startsWith("--by=")) {
      const by = arg.slice("--by=".length);
      if (by !== "atime" && by !== "mtime") {
        fail(`--by must be "atime" or "mtime", got "${by}"`);
      }
      options.by = by;
    } else {
      fail(`Unrecognised argument "${arg}"\n\n${USAGE}`);
    }
  }

  return options;
}

// What the disk actually gets back, not the apparent size. The cache is mostly
// tiny JSON siblings — ~172 bytes of meta rounded up to a whole block — so
// summing stats.size under-reports the reclaim by roughly half.
function diskUsage(stats) {
  return typeof stats.blocks === "number" ? stats.blocks * 512 : stats.size;
}

// Turbo writes up to three files per cache entry, all sharing one hash:
//   <hash>.tar.zst  <hash>-meta.json  <hash>-manifest.json
// They live or die together, so we group before deciding anything.
function hashOf(filename) {
  if (filename.endsWith(".tar.zst")) {
    return filename.slice(0, -".tar.zst".length);
  }
  if (filename.endsWith("-meta.json")) {
    return filename.slice(0, -"-meta.json".length);
  }
  if (filename.endsWith("-manifest.json")) {
    return filename.slice(0, -"-manifest.json".length);
  }
  return null;
}

function collectEntries(by) {
  const entries = new Map();
  let skipped = 0;

  for (const filename of readdirSync(CACHE)) {
    const hash = hashOf(filename);
    if (!hash) {
      skipped += 1;
      continue;
    }

    const absolute = path.join(CACHE, filename);
    let stats;
    try {
      stats = statSync(absolute);
    } catch {
      // vanished mid-scan (concurrent turbo run) — not ours to worry about
      continue;
    }
    if (!stats.isFile()) {
      skipped += 1;
      continue;
    }

    const entry = entries.get(hash) ?? { files: [], bytes: 0, touched: 0 };
    entry.files.push(absolute);
    entry.bytes += diskUsage(stats);
    // newest wins: if any file in the group was read recently, the entry is live
    entry.touched = Math.max(
      entry.touched,
      by === "atime" ? stats.atimeMs : stats.mtimeMs,
    );
    entries.set(hash, entry);
  }

  return { entries, skipped };
}

// If the volume is mounted noatime, atime silently tracks mtime and every
// "last read" is a lie. Cheap to detect, expensive to be wrong about.
function atimeLooksDead(entries) {
  const sample = [];
  for (const entry of entries.values()) {
    sample.push(entry.files[0]);
    if (sample.length >= 200) break;
  }

  let diverged = 0;
  for (const file of sample) {
    try {
      const stats = statSync(file);
      if (Math.abs(stats.atimeMs - stats.mtimeMs) > 1000) diverged += 1;
    } catch {
      // ignore
    }
  }

  return sample.length > 0 && diverged / sample.length < 0.05;
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${unit === 0 ? value : value.toFixed(1)}${units[unit]}`;
}

function formatAge(ms) {
  const days = Math.floor((Date.now() - ms) / DAY_MS);
  if (days < 1) return "today";
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

function pruneTurboCache() {
  // guard: never let a bad ROOT resolution point rm at something else
  if (path.relative(ROOT, CACHE) !== path.join(".turbo", "cache")) {
    fail(`Refusing to touch ${CACHE} — not the repo's .turbo/cache`);
  }
  if (!existsSync(CACHE)) {
    console.log("prune-turbo-cache: no .turbo/cache, nothing to do");
    return;
  }

  const options = parseArgs(process.argv.slice(2));
  const { entries, skipped } = collectEntries(options.by);

  if (entries.size === 0) {
    console.log("prune-turbo-cache: cache is empty, nothing to do");
    return;
  }

  if (options.by === "atime" && atimeLooksDead(entries)) {
    console.warn(
      "prune-turbo-cache: ⚠️  atime does not appear to be updated on this volume " +
        "(it tracks mtime), so 'last read' is meaningless here. Re-run with --by=mtime.",
    );
    return;
  }

  const cutoff = Date.now() - options.days * DAY_MS;
  const stale = [];
  let keptBytes = 0;
  let oldestKept = Infinity;

  for (const [hash, entry] of entries) {
    if (entry.touched < cutoff) {
      stale.push({ hash, ...entry });
    } else {
      keptBytes += entry.bytes;
      oldestKept = Math.min(oldestKept, entry.touched);
    }
  }

  const staleBytes = stale.reduce((total, entry) => total + entry.bytes, 0);
  const verb = options.by === "atime" ? "unread" : "unwritten";
  const label = options.dryRun ? "would evict" : "evicted";

  if (stale.length === 0) {
    console.log(
      `prune-turbo-cache: ${entries.size} entries (${formatBytes(keptBytes)}), none ${verb} for ${options.days}+ days — nothing to do`,
    );
    return;
  }

  let removedBytes = 0;
  if (!options.dryRun) {
    for (const entry of stale) {
      for (const file of entry.files) {
        rmSync(file, { force: true });
      }
      removedBytes += entry.bytes;
    }
  }

  console.log(
    `prune-turbo-cache: ${label} ${stale.length} of ${entries.size} entries ${verb} for ${options.days}+ days, freeing ${formatBytes(staleBytes)}`,
  );
  console.log(
    `prune-turbo-cache: ${entries.size - stale.length} entries kept (${formatBytes(keptBytes)})${
      Number.isFinite(oldestKept)
        ? `, oldest last touched ${formatAge(oldestKept)}`
        : ""
    }`,
  );
  if (skipped > 0) {
    console.log(
      `prune-turbo-cache: left ${skipped} unrecognised file(s) in the cache untouched`,
    );
  }
  if (options.dryRun) {
    console.log("prune-turbo-cache: --dry-run, nothing was deleted");
  } else if (removedBytes !== staleBytes) {
    console.log(
      `prune-turbo-cache: note — freed ${formatBytes(removedBytes)}, expected ${formatBytes(staleBytes)}`,
    );
  }
}

try {
  pruneTurboCache();
} catch (error) {
  console.error(`prune-turbo-cache: ${error.message}`);
  process.exitCode = 1;
}
