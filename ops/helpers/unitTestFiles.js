import { readdirSync } from "node:fs";
import path from "node:path";

const supportedExtensions = new Set([
  ".cjs",
  ".cts",
  ".js",
  ".mjs",
  ".mts",
  ".ts",
]);

function listFiles(directory) {
  try {
    return readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name))
      .flatMap((entry) => {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          return listFiles(filename);
        }
        return entry.isFile() &&
          supportedExtensions.has(path.extname(entry.name))
          ? [filename]
          : [];
      });
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function listUnitTestFiles(repositoryRoot) {
  return [
    ...listFiles(path.join(repositoryRoot, "ops/helpers/tests")),
    ...readdirSync(path.join(repositoryRoot, "packages"), {
      withFileTypes: true,
    })
      .filter((entry) => entry.isDirectory())
      .sort((left, right) => left.name.localeCompare(right.name))
      .flatMap((entry) =>
        listFiles(path.join(repositoryRoot, "packages", entry.name, "test")),
      ),
  ];
}

function unitTestPackageName(relativeFilename) {
  return (
    relativeFilename.match(/^packages\/([^/]+)\/test\//u)?.[1] ??
    "<repository-helpers>"
  );
}

export { listUnitTestFiles, unitTestPackageName };
