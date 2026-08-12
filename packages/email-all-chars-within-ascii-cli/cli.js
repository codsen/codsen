#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { select } from "@inquirer/prompts";
import { globSync } from "codsen-glob";
import { codsenCLI, pullAll } from "codsen-utils";
import { within } from "email-all-chars-within-ascii";
import { right } from "string-left-right";
import updateNotifier from "update-notifier";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const { log } = console;

const colours = {
  cyan: 36,
  green: 32,
  grey: 90,
  red: 31,
  yellow: 33,
};

const state = {};
state.toDoList = []; // default

const cli = codsenCLI(
  `
  Usage
    $ withinascii YOURFILE.html
  or, just type "withinascii" and it will let you pick a file

  Options
    -l, --len         Max allowed line length (default is 500)
    -h, --help        Shows this help
    -v, --version     Shows the version of your ${pkg.name}

  Instructions
    Just call it in the folder where your file is located or provide a path
`,
  {
    pkg,
    flags: {
      len: {
        type: "number",
        shortFlag: "l",
      },
    },
  },
);
updateNotifier({ pkg }).notify();

function colour(str, colourCode) {
  return `\u001b[${colourCode}m${str}\u001b[39m`;
}

function inverse(str) {
  return `\u001b[7m${str}\u001b[27m`;
}

async function offerAListOfFilesToPickFrom() {
  let allFilesHere = globSync(["./*.*", "!**/node_modules/**"]);
  if (!allFilesHere.length) {
    log(
      colour(
        "\nemail-all-chars-within-ascii-cli/offerAListOfFilesToPickFrom(): [THROW_ID_01] ",
        colours.grey,
      ) + colour("Alas, there are no files in this folder!", colours.red),
    );
    return process.exit(1);
  }

  let chosenFile = await select({
    message: "Which file would you like to check?",
    choices: allFilesHere,
  });

  return {
    toDoList: [path.basename(chosenFile)],
  };
}

// Step #0. take care of the short -v and -h flags, which codsenCLI leaves
// to us (it answers the long --version and --help on its own).
// -----------------------------------------------------------------------------

if (cli.flags.v || cli.flags.version) {
  log(pkg.version);
  process.exit(0);
} else if (cli.flags.h || cli.flags.help) {
  log(cli.help);
  process.exit(0);
}

// Step #1. gather the to-do list of files.
// -----------------------------------------------------------------------------

state.toDoList = cli.input;

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
    state.toDoList
      .map((onePath) => path.resolve(onePath))
      .filter(fs.existsSync),
  ).map((singlePath) => path.basename(singlePath)); // then filtering file names-only

  // write the list of unrecognised file names into the console:
  if (erroneous.length) {
    log(
      colour(
        "\nemail-all-chars-within-ascii-cli/main(): [THROW_ID_02] ",
        colours.grey,
      ) +
        colour(
          `Alas, the following file${
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
  log(
    colour(
      "\nemail-all-chars-within-ascii-cli/main(): [THROW_ID_03] Didn't recognise any files!",
      colours.yellow,
    ),
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
        // an empty "--len" with no value after it comes through as undefined
        let lineLength = cli.flags.len;
        let findings = within(filesContents, {
          lineLength,
        });
        if (findings.length) {
          noErrors = false;
          console.log(
            colour("\nemail-all-chars-within-ascii-cli:", colours.grey),
          );
          findings.forEach((obj) => {
            if (obj.type === "character") {
              console.log(
                `\n${colour(fileNameInfo, colours.cyan)}:${colour(
                  obj.line,
                  colours.yellow,
                )}:${colour(obj.column, colours.yellow)} - ${colour(
                  "bad character",
                  colours.red,
                )} - ${obj.value} ${colour(
                  `(https://www.fileformat.info/info/unicode/char/${obj.UTF32Hex}/index.htm)`,
                  colours.grey,
                )}`,
              );
            } else {
              console.log(
                `\n${colour(fileNameInfo, colours.cyan)}:${colour(
                  obj.line,
                  colours.yellow,
                )} - ${colour(
                  `${obj.value} character-long line (limit ${
                    cli.flags.len || 500
                  })`,
                  colours.red,
                )}`,
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
              startingPos,
            );
            let sliceTo = Math.min(
              ...[
                filesContents.indexOf("\n", obj.positionIdx),
                filesContents.indexOf("\r", obj.positionIdx),
                obj.positionIdx + 10,
              ].filter((val) => val > 0),
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
            console.log(`\n${inverse(obj.line)} ${currLinesChunk}`);
            console.log(
              `${inverse(" ".repeat(String(obj.line).length))} ${" ".repeat(
                obj.positionIdx -
                  sliceFrom -
                  (obj.type === "character" ? 0 : 1),
              )}${colour("~", colours.red)}`,
            );
          });

          process.exit(noErrors ? 0 : 1);
        } else {
          console.log(
            `${colour("email-all-chars-within-ascii-cli:", colours.grey)} ${colour(
              "ALL OK",
              colours.green,
            )}`,
          );
          process.exit(0);
        }
      } catch (_e1) {
        log(
          colour(
            "\nemail-all-chars-within-ascii-cli/main(): [THROW_ID_04] ",
            colours.grey,
          ) +
            colour(
              `Couldn't fetch the file "${path.basename(requestedPath)}"`,
              colours.red,
            ),
        );
        process.exit(1);
      }
    });
  })
  .catch(() => {
    process.exit(1);
  });
