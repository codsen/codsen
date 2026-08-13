import path from "node:path";

function validateManifest(manifest, context) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new TypeError(`${context} must be an object`);
  }
  return manifest;
}

function validateWorkspacePatterns(patterns, context) {
  if (
    !Array.isArray(patterns) ||
    patterns.some((pattern) => typeof pattern !== "string")
  ) {
    throw new TypeError(`${context} must provide a string array`);
  }
  return patterns;
}

function workspacePatterns(manifest, context) {
  validateManifest(manifest, "root package.json");
  return validateWorkspacePatterns(
    Array.isArray(manifest.workspaces)
      ? manifest.workspaces
      : manifest.workspaces?.packages,
    context,
  );
}

function normaliseWorkspacePattern(
  original,
  context,
  { rejectTrailingSlash = false } = {},
) {
  if (rejectTrailingSlash && original.endsWith("/")) {
    throw new TypeError(
      `${context} pattern ${JSON.stringify(original)} must not end in a slash`,
    );
  }
  if (original.includes("\\") || original.startsWith("!")) {
    throw new TypeError(
      `${context} contains an unsafe workspace pattern: ${original}`,
    );
  }
  const pattern = original.replace(/^\.\//, "").replace(/\/+$/, "");
  if (!pattern || path.posix.isAbsolute(pattern)) {
    throw new TypeError(
      `${context} contains an unsafe workspace pattern: ${original}`,
    );
  }

  const normalised = path.posix.normalize(pattern);
  if (
    normalised !== pattern ||
    normalised === ".." ||
    normalised.startsWith("../")
  ) {
    throw new TypeError(
      `${context} contains an unsafe workspace pattern: ${original}`,
    );
  }
  if (
    (pattern.includes("*") &&
      (!pattern.endsWith("/*") || pattern.slice(0, -2).includes("*"))) ||
    /[?[\]{}()]/u.test(pattern)
  ) {
    throw new TypeError(
      `${context} uses an unsupported workspace pattern: ${original}`,
    );
  }
  return pattern;
}

function assertWorkspaceDirectoryParity(npmDirectories, lernaDirectories) {
  const npmOnly = npmDirectories.filter(
    (directory) => !lernaDirectories.includes(directory),
  );
  const lernaOnly = lernaDirectories.filter(
    (directory) => !npmDirectories.includes(directory),
  );
  if (npmOnly.length || lernaOnly.length) {
    throw new TypeError(
      `npm/Lerna workspace mismatch (npm-only: ${npmOnly.join(", ") || "none"}; Lerna-only: ${lernaOnly.join(", ") || "none"})`,
    );
  }
}

function validateWorkspaceRecords(records) {
  const names = new Map();
  for (const { directory, manifest } of records) {
    validateManifest(manifest, `${directory}/package.json`);
    if (typeof manifest.name !== "string" || !manifest.name.trim()) {
      throw new TypeError(`Workspace has no package name: ${directory}`);
    }
    if (names.has(manifest.name)) {
      throw new TypeError(
        `Duplicate workspace package name ${manifest.name} in ${names.get(manifest.name)} and ${directory}`,
      );
    }
    names.set(manifest.name, directory);
  }
  return [...records].sort((left, right) =>
    left.manifest.name.localeCompare(right.manifest.name),
  );
}

export {
  assertWorkspaceDirectoryParity,
  normaliseWorkspacePattern,
  validateManifest,
  validateWorkspacePatterns,
  validateWorkspaceRecords,
  workspacePatterns,
};
