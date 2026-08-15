#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

import { createRequire } from "node:module";
import path from "node:path";
import { glob } from "codsen-glob";
import { codsenCLI } from "codsen-utils";
import updateNotifier from "update-notifier";
import { ProcessingError, processFiles } from "./process-files.js";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const colours = {
  green: 32,
  grey: 90,
  red: 31,
  white: 37,
  yellow: 33,
};

function colour(str, colourCode) {
  return `\u001b[${colourCode}m${str}\u001b[39m`;
}

const prefix = "✨ json-sort-cli: ";
const { log } = console;
const cli = codsenCLI(
  `
  Usage
    $ jsonsort YOURFILE.json
    $ sortjson YOURFILE.json
    $ sortjson templatesfolder1 templatesfolder2 package.json
  or, just type "jsonsort" and it will let you pick a file.

  Options
    -n, --nodemodules      Don't ignore any node_modules folders
    -t, --tabs             Use tabs for JSON file indentation
    -i, --indentationCount How many spaces/tabs to use (default: 2 for spaces or 1 for tabs)
    -s, --silent           Does not show the result per-file, only totals in the end
    -h, --help             Shows this help
    -v, --version          Shows the current version
    -a, --arrays           Also sort any arrays if they contain only string elements
    -d, --dry              Only list all the files about to be processed
    -p, --pack             Exclude all package.json files
    -c, --ci               Only exits with non-zero code if files COULD BE sorted
    -l, --lineEnding       Set to "cr", "crlf" or "lf" to override the default
                           (which is either EOL format used in the file, or Mac LF)

  Example
    Call anywhere using glob patterns. If you put them as string, this library
    will parse globs. If you put as system globs without quotes, your shell will expand them.
`,
  {
    pkg,
    flags: {
      nodemodules: {
        type: "boolean",
        shortFlag: "n",
        default: false,
      },
      tabs: {
        type: "boolean",
        shortFlag: "t",
        default: false,
      },
      silent: {
        type: "boolean",
        shortFlag: "s",
        default: false,
      },
      arrays: {
        type: "boolean",
        shortFlag: "a",
        default: false,
      },
      pack: {
        type: "boolean",
        shortFlag: "p",
        default: false,
      },
      dry: {
        type: "boolean",
        shortFlag: "d",
        default: false,
      },
      ci: {
        type: "boolean",
        shortFlag: "c",
        default: false,
      },
      help: {
        type: "boolean",
        shortFlag: "h",
        default: false,
      },
      version: {
        type: "boolean",
        shortFlag: "v",
        default: false,
      },
      indentationCount: {
        type: "number",
        shortFlag: "i",
      },
      lineEnding: {
        type: "string",
        shortFlag: "l",
      },
    },
  },
);
updateNotifier({ pkg }).notify();

const nonJsonFormats = ["yml", "toml", "yaml"]; // to save time
const badFiles = [
  ".DS_Store",
  "npm-debug.log",
  ".svn",
  "CVS",
  "config.gypi",
  ".lock-wscript",
  "package-lock.json",
  "npm-shrinkwrap.json",
];

// 1. set defaults:
let indentationCount = 2;
if (cli.flags.tabs) {
  indentationCount = 1;
}
// 2. overwrite defaults with explicitly set value:
if (cli.flags.indentationCount) {
  indentationCount = +cli.flags.indentationCount;
}

// Step #0. take care of the short -v and -h flags, which codsenCLI leaves
// to us (it answers the long --version and --help on its own).
// -----------------------------------------------------------------------------

if (cli.flags.version) {
  log(pkg.version);
  process.exit(0);
} else if (cli.flags.help) {
  log(cli.help);
  process.exit(0);
}

// Step #1. set up the cli
// -----------------------------------------------------------------------------

const { input } = cli;
if (Array.isArray(input) && !input.length) {
  input.push("**/*.json");
}

// Step #2. query the glob and follow the pipeline
// -----------------------------------------------------------------------------

glob(
  [
    ...input,
    "!**/package-lock.json",
    "!**/yarn.lock",
    ...(cli.flags.nodemodules ? [] : ["!**/node_modules/**"]),
    ...(cli.flags.pack ? ["!**/package.json"] : []),
  ],
  {
    dot: true,
    expandDirectories: { files: [".*", "*.json"] },
  },
)
  .then((paths) => {
    // flip out of the pipeline if there are no paths resolved
    if (paths.length === 0 && !cli.flags.silent) {
      log(
        `${colour(prefix, colours.grey)}${colour(
          "The inputs don't lead to any json files! Exiting.",
          colours.red,
        )}`,
      );
      process.exit(0);
    }
    return paths;
  })
  .then((paths) =>
    paths.filter(
      (oneOfPaths) =>
        !oneOfPaths.includes("package-lock.json") &&
        !oneOfPaths.includes("yarn.lock"),
    ),
  )
  .then((paths) =>
    !cli.flags.nodemodules
      ? paths.filter((oneOfPaths) => !oneOfPaths.includes("node_modules"))
      : paths,
  )
  .then((paths) =>
    cli.flags.pack
      ? paths.filter((oneOfPaths) => !oneOfPaths.includes("package.json"))
      : paths,
  )
  .then((paths) =>
    paths.filter((singlePath) => {
      return (
        path.extname(singlePath) === ".json" ||
        (typeof path.basename(singlePath) === "string" &&
          path.basename(singlePath).startsWith(".") &&
          !nonJsonFormats.some((badExtension) =>
            path.extname(singlePath).includes(badExtension),
          ) &&
          !badFiles.some((badFile) =>
            path.basename(singlePath).includes(badFile),
          ))
      );
    }),
  )

  .then((paths) => {
    if (cli.flags.dry && !cli.flags.silent) {
      log(
        `${colour(prefix, colours.grey)}${colour(
          "We'd try to sort the following files:",
          colours.yellow,
        )}\n${paths.join("\n")}`,
      );
      return;
    }

    const options = {
      arrays: cli.flags.arrays,
      ci: cli.flags.ci,
      indentationCount,
      lineEnding: cli.flags.lineEnding,
      pack: cli.flags.pack,
      tabs: cli.flags.tabs,
      onOutcome(outcome) {
        if (cli.flags.silent) {
          return;
        }
        if (outcome.status === "failure") {
          log(
            `${colour(prefix, colours.grey)}${outcome.path} - ${colour(
              "BAD",
              colours.red,
            )} (${outcome.stage}) - ${outcome.error}`,
          );
        } else if (!cli.flags.ci) {
          log(
            `${colour(prefix, colours.grey)}${outcome.path} - ${colour(
              "OK",
              colours.green,
            )}`,
          );
        }
      },
    };

    return processFiles(paths, options)
      .then(({ successful, unsorted }) => {
        if (cli.flags.silent) {
          if (cli.flags.ci && unsorted.length) {
            process.exitCode = 9;
          }
          return;
        }
        if (cli.flags.ci) {
          if (unsorted.length) {
            log(
              `${colour(prefix, colours.grey)}${colour(
                "Unsorted files:",
                colours.red,
              )}\n${unsorted.join("\n")}`,
            );
            process.exitCode = 9;
          } else {
            log(
              `${colour(prefix, colours.grey)}${colour(
                "All files were already sorted:",
                colours.white,
              )}\n${successful.join("\n")}`,
            );
          }
          return;
        }
        log(
          `\n${colour(prefix, colours.grey)}${colour(
            `All ${successful.length} file${
              successful.length === 1 ? "" : "s"
            } sorted`,
            colours.green,
          )}`,
        );
      })
      .catch((error) => {
        if (!(error instanceof ProcessingError)) {
          throw error;
        }
        if (!cli.flags.silent) {
          if (cli.flags.ci) {
            const unsorted = new Set(error.unsorted);
            const alreadySorted = error.successful.filter(
              (filePath) => !unsorted.has(filePath),
            );
            if (alreadySorted.length) {
              log(
                `${colour(prefix, colours.grey)}${colour(
                  `${alreadySorted.length} file${
                    alreadySorted.length === 1 ? "" : "s"
                  } already sorted:`,
                  colours.green,
                )}\n${alreadySorted.join("\n")}`,
              );
            }
            if (error.unsorted.length) {
              log(
                `${colour(prefix, colours.grey)}${colour(
                  "Unsorted files:",
                  colours.red,
                )}\n${error.unsorted.join("\n")}`,
              );
            }
          } else if (error.successful.length) {
            log(
              `\n${colour(prefix, colours.grey)}${colour(
                `${error.successful.length} file${
                  error.successful.length === 1 ? "" : "s"
                } sorted`,
                colours.green,
              )}`,
            );
          }
          log(
            `${colour(prefix, colours.grey)}${colour(
              `${error.failures.length} file${
                error.failures.length === 1 ? "" : "s"
              } could not be ${cli.flags.ci ? "checked" : "sorted"}`,
              colours.red,
            )} ${colour(
              ` - ${error.failures
                .map(({ path: failedPath }) => failedPath)
                .join(" - ")}`,
              colours.grey,
            )}`,
          );
        }
        process.exitCode = 1;
      });
  })
  .catch((err) => {
    if (!cli.flags.silent) {
      log(
        `${colour(prefix, colours.grey)}${colour("Oops!", colours.red)} ${err}`,
      );
    }
    process.exitCode = 1;
  });
