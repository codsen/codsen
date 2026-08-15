#!/usr/bin/env node

import { createRequire } from "node:module";
import { arrayiffy } from "arrayiffy-if-string";
import { glob } from "codsen-glob";
import { codsenCLI } from "codsen-utils";
import updateNotifier from "update-notifier";
import { ProcessingError, processFiles } from "./process-files.js";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

function existy(x) {
  return x != null;
}
const { log } = console;
const messagePrefix = `\u001b[${90}m${"✨ js-row-num-cli: "}\u001b[${39}m`;

const locationsArr = [
  "./src/*.js",
  "./test/*.js",
  "./main.js",
  "./cli.js",
  "./index.js",
  "!**/node_modules/**",
];

const cli = codsenCLI(
  `
  Call either way:
    $ jsrownum
    $ jrn
    $ jrn -t "log"
  for example, above, "log" would update "1" in: log(\`1 a = \${a}\`)

  Options:
    --pad, -p      Let's you set the padding of the row numbers. Default = 3.
    --trigger, -t  Let's you customise the functions where row numbers are updated

    --help, -h     Shows help
    --version, -v  Shows the current version

  Example:
    jrn -p 2 "*.js"
    jrn --pad="2"
    jrn --trigger "log"
    jsrownum -h
    jsrownum --version
`,
  {
    pkg,
    flags: {
      pad: {
        type: "number",
        shortFlag: "p",
      },
      trigger: {
        type: "string",
        shortFlag: "t",
      },
    },
  },
);
updateNotifier({ pkg }).notify();

function processPaths(paths) {
  let transformOptions = {
    padStart: existy(cli.flags.pad) ? cli.flags.pad : 3,
  };
  if (cli.flags.trigger) {
    transformOptions.triggerKeywords = arrayiffy(cli.flags.trigger);
  }

  return glob([...paths, "!**/node_modules/**"])
    .then((res) =>
      res.filter((oneOfPaths) => !oneOfPaths.includes("node_modules")),
    )
    .then((received) =>
      processFiles(received, { messagePrefix, transformOptions }),
    );
}

// Step #0. take care of the short -v and -h flags, which codsenCLI leaves
// to us (it answers the long --version and --help on its own).
// -----------------------------------------------------------------------------

if (cli.flags.v) {
  log(pkg.version);
  process.exit(0);
} else if (cli.flags.h) {
  log(cli.help);
  process.exit(0);
}

// Step #1. were any paths given or not?
// -----------------------------------------------------------------------------

if (cli.input.length) {
  processPaths(cli.input).catch(handleFailure);
} else {
  processPaths(locationsArr).catch(handleFailure);
}

function handleFailure(error) {
  if (!(error instanceof ProcessingError)) {
    log(
      `${messagePrefix}${`\u001b[${31}mCould not process the requested files\u001b[${39}m`} - ${error}`,
    );
  }
  process.exitCode = 1;
}
