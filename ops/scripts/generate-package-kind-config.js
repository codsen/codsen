#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { writePackageKindConfig } from "../helpers/packageKindConfigGeneration.js";
import { readPackageKindRegistry } from "../helpers/packageKindsFile.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const turboFilename = path.join(repositoryRoot, "turbo.json");

if (process.argv.length !== 2) {
  console.error("Usage: node ops/scripts/generate-package-kind-config.js");
  process.exitCode = 1;
} else {
  const registry = readPackageKindRegistry(repositoryRoot);
  const turboConfig = JSON.parse(readFileSync(turboFilename, "utf8"));
  const changed = await writePackageKindConfig({
    filename: turboFilename,
    registry,
    repositoryRoot,
    turboConfig,
  });
  if (changed) {
    console.log("Generated package-kind build profiles in turbo.json");
  }
}
