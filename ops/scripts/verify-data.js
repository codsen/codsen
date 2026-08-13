#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { PACKAGE_KINDS } from "../helpers/packageKinds.js";
import { readPackageKindResolver } from "../helpers/packageKindsFile.js";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

function fail(message) {
  throw new Error(message);
}

function sortedKeys(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail("Generated data export must be an object");
  }
  return Object.keys(value).sort();
}

function assertSameList(actual, expected, context) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    const missing = expected.filter((item) => !actual.includes(item));
    const unexpected = actual.filter((item) => !expected.includes(item));
    fail(
      `${context} mismatch (missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"})`,
    );
  }
}

function readGeneratedJson(exportName) {
  const file = path.join(ROOT, "data", "sources", `${exportName}.ts`);
  const source = readFileSync(file, "utf8");
  const marker = `export const ${exportName}`;
  const markerAt = source.indexOf(marker);
  const equalsAt = source.indexOf("=", markerAt + marker.length);
  if (markerAt === -1 || equalsAt === -1) {
    fail(`${file} does not contain ${marker}`);
  }
  const serialized = source
    .slice(equalsAt + 1)
    .trim()
    .replace(/;$/, "")
    .trim();
  try {
    return JSON.parse(serialized);
  } catch (error) {
    fail(
      `${file} does not contain a JSON ${exportName} payload: ${error.message}`,
    );
  }
}

function packageDirectories() {
  const packagesDirectory = path.join(ROOT, "packages");
  return readdirSync(packagesDirectory)
    .filter((directory) => {
      const absolute = path.join(packagesDirectory, directory);
      return (
        statSync(absolute).isDirectory() &&
        existsSync(path.join(absolute, "package.json"))
      );
    })
    .sort();
}

async function verifyData() {
  const packageKinds = readPackageKindResolver(ROOT);
  const data = await import(
    `${pathToFileURL(path.join(ROOT, "data", "dist", "index.js")).href}?verify=${Date.now()}`
  );
  const generatedJsonExports = [
    "allDTS",
    "changelogs",
    "dependencyStats",
    "examples",
    "exportedDefaults",
    "gitStats",
    "interdeps",
    "packageJSONData",
  ];

  for (const exportName of generatedJsonExports) {
    const sourceValue = readGeneratedJson(exportName);
    if (!isDeepStrictEqual(data[exportName], sourceValue)) {
      fail(
        `Compiled @codsen/data export ${exportName} is stale relative to data/sources/${exportName}.ts`,
      );
    }
  }

  const directories = packageDirectories();
  const changelogNames = sortedKeys(data.changelogs);
  assertSameList(
    changelogNames,
    directories,
    "Compiled @codsen/data changelog keys",
  );
  for (const packageName of directories) {
    if (!data.changelogs[packageName].trim()) {
      fail(`Compiled changelog for ${packageName} is empty`);
    }
  }

  const cliNames = [];
  const programNames = [];
  const scriptNames = [];
  const specialNames = [];
  for (const directory of directories) {
    const packageDirectory = path.join(ROOT, "packages", directory);
    const manifest = JSON.parse(
      readFileSync(path.join(packageDirectory, "package.json"), "utf8"),
    );
    if (manifest.name !== directory) {
      fail(
        `${directory}/package.json name is ${manifest.name}; generated data requires package names to match their directories`,
      );
    }
    const packageData = data.packageJSONData[manifest.name];
    if (!packageData) {
      fail(`packageJSONData is missing ${manifest.name}`);
    }
    if (packageData.version !== manifest.version) {
      fail(
        `packageJSONData has stale ${manifest.name} version ${packageData.version}; expected ${manifest.version}`,
      );
    }
    if (!manifest.private && !data.packages.current.includes(manifest.name)) {
      fail(`packages.current is missing ${manifest.name}`);
    }

    const kind = packageKinds.kindFor(manifest.name);
    if (manifest.bin) {
      cliNames.push(manifest.name);
    }
    if (manifest.exports?.script) {
      scriptNames.push(manifest.name);
    }
    if (kind === PACKAGE_KINDS.TYPESCRIPT_LIBRARY) {
      programNames.push(manifest.name);
      const declarations = readFileSync(
        path.join(packageDirectory, "types", "index.d.ts"),
        "utf8",
      ).trim();
      if (data.allDTS[manifest.name] !== declarations) {
        fail(`allDTS is stale or missing for ${manifest.name}`);
      }
    } else if (!manifest.bin) {
      specialNames.push(manifest.name);
    }
  }

  cliNames.sort();
  programNames.sort();
  scriptNames.sort();
  specialNames.sort();
  assertSameList(sortedKeys(data.allDTS), programNames, "allDTS keys");
  assertSameList(sortedKeys(data.examples), programNames, "examples keys");
  assertSameList(
    [...data.packages.programs],
    programNames,
    "packages.programs",
  );
  assertSameList([...data.packages.cli], cliNames, "packages.cli");
  assertSameList([...data.packages.script], scriptNames, "packages.script");
  assertSameList([...data.packages.special], specialNames, "packages.special");
  for (const [countName, expected] of [
    ["programsCount", programNames.length],
    ["cliCount", cliNames.length],
    ["scriptCount", scriptNames.length],
    ["specialCount", specialNames.length],
  ]) {
    if (data.packages[countName] !== expected) {
      fail(
        `packages.${countName} is ${data.packages[countName]}; expected ${expected}`,
      );
    }
  }

  console.log(
    `Verified @codsen/data: ${directories.length} package manifests and changelogs, ${programNames.length} declaration/example sets, and ${generatedJsonExports.length} fresh compiled exports.`,
  );
}

verifyData().catch((error) => {
  console.error(`verify-data: ${error.message}`);
  process.exitCode = 1;
});
