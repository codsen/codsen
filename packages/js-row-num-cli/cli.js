#!/usr/bin/env node

/* eslint no-console:0 */

const meow = require("meow");
const fs = require("fs-extra");
const globby = require("globby");
const pReduce = require("p-reduce");
const isDirectory = require("is-d");

const fixRowNums = require("js-row-num");
const updateNotifier = require("update-notifier");

function existy(x) {
  return x != null;
}
const { log } = console;
const messagePrefix = `\u001b[${90}m${"✨ js-row-num-cli: "}\u001b[${39}m`;

const locationsArr = [
  "./src/main.js",
  "./main.js",
  "./cli.js",
  "./index.js",
  "./src/index.js"
];

const cli = meow(
  `
  Call either way:
    $ jsrownum
    $ jrn

  Options:
    --pad, -p      Let's you set the padding of the row numbers. Default = 3.

    --help, -h     Shows help
    --version, -v  Shows the current version

  Example:
    jrn -p 2 "*.js"
    jrn --pad="2"
    jsrownum -h
    jsrownum --version
`,
  {
    flags: {
      pad: {
        type: "number",
        alias: "p"
      }
    }
  }
);
updateNotifier({ pkg: cli.pkg }).notify();

const paddingVal = existy(cli.flags.pad) ? cli.flags.pad : 3;

function readUpdateAndWriteOverFile(oneOfPaths) {
  return fs
    .readFile(oneOfPaths, "utf8")
    .then(filesContent => {
      return fs
        .writeFile(
          oneOfPaths,
          fixRowNums(filesContent, { padStart: paddingVal })
        )
        .then(() => {
          log(
            `${messagePrefix}${oneOfPaths} - ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`
          );
          return true;
        });
    })
    .catch(err => {
      `${oneOfPaths} - ${`\u001b[${31}m${`BAD`}\u001b[${39}m`} - ${err}`;
    });
}

function processPaths(paths) {
  return (
    globby(paths)
      .then(paths =>
        pReduce(
          paths,
          (concattedTotal, singleDirOrFilePath) =>
            concattedTotal.concat(
              isDirectory(singleDirOrFilePath).then(
                bool =>
                  bool
                    ? globby(singleDirOrFilePath, {
                        expandDirectories: {
                          files: ["*.js"]
                        }
                      })
                    : [singleDirOrFilePath]
              )
            ),
          []
        )
      )
      // then reduce again, now actually concatenating them all together
      .then(received =>
        pReduce(received, (total, single) => total.concat(single), [])
      )
      .then(res =>
        res.filter(oneOfPaths => !oneOfPaths.includes("node_modules"))
      )
      .then(received =>
        pReduce(
          received,
          (counter, currentPath) =>
            readUpdateAndWriteOverFile(currentPath)
              .then(
                res =>
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
                  `${messagePrefix}${`\u001b[${31}m${`Could not write out the file:`}\u001b[${39}m`}\n${err}`
                );
                return counter;
              }),
          { good: [], bad: [] }
        ).then(counter => {
          log(
            `\n${messagePrefix}${`\u001b[${32}m${`${
              counter.bad &&
              counter.bad.length === 0 &&
              counter.good.length !== 1
                ? "All "
                : ""
            }${counter.good.length} file${
              counter.good.length === 1 ? "" : "s"
            } updated`}\u001b[${39}m`}${
              counter.bad && counter.bad.length
                ? `\n${messagePrefix}${`\u001b[${31}m${`${
                    counter.bad.length
                  } file${
                    counter.bad.length === 1 ? "" : "s"
                  } could not be updated`}\u001b[${39}m`} ${`\u001b[${90}m - ${counter.bad.join(
                    " - "
                  )}\u001b[${39}m`}`
                : ""
            }`
          );
        })
      )
  );
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

// Step #1. were any paths given or not?
// -----------------------------------------------------------------------------

if (cli.input.length) {
  processPaths(cli.input);
} else {
  processPaths(locationsArr);
}
