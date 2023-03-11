#!/usr/bin/env node

/* eslint array-callback-return:0, consistent-return:0, no-loop-func:0 */

// VARS
// -----------------------------------------------------------------------------

import fs from "fs";
import meow from "meow";
import path from "path";
import chalk from "chalk";
import { sort } from "csv-sort";
import inquirer from "inquirer";
import { globbySync } from "globby";
import { createRequire } from "module";
import updateNotifier from "update-notifier";
import { pullAll } from "codsen-utils";

const { log } = console;

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const state = {};
state.toDoList = []; // default
state.overwrite = false; // default
const ui = new inquirer.ui.BottomBar();
const cli = meow(
  `
  Usage
    $ csvsort YOURFILE.csv
  or, just type "csvsort" and it will let you pick a file.

  Options
    -o, --overwrite   Will overwrite the target file instead
    -h, --help        Shows this help
    -v, --version     Shows the version of your ${pkg.name}

  Example
    Just call it in the root, where your csv file is located
`,
  {
    importMeta: import.meta,
    flags: {
      overwrite: {
        type: "boolean",
        alias: "o",
        default: false,
      },
    },
  }
);
updateNotifier({ pkg }).notify();

// FUNCTIONS
// -----------------------------------------------------------------------------

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// consumes a plain object: {
//   toDoList - array,
//   overwrite - boolean
// }
function offerAListOfCSVsToPickFrom(stateObj) {
  // This means, it was called without any arguments.
  // That's fine.
  let allCSVsHere = globbySync("./*.csv", "!**/node_modules/**");
  if (!allCSVsHere.length) {
    return Promise.reject(
      new Error(
        "\ncsv-sort-cli: Alas, program couldn't find any CSV files in this folder!"
      )
    );
  }
  ui.log.write(chalk.grey("To quit, press CTRL+C"));
  let questions = [
    {
      type: "list",
      name: "file",
      message: "Which CSV would you like to check?",
      choices: allCSVsHere,
    },
  ];
  if (
    stateObj === undefined ||
    !hasOwnProperty(stateObj, "overwrite") ||
    (hasOwnProperty(stateObj, "overwrite") && stateObj.overwrite === false) ||
    typeof stateObj.overwrite !== "boolean"
  ) {
    questions.push({
      type: "list",
      name: "overwrite",
      message: "Do you want to overwrite this file with a sorted result?",
      choices: [
        { name: "yes", value: true },
        { name: "no", value: false },
      ],
    });
  }
  ui.log.write(chalk.yellow("Please pick a file:"));
  return inquirer.prompt(questions).then((answer) => ({
    toDoList: [path.basename(answer.file)],
    overwrite: answer.overwrite || false,
  }));
}

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (cli.flags.v) {
  log(pkg.version);
  process.exit(0);
} else if (cli.flags.h) {
  log(cli.help);
  process.exit(0);
}

// Step #1. gather the to-do list of files.
// -----------------------------------------------------------------------------

if (cli.input.length > 0) {
  state.toDoList = cli.input;
}

// if --overwrite/-o flag is used, the following argument will be put as flag's
// value, not in "cli.input[]":
// we anticipate the can be multiple, potentially-false flags mixed with valid file names
if (Object.keys(cli.flags).length !== 0) {
  state.toDoList = [...new Set(cli.input)];
}

if (cli.flags.o) {
  // variables that can be misinterpreted as falsey, yet the flag still be in
  // for example, in "csvsort -o false simples.csv simples2.csv",
  // the cli.flags.overwrite === false (WTF?)
  state.overwrite = true; // we normalise the flag since its value in CLI can precede
}

// Step #2. create a promise variable and assign it to one of the promises,
// depending on was the acceptable file passed via args or queries afterwards.
// -----------------------------------------------------------------------------
let thePromise;
if (
  state.toDoList.length === 0 &&
  // no input args given
  (Object.keys(cli.flags).length === 0 ||
    (Object.keys(cli.flags).length === 1 && cli.flags.overwrite !== undefined))
) {
  // ---------------------------------  1  -------------------------------------
  // if no arguments were given, offer a list:
  thePromise = offerAListOfCSVsToPickFrom(state);
} else if (
  state.toDoList.map((onePath) => path.resolve(onePath)).filter(fs.existsSync)
    .length > 0
) {
  // ---------------------------------  2  -------------------------------------
  // basically achieving: (!fs.existsSync)
  let erroneous = pullAll(
    state.toDoList.map((onePath) => path.resolve(onePath)),
    state.toDoList.map((onePath) => path.resolve(onePath)).filter(fs.existsSync)
  ).map((singlePath) => path.basename(singlePath)); // then filtering file names-only

  // write the list of unrecognised file names into the console:
  if (erroneous.length > 0) {
    log(
      chalk.red(
        `\ncsv-sort-cli: Alas, the following file${
          erroneous.length > 1 ? "s don't" : " doesn't"
        } exist: "${erroneous.join('", "')}"`
      )
    );
  }

  // remove non-existing paths from toDoList:
  state.toDoList = state.toDoList
    .map((onePath) => path.resolve(onePath))
    .filter(fs.existsSync);

  // create the final promise variable we're going to use later:
  thePromise = Promise.resolve(state);
} else {
  // ---------------------------------  3  -------------------------------------
  let butStateWasRecognisedMsg = "";
  if (state.overwrite) {
    butStateWasRecognisedMsg = 'But it recognised your "-o" flag.';
  }
  log(
    chalk.yellow(
      `\ncsv-sort-cli: Program didn't recognise any CSV files in your input!\n${butStateWasRecognisedMsg}`
    )
  );

  // if there were no valid path in the arguments, query the files from the
  // existing CSV's in the current folder:
  thePromise = offerAListOfCSVsToPickFrom(state);
}

// Step #3.
// -----------------------------------------------------------------------------

thePromise
  .then((receivedState) => {
    receivedState.toDoList.map((requestedCSVsPath) => {
      // read the source
      fs.readFile(requestedCSVsPath, "utf8", (csvError, csvData) => {
        if (csvData) {
          try {
            let cleaned = sort(csvData);
            if (receivedState.overwrite) {
              // overwrite
              fs.writeFile(
                path.basename(requestedCSVsPath),
                cleaned.res.join("\n"),
                "utf8",
                (err) => {
                  if (err) {
                    throw err;
                  }
                  log(
                    chalk.green(
                      `csv-sort-cli: Yay! The ${path.basename(
                        requestedCSVsPath
                      )} has been fixed and overwritten! Check it out.`
                    )
                  );
                  process.exit(0);
                }
              );
            } else {
              // create a new file with appended hyphen+integer before extension
              let proposedNewFileName;
              for (let i = 1; i < 1001; i++) {
                proposedNewFileName = `${path.basename(
                  requestedCSVsPath,
                  path.extname(requestedCSVsPath)
                )}-${i}${path.extname(requestedCSVsPath)}`;
                if (!fs.existsSync(path.resolve(proposedNewFileName))) {
                  fs.writeFile(
                    proposedNewFileName,
                    cleaned.res.join("\n"),
                    "utf8",
                    (err) => {
                      if (err) {
                        throw err;
                      }
                      log(
                        chalk.green(
                          `csv-sort-cli: Yay! A new file, ${proposedNewFileName} has been created! Check it out.`
                        )
                      );
                      process.exit(0);
                    }
                  );
                  break;
                }
              }
              path.basename(requestedCSVsPath, path.extname(requestedCSVsPath));
            }
          } catch (e) {
            return Promise.reject(
              new Error(`\ncsv-sort-cli: Alas, we encountered an error:\n${e}`)
            );
          }
        }
        if (csvError) {
          return Promise.reject(
            new Error(
              `\ncsv-sort-cli: Alas, we couldn't fetch the file "${path.basename(
                requestedCSVsPath
              )}" you requested!`
            )
          );
        }
      });
    });
  })
  .catch((err) => {
    log(chalk.red(err));
    process.exit(1);
  });
