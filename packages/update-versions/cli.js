#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

const { promisify } = require("util");

// *
const read = promisify(require("fs").readFile);
const write = require("write-file-atomic");
// *

const globby = require("globby");
const pReduce = require("p-reduce");
const PProgress = require("p-progress");
const meow = require("meow");
const updateNotifier = require("update-notifier");
const isObj = require("lodash.isplainobject");
const pacote = require("pacote");
const objectPath = require("object-path");
const diff = require("ansi-diff-stream")();

const isArr = Array.isArray;
const { set, del } = require("edit-package-json");
const isOnline = require("is-online");

const { log } = console;
const sparkles = "\u2728"; // https://emojipedia.org/sparkles/
const messagePrefix = `\u001b[${90}m${`${sparkles} update-versions: `}\u001b[${39}m`;

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
  Object.keys(cli.flags).forEach((flag) => {
    if (typeof cli.flags[flag] === "string") {
      input = input.concat(cli.flags[flag]);
    }
  });
}

// Step #2. the main function
// -----------------------------------------------------------------------------

(async () => {
  // we'll use the object below to distill all unique package updates
  const updatedPackages = {};
  function printUpdated() {
    return Object.keys(updatedPackages)
      .sort()
      .map((n) => `${n} ${updatedPackages[n]}`)
      .join("\n");
  }

  const online = await isOnline();
  if (!online) {
    console.error(
      `\n${messagePrefix}${`\u001b[${31}m${`Please check your internet connection.`}\u001b[${39}m`}\n`
    );
    process.exit(1);
  }

  const pathsPromise = await globby([
    "**/package.json",
    "!**/node_modules/**",
    "!**/test/**",
  ]).then((paths) =>
    pReduce(
      paths,
      (mapReceived, currentPath) =>
        read(currentPath, "utf8")
          .then((packContentsStr) => {
            const parsedContents = JSON.parse(packContentsStr);
            mapReceived.namesList.push(parsedContents.name);
            mapReceived.pathsList.push(currentPath);
            mapReceived.pathsByName[parsedContents.name] = currentPath;
            mapReceived.contentsStr[currentPath] = packContentsStr;
            mapReceived.contentsObj[currentPath] = parsedContents;
            return mapReceived;
          })
          .catch((err) => {
            log(
              `${messagePrefix}${`\u001b[${31}m${`Couldn't read and parse the package.json at "${currentPath}": (${err})`}\u001b[${39}m`}`
            );
            return mapReceived;
          }),
      {
        namesList: [],
        pathsList: [],
        pathsByName: {},
        contentsObj: {},
        contentsStr: {},
      }
    )
  );

  // we work on array pathsPromise.pathsByName

  const allProgressPromise = PProgress.all(
    pathsPromise.pathsList.map((oneOfPaths) =>
      PProgress.fn(async (progress) => {
        // call progress() like progress(0.14);

        let amended = false;
        let stringContents = pathsPromise.contentsStr[oneOfPaths];
        const parsedContents = pathsPromise.contentsObj[oneOfPaths];

        const totalDeps = (isObj(parsedContents.dependencies)
          ? Object.keys(parsedContents.dependencies)
          : []
        ).concat(
          isObj(parsedContents.devDependencies)
            ? Object.keys(parsedContents.devDependencies)
            : []
        );

        //
        //
        //
        //
        //
        //
        //
        //               1. LOOKUP OF ALL DEPS & DEVDEPS ALL AT ONCE
        //
        //
        //
        //
        //
        //
        //

        // As dependency lookup is process-heavy and will take time, we need
        // to track it. The total progress of this single package we're processing
        // is divided 75% to compile new versions, 25% to write/skip

        // this is the first 75% of per-package progress
        // https://github.com/sindresorhus/p-progress#pprogressallpromises-options

        const compiledDepNameVersionPairs = {};
        const allProgressPromise2 = PProgress.all(
          totalDeps.map(async (singleDepName) => {
            if (pathsPromise.namesList.includes(singleDepName)) {
              compiledDepNameVersionPairs[singleDepName] =
                pathsPromise.contentsObj[
                  pathsPromise.pathsByName[singleDepName]
                ].version;
              return;
            }
            try {
              await pacote.manifest(singleDepName).then((pkg) => {
                if (pkg.version === null) {
                  throw new Error(
                    `${messagePrefix}${singleDepName} version from npm came as null, CLI will exit now, nothing was written.`
                  );
                } else {
                  compiledDepNameVersionPairs[singleDepName] = pkg.version;
                }
              });
            } catch (err) {
              // no response from npm
              compiledDepNameVersionPairs[singleDepName] = null;
            }
          })
        );
        allProgressPromise2.onProgress((val) => {
          // console.log(
          //   `197 ${`\u001b[${32}m${`CALL PROGRESS():`} ${val *
          //     0.75}\u001b[${39}m`}`
          // );
          progress(val * 0.75);
        });
        await allProgressPromise2;

        // Now we need to simultaneously query all the deps, dev and normal ones.
        // We rely on pacote's caching mechanism.

        // The plan is to query all the deps at once, then await the result,
        // then process received result, picking values we need from it.

        //
        //
        //
        //
        //
        //
        //
        //                            2. DEPS
        //
        //
        //
        //
        //
        //
        //

        if (isObj(parsedContents.dependencies)) {
          const keys = Object.keys(parsedContents.dependencies);
          for (let y = 0, len2 = keys.length; y < len2; y++) {
            // delete this dependency from lect.various.devDependencies if present
            // ---------------------
            if (
              objectPath.has(parsedContents, `lect.various.devDependencies`) &&
              isArr(parsedContents.lect.various.devDependencies) &&
              parsedContents.lect.various.devDependencies.includes(keys[y])
            ) {
              let foundIdx;
              const newVal = parsedContents.lect.various.devDependencies.filter(
                (dep, z) => {
                  if (dep === keys[y]) {
                    foundIdx = z;
                    return false;
                  }
                  return true;
                }
              );
              parsedContents.lect.various.devDependencies = newVal;
              stringContents = del(
                stringContents,
                `lect.various.devDependencies.${foundIdx}`
              );
            }

            // tackle the deps list:
            // ---------------------

            const singleDepName = keys[y];
            const singleDepValue = parsedContents.dependencies[keys[y]];
            if (singleDepValue.startsWith("file:")) {
              continue;
            }
            const workspacePrefix = singleDepValue.startsWith("workspace:")
              ? "workspace:"
              : "";

            if (
              compiledDepNameVersionPairs[singleDepName] !== null &&
              singleDepValue !==
                `${workspacePrefix}^${compiledDepNameVersionPairs[singleDepName]}`
            ) {
              stringContents = set(
                stringContents,
                `dependencies.${singleDepName}`,
                `${workspacePrefix}^${compiledDepNameVersionPairs[singleDepName]}`
              );
              amended = true;
              if (
                !Object.prototype.hasOwnProperty.call(
                  updatedPackages,
                  singleDepName
                )
              ) {
                updatedPackages[
                  singleDepName
                ] = `${compiledDepNameVersionPairs[singleDepName]}`;
              }
            }

            // report progress
            // ---------------------

            // total: totalDeps, current chunk total: len2
            progress(0.75 + 0.24 * (y / totalDeps.length));
          }
        }

        //
        //
        //
        //
        //
        //
        //
        //                        3. DEV-DEPS
        //
        //
        //
        //
        //
        //
        //

        if (isObj(parsedContents.devDependencies)) {
          let keys = Object.keys(parsedContents.devDependencies);
          // 1. first, remove deps which if they are in normal dependencies in
          // package.json, that's our value parsedContents.dependencies
          if (isObj(parsedContents.dependencies)) {
            Object.keys(parsedContents.dependencies).forEach((depName) => {
              if (keys.includes(depName)) {
                // 1. delete devdep entry on JSON string
                stringContents = del(
                  stringContents,
                  `devDependencies.${depName}`
                );
                // 2. delete the devdep from parsedContents.devDependencies
                // key array which will be used to traverse in the loop later
                keys = keys.filter((val) => val !== depName);
                // 3. set the flag to activate the file write operation later
                amended = true;
              }
            });
          }
          for (let y = 0, len2 = keys.length; y < len2; y++) {
            const singleDepName = keys[y];
            const singleDepValue = parsedContents.devDependencies[keys[y]];
            if (singleDepValue.startsWith("file:")) {
              continue;
            }
            const workspacePrefix = singleDepValue.startsWith("workspace:")
              ? "workspace:"
              : "";

            if (
              compiledDepNameVersionPairs[singleDepName] !== null &&
              singleDepValue !==
                `${workspacePrefix}^${compiledDepNameVersionPairs[singleDepName]}`
            ) {
              stringContents = set(
                stringContents,
                `devDependencies.${singleDepName}`,
                `${workspacePrefix}^${compiledDepNameVersionPairs[singleDepName]}`
              );
              amended = true;

              // update logging:
              if (
                !Object.prototype.hasOwnProperty.call(
                  updatedPackages,
                  singleDepName
                )
              ) {
                updatedPackages[
                  singleDepName
                ] = `${compiledDepNameVersionPairs[singleDepName]}`;
              }
            }

            progress(
              0.75 + 0.24 * ((totalDeps.length - len2 + y) / totalDeps.length)
            );
          }
        }

        if (
          isObj(parsedContents) &&
          Object.prototype.hasOwnProperty.call(parsedContents, "gitHead")
        ) {
          stringContents = del(stringContents, "gitHead");
        }

        if (amended) {
          try {
            await write(oneOfPaths, stringContents);
          } catch (e) {
            console.error(
              `${messagePrefix}error happened when writing package.json:\n${e}`
            );
          }
        }
      })
    )
  );

  allProgressPromise.onProgress((val) =>
    diff.write(
      val === 1
        ? `${messagePrefix}${
            Object.keys(updatedPackages).length
              ? `all updated:\n${printUpdated()}`
              : `everything was already up-to-date`
          }`
        : `${messagePrefix}${Math.floor(val * 100)}% ${
            Object.keys(updatedPackages).length
              ? `updated:\n${printUpdated()}`
              : `done`
          }`
    )
  );
  diff.pipe(process.stdout);

  await allProgressPromise;
})();
