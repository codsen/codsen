import childProcess from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  githubActionsNodeMatrix,
  validateNodeCompatibility,
  validateUnchangedNodeEngines,
} from "../helpers/nodeCompatibility.js";
import { readWorkspaceRecords } from "../helpers/workspaceInventoryFile.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
function readRepositoryPolicy() {
  const records = readWorkspaceRecords(repositoryRoot);
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

function runGit(arguments_) {
  const result = childProcess.spawnSync("git", arguments_, {
    cwd: repositoryRoot,
    encoding: "utf8",
    shell: false,
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(
      `git ${arguments_.join(" ")} failed: ${result.stderr || result.stdout}`,
    );
  }
  return result.stdout;
}

function readCurrentManifestRecords() {
  return [
    {
      directory: ".",
      manifest: JSON.parse(
        readFileSync(path.join(repositoryRoot, "package.json"), "utf8"),
      ),
    },
    ...readWorkspaceRecords(repositoryRoot),
  ];
}

function readBaseManifestRecords(baseRevision) {
  if (!/^[0-9a-f]{40}$/u.test(baseRevision)) {
    throw new TypeError("Base revision must be a full lowercase Git SHA");
  }
  runGit(["rev-parse", "--verify", `${baseRevision}^{commit}`]);
  runGit(["merge-base", "--is-ancestor", baseRevision, "HEAD"]);
  const filenames = runGit([
    "ls-tree",
    "-r",
    "--name-only",
    baseRevision,
    "--",
    "package.json",
    "packages",
    "data",
  ])
    .split("\n")
    .filter((filename) =>
      /^(?:package\.json|data\/package\.json|packages\/[^/]+\/package\.json)$/u.test(
        filename,
      ),
    )
    .sort();
  return filenames.map((filename) => ({
    directory: filename === "package.json" ? "." : path.posix.dirname(filename),
    manifest: JSON.parse(runGit(["show", `${baseRevision}:${filename}`])),
  }));
}

function verifyUnchangedNodeEngines(baseRevision) {
  const errors = validateUnchangedNodeEngines({
    baseRecords: readBaseManifestRecords(baseRevision),
    currentRecords: readCurrentManifestRecords(),
  });
  if (!reportPolicyErrors(errors)) {
    console.log(
      `Node engine declarations are unchanged from ${baseRevision} across the root and all workspaces.`,
    );
  }
}

const arguments_ = process.argv.slice(2);
if (arguments_.length === 1 && arguments_[0] === "--github-actions-matrix") {
  const policy = readRepositoryPolicy();
  if (!reportPolicyErrors(policy.errors)) {
    console.log(JSON.stringify(githubActionsNodeMatrix(policy.records)));
  }
} else if (
  arguments_.length === 2 &&
  arguments_[0] === "--unchanged-from" &&
  arguments_[1]
) {
  verifyUnchangedNodeEngines(arguments_[1]);
} else if (arguments_.length) {
  console.error(
    "Usage: node ops/scripts/verify-node-compatibility.js [--github-actions-matrix | --unchanged-from <git-revision>]",
  );
  process.exitCode = 1;
} else {
  verifyRepositoryPolicy(readRepositoryPolicy());
}
