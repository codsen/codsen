#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readRootToolchainPolicy } from "../helpers/rootToolchain.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

function npmVersion() {
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(command, ["--version"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
  if (result.error || result.status !== 0) {
    const detail = result.error?.message ?? result.stderr.trim();
    throw new Error(`Could not determine the running npm version: ${detail}`);
  }
  return result.stdout.trim();
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

const arguments_ = process.argv.slice(2);
if (arguments_.length === 1 && arguments_[0] === "--npm-spec") {
  const policy = readRootToolchainPolicy(repositoryRoot);
  if (!reportErrors(policy.errors)) {
    console.log(policy.npmSpec);
  }
} else if (arguments_.length === 0) {
  try {
    const policy = readRootToolchainPolicy(repositoryRoot, {
      actualNodeVersion: process.versions.node,
      actualNpmVersion: npmVersion(),
    });
    if (!reportErrors(policy.errors)) {
      console.log(
        `Root toolchain OK: Node ${policy.nodeVersion}; npm ${policy.npmVersion}.`,
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
