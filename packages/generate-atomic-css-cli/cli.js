#!/usr/bin/env node

/* eslint no-console:0 */

import { createRequire } from "node:module";
import { glob } from "codsen-glob";
import { codsenCLI } from "codsen-utils";
import { version } from "generate-atomic-css";
import updateNotifier from "update-notifier";
import { ProcessingError, processFiles } from "./process-files.js";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");
const { log } = console;
const messagePrefix = `\u001b[${90}m${"✨ generate-atomic-css-cli: "}\u001b[${39}m`;

const cli = codsenCLI(
  `
  Call either way:
    $ gac index.html
    $ gac "scss/*.html"
    $ gac "util/*/*.*"

  Options:
    --help, -h     Shows help
    --version, -v  Shows the current version

  Example:
    gac "*.html"
    gac -h
    gac --version
`,
  {
    pkg,
  },
);
updateNotifier({ pkg }).notify();

async function processPaths(incomingPaths) {
  return glob([...incomingPaths, "!**/node_modules/**"])
    .then((res) =>
      res.filter((oneOfPaths) => !oneOfPaths.includes("node_modules")),
    )
    .then((received) => processFiles(received, { messagePrefix }));
}

// Step #0. take care of the short -v and -h flags, which codsenCLI leaves
// to us (it answers the long --version and --help on its own).
// -----------------------------------------------------------------------------

if (cli.flags.v) {
  log(`cli: ${pkg.version}; api: ${version}`);
  process.exit(0);
} else if (cli.flags.h) {
  log(cli.help);
  process.exit(0);
}

// Step #1. were any paths given or not?
// -----------------------------------------------------------------------------

if (cli.input.length) {
  processPaths(cli.input).catch((error) => {
    if (!(error instanceof ProcessingError)) {
      log(
        `${messagePrefix}${`\u001b[${31}mCould not process the requested files\u001b[${39}m`} - ${error}`,
      );
    }
    process.exitCode = 1;
  });
}
