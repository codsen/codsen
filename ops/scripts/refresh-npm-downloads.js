#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";

import { createNpmDownloadsClient } from "../helpers/npmDownloadsClient.js";
import { refreshNpmDownloads } from "../helpers/npmDownloadsRefresh.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const arguments_ = process.argv.slice(2);
if (arguments_.includes("--help")) {
  console.log(
    "Usage: npm run stats:refresh -- [--full]\nRefresh npm download history, rechecking at least 60 recent days and flagged dates.\n--full rechecks the entire history. No commits, pushes, or package builds.",
  );
} else {
  try {
    if (
      arguments_.some((argument) => argument !== "--full") ||
      arguments_.length > 1
    ) {
      throw new Error("Usage: npm run stats:refresh -- [--full]");
    }
    const report = await refreshNpmDownloads({
      repositoryRoot: root,
      full: arguments_.includes("--full"),
      client: createNpmDownloadsClient({
        onRetry: ({ attempt, delayMs, error }) =>
          console.warn(`Retry ${attempt} in ${delayMs}ms: ${error.message}`),
      }),
      onProgress: console.log,
    });
    console.log(
      `${report.changed ? "Updated" : "Unchanged"}: ${report.addedDays.toLocaleString("en-US")} added days, ${report.correctedDays.toLocaleString("en-US")} corrected days; data through ${report.through}.`,
    );
    console.log(
      `${report.unavailable.length} unavailable packages; ${report.anomalies.length} suspected shared-zero dates; ${report.retiredPackages} retired histories retained. Review .cache/npm-downloads/last-refresh.json.`,
    );
  } catch (error) {
    console.error(`npm download refresh failed: ${error.message}`);
    console.error(
      "Validated requests are retained in .cache/npm-downloads for a retry; inspect the last good archive with npm run stats:check.",
    );
    process.exitCode = 1;
  }
}
