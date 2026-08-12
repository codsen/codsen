#!/usr/bin/env node

/* eslint no-console:0 */

import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { glob } from "codsen-glob";
import { codsenCLI } from "codsen-utils";
import { enforceKeyset, getKeyset } from "json-comb-core";
import pMap from "p-map";
import updateNotifier from "update-notifier";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const filesystemConcurrency = 32;

async function readJson(file) {
  const contents = (await readFile(file, "utf8")).replace(/^\uFEFF/, "");

  try {
    return JSON.parse(contents);
  } catch (error) {
    error.message = `${file}: ${error.message}`;
    throw error;
  }
}

async function writeJson(
  file,
  value,
  { EOL = "\n", finalEOL = true, replacer = null, spaces } = {},
) {
  const stringified = JSON.stringify(value, replacer, spaces);

  if (stringified === undefined) {
    throw new TypeError(
      `json-comb/writeJson(): [THROW_ID_01] Converting ${typeof value} value to JSON is not supported`,
    );
  }

  await writeFile(
    file,
    stringified.replace(/\n/g, EOL) + (finalEOL ? EOL : ""),
  );
}

const messagePrefix = `\u001b[${90}m${"✨ JSON Comb: "}\u001b[${39}m`;
const { log } = console;
const cli = codsenCLI(
  `
  Usage:
    $ jsoncomb -n "data/**/index.json"

  Mode flags:
    -n, --normalise     Normalise the given JSON's
    -i, --ignore        Don't normalise these object key paths if they have placeholder values
    -t, --tabs          Use tabs instead of default 2 spaces for JSON indentation

    -v, --version       Shows the version of your json-sort-cli
    -h, --help          Shows this help

  Options:
    --tabs          Use TABS for JSON file indentation

  +++++++
    Call anywhere using glob patterns. If you put globs as strings, within quotes,
    this library will parse them. If you put them without quotes, your shell
    will expand them, which might yield different results.
`,
  {
    pkg,
    flags: {
      normalise: {
        type: "boolean",
        shortFlag: "n",
        default: false,
      },
      ignore: {
        type: "string",
        shortFlag: "i",
        isMultiple: true,
      },
      tabs: {
        type: "boolean",
        shortFlag: "t",
      },
      version: {
        type: "boolean",
        shortFlag: "v",
      },
      help: {
        type: "boolean",
        shortFlag: "h",
      },
    },
  },
);
updateNotifier({ pkg }).notify();

// TODO:
// -p, --placeholder   What value to set for newly added keys
//
// -d, --deletepath    Delete content at this path in every given JSON
// --write             Without this flag it will be a dry run, files will not be written
//
// -u, --unused        Find which keys are unused across all the given JSON's

// Step #0. Take care of the short -v and -h flags, which codsenCLI leaves
// to us (it answers the long --version and --help on its own).
// -----------------------------------------------------------------------------

if (cli.flags.version) {
  log(pkg.version);
  process.exit(0);
} else if (cli.flags.help) {
  log(cli.help);
  process.exit(0);
}

// Step #1. Some flags might get put as "flags" values if input string follows the
// flag. For example, "jsoncomb -n test" would put "test" as value of "n", under
// "cli.flags", not under "cli.input". This is bad and need to be fixed.

let { input } = cli;
input = input.concat(
  Object.keys(cli.flags)
    .filter((flag) => {
      if (flag !== "i" && typeof cli.flags[flag] === "string") {
        return true;
      }
      return false;
    })
    .map((key) => cli.flags[key]),
);

// console.log(`cli = ${JSON.stringify(cli, null, 4)}`)

// Step #2. Set up the cli
// -----------------------------------------------------------------------------

// console.log('✨ JSON Comb: start')
// console.log(`cli = ${JSON.stringify(cli, null, 4)}`);
// console.log(`input = ${JSON.stringify(input, null, 4)}`);
// console.log(`cli.flags.d = ${JSON.stringify(cli.flags.d, null, 4)}`)

let paths;

let enforceOpts = {};
if (cli.flags.ignore) {
  enforceOpts = {
    doNotFillThesePathsIfTheyContainPlaceholders: cli.flags.ignore,
  };
}

glob([...input, "!**/node_modules/**", "!**/package-lock.json"], {
  expandDirectories: { files: ["*.json"] },
})
  .then((res) =>
    res.filter(
      (oneOfPaths) =>
        !oneOfPaths.includes("node_modules") &&
        !oneOfPaths.includes("package-lock.json"),
    ),
  )
  .then((finalPathsToProcessArr) => {
    // At this point, we have an array of paths: "finalPathsToProcessArr".
    // It's a result of a resolved promise.

    // console.log(
    //   `\n\n\n\n161 ${`\u001b[${33}m${`finalPathsToProcessArr`}\u001b[${39}m`} = ${JSON.stringify(
    //     finalPathsToProcessArr,
    //     null,
    //     4
    //   )}\n\n\n\n`
    // );

    // console.log(
    //   `${`\u001b[${33}m${`cli.flags`}\u001b[${39}m`} = ${JSON.stringify(
    //     cli.flags,
    //     null,
    //     4
    //   )}`
    // );

    // bail early if there is nothing to work upon:
    if (finalPathsToProcessArr.length === 0) {
      log(`${messagePrefix}[ID_1] Nothing found! Bye!`);
      process.exit(0);
    }
    paths = finalPathsToProcessArr; // make a note of the final paths, we'll need it
    let allFileContentsArr;
    let referenceKeyset;
    if (cli.flags.normalise) {
      // console.log(
      //   `186 ${`\u001b[${33}m${`finalPathsToProcessArr`}\u001b[${39}m`} = ${JSON.stringify(
      //     finalPathsToProcessArr,
      //     null,
      //     4
      //   )}`
      // );
      if (finalPathsToProcessArr.length === 1) {
        log(
          `${messagePrefix}[ID_2] We can't normalise one file (${finalPathsToProcessArr[0]}), we need more than one.`,
        );
        process.exit(0);
      }
      return pMap(paths, readJson, { concurrency: filesystemConcurrency })
        .then((allJsonValuesArr) => {
          // console.log(
          //   `201${`\u001b[${33}m${`allJsonValuesArr`}\u001b[${39}m`} = ${JSON.stringify(
          //     allJsonValuesArr,
          //     null,
          //     4
          //   )}`
          // );
          allFileContentsArr = allJsonValuesArr;
          return getKeyset(allJsonValuesArr);
        })
        .then((keyset) => {
          // console.log(
          //   `${`\u001b[${33}m${`keyset`}\u001b[${39}m`} = ${JSON.stringify(
          //     keyset,
          //     null,
          //     4
          //   )}`
          // );
          referenceKeyset = keyset;
          return pMap(
            paths,
            (singlePath, i) => {
              return enforceKeyset(
                allFileContentsArr[i],
                referenceKeyset,
                enforceOpts,
              ).then((newValue) =>
                writeJson(singlePath, newValue, {
                  spaces: cli.flags.tabs ? "\t" : 2,
                }).then(() => {
                  log(
                    `${messagePrefix}${singlePath} - ${`\u001b[${32}m${"NORMALISED"}\u001b[${39}m`}`,
                  );
                }),
              );
            },
            { concurrency: filesystemConcurrency },
          );
        });
    }
  });
