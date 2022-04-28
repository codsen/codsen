#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

import path from "path";
import chalk from "chalk";
import fs from "fs-extra";
import argv from "minimist";
import { globby } from "globby";
import inquirer from "inquirer";
import pullAll from "lodash.pullall";
import { createRequire } from "module";
import { right } from "string-left-right";
import updateNotifier from "update-notifier";
import { within } from "email-all-chars-within-ascii";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const argv1 = argv(process.argv.slice(2));

const { log } = console;

const state = {};
state.toDoList = []; // default

const help = `
  Usage
    $ withinascii YOURFILE.html
  or, just type "withinascii" and it will let you pick a file

  Options
    -l, --len         Max allowed line length (default is 500)
    -h, --help        Shows this help
    -v, --version     Shows the version of your ${pkg.name}

  Instructions
    Just call it in the folder where your file is located or provide a path
`;
updateNotifier({ pkg }).notify();

function offerAListOfFilesToPickFrom() {
  let ui = new inquirer.ui.BottomBar();
  let allFilesHere = globby.sync("./*.*");
  if (!allFilesHere.length) {
    log(
      chalk.grey("\nemail-all-chars-within-ascii-cli: [THROW_ID_01] ") +
        chalk.red(`Alas, there are no files in this folder!`)
    );
    return process.exit(1);
  }
  ui.log.write(chalk.grey("To quit, press CTRL+C"));
  let questions = [
    {
      type: "list",
      name: "file",
      message: "Which file would you like to check?",
      choices: allFilesHere,
    },
  ];
  ui.log.write(chalk.yellow("Please pick a file:"));
  return inquirer.prompt(questions).then((answer) => ({
    toDoList: [path.basename(answer.file)],
  }));
}

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (argv1.v || argv1.version) {
  log(pkg.version);
  process.exit(0);
} else if (argv1.h || argv1.help) {
  log(help);
  process.exit(0);
}

// Step #1. gather the to-do list of files.
// -----------------------------------------------------------------------------

state.toDoList = argv1._;

// Step #2. create a promise variable and assign it to one of the promises,
// depending on was the acceptable file passed via args or queries afterwards.
// -----------------------------------------------------------------------------
let thePromise;
if (!state.toDoList.length) {
  // ---------------------------------  1  -------------------------------------
  // if no arguments were given, offer a list:
  thePromise = offerAListOfFilesToPickFrom(state);
} else if (
  state.toDoList.map((onePath) => path.resolve(onePath)).filter(fs.existsSync)
    .length
) {
  // ---------------------------------  2  -------------------------------------
  // basically achieving: (!fs.existsSync)
  let erroneous = pullAll(
    state.toDoList.map((onePath) => path.resolve(onePath)),
    state.toDoList.map((onePath) => path.resolve(onePath)).filter(fs.existsSync)
  ).map((singlePath) => path.basename(singlePath)); // then filtering file names-only

  // write the list of unrecognised file names into the console:
  if (erroneous.length) {
    log(
      chalk.grey("\nemail-all-chars-within-ascii-cli: [THROW_ID_02] ") +
        chalk.red(
          `Alas, the following file${
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
  log(
    chalk.yellow(
      "\nemail-all-chars-within-ascii-cli: [THROW_ID_03] Didn't recognise any files!"
    )
  );

  // if there were no valid path in the arguments, query the files in the
  // current folder:
  thePromise = offerAListOfFilesToPickFrom(state);
}

// Step #3.
// -----------------------------------------------------------------------------

thePromise
  .then((receivedState) => {
    let noErrors = true;
    receivedState.toDoList.forEach((requestedPath) => {
      let filesContents = "";
      let fileNameInfo = "";
      if (receivedState.toDoList.length) {
        fileNameInfo = `${path.basename(requestedPath)}`;
      }
      try {
        filesContents = fs.readFileSync(requestedPath, "utf8");
        let lineLength = argv1.len || argv1.l;
        if (typeof lineLength === "boolean") {
          // in case somebody puts empty flag without a value
          lineLength = undefined;
        }
        let findings = within(filesContents, {
          lineLength,
        });
        if (findings.length) {
          noErrors = false;
          console.log(chalk.grey("\nemail-all-chars-within-ascii-cli:"));
          findings.forEach((obj) => {
            if (obj.type === "character") {
              console.log(
                `\n${chalk.cyan(fileNameInfo)}:${chalk.yellow(
                  obj.line
                )}:${chalk.yellow(obj.column)} - ${chalk.red(
                  "bad character"
                )} - ${obj.value} ${chalk.grey(
                  `(https://www.fileformat.info/info/unicode/char/${obj.UTF32Hex}/index.htm)`
                )}`
              );
            } else {
              console.log(
                `\n${chalk.cyan(fileNameInfo)}:${chalk.yellow(
                  obj.line
                )} - ${chalk.red(
                  `${obj.value} character-long line (limit ${
                    argv1.len || argv1.l || 500
                  })`
                )}`
              );
            }
            // console.log(
            //   `${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
            //     obj,
            //     null,
            //     4
            //   )}`
            // );
            let startingPos = filesContents[
              obj.positionIdx - obj.column + 1
            ].trim()
              ? obj.positionIdx - obj.column + 1
              : right(filesContents, obj.positionIdx - obj.column + 1);
            // console.log(
            //   `191 ${`\u001b[${33}m${`startingPos`}\u001b[${39}m`} = ${JSON.stringify(
            //     startingPos,
            //     null,
            //     4
            //   )}`
            // );

            let sliceFrom = Math.max(
              obj.positionIdx - Math.min(obj.column, 40),
              startingPos
            );
            let sliceTo = Math.min(
              ...[
                filesContents.indexOf("\n", obj.positionIdx),
                filesContents.indexOf("\r", obj.positionIdx),
                obj.positionIdx + 10,
              ].filter((val) => val > 0)
            );
            // console.log(
            //   `${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${JSON.stringify(
            //     sliceFrom,
            //     null,
            //     4
            //   )}`
            // );
            // console.log(
            //   `${`\u001b[${33}m${`sliceTo`}\u001b[${39}m`} = ${JSON.stringify(
            //     sliceTo,
            //     null,
            //     4
            //   )}`
            // );
            let currLinesChunk = filesContents
              .slice(sliceFrom, sliceTo)
              .replace(/\t/g, " ");
            console.log(`\n${chalk.inverse(obj.line)} ${currLinesChunk}`);
            console.log(
              `${chalk.inverse(
                " ".repeat(String(obj.line).length)
              )} ${" ".repeat(
                obj.positionIdx - sliceFrom - (obj.type === "character" ? 0 : 1)
              )}${chalk.red("~")}`
            );
          });

          process.exit(noErrors ? 0 : 1);
        } else {
          console.log(
            `${chalk.grey("email-all-chars-within-ascii-cli:")} ${chalk.green(
              "ALL OK"
            )}`
          );
          process.exit(0);
        }
      } catch (e1) {
        log(
          chalk.grey("\nemail-all-chars-within-ascii-cli: [THROW_ID_06] ") +
            chalk.red(
              `Couldn't fetch the file "${path.basename(requestedPath)}"`
            )
        );
        process.exit(1);
      }
    });
  })
  .catch(() => {
    process.exit(1);
  });
