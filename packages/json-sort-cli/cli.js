#!/usr/bin/env node

import { fstatSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { glob } from "codsen-glob";
import updateNotifier from "update-notifier";
import { formatParsedJson } from "./json-formatter.js";
import { ProcessingError, processFiles } from "./process-files.js";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");
const prefix = "✨ json-sort-cli: ";
const nonJsonFormats = new Set([".yml", ".toml", ".yaml"]);
const ignoredBasenames = new Set([
  ".DS_Store",
  "npm-debug.log",
  ".svn",
  "CVS",
  "config.gypi",
  ".lock-wscript",
  "package-lock.json",
  "npm-shrinkwrap.json",
  "yarn.lock",
]);
const flagDefinitions = {
  arrays: { short: "a", type: "boolean" },
  ci: { short: "c", type: "boolean" },
  dry: { short: "d", type: "boolean" },
  help: { short: "h", type: "boolean" },
  indentationCount: { short: "i", type: "value" },
  lineEnding: { short: "l", type: "value" },
  nodemodules: { short: "n", type: "boolean" },
  pack: { short: "p", type: "boolean" },
  silent: { short: "s", type: "boolean" },
  stdout: { type: "boolean" },
  tabs: { short: "t", type: "boolean" },
  version: { short: "v", type: "boolean" },
};
const shortToLong = new Map(
  Object.entries(flagDefinitions)
    .filter(([, definition]) => definition.short)
    .map(([long, definition]) => [definition.short, long]),
);

const help = `
Usage
  $ jsonsort YOURFILE.json
  $ jsonsort YOURFILE.json --stdout
  $ jsonsort - < YOURFILE.json
  $ cat YOURFILE.json | jsonsort
  $ sortjson templatesfolder1 templatesfolder2 package.json
  $ jsonsort

With no file arguments, piped input is sorted to stdout. The "-" operand reads
stdin, and --stdout prints one matched file. These forms don't write files or mix
status messages into stdout. Otherwise, with no arguments, jsonsort recursively
sorts JSON files below the current directory. Discovered symbolic links are not
followed. An explicitly selected symbolic-link directory is resolved as the
selected root; symbolic-link files are rejected before reading.

Options
  -n, --nodemodules      Include JSON files inside node_modules; lockfiles remain excluded
  -t, --tabs             Use tabs for indentation
  -i, --indentationCount Use 0-10 spaces or tabs (default: 2 spaces or 1 tab)
  -s, --silent           Suppress all terminal output; use the exit code for the result
  -h, --help             Show this help
  -v, --version          Show the current version
  -a, --arrays           Sort arrays that contain only strings
  -d, --dry              List candidate files without reading or writing them
  -p, --pack             Exclude package.json files
  -c, --ci               Check without writing; exit 9 when canonical output differs
  -l, --lineEnding       Use "cr", "crlf", or "lf" instead of the detected line ending
      --stdout           Print one sorted JSON document without writing files

Use -- before a path that begins with a dash. Invalid options exit 1 before
file discovery. Processing failures exit 1 and don't stop independent files.

Example
  $ cat data.json | jsonsort --arrays | other-command
`;

function argumentError(message) {
  throw new TypeError(
    `json-sort-cli/parseArguments(): [THROW_ID_01] ${message}`,
  );
}

function requestsSilent(rawArguments) {
  let optionsEnded = false;
  for (const argument of rawArguments) {
    if (optionsEnded) {
      continue;
    }
    if (argument === "--") {
      optionsEnded = true;
    } else if (argument === "--silent") {
      return true;
    } else if (argument.startsWith("-") && !argument.startsWith("--")) {
      for (const short of argument.slice(1)) {
        const name = shortToLong.get(short);
        if (!name) {
          break;
        }
        if (name === "silent") {
          return true;
        }
        if (flagDefinitions[name].type === "value") {
          break;
        }
      }
    }
  }
  return false;
}

function parseArguments(rawArguments, { stdinIsPiped = false } = {}) {
  const expanded = rawArguments.flatMap((argument) => {
    const match = argument.match(/^-(i|l)\s+(.+)$/u);
    return match ? [`-${match[1]}`, match[2]] : [argument];
  });
  const flags = Object.fromEntries(
    Object.keys(flagDefinitions).map((name) => [name, false]),
  );
  flags.indentationCount = undefined;
  flags.lineEnding = undefined;
  const input = [];
  const seen = new Set();
  let optionsEnded = false;

  function setFlag(name, value = true) {
    if (seen.has(name)) {
      argumentError(`Option --${name} was provided more than once`);
    }
    seen.add(name);
    flags[name] = value;
  }

  for (let index = 0; index < expanded.length; index += 1) {
    const argument = expanded[index];
    if (optionsEnded) {
      input.push(argument);
      continue;
    }
    if (argument === "--") {
      optionsEnded = true;
      continue;
    }
    if (!argument.startsWith("-") || argument === "-") {
      input.push(argument);
      continue;
    }

    if (argument.startsWith("--")) {
      const equalsIndex = argument.indexOf("=");
      const name = argument.slice(
        2,
        equalsIndex === -1 ? undefined : equalsIndex,
      );
      const definition = flagDefinitions[name];
      if (!definition) {
        argumentError(`Unknown option --${name}`);
      }
      if (definition.type === "boolean") {
        if (equalsIndex !== -1) {
          argumentError(`Option --${name} doesn't accept a value`);
        }
        setFlag(name);
        continue;
      }

      let value =
        equalsIndex === -1 ? undefined : argument.slice(equalsIndex + 1);
      if (value === undefined) {
        value = expanded[index + 1];
        const flagShapedValue =
          value?.startsWith("-") &&
          !(name === "indentationCount" && /^-\d/u.test(value));
        if (value === undefined || flagShapedValue) {
          argumentError(`Option --${name} requires a value`);
        }
        index += 1;
      }
      if (value === "") {
        argumentError(`Option --${name} requires a value`);
      }
      setFlag(name, value);
      continue;
    }

    let shortFlags = argument.slice(1);
    while (shortFlags.length) {
      const short = shortFlags[0];
      const name = shortToLong.get(short);
      if (!name) {
        argumentError(`Unknown option -${short}`);
      }
      const definition = flagDefinitions[name];
      shortFlags = shortFlags.slice(1);
      if (definition.type === "boolean") {
        setFlag(name);
        continue;
      }

      let value = shortFlags.replace(/^=/u, "");
      shortFlags = "";
      if (!value) {
        value = expanded[index + 1];
        const flagShapedValue =
          value?.startsWith("-") &&
          !(name === "indentationCount" && /^-\d/u.test(value));
        if (value === undefined || flagShapedValue) {
          argumentError(`Option -${short} requires a value`);
        }
        index += 1;
      }
      setFlag(name, value);
    }
  }

  const defaultIndentation = flags.tabs ? 1 : 2;
  const indentationCount =
    flags.indentationCount === undefined
      ? defaultIndentation
      : Number(flags.indentationCount);
  if (
    !Number.isInteger(indentationCount) ||
    indentationCount < 0 ||
    indentationCount > 10
  ) {
    argumentError("indentationCount must be an integer from 0 to 10");
  }
  if (
    flags.lineEnding !== undefined &&
    !["cr", "crlf", "lf"].includes(flags.lineEnding)
  ) {
    argumentError('lineEnding must be "cr", "crlf", or "lf"');
  }

  const hasInput = input.length > 0;
  const informational = flags.help || flags.version;
  const printsJson =
    flags.stdout || input.includes("-") || (!hasInput && stdinIsPiped);
  if (!hasInput && expanded.length > 0 && !informational && !stdinIsPiped) {
    argumentError(
      "Provide at least one path, or run jsonsort with no arguments",
    );
  }
  if (!informational && printsJson) {
    for (const incompatible of ["ci", "dry", "silent"]) {
      if (flags[incompatible]) {
        argumentError(
          `Option --${incompatible} cannot be used when printing sorted JSON to stdout`,
        );
      }
    }
  }

  return {
    flags,
    hasInput,
    indentationCount,
    input: hasInput ? input : ["**/*.json"],
  };
}

function isCandidate(filePath) {
  const basename = path.basename(filePath);
  if (ignoredBasenames.has(basename)) {
    return false;
  }

  const extension = path.extname(filePath).toLowerCase();
  return (
    extension === ".json" ||
    (basename.startsWith(".") && !nonJsonFormats.has(extension))
  );
}

function standardInputIsPiped() {
  if (process.stdin.isTTY === true) {
    return false;
  }
  try {
    return !fstatSync(process.stdin.fd).isCharacterDevice();
  } catch {
    // A missing or inaccessible stdin is not a pipeline source.
    return false;
  }
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function discoverPaths(input, flags) {
  const paths = await glob(
    [
      ...input,
      "!**/package-lock.json",
      "!**/npm-shrinkwrap.json",
      "!**/yarn.lock",
      ...(flags.nodemodules ? [] : ["!**/node_modules/**"]),
      ...(flags.pack ? ["!**/package.json"] : []),
    ],
    {
      dot: true,
      expandDirectories: { files: [".*", "*.json", "*.JSON"] },
      followSymbolicLinks: false,
    },
  );
  return paths.filter(isCandidate);
}

async function resolveStdoutSource(input, flags) {
  if (input.includes("-")) {
    if (input.length !== 1) {
      argumentError(
        'The standard-input operand "-" cannot be combined with file paths',
      );
    }
    return "-";
  }

  const paths = await discoverPaths(input, flags);
  if (paths.length !== 1) {
    throw new Error(
      `Printing sorted JSON to stdout requires exactly one input; found ${paths.length}`,
    );
  }
  return paths[0];
}

async function formatSource(source, options) {
  let output;
  await processFiles([source], {
    ...options,
    ci: true,
    ...(source === "-" ? { read: readStdin } : {}),
    transform(parsed, formatOptions) {
      const prepared = formatParsedJson(
        parsed,
        formatOptions.contents,
        formatOptions,
      );
      output = prepared.output;
      return prepared;
    },
  });
  return output;
}

function errorMessage(error) {
  if (error instanceof ProcessingError) {
    return error.failures.map((failure) => failure.message).join("\n");
  }
  return error instanceof Error ? error.message : String(error);
}

function handleStdoutError(error) {
  if (error?.code === "EPIPE") {
    return;
  }
  console.error(`${prefix}${errorMessage(error)}`);
  process.exitCode = 1;
}

function createPrinter() {
  const useColour = Boolean(process.stdout.isTTY && !process.env.NO_COLOR);
  const colours = { green: 32, grey: 90, red: 31, white: 37, yellow: 33 };
  const colour = (value, name) =>
    useColour ? `\u001b[${colours[name]}m${value}\u001b[39m` : value;
  return { colour };
}

async function main() {
  const rawArguments = process.argv.slice(2);
  const silentRequested = requestsSilent(rawArguments);
  const stdinIsPiped = standardInputIsPiped();
  let parsed;
  try {
    parsed = parseArguments(rawArguments, { stdinIsPiped });
  } catch (error) {
    if (!silentRequested) {
      console.error(error.message);
    }
    process.exitCode = 1;
    return;
  }

  const { flags, hasInput, indentationCount, input } = parsed;
  if (flags.version) {
    console.log(pkg.version);
    return;
  }
  if (flags.help) {
    console.log(help);
    return;
  }

  const printsJson =
    flags.stdout || input.includes("-") || (!hasInput && stdinIsPiped);

  if (!flags.silent && !flags.ci && !printsJson && process.stdout.isTTY) {
    try {
      updateNotifier({ pkg }).notify();
    } catch {}
  }

  const options = {
    arrays: flags.arrays,
    indentationCount,
    lineEnding: flags.lineEnding || undefined,
    pack: flags.pack,
    tabs: flags.tabs,
  };

  if (printsJson) {
    try {
      const source = await resolveStdoutSource(hasInput ? input : ["-"], flags);
      process.stdout.on("error", handleStdoutError);
      process.stdout.write(await formatSource(source, options));
    } catch (error) {
      if (!flags.silent) {
        console.error(`${prefix}${errorMessage(error)}`);
      }
      process.exitCode = 1;
    }
    return;
  }

  const { colour } = createPrinter();
  let paths;
  try {
    paths = await discoverPaths(input, flags);
  } catch (error) {
    if (!flags.silent) {
      console.error(`${prefix}${error}`);
    }
    process.exitCode = 1;
    return;
  }

  if (!paths.length) {
    if (!flags.silent) {
      console.log(`${prefix}The inputs don't lead to any JSON files. Exiting.`);
    }
    return;
  }

  if (flags.dry) {
    if (!flags.silent) {
      console.log(
        `${prefix}We'd try to sort the following files:\n${paths.join("\n")}`,
      );
    }
    return;
  }

  try {
    const { successful, unsorted } = await processFiles(paths, {
      ...options,
      ci: flags.ci,
      onOutcome(outcome) {
        if (flags.silent) {
          return;
        }
        if (outcome.status === "failure") {
          console.error(
            `${prefix}${outcome.path} - BAD (${outcome.stage}) - ${outcome.error}`,
          );
        } else if (!flags.ci) {
          console.log(`${prefix}${outcome.path} - OK`);
        }
      },
    });

    if (flags.silent) {
      if (flags.ci && unsorted.length) {
        process.exitCode = 9;
      }
      return;
    }
    if (flags.ci) {
      if (unsorted.length) {
        console.log(
          `${prefix}${colour("Unsorted files:", "red")}\n${unsorted.join("\n")}`,
        );
        process.exitCode = 9;
      } else {
        console.log(
          `${prefix}${colour("All files were already sorted:", "white")}\n${successful.join("\n")}`,
        );
      }
      return;
    }
    console.log(
      `\n${prefix}${colour(
        `All ${successful.length} file${successful.length === 1 ? "" : "s"} sorted`,
        "green",
      )}`,
    );
  } catch (error) {
    if (!(error instanceof ProcessingError)) {
      if (!flags.silent) {
        console.error(`${prefix}${error}`);
      }
      process.exitCode = 1;
      return;
    }

    if (!flags.silent) {
      if (flags.ci) {
        const unsorted = new Set(error.unsorted);
        const alreadySorted = error.successful.filter(
          (filePath) => !unsorted.has(filePath),
        );
        if (alreadySorted.length) {
          console.log(
            `${prefix}${alreadySorted.length} file${alreadySorted.length === 1 ? "" : "s"} already sorted:\n${alreadySorted.join("\n")}`,
          );
        }
        if (error.unsorted.length) {
          console.log(`${prefix}Unsorted files:\n${error.unsorted.join("\n")}`);
        }
      } else if (error.successful.length) {
        console.log(
          `\n${prefix}${error.successful.length} file${error.successful.length === 1 ? "" : "s"} sorted`,
        );
      }
      console.error(
        `${prefix}${error.failures.length} file${error.failures.length === 1 ? "" : "s"} could not be ${flags.ci ? "checked" : "sorted"} - ${error.failures.map(({ path: failedPath }) => failedPath).join(" - ")}`,
      );
    }
    process.exitCode = 1;
  }
}

await main();
