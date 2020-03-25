#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

const start = Date.now();
const fs = require("fs-extra");
const chalk = require("chalk");
const globby = require("globby");
const meow = require("meow");
const path = require("path");
const updateNotifier = require("update-notifier");
const pReduce = require("p-reduce");
const pFilter = require("p-filter");
const clean = require("lerna-clean-changelogs");
const { promisify } = require("util");
const write = require("write-file-atomic");

const { log } = console;
const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
function isObj(something) {
  return typeof something === "object";
}
function formatTime(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${Math.round(ms / 1000)}s`;
}
const cli = meow(
  `
  Usage
    $ lcc
    $ lcc changelog.md
    $ lcc "packages/**/changelog.md"
    $ lernacleanchangelog
    $ lernacleanchangelog "test*/changelog.md"
    $ lernacleanchangelog "**"

  Options
    -h, --help          Shows this help
    -v, --version       Shows the current version
`
);
updateNotifier({ pkg: cli.pkg }).notify();
const signature = chalk.grey("✨ lerna-clean-changelogs-cli: ");

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (cli.flags.v) {
  log(cli.pkg.version);
  process.exit(0);
} else if (cli.flags.h) {
  log(cli.help);
  process.exit(0);
}

// FUNCTIONS
// -----------------------------------------------------------------------------

function readSortAndWriteOverFile(oneOfPaths) {
  return fs
    .readFile(oneOfPaths, "utf8")
    .then((filesContent) => {
      let preppedContents;
      try {
        preppedContents = clean(filesContent);
      } catch (err) {
        return null;
      }
      // don't write empty files:
      if (
        (!isObj(preppedContents) && !preppedContents.length) ||
        (isObj(preppedContents) && preppedContents.res === filesContent)
      ) {
        // return "ok";
        return "skipped";
      }
      // by this point, there should be some valid content to write
      return promisify(write)(oneOfPaths, preppedContents.res).then(() => {
        return "ok";
      });
    })
    .catch((err) => {
      `${oneOfPaths} - ${err}`;
    });
}

// -----------------------------------------------------------------------------

// Create a promise variable and assign it to one of the promises,
// depending on was was passed via input arguments.
let thePromise;

// SYNCHRONOUS PART:
if (isArr(cli.input) && cli.input.length) {
  // expand each path under globby:
  thePromise = pReduce(
    cli.input,
    (total, curr) => {
      return globby([curr, "!**/node_modules/**"]).then((res) => {
        if (res) {
          // add only unique paths:
          return total.concat(res.filter((p) => !total.includes(p)));
        }
        return total;
      });
    },
    []
  ).then((preppedPathsArr) => {
    if (!preppedPathsArr.length) {
      log(`${signature}${chalk.red("no changelogs found")}`);
      process.exit(0);
    }

    return pFilter(preppedPathsArr, (onePath) =>
      fs.stat(path.resolve(onePath)).catch(() => {
        return Promise.resolve(false);
      })
    ).then((resultArr) => {
      if (!isArr(resultArr) || !resultArr.length) {
        // spinner.warn("no changelogs found");
        process.exit(0);
      } else {
        // filter changelog files
        return resultArr.filter(
          (p) =>
            isStr(path.basename(p)) &&
            path.basename(p).toLowerCase() === "changelog.md"
        );
      }
    });
  });
} else {
  thePromise = globby(["**/changelog.md", "!**/node_modules/**"]);
}

// ASYNCHRONOUS PART:
thePromise.then((received) => {
  if (!isArr(received) || !received.length) {
    // spinner.warn("no changelogs found");
    log(`${signature}${chalk.red("no changelogs found")}`);
    process.exit(0);
  }
  return pReduce(
    received,
    (counter, currentPath) =>
      readSortAndWriteOverFile(currentPath)
        .then((res) =>
          res
            ? res === "ok"
              ? {
                  good: counter.good.concat([currentPath]),
                  bad: counter.bad,
                  ignored: counter.ignored,
                }
              : {
                  good: counter.good,
                  bad: counter.bad,
                  ignored: counter.ignored.concat([currentPath]),
                }
            : {
                good: counter.good,
                bad: counter.bad.concat([currentPath]),
                ignored: counter.ignored,
              }
        )
        .catch((err) => {
          log(
            `${signature}${chalk.red(
              "Could not write the cleaned file:"
            )} ${err}`
          );
          return counter;
        }),
    { good: [], bad: [], ignored: [] }
  ).then((counter) => {
    // console.log(
    //   `${`\u001b[${33}m${`counter`}\u001b[${39}m`} = ${JSON.stringify(
    //     counter,
    //     null,
    //     4
    //   )}`
    // );
    let writtenAndSkippedMsg = ""; // message regarding written and skipped files

    // calculate writtenAndSkippedMsg
    if (counter.good && counter.good.length) {
      // some files were written
      if (counter.ignored && counter.ignored.length) {
        // some files were written, but there were some skipped/ignored
        writtenAndSkippedMsg = `${counter.good.length} updated, ${counter.ignored.length} skipped`;
      } else {
        // only written files, no skipped/ignored
        if (counter.good.length === 1) {
          writtenAndSkippedMsg = `1 updated`;
        } else {
          writtenAndSkippedMsg = `All ${counter.good.length} updated`;
        }
      }
    } else {
      // no files were written
      if (counter.ignored && counter.ignored.length) {
        // no files were written, there were some skipped/ignored
        if (counter.ignored.length === 1) {
          writtenAndSkippedMsg = `1 skipped`;
        } else {
          writtenAndSkippedMsg = `All ${counter.ignored.length} skipped`;
        }
      } else {
        // no written files, no skipped/ignored
        writtenAndSkippedMsg = ``;
      }
    }

    // -------------------------------------------------------------------------
    let errorredMsg = ""; // message regarding files that errorred out
    const badSupplement =
      !(counter.good && counter.good.length) &&
      !(counter.ignored && counter.ignored.length)
        ? "All "
        : "";

    if (counter.bad && counter.bad.length) {
      errorredMsg = `${badSupplement}${counter.bad.length} errorred`;
    }

    // -------------------------------------------------------------------------
    log(
      `${signature}${
        writtenAndSkippedMsg
          ? `${chalk.green(writtenAndSkippedMsg)}${errorredMsg ? " " : ""}`
          : ""
      }${errorredMsg ? chalk.red(errorredMsg) : ""} ${chalk.grey(
        `(${formatTime(Date.now() - start)})`
      )}`
    );
  });
});
