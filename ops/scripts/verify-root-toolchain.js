#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pairedNpmCliCandidates } from "../helpers/nodeProcessInvocation.js";
import { readRootToolchainPolicy } from "../helpers/rootToolchain.js";

const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = path.resolve(path.dirname(scriptPath), "../..");

function locatePairedNpmCli(
  nodeExecutable = process.execPath,
  {
    // biome-ignore lint/suspicious/noUndeclaredEnvVars: This direct verifier reads a machine-local executable path outside Turbo tasks.
    explicitNpmCli = process.env.CODSEN_NPM_CLI,
    exists = existsSync,
    platform = process.platform,
  } = {},
) {
  const candidates = pairedNpmCliCandidates(
    nodeExecutable,
    platform,
    explicitNpmCli,
  );
  const npmCli = candidates.find((candidate) => exists(candidate));
  if (!npmCli) {
    throw new Error(
      `Could not find npm paired with Node executable ${nodeExecutable}; checked ${candidates.join(
        ", ",
      )}`,
    );
  }
  return npmCli;
}

function npmVersion({
  locateNpm = locatePairedNpmCli,
  nodeExecutable = process.execPath,
  spawn = spawnSync,
} = {}) {
  const npmCli = locateNpm(nodeExecutable);
  const result = spawn(nodeExecutable, [npmCli, "--version"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    shell: false,
  });
  if (result.error || result.status !== 0) {
    const detail =
      result.error?.message ||
      result.stderr?.trim() ||
      `npm exited with code ${String(result.status)}`;
    throw new Error(
      `Could not determine the npm version paired with ${nodeExecutable} using ${npmCli}: ${detail}`,
    );
  }
  const version = result.stdout?.trim();
  if (!version) {
    throw new Error(
      `Could not determine the npm version paired with ${nodeExecutable} using ${npmCli}: npm returned no version`,
    );
  }
  return version;
}

function reportErrors(errors) {
  if (!errors.length) {
    return false;
  }
  console.error(
    `Root toolchain policy failed with ${errors.length} problem${errors.length === 1 ? "" : "s"}:\n- ${errors.join("\n- ")}`,
  );
  process.exitCode = 1;
  return true;
}

function run(arguments_ = process.argv.slice(2)) {
  if (arguments_.length === 1 && arguments_[0] === "--npm-spec") {
    const policy = readRootToolchainPolicy(repositoryRoot, {
      actualNodeVersion: undefined,
      actualNpmVersion: undefined,
    });
    if (!reportErrors(policy.errors)) {
      console.log(policy.npmSpec);
    }
  } else if (arguments_.length === 0) {
    try {
      const runningNode = process.versions.node;
      const runningNpm = npmVersion();
      const policy = readRootToolchainPolicy(repositoryRoot, {
        actualNodeVersion: runningNode,
        actualNpmVersion: runningNpm,
      });
      if (!reportErrors(policy.errors)) {
        // report what is running, not what is recorded - they are allowed to
        // differ, so printing the pin alone would misreport the environment
        console.log(
          `Root toolchain OK: Node ${runningNode} (>=${policy.nodeVersion}); npm ${runningNpm} (>=${policy.npmVersion}).`,
        );
      }
    } catch (error) {
      console.error(`Root toolchain policy failed: ${error.message}`);
      process.exitCode = 1;
    }
  } else {
    console.error(
      "Usage: node ops/scripts/verify-root-toolchain.js [--npm-spec]",
    );
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  run();
}

export { locatePairedNpmCli, npmVersion, run };
