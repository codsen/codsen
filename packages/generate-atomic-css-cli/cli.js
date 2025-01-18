#!/usr/bin/env node

/* eslint no-console:0 */

import meow from "meow";
import { promises as fs } from "fs";
import pReduce from "p-reduce";
import isDirectory from "is-d";
import { globby } from "globby";
import { promisify } from "util";
import { createRequire } from "module";
import updateNotifier from "update-notifier";
import writeFileAtomic from "write-file-atomic";
import { genAtomic, version } from "generate-atomic-css";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");
const write = promisify(writeFileAtomic);

const { log } = console;
const messagePrefix = `\u001b[${90}m${"✨ generate-atomic-css-cli: "}\u001b[${39}m`;

const cli = meow(
  `
  Call either way:
    $ gac index.html
    $ gac "scss/*.html"
    $ gac "util/*/*.*"

  Options:
    --help, -h     Shows help
    --version, -v  Shows the current version

  Example:
    gac "*.html"
    gac -h
    gac --version
`,
  {
    importMeta: import.meta,
  },
);
updateNotifier({ pkg }).notify();

function readUpdateAndWriteOverFile(oneOfPaths) {
  return fs
    .readFile(oneOfPaths, "utf8")
    .then((filesContent) => {
      return write(oneOfPaths, genAtomic(filesContent).result).then(() => {
        log(
          `${messagePrefix}${oneOfPaths} - ${`\u001b[${32}m${"OK"}\u001b[${39}m`}`,
        );
        return true;
      });
    })
    .catch((err) => {
      console.log(
        `${oneOfPaths} - ${`\u001b[${31}m${"BAD"}\u001b[${39}m`} - ${err}`,
      );
    });
}

function processPaths(incomingPaths) {
  return (
    globby(incomingPaths)
      .then((paths) =>
        pReduce(
          paths,
          (concattedTotal, singleDirOrFilePath) =>
            concattedTotal.concat(
              isDirectory(singleDirOrFilePath).then((bool) =>
                bool
                  ? globby(singleDirOrFilePath, {
                      expandDirectories: {
                        files: ["*.js"],
                      },
                    })
                  : [singleDirOrFilePath],
              ),
            ),
          [],
        ),
      )
      // then reduce again, now actually concatenating them all together
      .then((received) =>
        pReduce(received, (total, single) => total.concat(single), []),
      )
      .then((res) =>
        res.filter((oneOfPaths) => !oneOfPaths.includes("node_modules")),
      )
      .then((received) =>
        pReduce(
          received,
          (counter, currentPath) =>
            readUpdateAndWriteOverFile(currentPath)
              .then((res) =>
                res
                  ? {
                      good: counter.good.concat([currentPath]),
                      bad: counter.bad,
                    }
                  : {
                      good: counter.good,
                      bad: counter.bad.concat([currentPath]),
                    },
              )
              .catch((err) => {
                log(
                  `${messagePrefix}${`\u001b[${31}m${"Could not write out the file:"}\u001b[${39}m`}\n${err}`,
                );
                return counter;
              }),
          { good: [], bad: [] },
        ).then((counter) => {
          let message;
          if (!counter.bad?.length && !counter.good?.length) {
            message = "Nothing to process.";
          } else {
            message = `${`\u001b[${32}m${`${
              counter.bad &&
              counter.bad.length === 0 &&
              counter.good.length !== 1
                ? "All "
                : ""
            }${counter.good.length} file${
              counter.good.length === 1 ? "" : "s"
            } updated`}\u001b[${39}m`}${
              counter?.bad.length
                ? `\n${messagePrefix}${`\u001b[${31}m${`${
                    counter.bad.length
                  } file${
                    counter.bad.length === 1 ? "" : "s"
                  } could not be updated`}\u001b[${39}m`} ${`\u001b[${90}m - ${counter.bad.join(
                    " - ",
                  )}\u001b[${39}m`}`
                : ""
            }`;
          }
          log(`\n${messagePrefix}${message}`);
        }),
      )
  );
}

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (cli.flags.v) {
  log(`cli: ${pkg.version}; api: ${version}`);
  process.exit(0);
} else if (cli.flags.h) {
  log(cli.help);
  process.exit(0);
}

// Step #1. were any paths given or not?
// -----------------------------------------------------------------------------

if (cli.input.length) {
  processPaths(cli.input);
}
