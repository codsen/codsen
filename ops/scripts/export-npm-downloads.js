#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";

import { exportNpmDownloads } from "../helpers/npmDownloadsExport.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const help = `Export verified npm download history as static chart JSON.

Usage: node ops/scripts/export-npm-downloads.js --output <directory> [--archive <directory>]

  --output <directory>  Required destination; empty or a previous chart export.
  --archive <directory> Archive source; defaults to statistics/npm-downloads.
  --help               Show this help.

Reads local files only. The archive and output directories must not overlap.
`;

async function main() {
  let archiveDirectory = path.join(repositoryRoot, "statistics/npm-downloads");
  let outputDirectory;
  const seen = new Set();
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--help") {
      if (args.length !== 1) throw new Error("--help must be used on its own");
      process.stdout.write(help);
      return;
    }
    if (arg !== "--output" && arg !== "--archive") {
      throw new Error(`Unknown argument: ${arg}`);
    }
    if (seen.has(arg)) throw new Error(`Duplicate argument: ${arg}`);
    seen.add(arg);
    const value = args[++index];
    if (!value || value.startsWith("--")) {
      throw new Error(`${arg} requires a directory`);
    }
    if (arg === "--output") outputDirectory = value;
    else archiveDirectory = value;
  }
  if (!outputDirectory) throw new Error("--output is required");
  const result = await exportNpmDownloads({
    archiveDirectory,
    outputDirectory,
  });
  process.stdout.write(
    `Exported ${Object.keys(result.index.packages).length} packages through ${result.index.through} to ${result.outputDirectory}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`npm downloads export: ${error.message}\n`);
  process.exitCode = 1;
});
