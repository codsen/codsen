#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  evaluateDependencySecurity,
  npmAuditInvocation,
  pairedNpmCliCandidates,
  validateWaiverPolicy,
} from "../helpers/dependencySecurity.js";

const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = path.resolve(path.dirname(scriptPath), "../..");
const waiverPath = path.join(
  repositoryRoot,
  "ops/security-advisory-waivers.json",
);

function formatFinding(finding) {
  return `${finding.severity}: ${finding.package} ${finding.id}`;
}

function npmErrorSummary(report) {
  if (
    report === null ||
    typeof report !== "object" ||
    Array.isArray(report) ||
    !Object.hasOwn(report, "error")
  ) {
    return undefined;
  }
  const error = report.error;
  if (error !== null && typeof error === "object" && !Array.isArray(error)) {
    const code = typeof error.code === "string" ? ` [${error.code}]` : "";
    const detail = [error.summary, error.message, error.detail].find(
      (value) => typeof value === "string" && value.trim().length > 0,
    );
    return `${code}${detail ? `: ${detail.trim()}` : ": unknown npm error"}`;
  }
  return `: ${typeof error === "string" ? error : "unknown npm error"}`;
}

function loadWaiverPolicy() {
  let source;
  try {
    source = readFileSync(waiverPath, "utf8");
  } catch (error) {
    throw new Error(`could not read ${waiverPath}: ${error.message}`);
  }
  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`could not parse ${waiverPath} as JSON: ${error.message}`);
  }
}

function locatePairedNpmCli(nodeExecutable = process.execPath) {
  const candidates = pairedNpmCliCandidates(nodeExecutable);
  const npmCli = candidates.find((candidate) => existsSync(candidate));
  if (!npmCli) {
    throw new Error(
      `could not find npm paired with ${nodeExecutable}; checked ${candidates.join(
        ", ",
      )}`,
    );
  }
  return npmCli;
}

function runDependencyAudit({
  args = process.argv.slice(2),
  loadPolicy = loadWaiverPolicy,
  locateNpm = locatePairedNpmCli,
  logger = console,
  nodeExecutable = process.execPath,
  spawn = spawnSync,
  today = new Date().toISOString().slice(0, 10),
} = {}) {
  if (args.length > 1 || (args.length === 1 && args[0] !== "--check-policy")) {
    logger.error(
      "Usage: node ops/scripts/audit-production-dependencies.js [--check-policy]",
    );
    return 1;
  }

  let waiverPolicy;
  try {
    waiverPolicy = loadPolicy();
  } catch (error) {
    logger.error(`Production dependency audit setup failed: ${error.message}`);
    return 1;
  }

  const validation = validateWaiverPolicy(waiverPolicy, today);
  if (validation.errors.length > 0) {
    logger.error(
      `Security waiver policy failed:\n- ${validation.errors.join("\n- ")}`,
    );
    return 1;
  }
  if (args[0] === "--check-policy") {
    logger.log(
      `Security waiver policy passed: ${validation.waivers.length} waiver${
        validation.waivers.length === 1 ? "" : "s"
      }.`,
    );
    return 0;
  }

  let npmCli;
  try {
    npmCli = locateNpm(nodeExecutable);
  } catch (error) {
    logger.error(`Production dependency audit setup failed: ${error.message}`);
    return 1;
  }

  const invocation = npmAuditInvocation(nodeExecutable, npmCli);
  const result = spawn(invocation.command, invocation.args, {
    cwd: repositoryRoot,
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
    shell: invocation.shell,
  });
  if (result.error) {
    logger.error(
      `Production dependency audit could not start npm: ${result.error.message}`,
    );
    return 1;
  }
  if (result.status === null) {
    logger.error(
      `Production dependency audit npm process ended without an exit code${
        result.signal ? ` (signal ${result.signal})` : ""
      }.`,
    );
    return 1;
  }

  let auditReport;
  try {
    auditReport = JSON.parse(result.stdout);
  } catch (error) {
    const detail = result.stderr?.trim();
    logger.error(
      `Production dependency audit could not parse npm JSON: ${error.message}${
        detail ? `; npm stderr: ${detail}` : ""
      }`,
    );
    return 1;
  }
  const npmError = npmErrorSummary(auditReport);
  if (npmError) {
    logger.error(`Production dependency audit npm request failed${npmError}`);
    return 1;
  }

  const evaluation = evaluateDependencySecurity({
    auditReport,
    today,
    waiverPolicy,
  });

  for (const warning of evaluation.warnings) {
    logger.warn(`Dependency audit warning: ${warning}`);
  }
  if (evaluation.errors.length > 0) {
    logger.error(
      `Production dependency audit policy failed:\n- ${evaluation.errors.join("\n- ")}`,
    );
  }
  if (evaluation.blockers.length > 0) {
    logger.error(
      `Unwaived production dependency advisories:\n- ${evaluation.blockers
        .map(formatFinding)
        .join("\n- ")}`,
    );
  }
  if (!evaluation.ok) {
    return 1;
  }
  if (result.status !== 0) {
    const detail = result.stderr?.trim();
    logger.error(
      `Production dependency audit npm process exited with code ${result.status}${
        detail ? `: ${detail}` : ""
      }`,
    );
    return 1;
  }

  logger.log(
    `Production dependency audit passed: ${evaluation.waived.length} waived high/critical, ${evaluation.informational.length} informational.`,
  );
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  process.exitCode = runDependencyAudit();
}

export { locatePairedNpmCli, runDependencyAudit };
