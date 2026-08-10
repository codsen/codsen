#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { devNull, tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const NPM = process.platform === "win32" ? "npm.cmd" : "npm";
const REGISTRY = "https://registry.npmjs.org/";
const DATA_PACKAGE = "@codsen/data";
const DEPENDENCY_FIELDS = [
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
];
const PLAN_KIND = "codsen-npm-release-plan";
const MANIFEST_KIND = "codsen-npm-release-manifest";
const SCHEMA_VERSION = 1;
const DEFAULT_CONCURRENCY = 8;
const MAX_OUTPUT_BYTES = 50 * 1024 * 1024;
const MAX_SUMMARY_BYTES = 60 * 1024;
const COMMITTED_PLAN_PATH = ".github/npm-release-plan.json";
const FORBIDDEN_PACKED_PARTS = new Set([
  ".git",
  ".turbo",
  "coverage",
  "node_modules",
  "tap",
  "perf",
]);
const DOC_FILES = ["CHANGELOG.md", "LICENSE", "README.md"];
const VERSION_RE =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function fail(message) {
  throw new Error(message);
}

function environmentValue(name) {
  return Reflect.get(process.env, name);
}

function printUsage() {
  console.log(`Usage:
  node ops/scripts/npm-release.js assert-workspaces [--expected 111]
  node ops/scripts/npm-release.js plan --base <git-ref> --output <plan.json>
  node ops/scripts/npm-release.js summary --plan <plan.json> --output <summary.md>
  node ops/scripts/npm-release.js preflight --plan <plan.json> [--concurrency 8]
  node ops/scripts/npm-release.js pack --plan <plan.json> --output <directory> [--concurrency 8]
  node ops/scripts/npm-release.js publish --manifest <manifest.json> [--concurrency 8]
  node ops/scripts/npm-release.js tags --manifest <manifest.json> [--concurrency 8] [--push] [--remote origin]`);
}

function parseArguments(argv) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    process.exit(argv.length === 0 ? 1 : 0);
  }

  const command = argv[0];
  const values = new Map();
  const flags = new Set();
  const flagNames = command === "tags" ? new Set(["push"]) : new Set();

  for (let index = 1; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) {
      fail(`Unexpected positional argument: ${argument}`);
    }

    const equalsAt = argument.indexOf("=");
    const name = argument.slice(2, equalsAt === -1 ? undefined : equalsAt);
    if (!name) {
      fail("An option name cannot be empty");
    }
    if (values.has(name) || flags.has(name)) {
      fail(`Option --${name} was supplied more than once`);
    }

    if (flagNames.has(name)) {
      if (equalsAt !== -1) {
        fail(`Flag --${name} does not accept a value`);
      }
      flags.add(name);
      continue;
    }

    const value =
      equalsAt === -1 ? argv[index + 1] : argument.slice(equalsAt + 1);
    if (value === undefined || (equalsAt === -1 && value.startsWith("--"))) {
      fail(`Option --${name} requires a value`);
    }
    values.set(name, value);
    if (equalsAt === -1) {
      index += 1;
    }
  }

  const allowed = {
    "assert-workspaces": new Set(["expected"]),
    plan: new Set(["base", "output"]),
    summary: new Set(["plan", "output"]),
    preflight: new Set(["plan", "concurrency"]),
    pack: new Set(["plan", "output", "concurrency"]),
    publish: new Set(["manifest", "concurrency"]),
    tags: new Set(["manifest", "concurrency", "remote"]),
  }[command];
  if (!allowed) {
    fail(`Unknown command: ${command}`);
  }
  for (const name of values.keys()) {
    if (!allowed.has(name)) {
      fail(`Command ${command} does not accept --${name}`);
    }
  }

  return { command, flags, values };
}

function requiredOption(options, name) {
  const value = options.values.get(name);
  if (!value) {
    fail(`Command ${options.command} requires --${name}`);
  }
  return value;
}

function positiveInteger(raw, label, fallback) {
  if (raw === undefined) {
    return fallback;
  }
  if (!/^\d+$/.test(raw) || Number(raw) < 1 || Number(raw) > 64) {
    fail(`${label} must be an integer from 1 to 64`);
  }
  return Number(raw);
}

function parseJson(source, label) {
  try {
    return JSON.parse(source);
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

function readJson(file, label = file) {
  try {
    return parseJson(readFileSync(file, "utf8"), label);
  } catch (error) {
    if (error.code === "ENOENT") {
      fail(`${label} does not exist`);
    }
    throw error;
  }
}

function writeJsonAtomic(file, value) {
  return writeTextAtomic(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeTextAtomic(file, value) {
  const absolute = path.resolve(process.cwd(), file);
  mkdirSync(path.dirname(absolute), { recursive: true });
  const temporary = path.join(
    path.dirname(absolute),
    `.${path.basename(absolute)}.${process.pid}.${randomUUID()}.tmp`,
  );
  try {
    writeFileSync(temporary, value, {
      encoding: "utf8",
      flag: "wx",
    });
    renameSync(temporary, absolute);
  } finally {
    if (existsSync(temporary)) {
      unlinkSync(temporary);
    }
  }
  return absolute;
}

function git(arguments_, { allowFailure = false } = {}) {
  const result = spawnSync("git", arguments_, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: MAX_OUTPUT_BYTES,
  });
  if (result.error) {
    fail(`Could not run git ${arguments_.join(" ")}: ${result.error.message}`);
  }
  if (result.status !== 0 && !allowFailure) {
    fail(
      `git ${arguments_.join(" ")} failed (${result.status}): ${(
        result.stderr || result.stdout
      ).trim()}`,
    );
  }
  return {
    status: result.status,
    stderr: result.stderr,
    stdout: result.stdout,
  };
}

function run(command, arguments_, { cwd = ROOT, env = process.env } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, arguments_, {
      cwd,
      env,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let size = 0;
    let exceeded = false;

    const collect = (stream, chunk) => {
      size += chunk.length;
      if (size > MAX_OUTPUT_BYTES) {
        exceeded = true;
        child.kill("SIGTERM");
        return;
      }
      if (stream === "stdout") {
        stdout += chunk;
      } else {
        stderr += chunk;
      }
    };

    child.stdout.on("data", (chunk) => collect("stdout", chunk));
    child.stderr.on("data", (chunk) => collect("stderr", chunk));
    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (exceeded) {
        reject(
          new Error(`${command} output exceeded ${MAX_OUTPUT_BYTES} bytes`),
        );
        return;
      }
      resolve({ code, signal, stderr, stdout });
    });
  });
}

function requireSuccess(result, description) {
  if (result.code !== 0) {
    const output = (result.stderr || result.stdout).trim();
    fail(`${description} failed (${result.code ?? result.signal}): ${output}`);
  }
  return result;
}

function assertObjectKeys(value, required, context) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${context} must be an object`);
  }
  const actual = Object.keys(value).sort();
  const expected = [...required].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(
      `${context} must contain exactly [${expected.join(", ")}], received [${actual.join(", ")}]`,
    );
  }
}

function assertSha(value, context) {
  if (typeof value !== "string" || !/^[0-9a-f]{40}$/.test(value)) {
    fail(`${context} must be a full lowercase Git commit SHA`);
  }
}

function assertVersion(value, context) {
  if (typeof value !== "string" || !VERSION_RE.test(value)) {
    fail(`${context} must be a valid SemVer version`);
  }
}

function assertPackageName(value, context) {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > 214 ||
    /\s/.test(value) ||
    [...value].some((character) => {
      const code = character.codePointAt(0);
      return code < 32 || code === 127;
    })
  ) {
    fail(`${context} is not a safe npm package name`);
  }
}

function safeRepositoryPath(relative, context) {
  if (
    typeof relative !== "string" ||
    !relative ||
    path.posix.isAbsolute(relative) ||
    relative.includes("\\")
  ) {
    fail(`${context} must be a repository-relative POSIX path`);
  }
  const normalized = path.posix.normalize(relative);
  if (
    normalized !== relative ||
    normalized === ".." ||
    normalized.startsWith("../")
  ) {
    fail(`${context} escapes the repository: ${relative}`);
  }
  const absolute = path.resolve(ROOT, ...relative.split("/"));
  if (!absolute.startsWith(`${ROOT}${path.sep}`)) {
    fail(`${context} escapes the repository: ${relative}`);
  }
  return absolute;
}

function workspacePatterns(manifest, context) {
  const value = Array.isArray(manifest.workspaces)
    ? manifest.workspaces
    : manifest.workspaces?.packages;
  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== "string")
  ) {
    fail(`${context} must provide a string array of workspace patterns`);
  }
  return value;
}

function expandWorkspacePatterns(
  patterns,
  context,
  { rejectTrailingSlash = false } = {},
) {
  const directories = new Set();
  for (const original of patterns) {
    if (rejectTrailingSlash && original.endsWith("/")) {
      fail(
        `${context} pattern ${JSON.stringify(original)} must not end in a slash`,
      );
    }
    const pattern = original.replace(/^\.\//, "").replace(/\/+$/, "");
    if (
      !pattern ||
      pattern.startsWith("../") ||
      path.posix.isAbsolute(pattern)
    ) {
      fail(`${context} contains an unsafe workspace pattern: ${original}`);
    }

    if (pattern.endsWith("/*") && !pattern.slice(0, -2).includes("*")) {
      const parentRelative = pattern.slice(0, -2);
      const parent = safeRepositoryPath(parentRelative, `${context} pattern`);
      if (!existsSync(parent)) {
        continue;
      }
      for (const entry of readdirSync(parent, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          const relative = `${parentRelative}/${entry.name}`;
          if (existsSync(path.join(parent, entry.name, "package.json"))) {
            directories.add(relative);
          }
        }
      }
      continue;
    }

    if (
      pattern.includes("*") ||
      pattern.includes("?") ||
      pattern.includes("[")
    ) {
      fail(`${context} uses an unsupported workspace pattern: ${original}`);
    }
    const absolute = safeRepositoryPath(pattern, `${context} pattern`);
    if (existsSync(path.join(absolute, "package.json"))) {
      directories.add(pattern);
    }
  }
  return [...directories].sort();
}

function validateWorkspaceManifest(manifest, directory) {
  assertPackageName(manifest.name, `${directory}/package.json name`);
  assertVersion(manifest.version, `${manifest.name} version`);
  return manifest;
}

function discoverWorkspaces() {
  const rootManifest = readJson(
    path.join(ROOT, "package.json"),
    "root package.json",
  );
  const rootDirectories = expandWorkspacePatterns(
    workspacePatterns(rootManifest, "root package.json workspaces"),
    "root package.json workspaces",
  );
  const lerna = readJson(path.join(ROOT, "lerna.json"), "lerna.json");
  if (!Array.isArray(lerna.packages)) {
    fail("lerna.json packages must be an array");
  }
  const lernaDirectories = expandWorkspacePatterns(
    lerna.packages,
    "lerna.json packages",
    { rejectTrailingSlash: true },
  );
  if (JSON.stringify(rootDirectories) !== JSON.stringify(lernaDirectories)) {
    const rootOnly = rootDirectories.filter(
      (item) => !lernaDirectories.includes(item),
    );
    const lernaOnly = lernaDirectories.filter(
      (item) => !rootDirectories.includes(item),
    );
    fail(
      `npm/Lerna workspace mismatch (npm-only: ${rootOnly.join(", ") || "none"}; Lerna-only: ${lernaOnly.join(", ") || "none"})`,
    );
  }

  const seen = new Map();
  const workspaces = rootDirectories.map((directory) => {
    const manifest = validateWorkspaceManifest(
      readJson(path.join(ROOT, directory, "package.json")),
      directory,
    );
    if (seen.has(manifest.name)) {
      fail(
        `Duplicate package name ${manifest.name} in ${seen.get(manifest.name)} and ${directory}`,
      );
    }
    seen.set(manifest.name, directory);
    return { directory, manifest };
  });
  const data = workspaces.find(
    ({ manifest }) => manifest.name === DATA_PACKAGE,
  );
  if (data?.directory !== "data") {
    fail(`${DATA_PACKAGE} must be the Lerna/npm workspace at data`);
  }
  return workspaces;
}

function commandAssertWorkspaces(options) {
  const workspaces = discoverWorkspaces();
  const expectedRaw = options.values.get("expected");
  if (expectedRaw !== undefined) {
    if (!/^\d+$/.test(expectedRaw)) {
      fail("--expected must be a non-negative integer");
    }
    if (workspaces.length !== Number(expectedRaw)) {
      fail(`Expected ${expectedRaw} workspaces, found ${workspaces.length}`);
    }
  }
  console.log(
    `Validated ${workspaces.length} npm/Lerna workspaces, including ${DATA_PACKAGE}.`,
  );
}

function resolveCommit(reference, context) {
  const result = git([
    "rev-parse",
    "--verify",
    "--end-of-options",
    `${reference}^{commit}`,
  ]);
  const sha = result.stdout.trim();
  assertSha(sha, context);
  return sha;
}

function currentHead() {
  const sha = git(["rev-parse", "HEAD"]).stdout.trim();
  assertSha(sha, "Git HEAD");
  return sha;
}

function preparedTreeSha256() {
  const files = git([
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
    "-z",
  ])
    .stdout.split("\0")
    .filter((file) => file && file !== COMMITTED_PLAN_PATH)
    .sort();
  const hash = createHash("sha256");
  for (const file of files) {
    const absolute = safeRepositoryPath(file, "prepared release file");
    if (!existsSync(absolute)) {
      // A tracked file can be deleted in the prepared worktree before the
      // release commit is created. Its absence is represented by omission.
      continue;
    }
    const fileStat = lstatSync(absolute);
    let contents;
    let mode;
    if (fileStat.isSymbolicLink()) {
      contents = Buffer.from(readlinkSync(absolute));
      mode = "120000";
    } else if (fileStat.isFile()) {
      contents = readFileSync(absolute);
      mode = (fileStat.mode & 0o111) === 0 ? "100644" : "100755";
    } else {
      fail(`Prepared release path is not a file or symbolic link: ${file}`);
    }
    const pathBuffer = Buffer.from(file);
    hash.update(`${pathBuffer.length}:`);
    hash.update(pathBuffer);
    hash.update(`:${mode}:${contents.length}:`);
    hash.update(contents);
    hash.update("\0");
  }
  return hash.digest("hex");
}

function assertBaseAncestor(baseSha, headSha) {
  const result = git(["merge-base", "--is-ancestor", baseSha, headSha], {
    allowFailure: true,
  });
  if (result.status === 1) {
    fail(`Release base ${baseSha} is not an ancestor of ${headSha}`);
  }
  if (result.status !== 0) {
    fail(`Could not check release ancestry: ${result.stderr.trim()}`);
  }
}

function manifestAtCommit(commit, directory) {
  const object = `${commit}:${directory}/package.json`;
  const exists = git(["cat-file", "-e", object], { allowFailure: true });
  if (exists.status !== 0) {
    return null;
  }
  return parseJson(git(["show", object]).stdout, object);
}

function selectedDependencies(manifest, selectedNames) {
  const dependencies = new Set();
  for (const field of DEPENDENCY_FIELDS) {
    if (manifest[field] === undefined) {
      continue;
    }
    if (!manifest[field] || typeof manifest[field] !== "object") {
      fail(`${manifest.name} ${field} must be an object`);
    }
    for (const name of Object.keys(manifest[field])) {
      if (selectedNames.has(name)) {
        dependencies.add(name);
      }
    }
  }
  return [...dependencies].sort();
}

function buildLayers(packages) {
  const packageByName = new Map(packages.map((item) => [item.name, item]));
  const selectedNames = new Set(packageByName.keys());
  const data = packageByName.get(DATA_PACKAGE);
  if (data) {
    for (const item of packages) {
      if (
        item.name !== DATA_PACKAGE &&
        item.dependencies.includes(DATA_PACKAGE)
      ) {
        fail(
          `${item.name} depends on ${DATA_PACKAGE}, which must publish last`,
        );
      }
    }
  }

  const pending = new Set(
    [...selectedNames].filter((name) => name !== DATA_PACKAGE),
  );
  const layers = [];
  while (pending.size > 0) {
    const ready = [...pending]
      .filter((name) =>
        packageByName
          .get(name)
          .dependencies.filter((dependency) => dependency !== DATA_PACKAGE)
          .every((dependency) => !pending.has(dependency)),
      )
      .sort();
    if (ready.length === 0) {
      const cycle = [...pending].sort().map(
        (name) =>
          `${name} -> ${packageByName
            .get(name)
            .dependencies.filter((dependency) => pending.has(dependency))
            .join(", ")}`,
      );
      fail(`Selected workspace dependency cycle:\n${cycle.join("\n")}`);
    }
    layers.push(ready);
    for (const name of ready) {
      pending.delete(name);
    }
  }
  if (data) {
    layers.push([DATA_PACKAGE]);
  }
  return layers;
}

function calculatePlan(
  baseRef,
  baseSha = resolveCommit(baseRef, "release base"),
) {
  const workspaces = discoverWorkspaces();
  const selected = [];
  for (const { directory, manifest } of workspaces) {
    if (manifest.private) {
      continue;
    }
    const baseManifest = manifestAtCommit(baseSha, directory);
    if (
      !baseManifest ||
      baseManifest.name !== manifest.name ||
      baseManifest.version !== manifest.version
    ) {
      selected.push({
        baseVersion:
          typeof baseManifest?.version === "string"
            ? baseManifest.version
            : null,
        directory,
        manifest,
        name: manifest.name,
        version: manifest.version,
      });
    }
  }
  selected.sort((left, right) => left.name.localeCompare(right.name));
  const selectedNames = new Set(selected.map(({ name }) => name));
  const packages = selected.map((item) => ({
    baseVersion: item.baseVersion,
    dependencies: selectedDependencies(item.manifest, selectedNames),
    directory: item.directory,
    layer: -1,
    name: item.name,
    version: item.version,
  }));
  const layers = buildLayers(packages);
  const layerByName = new Map();
  layers.forEach((layer, index) => {
    layer.forEach((name) => {
      layerByName.set(name, index);
    });
  });
  for (const item of packages) {
    item.layer = layerByName.get(item.name);
  }

  return {
    baseRef,
    baseSha,
    createdAt: new Date().toISOString(),
    dependencyFields: DEPENDENCY_FIELDS,
    kind: PLAN_KIND,
    layers,
    packages,
    plannedAtSha: currentHead(),
    preparedTreeSha256: preparedTreeSha256(),
    schemaVersion: SCHEMA_VERSION,
    selectedCount: packages.length,
    workspaceCount: workspaces.length,
  };
}

function validateLayers(packages, layers, context) {
  if (!Array.isArray(layers) || layers.some((layer) => !Array.isArray(layer))) {
    fail(`${context}.layers must be an array of arrays`);
  }
  const flattened = layers.flat();
  const names = packages.map(({ name }) => name);
  if (
    flattened.length !== names.length ||
    new Set(flattened).size !== flattened.length ||
    [...flattened].sort().join("\0") !== [...names].sort().join("\0")
  ) {
    fail(`${context}.layers must contain every package exactly once`);
  }
  for (const layer of layers) {
    if (JSON.stringify(layer) !== JSON.stringify([...layer].sort())) {
      fail(`${context}.layers entries must be sorted`);
    }
  }
  const dataLayer = layers.findIndex((layer) => layer.includes(DATA_PACKAGE));
  if (
    dataLayer !== -1 &&
    (dataLayer !== layers.length - 1 || layers[dataLayer].length !== 1)
  ) {
    fail(`${DATA_PACKAGE} must be alone in the final release layer`);
  }
  const layerByName = new Map();
  layers.forEach((layer, index) => {
    layer.forEach((name) => {
      layerByName.set(name, index);
    });
  });
  for (const item of packages) {
    if (item.layer !== layerByName.get(item.name)) {
      fail(`${item.name} has an incorrect layer number`);
    }
    for (const dependency of item.dependencies) {
      if (!layerByName.has(dependency)) {
        fail(`${item.name} lists an unselected dependency: ${dependency}`);
      }
      if (layerByName.get(dependency) >= item.layer) {
        fail(`${item.name} is not after dependency ${dependency}`);
      }
    }
  }
}

function validatePlan(plan) {
  assertObjectKeys(
    plan,
    [
      "baseRef",
      "baseSha",
      "createdAt",
      "dependencyFields",
      "kind",
      "layers",
      "packages",
      "plannedAtSha",
      "preparedTreeSha256",
      "schemaVersion",
      "selectedCount",
      "workspaceCount",
    ],
    "release plan",
  );
  if (plan.kind !== PLAN_KIND || plan.schemaVersion !== SCHEMA_VERSION) {
    fail("Unsupported release plan kind or schema version");
  }
  assertSha(plan.baseSha, "release plan baseSha");
  assertSha(plan.plannedAtSha, "release plan plannedAtSha");
  if (!/^[0-9a-f]{64}$/.test(plan.preparedTreeSha256)) {
    fail("release plan preparedTreeSha256 is invalid");
  }
  if (typeof plan.baseRef !== "string" || !plan.baseRef) {
    fail("release plan baseRef must be a non-empty string");
  }
  if (Number.isNaN(Date.parse(plan.createdAt))) {
    fail("release plan createdAt must be an ISO timestamp");
  }
  if (
    JSON.stringify(plan.dependencyFields) !== JSON.stringify(DEPENDENCY_FIELDS)
  ) {
    fail("release plan dependencyFields is unsupported");
  }
  if (!Number.isInteger(plan.workspaceCount) || plan.workspaceCount < 1) {
    fail("release plan workspaceCount must be a positive integer");
  }
  if (!Array.isArray(plan.packages)) {
    fail("release plan packages must be an array");
  }
  if (plan.selectedCount !== plan.packages.length || plan.selectedCount < 1) {
    fail(
      "release plan must select at least one package and selectedCount must match packages.length",
    );
  }
  for (const [index, item] of plan.packages.entries()) {
    assertObjectKeys(
      item,
      ["baseVersion", "dependencies", "directory", "layer", "name", "version"],
      `release plan packages[${index}]`,
    );
    assertPackageName(item.name, `release plan packages[${index}].name`);
    assertVersion(item.version, `${item.name} version`);
    if (item.baseVersion !== null) {
      assertVersion(item.baseVersion, `${item.name} baseVersion`);
    }
    safeRepositoryPath(item.directory, `${item.name} directory`);
    if (!Array.isArray(item.dependencies)) {
      fail(`${item.name} dependencies must be an array`);
    }
    for (const dependency of item.dependencies) {
      assertPackageName(dependency, `${item.name} dependency`);
    }
    if (
      new Set(item.dependencies).size !== item.dependencies.length ||
      JSON.stringify(item.dependencies) !==
        JSON.stringify([...item.dependencies].sort())
    ) {
      fail(`${item.name} dependencies must be unique and sorted`);
    }
    if (!Number.isInteger(item.layer) || item.layer < 0) {
      fail(`${item.name} layer must be a non-negative integer`);
    }
  }
  const names = plan.packages.map(({ name }) => name);
  if (
    new Set(names).size !== names.length ||
    JSON.stringify(names) !== JSON.stringify([...names].sort())
  ) {
    fail("release plan packages must have unique, sorted names");
  }
  validateLayers(plan.packages, plan.layers, "release plan");
  return plan;
}

function planProjection(plan) {
  return {
    baseSha: plan.baseSha,
    dependencyFields: plan.dependencyFields,
    layers: plan.layers,
    packages: plan.packages,
    preparedTreeSha256: plan.preparedTreeSha256,
    selectedCount: plan.selectedCount,
    workspaceCount: plan.workspaceCount,
  };
}

function commandPlan(options) {
  const base = requiredOption(options, "base");
  const output = requiredOption(options, "output");
  const plan = calculatePlan(base);
  assertBaseAncestor(plan.baseSha, plan.plannedAtSha);
  validatePlan(plan);
  const absolute = writeJsonAtomic(output, plan);
  console.log(
    `Planned ${plan.selectedCount} package(s) in ${plan.layers.length} layer(s): ${absolute}`,
  );
}

function parseVersion(value) {
  const match = VERSION_RE.exec(value);
  if (!match) {
    fail(`${value} must be a valid SemVer version`);
  }
  const withoutBuild = value.split("+", 1)[0];
  const prereleaseAt = withoutBuild.indexOf("-");
  return {
    core: match.slice(1, 4),
    prerelease:
      prereleaseAt === -1
        ? []
        : withoutBuild.slice(prereleaseAt + 1).split("."),
  };
}

function compareNumericIdentifier(left, right) {
  if (left.length !== right.length) {
    return left.length < right.length ? -1 : 1;
  }
  return left === right ? 0 : left < right ? -1 : 1;
}

function comparePrerelease(left, right) {
  if (left.length === 0 || right.length === 0) {
    return left.length === right.length ? 0 : left.length === 0 ? 1 : -1;
  }
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const leftPart = left[index];
    const rightPart = right[index];
    if (leftPart === undefined || rightPart === undefined) {
      return leftPart === rightPart ? 0 : leftPart === undefined ? -1 : 1;
    }
    if (leftPart === rightPart) {
      continue;
    }
    const leftNumeric = /^\d+$/.test(leftPart);
    const rightNumeric = /^\d+$/.test(rightPart);
    if (leftNumeric && rightNumeric) {
      return compareNumericIdentifier(leftPart, rightPart);
    }
    if (leftNumeric !== rightNumeric) {
      return leftNumeric ? -1 : 1;
    }
    return leftPart < rightPart ? -1 : 1;
  }
  return 0;
}

function versionChange(baseVersion, version, packageName) {
  if (baseVersion === null) {
    return "new";
  }
  if (baseVersion === version) {
    fail(`${packageName} release plan does not change its version`);
  }
  const base = parseVersion(baseVersion);
  const next = parseVersion(version);
  const labels = ["major", "minor", "patch"];
  for (let index = 0; index < labels.length; index += 1) {
    if (next.core[index] !== base.core[index]) {
      if (compareNumericIdentifier(next.core[index], base.core[index]) < 0) {
        fail(`${packageName} release plan lowers ${baseVersion} to ${version}`);
      }
      return `${next.prerelease.length === 0 ? "" : "pre"}${labels[index]}`;
    }
  }
  const prereleaseOrder = comparePrerelease(base.prerelease, next.prerelease);
  if (prereleaseOrder > 0) {
    fail(`${packageName} release plan lowers ${baseVersion} to ${version}`);
  }
  if (prereleaseOrder < 0) {
    return next.prerelease.length === 0 ? "stable" : "prerelease";
  }
  fail(
    `${packageName} release plan changes ${baseVersion} to equal-precedence ${version}`,
  );
}

function markdownCode(value) {
  return `<code>${String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("|", "&#124;")}</code>`;
}

function releaseSummary(plan) {
  const rows = plan.packages.map((item) => ({
    ...item,
    change: versionChange(item.baseVersion, item.version, item.name),
  }));
  const counts = new Map();
  for (const { change } of rows) {
    counts.set(change, (counts.get(change) ?? 0) + 1);
  }
  const order = [
    "major",
    "minor",
    "patch",
    "premajor",
    "preminor",
    "prepatch",
    "prerelease",
    "stable",
    "new",
  ];
  const breakdown = order
    .filter((change) => counts.has(change))
    .map((change) => `${counts.get(change)} ${change}`)
    .join(", ");
  const table = rows
    .map(
      ({ baseVersion, change, layer, name, version }) =>
        `| ${markdownCode(name)} | ${baseVersion === null ? "—" : markdownCode(baseVersion)} | ${markdownCode(version)} | **${change}** | ${layer + 1} |`,
    )
    .join("\n");

  return `## npm release proposal

**${plan.selectedCount} package${plan.selectedCount === 1 ? "" : "s"} selected across ${plan.layers.length} publish layer${plan.layers.length === 1 ? "" : "s"}** from base ${markdownCode(plan.baseSha)}.

**Bump summary:** ${breakdown}.

| Package | Current | Proposed | Bump | Publish layer |
| :-- | --: | --: | :-- | --: |
${table}

Lower-numbered layers publish first. Publishing starts only after this PR is merged, CI passes, and the protected ${markdownCode("npm-production")} deployment is approved. The committed ${markdownCode(COMMITTED_PLAN_PATH)} file is the source of truth for the exact versions above.
`;
}

function commandSummary(options) {
  const planFile = path.resolve(process.cwd(), requiredOption(options, "plan"));
  const output = requiredOption(options, "output");
  const plan = validatePlan(readJson(planFile, planFile));
  const summary = releaseSummary(plan);
  const summaryBytes = Buffer.byteLength(summary, "utf8");
  if (summaryBytes > MAX_SUMMARY_BYTES) {
    fail(
      `Release summary is ${summaryBytes} bytes; maximum is ${MAX_SUMMARY_BYTES}`,
    );
  }
  const absolute = writeTextAtomic(output, summary);
  console.log(`Rendered ${plan.selectedCount} package bump(s) to ${absolute}`);
}

function assertTrackedWorktreeClean() {
  const result = git(["diff", "--quiet", "HEAD", "--"], { allowFailure: true });
  if (result.status === 1) {
    fail(
      "Tracked worktree changes must be committed before packing or releasing",
    );
  }
  if (result.status !== 0) {
    fail(`Could not inspect the worktree: ${result.stderr.trim()}`);
  }
}

function assertHeadBinding(headSha, context) {
  const head = currentHead();
  if (head !== headSha) {
    fail(`${context} targets ${headSha}, but Git HEAD is ${head}`);
  }
  const githubSha = environmentValue("GITHUB_SHA");
  if (githubSha && githubSha !== headSha) {
    fail(`${context} targets ${headSha}, but GITHUB_SHA is ${githubSha}`);
  }
}

function packageTarget(value, context) {
  if (typeof value !== "string" || !value) {
    fail(`${context} must be a non-empty string`);
  }
  const stripped = value.startsWith("./") ? value.slice(2) : value;
  if (
    !stripped ||
    path.posix.isAbsolute(stripped) ||
    stripped.includes("\\") ||
    path.posix.normalize(stripped) !== stripped ||
    stripped === ".." ||
    stripped.startsWith("../")
  ) {
    fail(`${context} is not a safe package-relative path: ${value}`);
  }
  return stripped;
}

function collectStringTargets(value, context, output) {
  if (typeof value === "string") {
    if (!value.startsWith("./")) {
      fail(`${context} target must begin with ./: ${value}`);
    }
    output.add(packageTarget(value, context));
    return;
  }
  if (value === null) {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectStringTargets(item, `${context}[${index}]`, output);
    });
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      collectStringTargets(item, `${context}.${key}`, output);
    });
    return;
  }
  fail(`${context} contains an unsupported package target`);
}

function entrypointTargets(manifest) {
  const targets = new Set();
  if (manifest.exports !== undefined) {
    collectStringTargets(manifest.exports, `${manifest.name} exports`, targets);
  }
  for (const field of ["types", "typings", "main", "module"]) {
    if (manifest[field] !== undefined) {
      targets.add(packageTarget(manifest[field], `${manifest.name} ${field}`));
    }
  }
  if (manifest.browser !== undefined) {
    if (typeof manifest.browser === "string") {
      targets.add(packageTarget(manifest.browser, `${manifest.name} browser`));
    } else if (manifest.browser && typeof manifest.browser === "object") {
      for (const [key, value] of Object.entries(manifest.browser)) {
        if (typeof value === "string" && value.startsWith("./")) {
          targets.add(packageTarget(value, `${manifest.name} browser.${key}`));
        }
      }
    } else {
      fail(`${manifest.name} browser must be a string or object`);
    }
  }
  if (manifest.bin !== undefined) {
    let bins;
    if (typeof manifest.bin === "string") {
      bins = [manifest.bin];
    } else if (
      manifest.bin &&
      typeof manifest.bin === "object" &&
      !Array.isArray(manifest.bin)
    ) {
      bins = Object.values(manifest.bin);
    } else {
      fail(`${manifest.name} bin must be a string or string-valued object`);
    }
    if (bins.some((value) => typeof value !== "string")) {
      fail(`${manifest.name} bin must be a string or string-valued object`);
    }
    for (const target of bins) {
      targets.add(packageTarget(target, `${manifest.name} bin`));
    }
  }
  if (targets.size === 0) {
    fail(
      `${manifest.name} has no exports, types, bin, main, module, or browser entrypoint`,
    );
  }
  return [...targets].sort();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wildcardRegExp(pattern) {
  return new RegExp(`^${pattern.split("*").map(escapeRegExp).join("[^/]+")}$`);
}

function walkFiles(directory, relative = "") {
  const files = [];
  for (const entry of readdirSync(path.join(directory, relative), {
    withFileTypes: true,
  })) {
    const child = relative ? `${relative}/${entry.name}` : entry.name;
    if (forbiddenPackedPath(child)) {
      continue;
    }
    if (entry.isSymbolicLink()) {
      fail(`Package payload cannot contain a symbolic link: ${child}`);
    }
    if (entry.isDirectory()) {
      files.push(...walkFiles(directory, child));
    } else if (entry.isFile()) {
      files.push(child);
    }
  }
  return files;
}

function forbiddenPackedPath(relative) {
  const parts = relative.split("/");
  return (
    parts.some((part) => FORBIDDEN_PACKED_PARTS.has(part)) ||
    parts.includes(".eslintcache") ||
    parts.includes(".DS_Store") ||
    relative.endsWith(".tsbuildinfo")
  );
}

function resolveLocalSpecifier(packageDirectory, fromRelative, specifier) {
  const clean = specifier.split(/[?#]/, 1)[0];
  if (!clean.startsWith(".")) {
    return null;
  }
  const fromDirectory = path.posix.dirname(fromRelative);
  const candidate = path.posix.normalize(path.posix.join(fromDirectory, clean));
  packageTarget(candidate, `local import in ${fromRelative}`);
  const attempts = [
    candidate,
    `${candidate}.js`,
    `${candidate}.mjs`,
    `${candidate}.cjs`,
    `${candidate}.json`,
    `${candidate}.d.ts`,
    `${candidate}/index.js`,
    `${candidate}/index.mjs`,
    `${candidate}/index.cjs`,
    `${candidate}/index.json`,
    `${candidate}/index.d.ts`,
  ];
  let resolved = null;
  for (const attempt of attempts) {
    const absolute = path.join(packageDirectory, ...attempt.split("/"));
    if (existsSync(absolute) && statSync(absolute).isFile()) {
      resolved = attempt;
      break;
    }
  }
  const results = new Set(resolved ? [resolved] : []);
  if (fromRelative.endsWith(".d.ts")) {
    const declarationCandidates = [
      clean.replace(/\.(?:mjs|cjs|js)$/, ".d.ts"),
      `${clean}.d.ts`,
    ];
    if (clean.endsWith(".mjs")) {
      declarationCandidates.push(clean.replace(/\.mjs$/, ".d.mts"));
    } else if (clean.endsWith(".cjs")) {
      declarationCandidates.push(clean.replace(/\.cjs$/, ".d.cts"));
    }
    for (const declaration of declarationCandidates) {
      const relative = path.posix.normalize(
        path.posix.join(fromDirectory, declaration),
      );
      packageTarget(relative, `type import in ${fromRelative}`);
      const absolute = path.join(packageDirectory, ...relative.split("/"));
      if (existsSync(absolute) && statSync(absolute).isFile()) {
        results.add(relative);
      }
    }
  }
  if (results.size === 0) {
    fail(`${fromRelative} imports missing local file ${specifier}`);
  }
  return [...results];
}

function localSpecifiers(source) {
  const specifiers = new Set();
  const expressions = [
    /(?:import|export)\s+(?:[^"']*?\s+from\s*)?["']([^"']+)["']/g,
    /import\s*\(\s*["']([^"']+)["']\s*\)/g,
    /require\s*\(\s*["']([^"']+)["']\s*\)/g,
    /new\s+URL\s*\(\s*["']([^"']+)["']\s*,\s*import\.meta\.url\s*\)/g,
  ];
  for (const expression of expressions) {
    let match;
    for (
      match = expression.exec(source);
      match;
      match = expression.exec(source)
    ) {
      if (match[1].startsWith(".")) {
        specifiers.add(match[1]);
      }
    }
  }
  return [...specifiers];
}

function payloadFiles(packageDirectory, targets) {
  const allFiles = targets.some((target) => target.includes("*"))
    ? walkFiles(packageDirectory)
    : [];
  const queue = [];
  for (const target of targets) {
    if (target.includes("*")) {
      const matches = allFiles.filter((file) =>
        wildcardRegExp(target).test(file),
      );
      if (matches.length === 0) {
        fail(`Package target pattern ${target} matched no files`);
      }
      queue.push(...matches);
    } else {
      const absolute = path.join(packageDirectory, ...target.split("/"));
      if (!existsSync(absolute) || !statSync(absolute).isFile()) {
        fail(`Package entrypoint does not exist: ${target}`);
      }
      queue.push(target);
    }
  }

  const files = new Set();
  while (queue.length > 0) {
    const relative = queue.shift();
    if (files.has(relative)) {
      continue;
    }
    if (forbiddenPackedPath(relative)) {
      fail(`Entrypoint closure reaches forbidden package path: ${relative}`);
    }
    files.add(relative);
    if (/\.(?:[cm]?js|ts|tsx|jsx)$/.test(relative)) {
      const source = readFileSync(
        path.join(packageDirectory, ...relative.split("/")),
        "utf8",
      );
      for (const specifier of localSpecifiers(source)) {
        const dependencies = resolveLocalSpecifier(
          packageDirectory,
          relative,
          specifier,
        );
        for (const dependency of dependencies) {
          queue.push(dependency);
        }
      }
    }
  }
  return [...files].sort();
}

function copyPayloadFile(sourceDirectory, stagingDirectory, relative) {
  const source = path.join(sourceDirectory, ...relative.split("/"));
  const destination = path.join(stagingDirectory, ...relative.split("/"));
  const sourceStat = lstatSync(source);
  if (!sourceStat.isFile()) {
    fail(`Package payload must be a regular file: ${relative}`);
  }
  mkdirSync(path.dirname(destination), { recursive: true });
  copyFileSync(source, destination);
  chmodSync(destination, sourceStat.mode & 0o777);
}

function createStagingPackage(item, manifest, temporaryRoot) {
  const sourceDirectory = safeRepositoryPath(
    item.directory,
    `${item.name} directory`,
  );
  const nameHash = createHash("sha256")
    .update(item.name)
    .digest("hex")
    .slice(0, 12);
  const stagingDirectory = path.join(
    temporaryRoot,
    `${item.name.replaceAll("/", "__").replaceAll("@", "_")}-${nameHash}`,
  );
  mkdirSync(stagingDirectory, { recursive: true });
  const targets = entrypointTargets(manifest);
  const payload = payloadFiles(sourceDirectory, targets);
  const staged = new Set(["package.json", ...payload]);
  copyPayloadFile(sourceDirectory, stagingDirectory, "package.json");
  for (const document of DOC_FILES) {
    if (existsSync(path.join(sourceDirectory, document))) {
      copyPayloadFile(sourceDirectory, stagingDirectory, document);
      staged.add(document);
    } else if (
      document === "LICENSE" &&
      existsSync(path.join(ROOT, document))
    ) {
      copyPayloadFile(ROOT, stagingDirectory, document);
      staged.add(document);
    }
  }
  for (const file of payload) {
    copyPayloadFile(sourceDirectory, stagingDirectory, file);
  }
  return { staged, stagingDirectory, targets };
}

function parseNpmJson(stdout, context) {
  try {
    return JSON.parse(stdout);
  } catch {
    const arrayStart = stdout.indexOf("[");
    const objectStart = stdout.indexOf("{");
    const start = [arrayStart, objectStart]
      .filter((index) => index !== -1)
      .sort((left, right) => left - right)[0];
    const end = Math.max(stdout.lastIndexOf("]"), stdout.lastIndexOf("}"));
    if (start !== undefined && end >= start) {
      try {
        return JSON.parse(stdout.slice(start, end + 1));
      } catch {
        // Fall through to the contextual error.
      }
    }
    fail(`${context} did not return valid JSON: ${stdout.trim()}`);
  }
}

function hashFile(file) {
  const contents = readFileSync(file);
  const sha1 = createHash("sha1").update(contents).digest("hex");
  const sha256 = createHash("sha256").update(contents).digest("hex");
  const sha512Buffer = createHash("sha512").update(contents).digest();
  return {
    integrity: `sha512-${sha512Buffer.toString("base64")}`,
    sha1,
    sha256,
    sha512: sha512Buffer.toString("hex"),
    size: contents.length,
  };
}

function validatePackedFiles(item, manifest, packResult, staged, targets) {
  if (!Array.isArray(packResult.files)) {
    fail(`npm pack did not report files for ${item.name}`);
  }
  const files = new Map();
  for (const entry of packResult.files) {
    if (!entry || typeof entry.path !== "string") {
      fail(`npm pack reported an invalid file for ${item.name}`);
    }
    const relative = entry.path.replace(/^package\//, "");
    packageTarget(relative, `${item.name} packed file`);
    if (forbiddenPackedPath(relative)) {
      fail(
        `${item.name} tarball contains forbidden transient path ${relative}`,
      );
    }
    if (!staged.has(relative)) {
      fail(
        `${item.name} tarball contains a file outside the controlled staging set: ${relative}`,
      );
    }
    files.set(relative, entry);
  }
  if (!files.has("package.json")) {
    fail(`${item.name} tarball does not contain package.json`);
  }
  for (const target of targets) {
    if (target.includes("*")) {
      if (
        ![...files.keys()].some((file) => wildcardRegExp(target).test(file))
      ) {
        fail(
          `${item.name} tarball does not satisfy entrypoint pattern ${target}`,
        );
      }
    } else if (!files.has(target)) {
      fail(`${item.name} tarball does not contain entrypoint ${target}`);
    }
  }
  const binTargets =
    manifest.bin === undefined
      ? []
      : typeof manifest.bin === "string"
        ? [manifest.bin]
        : Object.values(manifest.bin ?? {});
  for (const targetValue of binTargets) {
    const target = packageTarget(targetValue, `${item.name} bin`);
    const packed = files.get(target);
    if (!packed) {
      fail(`${item.name} tarball does not contain bin target ${target}`);
    }
    if (typeof packed.mode === "number" && (packed.mode & 0o111) === 0) {
      fail(
        `${item.name} bin target ${target} is not executable in the tarball`,
      );
    }
  }
}

async function mapLimit(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function consume() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () =>
      consume(),
    ),
  );
  return results;
}

async function packOne(item, outputDirectory, temporaryRoot) {
  const sourceDirectory = safeRepositoryPath(
    item.directory,
    `${item.name} directory`,
  );
  const manifest = validateWorkspaceManifest(
    readJson(path.join(sourceDirectory, "package.json")),
    item.directory,
  );
  if (
    manifest.name !== item.name ||
    manifest.version !== item.version ||
    manifest.private
  ) {
    fail(
      `${item.directory}/package.json no longer matches planned ${item.name}@${item.version}`,
    );
  }
  const { staged, stagingDirectory, targets } = createStagingPackage(
    item,
    manifest,
    temporaryRoot,
  );
  const result = requireSuccess(
    await run(
      NPM,
      [
        "pack",
        stagingDirectory,
        "--json",
        "--ignore-scripts",
        "--pack-destination",
        outputDirectory,
      ],
      { cwd: ROOT },
    ),
    `npm pack ${item.name}`,
  );
  const parsed = parseNpmJson(result.stdout, `npm pack ${item.name}`);
  if (!Array.isArray(parsed) || parsed.length !== 1) {
    fail(`npm pack returned an unexpected result for ${item.name}`);
  }
  const packed = parsed[0];
  if (packed.name !== item.name || packed.version !== item.version) {
    fail(
      `npm pack returned ${packed.name}@${packed.version}, expected ${item.name}@${item.version}`,
    );
  }
  validatePackedFiles(item, manifest, packed, staged, targets);
  if (
    typeof packed.filename !== "string" ||
    path.basename(packed.filename) !== packed.filename ||
    !packed.filename.endsWith(".tgz")
  ) {
    fail(`npm pack returned an unsafe tarball filename for ${item.name}`);
  }
  const tarballPath = path.resolve(outputDirectory, packed.filename);
  if (path.dirname(tarballPath) !== outputDirectory) {
    fail(`npm pack placed ${item.name} outside the artifact directory`);
  }
  const tarballStat = lstatSync(tarballPath);
  if (!tarballStat.isFile() || tarballStat.isSymbolicLink()) {
    fail(`${packed.filename} is not a regular tarball file`);
  }
  const hashes = hashFile(tarballPath);
  if (packed.shasum && packed.shasum !== hashes.sha1) {
    fail(`${item.name} npm shasum does not match its tarball`);
  }
  if (packed.integrity && packed.integrity !== hashes.integrity) {
    fail(`${item.name} npm integrity does not match its tarball`);
  }
  console.log(`Packed ${item.name}@${item.version} (${hashes.size} bytes).`);
  return {
    dependencies: item.dependencies,
    directory: item.directory,
    layer: item.layer,
    name: item.name,
    tarball: {
      entryCount: packed.files.length,
      file: packed.filename,
      ...hashes,
    },
    version: item.version,
  };
}

function canonicalJson(value) {
  return JSON.stringify(value);
}

async function commandPack(options) {
  const planFile = path.resolve(process.cwd(), requiredOption(options, "plan"));
  const outputDirectory = path.resolve(
    process.cwd(),
    requiredOption(options, "output"),
  );
  const concurrency = positiveInteger(
    options.values.get("concurrency"),
    "--concurrency",
    DEFAULT_CONCURRENCY,
  );
  assertTrackedWorktreeClean();
  const planSource = readFileSync(planFile, "utf8");
  const plan = validatePlan(parseJson(planSource, planFile));
  const headSha = currentHead();
  const githubSha = environmentValue("GITHUB_SHA");
  if (githubSha && githubSha !== headSha) {
    fail(`Git HEAD ${headSha} does not match GITHUB_SHA ${githubSha}`);
  }
  resolveCommit(plan.baseSha, "release plan baseSha");
  assertBaseAncestor(plan.baseSha, headSha);
  const recomputed = validatePlan(calculatePlan(plan.baseSha, plan.baseSha));
  if (plan.preparedTreeSha256 !== recomputed.preparedTreeSha256) {
    fail(
      "Prepared release tree has changed since the plan was created; regenerate the release proposal from current main",
    );
  }
  if (
    canonicalJson(planProjection(plan)) !==
    canonicalJson(planProjection(recomputed))
  ) {
    fail(
      "Committed release plan does not exactly match the versions and dependency layers recomputed from baseSha",
    );
  }
  if (existsSync(outputDirectory)) {
    if (!statSync(outputDirectory).isDirectory()) {
      fail(`Pack output is not a directory: ${outputDirectory}`);
    }
    const contents = readdirSync(outputDirectory);
    if (contents.length > 0) {
      fail(`Pack output directory must be empty: ${outputDirectory}`);
    }
  } else {
    mkdirSync(outputDirectory, { recursive: true });
  }

  const temporaryRoot = mkdtempSync(path.join(tmpdir(), "codsen-npm-release-"));
  try {
    const packages = await mapLimit(plan.packages, concurrency, (item) =>
      packOne(item, outputDirectory, temporaryRoot),
    );
    packages.sort((left, right) => left.name.localeCompare(right.name));
    const releaseManifest = {
      baseSha: plan.baseSha,
      createdAt: new Date().toISOString(),
      headSha,
      kind: MANIFEST_KIND,
      layers: plan.layers,
      packageCount: packages.length,
      packages,
      planSha256: createHash("sha256").update(planSource).digest("hex"),
      schemaVersion: SCHEMA_VERSION,
      workspaceCount: plan.workspaceCount,
    };
    validateReleaseManifest(releaseManifest, outputDirectory);
    const manifestFile = writeJsonAtomic(
      path.join(outputDirectory, "manifest.json"),
      releaseManifest,
    );
    console.log(`Wrote release artifact manifest: ${manifestFile}`);
  } finally {
    rmSync(temporaryRoot, { force: true, recursive: true });
  }
}

function validateTarball(item, manifestDirectory) {
  assertObjectKeys(
    item.tarball,
    ["entryCount", "file", "integrity", "sha1", "sha256", "sha512", "size"],
    `${item.name} tarball`,
  );
  const tarball = item.tarball;
  if (
    typeof tarball.file !== "string" ||
    path.basename(tarball.file) !== tarball.file ||
    !tarball.file.endsWith(".tgz")
  ) {
    fail(`${item.name} has an unsafe tarball filename`);
  }
  if (!Number.isInteger(tarball.entryCount) || tarball.entryCount < 1) {
    fail(`${item.name} tarball entryCount must be a positive integer`);
  }
  if (!Number.isInteger(tarball.size) || tarball.size < 1) {
    fail(`${item.name} tarball size must be a positive integer`);
  }
  if (!/^[0-9a-f]{40}$/.test(tarball.sha1)) {
    fail(`${item.name} tarball sha1 is invalid`);
  }
  if (!/^[0-9a-f]{64}$/.test(tarball.sha256)) {
    fail(`${item.name} tarball sha256 is invalid`);
  }
  if (!/^[0-9a-f]{128}$/.test(tarball.sha512)) {
    fail(`${item.name} tarball sha512 is invalid`);
  }
  if (!/^sha512-[A-Za-z0-9+/]+={0,2}$/.test(tarball.integrity)) {
    fail(`${item.name} tarball integrity is not a sha512 SRI`);
  }
  const absolute = path.resolve(manifestDirectory, tarball.file);
  if (path.dirname(absolute) !== manifestDirectory) {
    fail(`${item.name} tarball escapes the artifact directory`);
  }
  if (!existsSync(absolute)) {
    fail(`${item.name} tarball is missing: ${absolute}`);
  }
  const fileStat = lstatSync(absolute);
  if (!fileStat.isFile() || fileStat.isSymbolicLink()) {
    fail(`${item.name} tarball is not a regular file`);
  }
  const hashes = hashFile(absolute);
  for (const field of ["integrity", "sha1", "sha256", "sha512", "size"]) {
    if (hashes[field] !== tarball[field]) {
      fail(`${item.name} tarball ${field} does not match manifest.json`);
    }
  }
  return absolute;
}

function validateReleaseManifest(manifest, manifestDirectory) {
  assertObjectKeys(
    manifest,
    [
      "baseSha",
      "createdAt",
      "headSha",
      "kind",
      "layers",
      "packageCount",
      "packages",
      "planSha256",
      "schemaVersion",
      "workspaceCount",
    ],
    "release manifest",
  );
  if (
    manifest.kind !== MANIFEST_KIND ||
    manifest.schemaVersion !== SCHEMA_VERSION
  ) {
    fail("Unsupported release manifest kind or schema version");
  }
  assertSha(manifest.baseSha, "release manifest baseSha");
  assertSha(manifest.headSha, "release manifest headSha");
  if (Number.isNaN(Date.parse(manifest.createdAt))) {
    fail("release manifest createdAt must be an ISO timestamp");
  }
  if (!/^[0-9a-f]{64}$/.test(manifest.planSha256)) {
    fail("release manifest planSha256 is invalid");
  }
  if (
    !Number.isInteger(manifest.workspaceCount) ||
    manifest.workspaceCount < 1
  ) {
    fail("release manifest workspaceCount must be a positive integer");
  }
  if (!Array.isArray(manifest.packages)) {
    fail("release manifest packages must be an array");
  }
  if (
    manifest.packageCount !== manifest.packages.length ||
    manifest.packageCount < 1
  ) {
    fail(
      "release manifest must contain at least one package and packageCount must match packages.length",
    );
  }
  for (const [index, item] of manifest.packages.entries()) {
    assertObjectKeys(
      item,
      ["dependencies", "directory", "layer", "name", "tarball", "version"],
      `release manifest packages[${index}]`,
    );
    assertPackageName(item.name, `release manifest packages[${index}].name`);
    assertVersion(item.version, `${item.name} version`);
    safeRepositoryPath(item.directory, `${item.name} directory`);
    if (!Array.isArray(item.dependencies)) {
      fail(`${item.name} dependencies must be an array`);
    }
    item.dependencies.forEach((dependency) => {
      assertPackageName(dependency, `${item.name} dependency`);
    });
    if (
      new Set(item.dependencies).size !== item.dependencies.length ||
      JSON.stringify(item.dependencies) !==
        JSON.stringify([...item.dependencies].sort())
    ) {
      fail(`${item.name} dependencies must be unique and sorted`);
    }
    if (!Number.isInteger(item.layer) || item.layer < 0) {
      fail(`${item.name} layer must be a non-negative integer`);
    }
    validateTarball(item, manifestDirectory);
  }
  const names = manifest.packages.map(({ name }) => name);
  if (
    new Set(names).size !== names.length ||
    JSON.stringify(names) !== JSON.stringify([...names].sort())
  ) {
    fail("release manifest packages must have unique, sorted names");
  }
  validateLayers(manifest.packages, manifest.layers, "release manifest");
  return manifest;
}

function loadReleaseManifest(file) {
  const absolute = path.resolve(process.cwd(), file);
  const directory = path.dirname(absolute);
  return {
    directory,
    manifest: validateReleaseManifest(readJson(absolute), directory),
  };
}

function sanitizedNpmEnvironment() {
  const environment = { ...process.env };
  for (const key of Object.keys(environment)) {
    if (
      /^(?:NODE_AUTH_TOKEN|NPM_TOKEN|NPM_AUTH_TOKEN|YARN_NPM_AUTH_TOKEN)$/i.test(
        key,
      ) ||
      (/^NPM_CONFIG_/i.test(key) && /(?:AUTH|TOKEN)/i.test(key))
    ) {
      delete environment[key];
    }
  }
  environment.NPM_CONFIG_USERCONFIG = devNull;
  return environment;
}

function npmCredentialEnvironmentKeys() {
  return Object.keys(process.env).filter(
    (key) =>
      /^(?:NODE_AUTH_TOKEN|NPM_TOKEN|NPM_AUTH_TOKEN|YARN_NPM_AUTH_TOKEN)$/i.test(
        key,
      ) ||
      (/^NPM_CONFIG_/i.test(key) && /(?:AUTH|TOKEN)/i.test(key)),
  );
}

function assertTrustedPublishingEnvironment() {
  const credentials = npmCredentialEnvironmentKeys();
  if (credentials.length > 0) {
    fail(
      `Refusing trusted publish while npm credential environment variables are set: ${credentials.join(", ")}`,
    );
  }
  for (const key of [
    "ACTIONS_ID_TOKEN_REQUEST_URL",
    "ACTIONS_ID_TOKEN_REQUEST_TOKEN",
  ]) {
    if (!environmentValue(key)) {
      fail(`Trusted publishing requires GitHub OIDC variable ${key}`);
    }
  }
  const projectNpmrc = path.join(ROOT, ".npmrc");
  if (
    existsSync(projectNpmrc) &&
    /(?:_authToken|_auth|password|username)\s*=/i.test(
      readFileSync(projectNpmrc, "utf8"),
    )
  ) {
    fail(
      "Refusing trusted publish because the repository .npmrc contains credentials",
    );
  }
}

function npmErrorCode(result) {
  for (const source of [result.stdout, result.stderr]) {
    try {
      const parsed = JSON.parse(source);
      if (typeof parsed?.error?.code === "string") {
        return parsed.error.code;
      }
    } catch {
      // npm also reports a human-readable error code on stderr.
    }
  }
  const match = `${result.stdout}\n${result.stderr}`.match(/\b(E[A-Z0-9]+)\b/);
  return match?.[1] ?? null;
}

async function registryState(item) {
  const result = await run(
    NPM,
    [
      "view",
      `${item.name}@${item.version}`,
      "version",
      "dist.integrity",
      "--json",
      `--registry=${REGISTRY}`,
      "--loglevel=error",
    ],
    { env: sanitizedNpmEnvironment() },
  );
  if (result.code !== 0) {
    if (npmErrorCode(result) === "E404") {
      return { exists: false };
    }
    fail(
      `npm view ${item.name}@${item.version} failed (${result.code}): ${(
        result.stderr || result.stdout
      ).trim()}`,
    );
  }
  const parsed = parseNpmJson(
    result.stdout,
    `npm view ${item.name}@${item.version}`,
  );
  const version = parsed?.version;
  const integrity = parsed?.["dist.integrity"] ?? parsed?.dist?.integrity;
  if (version !== item.version || typeof integrity !== "string") {
    fail(`npm returned invalid metadata for ${item.name}@${item.version}`);
  }
  return { exists: true, integrity, version };
}

function assertRegistryIntegrity(item, state) {
  if (state.version !== item.version) {
    fail(
      `npm returned ${state.version}, expected ${item.name}@${item.version}`,
    );
  }
  if (state.integrity !== item.tarball.integrity) {
    fail(
      `${item.name}@${item.version} exists on npm with different tarball integrity (${state.integrity} != ${item.tarball.integrity})`,
    );
  }
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function verifyPublished(item) {
  const waits = [0, 1_000, 2_000, 4_000, 8_000, 8_000, 8_000];
  for (const wait of waits) {
    if (wait > 0) {
      await delay(wait);
    }
    const state = await registryState(item);
    if (state.exists) {
      assertRegistryIntegrity(item, state);
      return;
    }
  }
  fail(`${item.name}@${item.version} was not visible on npm after publishing`);
}

async function commandPreflight(options) {
  const planFile = path.resolve(process.cwd(), requiredOption(options, "plan"));
  const concurrency = positiveInteger(
    options.values.get("concurrency"),
    "--concurrency",
    DEFAULT_CONCURRENCY,
  );
  const plan = validatePlan(readJson(planFile, planFile));
  assertHeadBinding(plan.plannedAtSha, "release plan");
  const states = await mapLimit(plan.packages, concurrency, async (item) => ({
    item,
    state: await registryState(item),
  }));
  const collisions = states
    .filter(({ state }) => state.exists)
    .map(({ item }) => `${item.name}@${item.version}`);
  if (collisions.length > 0) {
    fail(
      `Release plan contains version${collisions.length === 1 ? "" : "s"} already present on npm: ${collisions.join(", ")}`,
    );
  }
  console.log(
    `Confirmed ${plan.selectedCount} planned package version(s) are available on npm.`,
  );
}

function validateCurrentPackageManifests(packages) {
  for (const item of packages) {
    const directory = safeRepositoryPath(
      item.directory,
      `${item.name} directory`,
    );
    const manifest = validateWorkspaceManifest(
      readJson(path.join(directory, "package.json")),
      item.directory,
    );
    if (
      manifest.name !== item.name ||
      manifest.version !== item.version ||
      manifest.private
    ) {
      fail(
        `${item.directory}/package.json does not match ${item.name}@${item.version}`,
      );
    }
  }
}

async function publishOne(item, tarballPath) {
  const state = await registryState(item);
  if (state.exists) {
    assertRegistryIntegrity(item, state);
    console.log(
      `Already published with matching integrity: ${item.name}@${item.version}.`,
    );
    return "skipped";
  }
  console.log(`Publishing ${item.name}@${item.version}...`);
  requireSuccess(
    await run(
      NPM,
      [
        "publish",
        tarballPath,
        "--ignore-scripts",
        "--provenance",
        "--access",
        "public",
        `--registry=${REGISTRY}`,
        "--loglevel=notice",
      ],
      { env: sanitizedNpmEnvironment() },
    ),
    `npm publish ${item.name}@${item.version}`,
  );
  await verifyPublished(item);
  console.log(`Published and verified ${item.name}@${item.version}.`);
  return "published";
}

async function commandPublish(options) {
  assertTrustedPublishingEnvironment();
  const manifestOption = requiredOption(options, "manifest");
  const concurrency = positiveInteger(
    options.values.get("concurrency"),
    "--concurrency",
    DEFAULT_CONCURRENCY,
  );
  const { directory, manifest } = loadReleaseManifest(manifestOption);
  assertTrackedWorktreeClean();
  assertHeadBinding(manifest.headSha, "release manifest");
  assertBaseAncestor(manifest.baseSha, manifest.headSha);
  validateCurrentPackageManifests(manifest.packages);
  const packageByName = new Map(
    manifest.packages.map((item) => [item.name, item]),
  );
  const counts = { published: 0, skipped: 0 };
  for (const [index, layer] of manifest.layers.entries()) {
    console.log(
      `Publishing layer ${index + 1}/${manifest.layers.length}: ${layer.join(", ")}`,
    );
    const outcomes = await mapLimit(layer, concurrency, async (name) => {
      const item = packageByName.get(name);
      const tarballPath = validateTarball(item, directory);
      return publishOne(item, tarballPath);
    });
    for (const outcome of outcomes) {
      counts[outcome] += 1;
    }
  }
  console.log(
    `Release complete: ${counts.published} published, ${counts.skipped} already present with matching integrity.`,
  );
}

async function verifyAllOnRegistry(packages, concurrency) {
  await mapLimit(packages, concurrency, async (item) => {
    const state = await registryState(item);
    if (!state.exists) {
      fail(`${item.name}@${item.version} is not published on npm`);
    }
    assertRegistryIntegrity(item, state);
  });
}

function tagName(item) {
  const tag = `${item.name}@${item.version}`;
  const check = git(["check-ref-format", `refs/tags/${tag}`], {
    allowFailure: true,
  });
  if (check.status !== 0) {
    fail(`Invalid release tag name: ${tag}`);
  }
  return tag;
}

function localTagState(tag, headSha) {
  const reference = `refs/tags/${tag}`;
  const exists = git(["show-ref", "--verify", "--quiet", reference], {
    allowFailure: true,
  });
  if (exists.status === 1) {
    return { exists: false };
  }
  if (exists.status !== 0) {
    fail(`Could not inspect local tag ${tag}: ${exists.stderr.trim()}`);
  }
  const type = git(["cat-file", "-t", reference]).stdout.trim();
  const target = git(["rev-list", "-n", "1", reference]).stdout.trim();
  if (type !== "tag") {
    fail(`Existing local tag ${tag} is not annotated`);
  }
  if (target !== headSha) {
    fail(`Existing local tag ${tag} targets ${target}, expected ${headSha}`);
  }
  return { exists: true };
}

function remoteTags(remote) {
  const result = git(["ls-remote", "--tags", remote]);
  const tags = new Map();
  for (const line of result.stdout.split("\n")) {
    if (!line) {
      continue;
    }
    const [sha, reference] = line.split(/\s+/, 2);
    if (!reference?.startsWith("refs/tags/")) {
      continue;
    }
    const peeled = reference.endsWith("^{}");
    const name = reference.slice("refs/tags/".length, peeled ? -3 : undefined);
    const state = tags.get(name) ?? {};
    if (peeled) {
      state.target = sha;
    } else {
      state.object = sha;
    }
    tags.set(name, state);
  }
  return tags;
}

async function commandTags(options) {
  const manifestOption = requiredOption(options, "manifest");
  const concurrency = positiveInteger(
    options.values.get("concurrency"),
    "--concurrency",
    DEFAULT_CONCURRENCY,
  );
  const shouldPush = options.flags.has("push");
  const remote = options.values.get("remote") ?? "origin";
  if (!remote || remote.startsWith("-")) {
    fail("--remote must be a safe Git remote name or URL");
  }
  const { manifest } = loadReleaseManifest(manifestOption);
  assertTrackedWorktreeClean();
  assertHeadBinding(manifest.headSha, "release manifest");
  assertBaseAncestor(manifest.baseSha, manifest.headSha);
  validateCurrentPackageManifests(manifest.packages);
  await verifyAllOnRegistry(manifest.packages, concurrency);

  const desired = manifest.packages.map((item) => ({
    local: localTagState(tagName(item), manifest.headSha),
    tag: tagName(item),
  }));
  const remoteState = shouldPush ? remoteTags(remote) : new Map();
  const create = [];
  const push = [];
  for (const item of desired) {
    const published = remoteState.get(item.tag);
    if (published) {
      if (!published.target) {
        fail(`Existing remote tag ${item.tag} is not annotated`);
      }
      if (published.target !== manifest.headSha) {
        fail(
          `Existing remote tag ${item.tag} targets ${published.target}, expected ${manifest.headSha}`,
        );
      }
      console.log(`Remote tag already correct: ${item.tag}.`);
      continue;
    }
    if (!item.local.exists) {
      create.push(item.tag);
    }
    if (shouldPush) {
      push.push(item.tag);
    }
  }
  for (const tag of create) {
    git(["tag", "--annotate", "--message", tag, tag, manifest.headSha]);
    console.log(`Created annotated tag ${tag}.`);
  }
  if (shouldPush && push.length > 0) {
    git([
      "push",
      "--atomic",
      remote,
      ...push.map((tag) => `refs/tags/${tag}:refs/tags/${tag}`),
    ]);
    console.log(
      `Atomically pushed ${push.length} release tag(s) to ${remote}.`,
    );
  } else if (shouldPush) {
    console.log(
      "All release tags already exist on the remote at the correct commit.",
    );
  } else {
    console.log(
      `Prepared ${desired.length} local annotated release tag(s); not pushed.`,
    );
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.command === "assert-workspaces") {
    commandAssertWorkspaces(options);
  } else if (options.command === "plan") {
    commandPlan(options);
  } else if (options.command === "summary") {
    commandSummary(options);
  } else if (options.command === "preflight") {
    await commandPreflight(options);
  } else if (options.command === "pack") {
    await commandPack(options);
  } else if (options.command === "publish") {
    await commandPublish(options);
  } else if (options.command === "tags") {
    await commandTags(options);
  }
}

main().catch((error) => {
  console.error(`npm-release: ${error.message}`);
  process.exitCode = 1;
});
