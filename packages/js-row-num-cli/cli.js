#!/usr/bin/env node

import meow from "meow";
import { promises as fs } from "fs";
import pReduce from "p-reduce";
import isDirectory from "is-d";
import { globby } from "globby";
import { promisify } from "util";
import { createRequire } from "module";
import { fixRowNums } from "js-row-num";
import updateNotifier from "update-notifier";
import { arrayiffy } from "arrayiffy-if-string";
import writeFileAtomic from "write-file-atomic";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const write = promisify(writeFileAtomic);

function existy(x) {
  return x != null;
}
const { log } = console;
const messagePrefix = `\u001b[${90}m${"✨ js-row-num-cli: "}\u001b[${39}m`;

const locationsArr = [
  "./src/*.js",
  "./test/*.js",
  "./main.js",
  "./cli.js",
  "./index.js",
  "!**/node_modules/**",
];

const cli = meow(
  `
  Call either way:
    $ jsrownum
    $ jrn
    $ jrn -t "log"
  for example, above, "log" would update "1" in: log(\`1 a = \${a}\`)

  Options:
    --pad, -p      Let's you set the padding of the row numbers. Default = 3.
    --trigger, -t  Let's you customise the functions where row numbers are updated

    --help, -h     Shows help
    --version, -v  Shows the current version

  Example:
    jrn -p 2 "*.js"
    jrn --pad="2"
    jrn --trigger "log"
    jsrownum -h
    jsrownum --version
`,
  {
    importMeta: import.meta,
    flags: {
      pad: {
        type: "number",
        shortFlag: "p",
      },
      trigger: {
        type: "string",
        shortFlag: "t",
      },
    },
  }
);
updateNotifier({ pkg }).notify();

function readUpdateAndWriteOverFile(oneOfPaths) {
  return fs
    .readFile(oneOfPaths, "utf8")
    .then((filesContent) => {
      let conf = {
        padStart: existy(cli.flags.pad) ? cli.flags.pad : 3,
      };
      if (cli.flags.trigger) {
        conf.triggerKeywords = arrayiffy(cli.flags.trigger);
      }

      return write(oneOfPaths, fixRowNums(filesContent, conf).result).then(
        () => {
          log(
            `${messagePrefix}${oneOfPaths} - ${`\u001b[${32}m${"OK"}\u001b[${39}m`}`
          );
          return true;
        }
      );
    })
    .catch((err) => {
      console.log(
        `${oneOfPaths} - ${`\u001b[${31}m${"BAD"}\u001b[${39}m`} - ${err}`
      );
    });
}

function processPaths(paths) {
  return (
    globby(paths)
      .then((receivedPaths) =>
        pReduce(
          receivedPaths,
          (concattedTotal, singleDirOrFilePath) =>
            concattedTotal.concat(
              isDirectory(singleDirOrFilePath).then((bool) =>
                bool
                  ? globby(singleDirOrFilePath, {
                      expandDirectories: {
                        files: ["*.js"],
                      },
                    })
                  : [singleDirOrFilePath]
              )
            ),
          []
        )
      )
      // then reduce again, now actually concatenating them all together
      .then((received) =>
        pReduce(received, (total, single) => total.concat(single), [])
      )
      .then((res) =>
        res.filter((oneOfPaths) => !oneOfPaths.includes("node_modules"))
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
                    }
              )
              .catch((err) => {
                log(
                  `${messagePrefix}${`\u001b[${31}m${"Could not write out the file:"}\u001b[${39}m`}\n${err}`
                );
                return counter;
              }),
          { good: [], bad: [] }
        ).then((counter) => {
          let message;
          if (
            (!counter.bad || !counter.bad.length) &&
            (!counter.good || !counter.good.length)
          ) {
            message = "Nothing to fix.";
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
              counter.bad && counter.bad.length
                ? `\n${messagePrefix}${`\u001b[${31}m${`${
                    counter.bad.length
                  } file${
                    counter.bad.length === 1 ? "" : "s"
                  } could not be updated`}\u001b[${39}m`} ${`\u001b[${90}m - ${counter.bad.join(
                    " - "
                  )}\u001b[${39}m`}`
                : ""
            }`;
          }
          log(`\n${messagePrefix}${message}`);
        })
      )
  );
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

// Step #1. were any paths given or not?
// -----------------------------------------------------------------------------

if (cli.input.length) {
  processPaths(cli.input);
} else {
  processPaths(locationsArr);
}
