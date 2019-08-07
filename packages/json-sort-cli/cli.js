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
const sortObject = require("sorted-object");
const traverse = require("ast-monkey-traverse");
const isObj = require("lodash.isplainobject");
const format = require("format-package");
const isArr = Array.isArray;

function isStr(something) {
  return typeof something === "string";
}

const { log } = console;
const cli = meow(
  `
  Usage
    $ jsonsort YOURFILE.json
    $ sortjson YOURFILE.json
    $ sortjson templatesfolder1 templatesfolder2 package.json
  or, just type "jsonsort" and it will let you pick a file.

  Options
    -n, --nodemodules   Don't ignore any node_modules folders and package-lock.json's
    -t, --tabs          Use tabs for JSON file indentation
    -s, --silent        Does not show the result per-file, only totals in the end
    -h, --help          Shows this help
    -v, --version       Shows the version of your json-sort-cli
    -a, --arrays        Also sort any arrays if they contain only string elements
    -p, --pack          Exclude all package.json files

  Example
    Call anywhere using glob patterns. If you put them as string, this library
    will parse globs. If you put as system globs without quotes, your shell will expand them.
`,
  {
    alias: {
      n: "nodemodules",
      t: "tabs",
      s: "silent",
      a: "arrays",
      p: "pack"
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

// FUNCTIONS
// -----------------------------------------------------------------------------

// function readSortAndWriteOverFile(oneOfPaths, sortArrays) {
function readSortAndWriteOverFile(oneOfPaths) {
  // console.log("\n\n\n\n==========\n\n\n\n");
  // console.log(
  //   `075 PROCESSING: ${`\u001b[${33}m${`oneOfPaths`}\u001b[${39}m`} = ${JSON.stringify(
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
      //   `086 ${`\u001b[${33}m${`filesContent`}\u001b[${39}m`} = ${JSON.stringify(
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
        if (!cli.flags.s) {
          log(
            `${chalk.grey("✨ json-sort-cli: ")}${oneOfPaths} - ${chalk.red(
              err
            )}`
          );
        }
        return Promise.resolve(null);
      }
      let result;

      if (isObj(parsedJson)) {
        result = sortObject(parsedJson);
      } else if (
        cli.flags.a &&
        isArr(parsedJson) &&
        parsedJson.length &&
        parsedJson.every(isStr)
      ) {
        // if it was an array full of strings, it's an early ending:
        return fs.writeJson(
          oneOfPaths,
          parsedJson.sort((a, b) => a.localeCompare(b)),
          {
            spaces: cli.flags.t ? "\t" : 2
          }
        );
      } else {
        result = parsedJson;
      }

      return Promise.resolve(
        !cli.flags.p && path.basename(oneOfPaths) === "package.json"
          ? format(result).then(str => JSON.parse(str))
          : result
      ).then(obj =>
        fs
          .writeJson(
            oneOfPaths,
            traverse(obj, (key, val) => {
              const current = val !== undefined ? val : key;
              if (isObj(current)) {
                return sortObject(current);
              } else if (
                cli.flags.a &&
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
              spaces: cli.flags.t ? "\t" : 2
            }
          )
          .then(() => {
            if (!cli.flags.s) {
              log(
                `${chalk.grey(
                  "✨ json-sort-cli: "
                )}${oneOfPaths} - ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`
              );
            }
            return true;
          })
      );
    })
    .catch(err => {
      `${oneOfPaths} - ${`\u001b[${31}m${`BAD`}\u001b[${39}m`} - ${err}`;
    });
}

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (cli.flags.v) {
  log(cli.pkg.version);
  process.exit(0);
} else if (cli.flags.h) {
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

// Step #2. query the glob and follow the pipeline
// -----------------------------------------------------------------------------

globby(input, { dot: true })
  .then(resolvedPathsArray => {
    // flip out of the pipeline if there are no paths resolved
    if (resolvedPathsArray.length === 0) {
      log(
        `${chalk.grey("✨ json-sort-cli: ")}${chalk.red(
          "The inputs don't lead to any json files! Exiting."
        )}`
      );
      process.exit(0);
    }
    // console.log(
    //   `214 ${`\u001b[${33}m${`resolvedPathsArray`}\u001b[${39}m`} = ${JSON.stringify(
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
                  cli.flags.n
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
      //   `247 ${`\u001b[${33}m${`received`}\u001b[${39}m`} = ${JSON.stringify(
      //     received,
      //     null,
      //     4
      //   )}`
      // );
      return pReduce(received, (total, single) => total.concat(single), []);
    })
  )
  .then(res =>
    !cli.flags.n
      ? res.filter(
          oneOfPaths =>
            !oneOfPaths.includes("node_modules") &&
            !oneOfPaths.includes("package-lock.json")
        )
      : res
  )
  .then(res =>
    cli.flags.p
      ? res.filter(oneOfPaths => !oneOfPaths.includes("package.json"))
      : res
  )
  .then(paths => {
    // console.log(
    //   `267 ${`\u001b[${33}m${`paths BEFORE`}\u001b[${39}m`} = ${JSON.stringify(
    //     paths,
    //     null,
    //     4
    //   )}`
    // );
    const tempRez = paths.filter(singlePath => {
      // console.log(`---------\n238 processing: ${singlePath}`);
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
    //   `302 ${`\u001b[${33}m${`paths AFTER`}\u001b[${39}m`} = ${JSON.stringify(
    //     tempRez,
    //     null,
    //     4
    //   )}`
    // );
    return tempRez;
  })
  .then(received => {
    if (cli.flags.d) {
      log(
        `${chalk.grey("✨ json-sort-cli: ")}${chalk.yellow(
          "We'd sort the following files:"
        )}\n${received.join("\n")}`
      );
    } else {
      return pReduce(
        received,
        (counter, currentPath) =>
          readSortAndWriteOverFile(currentPath, cli.flags.a)
            .then(received => {
              // console.log(
              //   `324 ${`\u001b[${33}m${`received`}\u001b[${39}m`} = ${JSON.stringify(
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
              log(
                `${chalk.grey("✨ json-sort-cli: ")}${chalk.red(
                  "Could not write out the sorted file:"
                )} ${err}`
              );
              return counter;
            }),
        { good: [], bad: [] }
      ).then(counter => {
        // console.log(
        //   `354 ${`\u001b[${33}m${`counter`}\u001b[${39}m`} = ${JSON.stringify(
        //     counter,
        //     null,
        //     4
        //   )}`
        // );
        log(
          `\n${chalk.grey("✨ json-sort-cli: ")}${chalk.green(
            `${counter.bad && counter.bad.length === 0 ? "All " : ""}${
              counter.good.length
            } files sorted`
          )}${
            counter.bad && counter.bad.length
              ? `\n${chalk.grey("✨ json-sort-cli: ")}${chalk.red(
                  `${counter.bad.length} file${
                    counter.bad.length === 1 ? "" : "s"
                  } could not be sorted`
                )} ${`\u001b[${90}m - ${counter.bad.join(" - ")}\u001b[${39}m`}`
              : ""
          }`
        );
      });
    }
  })
  .catch(err => {
    log(`${chalk.grey("✨ json-sort-cli: ")}${chalk.red("Oops!")} ${err}`);
  });
