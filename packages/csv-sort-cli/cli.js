#!/usr/bin/env node

/* eslint array-callback-return:0, consistent-return:0, no-loop-func:0 */

// VARS
// -----------------------------------------------------------------------------

import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { confirm, select } from "@inquirer/prompts";
import { globSync } from "codsen-glob";
import { codsenCLI, pullAll } from "codsen-utils";
import { sort } from "csv-sort";
import updateNotifier from "update-notifier";

const { error: logError, log } = console;

const colours = {
  green: 32,
  red: 31,
  yellow: 33,
};

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const state = {
  toDoList: [],
  overwrite: false,
  stdout: false,
};
const cli = codsenCLI(
  `
  Usage
    $ csvsort YOURFILE.csv
    $ csvsort YOURFILE.csv --stdout
    $ csvsort - < YOURFILE.csv
    $ cat YOURFILE.csv | csvsort
  or, just type "csvsort" and it will let you pick a file.

  Options
    -o, --overwrite   Will overwrite the target file instead
        --stdout      Print the result without writing any files
    -h, --help        Shows this help
    -v, --version     Shows the version of your ${pkg.name}

  Example
    Just call it in the root, where your csv file is located
`,
  {
    pkg,
    flags: {
      overwrite: {
        type: "boolean",
        shortFlag: "o",
        default: false,
      },
      stdout: {
        type: "boolean",
        default: false,
      },
    },
  },
);
updateNotifier({ pkg }).notify();

// FUNCTIONS
// -----------------------------------------------------------------------------

function colour(str, colourCode) {
  return `\u001b[${colourCode}m${str}\u001b[39m`;
}

async function readStdin() {
  let result = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    result += chunk;
  }
  return result;
}

async function readCsv(requestedCSVsPath, readStdinOnce) {
  if (requestedCSVsPath === "-") {
    return readStdinOnce();
  }

  try {
    return await readFile(requestedCSVsPath, "utf8");
  } catch {
    throw new Error(
      `\ncsv-sort-cli: Alas, we couldn't fetch the file "${path.basename(
        requestedCSVsPath,
      )}" you requested!`,
    );
  }
}

function sortCsv(csvData) {
  try {
    return sort(csvData).res.join("\n");
  } catch (error) {
    throw new Error(`\ncsv-sort-cli: Alas, we encountered an error:\n${error}`);
  }
}

async function runFilterMode(requestedCSVsPaths) {
  let stdinPromise;
  function readStdinOnce() {
    if (!stdinPromise) {
      stdinPromise = readStdin();
    }
    return stdinPromise;
  }
  const results = [];

  // Process in operand order so multiple inputs produce deterministic stdout.
  for (const requestedCSVsPath of requestedCSVsPaths) {
    results.push(sortCsv(await readCsv(requestedCSVsPath, readStdinOnce)));
  }

  process.stdout.write(results.join("\n"));
}

async function offerAListOfCSVsToPickFrom(stateObj) {
  let allCSVsHere = globSync(["./*.csv", "!**/node_modules/**"]);
  if (!allCSVsHere.length) {
    return Promise.reject(
      new Error(
        "\ncsv-sort-cli: Alas, program couldn't find any CSV files in this folder!",
      ),
    );
  }

  let chosenCSVFile = await select({
    message: "Which CSV would you like to check?",
    choices: allCSVsHere,
  });

  let overwrite = stateObj?.overwrite === true;

  if (!overwrite) {
    overwrite = await confirm({
      message: "Do you want to overwrite this file with a sorted result?",
    });
  }

  return {
    toDoList: [path.basename(chosenCSVFile)],
    overwrite,
  };
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

// Step #1. gather the to-do list of files.
// -----------------------------------------------------------------------------

if (cli.input.length > 0) {
  state.toDoList = cli.input;
}

// short flags resolve onto their long names, so "-o" arrives as "overwrite"
if (cli.flags.overwrite) {
  state.overwrite = true; // we normalise the flag since its value in CLI can precede
}
if (cli.flags.stdout) {
  state.stdout = true;
}

state.toDoList = [...new Set(state.toDoList)];

const hasExplicitStdin = state.toDoList.includes("-");
const hasImplicitStdin =
  state.toDoList.length === 0 && process.stdin.isTTY !== true;
const isFilterMode = state.stdout || hasExplicitStdin || hasImplicitStdin;

// Step #2. create a promise variable and assign it to one of the promises,
// depending on was the acceptable file passed via args or queries afterwards.
// -----------------------------------------------------------------------------
let thePromise;
if (isFilterMode) {
  const filterSources = state.toDoList.length ? state.toDoList : ["-"];
  thePromise = runFilterMode(filterSources);
} else if (state.toDoList.length === 0) {
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
    state.toDoList
      .map((onePath) => path.resolve(onePath))
      .filter(fs.existsSync),
  ).map((singlePath) => path.basename(singlePath)); // then filtering file names-only

  // write the list of unrecognised file names into the console:
  if (erroneous.length > 0) {
    logError(
      colour(
        `\ncsv-sort-cli: Alas, the following file${
          erroneous.length > 1 ? "s don't" : " doesn't"
        } exist: "${erroneous.join('", "')}"`,
        colours.red,
      ),
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
  logError(
    colour(
      `\ncsv-sort-cli: Program didn't recognise any CSV files in your input!\n${butStateWasRecognisedMsg}`,
      colours.yellow,
    ),
  );

  // if there were no valid path in the arguments, query the files from the
  // existing CSV's in the current folder:
  thePromise = offerAListOfCSVsToPickFrom(state);
}

// Step #3.
// -----------------------------------------------------------------------------

if (!isFilterMode) {
  thePromise = thePromise.then(async (receivedState) => {
    await Promise.all(
      receivedState.toDoList.map(async (requestedCSVsPath) => {
        const csvData = await readCsv(requestedCSVsPath);
        const cleaned = sortCsv(csvData);

        try {
          if (receivedState.overwrite) {
            await writeFile(path.basename(requestedCSVsPath), cleaned, "utf8");
            logError(
              colour(
                `csv-sort-cli: Yay! The ${path.basename(
                  requestedCSVsPath,
                )} has been fixed and overwritten! Check it out.`,
                colours.green,
              ),
            );
            return;
          }

          // create a new file with appended hyphen+integer before extension
          for (let i = 1; i < 1001; i++) {
            const proposedNewFileName = `${path.basename(
              requestedCSVsPath,
              path.extname(requestedCSVsPath),
            )}-${i}${path.extname(requestedCSVsPath)}`;
            if (!fs.existsSync(path.resolve(proposedNewFileName))) {
              await writeFile(proposedNewFileName, cleaned, "utf8");
              logError(
                colour(
                  `csv-sort-cli: Yay! A new file, ${proposedNewFileName} has been created! Check it out.`,
                  colours.green,
                ),
              );
              return;
            }
          }

          throw new Error(
            `Could not create an output file for "${path.basename(
              requestedCSVsPath,
            )}" because names 1–1000 are already taken.`,
          );
        } catch (error) {
          throw new Error(
            `\ncsv-sort-cli: Alas, we encountered an error:\n${error}`,
          );
        }
      }),
    );
  });
}

thePromise.catch((err) => {
  logError(colour(err, colours.red));
  process.exitCode = 1;
});
