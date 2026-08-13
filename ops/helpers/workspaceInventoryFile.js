import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  assertWorkspaceDirectoryParity,
  normaliseWorkspacePattern,
  validateManifest,
  validateWorkspacePatterns,
  validateWorkspaceRecords,
  workspacePatterns,
} from "./workspaceInventory.js";

function readJson(filename, context) {
  let source;
  try {
    source = readFileSync(filename, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new TypeError(`${context} does not exist`);
    }
    throw error;
  }
  try {
    return JSON.parse(source);
  } catch (error) {
    throw new TypeError(`${context} is not valid JSON: ${error.message}`);
  }
}

function workspacePath(repositoryRoot, relative, context) {
  const absolute = path.resolve(repositoryRoot, ...relative.split("/"));
  if (!absolute.startsWith(`${path.resolve(repositoryRoot)}${path.sep}`)) {
    throw new TypeError(`${context} escapes the repository: ${relative}`);
  }
  return absolute;
}

function expandWorkspacePatterns(
  repositoryRoot,
  patterns,
  context,
  options = {},
) {
  const directories = new Set();
  for (const original of validateWorkspacePatterns(patterns, context)) {
    const pattern = normaliseWorkspacePattern(original, context, options);
    if (pattern.endsWith("/*")) {
      const parentRelative = pattern.slice(0, -2);
      const parent = workspacePath(
        repositoryRoot,
        parentRelative,
        `${context} pattern`,
      );
      if (!existsSync(parent)) {
        continue;
      }
      for (const entry of readdirSync(parent, { withFileTypes: true }).sort(
        (left, right) => left.name.localeCompare(right.name),
      )) {
        if (
          entry.isDirectory() &&
          existsSync(path.join(parent, entry.name, "package.json"))
        ) {
          directories.add(`${parentRelative}/${entry.name}`);
        }
      }
      continue;
    }

    const absolute = workspacePath(
      repositoryRoot,
      pattern,
      `${context} pattern`,
    );
    if (existsSync(path.join(absolute, "package.json"))) {
      directories.add(pattern);
    }
  }
  return [...directories].sort();
}

function readWorkspaceRecords(repositoryRoot) {
  const rootManifest = readJson(
    path.join(repositoryRoot, "package.json"),
    "root package.json",
  );
  const npmDirectories = expandWorkspacePatterns(
    repositoryRoot,
    workspacePatterns(rootManifest, "root package.json workspaces"),
    "root package.json workspaces",
  );
  const lerna = readJson(path.join(repositoryRoot, "lerna.json"), "lerna.json");
  validateManifest(lerna, "lerna.json");
  const lernaDirectories = expandWorkspacePatterns(
    repositoryRoot,
    validateWorkspacePatterns(lerna.packages, "lerna.json packages"),
    "lerna.json packages",
    { rejectTrailingSlash: true },
  );
  assertWorkspaceDirectoryParity(npmDirectories, lernaDirectories);

  return validateWorkspaceRecords(
    npmDirectories.map((directory) => ({
      directory,
      manifest: readJson(
        path.join(repositoryRoot, directory, "package.json"),
        `${directory}/package.json`,
      ),
    })),
  );
}

export { expandWorkspacePatterns, readWorkspaceRecords };
