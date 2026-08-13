#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { existsSync, realpathSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PACKAGE_KINDS } from "../helpers/packageKinds.js";
import { readPackageKindResolver } from "../helpers/packageKindsFile.js";
import { readWorkspaceRecords } from "../helpers/workspaceInventoryFile.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const runtimeDependencyFields = [
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
];
const packageKinds = readPackageKindResolver(repositoryRoot);

function fail(message) {
  throw new Error(message);
}

function printUsage() {
  console.log(`Usage:
  node ops/scripts/audit-package-units.js [options]

Options:
  --node <path>       Node executable used for every unit suite
  --npm-cli <path>    npm CLI paired with that Node installation
  --output <path>     Write the complete JSON inventory and results
  --unit-root <path>  Mirror root containing package test inputs (default: repo)
  --timeout <ms>      Per-package timeout (default: 120000)
  --concurrency <n>   Maximum simultaneous unit suites (default: 1)
  --package <name>    Run only this workspace; repeat to select more
  --inventory-only    Record inventory without running unit suites
  -h, --help          Show this help

The default Node executable is the one running this script. The default npm CLI
is resolved beside that executable, so this command never calls n or changes the
globally selected Node version.`);
}

function parseArguments(argv) {
  const options = {
    concurrency: 1,
    inventoryOnly: false,
    node: process.execPath,
    npmCli: undefined,
    output: undefined,
    packages: [],
    timeout: 120_000,
    unitRoot: repositoryRoot,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      printUsage();
      process.exit(0);
    }
    if (argument === "--inventory-only") {
      options.inventoryOnly = true;
      continue;
    }
    if (!argument.startsWith("--")) {
      fail(`Unexpected positional argument: ${argument}`);
    }
    const name = argument.slice(2);
    if (
      !new Set([
        "node",
        "npm-cli",
        "output",
        "package",
        "timeout",
        "unit-root",
        "concurrency",
      ]).has(name)
    ) {
      fail(`Unknown option: ${argument}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      fail(`${argument} requires a value`);
    }
    index += 1;
    if (name === "package") {
      options.packages.push(value);
    } else if (name === "timeout" || name === "concurrency") {
      options[name] = Number(value);
      if (!Number.isInteger(options[name]) || options[name] < 1) {
        fail(`--${name} must be a positive integer`);
      }
    } else {
      options[
        name === "npm-cli" ? "npmCli" : name === "unit-root" ? "unitRoot" : name
      ] = value;
    }
  }
  options.node = realpathSync(path.resolve(options.node));
  if (options.npmCli) {
    options.npmCli = realpathSync(path.resolve(options.npmCli));
  }
  if (options.output) {
    options.output = path.resolve(options.output);
  }
  options.unitRoot = realpathSync(path.resolve(options.unitRoot));
  return options;
}

function discoverWorkspaces() {
  return readWorkspaceRecords(repositoryRoot).map(
    ({ directory, manifest }) => ({
      directory: path.join(repositoryRoot, directory),
      packageJson: manifest,
    }),
  );
}

function packageType(record) {
  const kind = packageKinds.kindFor(record.packageJson.name);
  return kind === PACKAGE_KINDS.TYPESCRIPT_LIBRARY
    ? "rollup"
    : kind === PACKAGE_KINDS.CLI
      ? "cli"
      : "other";
}

function internalRuntimeDependencies(record, names) {
  const dependencies = new Set();
  for (const field of runtimeDependencyFields) {
    for (const name of Object.keys(record.packageJson[field] ?? {})) {
      if (names.has(name)) {
        dependencies.add(name);
      }
    }
  }
  return [...dependencies].sort();
}

function runVersion(node, args) {
  const result = spawnSync(node, args, { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    fail(
      `Could not inspect ${node}: ${result.error?.message ?? result.stderr}`,
    );
  }
  return result.stdout.trim();
}

function defaultNpmCli(node) {
  const candidate = path.resolve(
    path.dirname(node),
    "../lib/node_modules/npm/bin/npm-cli.js",
  );
  if (!existsSync(candidate)) {
    fail(
      `Could not find npm beside ${node}; supply its npm-cli.js with --npm-cli`,
    );
  }
  return realpathSync(candidate);
}

function runUnit(record, options) {
  const started = performance.now();
  const nodeDirectory = path.dirname(options.node);
  const unitDirectory = path.join(
    options.unitRoot,
    path.relative(repositoryRoot, record.directory),
  );
  if (!existsSync(path.join(unitDirectory, "package.json"))) {
    fail(
      `Unit mirror is missing ${path.relative(repositoryRoot, record.directory)}`,
    );
  }
  return new Promise((resolve) => {
    const child = spawn(
      options.node,
      [options.npmCli, "run", "unit", "--silent"],
      {
        cwd: unitDirectory,
        env: {
          ...process.env,
          CI: "1",
          NO_UPDATE_NOTIFIER: "1",
          PATH: `${nodeDirectory}${path.delimiter}${process.env.PATH ?? ""}`,
          npm_config_engine_strict: "false",
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let outputOverflow = false;
    let spawnError;
    let settled = false;
    let forceKill;

    function terminateChild() {
      child.kill("SIGTERM");
      forceKill ??= setTimeout(() => {
        if (!settled) {
          child.kill("SIGKILL");
        }
      }, 5_000);
    }

    function appendOutput(current, chunk) {
      if (Buffer.byteLength(current) + chunk.length > 50 * 1024 * 1024) {
        outputOverflow = true;
        terminateChild();
        return current;
      }
      return current + chunk.toString();
    }

    child.stdout.on("data", (chunk) => {
      stdout = appendOutput(stdout, chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr = appendOutput(stderr, chunk);
    });
    child.on("error", (error) => {
      spawnError = error;
    });

    const timeout = setTimeout(() => {
      timedOut = true;
      terminateChild();
    }, options.timeout);

    child.on("close", (exitCode, signal) => {
      settled = true;
      clearTimeout(timeout);
      if (forceKill) {
        clearTimeout(forceKill);
      }
      const status = timedOut
        ? "timeout"
        : spawnError || outputOverflow || exitCode !== 0
          ? "failed"
          : "passed";
      resolve({
        durationMs: Math.round(performance.now() - started),
        exitCode,
        signal,
        status,
        error:
          spawnError?.message ??
          (outputOverflow ? "Unit output exceeded 50 MiB" : undefined),
        stdout: status === "passed" ? undefined : stdout,
        stderr: status === "passed" ? undefined : stderr,
      });
    });
  });
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, Math.max(items.length, 1)) },
      () => worker(),
    ),
  );
  return results;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const allRecords = discoverWorkspaces();
  const allNames = new Set(
    allRecords.map(({ packageJson }) => packageJson.name),
  );
  const selectedNames = new Set(options.packages);
  for (const name of selectedNames) {
    if (!allNames.has(name)) {
      fail(`Unknown workspace package: ${name}`);
    }
  }
  const records = selectedNames.size
    ? allRecords.filter(({ packageJson }) =>
        selectedNames.has(packageJson.name),
      )
    : allRecords;

  const nodeVersion = runVersion(options.node, ["--version"]);
  if (!options.inventoryOnly) {
    options.npmCli ??= defaultNpmCli(options.node);
  }
  const npmVersion = options.inventoryOnly
    ? undefined
    : runVersion(options.node, [options.npmCli, "--version"]);

  const packages = await mapWithConcurrency(
    records,
    options.inventoryOnly ? 1 : options.concurrency,
    async (record) => {
      const inventory = {
        name: record.packageJson.name,
        directory: path.relative(repositoryRoot, record.directory),
        type: packageType(record),
        engine: record.packageJson.engines?.node ?? null,
        unitCommand: record.packageJson.scripts?.unit ?? null,
        directInternalRuntimeDependencies: internalRuntimeDependencies(
          record,
          allNames,
        ),
      };
      const result = options.inventoryOnly
        ? undefined
        : await runUnit(record, options);
      if (result) {
        console.log(
          `${result.status.padEnd(6)} ${String(result.durationMs).padStart(6)}ms ${inventory.name}`,
        );
      }
      return { ...inventory, result };
    },
  );

  const summary = {
    total: packages.length,
    passed: packages.filter(({ result }) => result?.status === "passed").length,
    failed: packages.filter(({ result }) => result?.status === "failed").length,
    timedOut: packages.filter(({ result }) => result?.status === "timeout")
      .length,
    notRun: packages.filter(({ result }) => !result).length,
  };
  const report = {
    schemaVersion: 1,
    unitRoot: options.unitRoot,
    node: { executable: options.node, version: nodeVersion },
    npm: options.inventoryOnly
      ? null
      : { cli: options.npmCli, version: npmVersion },
    summary,
    packages,
  };

  if (options.output) {
    writeFileSync(options.output, `${JSON.stringify(report, null, 2)}\n`);
  }
  console.log(JSON.stringify(summary));
  if (summary.failed || summary.timedOut) {
    process.exitCode = 1;
  }
}

try {
  await main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
