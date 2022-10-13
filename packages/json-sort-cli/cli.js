#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

import meow from "meow";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import isDirectory from "is-d";
import pReduce from "p-reduce";
import pFilter from "p-filter";
import { globby } from "globby";
import { createRequire } from "module";
import isObj from "lodash.isplainobject";
import updateNotifier from "update-notifier";
import { traverse } from "ast-monkey-traverse";
import sortPackageJson, { sortOrder } from "sort-package-json";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

function isStr(something) {
  return typeof something === "string";
}
function format(obj) {
  if (typeof obj !== "object") {
    return obj;
  }
  let newSortOrder = sortOrder
    // 1. delete tap and lect fields
    .filter((field) => !["lect", "tap"].includes(field));

  // 2. then, insert both after resolutions, first tap then lect
  let idxOfResolutions = newSortOrder.indexOf("resolutions");
  // console.log(idxOfResolutions);
  // => 63

  newSortOrder.splice(idxOfResolutions, 0, "tap", "lect");

  // use custom array for sorting order:
  return sortPackageJson(obj, {
    sortOrder: newSortOrder,
  });
}
function sortObj(obj) {
  let res = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      res[key] = obj[key];
    });
  return res;
}

const prefix = "✨ json-sort-cli: ";
const { log } = console;
const cli = meow(
  `
  Usage
    $ jsonsort YOURFILE.json
    $ sortjson YOURFILE.json
    $ sortjson templatesfolder1 templatesfolder2 package.json
  or, just type "jsonsort" and it will let you pick a file.

  Options
    -n, --nodemodules      Don't ignore any node_modules folders
    -t, --tabs             Use tabs for JSON file indentation
    -i, --indentationCount How many spaces or tabs to use (default = 2 spaces or 1 tab)
    -s, --silent           Does not show the result per-file, only totals in the end
    -h, --help             Shows this help
    -v, --version          Shows the current version
    -a, --arrays           Also sort any arrays if they contain only string elements
    -d, --dry              Only list all the files about to be processed
    -p, --pack             Exclude all package.json files
    -c, --ci               Only exits with non-zero code if files COULD BE sorted

  Example
    Call anywhere using glob patterns. If you put them as string, this library
    will parse globs. If you put as system globs without quotes, your shell will expand them.
`,
  {
    importMeta: import.meta,
    flags: {
      nodemodules: {
        type: "boolean",
        alias: "n",
        default: false,
      },
      tabs: {
        type: "boolean",
        alias: "t",
        default: false,
      },
      silent: {
        type: "boolean",
        alias: "s",
        default: false,
      },
      arrays: {
        type: "boolean",
        alias: "a",
        default: false,
      },
      pack: {
        type: "boolean",
        alias: "p",
        default: false,
      },
      dry: {
        type: "boolean",
        alias: "d",
        default: false,
      },
      ci: {
        type: "boolean",
        alias: "c",
        default: false,
      },
      help: {
        type: "boolean",
        alias: "h",
        default: false,
      },
      version: {
        type: "boolean",
        alias: "v",
        default: false,
      },
      indentationCount: {
        type: "number",
        alias: "i",
      },
    },
  }
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

// FUNCTIONS
// -----------------------------------------------------------------------------

function readSortAndWriteOverFile(oneOfPaths) {
  return fs
    .readFile(oneOfPaths, "utf8")
    .then((filesContent) => {
      let parsedJson;
      try {
        // try to parse JSON
        parsedJson = JSON.parse(filesContent);
      } catch (err) {
        // if it is not parseable, stop
        if (!cli.flags.silent) {
          log(`${chalk.grey(prefix)}${oneOfPaths} - ${chalk.red(err)}`);
        }
        return Promise.resolve(null);
      }
      let result;

      if (isObj(parsedJson)) {
        result = sortObj(parsedJson);
      } else if (
        cli.flags.arrays &&
        Array.isArray(parsedJson) &&
        parsedJson.length &&
        parsedJson.every(isStr)
      ) {
        // if it was an array full of strings, it's an early ending:
        return fs.writeJson(
          oneOfPaths,
          parsedJson.sort((a, b) => a.localeCompare(b)),
          {
            spaces: cli.flags.tabs
              ? "\t".repeat(indentationCount)
              : indentationCount,
          }
        );
      } else {
        result = parsedJson;
      }

      return Promise.resolve(
        !cli.flags.pack && path.basename(oneOfPaths) === "package.json"
          ? format(result)
          : result
      ).then((obj) => {
        if (cli.flags.ci) {
          // if it's CI mode, we only gather a list of files that differ from
          // input after processing, then we return an array.
          // In this function, readSortAndWriteOverFile(), path came in,
          // we read it, now we return true if result differs after processing

          let stringified = JSON.stringify(
            traverse(obj, (key, val) => {
              let current = val !== undefined ? val : key;
              if (isObj(current)) {
                return sortObj(current);
              }
              if (
                cli.flags.arrays &&
                Array.isArray(current) &&
                current.length > 1 &&
                current.every(isStr)
              ) {
                // alphabetical sort
                return current.sort((a, b) => a.localeCompare(b));
              }
              return current;
            }),
            null,
            cli.flags.tabs ? "\t".repeat(indentationCount) : indentationCount
          );
          return stringified.trimEnd() !== filesContent.trimEnd();
        }

        // ELSE,
        return fs
          .writeJson(
            oneOfPaths,
            traverse(obj, (key, val) => {
              let current = val !== undefined ? val : key;
              if (isObj(current)) {
                return sortObj(current);
              }
              if (
                cli.flags.arrays &&
                Array.isArray(current) &&
                current.length > 1 &&
                current.every(isStr)
              ) {
                // alphabetical sort
                return current.sort((a, b) => a.localeCompare(b));
              }
              return current;
            }),
            {
              spaces: cli.flags.tabs
                ? "\t".repeat(indentationCount)
                : indentationCount,
            }
          )
          .then(() => {
            if (!cli.flags.silent) {
              log(
                `${chalk.grey(
                  prefix
                )}${oneOfPaths} - ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`
              );
            }
            return true;
          });
      });
    })
    .catch((err) => {
      console.log(
        `${oneOfPaths} - ${`\u001b[${31}m${`BAD`}\u001b[${39}m`} - ${err}`
      );
    });
}

// Step #0. take care of -v and -h flags that are left out in meow.
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

globby(input, { dot: true })
  .then((paths) => {
    // flip out of the pipeline if there are no paths resolved
    if (paths.length === 0 && !cli.flags.silent) {
      log(
        `${chalk.grey(prefix)}${chalk.red(
          "The inputs don't lead to any json files! Exiting."
        )}`
      );
      process.exit(0);
    }
    return paths;
  })
  // glob each directory, reduce'ing all results (in promise shape) until all are resolved
  .then((paths) =>
    pReduce(
      paths,
      (concattedTotal, singleDirOrFilePath) =>
        concattedTotal.concat(
          isDirectory(singleDirOrFilePath).then((bool) =>
            bool
              ? globby(
                  cli.flags.nodemodules
                    ? singleDirOrFilePath
                    : [singleDirOrFilePath, "!**/node_modules/**"],
                  {
                    expandDirectories: {
                      files: [".*", "*.json"],
                    },
                  }
                )
              : [singleDirOrFilePath]
          )
        ),
      []
      // then reduce again, now actually concatenating them all together
    ).then((received) =>
      pReduce(received, (total, single) => total.concat(single), [])
    )
  )
  .then((paths) =>
    paths.filter(
      (oneOfPaths) =>
        !oneOfPaths.includes("package-lock.json") &&
        !oneOfPaths.includes("yarn.lock")
    )
  )
  .then((paths) =>
    !cli.flags.nodemodules
      ? paths.filter((oneOfPaths) => !oneOfPaths.includes("node_modules"))
      : paths
  )
  .then((paths) =>
    cli.flags.pack
      ? paths.filter((oneOfPaths) => !oneOfPaths.includes("package.json"))
      : paths
  )
  .then((paths) =>
    paths.filter((singlePath) => {
      return (
        path.extname(singlePath) === ".json" ||
        (typeof path.basename(singlePath) === "string" &&
          path.basename(singlePath).startsWith(".") &&
          !nonJsonFormats.some((badExtension) =>
            path.extname(singlePath).includes(badExtension)
          ) &&
          !badFiles.some((badFile) =>
            path.basename(singlePath).includes(badFile)
          ))
      );
    })
  )
  // eslint-disable-next-line consistent-return
  .then((paths) => {
    if (cli.flags.dry && !cli.flags.silent) {
      log(
        `${chalk.grey(prefix)}${chalk.yellow(
          "We'd try to sort the following files:"
        )}\n${paths.join("\n")}`
      );
    } else {
      if (cli.flags.ci) {
        // CI setting
        return pFilter(paths, (currentPath) =>
          readSortAndWriteOverFile(currentPath)
        ).then((received2) => {
          if (received2.length && !cli.flags.silent) {
            log(
              `${chalk.grey(prefix)}${chalk.red(
                "Unsorted files:"
              )}\n${received2.join("\n")}`
            );
            process.exit(9);
          } else if (!cli.flags.silent) {
            log(
              `${chalk.grey(prefix)}${chalk.white(
                "All files were already sorted:"
              )}\n${paths.join("\n")}`
            );
            process.exit(0);
          }
        });
      }
      // not a CI setting
      return pReduce(
        paths,
        (counter, currentPath) =>
          readSortAndWriteOverFile(currentPath)
            .then((res) =>
              res
                ? {
                    good: counter.good.concat([currentPath]),
                    bad: counter.bad,
                  }
                : {
                    good: counter.good,
                    bad: counter.bad.concat([currentPath]),
                  }
            )
            .catch((err) => {
              if (!cli.flags.silent) {
                log(
                  `${chalk.grey(prefix)}${chalk.red(
                    "Could not write out the sorted file:"
                  )} ${err}`
                );
              }
            }),
        { good: [], bad: [] }
      ).then((counter) => {
        if (!cli.flags.silent) {
          log(
            `\n${chalk.grey(prefix)}${chalk.green(
              `${counter.bad && counter.bad.length === 0 ? "All " : ""}${
                counter.good.length
              } files sorted`
            )}${
              counter.bad && counter.bad.length
                ? `\n${chalk.grey(prefix)}${chalk.red(
                    `${counter.bad.length} file${
                      counter.bad.length === 1 ? "" : "s"
                    } could not be sorted`
                  )} ${`\u001b[${90}m - ${counter.bad.join(
                    " - "
                  )}\u001b[${39}m`}`
                : ""
            }`
          );
        }
      });
    }
  })
  .catch((err) => {
    if (!cli.flags.silent) {
      log(`${chalk.grey(prefix)}${chalk.red("Oops!")} ${err}`);
    }
  });
