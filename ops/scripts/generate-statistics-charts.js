#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { writeGeneratedFile } from "../helpers/generatedFiles.js";
import { readNpmDownloadsSnapshot } from "../helpers/npmDownloadsFile.js";
import { readNpmDownloadsRoster } from "../helpers/npmDownloadsRoster.js";
import {
  assertLockedWorkspaceDependencies,
  completeInterdeps,
  parseInterdepsSource,
} from "../helpers/statisticsChartsData.js";
import { buildDependencyCharts } from "../helpers/statisticsChartsDependencies.js";
import { buildDownloadCharts } from "../helpers/statisticsChartsDownloads.js";
import { buildChartsGallery } from "../helpers/statisticsChartsGallery.js";
import { buildMoleculeCharts } from "../helpers/statisticsChartsMolecule.js";
import { readWorkspaceRecords } from "../helpers/workspaceInventoryFile.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const args = process.argv.slice(2);
const help = `Bake local statistics into SVG charts and a portable 3D explorer.

Usage: npm run stats:charts [-- --check]

  --check  Verify every generated chart without writing files.
  --help   Show this help.

Reads verified statistics/npm-downloads, data/sources/interdeps.ts, current
workspace manifests, and package-lock.json. Writes statistics/charts. No network
requests, package builds, archive refreshes, or website deployment.
`;

async function main() {
  if (args.length === 1 && args[0] === "--help") {
    process.stdout.write(help);
    return;
  }
  if (args.length > 1 || (args.length === 1 && args[0] !== "--check")) {
    throw new Error("Usage: npm run stats:charts [-- --check]");
  }
  const mode = args.length ? "check" : "write";
  const [snapshot, interdepsSource, lockSource] = await Promise.all([
    readNpmDownloadsSnapshot(path.join(root, "statistics/npm-downloads")),
    readFile(path.join(root, "data/sources/interdeps.ts"), "utf8"),
    readFile(path.join(root, "package-lock.json"), "utf8"),
  ]);
  const roster = readNpmDownloadsRoster(root, snapshot.manifest.packages);
  const observed = snapshot.manifest.packages;
  if (
    JSON.stringify(Object.keys(roster).sort()) !==
      JSON.stringify(Object.keys(observed).sort()) ||
    Object.entries(roster).some(
      ([name, entry]) =>
        entry.status !== observed[name].status ||
        entry.includedInPortfolio !== observed[name].includedInPortfolio,
    )
  ) {
    throw new Error("download catalogue is stale; run npm run stats:refresh");
  }
  const workspaceRecords = readWorkspaceRecords(root);
  assertLockedWorkspaceDependencies(
    workspaceRecords,
    JSON.parse(lockSource).packages,
  );
  const interdeps = completeInterdeps(
    parseInterdepsSource(interdepsSource),
    workspaceRecords,
  );
  const downloads = buildDownloadCharts(snapshot);
  const dependencies = buildDependencyCharts(interdeps);
  const molecule = buildMoleculeCharts({ root, interdeps });
  const files = {
    ...downloads.files,
    ...dependencies.files,
    ...molecule.files,
  };
  const summary = {
    schemaVersion: 1,
    sources: {
      downloadRevision: snapshot.manifest.revision,
      downloadsThrough: snapshot.manifest.through,
      interdepsSha256: createHash("sha256")
        .update(interdepsSource)
        .digest("hex"),
      packageLockSha256: createHash("sha256").update(lockSource).digest("hex"),
    },
    downloads: downloads.summary,
    dependencies: dependencies.summary,
    molecule: molecule.summary,
  };
  files["summary.json"] = `${JSON.stringify(summary, null, 2)}\n`;
  files["index.html"] = buildChartsGallery(files, snapshot.manifest.through);
  const directory = path.join(root, "statistics/charts");
  if (mode === "write") await mkdir(directory, { recursive: true });
  let changed = 0;
  for (const [file, contents] of Object.entries(files).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    if (path.basename(file) !== file)
      throw new Error(`invalid chart filename: ${file}`);
    changed += Number(
      await writeGeneratedFile({
        filename: path.join(directory, file),
        contents,
        mode,
        fixCommand: "npm run stats:charts",
      }),
    );
  }
  console.log(
    `${mode === "check" ? "Verified" : "Baked"} ${Object.keys(files).length} chart files in statistics/charts (${changed} changed).`,
  );
}

main().catch((error) => {
  console.error(`statistics charts: ${error.message}`);
  process.exitCode = 1;
});
