#!/usr/bin/env node

import { spawn } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import {
  parseTurboSummary,
  renderVerificationSummary,
} from "../helpers/ciTelemetry.js";

const MAX_CAPTURED_OUTPUT = 2 * 1024 * 1024;

function fail(message) {
  throw new Error(message);
}

function option(args, name, required = true) {
  const index = args.indexOf(name);
  if (index === -1) {
    if (required) {
      fail(`${name} is required`);
    }
    return undefined;
  }
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    fail(`${name} requires a value`);
  }
  return value;
}

function telemetryFilename() {
  // biome-ignore lint/suspicious/noUndeclaredEnvVars: This CI boundary consumes a path owned by the calling workflow, outside Turbo tasks.
  const filename = process.env.CODSEN_CI_TELEMETRY_FILE;
  if (!filename) {
    fail("CODSEN_CI_TELEMETRY_FILE is required");
  }
  return path.resolve(filename);
}

function readTelemetry(filename) {
  if (!existsSync(filename)) {
    return {
      records: [],
      schemaVersion: 1,
      startedAt: new Date().toISOString(),
    };
  }
  const value = JSON.parse(readFileSync(filename, "utf8"));
  if (value?.schemaVersion !== 1 || !Array.isArray(value.records)) {
    fail(`Invalid CI telemetry file: ${filename}`);
  }
  return value;
}

function updateTelemetry(update) {
  const filename = telemetryFilename();
  const telemetry = readTelemetry(filename);
  update(telemetry);
  writeFileSync(filename, `${JSON.stringify(telemetry, null, 2)}\n`);
}

function appendBounded(current, chunk) {
  const combined = current + chunk;
  return combined.length <= MAX_CAPTURED_OUTPUT
    ? combined
    : combined.slice(-MAX_CAPTURED_OUTPUT);
}

async function runGate(args) {
  const separator = args.indexOf("--");
  if (separator === -1 || separator === args.length - 1) {
    fail("run requires -- followed by a command");
  }
  const name = option(args.slice(0, separator), "--name");
  const [command, ...commandArgs] = args.slice(separator + 1);
  const startedAt = new Date();
  let capturedOutput = "";
  const child = spawn(command, commandArgs, {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    capturedOutput = appendBounded(capturedOutput, chunk.toString());
  });
  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
    capturedOutput = appendBounded(capturedOutput, chunk.toString());
  });
  const result = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code, signal) => resolve({ code, signal }));
  });
  const finishedAt = new Date();
  try {
    updateTelemetry((telemetry) => {
      telemetry.records.push({
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        finishedAt: finishedAt.toISOString(),
        kind: "gate",
        name,
        startedAt: startedAt.toISOString(),
        status:
          result.code === 0
            ? "passed"
            : result.signal
              ? `signal ${result.signal}`
              : `failed (${result.code})`,
        turbo: parseTurboSummary(capturedOutput),
      });
    });
  } catch (error) {
    console.error(`Could not record CI telemetry: ${error.message}`);
  }
  if (result.signal) {
    process.kill(process.pid, result.signal);
  } else {
    process.exitCode = result.code ?? 1;
  }
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "init") {
    writeFileSync(
      telemetryFilename(),
      `${JSON.stringify(
        { records: [], schemaVersion: 1, startedAt: new Date().toISOString() },
        null,
        2,
      )}\n`,
    );
    return;
  }
  if (command === "cache") {
    updateTelemetry((telemetry) => {
      telemetry.records.push({
        kind: "cache",
        matchedKey: option(args, "--matched-key", false) ?? "",
        name: option(args, "--name"),
        outcome: option(args, "--outcome"),
      });
    });
    return;
  }
  if (command === "summary") {
    const finishedAt = new Date().toISOString();
    const summary = renderVerificationSummary(
      readTelemetry(telemetryFilename()),
      finishedAt,
    );
    process.stdout.write(summary);
    // biome-ignore lint/suspicious/noUndeclaredEnvVars: GitHub Actions owns this per-step summary path outside Turbo tasks.
    const githubStepSummary = process.env.GITHUB_STEP_SUMMARY;
    if (githubStepSummary) {
      appendFileSync(githubStepSummary, summary);
    }
    return;
  }
  if (command === "run") {
    return runGate(args);
  }
  fail("Usage: ci-telemetry.js <init|cache|run|summary>");
}

await main();
