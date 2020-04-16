#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

const chalk = require("chalk");
const within = require("email-all-chars-within-ascii");
const fs = require("fs-extra");
const globby = require("globby");
const inquirer = require("inquirer");

const { log } = console;
const meow = require("meow");
const path = require("path");
const updateNotifier = require("update-notifier");
const pullAll = require("lodash.pullall");
const uniq = require("lodash.uniq");
const { name } = require("./package.json");

const isArr = Array.isArray;

const state = {};
state.toDoList = []; // default
const ui = new inquirer.ui.BottomBar();
const cli = meow(`
  Usage
    $ withinascii YOURFILE.html
  or, just type "withinascii" and it will let you pick a file.

  Options
    -h, --help        Shows this help
    -v, --version     Shows the version of your ${name}

  Instructions
    Just call it in the folder where your file is located or provide a path
`);
updateNotifier({ pkg: cli.pkg }).notify();

// FUNCTIONS
// -----------------------------------------------------------------------------

function isStr(something) {
  return typeof something === "string";
}

function offerAListOfFilesToPickFrom() {
  const allFilesHere = globby.sync("./*.*");
  if (!allFilesHere.length) {
    log(
      chalk.hex("#888888")(
        "\nemail-all-chars-within-ascii-cli: [THROW_ID_01] "
      ) + chalk.red(`Alas, there are no files in this folder!`)
    );
    return process.exit(1);
  }
  ui.log.write(chalk.grey("To quit, press CTRL+C"));
  const questions = [
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

if (cli.flags.v) {
  log(cli.pkg.version);
  process.exit(0);
} else if (cli.flags.h) {
  log(cli.help);
  process.exit(0);
}

// Step #1. gather the to-do list of files.
// -----------------------------------------------------------------------------

if (cli.input.length) {
  state.toDoList = cli.input;
}

// we anticipate the can be multiple, potentially-false flags mixed with valid file names
if (Object.keys(cli.flags).length) {
  // each non-boolean cli.flags value must be added to the `toDoList`
  Object.keys(cli.flags).forEach((key) => {
    if (typeof cli.flags[key] !== "boolean") {
      if (!isArr(cli.flags[key])) {
        state.toDoList.push(cli.flags[key]);
      } else {
        state.toDoList = state.toDoList.concat(
          cli.flags[key].filter((val) => isStr(val))
        );
      }
    }
  });
  state.toDoList = uniq(state.toDoList);
}

// Step #2. create a promise variable and assign it to one of the promises,
// depending on was the acceptable file passed via args or queries afterwards.
// -----------------------------------------------------------------------------
let thePromise;
if (!state.toDoList.length && !Object.keys(cli.flags).length) {
  // ---------------------------------  1  -------------------------------------
  // if no arguments were given, offer a list:
  thePromise = offerAListOfFilesToPickFrom(state);
} else if (
  state.toDoList.map((onePath) => path.resolve(onePath)).filter(fs.existsSync)
    .length
) {
  // ---------------------------------  2  -------------------------------------
  // basically achieving: (!fs.existsSync)
  const erroneous = pullAll(
    state.toDoList.map((onePath) => path.resolve(onePath)),
    state.toDoList.map((onePath) => path.resolve(onePath)).filter(fs.existsSync)
  ).map((singlePath) => path.basename(singlePath)); // then filtering file names-only

  // write the list of unrecognised file names into the console:
  if (erroneous.length) {
    log(
      chalk.hex("#888888")(
        "\nemail-all-chars-within-ascii-cli: [THROW_ID_02] "
      ) +
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
      "\nemail-all-chars-within-ascii-cli: [THROW_ID_03] Computer didn't recognise any files in your input!"
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
        fileNameInfo = `${path.basename(requestedPath)} `;
      }
      try {
        filesContents = String(fs.readFileSync(requestedPath));
        try {
          within(filesContents, { messageOnly: true });
          log(
            chalk.hex("#888888")(
              "\nemail-all-chars-within-ascii-cli: [THROW_ID_04] "
            ) +
              fileNameInfo +
              chalk.green("ALL OK")
          );
        } catch (e2) {
          let msg = e2.toString();
          if (msg.slice(0, 7) === "Error: ") {
            msg = msg.slice(7);
          }
          log(
            chalk.hex("#888888")(
              "\nemail-all-chars-within-ascii-cli: [THROW_ID_05] "
            ) +
              fileNameInfo +
              chalk.red(msg)
          );
          noErrors = false;
        }
      } catch (e1) {
        log(
          chalk.hex("#888888")(
            "\nemail-all-chars-within-ascii-cli: [THROW_ID_06] "
          ) +
            chalk.red(
              `Alas, computer couldn't fetch the file "${path.basename(
                requestedPath
              )}" you requested and bailed on us!`
            )
        );
        noErrors = false;
      }
    });
    // console.log("210");
    return Promise.resolve(noErrors);
  })
  .then((noErrors) => {
    // console.log("214");
    return process.exit(noErrors ? 0 : 1);
  })
  .catch(() => {
    // console.log("218");
    return Promise.resolve(process.exit(1));
  });
