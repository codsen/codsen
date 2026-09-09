#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";

import { readNpmDownloadsSnapshot } from "../helpers/npmDownloadsFile.js";
import { readNpmDownloadsRoster } from "../helpers/npmDownloadsRoster.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
try {
  if (process.argv.length > 2) throw new Error("Usage: npm run stats:check");
  const { manifest, retired } = await readNpmDownloadsSnapshot(
    path.join(root, "statistics/npm-downloads"),
  );
  const expected = readNpmDownloadsRoster(root, manifest.packages);
  const missing = Object.keys(expected).filter(
    (name) => !Object.hasOwn(manifest.packages, name),
  );
  const unexpected = Object.keys(manifest.packages).filter(
    (name) => !Object.hasOwn(expected, name),
  );
  if (missing.length || unexpected.length) {
    throw new Error(
      `Primary package inventory differs from the canonical Codsen catalogue (missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"}). Run npm run ci:generate:info and npm run stats:refresh after updating catalogue policy.`,
    );
  }
  for (const [name, entry] of Object.entries(expected)) {
    if (
      manifest.packages[name].status !== entry.status ||
      manifest.packages[name].includedInPortfolio !== entry.includedInPortfolio
    ) {
      throw new Error(
        `Primary package membership differs from the canonical catalogue for ${name}. Run npm run stats:refresh.`,
      );
    }
  }
  const packages = Object.values(manifest.packages);
  const days = packages.reduce((sum, entry) => sum + entry.coverage.days, 0);
  console.log(
    `Verified ${packages.length} current packages and ${days.toLocaleString("en-US")} daily observations through ${manifest.through}.`,
  );
  console.log(
    `${packages.filter((entry) => entry.availability === "unavailable").length} unavailable packages; ${manifest.anomalies.length} suspected shared-zero dates remain explicitly recorded.`,
  );
  const retiredPackages = Object.values(retired?.manifest.packages ?? {});
  const retiredDays = retiredPackages.reduce(
    (sum, entry) => sum + entry.coverage.days,
    0,
  );
  console.log(
    `Verified ${retiredPackages.length} retained retired packages and ${retiredDays.toLocaleString("en-US")} daily observations${retired ? ` through ${retired.manifest.through}` : ""}; excluded from current charts and refresh requests.`,
  );
} catch (error) {
  console.error(`npm download archive verification failed: ${error.message}`);
  process.exitCode = 1;
}
