#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

const fs = require("fs-extra");
const path = require("path");
const globby = require("globby");
const meow = require("meow");
const updateNotifier = require("update-notifier");
const isObj = require("lodash.isplainobject");
const writeJsonFile = require("write-json-file");
const pacote = require("pacote");
const format = require("format-package");
const logUpdate = require("log-update");
const logSymbols = require("log-symbols");

const { log } = console;
const cli = meow(
  `
  Usage:
    $ upd
    $ or...
    $ upd YOURFILE.json

  Options:
    -h, --help          Shows this help
    -v, --version       Shows the current installed version
`
);
updateNotifier({ pkg: cli.pkg }).notify();
const sparkles = "\u2728"; // https://emojipedia.org/sparkles/
// our compiled DB object. To save us rounds of pinging npm API, we record
// all package versions that were retrieved so far under this object, so that
// we can cut corner and reference this, instead of pinging npm again:
const db = {};

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (cli.flags.v) {
  log(cli.pkg.version);
  process.exit(0);
} else if (cli.flags.h) {
  log(cli.help);
  process.exit(0);
}

// Step #1. set up the cli
// -----------------------------------------------------------------------------

let { input } = cli;
// if the folder/file name follows the flag (for example "-d templates1"),
// that name will be put under the flag's key value, not into cli.input.
// That's handy for certain types of CLI apps, but not this one, as in our case
// the flags position does not matter, they don't affect the keywords that follow.
if (cli.flags) {
  Object.keys(cli.flags).forEach(flag => {
    if (typeof cli.flags[flag] === "string") {
      input = input.concat(cli.flags[flag]);
    }
  });
}

// Step #2. query the glob and follow the pipeline
// -----------------------------------------------------------------------------

(async () => {
  const paths = await globby(["**/package.json", "!**/node_modules/**"]);
  const totalLength = paths.length;
  for (let i = 0; i < totalLength; i++) {
    try {
      let wrote = false;
      const p = paths[i];
      logUpdate(
        `${sparkles} ${`\u001b[${90}m${`update-versions:`}\u001b[${39}m`} ${i +
          1}/${totalLength} ${`\u001b[${90}m${
          p === "package.json" ? "root " : ""
        }${p}\u001b[${39}m`}`
      );
      const contents = JSON.parse(await fs.readFile(p, "utf8"));

      if (isObj(contents.dependencies)) {
        const keys = Object.keys(contents.dependencies);
        for (let y = 0, len2 = keys.length; y < len2; y++) {
          let updatedThisDep = false;
          const singleDepName = keys[y];
          const singleDepValue = contents.dependencies[keys[y]];
          if (singleDepValue.startsWith("file:") || singleDepName === "lerna") {
            continue;
          }
          if (db.hasOwnProperty(singleDepName)) {
            if (
              contents.dependencies[singleDepName] !== `^${db[singleDepName]}`
            ) {
              contents.dependencies[singleDepName] = `^${db[singleDepName]}`;
              wrote = true;
              updatedThisDep = true;
            }
          } else {
            let retrievedVersion;
            try {
              retrievedVersion = await pacote
                .manifest(singleDepName)
                .then(pkg => pkg.version);
            } catch (err) {
              console.log(
                `   ${`\u001b[${36}m${path.dirname(
                  p
                )}\u001b[${39}m`} dep ${`\u001b[${31}m${singleDepName}\u001b[${39}m`} - no response from npm`
              );
              logUpdate.done();
            }

            if (retrievedVersion) {
              db[singleDepName] = retrievedVersion;
              if (
                contents.dependencies[singleDepName] !== `^${retrievedVersion}`
              ) {
                contents.dependencies[singleDepName] = `^${retrievedVersion}`;
                wrote = true;
                updatedThisDep = true;
              }
            }
          }
          if (updatedThisDep) {
            logUpdate.done();
            console.log(
              `   ${`\u001b[${36}m${path.dirname(
                p
              )}\u001b[${39}m`} dep ${`\u001b[${33}m${singleDepName}\u001b[${39}m`} = ${singleDepValue} ---> ${
                contents.dependencies[singleDepName]
              }`
            );
          }
        }
      }
      if (isObj(contents.devDependencies)) {
        let keys = Object.keys(contents.devDependencies);
        // 1. first, remove deps which if they are in normal dependencies in
        // package.json, that's our value contents.dependencies

        if (isObj(contents.dependencies)) {
          Object.keys(contents.dependencies).forEach(depName => {
            if (keys.includes(depName)) {
              delete contents.devDependencies[depName];
              wrote = true;
              logUpdate.done();
              console.log(
                `   ${`\u001b[${36}m${path.dirname(
                  p
                )}\u001b[${39}m`} dev dep ${`\u001b[${33}m${depName}\u001b[${39}m`} removed because it is among normal dependencies`
              );
            }
          });
        }

        // 2. update the deps

        // recalculate keys:
        keys = Object.keys(contents.devDependencies);
        for (let y = 0, len2 = keys.length; y < len2; y++) {
          let updatedThisDep = false;
          const singleDepName = keys[y];
          const singleDepValue = contents.devDependencies[keys[y]];
          if (singleDepValue.startsWith("file:") || singleDepName === "lerna") {
            continue;
          }
          if (db.hasOwnProperty(singleDepName)) {
            if (
              contents.devDependencies[singleDepName] !==
                `^${db[singleDepName]}` &&
              singleDepName !== "lerna"
            ) {
              contents.devDependencies[singleDepName] = `^${db[singleDepName]}`;
              wrote = true;
              updatedThisDep = true;
            }
          } else {
            let retrievedVersion;
            try {
              retrievedVersion = await pacote
                .manifest(singleDepName)
                .then(pkg => pkg.version);
            } catch (err) {
              console.log(
                `   ${`\u001b[${36}m${path.dirname(
                  p
                )}\u001b[${39}m`} dep ${`\u001b[${31}m${singleDepName}\u001b[${39}m`} - no response from npm`
              );
              logUpdate.done();
            }
            if (retrievedVersion) {
              db[singleDepName] = retrievedVersion;
              if (
                contents.devDependencies[singleDepName] !==
                `^${retrievedVersion}`
              ) {
                contents.devDependencies[
                  singleDepName
                ] = `^${retrievedVersion}`;
                wrote = true;
                updatedThisDep = true;
              }
            }
          }
          if (updatedThisDep) {
            logUpdate.done();
            console.log(
              `   ${`\u001b[${36}m${path.dirname(
                p
              )}\u001b[${39}m`} dev dep ${`\u001b[${33}m${singleDepName}\u001b[${39}m`} = ${singleDepValue} ---> ${
                contents.devDependencies[singleDepName]
              }`
            );
          }
        }
      }

      if (isObj(contents) && contents.hasOwnProperty("gitHead")) {
        delete contents.gitHead;
      }

      if (wrote) {
        await writeJsonFile(p, JSON.parse(await format(contents)), {
          indent: 2
        });
      }
      logUpdate(
        `${
          logSymbols.success
        } ${`\u001b[${90}m${`update-versions:`}\u001b[${39}m`}${
          totalLength > 1 ? ` ${i + 1}/${totalLength}` : ""
        } ${`\u001b[${90}m${`done`}\u001b[${39}m`}`
      );
    } catch (err) {
      console.log(
        `${`\u001b[${31}m${`something wrong happened:`}\u001b[${39}m`}\n${err}`
      );
    }
  }
})();
