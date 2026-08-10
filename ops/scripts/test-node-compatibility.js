#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertCanonicalNodeVersion,
  localCompatibilityLanePlan,
} from "../helpers/localNodeCompatibility.js";
import {
  readPackageRecords,
  supportedNodeMajors,
} from "../helpers/nodeCompatibility.js";
import { lowestNodeMajor } from "../helpers/nodeEngine.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const packageCompatibilityScript = path.join(
  repositoryRoot,
  "ops/scripts/package-node-compatibility.js",
);

function fail(message) {
  throw new Error(message);
}

function printUsage() {
  console.log(`Usage:
  node ops/scripts/test-node-compatibility.js [options]

Options:
  --concurrency <n>  Maximum simultaneous unit suites per lane (default: 4)
  --n <command>      n executable or command name (default: n)
  --keep-artifacts   Preserve artifacts and the shared npm cache on success
  -h, --help         Show this help

This command must itself run on the root-supported Node/npm toolchain. It builds
and packs once, then verifies cumulative Node ${supportedNodeMajors.join(", ")} lanes
sequentially with canonical exact runtimes resolved by n without switching the
global Node installation.`);
}

function parseArguments(argv) {
  const options = {
    concurrency: 4,
    keepArtifacts: false,
    n: "n",
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      printUsage();
      process.exit(0);
    }
    if (argument === "--keep-artifacts") {
      options.keepArtifacts = true;
      continue;
    }
    if (argument !== "--concurrency" && argument !== "--n") {
      fail(`Unknown option: ${argument}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      fail(`${argument} requires a value`);
    }
    index += 1;
    if (argument === "--concurrency") {
      options.concurrency = Number(value);
      if (!Number.isInteger(options.concurrency) || options.concurrency < 1) {
        fail("--concurrency must be a positive integer");
      }
    } else {
      options.n = value;
    }
  }
  return options;
}

function readJson(filename) {
  return JSON.parse(readFileSync(filename, "utf8"));
}

function versionAtLeast(actual, minimum) {
  const actualParts = actual.split(".").map(Number);
  const minimumParts = minimum.split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (actualParts[index] !== minimumParts[index]) {
      return actualParts[index] > minimumParts[index];
    }
  }
  return true;
}

function minimumVersion(engine, label) {
  const match = engine?.match(/^>=(\d+\.\d+\.\d+)$/);
  if (!match) {
    fail(`${label} engine must be an exact lower bound; received ${engine}`);
  }
  return match[1];
}

function npmCliPath(nodeExecutable) {
  const candidate = path.resolve(
    path.dirname(nodeExecutable),
    "../lib/node_modules/npm/bin/npm-cli.js",
  );
  if (!existsSync(candidate)) {
    fail(`Could not find npm paired with ${nodeExecutable}`);
  }
  return realpathSync(candidate);
}

function renderCommand(command, args) {
  return [command, ...args].join(" ");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repositoryRoot,
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
    ...options,
  });
  return result;
}

function failureMessage(command, args, result) {
  return [
    `Command failed: ${renderCommand(command, args)}`,
    result.status === null || result.status === undefined
      ? ""
      : `Exit status: ${result.status}`,
    result.signal ? `Signal: ${result.signal}` : "",
    result.error?.message,
    result.stdout,
    result.stderr,
  ]
    .filter(Boolean)
    .join("\n");
}

function runOrFail(command, args, options = {}) {
  const result = run(command, args, options);
  if (result.error || result.status !== 0) {
    fail(failureMessage(command, args, result));
  }
  return result;
}

function rootEnvironment() {
  return {
    ...process.env,
    CI: "true",
    FORCE_COLOR: "0",
    NO_COLOR: "1",
    NO_UPDATE_NOTIFIER: "1",
    PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH ?? ""}`,
    npm_config_audit: "false",
    npm_config_fund: "false",
    npm_config_update_notifier: "false",
  };
}

function assertRootToolchain() {
  const rootManifest = readJson(path.join(repositoryRoot, "package.json"));
  const minimumNodeMajor = lowestNodeMajor(rootManifest.engines?.node);
  const actualNodeMajor = Number(process.versions.node.split(".")[0]);
  if (actualNodeMajor < minimumNodeMajor) {
    fail(
      `Local compatibility orchestration needs root Node ${rootManifest.engines.node}; received ${process.version}`,
    );
  }

  const npmCli = npmCliPath(process.execPath);
  const npmVersion = runOrFail(process.execPath, [npmCli, "--version"], {
    env: rootEnvironment(),
  }).stdout.trim();
  const minimumNpm = minimumVersion(rootManifest.engines?.npm, "npm");
  if (!versionAtLeast(npmVersion, minimumNpm)) {
    fail(
      `Local compatibility orchestration needs root npm ${rootManifest.engines.npm}; received ${npmVersion}`,
    );
  }
  return { npmCli, npmVersion };
}

function resolveRuntime(nCommand, exactVersion) {
  const args = ["--quiet", "--download", "which", exactVersion];
  const result = run(nCommand, args);
  if (result.error || result.status !== 0) {
    return {
      error: failureMessage(nCommand, args, result),
      exactVersion,
      signal: result.signal,
    };
  }
  const outputLines = result.stdout.trim().split(/\r?\n/).filter(Boolean);
  const reportedPath = outputLines.at(-1);
  try {
    const executable = realpathSync(reportedPath);
    const actualVersion = runOrFail(executable, ["--version"])
      .stdout.trim()
      .replace(/^v/, "");
    assertCanonicalNodeVersion(
      Number(exactVersion.split(".")[0]),
      actualVersion,
    );
    return { exactVersion, executable };
  } catch (error) {
    return { error: error.message, exactVersion };
  }
}

function ensureEmptyDirectory(directory) {
  if (existsSync(directory) && readdirSync(directory).length > 0) {
    fail(`Expected an empty directory: ${directory}`);
  }
  mkdirSync(directory, { recursive: true });
}

function printSummary(lanes, runDirectory, preserved) {
  console.log("\nLocal Node compatibility summary");
  for (const lane of lanes) {
    const details = lane.error ? ` — ${lane.error.split("\n")[0]}` : "";
    console.log(
      `${lane.status.toUpperCase().padEnd(8)} Node ${lane.exactVersion}: ${lane.packageCount} cumulative packages${details}`,
    );
  }
  const passed = lanes.filter(({ status }) => status === "passed").length;
  const failed = lanes.length - passed;
  console.log(`${passed}/${lanes.length} lanes passed; ${failed} failed.`);
  const detailedFailures = lanes.filter(
    ({ error, status }) => status === "failed" && error?.includes("\n"),
  );
  if (detailedFailures.length) {
    console.error("\nFailure details");
    for (const lane of detailedFailures) {
      console.error(`\nNode ${lane.exactVersion}:\n${lane.error}`);
    }
  }
  if (preserved) {
    console.log(`Artifacts and shared npm cache preserved at ${runDirectory}`);
  }
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const { npmCli, npmVersion } = assertRootToolchain();
  console.log(
    `Root toolchain: Node ${process.versions.node}, npm ${npmVersion}; unit concurrency ${options.concurrency}`,
  );

  const records = readPackageRecords(repositoryRoot);
  const lanes = localCompatibilityLanePlan(records).map((lane) => ({
    ...lane,
    status: "pending",
  }));

  const runDirectory = mkdtempSync(
    path.join(tmpdir(), "codsen-local-node-compatibility-"),
  );
  console.log(`Compatibility working directory: ${runDirectory}`);
  const artifactsDirectory = path.join(runDirectory, "artifacts");
  const consumersDirectory = path.join(runDirectory, "consumers");
  const npmCache = path.join(runDirectory, "npm-cache");
  ensureEmptyDirectory(artifactsDirectory);
  ensureEmptyDirectory(consumersDirectory);
  ensureEmptyDirectory(npmCache);
  let stoppedBySignal;

  for (let laneIndex = 0; laneIndex < lanes.length; laneIndex += 1) {
    const lane = lanes[laneIndex];
    const resolved = resolveRuntime(options.n, lane.exactVersion);
    if (resolved.error) {
      lane.status = "failed";
      lane.error = resolved.error;
      if (resolved.signal) {
        stoppedBySignal = resolved.signal;
        for (const laterLane of lanes.slice(laneIndex + 1)) {
          laterLane.status = "not-run";
          laterLane.error = `Not run after ${resolved.signal}`;
        }
        break;
      }
    } else {
      lane.executable = resolved.executable;
    }
  }

  let prerequisiteError = stoppedBySignal
    ? `Not run after ${stoppedBySignal}`
    : undefined;

  try {
    if (prerequisiteError) {
      throw new Error(prerequisiteError);
    }
    console.log("\nValidating manifest, lockfile and internal runtime edges");
    runOrFail(
      process.execPath,
      [npmCli, "run", "ci:verify:node-compatibility"],
      { env: rootEnvironment(), stdio: "inherit" },
    );

    console.log("\nBuilding all workspaces once on the root toolchain");
    runOrFail(process.execPath, [npmCli, "run", "build"], {
      env: rootEnvironment(),
      stdio: "inherit",
    });

    console.log("\nPacking all workspaces once");
    runOrFail(
      process.execPath,
      [packageCompatibilityScript, "pack", "--output", artifactsDirectory],
      { env: rootEnvironment(), stdio: "inherit" },
    );
  } catch (error) {
    prerequisiteError = error.message;
  }

  if (prerequisiteError) {
    for (const lane of lanes) {
      if (lane.status === "pending") {
        lane.status = "failed";
        lane.error = `Not run: ${prerequisiteError}`;
      }
    }
  } else {
    for (let laneIndex = 0; laneIndex < lanes.length; laneIndex += 1) {
      const lane = lanes[laneIndex];
      if (lane.status === "failed") {
        continue;
      }
      console.log(
        `\nVerifying Node ${lane.exactVersion} (${lane.packageCount} cumulative packages)`,
      );
      const args = [
        packageCompatibilityScript,
        "verify",
        "--artifacts",
        artifactsDirectory,
        "--node-major",
        String(lane.nodeMajor),
        "--npm-cache",
        npmCache,
        "--temp-root",
        consumersDirectory,
        "--unit-concurrency",
        String(options.concurrency),
      ];
      const result = run(lane.executable, args, {
        env: {
          ...rootEnvironment(),
          PATH: `${path.dirname(lane.executable)}${path.delimiter}${process.env.PATH ?? ""}`,
        },
        stdio: "inherit",
      });
      if (result.error || result.status !== 0) {
        lane.status = "failed";
        lane.error = result.signal
          ? `verification terminated by ${result.signal}`
          : (result.error?.message ?? `verification exited ${result.status}`);
        if (result.signal) {
          stoppedBySignal = result.signal;
          for (const laterLane of lanes.slice(laneIndex + 1)) {
            if (laterLane.status === "pending") {
              laterLane.status = "not-run";
              laterLane.error = `Not run after ${result.signal}`;
            }
          }
          break;
        }
      } else {
        lane.status = "passed";
      }
    }
  }

  const failed = lanes.some(({ status }) => status !== "passed");
  const preserved = failed || options.keepArtifacts;
  printSummary(lanes, runDirectory, preserved);
  if (!preserved) {
    rmSync(runDirectory, { recursive: true, force: true });
  }
  if (failed) {
    process.exitCode =
      stoppedBySignal === "SIGINT"
        ? 130
        : stoppedBySignal === "SIGTERM"
          ? 143
          : 1;
  }
}

try {
  main();
} catch (error) {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
}
