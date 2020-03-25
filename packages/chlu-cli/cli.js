#!/usr/bin/env node

/* eslint no-console:0 */

const writeFileAtomic = require("write-file-atomic");
const updateNotifier = require("update-notifier");
const git = require("simple-git/promise");
const { promisify } = require("util");
const chlu = require("chlu");
const fs = require("fs-extra");
const path = require("path");
const meow = require("meow");

const { log } = console;
const messagePrefix = `\u001b[${90}m${"✨ chlu: "}\u001b[${39}m`;

const cli = meow(
  `
  Usage
    $ chlu

  Options
    --loud, -l  Enables logs in the console

  Example
    Just call it in the root, where your package.json is located
`,
  {
    flags: {
      loud: {
        type: "boolean",
        alias: "l",
        default: false,
      },
    },
  }
);
updateNotifier({ pkg: cli.pkg }).notify();

// getTags(dir)
// produces either null of a plain object, for example:
// {
//     "latest": "2018-05-03|v1.9.1",
//     "all": [
//         "2017-05-19|v1.1.0",
//         "2017-05-19|v1.1.1",
//         "2017-06-19|v1.1.2",
//     ]
// }

(async () => {
  //
  //                                1.

  let changelogData;
  try {
    changelogData = await fs.readFile(path.resolve("./changelog.md"), "utf8");
  } catch (e) {
    log(
      `${messagePrefix}[ID_1] Alas! We couldn't fetch the changelog.md:\n${e}`
    );
    process.exit(0);
  }

  //                                2.

  let packageData = null;
  try {
    packageData = await fs.readJson(path.resolve("package.json"));
  } catch (e) {
    if (cli.flags.loud) {
      log(
        `${messagePrefix}[ID_2] couldn't fetch the package.json. Will continue without.`
      );
    }
  }

  //                                3.

  let gitData = null;
  try {
    fs.accessSync("./.git");
    gitData = await git().tags({
      "--format": "%(creatordate:short)|%(refname:short)",
    });
  } catch (e) {
    if (cli.flags.loud) {
      log(
        `${messagePrefix}[ID_3] Couldn't fetch the Git data! Will continue without.`
      );
    }
  }

  //                                4.

  try {
    const contentToWrite = chlu(changelogData, gitData, packageData);
    // insurance against writing empty file:
    if (
      !contentToWrite ||
      typeof contentToWrite !== "string" ||
      !contentToWrite.length
    ) {
      process.exit(0);
    }
    await promisify(writeFileAtomic)(
      path.resolve("./changelog.md"),
      contentToWrite
    ).then(() => {
      if (cli.flags.loud) {
        log(`${messagePrefix} ${`\u001b[${32}m${`OK.`}\u001b[${39}m`}`);
      }
    });
  } catch (e) {
    log(
      `${messagePrefix}[ID_4] Alas! We couldn't write the changelog.md!\n${e}`
    );
    process.exit(0);
  }
})();
