import { spawnSync } from "node:child_process";
import {
  chmodSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { devNull } from "node:os";
import path from "node:path";

import {
  assertObjectKeys,
  assertPackageName,
  assertSha,
  COMMITTED_PLAN_PATH,
  releasePackages,
  validatePlan,
  versionChange,
} from "./npmReleasePlan.js";

const PROPOSAL_SCHEMA_VERSION = 1;
const MAX_PROPOSAL_BYTES = 256 * 1024 * 1024;
const MAX_CONTENT_BYTES = 128 * 1024 * 1024;
const MAX_CHANGES = 100_000;
const ROOT_OUTPUTS = new Set([
  COMMITTED_PLAN_PATH,
  "LICENSE",
  "README.md",
  "package-lock.json",
]);
const RETIRED_PACKAGE_CONFIGS = new Set([
  ".babelrc",
  ".editorconfig",
  ".eslintrc.json",
  ".gitattributes",
  ".gitignore",
  ".npmignore",
  ".npmrc",
  ".travis.yml",
]);

function fail(message) {
  throw new Error(`npm release proposal: ${message}`);
}

function git(repositoryRoot, arguments_, input) {
  const result = spawnSync(
    "git",
    [
      "--literal-pathspecs",
      "-c",
      `core.hooksPath=${devNull}`,
      "-c",
      "core.fsmonitor=false",
      ...arguments_,
    ],
    { cwd: repositoryRoot, input, maxBuffer: MAX_PROPOSAL_BYTES },
  );
  if (result.error || result.status !== 0) {
    fail(
      `git ${arguments_[0]} failed: ${result.error?.message ?? result.stderr.toString("utf8").trim()}`,
    );
  }
  return result.stdout;
}

function readBaseContext(repositoryRoot, baseSha) {
  assertSha(baseSha, "proposal expected base SHA");
  const root = realpathSync(repositoryRoot);
  const topLevel = git(root, ["rev-parse", "--show-toplevel"])
    .toString("utf8")
    .trim();
  if (realpathSync(topLevel) !== root) {
    fail("run from the repository root");
  }
  if (git(root, ["rev-parse", "HEAD"]).toString("utf8").trim() !== baseSha) {
    fail("HEAD must equal the trusted expected base SHA");
  }
  const baseFiles = new Map();
  for (const record of git(root, ["ls-tree", "-r", "-z", baseSha])
    .toString("utf8")
    .split("\0")
    .filter(Boolean)) {
    const tab = record.indexOf("\t");
    const [mode, type, object] = record.slice(0, tab).split(" ");
    baseFiles.set(record.slice(tab + 1), { mode, type, object });
  }
  const workspaces = new Map();
  const names = new Set();
  for (const [filename, entry] of baseFiles) {
    const match = /^(data|packages\/[^/]+)\/package\.json$/.exec(filename);
    if (!match) {
      continue;
    }
    if (entry.type !== "blob" || !["100644", "100755"].includes(entry.mode)) {
      fail(`base workspace manifest is not a regular file: ${filename}`);
    }
    const manifest = JSON.parse(git(root, ["cat-file", "blob", entry.object]));
    assertPackageName(manifest.name, `${filename} name`);
    if (names.has(manifest.name)) {
      fail(`duplicate base workspace name: ${manifest.name}`);
    }
    names.add(manifest.name);
    workspaces.set(match[1], manifest);
  }
  if (!workspaces.has("data") || workspaces.size < 2) {
    fail("base tree must contain data and package workspaces");
  }
  return { baseSha, baseFiles, workspaces, repositoryRoot: root };
}

function assertSafeProposalPath(filename) {
  if (
    typeof filename !== "string" ||
    !filename ||
    filename.includes("\\") ||
    filename.includes(":") ||
    Buffer.from(filename).toString("utf8") !== filename ||
    [...filename].some((character) => {
      const code = character.codePointAt(0);
      return code < 32 || code === 127;
    })
  ) {
    fail("change path must be a safe repository-relative POSIX path");
  }
  const parts = filename.split("/");
  if (parts.some((part) => !part || part === "." || part === "..")) {
    fail(`unsafe change path: ${filename}`);
  }
}

function validateProposalPath(filename, { baseFiles, workspaces }, deletion) {
  assertSafeProposalPath(filename);
  const parts = filename.split("/");
  if (ROOT_OUTPUTS.has(filename)) {
    return;
  }
  const workspace =
    parts[0] === "packages" ? parts.slice(0, 2).join("/") : parts[0];
  if (!workspaces.has(workspace) || filename === workspace) {
    fail(`unexpected generated path: ${filename}`);
  }
  const relative = filename.slice(workspace.length + 1);
  if (relative === "package.json" && deletion) {
    fail(`workspace manifests cannot be deleted: ${filename}`);
  }
  if (
    parts.some((part) => part.startsWith(".") || part === "node_modules") &&
    relative !== ".all-contributorsrc" &&
    !(
      deletion &&
      baseFiles.has(filename) &&
      RETIRED_PACKAGE_CONFIGS.has(relative)
    )
  ) {
    fail(`unexpected generated configuration path: ${filename}`);
  }
}

function validateProposal(proposal, context) {
  assertObjectKeys(
    proposal,
    ["schemaVersion", "baseSha", "changes"],
    "release proposal",
  );
  if (proposal.schemaVersion !== PROPOSAL_SCHEMA_VERSION) {
    fail("unsupported changeset schema version");
  }
  assertSha(proposal.baseSha, "proposal base SHA");
  if (proposal.baseSha !== context.baseSha) {
    fail("changeset base does not equal the trusted expected base SHA");
  }
  if (
    !Array.isArray(proposal.changes) ||
    !proposal.changes.length ||
    proposal.changes.length > MAX_CHANGES
  ) {
    fail(`changes must contain between 1 and ${MAX_CHANGES} records`);
  }
  const changes = new Map();
  let previous;
  let totalBytes = 0;
  for (const change of proposal.changes) {
    assertObjectKeys(change, ["path", "content", "mode"], "proposal change");
    const deletion = change.content === null;
    validateProposalPath(change.path, context, deletion);
    if (previous !== undefined && previous >= change.path) {
      fail("changes must have unique paths in sorted order");
    }
    previous = change.path;
    const parts = change.path.split("/");
    for (let index = 1; index < parts.length; index += 1) {
      if (changes.has(parts.slice(0, index).join("/"))) {
        fail(`overlapping change paths: ${change.path}`);
      }
    }
    const base = context.baseFiles.get(change.path);
    if (
      base &&
      (base.type !== "blob" || !["100644", "100755"].includes(base.mode))
    ) {
      fail(`changes cannot replace symbolic links or gitlinks: ${change.path}`);
    }
    if (deletion) {
      if (!base || change.mode !== null) {
        fail(
          `deletions require an existing regular file and null mode: ${change.path}`,
        );
      }
      changes.set(change.path, { ...change, bytes: null });
      continue;
    }
    if (change.mode !== (base?.mode ?? "100644")) {
      fail(
        `file mode changes and new executable files are forbidden: ${change.path}`,
      );
    }
    if (typeof change.content !== "string") {
      fail(`file content must be canonical base64: ${change.path}`);
    }
    const bytes = Buffer.from(change.content, "base64");
    if (bytes.toString("base64") !== change.content) {
      fail(`file content must be canonical base64: ${change.path}`);
    }
    totalBytes += bytes.length;
    if (totalBytes > MAX_CONTENT_BYTES) {
      fail(`decoded changes exceed ${MAX_CONTENT_BYTES} bytes`);
    }
    changes.set(change.path, { ...change, bytes });
  }

  const planChange = changes.get(COMMITTED_PLAN_PATH);
  if (!planChange?.bytes) {
    fail("changeset must create or update the release plan");
  }
  const plan = validatePlan(JSON.parse(planChange.bytes), {
    repositoryRoot: context.repositoryRoot,
  });
  if (
    plan.baseSha !== context.baseSha ||
    plan.plannedAtSha !== context.baseSha
  ) {
    fail("release plan must bind baseSha and plannedAtSha to the trusted base");
  }
  if (plan.workspaceCount !== context.workspaces.size) {
    fail("release plan workspace count does not match the base inventory");
  }
  const selected = [];
  for (const [directory, baseManifest] of context.workspaces) {
    const manifestChange = changes.get(`${directory}/package.json`);
    const manifest = manifestChange
      ? JSON.parse(manifestChange.bytes)
      : baseManifest;
    if (
      manifest.name !== baseManifest.name ||
      manifest.private !== baseManifest.private
    ) {
      fail(`workspace identity changed: ${directory}/package.json`);
    }
    if (manifest.private || manifest.version === baseManifest.version) {
      continue;
    }
    versionChange(baseManifest.version, manifest.version, manifest.name);
    selected.push({
      baseVersion: baseManifest.version,
      directory,
      manifest,
      name: manifest.name,
      version: manifest.version,
    });
  }
  const recomputed = releasePackages(selected);
  if (
    JSON.stringify(plan.packages) !== JSON.stringify(recomputed.packages) ||
    JSON.stringify(plan.layers) !== JSON.stringify(recomputed.layers)
  ) {
    fail(
      "release plan does not match the proposed workspace versions and dependency layers",
    );
  }
  return [...changes.values()];
}

function assertRegularAncestors(repositoryRoot, filename) {
  const parts = filename.split("/");
  let current = repositoryRoot;
  for (const [index, part] of parts.entries()) {
    current = path.join(current, part);
    let stat;
    try {
      stat = lstatSync(current);
    } catch (error) {
      if (error.code === "ENOENT") {
        continue;
      }
      throw error;
    }
    if (index === parts.length - 1 ? !stat.isFile() : !stat.isDirectory()) {
      fail(
        `change targets must be regular files beneath regular directories: ${filename}`,
      );
    }
  }
}

function validateAgainstBase(proposal, context) {
  const changes = validateProposal(proposal, context);
  for (const change of changes) {
    assertRegularAncestors(context.repositoryRoot, change.path);
  }
  const oldPlan = context.baseFiles.get(COMMITTED_PLAN_PATH);
  const plan = changes.find((change) => change.path === COMMITTED_PLAN_PATH);
  if (
    oldPlan &&
    git(context.repositoryRoot, ["cat-file", "blob", oldPlan.object]).equals(
      plan.bytes,
    )
  ) {
    fail("release plan must actually change");
  }
  return changes;
}

function createReleaseProposal({ repositoryRoot, baseSha }) {
  const context = readBaseContext(repositoryRoot, baseSha);
  const changed = new Set(
    [
      git(context.repositoryRoot, [
        "diff",
        "--no-ext-diff",
        "--no-textconv",
        "--no-renames",
        "--name-only",
        "-z",
        baseSha,
        "--",
      ]),
      git(context.repositoryRoot, [
        "ls-files",
        "--others",
        "--exclude-standard",
        "-z",
      ]),
    ].flatMap((output) => output.toString("utf8").split("\0").filter(Boolean)),
  );
  const changes = [...changed].sort().map((filename) => {
    // Git supplies these paths, but validate their spelling before resolving
    // them on disk.
    assertSafeProposalPath(filename);
    assertRegularAncestors(context.repositoryRoot, filename);
    const absolute = path.join(context.repositoryRoot, filename);
    const stat = lstatSync(absolute, { throwIfNoEntry: false });
    validateProposalPath(filename, context, !stat);
    if (!stat) {
      return { path: filename, content: null, mode: null };
    }
    if (stat.size > MAX_CONTENT_BYTES) {
      fail(`generated file exceeds ${MAX_CONTENT_BYTES} bytes: ${filename}`);
    }
    return {
      path: filename,
      content: readFileSync(absolute).toString("base64"),
      mode: stat.mode & 0o111 ? "100755" : "100644",
    };
  });
  const proposal = { schemaVersion: PROPOSAL_SCHEMA_VERSION, baseSha, changes };
  validateAgainstBase(proposal, context);
  return proposal;
}

function applyReleaseProposal({ repositoryRoot, baseSha, proposal }) {
  const context = readBaseContext(repositoryRoot, baseSha);
  if (
    git(context.repositoryRoot, [
      "status",
      "--porcelain=v1",
      "-z",
      "--untracked-files=all",
    ]).length
  ) {
    fail("applying a proposal requires a pristine checkout");
  }
  // Validate every record, all ancestors, and the plan before the first write.
  // Generated JavaScript and manifests are data throughout this job.
  const changes = validateAgainstBase(proposal, context);
  for (const change of changes) {
    const absolute = path.join(context.repositoryRoot, change.path);
    if (change.bytes === null) {
      unlinkSync(absolute);
    } else {
      mkdirSync(path.dirname(absolute), { recursive: true });
      writeFileSync(absolute, change.bytes);
      chmodSync(absolute, change.mode === "100755" ? 0o755 : 0o644);
    }
  }
  git(
    context.repositoryRoot,
    ["add", "--pathspec-from-file=-", "--pathspec-file-nul"],
    changes.map((change) => `${change.path}\0`).join(""),
  );
  return changes.length;
}

export {
  applyReleaseProposal,
  createReleaseProposal,
  MAX_PROPOSAL_BYTES,
  PROPOSAL_SCHEMA_VERSION,
  validateProposal,
  validateProposalPath,
};
