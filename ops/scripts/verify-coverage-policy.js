#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  coverageConfigForPackage,
  validateCoveragePolicy,
} from "../helpers/coveragePolicy.js";
import { PACKAGE_KINDS } from "../helpers/packageKinds.js";
import { readPackageKindResolver } from "../helpers/packageKindsFile.js";
import { readWorkspaceRecords } from "../helpers/workspaceInventoryFile.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

function workspaceRecords() {
  const packageKinds = readPackageKindResolver(repositoryRoot);
  return readWorkspaceRecords(repositoryRoot).map((record) => ({
    ...record,
    packageKind: packageKinds.kindFor(record.manifest.name),
  }));
}

function readCoveragePolicy() {
  return JSON.parse(
    readFileSync(path.join(repositoryRoot, "ops/coverage-policy.json"), "utf8"),
  );
}

function reportErrors(errors) {
  console.error(
    `Coverage policy failed with ${errors.length} problem${errors.length === 1 ? "" : "s"}:\n- ${errors.join("\n- ")}`,
  );
  process.exitCode = 1;
}

if (process.argv.length !== 2) {
  console.error("Usage: node ops/scripts/verify-coverage-policy.js");
  process.exitCode = 1;
} else {
  const workspaces = workspaceRecords();
  const records = workspaces.filter(
    ({ packageKind }) => packageKind !== PACKAGE_KINDS.GENERATED_DATA,
  );
  const policy = readCoveragePolicy();
  const { errors } = validateCoveragePolicy({
    policy,
    records,
    workspaceRecords: workspaces,
  });

  if (errors.length) {
    reportErrors(errors);
  } else {
    const cliCount = records.filter(
      ({ packageKind }) => packageKind === PACKAGE_KINDS.CLI,
    ).length;
    const waivedCount = Object.keys(policy.waivers).length;
    const exemptionCount = workspaces.length - records.length;
    const fullCount = records.filter(({ packageKind, manifest }) =>
      ["branches", "functions", "statements"].every(
        (threshold) =>
          coverageConfigForPackage(policy, manifest, { packageKind })[
            threshold
          ] === 100,
      ),
    ).length;
    console.log(
      `Coverage policy OK for all ${workspaces.length} workspaces: ${records.length} packages (${cliCount} subprocess CLIs, ${fullCount} full-coverage packages, ${waivedCount} documented waivers) and ${exemptionCount} documented workspace exemption${exemptionCount === 1 ? "" : "s"}.`,
    );
  }
}
