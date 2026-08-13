#!/usr/bin/env node

import { runLect } from "./runLect.js";

try {
  await runLect();
} catch (error) {
  console.error(
    `lect: ${`\u001b[${31}m${"failure"}\u001b[${39}m`}: ${error.stack ?? error}`,
  );
  process.exitCode = 1;
}
