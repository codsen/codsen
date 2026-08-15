#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { auditUnitTestNumbering } from "../helpers/unitTestNumbering.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const supportedExtensions = new Set([
  ".cjs",
  ".cts",
  ".js",
  ".mjs",
  ".mts",
  ".ts",
]);

function listTestFiles(directory) {
  try {
    return readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name))
      .flatMap((entry) => {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          return listTestFiles(filename);
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

const testFiles = [
  ...listTestFiles(path.join(repositoryRoot, "ops/helpers/tests")),
  ...readdirSync(path.join(repositoryRoot, "packages"), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) =>
      listTestFiles(path.join(repositoryRoot, "packages", entry.name, "test")),
    ),
];

const records = testFiles.map((filename) => {
  const relativeFilename = path.relative(repositoryRoot, filename);
  const source = readFileSync(filename, "utf8");
  const packageMatch = relativeFilename.match(/^packages\/([^/]+)\/test\//u);
  return {
    filename,
    packageName: packageMatch?.[1] ?? "<repository-helpers>",
    relativeFilename,
    source,
    initial: auditUnitTestNumbering(source, relativeFilename),
  };
});
const threeDigitPackages = new Set(
  records
    .filter(({ initial }) => initial.usesThreeDigitTitles)
    .map(({ packageName }) => packageName),
);

let equalCount = 0;
let testCount = 0;
const problems = [];
for (const record of records) {
  const result = threeDigitPackages.has(record.packageName)
    ? auditUnitTestNumbering(record.source, record.relativeFilename, {
        requiredWidth: 3,
      })
    : record.initial;
  equalCount += result.equalCount;
  testCount += result.testCount;
  problems.push(
    ...result.problems.map((problem) => ({
      ...problem,
      filename: record.relativeFilename,
    })),
  );
}

if (problems.length) {
  console.error(
    `Unit-test numbering verification failed with ${problems.length} problem${problems.length === 1 ? "" : "s"}:\n${problems
      .map(
        ({ column, filename, line, message }) =>
          `- ${filename}:${line}:${column} ${message}`,
      )
      .join("\n")}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Unit-test numbering OK: ${testCount} tests and ${equalCount} equal() assertions across ${testFiles.length} files`,
  );
}
