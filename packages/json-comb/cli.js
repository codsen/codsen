#!/usr/bin/env node
/* eslint no-console:0 */

import meow from "meow";
import path from "path";
import pMap from "p-map";
import fs from "fs-extra";
import isDirectory from "is-d";
import pReduce from "p-reduce";
import { globby } from "globby";
import { createRequire } from "module";
import updateNotifier from "update-notifier";
import { getKeyset, enforceKeyset } from "json-comb-core";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const messagePrefix = `\u001b[${90}m${"✨ JSON Comb: "}\u001b[${39}m`;
const { log } = console;
const cli = meow(
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
    importMeta: import.meta,
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
  }
);
updateNotifier({ pkg }).notify();

// TODO:
// -p, --placeholder   What value to set for newly added keys
//
// -d, --deletepath    Delete content at this path in every given JSON
// --write             Without this flag it will be a dry run, files will not be written
//
// -u, --unused        Find which keys are unused across all the given JSON's

// Step #0. Take care of -v and -h flags that are left out in meow.
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
    .map((key) => cli.flags[key])
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

globby(input)
  .then((resolvedPathsArray) =>
    pReduce(
      resolvedPathsArray, // input
      (concattedTotal, singleDirOrFilePath) =>
        concattedTotal // reducer
          .concat(
            isDirectory(singleDirOrFilePath).then((bool) =>
              bool
                ? globby(
                    path.join(singleDirOrFilePath, "**/*.json"),
                    "!node_modules"
                  )
                : [singleDirOrFilePath]
            )
          ),
      [] // initialValue
    ).then((received) =>
      pReduce(received, (total, single) => total.concat(single), [])
    )
  )
  .then((res) =>
    res.filter(
      (oneOfPaths) =>
        !oneOfPaths.includes("node_modules") &&
        !oneOfPaths.includes("package-lock.json")
    )
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
          `${messagePrefix}[ID_2] We can't normalise one file (${finalPathsToProcessArr[0]}), we need more than one.`
        );
        process.exit(0);
      }
      return pMap(paths, (oneOfPaths) => fs.readJson(oneOfPaths))
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
          return pMap(paths, (singlePath, i) => {
            return enforceKeyset(
              allFileContentsArr[i],
              referenceKeyset,
              enforceOpts
            ).then((newValue) =>
              fs
                .writeJson(singlePath, newValue, {
                  spaces: cli.flags.tabs ? "\t" : 2,
                })
                .then(() => {
                  log(
                    `${messagePrefix}${singlePath} - ${`\u001b[${32}m${"NORMALISED"}\u001b[${39}m`}`
                  );
                })
            );
          });
        });
    }
  });
