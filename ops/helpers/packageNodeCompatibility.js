import path from "node:path";

import { supportedNodeEngines } from "./nodeCompatibility.js";
import { lowestNodeMajor } from "./nodeEngine.js";

const COMPATIBILITY_MANIFEST_KIND = "codsen-package-node-compatibility";
const COMPATIBILITY_SCHEMA_VERSION = 2;

function fail(message) {
  throw new Error(message);
}

function normaliseBins(packageJson) {
  if (typeof packageJson.bin === "string") {
    validateBinTarget(packageJson.bin, `${packageJson.name} bin`);
    const name = packageJson.name.includes("/")
      ? packageJson.name.slice(packageJson.name.lastIndexOf("/") + 1)
      : packageJson.name;
    return { [name]: packageJson.bin };
  }
  if (
    packageJson.bin &&
    typeof packageJson.bin === "object" &&
    !Array.isArray(packageJson.bin)
  ) {
    for (const [alias, target] of Object.entries(packageJson.bin)) {
      if (!/^[A-Za-z0-9._-]+$/.test(alias)) {
        fail(`${packageJson.name} has unsafe bin alias ${alias}`);
      }
      validateBinTarget(target, `${packageJson.name} bin ${alias}`);
    }
    return Object.fromEntries(
      Object.entries(packageJson.bin).sort(([left], [right]) =>
        left.localeCompare(right),
      ),
    );
  }
  if (packageJson.bin !== undefined) {
    fail(`${packageJson.name} bin must be a string or string-valued object`);
  }
  return {};
}

function createCompatibilityPlan(records, { hasUnitFiles }) {
  if (!Array.isArray(records) || records.length === 0) {
    fail("Compatibility planning requires workspace records");
  }
  if (typeof hasUnitFiles !== "function") {
    fail("Compatibility planning requires a hasUnitFiles capability");
  }
  const names = new Set();
  for (const { directory, manifest } of records) {
    if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
      fail(`${directory}/package.json must be an object`);
    }
    if (typeof manifest.name !== "string" || !manifest.name) {
      fail(`${directory}/package.json must have a package name`);
    }
    if (names.has(manifest.name)) {
      fail(`Duplicate compatibility package ${manifest.name}`);
    }
    names.add(manifest.name);
  }

  const clis = records
    .filter(({ manifest }) => Object.keys(normaliseBins(manifest)).length)
    .map(({ manifest }) => ({
      name: manifest.name,
      version: manifest.version,
      engines: manifest.engines ?? {},
      bins: normaliseBins(manifest),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
  if (clis.length === 0) {
    fail("No workspace CLI packages were discovered");
  }

  const packages = records
    .map(({ directory, manifest }) => {
      const engines = manifest.engines ?? {};
      const nodeFloor = lowestNodeMajor(engines.node);
      if (supportedNodeEngines.get(nodeFloor) !== engines.node) {
        fail(
          `${manifest.name} must declare one of the exact supported Node floors: ${[
            ...supportedNodeEngines.values(),
          ].join(", ")}`,
        );
      }
      return {
        name: manifest.name,
        version: manifest.version,
        engines,
        nodeFloor,
        directory,
        importable: Boolean(manifest.exports),
        unitCommand: manifest.scripts?.unit ?? null,
        hasUnitFiles: Boolean(hasUnitFiles(directory)),
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
  return { clis, packages };
}

function sortedUniqueStrings(values) {
  return (
    Array.isArray(values) &&
    values.every((value) => typeof value === "string" && value) &&
    new Set(values).size === values.length &&
    JSON.stringify(values) === JSON.stringify([...values].sort())
  );
}

function validateBinTarget(value, context) {
  if (
    typeof value !== "string" ||
    !value ||
    path.posix.isAbsolute(value) ||
    value.includes("\\") ||
    path.posix.normalize(value) !== value ||
    value === ".." ||
    value.startsWith("../")
  ) {
    fail(`${context} must be a safe package-relative POSIX path`);
  }
}

function safeTarballFilename(value) {
  return (
    typeof value === "string" &&
    value.length > 4 &&
    !value.includes("/") &&
    !value.includes("\\") &&
    value.endsWith(".tgz")
  );
}

function validatePackageRecord(item, index) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    fail(`Compatibility package ${index} must be an object`);
  }
  const required = [
    "directory",
    "engines",
    "filename",
    "hasUnitFiles",
    "importable",
    "name",
    "nodeFloor",
    "sha256",
    "unitCommand",
    "version",
  ];
  const keys = Object.keys(item).sort();
  if (JSON.stringify(keys) !== JSON.stringify(required.sort())) {
    fail(`Compatibility package ${item.name ?? index} has unsupported fields`);
  }
  if (typeof item.name !== "string" || !item.name) {
    fail(`Compatibility package ${index} has no name`);
  }
  if (typeof item.version !== "string" || !item.version) {
    fail(`${item.name} has no version`);
  }
  if (
    typeof item.directory !== "string" ||
    !item.directory ||
    path.posix.isAbsolute(item.directory) ||
    item.directory.includes("\\") ||
    path.posix.normalize(item.directory) !== item.directory ||
    item.directory === ".." ||
    item.directory.startsWith("../")
  ) {
    fail(`${item.name} has an unsafe workspace directory`);
  }
  if (
    !item.engines ||
    typeof item.engines !== "object" ||
    Array.isArray(item.engines)
  ) {
    fail(`${item.name} engines must be an object`);
  }
  if (supportedNodeEngines.get(item.nodeFloor) !== item.engines.node) {
    fail(`${item.name} has an unsupported Node floor`);
  }
  if (
    typeof item.importable !== "boolean" ||
    typeof item.hasUnitFiles !== "boolean"
  ) {
    fail(`${item.name} compatibility flags must be booleans`);
  }
  if (item.unitCommand !== null && typeof item.unitCommand !== "string") {
    fail(`${item.name} unitCommand must be a string or null`);
  }
  if (!safeTarballFilename(item.filename)) {
    fail(`Unsafe tarball filename: ${item.filename}`);
  }
  if (typeof item.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(item.sha256)) {
    fail(`Invalid compatibility checksum for ${item.name}`);
  }
}

function validateCliRecord(cli, packageByName, aliases, index) {
  if (!cli || typeof cli !== "object" || Array.isArray(cli)) {
    fail(`Compatibility CLI ${index} must be an object`);
  }
  const required = ["bins", "engines", "name", "version"];
  if (
    JSON.stringify(Object.keys(cli).sort()) !== JSON.stringify(required.sort())
  ) {
    fail(`Compatibility CLI ${cli.name ?? index} has unsupported fields`);
  }
  const packageArtifact = packageByName.get(cli.name);
  if (!packageArtifact) {
    fail(`Compatibility CLI ${cli.name} does not reference a packed package`);
  }
  if (
    cli.version !== packageArtifact.version ||
    JSON.stringify(cli.engines) !== JSON.stringify(packageArtifact.engines)
  ) {
    fail(`Compatibility CLI ${cli.name} metadata does not match its package`);
  }
  if (!cli.bins || typeof cli.bins !== "object" || Array.isArray(cli.bins)) {
    fail(`Compatibility CLI ${cli.name} bins must be an object`);
  }
  const binNames = Object.keys(cli.bins);
  if (!sortedUniqueStrings(binNames) || binNames.length === 0) {
    fail(`Compatibility CLI ${cli.name} bin aliases must be unique and sorted`);
  }
  for (const alias of binNames) {
    if (!/^[A-Za-z0-9._-]+$/.test(alias)) {
      fail(`Compatibility CLI ${cli.name} has unsafe bin alias ${alias}`);
    }
    if (aliases.has(alias)) {
      fail(`Compatibility bin alias ${alias} is declared more than once`);
    }
    aliases.add(alias);
    validateBinTarget(cli.bins[alias], `${cli.name} bin ${alias}`);
  }
}

function validateCompatibilityManifest(manifest, { inspectArtifact }) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    fail("Compatibility artifact manifest must be an object");
  }
  if (
    JSON.stringify(Object.keys(manifest).sort()) !==
    JSON.stringify(["clis", "kind", "packages", "schemaVersion"])
  ) {
    fail("Compatibility artifact manifest has unsupported fields");
  }
  if (
    manifest.kind !== COMPATIBILITY_MANIFEST_KIND ||
    manifest.schemaVersion !== COMPATIBILITY_SCHEMA_VERSION
  ) {
    fail("Unsupported compatibility artifact manifest");
  }
  if (!Array.isArray(manifest.packages) || !Array.isArray(manifest.clis)) {
    fail("Compatibility artifact manifest is incomplete");
  }
  if (manifest.packages.length === 0 || manifest.clis.length === 0) {
    fail("Compatibility artifact manifest must contain packages and CLIs");
  }
  if (typeof inspectArtifact !== "function") {
    fail("Compatibility artifact inspection capability is required");
  }

  const names = [];
  const filenames = new Set();
  for (const [index, item] of manifest.packages.entries()) {
    validatePackageRecord(item, index);
    if (filenames.has(item.filename)) {
      fail(
        `Duplicate tarball filename in compatibility manifest: ${item.filename}`,
      );
    }
    filenames.add(item.filename);
    names.push(item.name);
    const inspection = inspectArtifact(item.filename);
    if (!inspection?.exists) {
      fail(`Missing compatibility tarball: ${item.filename}`);
    }
    if (!inspection.isFile || inspection.isSymbolicLink) {
      fail(`Compatibility tarball is not a regular file: ${item.filename}`);
    }
    if (inspection.sha256 !== item.sha256) {
      fail(`Checksum mismatch for compatibility tarball: ${item.filename}`);
    }
  }
  if (!sortedUniqueStrings(names)) {
    fail("Compatibility packages must have unique, sorted names");
  }
  const packageByName = new Map(
    manifest.packages.map((item) => [item.name, item]),
  );
  const aliases = new Set();
  const cliNames = [];
  manifest.clis.forEach((cli, index) => {
    validateCliRecord(cli, packageByName, aliases, index);
    cliNames.push(cli.name);
  });
  if (!sortedUniqueStrings(cliNames)) {
    fail("Compatibility CLIs must have unique, sorted names");
  }
  return manifest;
}

function compatibilityManifestPlan(manifest) {
  return {
    packages: manifest.packages.map(
      ({ filename: _filename, sha256: _sha256, ...rest }) => rest,
    ),
    clis: manifest.clis,
  };
}

function assertCompatibilityManifestMatchesPlan(manifest, plan) {
  const projection = compatibilityManifestPlan(manifest);
  if (
    JSON.stringify(projection.packages) !== JSON.stringify(plan.packages) ||
    JSON.stringify(projection.clis) !== JSON.stringify(plan.clis)
  ) {
    fail("Compatibility artifacts do not match the current workspace packages");
  }
}

export {
  assertCompatibilityManifestMatchesPlan,
  COMPATIBILITY_MANIFEST_KIND,
  COMPATIBILITY_SCHEMA_VERSION,
  compatibilityManifestPlan,
  createCompatibilityPlan,
  normaliseBins,
  safeTarballFilename,
  validateCompatibilityManifest,
};
