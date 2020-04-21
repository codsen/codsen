#!/usr/bin/env node

const meow = require("meow");
const updateNotifier = require("update-notifier");
const processPaths = require("./util/processPaths");

const cli = meow(
  `
  Call either way:
    $ emlint
    $ el
    $ el "file.html"

  Options:
    --help, -h     Shows help
    --version, -v  Shows the current version
`,
  {
    flags: {
      pad: {
        type: "number",
        alias: "p",
      },
    },
  }
);
updateNotifier({ pkg: cli.pkg }).notify();

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (cli.flags.v) {
  console.log(cli.pkg.version);
  process.exit(0);
} else if (cli.flags.h) {
  console.log(cli.help);
  process.exit(0);
}

// Step #1. were any paths given or not?
// -----------------------------------------------------------------------------

console.log(
  `044 FIY, ${`\u001b[${33}m${`cli.input`}\u001b[${39}m`} = ${JSON.stringify(
    cli.input,
    null,
    4
  )}`
);

processPaths(
  Array.isArray(cli.input) && cli.input.length
    ? cli.input
    : ["./**/*.html", "./**/*.htm"]
);
