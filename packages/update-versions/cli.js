#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

import { promises, readFileSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import diff1 from "ansi-diff-stream";
import { glob } from "codsen-glob";
import { codsenCLI, isPlainObject } from "codsen-utils";
import { del, set } from "edit-package-json";
import objectPath from "object-path";
import pProgress, { PProgress } from "p-progress";
import pReduce from "p-reduce";
import packageJson from "package-json";
import updateNotifier from "update-notifier";
import write from "write-file-atomic";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const { readFile } = promises;

const { log } = console;
const sparkles = "\u2728"; // https://emojipedia.org/sparkles/
const messagePrefix = `\u001b[${90}m${`${sparkles} update-versions: `}\u001b[${39}m`;

const helpText = `
  Usage:
    $ upd
    $ or...
    $ upd YOURFILE.json

  Options:
    -m, --module        Blacklist against bumping major any type=module packages
    -h, --help          Shows this help
    -v, --version       Shows the current installed version
`;

function parseCli(argv = process.argv.slice(2)) {
  return codsenCLI(helpText, {
    pkg,
    argv,
    flags: {
      module: { type: "boolean", shortFlag: "m" },
      help: { type: "boolean", shortFlag: "h" },
      version: { type: "boolean", shortFlag: "v" },
    },
  });
}

// Step #1. the main function
// -----------------------------------------------------------------------------

export async function updateVersions({
  cwd = process.cwd(),
  fetchPackage = packageJson,
  moduleMode = false,
  reportProgress = false,
} = {}) {
  // we'll use the object below to distil all unique package updates
  let updatedPackages = {};
  function printUpdated() {
    return Object.keys(updatedPackages)
      .sort()
      .map((n) => `${n} ${updatedPackages[n]}`)
      .join("\n");
  }
  function major(versNum) {
    if (typeof versNum === "string" && versNum.includes(".")) {
      return versNum.split(".")[0];
    }
    return versNum;
  }

  let confLocation = path.join(cwd, "upd.config.json");
  let newConfig = {
    noMajorBumping: [],
    pin: {},
  };

  // try to read the local config if it's present
  try {
    newConfig = JSON.parse(readFileSync(confLocation, "utf8"));
  } catch (_e) {
    console.log(
      `\n${messagePrefix}${`\u001b[${90}m${"No config found, moving on."}\u001b[${39}m`}\n`,
    );
  }

  let pathsPromise = await glob(
    ["**/package.json", "!**/node_modules/**", "!**/test/**"],
    { cwd },
  ).then((paths) =>
    pReduce(
      paths,
      (mapReceived, currentPath) =>
        readFile(path.join(cwd, currentPath), "utf8")
          .then((packContentsStr) => {
            let parsedContents = JSON.parse(packContentsStr);
            mapReceived.namesList.push(parsedContents.name);
            mapReceived.pathsList.push(currentPath);
            mapReceived.pathsByName[parsedContents.name] = currentPath;
            mapReceived.contentsStr[currentPath] = packContentsStr;
            mapReceived.contentsObj[currentPath] = parsedContents;
            return mapReceived;
          })
          .catch((err) => {
            log(
              `${messagePrefix}${`\u001b[${31}m${`Couldn't read and parse the package.json at "${currentPath}": (${err})`}\u001b[${39}m`}`,
            );
            return mapReceived;
          }),
      {
        namesList: [],
        pathsList: [],
        pathsByName: {},
        contentsObj: {},
        contentsStr: {},
      },
    ),
  );

  // Resolve the complete registry view before touching any package.json. This
  // makes a failed registry run atomic from the caller's point of view and also
  // deduplicates lookups shared by packages in a monorepo.
  let externalNames = new Set();
  for (let oneOfPaths of pathsPromise.pathsList) {
    let parsedContents = pathsPromise.contentsObj[oneOfPaths];
    for (let dependencyKey of ["dependencies", "devDependencies"]) {
      if (isPlainObject(parsedContents[dependencyKey])) {
        for (let [name, spec] of Object.entries(
          parsedContents[dependencyKey],
        )) {
          if (
            typeof spec === "string" &&
            !spec.startsWith("file:") &&
            !pathsPromise.namesList.includes(name)
          ) {
            externalNames.add(name);
          }
        }
      }
    }
  }

  let registryMetadata = new Map();
  await Promise.all(
    [...externalNames].map(async (name) => {
      try {
        let metadata = await fetchPackage(name, { fullMetadata: true });
        if (!metadata || typeof metadata.version !== "string") {
          throw new TypeError(`${name} returned no version`);
        }
        registryMetadata.set(name, metadata);
      } catch (_e) {
        registryMetadata.set(name, null);
      }
    }),
  );

  if (externalNames.size > 0 && ![...registryMetadata.values()].some(Boolean)) {
    throw new Error(
      "Could not fetch any package metadata. Please check your internet connection. Nothing was written.",
    );
  }

  if (moduleMode) {
    for (let metadata of registryMetadata.values()) {
      if (
        metadata?.type === "module" &&
        !newConfig.noMajorBumping.includes(metadata.name)
      ) {
        newConfig.noMajorBumping.push(metadata.name);
      }
    }
  }

  let allProgressPromise = PProgress.all(
    pathsPromise.pathsList.map((oneOfPaths) =>
      pProgress(async (progress) => {
        // call progress() like progress(0.14);

        let amended = false;
        let finalContents = pathsPromise.contentsStr[oneOfPaths];
        let parsedContents = pathsPromise.contentsObj[oneOfPaths];

        let totalDeps = (
          isPlainObject(parsedContents.dependencies)
            ? Object.keys(parsedContents.dependencies)
            : []
        ).concat(
          isPlainObject(parsedContents.devDependencies)
            ? Object.keys(parsedContents.devDependencies)
            : [],
        );

        //
        //
        //
        //
        //
        //
        //
        //               1. LOOKUP OF ALL DEPS & DEV-DEPS ALL AT ONCE
        //
        //
        //
        //
        //
        //
        //

        // All external metadata was resolved before this processing phase, so
        // no package can be written while another registry request is pending.
        let compiledDepNameVersionPairs = {};
        for (let singleDepName of totalDeps) {
          if (pathsPromise.namesList.includes(singleDepName)) {
            compiledDepNameVersionPairs[singleDepName] =
              pathsPromise.contentsObj[
                pathsPromise.pathsByName[singleDepName]
              ].version;
          } else {
            compiledDepNameVersionPairs[singleDepName] =
              registryMetadata.get(singleDepName)?.version ?? null;
          }
        }
        progress(0.75);

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

        if (isPlainObject(parsedContents.dependencies)) {
          let keys = Object.keys(parsedContents.dependencies);
          for (let y = 0, len2 = keys.length; y < len2; y++) {
            // delete this dependency from lect.various.devDependencies if present
            // ---------------------
            if (
              objectPath.has(parsedContents, "lect.various.devDependencies") &&
              Array.isArray(parsedContents.lect.various.devDependencies) &&
              parsedContents.lect.various.devDependencies.includes(keys[y])
            ) {
              let foundIdx;
              let newVal = parsedContents.lect.various.devDependencies.filter(
                (dep, z) => {
                  if (dep === keys[y]) {
                    foundIdx = z;
                    return false;
                  }
                  return true;
                },
              );
              parsedContents.lect.various.devDependencies = newVal;
              finalContents = del(
                finalContents,
                `lect.various.devDependencies.${foundIdx}`,
              );
            }

            // tackle the deps list:
            // ---------------------

            let singleDepName = keys[y];
            let singleDepValue = parsedContents.dependencies[keys[y]];
            if (singleDepValue.startsWith("file:")) {
              continue;
            }
            let workspacePrefix = singleDepValue.startsWith("workspace:")
              ? "workspace:"
              : "";

            if (Array.isArray(newConfig?.pin) && newConfig.pin[singleDepName]) {
              finalContents = set(
                finalContents,
                `dependencies.${singleDepName}`,
                newConfig.pin[singleDepName],
              );
              amended = true;
              if (!Object.hasOwn(updatedPackages, singleDepName)) {
                updatedPackages[singleDepName] = newConfig.pin[singleDepName];
              }
            } else if (
              compiledDepNameVersionPairs[singleDepName] !== null &&
              singleDepValue !==
                `${workspacePrefix}^${compiledDepNameVersionPairs[singleDepName]}` &&
              // either dependency is not blacklisted (so we don't care)
              (!newConfig.noMajorBumping.includes(singleDepName) ||
                // or it is blacklisted but the bump is within the same major semver digit
                major(compiledDepNameVersionPairs[singleDepName]) ===
                  major(singleDepValue))
            ) {
              finalContents = set(
                finalContents,
                `dependencies.${singleDepName}`,
                `${workspacePrefix}^${compiledDepNameVersionPairs[singleDepName]}`,
              );
              amended = true;
              if (!Object.hasOwn(updatedPackages, singleDepName)) {
                updatedPackages[singleDepName] =
                  compiledDepNameVersionPairs[singleDepName];
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

        if (isPlainObject(parsedContents.devDependencies)) {
          let keys = Object.keys(parsedContents.devDependencies);
          // 1. first, remove deps which if they are in normal dependencies in
          // package.json, that's our value parsedContents.dependencies
          if (isPlainObject(parsedContents.dependencies)) {
            Object.keys(parsedContents.dependencies).forEach((depName) => {
              if (keys.includes(depName)) {
                // 1. delete dev-dep entry on JSON string
                finalContents = del(
                  finalContents,
                  `devDependencies.${depName}`,
                );
                // 2. delete the dev-dep from parsedContents.devDependencies
                // key array which will be used to traverse in the loop later
                keys = keys.filter((val) => val !== depName);
                // 3. set the flag to activate the file write operation later
                amended = true;
              }
            });
          }
          for (let y = 0, len2 = keys.length; y < len2; y++) {
            let singleDepName = keys[y];
            let singleDepValue = parsedContents.devDependencies[keys[y]];
            if (singleDepValue.startsWith("file:")) {
              continue;
            }
            let workspacePrefix = singleDepValue.startsWith("workspace:")
              ? "workspace:"
              : "";

            if (Array.isArray(newConfig?.pin) && newConfig.pin[singleDepName]) {
              finalContents = set(
                finalContents,
                `dependencies.${singleDepName}`,
                newConfig.pin[singleDepName],
              );
              amended = true;
              if (!Object.hasOwn(updatedPackages, singleDepName)) {
                updatedPackages[singleDepName] = newConfig.pin[singleDepName];
              }
            } else if (
              compiledDepNameVersionPairs[singleDepName] !== null &&
              singleDepValue !==
                `${workspacePrefix}^${compiledDepNameVersionPairs[singleDepName]}` &&
              // either dependency is not blacklisted (so we don't care)
              (!newConfig.noMajorBumping.includes(singleDepName) ||
                // or it is blacklisted but the bump is within the same major semver digit
                major(compiledDepNameVersionPairs[singleDepName]) ===
                  major(singleDepValue))
            ) {
              finalContents = set(
                finalContents,
                `devDependencies.${singleDepName}`,
                `${workspacePrefix}^${compiledDepNameVersionPairs[singleDepName]}`,
              );
              amended = true;

              // update logging:
              if (!Object.hasOwn(updatedPackages, singleDepName)) {
                updatedPackages[singleDepName] =
                  `${compiledDepNameVersionPairs[singleDepName]}`;
              }
            }

            progress(
              0.75 + 0.24 * ((totalDeps.length - len2 + y) / totalDeps.length),
            );
          }
        }

        if (
          isPlainObject(parsedContents) &&
          Object.hasOwn(parsedContents, "gitHead")
        ) {
          finalContents = del(finalContents, "gitHead");
        }

        if (amended) {
          try {
            await write(path.join(cwd, oneOfPaths), finalContents);
          } catch (e) {
            console.error(
              `${messagePrefix}error happened when writing package.json:\n${e}`,
            );
          }
        }
      }),
    ),
  );

  if (reportProgress) {
    const diff = diff1();
    allProgressPromise.onProgress((val) =>
      diff.write(
        val === 1
          ? `${messagePrefix}${
              Object.keys(updatedPackages).length
                ? `all updated:\n${printUpdated()}`
                : "everything was already up-to-date"
            }`
          : `${messagePrefix}${Math.floor(val * 100)}% ${
              Object.keys(updatedPackages).length
                ? `updated:\n${printUpdated()}`
                : "done"
            }`,
      ),
    );
    diff.pipe(process.stdout);
  }

  await allProgressPromise;
  return updatedPackages;
}

async function runCli() {
  const cli = parseCli();
  updateNotifier({ pkg }).notify();

  // Honour help/version even when another argument is also present. codsenCLI
  // handles either flag automatically when it is the sole argument.
  if (cli.flags.version) {
    log(pkg.version);
    return;
  }
  if (cli.flags.help) {
    log(cli.help);
    return;
  }

  await updateVersions({
    moduleMode: Boolean(cli.flags.module),
    reportProgress: true,
  });
}

function isDirectExecution() {
  if (!process.argv[1]) {
    return false;
  }
  try {
    return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch (_e) {
    return false;
  }
}

if (isDirectExecution()) {
  runCli().catch((error) => {
    console.error(
      `\n${messagePrefix}${`\u001b[${31}m${error.message}\u001b[${39}m`}\n`,
    );
    process.exitCode = 1;
  });
}
