import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  githubActionsNodeMatrix,
  readPackageRecords,
  validateNodeCompatibility,
} from "../helpers/nodeCompatibility.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
function readRepositoryPolicy() {
  const records = readPackageRecords(repositoryRoot);
  const packageLock = JSON.parse(
    readFileSync(path.join(repositoryRoot, "package-lock.json")),
  );
  const validation = validateNodeCompatibility({
    records,
    lockPackages: packageLock.packages,
  });
  return { records, ...validation };
}

function reportPolicyErrors(errors) {
  if (errors.length) {
    console.error(
      "Node compatibility policy failed with " +
        errors.length +
        " problem" +
        (errors.length === 1 ? "" : "s") +
        ":\n- " +
        errors.join("\n- "),
    );
    process.exitCode = 1;
    return true;
  }
  return false;
}

function verifyRepositoryPolicy(policy) {
  if (reportPolicyErrors(policy.errors)) {
    return;
  }
  console.log(
    `Node compatibility policy OK for all ${policy.records.length} workspaces: ${Object.entries(
      policy.eligibleByMajor,
    )
      .map(([nodeMajor, names]) => `Node ${nodeMajor}: ${names.length}`)
      .join("; ")}`,
  );
}

const arguments_ = process.argv.slice(2);
if (arguments_.length === 1 && arguments_[0] === "--github-actions-matrix") {
  const policy = readRepositoryPolicy();
  if (!reportPolicyErrors(policy.errors)) {
    console.log(JSON.stringify(githubActionsNodeMatrix(policy.records)));
  }
} else if (arguments_.length) {
  console.error(
    `Usage: node ops/scripts/verify-node-compatibility.js [--github-actions-matrix]`,
  );
  process.exitCode = 1;
} else {
  verifyRepositoryPolicy(readRepositoryPolicy());
}
