#!/usr/bin/env node

import { createRequire } from "node:module";
import { codsenCLI } from "codsen-utils";
import updateNotifier from "update-notifier";

const { log } = console;

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const cli = codsenCLI(
  `
  Usage
    $ codsen

  Options
    -h, --help        Shows this help
    -v, --version     Shows the version of your ${pkg.name}
`,
  {
    pkg,
    flags: {},
  },
);
updateNotifier({ pkg }).notify();

// FUNCTIONS
// -----------------------------------------------------------------------------

// Step #0. take care of the short -v and -h flags, which codsenCLI leaves
// to us (it answers the long --version and --help on its own).

if (cli.flags.v) {
  log(pkg.version);
  process.exit(0);
} else if (cli.flags.h) {
  log(cli.help);
  process.exit(0);
}

console.log("C O D S E N");
