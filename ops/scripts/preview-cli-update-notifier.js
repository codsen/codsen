#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";

import { formatCliUpdateNotification } from "../lect/common/cliUpdateNotifier.js";

const DEFAULT_COUNT = 12;
const DEFAULT_DELAY = 150;
const MAX_COUNT = 100;
const MAX_DELAY = 60_000;
const MAX_SEED = 0xffff_ffff;
const PACKAGE_NAMES = [
  "codsen",
  "csv-sort-cli",
  "email-all-chars-within-ascii-cli",
  "generate-atomic-css-cli",
  "js-row-num-cli",
  "json-comb",
  "json-sort-cli",
  "lerna-clean-changelogs-cli",
  "update-versions",
];
const UPDATE_KINDS = ["patch", "minor", "major", "prerelease"];
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const USAGE = `Preview the production CLI update-notification format with fictional versions.

Usage: npm run preview:update-notifier -- [options]

Options:
  --count N, --count=N  Number of notifications, from 1 to ${MAX_COUNT} (default: ${DEFAULT_COUNT})
  --delay N, --delay=N  Delay between notifications in milliseconds, from 0 to ${MAX_DELAY} (default: ${DEFAULT_DELAY})
  --seed N, --seed=N    Reproduce one random sequence with a seed from 0 to ${MAX_SEED}
  -h, --help            Show this help

The blocks use the same formatter and stderr destination as the published CLIs.
The preview also renders off-TTY for capture; published CLIs suppress notices
off-TTY. It does not contact npm or read from or write to the normal cache.
Versions are fictional.
`;

function readIntegerOption(name, value, minimum, maximum) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    throw new Error(
      `${name} must be an integer from ${minimum} to ${maximum}; received ${JSON.stringify(value)}`,
    );
  }
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < minimum || number > maximum) {
    throw new Error(
      `${name} must be an integer from ${minimum} to ${maximum}; received ${JSON.stringify(value)}`,
    );
  }
  return number;
}

function optionValue(argv, index, name) {
  const argument = argv[index];
  const prefix = `${name}=`;
  if (argument.startsWith(prefix)) {
    return { consumed: 0, value: argument.slice(prefix.length) };
  }
  if (argument === name) {
    return { consumed: 1, value: argv[index + 1] };
  }
  return null;
}

function parseArguments(argv) {
  const options = {
    count: DEFAULT_COUNT,
    delay: DEFAULT_DELAY,
    help: false,
    seed: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }
    const count = optionValue(argv, index, "--count");
    if (count) {
      options.count = readIntegerOption("--count", count.value, 1, MAX_COUNT);
      index += count.consumed;
      continue;
    }
    const delay = optionValue(argv, index, "--delay");
    if (delay) {
      options.delay = readIntegerOption("--delay", delay.value, 0, MAX_DELAY);
      index += delay.consumed;
      continue;
    }
    const seed = optionValue(argv, index, "--seed");
    if (seed) {
      options.seed = readIntegerOption("--seed", seed.value, 0, MAX_SEED);
      index += seed.consumed;
      continue;
    }
    throw new Error(`Unknown option ${JSON.stringify(argument)}`);
  }
  return options;
}

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function randomInteger(random, minimum, maximum) {
  return Math.floor(random() * (maximum - minimum + 1)) + minimum;
}

function shuffled(values, random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInteger(random, 0, index);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function createFakeScenario(
  random,
  packageName = PACKAGE_NAMES[
    randomInteger(random, 0, PACKAGE_NAMES.length - 1)
  ],
  updateKind = UPDATE_KINDS[randomInteger(random, 0, UPDATE_KINDS.length - 1)],
) {
  const major = randomInteger(random, 0, 9);
  const minor = randomInteger(random, 0, 24);
  const patch = randomInteger(random, 0, 40);
  const jump = randomInteger(random, 1, 9);

  if (updateKind === "patch") {
    return {
      currentVersion: `${major}.${minor}.${patch}`,
      latestVersion: `${major}.${minor}.${patch + jump}`,
      packageName,
    };
  }
  if (updateKind === "minor") {
    return {
      currentVersion: `${major}.${minor}.${patch}`,
      latestVersion: `${major}.${minor + jump}.0`,
      packageName,
    };
  }
  if (updateKind === "major") {
    return {
      currentVersion: `${major}.${minor}.${patch}`,
      latestVersion: `${major + jump}.0.0`,
      packageName,
    };
  }
  const prerelease = randomInteger(random, 1, 12);
  return {
    currentVersion: `${major}.${minor}.${patch}-beta.${prerelease}`,
    latestVersion: `${major}.${minor}.${patch}`,
    packageName,
  };
}

function createFakeScenarios(count, random) {
  const scenarios = [];
  let packageNames = [];
  let updateKinds = [];
  for (let index = 0; index < count; index += 1) {
    if (index % PACKAGE_NAMES.length === 0) {
      packageNames = shuffled(PACKAGE_NAMES, random);
    }
    if (index % UPDATE_KINDS.length === 0) {
      updateKinds = shuffled(UPDATE_KINDS, random);
    }
    scenarios.push(
      createFakeScenario(
        random,
        packageNames[index % PACKAGE_NAMES.length],
        updateKinds[index % UPDATE_KINDS.length],
      ),
    );
  }
  return scenarios;
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function previewCliUpdateNotifications(
  { count = DEFAULT_COUNT, delay = DEFAULT_DELAY, seed = null } = {},
  runtime = {},
) {
  const actualSeed = seed ?? Date.now() >>> 0;
  const random = createSeededRandom(actualSeed);
  const stderr = runtime.stderr ?? process.stderr;
  const stdout = runtime.stdout ?? process.stdout;
  const waitFor = runtime.wait ?? wait;
  const scenarios = createFakeScenarios(count, random);

  stdout.write(
    `Previewing ${count} fictional CLI update notification${count === 1 ? "" : "s"} (seed ${actualSeed}).\n`,
  );
  stdout.write(
    "The notification blocks below are the exact production format.\n",
  );

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && delay > 0) {
      await waitFor(delay);
    }
    stderr.write(formatCliUpdateNotification(scenarios[index]));
  }
  return { scenarios, seed: actualSeed };
}

async function run(argv = process.argv.slice(2), runtime = {}) {
  const stderr = runtime.stderr ?? process.stderr;
  const stdout = runtime.stdout ?? process.stdout;
  try {
    const options = parseArguments(argv);
    if (options.help) {
      stdout.write(USAGE);
      return true;
    }
    await previewCliUpdateNotifications(options, runtime);
    return true;
  } catch (error) {
    stderr.write(
      `Could not preview CLI update notifications: ${error.message}\n`,
    );
    stderr.write("Run with --help to see the available options.\n");
    return false;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  if (!(await run())) {
    process.exitCode = 1;
  }
}

export {
  createFakeScenario,
  createFakeScenarios,
  createSeededRandom,
  parseArguments,
  previewCliUpdateNotifications,
  run,
  USAGE,
};
