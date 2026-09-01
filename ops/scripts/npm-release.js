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
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { devNull, tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  extractDeclarationReferences,
  resolveDeclarationReferences,
} from "../helpers/declarationDependencyResolution.js";
import { installedPackageBinInvocation } from "../helpers/nodeProcessInvocation.js";
import {
  entrypointTargets,
  forbiddenPackedPath,
  localSpecifiers,
  MANIFEST_KIND,
  packageTarget,
  safeTarballFilename,
  validatePackedFiles,
  validateReleaseManifest as validateReleaseManifestCore,
  validateTarball as validateTarballCore,
  wildcardRegExp,
} from "../helpers/npmPackagePayload.js";
import {
  assertConsumerRuntimeSupportsPlans,
  assertResolvedProductionDeclarationDependencies,
  createReleaseConsumerPlans,
  isBareDeclarationSpecifier,
  strictConsumerTypeScriptConfig,
  strictConsumerTypeScriptSource,
} from "../helpers/npmReleaseConsumer.js";
import {
  assertPackageName,
  assertSha,
  assertVersion,
  COMMITTED_PLAN_PATH,
  DATA_PACKAGE,
  DEPENDENCY_FIELDS,
  PLAN_KIND,
  planProjection,
  RELEASE_SCHEMA_VERSION,
  releasePackages,
  releaseSummary,
  safeRepositoryPath as resolveSafeRepositoryPath,
  validatePlan as validateReleasePlan,
} from "../helpers/npmReleasePlan.js";
import {
  assertRegistryIntegrity,
  PUBLISH_VERIFICATION_WAITS,
  publishAndVerifyLayer,
  publishPackage,
  publishReleaseLayers,
  releaseTagDecisions,
  verifyPublishedPackages,
} from "../helpers/npmReleaseRegistry.js";
import {
  assertFunctionalCliSmokeCoverage,
  runFunctionalCliSmoke,
} from "../helpers/packedArtifactCliSmokes.js";
import { assertReproducibleReleaseManifests } from "../helpers/releaseReproducibility.js";
import { readWorkspaceRecords } from "../helpers/workspaceInventoryFile.js";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const NPM = process.platform === "win32" ? "npm.cmd" : "npm";
const REGISTRY = "https://registry.npmjs.org/";
const EXPECTED_WORKSPACE_COUNT = 113;
const SCHEMA_VERSION = RELEASE_SCHEMA_VERSION;
const DEFAULT_CONCURRENCY = 8;
const MAX_OUTPUT_BYTES = 50 * 1024 * 1024;
const MAX_SUMMARY_BYTES = 60 * 1024;
const DOC_FILES = ["CHANGELOG.md", "LICENSE", "README.md"];

function fail(message) {
  throw new Error(message);
}

function environmentValue(name) {
  return Reflect.get(process.env, name);
}

function printUsage() {
  console.log(`Usage:
  node ops/scripts/npm-release.js assert-workspaces [--expected <count>]
  node ops/scripts/npm-release.js plan --base <git-ref> --output <plan.json>
  node ops/scripts/npm-release.js summary --plan <plan.json> --output <summary.md>
  node ops/scripts/npm-release.js preflight --plan <plan.json> [--concurrency 8]
  node ops/scripts/npm-release.js pack --plan <plan.json> --output <directory> [--reference <manifest.json>] [--concurrency 8]
  node ops/scripts/npm-release.js verify-consumers --manifest <manifest.json> [--typescript <typescript/bin/tsc>] [--concurrency 8]
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
    pack: new Set(["plan", "output", "reference", "concurrency"]),
    "verify-consumers": new Set(["manifest", "typescript", "concurrency"]),
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

function safeRepositoryPath(relative, context) {
  return resolveSafeRepositoryPath(relative, context, ROOT);
}

function validateWorkspaceManifest(manifest, directory) {
  assertPackageName(manifest.name, `${directory}/package.json name`);
  assertVersion(manifest.version, `${manifest.name} version`);
  return manifest;
}

function discoverWorkspaces() {
  const seen = new Map();
  const workspaces = readWorkspaceRecords(ROOT).map(
    ({ directory, manifest }) => {
      validateWorkspaceManifest(manifest, directory);
      if (seen.has(manifest.name)) {
        fail(
          `Duplicate package name ${manifest.name} in ${seen.get(manifest.name)} and ${directory}`,
        );
      }
      seen.set(manifest.name, directory);
      return { directory, manifest };
    },
  );
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
  let expected = EXPECTED_WORKSPACE_COUNT;
  if (expectedRaw !== undefined) {
    if (!/^\d+$/.test(expectedRaw)) {
      fail("--expected must be a non-negative integer");
    }
    expected = Number(expectedRaw);
  }
  if (workspaces.length !== expected) {
    fail(`Expected ${expected} workspaces, found ${workspaces.length}`);
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
  const { layers, packages } = releasePackages(selected);

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

function validatePlan(plan) {
  return validateReleasePlan(plan, { repositoryRoot: ROOT });
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
  return { payload, staged, stagingDirectory, targets };
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
  const { payload, staged, stagingDirectory, targets } = createStagingPackage(
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
  validatePackedFiles(item, manifest, packed, staged, targets, payload);
  if (!safeTarballFilename(packed.filename)) {
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
  const referenceManifest = options.values.get("reference");
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
    if (referenceManifest) {
      const reference = loadReleaseManifest(referenceManifest).manifest;
      assertReproducibleReleaseManifests(reference, releaseManifest);
      console.log(
        `Verified reproducible release artifacts against ${path.resolve(process.cwd(), referenceManifest)}.`,
      );
    }
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
  return validateTarballCore(item, manifestDirectory, (absolute) => {
    if (!existsSync(absolute)) {
      return { exists: false };
    }
    const fileStat = lstatSync(absolute);
    return {
      exists: true,
      hashes: fileStat.isFile() ? hashFile(absolute) : undefined,
      isFile: fileStat.isFile(),
      isSymbolicLink: fileStat.isSymbolicLink(),
    };
  });
}

function validateReleaseManifest(manifest, manifestDirectory) {
  return validateReleaseManifestCore(manifest, {
    inspectTarball: (absolute) => {
      if (!existsSync(absolute)) {
        return { exists: false };
      }
      const fileStat = lstatSync(absolute);
      return {
        exists: true,
        hashes: fileStat.isFile() ? hashFile(absolute) : undefined,
        isFile: fileStat.isFile(),
        isSymbolicLink: fileStat.isSymbolicLink(),
      };
    },
    manifestDirectory,
    repositoryRoot: ROOT,
  });
}

function loadReleaseManifest(file) {
  const absolute = path.resolve(process.cwd(), file);
  const directory = path.dirname(absolute);
  return {
    directory,
    manifest: validateReleaseManifest(readJson(absolute), directory),
  };
}

function releaseConsumerEnvironment(npmCache) {
  return {
    ...sanitizedNpmEnvironment(),
    CI: "true",
    FORCE_COLOR: "0",
    NO_COLOR: "1",
    NO_UPDATE_NOTIFIER: "1",
    npm_config_audit: "false",
    npm_config_cache: npmCache,
    npm_config_engine_strict: "true",
    npm_config_fund: "false",
    npm_config_ignore_scripts: "true",
    npm_config_update_notifier: "false",
  };
}

function installedPackageDirectory(consumerDirectory, packageName) {
  return path.join(
    consumerDirectory,
    "node_modules",
    ...packageName.split("/"),
  );
}

function installedPackageDirectories(nodeModulesDirectory) {
  if (!existsSync(nodeModulesDirectory)) {
    return [];
  }
  const directories = [];
  for (const entry of readdirSync(nodeModulesDirectory, {
    withFileTypes: true,
  })) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const entryPath = path.join(nodeModulesDirectory, entry.name);
    if (entry.name.startsWith("@") && entry.isDirectory()) {
      for (const scopedEntry of readdirSync(entryPath, {
        withFileTypes: true,
      })) {
        if (scopedEntry.isDirectory() || scopedEntry.isSymbolicLink()) {
          directories.push(path.join(entryPath, scopedEntry.name));
        }
      }
    } else if (entry.isDirectory() || entry.isSymbolicLink()) {
      directories.push(entryPath);
    }
  }
  return directories;
}

function findReleasePackageCopies(consumerDirectory, releaseNames) {
  const copies = new Map([...releaseNames].map((name) => [name, []]));
  const visited = new Set();

  function visit(nodeModulesDirectory) {
    if (!existsSync(nodeModulesDirectory)) {
      return;
    }
    const realDirectory = realpathSync(nodeModulesDirectory);
    if (visited.has(realDirectory)) {
      return;
    }
    visited.add(realDirectory);
    for (const packageDirectory of installedPackageDirectories(
      nodeModulesDirectory,
    )) {
      const manifestFile = path.join(packageDirectory, "package.json");
      if (!existsSync(manifestFile)) {
        continue;
      }
      const manifest = readJson(manifestFile);
      if (copies.has(manifest.name)) {
        copies.get(manifest.name).push({
          directory: realpathSync(packageDirectory),
          version: manifest.version,
        });
      }
      visit(path.join(packageDirectory, "node_modules"));
    }
  }

  visit(path.join(consumerDirectory, "node_modules"));
  return copies;
}

function assertExactNames(actual, expected, context) {
  const sortedActual = [...actual].sort((left, right) =>
    left.localeCompare(right),
  );
  const sortedExpected = [...expected].sort((left, right) =>
    left.localeCompare(right),
  );
  if (canonicalJson(sortedActual) !== canonicalJson(sortedExpected)) {
    fail(
      `${context} contains [${sortedActual.join(", ")}], expected [${sortedExpected.join(", ")}]`,
    );
  }
}

function assertConsumerDependencyPins(
  consumerDirectory,
  plan,
  releasePackageByName,
) {
  const consumerManifest = readJson(
    path.join(consumerDirectory, "package.json"),
  );
  const packageLock = readJson(
    path.join(consumerDirectory, "package-lock.json"),
  );
  const lockedRoot = packageLock.packages?.[""];
  if (!lockedRoot) {
    fail(`${plan.name} consumer has no root package-lock entry`);
  }
  assertExactNames(
    Object.keys(consumerManifest.dependencies ?? {}),
    plan.closureNames,
    `${plan.name} consumer dependencies`,
  );
  assertExactNames(
    Object.keys(lockedRoot.dependencies ?? {}),
    plan.closureNames,
    `${plan.name} consumer lockfile dependencies`,
  );

  for (const name of plan.closureNames) {
    const releasePackage = releasePackageByName.get(name);
    for (const [context, specifier] of [
      ["package.json", consumerManifest.dependencies?.[name]],
      ["package-lock.json", lockedRoot.dependencies?.[name]],
    ]) {
      if (
        typeof specifier !== "string" ||
        !specifier.startsWith("file:") ||
        !specifier.endsWith(releasePackage.tarball.file)
      ) {
        fail(
          `${plan.name} consumer ${context} does not pin ${name} to ${releasePackage.tarball.file}`,
        );
      }
    }

    const installedDirectory = installedPackageDirectory(
      consumerDirectory,
      name,
    );
    if (!existsSync(installedDirectory)) {
      fail(`${plan.name} consumer did not install release package ${name}`);
    }
    const installedStat = lstatSync(installedDirectory);
    if (!installedStat.isDirectory() || installedStat.isSymbolicLink()) {
      fail(`${plan.name} consumer installed ${name} through a non-directory`);
    }
    const installedManifest = readJson(
      path.join(installedDirectory, "package.json"),
    );
    if (
      installedManifest.name !== name ||
      installedManifest.version !== releasePackage.version
    ) {
      fail(
        `${plan.name} consumer installed ${installedManifest.name}@${installedManifest.version}, expected ${name}@${releasePackage.version}`,
      );
    }
  }

  const expectedNames = new Set(plan.closureNames);
  const copies = findReleasePackageCopies(
    consumerDirectory,
    releasePackageByName.keys(),
  );
  for (const [name, installed] of copies) {
    // A dependency outside this release can pull a release package name in
    // from the registry through its own graph, at the version published before
    // this release. Preflight rejects any release version that npm already
    // serves, so only a copy carrying the release version can have come from a
    // release tarball, and only those copies are this check's business.
    const releasePackage = releasePackageByName.get(name);
    const found = installed.filter(
      (copy) => copy.version === releasePackage.version,
    );
    if (!expectedNames.has(name)) {
      if (found.length > 0) {
        fail(
          `${plan.name} consumer unexpectedly installed release package ${name}`,
        );
      }
      continue;
    }
    if (found.length !== 1) {
      fail(
        `${plan.name} consumer installed ${found.length} copies of release package ${name}; expected exactly one immutable tarball copy`,
      );
    }
    if (
      found[0].directory !==
        realpathSync(installedPackageDirectory(consumerDirectory, name)) ||
      found[0].version !== releasePackage.version
    ) {
      fail(
        `${plan.name} consumer did not install exact ${name}@${releasePackage.version} at its root`,
      );
    }
  }
}

function assertInstalledPayload(consumerDirectory, plan) {
  const packageDirectory = installedPackageDirectory(
    consumerDirectory,
    plan.name,
  );
  const manifest = readJson(path.join(packageDirectory, "package.json"));
  const files = new Set(walkFiles(packageDirectory));
  for (const target of entrypointTargets(manifest)) {
    const present = target.includes("*")
      ? [...files].some((file) => wildcardRegExp(target).test(file))
      : files.has(target);
    if (!present) {
      fail(`${plan.name} consumer payload omits entrypoint ${target}`);
    }
  }
  return { files, manifest, packageDirectory };
}

function assertDeclarationDependencyOwnership(
  plan,
  manifest,
  packageDirectory,
  files,
  typescriptApi,
) {
  if (!plan.typed) {
    return;
  }
  const resolvedReferences = [];
  for (const relative of files) {
    if (!/\.d\.(?:ts|mts|cts)$/.test(relative)) {
      continue;
    }
    const containingFile = path.join(packageDirectory, ...relative.split("/"));
    const references = extractDeclarationReferences({
      source: readFileSync(containingFile, "utf8"),
      typescript: typescriptApi,
    }).filter(({ specifier }) => isBareDeclarationSpecifier(specifier));
    resolvedReferences.push(
      ...resolveDeclarationReferences({
        containingFile,
        references,
        typescript: typescriptApi,
      }),
    );
  }
  assertResolvedProductionDeclarationDependencies(manifest, resolvedReferences);
}

async function importReleaseConsumer(consumerDirectory, plan) {
  if (!plan.importable) {
    return;
  }
  const script = `try {
  await import(${JSON.stringify(plan.name)});
} catch (error) {
  throw new Error(${JSON.stringify(`Could not import ${plan.name}`)} + ": " + (error.stack ?? error.message));
}`;
  requireSuccess(
    await run(process.execPath, ["--input-type=module", "--eval", script], {
      cwd: consumerDirectory,
      env: releaseConsumerEnvironment(
        path.join(consumerDirectory, ".runtime-npm-cache"),
      ),
    }),
    `${plan.name} runtime import`,
  );
}

function runInstalledReleaseBinary(consumerDirectory, alias, args, cwd) {
  const invocation = installedPackageBinInvocation({
    alias,
    args,
    consumerDirectory,
  });
  if (!existsSync(invocation.filename)) {
    fail(`${consumerDirectory} has no installed bin alias ${alias}`);
  }
  const result = spawnSync(invocation.command, invocation.args, {
    cwd,
    encoding: "utf8",
    env: releaseConsumerEnvironment(
      path.join(consumerDirectory, ".cli-npm-cache"),
    ),
    maxBuffer: MAX_OUTPUT_BYTES,
    shell: invocation.shell,
  });
  if (result.error || result.status !== 0) {
    fail(
      [
        `${alias} ${args.join(" ")} failed (${result.status ?? result.signal})`,
        result.error?.message,
        result.stdout,
        result.stderr,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  return result;
}

function smokeReleaseConsumerBins(consumerDirectory, plan) {
  for (const alias of Object.keys(plan.bins)) {
    for (const [argument, expected] of [
      ["--help", /(usage|options|help|call)/i],
      ["--version", plan.version],
    ]) {
      const result = runInstalledReleaseBinary(
        consumerDirectory,
        alias,
        [argument],
        consumerDirectory,
      );
      const output = `${result.stdout}\n${result.stderr}`;
      const matched =
        typeof expected === "string"
          ? output.includes(expected)
          : expected.test(output);
      if (!matched) {
        fail(
          `${plan.name} bin ${alias} ${argument} returned unexpected output`,
        );
      }
    }
  }
  if (Object.keys(plan.bins).length > 0) {
    runFunctionalCliSmoke({
      cli: plan,
      consumerDirectory,
      runBinary: ({ alias, args, cwd }) =>
        runInstalledReleaseBinary(consumerDirectory, alias, args, cwd),
    });
  }
}

async function compileReleaseConsumer(consumerDirectory, plan, typescript) {
  if (!plan.typed) {
    return;
  }
  writeFileSync(
    path.join(consumerDirectory, "consumer.ts"),
    strictConsumerTypeScriptSource(plan.name),
  );
  writeFileSync(
    path.join(consumerDirectory, "tsconfig.json"),
    `${JSON.stringify(strictConsumerTypeScriptConfig(), null, 2)}\n`,
  );
  requireSuccess(
    await run(
      process.execPath,
      [typescript, "--pretty", "false", "--project", "tsconfig.json"],
      {
        cwd: consumerDirectory,
        env: releaseConsumerEnvironment(
          path.join(consumerDirectory, ".typescript-npm-cache"),
        ),
      },
    ),
    `${plan.name} strict declaration consumer`,
  );
}

async function loadTypeScriptApi(typescriptCompiler) {
  const apiFile = path.resolve(
    path.dirname(typescriptCompiler),
    "../lib/typescript.js",
  );
  if (!existsSync(apiFile) || !lstatSync(apiFile).isFile()) {
    fail(`TypeScript API does not exist beside the compiler: ${apiFile}`);
  }
  const imported = await import(pathToFileURL(apiFile).href);
  const typescriptApi = imported.default ?? imported;
  if (typeof typescriptApi.resolveModuleName !== "function") {
    fail(`TypeScript API is invalid: ${apiFile}`);
  }
  return typescriptApi;
}

async function verifyReleaseConsumer({
  artifactsDirectory,
  consumerRoot,
  npmCache,
  plan,
  releasePackageByName,
  typescript,
  typescriptApi,
}) {
  const safeName = plan.name.replaceAll("/", "-").replaceAll("@", "");
  const consumerDirectory = mkdtempSync(
    path.join(consumerRoot, `${safeName}-`),
  );
  writeJsonAtomic(path.join(consumerDirectory, "package.json"), {
    name: `codsen-release-consumer-${safeName}`,
    private: true,
    type: "module",
    version: "1.0.0",
  });
  const tarballs = plan.closureNames.map((name) =>
    path.join(artifactsDirectory, releasePackageByName.get(name).tarball.file),
  );
  requireSuccess(
    await run(
      NPM,
      [
        "install",
        "--engine-strict",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        "--omit=dev",
        ...tarballs,
      ],
      {
        cwd: consumerDirectory,
        env: releaseConsumerEnvironment(npmCache),
      },
    ),
    `${plan.name} production-only consumer install`,
  );
  assertConsumerDependencyPins(consumerDirectory, plan, releasePackageByName);
  const { files, manifest, packageDirectory } = assertInstalledPayload(
    consumerDirectory,
    plan,
  );
  assertDeclarationDependencyOwnership(
    plan,
    manifest,
    packageDirectory,
    files,
    typescriptApi,
  );
  await importReleaseConsumer(consumerDirectory, plan);
  await smokeReleaseConsumerBins(consumerDirectory, plan);
  await compileReleaseConsumer(consumerDirectory, plan, typescript);
  console.log(
    `Verified isolated publish consumer for ${plan.name}@${plan.version}.`,
  );
}

async function commandVerifyConsumers(options) {
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

  const plans = createReleaseConsumerPlans(
    manifest.packages,
    readWorkspaceRecords(ROOT),
  );
  assertConsumerRuntimeSupportsPlans(plans, process.versions.node);
  assertFunctionalCliSmokeCoverage(
    plans.filter(({ bins }) => Object.keys(bins).length > 0),
  );
  const typescript = path.resolve(
    process.cwd(),
    options.values.get("typescript") ?? "node_modules/typescript/bin/tsc",
  );
  if (plans.some(({ typed }) => typed)) {
    if (!existsSync(typescript)) {
      fail(`TypeScript compiler does not exist: ${typescript}`);
    }
    const compilerStat = lstatSync(typescript);
    if (!compilerStat.isFile() || compilerStat.isSymbolicLink()) {
      fail(`TypeScript compiler is not a regular file: ${typescript}`);
    }
  }
  const typescriptApi = plans.some(({ typed }) => typed)
    ? await loadTypeScriptApi(typescript)
    : null;

  const releasePackageByName = new Map(
    manifest.packages.map((item) => [item.name, item]),
  );
  const temporaryRoot = mkdtempSync(
    path.join(tmpdir(), "codsen-npm-release-consumers-"),
  );
  const consumerRoot = path.join(temporaryRoot, "consumers");
  const npmCache = path.join(temporaryRoot, "npm-cache");
  mkdirSync(consumerRoot, { recursive: true });
  mkdirSync(npmCache, { recursive: true });
  let succeeded = false;
  try {
    const results = await mapLimit(plans, concurrency, async (plan) => {
      try {
        await verifyReleaseConsumer({
          artifactsDirectory: directory,
          consumerRoot,
          npmCache,
          plan,
          releasePackageByName,
          typescript,
          typescriptApi,
        });
        return { name: plan.name, status: "passed" };
      } catch (error) {
        return {
          error: error.stack ?? error.message,
          name: plan.name,
          status: "failed",
        };
      }
    });
    const failures = results.filter(({ status }) => status === "failed");
    if (failures.length > 0) {
      fail(
        `Release consumer verification failed:\n${failures
          .map(({ error, name }) => `\n${name}:\n${error}`)
          .join("\n")}`,
      );
    }
    succeeded = true;
    console.log(
      `Verified ${plans.length} exact publish-shaped tarball consumer(s), including ${plans.filter(({ typed }) => typed).length} strict declaration compilation(s).`,
    );
  } finally {
    if (succeeded) {
      rmSync(temporaryRoot, { force: true, recursive: true });
    } else {
      console.error(`Preserved failing consumers at ${temporaryRoot}`);
    }
  }
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

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
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
  return publishPackage(item, tarballPath, {
    log: (message) => console.log(message),
    publish: async () => {
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
    },
    readState: registryState,
  });
}

async function verifyPublishedLayer(items, concurrency) {
  await verifyPublishedPackages(items, {
    delay,
    log: (message) => console.log(message),
    readStates: (pending) =>
      mapLimit(pending, concurrency, (item) => registryState(item)),
    waits: PUBLISH_VERIFICATION_WAITS,
  });
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
  const counts = await publishReleaseLayers(manifest.layers, {
    log: (message) => console.log(message),
    publishLayer: async (layer) => {
      const items = layer.map((name) => packageByName.get(name));
      return publishAndVerifyLayer(items, {
        log: (message) => console.log(message),
        publishItems: (pending) =>
          mapLimit(pending, concurrency, async (item) => {
            const tarballPath = validateTarball(item, directory);
            return publishOne(item, tarballPath);
          }),
        verifyItems: (published) =>
          verifyPublishedLayer(published, concurrency),
      });
    },
  });
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
  const { alreadyRemote, create, push } = releaseTagDecisions(
    desired,
    remoteState,
    shouldPush,
    manifest.headSha,
  );
  for (const tag of alreadyRemote) {
    console.log(`Remote tag already correct: ${tag}.`);
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
  } else if (options.command === "verify-consumers") {
    await commandVerifyConsumers(options);
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
