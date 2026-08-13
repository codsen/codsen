#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import writeFileAtomic from "write-file-atomic";

import { turboConfigForPackageKinds } from "../helpers/packageKinds.js";
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
  const expectedConfig = turboConfigForPackageKinds(turboConfig, registry);

  if (!isDeepStrictEqual(turboConfig, expectedConfig)) {
    const expectedContents = `${JSON.stringify(expectedConfig, null, 2)}\n`;
    await writeFileAtomic(turboFilename, expectedContents);
    const biomeResult = spawnSync(
      process.execPath,
      [
        path.join(repositoryRoot, "node_modules/@biomejs/biome/bin/biome"),
        "format",
        "--write",
        turboFilename,
      ],
      { stdio: "inherit" },
    );
    if (biomeResult.error || biomeResult.status !== 0) {
      throw new Error(
        `Could not format turbo.json: ${biomeResult.error?.message ?? `Biome exited ${biomeResult.status}`}`,
      );
    }
    console.log("Generated package-kind build profiles in turbo.json");
  }
}
