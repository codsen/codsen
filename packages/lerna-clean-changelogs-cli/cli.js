#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { promisify } from "node:util";
import { codsenCLI } from "codsen-utils";
import { globby } from "globby";
import { cleanChangelogs } from "lerna-clean-changelogs";
import pFilter from "p-filter";
import pReduce from "p-reduce";
import updateNotifier from "update-notifier";
import write from "write-file-atomic";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const start = Date.now();
const { log } = console;
const isArr = Array.isArray;
const colours = {
  green: 32,
  grey: 90,
  red: 31,
};

function colour(str, colourCode) {
  return `\u001b[${colourCode}m${str}\u001b[39m`;
}

function isStr(something) {
  return typeof something === "string";
}
function isObj(something) {
  return (
    !!something && typeof something === "object" && !Array.isArray(something)
  );
}
function formatTime(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${Math.round(ms / 1000)}s`;
}
const cli = codsenCLI(
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
    -e, --extras        Extra cleaning (h1, diffs etc.)
`,
  {
    pkg,
    flags: {
      extras: { type: "boolean", shortFlag: "e" },
      help: { type: "boolean", shortFlag: "h" },
      version: { type: "boolean", shortFlag: "v" },
    },
  },
);
updateNotifier({ pkg }).notify();
const signature = colour("✨ lerna-clean-changelogs-cli: ", colours.grey);

// Step #0. honour help/version even when another argument is also present.
// codsenCLI handles either flag automatically when it is the sole argument.
// -----------------------------------------------------------------------------

if (cli.flags.version) {
  log(pkg.version);
  process.exit(0);
} else if (cli.flags.help) {
  log(cli.help);
  process.exit(0);
}

// FUNCTIONS
// -----------------------------------------------------------------------------

function readSortAndWriteOverFile(oneOfPaths) {
  return readFile(oneOfPaths, "utf8")
    .then((filesContent) => {
      let preppedContents;
      try {
        preppedContents = cleanChangelogs(filesContent, {
          extras: cli.flags.extras === true,
        });
      } catch (_e) {
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
      console.log(`${oneOfPaths} - ${err}`);
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
    [],
  ).then((preppedPathsArr) => {
    if (!preppedPathsArr.length) {
      log(`${signature}${colour("no changelogs found", colours.red)}`);
      process.exit(0);
    }

    return pFilter(preppedPathsArr, (onePath) =>
      stat(path.resolve(onePath)).catch(() => {
        return Promise.resolve(false);
      }),
    ).then((resultArr) => {
      if (!isArr(resultArr) || !resultArr.length) {
        // spinner.warn("no changelogs found");
        process.exit(0);
      } else {
        // filter changelog files
        return resultArr.filter(
          (p) =>
            isStr(path.basename(p)) &&
            path.basename(p).toLowerCase() === "changelog.md",
        );
      }
    });
  });
} else {
  thePromise = globby(["**/changelog.md", "!**/node_modules/**"], {
    caseSensitiveMatch: false,
  });
}

// ASYNCHRONOUS PART:
thePromise.then((received) => {
  if (!isArr(received) || !received.length) {
    // spinner.warn("no changelogs found");
    log(`${signature}${colour("no changelogs found", colours.red)}`);
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
              },
        )
        .catch((err) => {
          log(
            `${signature}${colour(
              "Could not write the cleaned file:",
              colours.red,
            )} ${err}`,
          );
          return counter;
        }),
    { good: [], bad: [], ignored: [] },
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
    if (counter?.good.length) {
      // some files were written
      if (counter?.ignored.length) {
        // some files were written, but there were some skipped/ignored
        writtenAndSkippedMsg = `${counter.good.length} updated, ${counter.ignored.length} skipped`;
      }
      // only written files, no skipped/ignored
      else if (counter.good.length === 1) {
        writtenAndSkippedMsg = "1 updated";
      } else {
        writtenAndSkippedMsg = `All ${counter.good.length} updated`;
      }
    }
    // no files were written
    else if (counter?.ignored.length) {
      // no files were written, there were some skipped/ignored
      if (counter.ignored.length === 1) {
        writtenAndSkippedMsg = "1 skipped";
      } else {
        writtenAndSkippedMsg = `All ${counter.ignored.length} skipped`;
      }
    } else {
      // no written files, no skipped/ignored
      writtenAndSkippedMsg = "";
    }

    // -------------------------------------------------------------------------
    let errorredMsg = ""; // message regarding files that errorred out
    let badSupplement =
      !counter?.good.length && !counter?.ignored.length ? "All " : "";

    if (counter?.bad.length) {
      errorredMsg = `${badSupplement}${counter.bad.length} errorred`;
    }

    // -------------------------------------------------------------------------
    log(
      `${signature}${
        writtenAndSkippedMsg
          ? `${colour(writtenAndSkippedMsg, colours.green)}${
              errorredMsg ? " " : ""
            }`
          : ""
      }${errorredMsg ? colour(errorredMsg, colours.red) : ""} ${colour(
        `(${formatTime(Date.now() - start)})`,
        colours.grey,
      )}`,
    );
  });
});
