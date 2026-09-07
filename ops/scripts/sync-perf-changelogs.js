import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  changelogReleases,
  syncPerfChangelog,
  validReleaseDate,
} from "../helpers/perfChangelogs.js";
import { readPerfPolicy, resolvePerfPolicy } from "../helpers/perfPolicy.js";
import { parseHistorical } from "./historicalJson.js";

function parseArguments(args) {
  const options = { root: process.cwd(), mode: "write", registry: false };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--check" || argument === "--dry-run") {
      if (options.mode !== "write") {
        throw new Error("Choose only one of --check and --dry-run");
      }
      options.mode = argument.slice(2);
    } else if (argument === "--registry") {
      options.registry = true;
    } else if (argument === "--root") {
      if (!args[index + 1] || args[index + 1].startsWith("--")) {
        throw new Error("--root requires a directory");
      }
      options.root = path.resolve(args[++index]);
    } else {
      throw new Error(`Unsupported argument: ${argument}`);
    }
  }
  return options;
}

function git(root, args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function localTags(root) {
  const result = new Map();
  if (!existsSync(path.join(root, ".git"))) {
    return result;
  }
  const output = git(root, [
    "for-each-ref",
    "--format=%(refname:strip=2)%09%(creatordate:iso-strict)%09%(*objectname)%09%(objectname)",
    "refs/tags",
  ]);
  for (const line of output.trim().split("\n")) {
    const [name, timestamp, target, object] = line.split("\t");
    if (name && validReleaseDate(timestamp?.slice(0, 10))) {
      result.set(name, {
        date: timestamp.slice(0, 10),
        commit: target || object,
      });
    }
  }
  return result;
}

function resolveLocalDates(root, item, missing, tags) {
  const dates = {};
  for (const { version } of missing) {
    const tagName = `${item.name}@${version}`;
    const tag = tags.get(tagName);
    if (!tag) {
      continue;
    }
    try {
      const manifest = JSON.parse(
        git(root, ["show", `${tag.commit}:${item.directory}/package.json`]),
      );
      if (manifest.name === item.name && manifest.version === version) {
        dates[version] = { date: tag.date, source: `git tag ${tagName}` };
      }
    } catch {
      // A tag without the corresponding package/version is insufficient
      // evidence. Historical changelog headings can still resolve the date.
    }
  }
  if (
    missing.every(({ version }) => dates[version]) ||
    !existsSync(path.join(root, ".git"))
  ) {
    return dates;
  }
  const commits = git(root, [
    "log",
    "--all",
    "--full-history",
    "--format=%H",
    // Read only revisions whose patch mentions a missing version heading.
    // Parsing the complete file at those revisions still excludes fenced
    // examples and incidental version references from release-date evidence.
    "-G",
    `^#{1,6} .*(${missing
      .filter(({ version }) => !dates[version])
      .map(({ version }) => version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})([^0-9A-Za-z.+-]|$)`,
    "--",
    `${item.directory}/CHANGELOG.md`,
  ])
    .trim()
    .split("\n")
    .filter(Boolean);
  for (const commit of commits) {
    let source;
    try {
      source = git(root, ["show", `${commit}:${item.directory}/CHANGELOG.md`]);
    } catch {
      continue;
    }
    for (const { version, date } of changelogReleases(source)) {
      if (
        !dates[version] &&
        date &&
        missing.some((entry) => entry.version === version)
      ) {
        dates[version] = {
          date,
          source: `git ${commit}:${item.directory}/CHANGELOG.md`,
        };
      }
    }
    if (missing.every(({ version }) => dates[version])) {
      break;
    }
  }
  return dates;
}

async function resolveRegistryDates(name, missing, dates) {
  if (missing.every(({ version }) => dates[version])) {
    return;
  }
  const url = `https://registry.npmjs.org/${encodeURIComponent(name)}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (response.status === 404) {
    return;
  }
  if (!response.ok) {
    throw new Error(
      `npm metadata returned HTTP ${response.status} for ${name}`,
    );
  }
  const metadata = await response.json();
  if (
    metadata.name !== name ||
    !metadata.time ||
    typeof metadata.time !== "object"
  ) {
    throw new Error(`Invalid npm publication metadata for ${name}`);
  }
  for (const { version } of missing) {
    const timestamp = metadata.time[version];
    if (dates[version] || timestamp === undefined) {
      continue;
    }
    if (
      typeof timestamp !== "string" ||
      !Number.isFinite(Date.parse(timestamp))
    ) {
      throw new Error(`Invalid npm publication time for ${name}@${version}`);
    }
    const date = new Date(timestamp).toISOString().slice(0, 10);
    if (!validReleaseDate(date)) {
      throw new Error(`Invalid npm release date for ${name}@${version}`);
    }
    dates[version] = { date, source: `${url} time[${version}]` };
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const root = path.resolve(options.root);
  if (
    JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")).name !==
    "codsen-mono"
  ) {
    throw new Error("--root must identify the codsen-mono repository");
  }
  const tags = localTags(root);
  const policy = readPerfPolicy(path.join(root, "ops/perf-policy.json"));
  const report = {
    mode: options.mode,
    packagesScanned: 0,
    changedPackages: [],
    changes: [],
    unresolved: [],
    errors: [],
    written: false,
  };
  const plans = [];
  const directories = readdirSync(path.join(root, "packages"), {
    withFileTypes: true,
  }).sort((left, right) =>
    left.name < right.name ? -1 : left.name > right.name ? 1 : 0,
  );
  for (const directory of directories) {
    if (!directory.isDirectory()) {
      continue;
    }
    const relative = `packages/${directory.name}`;
    const historyPath = path.join(root, relative, "perf/historical.json");
    if (!existsSync(historyPath)) {
      continue;
    }
    report.packagesScanned += 1;
    try {
      const manifest = JSON.parse(
        readFileSync(path.join(root, relative, "package.json"), "utf8"),
      );
      const filename = path.join(root, relative, "CHANGELOG.md");
      const changelog = readFileSync(filename, "utf8");
      const history = parseHistorical(readFileSync(historyPath, "utf8"));
      const { unchangedTolerancePercent } = resolvePerfPolicy(
        policy,
        manifest.name,
      );
      let result = syncPerfChangelog({
        changelog,
        history,
        unchangedTolerancePercent,
      });
      const dates = resolveLocalDates(
        root,
        { name: manifest.name, directory: relative },
        result.unresolved,
        tags,
      );
      if (options.registry) {
        await resolveRegistryDates(manifest.name, result.unresolved, dates);
      }
      result = syncPerfChangelog({
        changelog,
        history,
        versionDates: dates,
        unchangedTolerancePercent,
      });
      if (result.result !== changelog) {
        plans.push({ filename, original: changelog, result: result.result });
        report.changedPackages.push(manifest.name);
      }
      report.changes.push(
        ...result.changes.map((change) => ({
          package: manifest.name,
          ...change,
        })),
      );
      report.unresolved.push(
        ...result.unresolved.map((entry) => ({
          package: manifest.name,
          ...entry,
        })),
      );
    } catch (error) {
      report.errors.push({ package: directory.name, message: error.message });
    }
  }
  const blocked = report.errors.length > 0 || report.unresolved.length > 0;
  if (!blocked && options.mode === "write") {
    // Resolve every package before writing any. Recheck the sources so an edit
    // made during a registry lookup cannot be overwritten by an older plan.
    for (const plan of plans) {
      if (readFileSync(plan.filename, "utf8") !== plan.original) {
        throw new Error(
          `Changelog changed during reconciliation: ${plan.filename}`,
        );
      }
    }
    for (const plan of plans) {
      writeFileSync(plan.filename, plan.result);
    }
    report.written = plans.length > 0;
  }
  console.log(JSON.stringify(report, null, 2));
  if (blocked || (options.mode === "check" && plans.length > 0)) {
    process.exitCode = 1;
  }
}

await main();
