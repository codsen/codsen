#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  listUnitTestFiles,
  unitTestPackageName,
} from "../helpers/unitTestFiles.js";
import { fixUnitTestNumbering } from "../helpers/unitTestNumbering.js";
import { writeFileAtomically } from "../helpers/writeFileAtomically.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const records = listUnitTestFiles(repositoryRoot).map((filename) => {
  const relativeFilename = path.relative(repositoryRoot, filename);
  const source = readFileSync(filename, "utf8");
  return {
    filename,
    packageName: unitTestPackageName(relativeFilename),
    preview: fixUnitTestNumbering(source, relativeFilename),
    relativeFilename,
    source,
  };
});
const threeDigitPackages = new Set(
  records
    .filter(({ preview }) => preview.requiredWidth === 3)
    .map(({ packageName }) => packageName),
);

let changedFileCount = 0;
let equalCount = 0;
let testCount = 0;
const problems = [];
for (const record of records) {
  const result = fixUnitTestNumbering(record.source, record.relativeFilename, {
    requiredWidth: threeDigitPackages.has(record.packageName) ? 3 : 2,
  });
  equalCount += result.equalCount;
  testCount += result.testCount;
  problems.push(
    ...result.problems.map((problem) => ({
      ...problem,
      filename: record.relativeFilename,
    })),
  );
  if (result.changed) {
    await writeFileAtomically(record.filename, result.source);
    changedFileCount += 1;
  }
}

if (problems.length) {
  console.error(
    `Unit-test numbering fix left ${problems.length} problem${problems.length === 1 ? "" : "s"}:\n${problems
      .map(
        ({ column, filename, line, message }) =>
          `- ${filename}:${line}:${column} ${message}`,
      )
      .join("\n")}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Unit-test numbering fixed ${changedFileCount} file${changedFileCount === 1 ? "" : "s"}: ${testCount} tests and ${equalCount} equal() assertions checked across ${records.length} files`,
  );
}
