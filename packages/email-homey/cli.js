#!/usr/bin/env node

/* eslint no-console:0 */

import fs from "fs";
import meow from "meow";
import path from "path";
import chalk from "chalk";
import uniq from "lodash.uniq";
import { globby } from "globby";
import splice from "string-splice";
import logSymbols from "log-symbols";
import { createRequire } from "module";
import updateNotifier from "update-notifier";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const { log } = console;
const state = {};
state.toDoList = []; // default

// operational vars
let seedData;
state.quoteStyle = '"';
let finalTemplateString = "";
let paths = [];

const cli = meow(
  `
  Usage
    $ homey "dist"

  Options
    --loud, -l  Will not perform all operations silently

  Example
    Just point it towards the template root folder.
`,
  {
    importMeta: import.meta,
    alias: {
      l: "loud",
    },
  }
);
updateNotifier({ pkg }).notify();

//                       +------------------------+
//                       |                        |
//                       |  FUNCTIONS (STEPS 4-5) |
//                       |      ASYNC STEPS       |
//                       |                        |
//                       +------------------------+

// Step #5. Parse the seed template
// -----------------------------------------------------------------------------

function step5() {
  let indexOfThePlaceholder = null;
  let marker = "magicFoldersList";
  indexOfThePlaceholder = seedData.indexOf(marker);

  // find the quotes style
  if (seedData[indexOfThePlaceholder - 1]) {
    state.quoteStyle = "'";
  }

  let indented = true;
  let indentationStartsAt = 0;
  // traverse backwards and find the indentation
  for (let i = indexOfThePlaceholder - 1; i--; ) {
    if (seedData[i] === "\n" || seedData[i] === "\r" || seedData[i] === "[") {
      indentationStartsAt = i;
      if (seedData[i] === "[") {
        indented = false;
      }
      break;
    }
  }

  let insertThis = paths
    .sort()
    .map(
      (val, i) =>
        (i !== 0
          ? seedData.slice(indentationStartsAt + 1, indexOfThePlaceholder - 1)
          : "") +
        state.quoteStyle +
        val +
        state.quoteStyle
    );

  if (indented) {
    insertThis = insertThis.join(",\n");
  } else {
    insertThis = insertThis.join(", ");
  }

  // calculate the final template string (which will be written to a new file):
  finalTemplateString = splice(
    seedData,
    indexOfThePlaceholder - 1,
    marker.length + 2,
    insertThis
  );

  // write out the template:
  fs.writeFile(
    path.join(path.resolve(state.toDoList[0]), "index.html"),
    finalTemplateString,
    (err) => {
      if (err) {
        throw err;
      } else {
        log(
          `${chalk.green(
            logSymbols.success,
            "email-homey: index.html written OK"
          )}`
        );
      }
    }
  );
}

// Step #4. Read the seed template
// -----------------------------------------------------------------------------

function step4() {
  // console.log(`state.toDoList[0] = ${JSON.stringify(state.toDoList[0], null, 4)}`)
  fs.readFile(
    path.join(state.toDoList[0], "seed.html"),
    "utf8",
    (err, readSeedData) => {
      if (err) {
        if (cli.flags.loud) {
          log(
            `${chalk.red(
              logSymbols.error,
              "Computer couldn't fetch the seed.html. That's very bad."
            )}`
          );
        }
        process.exit(0);
      }
      seedData = readSeedData;
      step5();
    }
  );
}

//                             +-------------------+
//                             |                   |
//                             | SYNCHRONOUS PARTS |
//                             |    (STEPS 0-3)    |
//                             |                   |
//                             +-------------------+

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

// Step #2. Take care of flags vs input arrangement
// -----------------------------------------------------------------------------

// if --loud/-l flag is used, the following argument will be put as flag's
// value, not in "cli.input[]":
// we anticipate the can be multiple, potentially-false flags mixed with valid file names
if (Object.keys(cli.flags).length !== 0) {
  // each non-boolean cli.flags value must be added to the `toDoList`
  Object.keys(cli.flags).forEach((key) => {
    if (typeof cli.flags[key] === "string") {
      state.toDoList.push(cli.flags[key]);
    }
  });
  state.toDoList = uniq(state.toDoList);
}

// Step #3. Crunch the input and extract the list of folders in each
// -----------------------------------------------------------------------------

// console.log(`state.toDoList = ${JSON.stringify(state.toDoList, null, 4)}`);

if (state.toDoList.length === 0) {
  if (cli.flags.l) {
    log("Nothing to work with! Bye.");
  }
  process.exit(0);
} else if (state.toDoList.length > 1) {
  log(
    `Too many directories given!\n${JSON.stringify(state.toDoList, null, 4)}`
  );
  process.exit(0);
} else {
  let workingPath = path.join(state.toDoList[0], "*");
  // console.log(`\n\u001b[${33}m${`workingPath: ${workingPath}`}\u001b[${39}m\n`);
  globby(workingPath, { onlyDirectories: true })
    .then((folderPaths) => {
      // console.log(`209. folderPaths = ${JSON.stringify(folderPaths, null, 4)}`);
      return folderPaths;
    })
    .then((folderPaths) =>
      folderPaths.map((singlePath) => {
        let tempArr = singlePath.split(path.sep);
        return tempArr[tempArr.length - 1];
      })
    )
    .then((folderPaths) => {
      // console.log(`\nfolderPaths = ${JSON.stringify(folderPaths, null, 4)}`);
      paths = folderPaths;
      step4();
    });
}
