#!/usr/bin/env node

/* eslint no-console:0 */

const meow = require("meow");
const chlu = require("chlu");
const fs = require("fs-extra");
const writeFileAtomic = require("write-file-atomic");
const git = require("simple-git/promise");
const pify = require("pify");

const pack = "./package.json";
const changeLogFile = "./changelog.md";
const updateNotifier = require("update-notifier");

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
    alias: {
      l: "loud"
    }
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
    changelogData = await fs.readFile(changeLogFile, "utf8");
    // console.log(
    //   `057 CHLU CLI: ${`\u001b[${33}m${`changelogData`}\u001b[${39}m`} = ${JSON.stringify(
    //     changelogData,
    //     null,
    //     4
    //   )}`
    // );
  } catch (e) {
    log(
      `${messagePrefix}[ID_1] Alas! We couldn't fetch the changelog.md:\n${e}`
    );
    process.exit(0);
  }

  //                                2.

  let packageData = null;
  try {
    packageData = await fs.readJson(pack);
  } catch (e) {
    if (cli.flags.loud) {
      log(
        `${messagePrefix}[ID_2] couldn't fetch the package.json. Will continue without.`
      );
    }
  }
  // console.log(
  //   `083 CHLU CLI: ${`\u001b[${33}m${`packageData`}\u001b[${39}m`} = ${JSON.stringify(
  //     packageData,
  //     null,
  //     4
  //   )}`
  // );

  //                                3.

  let gitData = null;
  try {
    gitData = await git().tags({
      "--format": "%(creatordate:short)|%(refname:short)"
    });
  } catch (e) {
    if (cli.flags.loud) {
      log(
        `${messagePrefix}[ID_3] Couldn't fetch the Git data! Will continue without.`
      );
    }
  }
  // console.log(
  //   `105 CHLU CLI: ${`\u001b[${33}m${`gitData`}\u001b[${39}m`} = ${JSON.stringify(
  //     gitData,
  //     null,
  //     4
  //   )}`
  // );

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
    await pify(writeFileAtomic)(changeLogFile, contentToWrite).then(() => {
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
