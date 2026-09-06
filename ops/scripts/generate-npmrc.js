#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { writeGeneratedFile } from "../helpers/generatedFiles.js";
import { renderNpmReleaseAgeAllowlist } from "../helpers/npmReleaseAgeAllowlist.js";
import { readWorkspaceRecords } from "../helpers/workspaceInventoryFile.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const arguments_ = process.argv.slice(2);

try {
  if (
    arguments_.length > 1 ||
    (arguments_.length === 1 && arguments_[0] !== "--check")
  ) {
    throw new Error("Usage: node ops/scripts/generate-npmrc.js [--check]");
  }

  const filename = path.join(repositoryRoot, ".npmrc");
  const changed = await writeGeneratedFile({
    contents: renderNpmReleaseAgeAllowlist(
      readFileSync(filename, "utf8"),
      readWorkspaceRecords(repositoryRoot),
    ),
    filename,
    fixCommand: "npm run ci:generate:npmrc",
    mode: arguments_.includes("--check") ? "check" : "write",
  });
  if (changed) {
    console.log("Generated Codsen release-age exclusions in .npmrc");
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
