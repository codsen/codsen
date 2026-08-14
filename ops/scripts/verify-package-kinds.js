#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dequal } from "dequal";

import {
  createPackageKindResolver,
  PACKAGE_KINDS,
  turboConfigForPackageKinds,
  validatePackageKindInventory,
  validatePackagePublishScripts,
} from "../helpers/packageKinds.js";
import { readPackageKindRegistry } from "../helpers/packageKindsFile.js";
import { readWorkspaceRecords } from "../helpers/workspaceInventoryFile.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

function fileExists(record, relativePath) {
  return existsSync(path.join(repositoryRoot, record.directory, relativePath));
}

function hasExecutableBin(bin) {
  if (typeof bin === "string") {
    return Boolean(bin.trim());
  }
  return (
    bin !== null &&
    typeof bin === "object" &&
    !Array.isArray(bin) &&
    Object.keys(bin).length > 0 &&
    Object.values(bin).every(
      (target) => typeof target === "string" && Boolean(target.trim()),
    )
  );
}

function reportErrors(errors) {
  console.error(
    `Package-kind verification failed with ${errors.length} problem${errors.length === 1 ? "" : "s"}:\n- ${errors.join("\n- ")}`,
  );
  process.exitCode = 1;
}

if (process.argv.length !== 2) {
  console.error("Usage: node ops/scripts/verify-package-kinds.js");
  process.exitCode = 1;
} else {
  const registry = readPackageKindRegistry(repositoryRoot);
  const records = readWorkspaceRecords(repositoryRoot);
  const rootManifest = JSON.parse(
    readFileSync(path.join(repositoryRoot, "package.json"), "utf8"),
  );
  const errors = validatePackageKindInventory({
    registry,
    workspaceNames: records.map(({ manifest }) => manifest.name),
  });
  errors.push(
    ...validatePackagePublishScripts([
      rootManifest,
      ...records.map(({ manifest }) => manifest),
    ]),
  );

  let resolver;
  try {
    resolver = createPackageKindResolver(registry);
  } catch (error) {
    if (!errors.length) {
      errors.push(error.message);
    }
  }

  if (resolver && !errors.length) {
    const lectrc = JSON.parse(
      readFileSync(path.join(repositoryRoot, "ops/lect/.lectrc.json"), "utf8"),
    );
    for (const record of records) {
      const { manifest } = record;
      const kind = resolver.kindFor(manifest.name);
      const hasRollupConfig = fileExists(record, "rollup.config.js");

      if (kind === PACKAGE_KINDS.TYPESCRIPT_LIBRARY) {
        if (record.directory !== path.posix.join("packages", manifest.name)) {
          errors.push(
            `${manifest.name}: TypeScript-library directory must be packages/${manifest.name}`,
          );
        }
        for (const requiredPath of [
          "rollup.config.js",
          "src/main.ts",
          "tsconfig.json",
        ]) {
          if (!fileExists(record, requiredPath)) {
            errors.push(
              `${manifest.name}: TypeScript library is missing ${requiredPath}`,
            );
          }
        }
        if (!manifest.exports) {
          errors.push(`${manifest.name}: TypeScript library has no exports`);
        }
        if (manifest.scripts?.build !== lectrc.scripts.rollup.build) {
          errors.push(
            `${manifest.name}: build script does not match the TypeScript-library profile`,
          );
        }
      } else if (kind === PACKAGE_KINDS.CLI) {
        if (record.directory !== path.posix.join("packages", manifest.name)) {
          errors.push(
            `${manifest.name}: CLI directory must be packages/${manifest.name}`,
          );
        }
        if (hasRollupConfig) {
          errors.push(`${manifest.name}: CLI must not have rollup.config.js`);
        }
        if (!hasExecutableBin(manifest.bin)) {
          errors.push(
            `${manifest.name}: CLI has no executable bin declaration`,
          );
        }
        if (!fileExists(record, "cli.js")) {
          errors.push(`${manifest.name}: CLI is missing cli.js`);
        }
        if (manifest.scripts?.build !== lectrc.scripts.cli.build) {
          errors.push(
            `${manifest.name}: build script does not match the CLI profile`,
          );
        }
      } else if (kind === PACKAGE_KINDS.GENERATED_DATA) {
        if (record.directory !== "data") {
          errors.push(
            `${manifest.name}: generated-data workspace must be at data/`,
          );
        }
        if (manifest.private) {
          errors.push(
            `${manifest.name}: generated-data workspace must be publishable`,
          );
        }
        if (hasRollupConfig) {
          errors.push(
            `${manifest.name}: generated-data workspace must not have rollup.config.js`,
          );
        }
        for (const requiredPath of ["index.ts", "tsconfig.json"]) {
          if (!fileExists(record, requiredPath)) {
            errors.push(
              `${manifest.name}: generated-data workspace is missing ${requiredPath}`,
            );
          }
        }
        if (
          typeof manifest.scripts?.build !== "string" ||
          !manifest.scripts.build.includes("tsc") ||
          !manifest.scripts.build.includes("tsconfig.json")
        ) {
          errors.push(
            `${manifest.name}: generated-data build must compile tsconfig.json with tsc`,
          );
        }
        if (fileExists(record, "tsconfig.json")) {
          const dataTsconfig = JSON.parse(
            readFileSync(
              path.join(repositoryRoot, record.directory, "tsconfig.json"),
              "utf8",
            ),
          );
          if (dataTsconfig.compilerOptions?.outDir !== "dist") {
            errors.push(
              `${manifest.name}: generated-data tsconfig must emit to dist`,
            );
          }
        }
      }
    }

    const generatedDataNames = resolver.namesFor(PACKAGE_KINDS.GENERATED_DATA);
    if (
      generatedDataNames.length !== 1 ||
      generatedDataNames[0] !== "@codsen/data"
    ) {
      errors.push(
        "Release automation requires @codsen/data to be the sole generated-data workspace",
      );
    }

    const coveragePolicy = JSON.parse(
      readFileSync(
        path.join(repositoryRoot, "ops/coverage-policy.json"),
        "utf8",
      ),
    );
    const coverageExemptions = Object.keys(
      coveragePolicy.workspaceExemptions ?? {},
    ).sort();
    if (!dequal(coverageExemptions, generatedDataNames)) {
      errors.push(
        "Coverage workspace exemptions must exactly match generated-data workspaces",
      );
    }

    const lernaConfig = JSON.parse(
      readFileSync(path.join(repositoryRoot, "lerna.json"), "utf8"),
    );
    const forcePublishedPackages = [
      ...(lernaConfig.command?.version?.forcePublish ?? []),
    ].sort();
    if (!dequal(forcePublishedPackages, generatedDataNames)) {
      errors.push(
        "Lerna forcePublish packages must exactly match generated-data workspaces",
      );
    }

    const turboFilename = path.join(repositoryRoot, "turbo.json");
    const turboConfig = JSON.parse(readFileSync(turboFilename, "utf8"));
    const expectedTurboConfig = turboConfigForPackageKinds(
      turboConfig,
      registry,
    );
    if (!dequal(turboConfig, expectedTurboConfig)) {
      errors.push(
        'turbo.json package-kind profiles are stale; run "npm run ci:generate:package-kind-config"',
      );
    }
  }

  if (errors.length) {
    reportErrors(errors);
  } else {
    console.log(
      `Package kinds OK for all ${records.length} workspaces: ${resolver.namesFor(PACKAGE_KINDS.TYPESCRIPT_LIBRARY).length} TypeScript libraries, ${resolver.namesFor(PACKAGE_KINDS.CLI).length} CLIs, and ${resolver.namesFor(PACKAGE_KINDS.GENERATED_DATA).length} generated-data workspace.`,
    );
  }
}
