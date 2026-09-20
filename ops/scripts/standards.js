#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";
import { writeGeneratedFile } from "../helpers/generatedFiles.js";
import { formatGeneratedContents } from "../helpers/generatedFormatting.js";
import {
  auditStandardsCatalogue,
  extractStandardsSections,
  sha256,
  standardsFixture,
  standardsTestCases,
  validateStandardsSources,
  validateStandardsTargets,
  verifySourceSnapshot,
} from "../helpers/standards.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const directory = path.join(root, "ops/standards");
const [command = "check", ...extra] = process.argv.slice(2);
if (
  extra.length ||
  !["check", "project", "report", "refresh", "known-failures"].includes(command)
) {
  throw new Error(
    "Usage: node ops/scripts/standards.js [check|project|report|refresh|known-failures]",
  );
}

function localPath(base, relative) {
  if (
    typeof relative !== "string" ||
    path.isAbsolute(relative) ||
    relative.split(/[\\/]/u).includes("..")
  ) {
    throw new Error(`Unsafe catalogue path: ${relative}`);
  }
  return path.join(base, relative);
}

function readJson(filename) {
  return JSON.parse(readFileSync(filename, "utf8"));
}

function readCatalogue(name, key) {
  const value = readJson(path.join(directory, `${name}.json`));
  if (value.schemaVersion !== 1 || !Array.isArray(value[key])) {
    throw new Error(`Unsupported standards catalogue: ${name}`);
  }
  return value[key];
}

const sources = readCatalogue("sources", "sources");
validateStandardsSources(sources);
const requirements = readCatalogue("requirements", "requirements");
const targets = readCatalogue("targets", "targets");
validateStandardsTargets(targets);
for (const target of targets) {
  if (
    readJson(path.join(root, "packages", target.package, "package.json"))
      .name !== target.package
  )
    throw new Error(`Target is not a workspace: ${target.package}`);
}
const cases = readCatalogue("cases/pilot", "cases");
const coverage = readCatalogue("coverage", "coverage");

async function saveJson(name, value, mode = "write") {
  const filename = path.join(directory, `${name}.json`);
  return writeGeneratedFile({
    filename,
    contents: formatGeneratedContents({
      filename,
      repositoryRoot: root,
      contents: `${JSON.stringify(value, null, 2)}\n`,
    }),
    mode,
    fixCommand: "npm run standards:refresh",
  });
}

async function download(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok)
    throw new Error(`Could not fetch ${url}: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

// Refresh is the only network operation. Validate all downloads and anchors
// before writing; ordinary check/project/report commands never fetch anything.
if (command === "refresh") {
  const downloads = [];
  const licenses = new Map();
  const today = new Date().toISOString().slice(0, 10);
  for (const source of sources) {
    const bytes = await download(source.url);
    extractStandardsSections(bytes.toString("utf8"), source.anchors);
    if (!licenses.has(source.license.url))
      licenses.set(source.license.url, await download(source.license.url));
    const license = licenses.get(source.license.url);
    const archive = gzipSync(bytes, { level: 9 });
    if (
      source.sha256 !== sha256(bytes) ||
      source.license.sha256 !== sha256(license)
    )
      source.retrieved = today;
    Object.assign(source, {
      sha256: sha256(bytes),
      archiveSha256: sha256(archive),
    });
    source.license.sha256 = sha256(license);
    downloads.push({ source, archive, license });
  }
  for (const { source, archive, license } of downloads) {
    await writeFile(localPath(directory, source.snapshot), archive);
    await writeFile(localPath(directory, source.license.path), license);
  }
  await saveJson("sources", { schemaVersion: 1, sources });
}

const extracts = [];
for (const source of sources) {
  const html = verifySourceSnapshot(
    source,
    readFileSync(localPath(directory, source.snapshot)),
    readFileSync(localPath(directory, source.license.path)),
  );
  extracts.push({
    source: source.id,
    sha256: source.sha256,
    sections: extractStandardsSections(html, source.anchors),
  });
}
await saveJson(
  "extracts",
  {
    schemaVersion: 1,
    notice:
      "Abridged machine extracts. Examples preserve text content; definitions normalize whitespace. Unchanged archived documents and their notices remain authoritative.",
    extracts,
  },
  command === "refresh" || command === "project" ? "write" : "check",
);

const projected = standardsFixture(cases);
const tests = new Map();
const failures = new Map();
for (const target of targets) {
  const packageDirectory = path.join(root, "packages", target.package);
  const fixture = localPath(packageDirectory, target.fixture);
  if (command === "project")
    await mkdir(path.dirname(fixture), { recursive: true });
  await writeGeneratedFile({
    filename: fixture,
    contents: projected,
    mode: command === "project" ? "write" : "check",
    fixCommand: "npm run standards:project",
  });
  const testFile = localPath(packageDirectory, target.tests);
  tests.set(
    target.package,
    standardsTestCases(readFileSync(testFile, "utf8"), testFile),
  );
  const knownFailures = localPath(packageDirectory, target.knownFailures);
  if (existsSync(knownFailures))
    failures.set(target.package, readJson(knownFailures));
}
const report = auditStandardsCatalogue({
  sources,
  requirements,
  targets,
  cases,
  coverage,
  tests,
  failures,
});
console.log(
  `Standards catalogue: ${sources.length} pinned sources, ${report.pilotRequirements} pilot requirements, ${report.backlogRequirements} backlog areas, ${report.cases} inputs, ${report.targets} libraries.`,
);
console.log(
  `Dispositions: ${report.covered} covered by package assertions, ${report["known-failure"]} known failures, ${report.deferred} deferred, ${report["not-applicable"]} not applicable. Run package units to establish pass/fail.`,
);
for (const record of coverage.filter(({ status }) => status !== "covered")) {
  console.log(
    `${record.status}: ${record.target}/${record.caseId} (${record.profile}) — ${record.reason}`,
  );
}
if (command === "report") {
  for (const target of targets) {
    console.log(
      `${target.package}: ${coverage.filter((record) => record.target === target.package && record.status === "covered").length}/${cases.length} cases have assertions in ${target.tests}`,
    );
  }
  for (const item of requirements.filter(({ state }) => state === "backlog"))
    console.log(`Backlog ${item.id}: ${item.reason}`);
}
if (command === "known-failures") {
  let unresolved = 0;
  let resolved = 0;
  for (const target of targets) {
    const entries = failures.get(target.package) ?? [];
    if (!entries.length) continue;
    const manifest = readJson(
      path.join(root, "packages", target.package, "package.json"),
    );
    const exported = await import(
      pathToFileURL(
        localPath(
          path.join(root, "packages", target.package),
          manifest.exports.default,
        ),
      )
    );
    for (const entry of entries) {
      const input = cases.find(({ id }) => id === entry.caseId).input;
      const options = target.profiles.find(
        ({ id }) => id === entry.profile,
      ).options;
      let actual;
      try {
        actual = exported[target.entrypoint](input, options).result;
      } catch (error) {
        unresolved += 1;
        console.error(
          `FAIL: ${target.package}/${entry.caseId} threw ${error instanceof Error ? error.message : String(error)}\nExpected: ${JSON.stringify(entry.expectedResult)}`,
        );
        continue;
      }
      if (actual === entry.expectedResult) {
        resolved += 1;
        console.log(
          `RESOLVED: ${target.package}/${entry.caseId}; promote its expectation into the package unit suite.`,
        );
      } else {
        unresolved += 1;
        console.error(
          `FAIL: ${target.package}/${entry.caseId}\nExpected: ${JSON.stringify(entry.expectedResult)}\nActual:   ${JSON.stringify(actual)}`,
        );
      }
    }
  }
  console.log(
    `Known-failure probe: ${unresolved} unresolved; ${resolved} ready for promotion.`,
  );
  if (unresolved || resolved) process.exitCode = 1;
}
