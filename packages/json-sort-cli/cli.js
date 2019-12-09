#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

const fs = require("fs-extra");
const chalk = require("chalk");
const globby = require("globby");
const meow = require("meow");
const path = require("path");
const updateNotifier = require("update-notifier");
const isDirectory = require("is-d");
const pReduce = require("p-reduce");
const pFilter = require("p-filter");
const sortObject = require("sorted-object");
const traverse = require("ast-monkey-traverse");
const isObj = require("lodash.isplainobject");
const format = require("format-package");
const isArr = Array.isArray;

function isStr(something) {
  return typeof something === "string";
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
    -n, --nodemodules      Don't ignore any node_modules folders and package-lock.json's
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
    flags: {
      nodemodules: {
        type: "boolean",
        alias: "n",
        default: true
      },
      tabs: {
        type: "boolean",
        alias: "t",
        default: false
      },
      silent: {
        type: "boolean",
        alias: "s",
        default: false
      },
      arrays: {
        type: "boolean",
        alias: "a",
        default: false
      },
      pack: {
        type: "boolean",
        alias: "p",
        default: false
      },
      dry: {
        type: "boolean",
        alias: "d",
        default: false
      },
      ci: {
        type: "boolean",
        alias: "c",
        default: false
      },
      help: {
        type: "boolean",
        alias: "h",
        default: false
      },
      version: {
        type: "boolean",
        alias: "v",
        default: false
      },
      indentationCount: {
        type: "number",
        alias: "i"
      }
    }
  }
);
updateNotifier({ pkg: cli.pkg }).notify();

const nonJsonFormats = ["yml", "toml", "yaml"]; // to save time
const badFiles = [
  ".DS_Store",
  "npm-debug.log",
  ".svn",
  "CVS",
  "config.gypi",
  ".lock-wscript",
  "package-lock.json",
  "npm-shrinkwrap.json"
];

// console.log(
//   `120 ${`\u001b[${33}m${`cli.flags`}\u001b[${39}m`} = ${JSON.stringify(
//     cli.flags,
//     null,
//     4
//   )}`
// );

// FUNCTIONS
// -----------------------------------------------------------------------------

function stripWhitespace(str) {
  return str.split("").reduce((acc, curr) => {
    return `${acc}${curr.trim().length ? curr : ""}`;
  }, "");
}

function readSortAndWriteOverFile(oneOfPaths) {
  // console.log("\n\n\n\n==========\n\n\n\n");
  // console.log(
  //   `139 PROCESSING: ${`\u001b[${33}m${`oneOfPaths`}\u001b[${39}m`} = ${JSON.stringify(
  //     oneOfPaths,
  //     null,
  //     4
  //   )}`
  // );
  return fs
    .readFile(oneOfPaths, "utf8")
    .then(filesContent => {
      let parsedJson;
      // console.log(
      //   `150 ${`\u001b[${33}m${`filesContent`}\u001b[${39}m`} = ${JSON.stringify(
      //     filesContent,
      //     null,
      //     4
      //   )}`
      // );
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
        result = sortObject(parsedJson);
      } else if (
        cli.flags.arrays &&
        isArr(parsedJson) &&
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
              : indentationCount
          }
        );
      } else {
        result = parsedJson;
      }

      return Promise.resolve(
        !cli.flags.pack && path.basename(oneOfPaths) === "package.json"
          ? format(result).then(str => JSON.parse(str))
          : result
      ).then(obj => {
        if (cli.flags.ci) {
          // if it's CI mode, we only gather a list of files that differ from
          // input after processing, then we return an array.
          // In this function, readSortAndWriteOverFile(), path came in,
          // we read it, now we return true if result differs after processing
          // console.log(`200 returning compared:`);

          const stringified = JSON.stringify(
            traverse(obj, (key, val) => {
              const current = val !== undefined ? val : key;
              if (isObj(current)) {
                return sortObject(current);
              } else if (
                cli.flags.arrays &&
                isArr(current) &&
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
          // console.log(
          //   `222 ${`\u001b[${33}m${`stringified`}\u001b[${39}m`} = ${JSON.stringify(
          //     stringified,
          //     null,
          //     4
          //   )};\n${`\u001b[${33}m${`filesContent`}\u001b[${39}m`} = ${JSON.stringify(
          //     filesContent,
          //     null,
          //     4
          //   )}`
          // );

          return stripWhitespace(stringified) !== stripWhitespace(filesContent);
        }
        // ELSE,
        return fs
          .writeJson(
            oneOfPaths,
            traverse(obj, (key, val) => {
              const current = val !== undefined ? val : key;
              if (isObj(current)) {
                return sortObject(current);
              } else if (
                cli.flags.arrays &&
                isArr(current) &&
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
                : indentationCount
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
    .catch(err => {
      `${oneOfPaths} - ${`\u001b[${31}m${`BAD`}\u001b[${39}m`} - ${err}`;
    });
}

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (cli.flags.version && !cli.flags.silent) {
  log(cli.pkg.version);
  process.exit(0);
} else if (cli.flags.help && !cli.flags.silent) {
  log(cli.help);
  process.exit(0);
}

// Step #1. set up the cli
// -----------------------------------------------------------------------------

let { input } = cli;
// if the folder/file name follows the flag (for example "-d "templates1"),
// that name will be put under the flag's key value, not into cli.input.
// That's handy for certain types of CLI apps, but not this one, as in our case
// the flags position does not matter, they don't affect the keywords that follow.
if (cli.flags) {
  Object.keys(cli.flags).forEach(flag => {
    if (typeof cli.flags[flag] === "string") {
      input = input.concat(cli.flags[flag]);
    }
  });
}

// settle indentations type and count

// 1. set defaults:
let indentationCount = 2;
if (cli.flags.tabs) {
  indentationCount = 1;
}
// 2. overwrite defaults with explicitly set value:
if (cli.flags.indentationCount) {
  indentationCount = Number.parseInt(cli.flags.indentationCount, 10);
}

// Step #2. query the glob and follow the pipeline
// -----------------------------------------------------------------------------

globby(input, { dot: true })
  .then(resolvedPathsArray => {
    // flip out of the pipeline if there are no paths resolved
    if (resolvedPathsArray.length === 0 && !cli.flags.silent) {
      log(
        `${chalk.grey(prefix)}${chalk.red(
          "The inputs don't lead to any json files! Exiting."
        )}`
      );
      process.exit(0);
    }
    // console.log(
    //   `331 ${`\u001b[${33}m${`resolvedPathsArray`}\u001b[${39}m`} = ${JSON.stringify(
    //     resolvedPathsArray,
    //     null,
    //     4
    //   )}`
    // );
    return resolvedPathsArray;
  })
  // glob each directory, reduce'ing all results (in promise shape) until all are resolved
  .then(resolvedPathsArray =>
    pReduce(
      resolvedPathsArray,
      (concattedTotal, singleDirOrFilePath) =>
        concattedTotal.concat(
          isDirectory(singleDirOrFilePath).then(bool =>
            bool
              ? globby(
                  cli.flags.nodemodules
                    ? [singleDirOrFilePath, "!node_modules"]
                    : singleDirOrFilePath,
                  {
                    expandDirectories: {
                      files: [".*", "*.json"]
                    }
                  }
                )
              : [singleDirOrFilePath]
          )
        ),
      []
      // then reduce again, now actually concatenating them all together
    ).then(received => {
      // console.log(
      //   `364 ${`\u001b[${33}m${`received`}\u001b[${39}m`} = ${JSON.stringify(
      //     received,
      //     null,
      //     4
      //   )}`
      // );
      return pReduce(received, (total, single) => total.concat(single), []);
    })
  )
  .then(res =>
    !cli.flags.nodemodules
      ? res.filter(
          oneOfPaths =>
            !oneOfPaths.includes("node_modules") &&
            !oneOfPaths.includes("package-lock.json")
        )
      : res
  )
  .then(res =>
    cli.flags.pack
      ? res.filter(oneOfPaths => !oneOfPaths.includes("package.json"))
      : res
  )
  .then(paths => {
    // console.log(
    //   `389 ${`\u001b[${33}m${`paths BEFORE`}\u001b[${39}m`} = ${JSON.stringify(
    //     paths,
    //     null,
    //     4
    //   )}`
    // );
    const tempRez = paths.filter(singlePath => {
      // console.log(`---------\n396 processing: ${singlePath}`);
      // console.log(
      //   `${`\u001b[${33}m${`path.extname(singlePath)`}\u001b[${39}m`} = ${JSON.stringify(
      //     path.extname(singlePath),
      //     null,
      //     4
      //   )}`
      // );
      // console.log(
      //   `${`\u001b[${33}m${`path.basename(singlePath)`}\u001b[${39}m`} = ${JSON.stringify(
      //     path.basename(singlePath),
      //     null,
      //     4
      //   )}`
      // );
      return (
        path.extname(singlePath) === ".json" ||
        (typeof path.basename(singlePath) === "string" &&
          path.basename(singlePath).startsWith(".") &&
          !nonJsonFormats.some(badExtension =>
            path.extname(singlePath).includes(badExtension)
          ) &&
          !badFiles.some(badFile =>
            path.basename(singlePath).includes(badFile)
          ))
      );
    });
    // console.log(
    //   `424 ${`\u001b[${33}m${`paths AFTER`}\u001b[${39}m`} = ${JSON.stringify(
    //     tempRez,
    //     null,
    //     4
    //   )}`
    // );
    return tempRez;
  })
  .then(received => {
    if (cli.flags.dry && !cli.flags.silent) {
      log(
        `${chalk.grey(prefix)}${chalk.yellow(
          "We'd try to sort the following files:"
        )}\n${received.join("\n")}`
      );
    } else {
      if (cli.flags.ci) {
        // CI setting
        // console.log(
        //   `443 ${`\u001b[${33}m${`received`}\u001b[${39}m`} = ${JSON.stringify(
        //     received,
        //     null,
        //     4
        //   )}`
        // );
        return pFilter(received, currentPath =>
          readSortAndWriteOverFile(currentPath)
        ).then(received2 => {
          // console.log(
          //   `453 ${`\u001b[${33}m${`received2`}\u001b[${39}m`} = ${JSON.stringify(
          //     received2,
          //     null,
          //     4
          //   )}`
          // );
          // if any files differ, report and exit with non-zero code:
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
              )}\n${received.join("\n")}`
            );
            process.exit(0);
          }
        });
      }
      // not a CI setting
      return pReduce(
        received,
        (counter, currentPath) =>
          readSortAndWriteOverFile(currentPath)
            .then(received => {
              // console.log(
              //   `484 ${`\u001b[${33}m${`received`}\u001b[${39}m`} = ${JSON.stringify(
              //     received,
              //     null,
              //     4
              //   )}`
              // );
              return received;
            })
            .then(res =>
              res
                ? {
                    good: counter.good.concat([currentPath]),
                    bad: counter.bad
                  }
                : {
                    good: counter.good,
                    bad: counter.bad.concat([currentPath])
                  }
            )
            .catch(err => {
              if (!cli.flags.silent) {
                log(
                  `${chalk.grey(prefix)}${chalk.red(
                    "Could not write out the sorted file:"
                  )} ${err}`
                );
              }
              return counter;
            }),
        { good: [], bad: [] }
      ).then(counter => {
        // console.log(
        //   `516 ${`\u001b[${33}m${`counter`}\u001b[${39}m`} = ${JSON.stringify(
        //     counter,
        //     null,
        //     4
        //   )}`
        // );
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
  .catch(err => {
    if (!cli.flags.silent) {
      log(`${chalk.grey(prefix)}${chalk.red("Oops!")} ${err}`);
    }
  });
