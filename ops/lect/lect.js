#!/usr/bin/env node

import { runLect } from "./runLect.js";

try {
  const arguments_ = process.argv.slice(2);
  if (arguments_.some((argument) => argument !== "--check")) {
    throw new Error(`Unsupported argument(s): ${arguments_.join(", ")}`);
  }
  await runLect({ mode: arguments_.includes("--check") ? "check" : "write" });
} catch (error) {
  console.error(
    `lect: ${`\u001b[${31}m${"failure"}\u001b[${39}m`}: ${error.stack ?? error}`,
  );
  process.exitCode = 1;
}
