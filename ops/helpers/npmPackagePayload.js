import path from "node:path";

import {
  assertObjectKeys,
  assertPackageName,
  assertSha,
  assertVersion,
  RELEASE_SCHEMA_VERSION,
  safeRepositoryPath,
  validateLayers,
} from "./npmReleasePlan.js";

const MANIFEST_KIND = "codsen-npm-release-manifest";
const FORBIDDEN_PACKED_PARTS = new Set([
  ".git",
  ".turbo",
  "coverage",
  "node_modules",
  "tap",
  "perf",
]);

function fail(message) {
  throw new Error(message);
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

function packageTarget(value, context) {
  if (typeof value !== "string" || !value) {
    fail(`${context} must be a non-empty string`);
  }
  const stripped = value.startsWith("./") ? value.slice(2) : value;
  if (
    !stripped ||
    path.posix.isAbsolute(stripped) ||
    stripped.includes("\\") ||
    path.posix.normalize(stripped) !== stripped ||
    stripped === ".." ||
    stripped.startsWith("../")
  ) {
    fail(`${context} is not a safe package-relative path: ${value}`);
  }
  return stripped;
}

function collectStringTargets(value, context, output) {
  if (typeof value === "string") {
    if (!value.startsWith("./")) {
      fail(`${context} target must begin with ./: ${value}`);
    }
    output.add(packageTarget(value, context));
    return;
  }
  if (value === null) {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectStringTargets(item, `${context}[${index}]`, output);
    });
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      collectStringTargets(item, `${context}.${key}`, output);
    });
    return;
  }
  fail(`${context} contains an unsupported package target`);
}

function entrypointTargets(manifest) {
  const targets = new Set();
  if (manifest.exports !== undefined) {
    collectStringTargets(manifest.exports, `${manifest.name} exports`, targets);
  }
  for (const field of ["types", "typings", "main", "module"]) {
    if (manifest[field] !== undefined) {
      targets.add(packageTarget(manifest[field], `${manifest.name} ${field}`));
    }
  }
  if (manifest.browser !== undefined) {
    if (typeof manifest.browser === "string") {
      targets.add(packageTarget(manifest.browser, `${manifest.name} browser`));
    } else if (manifest.browser && typeof manifest.browser === "object") {
      for (const [key, value] of Object.entries(manifest.browser)) {
        if (typeof value === "string" && value.startsWith("./")) {
          targets.add(packageTarget(value, `${manifest.name} browser.${key}`));
        }
      }
    } else {
      fail(`${manifest.name} browser must be a string or object`);
    }
  }
  if (manifest.bin !== undefined) {
    let bins;
    if (typeof manifest.bin === "string") {
      bins = [manifest.bin];
    } else if (
      manifest.bin &&
      typeof manifest.bin === "object" &&
      !Array.isArray(manifest.bin)
    ) {
      bins = Object.values(manifest.bin);
    } else {
      fail(`${manifest.name} bin must be a string or string-valued object`);
    }
    if (bins.some((value) => typeof value !== "string")) {
      fail(`${manifest.name} bin must be a string or string-valued object`);
    }
    for (const target of bins) {
      targets.add(packageTarget(target, `${manifest.name} bin`));
    }
  }
  if (targets.size === 0) {
    fail(
      `${manifest.name} has no exports, types, bin, main, module, or browser entrypoint`,
    );
  }
  return [...targets].sort();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wildcardRegExp(pattern) {
  return new RegExp(`^${pattern.split("*").map(escapeRegExp).join("[^/]+")}$`);
}

function forbiddenPackedPath(relative) {
  const parts = relative.split("/");
  return (
    parts.some((part) => FORBIDDEN_PACKED_PARTS.has(part)) ||
    parts.includes(".eslintcache") ||
    parts.includes(".DS_Store") ||
    relative.endsWith(".tsbuildinfo")
  );
}

function localSpecifiers(source) {
  const specifiers = new Set();
  const expressions = [
    /(?:import|export)\s+(?:[^"']*?\s+from\s*)?["']([^"']+)["']/g,
    /import\s*\(\s*["']([^"']+)["']\s*\)/g,
    /require\s*\(\s*["']([^"']+)["']\s*\)/g,
    /new\s+URL\s*\(\s*["']([^"']+)["']\s*,\s*import\.meta\.url\s*\)/g,
  ];
  for (const expression of expressions) {
    let match;
    for (
      match = expression.exec(source);
      match;
      match = expression.exec(source)
    ) {
      if (match[1].startsWith(".")) {
        specifiers.add(match[1]);
      }
    }
  }
  return [...specifiers];
}

function validatePackedFiles(
  item,
  manifest,
  packResult,
  staged,
  targets,
  requiredPayload,
) {
  if (!Array.isArray(packResult.files)) {
    fail(`npm pack did not report files for ${item.name}`);
  }
  const files = new Map();
  for (const entry of packResult.files) {
    if (!entry || typeof entry.path !== "string") {
      fail(`npm pack reported an invalid file for ${item.name}`);
    }
    const relative = entry.path.replace(/^package\//, "");
    packageTarget(relative, `${item.name} packed file`);
    if (forbiddenPackedPath(relative)) {
      fail(
        `${item.name} tarball contains forbidden transient path ${relative}`,
      );
    }
    if (!staged.has(relative)) {
      fail(
        `${item.name} tarball contains a file outside the controlled staging set: ${relative}`,
      );
    }
    if (files.has(relative)) {
      fail(`${item.name} tarball reports duplicate file ${relative}`);
    }
    files.set(relative, entry);
  }
  if (!files.has("package.json")) {
    fail(`${item.name} tarball does not contain package.json`);
  }
  if (!Array.isArray(requiredPayload)) {
    fail(`${item.name} required payload must be an array`);
  }
  for (const relative of requiredPayload) {
    if (!files.has(relative)) {
      fail(`${item.name} tarball omits payload closure file ${relative}`);
    }
  }
  for (const target of targets) {
    if (target.includes("*")) {
      if (
        ![...files.keys()].some((file) => wildcardRegExp(target).test(file))
      ) {
        fail(
          `${item.name} tarball does not satisfy entrypoint pattern ${target}`,
        );
      }
    } else if (!files.has(target)) {
      fail(`${item.name} tarball does not contain entrypoint ${target}`);
    }
  }
  const binTargets =
    manifest.bin === undefined
      ? []
      : typeof manifest.bin === "string"
        ? [manifest.bin]
        : Object.values(manifest.bin ?? {});
  for (const targetValue of binTargets) {
    const target = packageTarget(targetValue, `${item.name} bin`);
    const packed = files.get(target);
    if (!packed) {
      fail(`${item.name} tarball does not contain bin target ${target}`);
    }
    if (typeof packed.mode !== "number" || (packed.mode & 0o111) === 0) {
      fail(
        `${item.name} bin target ${target} is not executable in the tarball`,
      );
    }
  }
  return files;
}

function validateTarball(item, manifestDirectory, inspectTarball) {
  assertObjectKeys(
    item.tarball,
    ["entryCount", "file", "integrity", "sha1", "sha256", "sha512", "size"],
    `${item.name} tarball`,
  );
  const tarball = item.tarball;
  if (!safeTarballFilename(tarball.file)) {
    fail(`${item.name} has an unsafe tarball filename`);
  }
  if (!Number.isInteger(tarball.entryCount) || tarball.entryCount < 1) {
    fail(`${item.name} tarball entryCount must be a positive integer`);
  }
  if (!Number.isInteger(tarball.size) || tarball.size < 1) {
    fail(`${item.name} tarball size must be a positive integer`);
  }
  if (!/^[0-9a-f]{40}$/.test(tarball.sha1)) {
    fail(`${item.name} tarball sha1 is invalid`);
  }
  if (!/^[0-9a-f]{64}$/.test(tarball.sha256)) {
    fail(`${item.name} tarball sha256 is invalid`);
  }
  if (!/^[0-9a-f]{128}$/.test(tarball.sha512)) {
    fail(`${item.name} tarball sha512 is invalid`);
  }
  if (!/^sha512-[A-Za-z0-9+/]+={0,2}$/.test(tarball.integrity)) {
    fail(`${item.name} tarball integrity is not a sha512 SRI`);
  }
  const absolute = path.resolve(manifestDirectory, tarball.file);
  if (path.dirname(absolute) !== path.resolve(manifestDirectory)) {
    fail(`${item.name} tarball escapes the artifact directory`);
  }
  if (typeof inspectTarball !== "function") {
    fail("Tarball inspection capability is required");
  }
  const inspection = inspectTarball(absolute);
  if (!inspection?.exists) {
    fail(`${item.name} tarball is missing: ${absolute}`);
  }
  if (!inspection.isFile || inspection.isSymbolicLink) {
    fail(`${item.name} tarball is not a regular file`);
  }
  for (const field of ["integrity", "sha1", "sha256", "sha512", "size"]) {
    if (inspection.hashes?.[field] !== tarball[field]) {
      fail(`${item.name} tarball ${field} does not match manifest.json`);
    }
  }
  return absolute;
}

function validateReleaseManifest(
  manifest,
  { inspectTarball, manifestDirectory, repositoryRoot },
) {
  assertObjectKeys(
    manifest,
    [
      "baseSha",
      "createdAt",
      "headSha",
      "kind",
      "layers",
      "packageCount",
      "packages",
      "planSha256",
      "schemaVersion",
      "workspaceCount",
    ],
    "release manifest",
  );
  if (
    manifest.kind !== MANIFEST_KIND ||
    manifest.schemaVersion !== RELEASE_SCHEMA_VERSION
  ) {
    fail("Unsupported release manifest kind or schema version");
  }
  assertSha(manifest.baseSha, "release manifest baseSha");
  assertSha(manifest.headSha, "release manifest headSha");
  if (Number.isNaN(Date.parse(manifest.createdAt))) {
    fail("release manifest createdAt must be an ISO timestamp");
  }
  if (!/^[0-9a-f]{64}$/.test(manifest.planSha256)) {
    fail("release manifest planSha256 is invalid");
  }
  if (
    !Number.isInteger(manifest.workspaceCount) ||
    manifest.workspaceCount < 1
  ) {
    fail("release manifest workspaceCount must be a positive integer");
  }
  if (!Array.isArray(manifest.packages)) {
    fail("release manifest packages must be an array");
  }
  if (
    manifest.packageCount !== manifest.packages.length ||
    manifest.packageCount < 1
  ) {
    fail(
      "release manifest must contain at least one package and packageCount must match packages.length",
    );
  }
  const tarballNames = new Set();
  for (const [index, item] of manifest.packages.entries()) {
    assertObjectKeys(
      item,
      ["dependencies", "directory", "layer", "name", "tarball", "version"],
      `release manifest packages[${index}]`,
    );
    assertPackageName(item.name, `release manifest packages[${index}].name`);
    assertVersion(item.version, `${item.name} version`);
    safeRepositoryPath(
      item.directory,
      `${item.name} directory`,
      repositoryRoot,
    );
    if (!Array.isArray(item.dependencies)) {
      fail(`${item.name} dependencies must be an array`);
    }
    item.dependencies.forEach((dependency) => {
      assertPackageName(dependency, `${item.name} dependency`);
    });
    if (
      new Set(item.dependencies).size !== item.dependencies.length ||
      JSON.stringify(item.dependencies) !==
        JSON.stringify([...item.dependencies].sort())
    ) {
      fail(`${item.name} dependencies must be unique and sorted`);
    }
    if (!Number.isInteger(item.layer) || item.layer < 0) {
      fail(`${item.name} layer must be a non-negative integer`);
    }
    if (tarballNames.has(item.tarball?.file)) {
      fail(`Duplicate release tarball filename: ${item.tarball.file}`);
    }
    tarballNames.add(item.tarball?.file);
    validateTarball(item, manifestDirectory, inspectTarball);
  }
  const names = manifest.packages.map(({ name }) => name);
  if (
    new Set(names).size !== names.length ||
    JSON.stringify(names) !== JSON.stringify([...names].sort())
  ) {
    fail("release manifest packages must have unique, sorted names");
  }
  validateLayers(manifest.packages, manifest.layers, "release manifest");
  return manifest;
}

export {
  entrypointTargets,
  forbiddenPackedPath,
  localSpecifiers,
  MANIFEST_KIND,
  packageTarget,
  safeTarballFilename,
  validatePackedFiles,
  validateReleaseManifest,
  validateTarball,
  wildcardRegExp,
};
