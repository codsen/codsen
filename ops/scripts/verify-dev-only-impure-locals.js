import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { auditDevOnlyImpureLocals } from "../helpers/devOnlyImpureLocals.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const supportedExtensions = new Set([".cts", ".mts", ".ts", ".tsx"]);

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return entry.name === "tap" ? [] : listFiles(filename);
      }
      return entry.isFile() && supportedExtensions.has(path.extname(entry.name))
        ? [filename]
        : [];
    });
}

const packageSources = readdirSync(path.join(repositoryRoot, "packages"), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .sort((left, right) => left.name.localeCompare(right.name))
  .flatMap((entry) => {
    const directory = path.join(repositoryRoot, "packages", entry.name, "src");
    try {
      return listFiles(directory);
    } catch (error) {
      if (error?.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  });

let checkedCount = 0;
const problems = [];
for (const filename of packageSources) {
  const relativeFilename = path.relative(repositoryRoot, filename);
  const result = auditDevOnlyImpureLocals(
    readFileSync(filename, "utf8"),
    relativeFilename,
  );
  checkedCount += result.checkedCount;
  problems.push(
    ...result.problems.map((problem) => ({
      ...problem,
      filename: relativeFilename,
    })),
  );
}

if (problems.length) {
  console.error(
    `Development-only logging cost verification failed with ${problems.length} problem${problems.length === 1 ? "" : "s"}:\n${problems
      .map(
        ({ column, filename, line, message }) =>
          `- ${filename}:${line}:${column} ${message}`,
      )
      .join("\n")}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Development-only logging costs nothing in production: ${checkedCount} call-initialised locals across ${packageSources.length} TypeScript source files`,
  );
}
