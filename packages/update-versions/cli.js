#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

import { promises, realpathSync } from "node:fs";
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

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const { readFile } = promises;

const { log } = console;
const sparkles = "\u2728"; // https://emojipedia.org/sparkles/
const messagePrefix = `\u001b[${90}m${`${sparkles} update-versions: `}\u001b[${39}m`;

const defaultConfig = Object.freeze({
  noMajorBumping: Object.freeze([]),
  pin: Object.freeze({}),
});

function makeFailure(phase, filename, cause) {
  let causeMessage = cause instanceof Error ? cause.message : String(cause);
  let error = new Error(`${phase} failed for "${filename}": ${causeMessage}`);
  error.name = "UpdateVersionsOperationError";
  error.phase = phase;
  error.path = filename;
  error.cause = cause;
  return error;
}

export class UpdateVersionsError extends AggregateError {
  constructor(
    errors,
    { updatedFiles = [], unchangedFiles = [], updatedPackages = {} } = {},
  ) {
    let failureCount = errors.length;
    let message = `update-versions failed with ${failureCount} ${
      failureCount === 1 ? "error" : "errors"
    }; ${updatedFiles.length} ${
      updatedFiles.length === 1 ? "file was" : "files were"
    } updated and ${unchangedFiles.length} ${
      unchangedFiles.length === 1 ? "file was" : "files were"
    } unchanged.`;
    if (updatedFiles.length === 0) {
      message += " Nothing was written.";
    }
    super(errors, message);
    this.name = "UpdateVersionsError";
    this.code = "UPDATE_VERSIONS_FAILED";
    this.updatedFiles = [...updatedFiles];
    this.unchangedFiles = [...unchangedFiles];
    this.updatedPackages = { ...updatedPackages };
  }
}

function parseConfig(configSource, configPath) {
  let parsed;
  try {
    parsed = JSON.parse(configSource);
  } catch (error) {
    throw new TypeError(
      `update-versions/updateVersions(): [THROW_ID_01] Could not parse "${configPath}" as JSON: ${error.message}`,
    );
  }

  if (!isPlainObject(parsed)) {
    throw new TypeError(
      `update-versions/updateVersions(): [THROW_ID_02] "${configPath}" must contain a JSON object.`,
    );
  }

  let unknownKeys = Object.keys(parsed).filter(
    (key) => !Object.hasOwn(defaultConfig, key),
  );
  if (unknownKeys.length > 0) {
    throw new TypeError(
      `update-versions/updateVersions(): [THROW_ID_03] "${configPath}" contains unsupported ${
        unknownKeys.length === 1 ? "property" : "properties"
      }: ${unknownKeys.sort().join(", ")}.`,
    );
  }

  if (
    parsed.noMajorBumping !== undefined &&
    (!Array.isArray(parsed.noMajorBumping) ||
      parsed.noMajorBumping.some(
        (name) =>
          typeof name !== "string" ||
          name.trim().length === 0 ||
          name !== name.trim(),
      ))
  ) {
    throw new TypeError(
      `update-versions/updateVersions(): [THROW_ID_04] "noMajorBumping" in "${configPath}" must be an array of trimmed, non-empty package-name strings.`,
    );
  }

  if (parsed.pin !== undefined && !isPlainObject(parsed.pin)) {
    throw new TypeError(
      `update-versions/updateVersions(): [THROW_ID_05] "pin" in "${configPath}" must be a plain object.`,
    );
  }

  if (
    parsed.pin !== undefined &&
    Object.entries(parsed.pin).some(
      ([name, version]) =>
        name.trim().length === 0 ||
        name !== name.trim() ||
        typeof version !== "string" ||
        version.trim().length === 0 ||
        version !== version.trim(),
    )
  ) {
    throw new TypeError(
      `update-versions/updateVersions(): [THROW_ID_06] Every "pin" entry in "${configPath}" must map a trimmed, non-empty package name to a trimmed, non-empty string.`,
    );
  }

  return {
    noMajorBumping: [
      ...new Set(parsed.noMajorBumping ?? defaultConfig.noMajorBumping),
    ],
    pin: { ...(parsed.pin ?? defaultConfig.pin) },
  };
}

async function loadConfig(configPath, readTextFile) {
  let configSource;
  try {
    configSource = await readTextFile(configPath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {
        noMajorBumping: [...defaultConfig.noMajorBumping],
        pin: { ...defaultConfig.pin },
      };
    }
    throw makeFailure("config read", configPath, error);
  }
  try {
    return parseConfig(configSource, configPath);
  } catch (error) {
    throw makeFailure("config validation", configPath, error);
  }
}

function parseDependencySpec(dependencyName, currentSpec) {
  if (typeof currentSpec !== "string") {
    throw new TypeError(
      `update-versions/updateVersions(): [THROW_ID_07] Dependency "${dependencyName}" must use a string version specifier; received ${typeof currentSpec}.`,
    );
  }
  if (!currentSpec.startsWith("workspace:")) {
    return {
      dependencyName,
      kind: "registry",
      selector: currentSpec,
      targetName: dependencyName,
    };
  }

  let workspaceValue = currentSpec.slice("workspace:".length);
  if (/^\.\.?\//.test(workspaceValue)) {
    return {
      dependencyName,
      kind: "workspace-path",
      path: workspaceValue,
      selector: null,
      targetName: null,
    };
  }

  let aliasSeparator = workspaceValue.lastIndexOf("@");
  if (aliasSeparator > 0) {
    return {
      dependencyName,
      kind: "workspace-alias",
      selector: workspaceValue.slice(aliasSeparator + 1),
      targetName: workspaceValue.slice(0, aliasSeparator),
    };
  }

  return {
    dependencyName,
    kind: "workspace-selector",
    selector: workspaceValue,
    targetName: dependencyName,
  };
}

function workspaceSpecPrefix(parsedSpec) {
  return parsedSpec.kind === "workspace-alias"
    ? `workspace:${parsedSpec.targetName}@`
    : "workspace:";
}

function pinnedDependencySpec(parsedSpec, currentSpec, pinnedSpec) {
  if (parsedSpec.kind === "registry") {
    return pinnedSpec;
  }
  if (parsedSpec.kind === "workspace-path") {
    return currentSpec;
  }
  let selector = pinnedSpec;
  if (pinnedSpec.startsWith("workspace:")) {
    let parsedPin = parseDependencySpec(parsedSpec.dependencyName, pinnedSpec);
    selector = parsedPin.selector ?? parsedSpec.selector;
  }
  return `${workspaceSpecPrefix(parsedSpec)}${selector}`;
}

function updatedDependencySpec(parsedSpec, currentSpec, version) {
  if (parsedSpec.kind === "registry") {
    return `^${version}`;
  }
  if (parsedSpec.kind === "workspace-path") {
    return currentSpec;
  }

  let workspaceRange = parsedSpec.selector;
  if (["*", "^", "~"].includes(workspaceRange)) {
    return currentSpec;
  }
  let firstVersionDigit = workspaceRange.search(/\d/);
  if (firstVersionDigit === -1) {
    return currentSpec;
  }
  let rangePrefix = workspaceRange.slice(0, firstVersionDigit);
  return `${workspaceSpecPrefix(parsedSpec)}${rangePrefix}${version}`;
}

const helpText = `
  Usage:
    $ upd
    $ or...
    $ upd YOURFILE.json

  Options:
    -m, --module        Blacklist against bumping major any type=module packages
    -h, --help          Shows this help
    -v, --version       Shows the current installed version

  Optional upd.config.json:
    {
      "noMajorBumping": ["package-name"],
      "pin": { "package-name": "1.2.3" }
    }
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

// stands in for `write-file-atomic`: the file is written under a temporary
// name and moved into place, so an interrupted run never leaves a package.json
// half-written. `rename` within one directory is atomic on POSIX and on
// Windows, and the existing mode is carried over.
async function writeFileAtomically(filename, contents) {
  const temporaryFilename = `${filename}.${process.pid}.${Date.now()}.tmp`;

  let mode;
  try {
    ({ mode } = await promises.stat(filename));
  } catch {
    // a file that does not exist yet keeps the default mode
  }

  await promises.writeFile(temporaryFilename, contents);
  try {
    if (mode !== undefined) {
      await promises.chmod(temporaryFilename, mode);
    }
    await promises.rename(temporaryFilename, filename);
  } catch (error) {
    await promises.rm(temporaryFilename, { force: true });
    throw error;
  }
}

// Step #1. the main function
// -----------------------------------------------------------------------------

export async function updateVersions({
  cwd = process.cwd(),
  effects = {},
  fetchPackage = packageJson,
  moduleMode = false,
  reportProgress = false,
} = {}) {
  let {
    deleteJsonValue = del,
    findPackageJsons = glob,
    readTextFile = readFile,
    setJsonValue = set,
    writeTextFile = writeFileAtomically,
  } = effects;

  // we'll use the object below to distil all unique package updates
  let updatedPackages = {};
  function printUpdated() {
    return Object.keys(updatedPackages)
      .sort()
      .map((n) => `${n} ${updatedPackages[n]}`)
      .join("\n");
  }
  function major(versNum) {
    if (typeof versNum === "string") {
      return (
        versNum.match(/^(?:workspace:)?[^\d]*(\d+)(?:\.|$)/)?.[1] ?? versNum
      );
    }
    return versNum;
  }

  let configPath = path.join(cwd, "upd.config.json");
  let newConfig;
  try {
    newConfig = await loadConfig(configPath, readTextFile);
  } catch (error) {
    throw new UpdateVersionsError([error]);
  }

  let packagePaths;
  try {
    packagePaths = await findPackageJsons(
      ["**/package.json", "!**/node_modules/**", "!**/test/**"],
      { cwd },
    );
  } catch (error) {
    throw new UpdateVersionsError([
      makeFailure("package discovery", cwd, error),
    ]);
  }

  let inventoryFailures = [];
  let pathsPromise = await pReduce(
    packagePaths,
    async (mapReceived, currentPath) => {
      let packagePath = path.join(cwd, currentPath);
      let packContentsStr;
      try {
        packContentsStr = await readTextFile(packagePath, "utf8");
      } catch (error) {
        inventoryFailures.push(makeFailure("package read", currentPath, error));
        return mapReceived;
      }

      let parsedContents;
      try {
        parsedContents = JSON.parse(packContentsStr);
        if (!isPlainObject(parsedContents)) {
          throw new TypeError(
            "update-versions/updateVersions(): [THROW_ID_08] package.json must contain a JSON object.",
          );
        }
      } catch (error) {
        inventoryFailures.push(
          makeFailure("package parse", currentPath, error),
        );
        return mapReceived;
      }

      mapReceived.namesList.push(parsedContents.name);
      mapReceived.pathsList.push(currentPath);
      mapReceived.pathsByName[parsedContents.name] = currentPath;
      mapReceived.contentsStr[currentPath] = packContentsStr;
      mapReceived.contentsObj[currentPath] = parsedContents;
      return mapReceived;
    },
    {
      namesList: [],
      pathsList: [],
      pathsByName: {},
      contentsObj: {},
      contentsStr: {},
    },
  );

  if (inventoryFailures.length > 0) {
    throw new UpdateVersionsError(inventoryFailures, {
      unchangedFiles: pathsPromise.pathsList,
    });
  }

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
            !Object.hasOwn(newConfig.pin, name)
          ) {
            let parsedSpec = parseDependencySpec(name, spec);
            if (
              parsedSpec.targetName &&
              !pathsPromise.namesList.includes(parsedSpec.targetName)
            ) {
              externalNames.add(parsedSpec.targetName);
            }
          }
        }
      }
    }
  }

  let registryFailures = [];
  let registryMetadata = new Map();
  let registryResults = await Promise.all(
    [...externalNames].map(async (name) => {
      try {
        let metadata = await fetchPackage(name, { fullMetadata: true });
        if (
          !metadata ||
          typeof metadata.version !== "string" ||
          metadata.version.length === 0
        ) {
          throw new TypeError(`${name} returned no version`);
        }
        return { metadata, name };
      } catch (error) {
        return { error, name };
      }
    }),
  );
  for (let result of registryResults) {
    if (result.error) {
      registryFailures.push(
        makeFailure("registry lookup", result.name, result.error),
      );
    } else {
      registryMetadata.set(result.name, result.metadata);
    }
  }

  if (registryFailures.length > 0) {
    throw new UpdateVersionsError(registryFailures, {
      unchangedFiles: pathsPromise.pathsList,
    });
  }

  if (moduleMode) {
    for (let [name, metadata] of registryMetadata) {
      if (
        metadata?.type === "module" &&
        !newConfig.noMajorBumping.includes(name)
      ) {
        newConfig.noMajorBumping.push(name);
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
        let fileUpdates = {};

        try {
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
            let singleDepValue = Object.hasOwn(
              parsedContents.dependencies ?? {},
              singleDepName,
            )
              ? parsedContents.dependencies[singleDepName]
              : parsedContents.devDependencies[singleDepName];
            let parsedSpec = parseDependencySpec(singleDepName, singleDepValue);
            if (pathsPromise.namesList.includes(parsedSpec.targetName)) {
              let localVersion =
                pathsPromise.contentsObj[
                  pathsPromise.pathsByName[parsedSpec.targetName]
                ].version;
              compiledDepNameVersionPairs[singleDepName] =
                typeof localVersion === "string" && localVersion.length > 0
                  ? localVersion
                  : null;
            } else {
              compiledDepNameVersionPairs[singleDepName] =
                registryMetadata.get(parsedSpec.targetName)?.version ?? null;
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
                objectPath.has(
                  parsedContents,
                  "lect.various.devDependencies",
                ) &&
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
                finalContents = deleteJsonValue(
                  finalContents,
                  `lect.various.devDependencies.${foundIdx}`,
                );
                amended = true;
              }

              // tackle the deps list:
              // ---------------------

              let singleDepName = keys[y];
              let singleDepValue = parsedContents.dependencies[keys[y]];
              if (singleDepValue.startsWith("file:")) {
                continue;
              }
              let parsedSpec = parseDependencySpec(
                singleDepName,
                singleDepValue,
              );
              if (Object.hasOwn(newConfig.pin, singleDepName)) {
                let nextSpec = pinnedDependencySpec(
                  parsedSpec,
                  singleDepValue,
                  newConfig.pin[singleDepName],
                );
                if (singleDepValue !== nextSpec) {
                  finalContents = setJsonValue(
                    finalContents,
                    `dependencies.${singleDepName}`,
                    nextSpec,
                  );
                  amended = true;
                  fileUpdates[singleDepName] = nextSpec;
                }
              } else if (compiledDepNameVersionPairs[singleDepName] !== null) {
                let nextSpec = updatedDependencySpec(
                  parsedSpec,
                  singleDepValue,
                  compiledDepNameVersionPairs[singleDepName],
                );
                if (
                  singleDepValue !== nextSpec &&
                  // either dependency is not blacklisted (so we don't care)
                  (!newConfig.noMajorBumping.some((name) =>
                    [singleDepName, parsedSpec.targetName].includes(name),
                  ) ||
                    // or it is blacklisted but the bump is within the same major semver digit
                    major(compiledDepNameVersionPairs[singleDepName]) ===
                      major(parsedSpec.selector))
                ) {
                  finalContents = setJsonValue(
                    finalContents,
                    `dependencies.${singleDepName}`,
                    nextSpec,
                  );
                  amended = true;
                  fileUpdates[singleDepName] =
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
                  finalContents = deleteJsonValue(
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
              let parsedSpec = parseDependencySpec(
                singleDepName,
                singleDepValue,
              );
              if (Object.hasOwn(newConfig.pin, singleDepName)) {
                let nextSpec = pinnedDependencySpec(
                  parsedSpec,
                  singleDepValue,
                  newConfig.pin[singleDepName],
                );
                if (singleDepValue !== nextSpec) {
                  finalContents = setJsonValue(
                    finalContents,
                    `devDependencies.${singleDepName}`,
                    nextSpec,
                  );
                  amended = true;
                  fileUpdates[singleDepName] = nextSpec;
                }
              } else if (compiledDepNameVersionPairs[singleDepName] !== null) {
                let nextSpec = updatedDependencySpec(
                  parsedSpec,
                  singleDepValue,
                  compiledDepNameVersionPairs[singleDepName],
                );
                if (
                  singleDepValue !== nextSpec &&
                  // either dependency is not blacklisted (so we don't care)
                  (!newConfig.noMajorBumping.some((name) =>
                    [singleDepName, parsedSpec.targetName].includes(name),
                  ) ||
                    // or it is blacklisted but the bump is within the same major semver digit
                    major(compiledDepNameVersionPairs[singleDepName]) ===
                      major(parsedSpec.selector))
                ) {
                  finalContents = setJsonValue(
                    finalContents,
                    `devDependencies.${singleDepName}`,
                    nextSpec,
                  );
                  amended = true;
                  fileUpdates[singleDepName] =
                    compiledDepNameVersionPairs[singleDepName];
                }
              }

              progress(
                0.75 +
                  0.24 * ((totalDeps.length - len2 + y) / totalDeps.length),
              );
            }
          }

          if (Object.hasOwn(parsedContents, "gitHead")) {
            finalContents = deleteJsonValue(finalContents, "gitHead");
            amended = true;
          }
        } catch (error) {
          progress(1);
          return {
            error: makeFailure("package transform", oneOfPaths, error),
            path: oneOfPaths,
          };
        }

        if (amended) {
          try {
            await writeTextFile(path.join(cwd, oneOfPaths), finalContents);
          } catch (error) {
            progress(1);
            return {
              error: makeFailure("package write", oneOfPaths, error),
              path: oneOfPaths,
            };
          }
          progress(1);
          return { path: oneOfPaths, status: "updated", updates: fileUpdates };
        }

        progress(1);
        return { path: oneOfPaths, status: "unchanged", updates: fileUpdates };
      }),
    ),
  );

  let diff;
  if (reportProgress) {
    diff = diff1();
    allProgressPromise.onProgress((val) => {
      if (val < 1) {
        diff.write(`${messagePrefix}${Math.floor(val * 100)}% done`);
      }
    });
    diff.pipe(process.stdout);
  }

  let processingResults = await allProgressPromise;
  let processingFailures = [];
  let unchangedFiles = [];
  let updatedFiles = [];

  for (let result of processingResults) {
    if (result.error) {
      processingFailures.push(result.error);
    } else if (result.status === "updated") {
      updatedFiles.push(result.path);
      for (let [name, version] of Object.entries(result.updates)) {
        if (!Object.hasOwn(updatedPackages, name)) {
          updatedPackages[name] = version;
        }
      }
    } else {
      unchangedFiles.push(result.path);
    }
  }

  if (diff) {
    if (processingFailures.length > 0) {
      diff.write(
        `${messagePrefix}completed with ${processingFailures.length} ${
          processingFailures.length === 1 ? "failure" : "failures"
        }; ${updatedFiles.length} updated, ${unchangedFiles.length} unchanged${
          Object.keys(updatedPackages).length ? `:\n${printUpdated()}` : ""
        }`,
      );
    } else {
      diff.write(
        `${messagePrefix}${
          updatedFiles.length > 0 && Object.keys(updatedPackages).length
            ? `all updated:\n${printUpdated()}`
            : updatedFiles.length > 0
              ? `${updatedFiles.length} package.json ${
                  updatedFiles.length === 1 ? "file" : "files"
                } updated (metadata cleanup only)`
              : "everything was already up-to-date"
        }`,
      );
    }
    diff.end();
  }

  if (processingFailures.length > 0) {
    throw new UpdateVersionsError(processingFailures, {
      unchangedFiles,
      updatedFiles,
      updatedPackages,
    });
  }

  return updatedPackages;
}

async function runCli() {
  const cli = parseCli();

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
  updateNotifier({ pkg }).notify();
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
    let details =
      error instanceof AggregateError
        ? error.errors
            .map(
              (failure) =>
                `\n- [${failure.phase ?? "unknown"}] ${failure.path ?? "unknown"}: ${failure.cause?.message ?? failure.message}`,
            )
            .join("")
        : "";
    console.error(
      `\n${messagePrefix}${`\u001b[${31}m${error.message}${details}\u001b[${39}m`}\n`,
    );
    process.exitCode = 1;
  });
}
