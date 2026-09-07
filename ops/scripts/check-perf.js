#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readPerfPolicy } from "../helpers/perfPolicy.js";
import { checkRecordedPerf } from "../helpers/recordedPerf.js";
import { parseHistorical } from "./historicalJson.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
if (process.argv.length > 2) {
  throw new Error(
    "npm run perf:check takes no arguments; it checks the latest recorded measurements without rerunning benchmarks",
  );
}
const policy = readPerfPolicy();
let checked = 0;
let failures = 0;
let slowdowns = 0;
for (const entry of readdirSync(path.join(root, "packages"), {
  withFileTypes: true,
}).sort((a, b) => a.name.localeCompare(b.name))) {
  const directory = path.join(root, "packages", entry.name);
  if (
    !entry.isDirectory() ||
    !existsSync(path.join(directory, "perf/check.js"))
  )
    continue;
  checked += 1;
  try {
    const { name } = JSON.parse(
      readFileSync(path.join(directory, "package.json"), "utf8"),
    );
    const result = checkRecordedPerf(
      parseHistorical(
        readFileSync(path.join(directory, "perf/historical.json"), "utf8"),
      ),
      policy,
      name,
    );
    if (result.failed) failures += 1;
    if (result.verdict === "slower" || result.verdict === "regression") {
      slowdowns += 1;
      console.log(
        `${result.failed ? "FAIL" : "WARN"} ${name}: ${result.changePercent}% (${result.score} against ${result.baseline})${result.waiverReason ? `; ${result.waiverReason}` : ""}`,
      );
    } else if (result.failed) {
      console.error(`FAIL ${name}: no measurement; run npm run perf first`);
    }
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${entry.name}: ${error.message}`);
  }
}
if (!checked) throw new Error("No package benchmark histories were found");
console.log(
  `Checked ${checked} recorded measurements: ${slowdowns} slowdowns, ${failures} strict-check failures. Histories were not changed.`,
);
if (failures) process.exitCode = 1;
