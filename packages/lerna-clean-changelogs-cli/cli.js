#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

import { createRequire } from "node:module";
import { codsenCLI } from "codsen-utils";
import { notifyOfCliUpdate } from "./cli-update-notifier.js";
import { discoverFiles } from "./discover-files.js";
import { ProcessingError, processFiles } from "./process-files.js";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const start = Date.now();
const { log } = console;
const isArr = Array.isArray;
const colours = {
  green: 32,
  grey: 90,
  red: 31,
};

function colour(str, colourCode) {
  return `\u001b[${colourCode}m${str}\u001b[39m`;
}

const cli = codsenCLI(
  `
  Usage
    $ lcc
    $ lcc changelog.md
    $ lcc "packages/**/changelog.md"
    $ lernacleanchangelog
    $ lernacleanchangelog "test*/changelog.md"
    $ lernacleanchangelog "**"

  Options
    -h, --help          Shows this help
    -v, --version       Shows the current version
    -e, --extras        Extra cleaning (h1, diffs etc.)
`,
  {
    pkg,
    flags: {
      extras: { type: "boolean", shortFlag: "e" },
      help: { type: "boolean", shortFlag: "h" },
      version: { type: "boolean", shortFlag: "v" },
    },
  },
);
const signature = colour("✨ lerna-clean-changelogs-cli: ", colours.grey);

// Step #0. honour help/version even when another argument is also present.
// codsenCLI handles either flag automatically when it is the sole argument.
// -----------------------------------------------------------------------------

if (cli.flags.version) {
  log(pkg.version);
  process.exit(0);
} else if (cli.flags.help) {
  log(cli.help);
  process.exit(0);
}

notifyOfCliUpdate({ pkg });

// -----------------------------------------------------------------------------

// ASYNCHRONOUS PART:
discoverFiles(cli.input)
  .then((received) => {
    if (!isArr(received) || !received.length) {
      // spinner.warn("no changelogs found");
      log(`${signature}${colour("no changelogs found", colours.red)}`);
      process.exit(0);
    }
    return processFiles(received, {
      signature,
      startedAt: start,
      transformOptions: { extras: cli.flags.extras === true },
    });
  })
  .catch((error) => {
    if (!(error instanceof ProcessingError)) {
      log(
        `${signature}${colour("Could not process the requested changelogs", colours.red)} - ${error}`,
      );
    }
    process.exitCode = 1;
  });
