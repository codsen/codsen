#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { builtinModules } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertCanonicalNodeVersion } from "../helpers/localNodeCompatibility.js";
import {
  runtimeDependencyClosureNames,
  supportedNodeMajors,
} from "../helpers/nodeCompatibility.js";
import {
  installedPackageBinInvocation,
  pairedNpmCliCandidates,
} from "../helpers/nodeProcessInvocation.js";
import {
  assertCompatibilityManifestMatchesPlan,
  COMPATIBILITY_MANIFEST_KIND,
  COMPATIBILITY_SCHEMA_VERSION,
  createCompatibilityPlan as createCompatibilityPlanCore,
  normaliseNpmPackReport,
  validateCompatibilityManifest,
} from "../helpers/packageNodeCompatibility.js";
import {
  assertFunctionalCliSmokeInventory,
  runFunctionalCliSmoke,
} from "../helpers/packedArtifactCliSmokes.js";
import { readWorkspaceRecords } from "../helpers/workspaceInventoryFile.js";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const MANIFEST_FILENAME = "manifest.json";
const MANIFEST_KIND = COMPATIBILITY_MANIFEST_KIND;
const SCHEMA_VERSION = COMPATIBILITY_SCHEMA_VERSION;
const SUPPORTED_NODE_MAJORS = supportedNodeMajors;
const PRODUCTION_DEPENDENCY_FIELDS = [
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
];
const MAX_OUTPUT_BYTES = 50 * 1024 * 1024;
const CHILD_TIMEOUT_MS = 30_000;
const PACK_TIMEOUT_MS = 5 * 60_000;
const INSTALL_TIMEOUT_MS = 15 * 60_000;
const UNIT_TIMEOUT_MS = 120_000;
const COPY_EXCLUSIONS = new Set([
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "perf",
  "tap",
  "types",
]);

function fail(message) {
  throw new Error(message);
}

function readJson(filename) {
  return JSON.parse(readFileSync(filename, "utf8"));
}

function writeJson(filename, value) {
  writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`);
}

function printUsage() {
  console.log(`Usage:
  node ops/scripts/package-node-compatibility.js pack --output <directory>
  node ops/scripts/package-node-compatibility.js verify --artifacts <directory> --node-major <major> [options]
  node ops/scripts/package-node-compatibility.js smoke --artifacts <directory> [options]

Verify and smoke options:
  --npm-cache <directory>  Reuse an npm cache owned by the caller
  --temp-root <directory>  Place the isolated consumer under this directory

Verify-only options:
  --unit-concurrency <n>   Maximum simultaneous unit suites (default: 1)

The pack command runs once after the root-supported build. Verification runs in
an isolated consumer on each of Node ${SUPPORTED_NODE_MAJORS.join(", ")}, selecting every
workspace whose declared Node floor is at or below that major. Smoke installs
only the CLI and codsen-glob runtime closure for cross-platform checks.`);
}

function parseArguments(argv) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    process.exit(argv.length === 0 ? 1 : 0);
  }

  const command = argv[0];
  if (!new Set(["pack", "smoke", "verify"]).has(command)) {
    fail(`Unknown command: ${command}`);
  }

  const values = new Map();
  for (let index = 1; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) {
      fail(`Unexpected positional argument: ${argument}`);
    }
    const equalsAt = argument.indexOf("=");
    const name = argument.slice(2, equalsAt === -1 ? undefined : equalsAt);
    const allowed = new Set(
      command === "pack"
        ? ["output"]
        : command === "verify"
          ? [
              "artifacts",
              "node-major",
              "npm-cache",
              "temp-root",
              "unit-concurrency",
            ]
          : ["artifacts", "npm-cache", "temp-root"],
    );
    if (!allowed.has(name)) {
      fail(`Unknown option for ${command}: --${name}`);
    }
    if (values.has(name)) {
      fail(`Option --${name} was supplied more than once`);
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

  const directoryOption = command === "pack" ? "output" : "artifacts";
  if (!values.get(directoryOption)) {
    fail(`Option --${directoryOption} is required`);
  }
  let nodeMajor;
  let unitConcurrency = 1;
  if (command === "verify") {
    nodeMajor = Number(values.get("node-major"));
    if (!SUPPORTED_NODE_MAJORS.includes(nodeMajor)) {
      fail(`--node-major must be one of ${SUPPORTED_NODE_MAJORS.join(", ")}`);
    }
    if (values.has("unit-concurrency")) {
      unitConcurrency = Number(values.get("unit-concurrency"));
      if (!Number.isInteger(unitConcurrency) || unitConcurrency < 1) {
        fail("--unit-concurrency must be a positive integer");
      }
    }
  }
  return {
    command,
    directory: path.resolve(values.get(directoryOption)),
    nodeMajor,
    npmCache: values.has("npm-cache")
      ? path.resolve(values.get("npm-cache"))
      : undefined,
    tempRoot: values.has("temp-root")
      ? path.resolve(values.get("temp-root"))
      : undefined,
    unitConcurrency,
  };
}

function createCompatibilityPlan() {
  const records = readWorkspaceRecords(ROOT);
  const workspaces = new Map(
    records.map(({ directory, manifest }) => [
      manifest.name,
      {
        directory: path.join(ROOT, directory),
        packageJson: manifest,
      },
    ]),
  );
  return {
    ...createCompatibilityPlanCore(records, {
      hasUnitFiles: (directory) =>
        existsSync(path.join(ROOT, directory, "test")),
    }),
    records,
    workspaces,
  };
}

function commandFailure(command, args, result) {
  const renderedCommand = [command, ...args].join(" ");
  return [
    `Command failed: ${renderedCommand}`,
    result.status === null || result.status === undefined
      ? ""
      : `Exit status: ${result.status}`,
    result.signal ? `Signal: ${result.signal}` : "",
    result.error ? `Error: ${result.error.message}` : "",
    result.stdout ? `stdout:\n${result.stdout}` : "",
    result.stderr ? `stderr:\n${result.stderr}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function executeCommand(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: MAX_OUTPUT_BYTES,
    timeout: options.timeout ?? CHILD_TIMEOUT_MS,
    ...options,
  });
}

function runCommand(command, args, options = {}) {
  const result = executeCommand(command, args, options);
  if (result.error || result.status !== 0) {
    fail(commandFailure(command, args, result));
  }
  return result;
}

function npmCliPath() {
  const candidates = pairedNpmCliCandidates(
    process.execPath,
    process.platform,
    // biome-ignore lint/suspicious/noUndeclaredEnvVars: This direct compatibility boundary reads a machine-local executable path outside Turbo tasks.
    process.env.CODSEN_NPM_CLI,
  );
  const candidate = candidates.find((filename) => existsSync(filename));
  if (!candidate) {
    fail(
      `Could not find npm paired with ${process.execPath}; checked ${candidates.join(", ")}`,
    );
  }
  return realpathSync(candidate);
}

function runNpm(args, options = {}) {
  return runCommand(process.execPath, [npmCliPath(), ...args], options);
}

function sha256(filename) {
  return createHash("sha256").update(readFileSync(filename)).digest("hex");
}

function ensureEmptyOutputDirectory(directory) {
  if (existsSync(directory)) {
    if (!lstatSync(directory).isDirectory()) {
      fail(`Output path is not a directory: ${directory}`);
    }
    if (readdirSync(directory).length > 0) {
      fail(`Output directory must be empty: ${directory}`);
    }
  } else {
    mkdirSync(directory, { recursive: true });
  }
}

function packCompatibilityArtifacts(outputDirectory) {
  ensureEmptyOutputDirectory(outputDirectory);
  const plan = createCompatibilityPlan();
  const packedPackages = [];
  const npmCache = mkdtempSync(
    path.join(tmpdir(), "codsen-node-compat-pack-cache-"),
  );

  try {
    console.log(
      `Packing all ${plan.packages.length} workspaces in one npm invocation`,
    );
    const result = runNpm(
      [
        "pack",
        "--workspaces",
        "--pack-destination",
        outputDirectory,
        "--ignore-scripts",
        "--json",
      ],
      {
        cwd: ROOT,
        env: compatibilityEnvironment({ npm_config_cache: npmCache }),
        timeout: PACK_TIMEOUT_MS,
      },
    );
    let report;
    try {
      report = JSON.parse(result.stdout);
    } catch (_error) {
      fail("npm pack returned invalid JSON for the workspace batch");
    }
    const orderedEntries = normaliseNpmPackReport(report, plan.packages);
    for (const [index, workspace] of plan.packages.entries()) {
      const entry = orderedEntries[index];
      const filename = entry.filename;
      const absoluteFilename = path.join(outputDirectory, filename);
      if (!existsSync(absoluteFilename)) {
        fail(`npm pack did not create ${absoluteFilename}`);
      }
      packedPackages.push({
        name: workspace.name,
        version: workspace.version,
        engines: workspace.engines,
        nodeFloor: workspace.nodeFloor,
        directory: workspace.directory,
        importable: workspace.importable,
        unitCommand: workspace.unitCommand,
        hasUnitFiles: workspace.hasUnitFiles,
        filename,
        sha256: sha256(absoluteFilename),
      });
    }
  } finally {
    rmSync(npmCache, { recursive: true, force: true });
  }

  const manifest = {
    kind: MANIFEST_KIND,
    schemaVersion: SCHEMA_VERSION,
    packages: packedPackages,
    clis: plan.clis,
  };
  validateCompatibilityManifest(manifest, {
    inspectArtifact: (filename) => {
      const absolute = path.join(outputDirectory, filename);
      if (!existsSync(absolute)) {
        return { exists: false };
      }
      const fileStat = lstatSync(absolute);
      return {
        exists: true,
        isFile: fileStat.isFile(),
        isSymbolicLink: fileStat.isSymbolicLink(),
        sha256: fileStat.isFile() ? sha256(absolute) : undefined,
      };
    },
  });
  writeJson(path.join(outputDirectory, MANIFEST_FILENAME), manifest);
  console.log(
    `Packed all ${manifest.packages.length} workspaces, including ${manifest.clis.length} CLIs, into ${outputDirectory}`,
  );
}

function verifyManifestMatchesCheckout(manifest) {
  const plan = createCompatibilityPlan();
  assertCompatibilityManifestMatchesPlan(manifest, {
    clis: plan.clis,
    packages: plan.packages,
  });
}

function validateManifest(manifest, artifactsDirectory) {
  return validateCompatibilityManifest(manifest, {
    inspectArtifact: (filename) => {
      const absolute = path.join(artifactsDirectory, filename);
      if (!existsSync(absolute)) {
        return { exists: false };
      }
      const fileStat = lstatSync(absolute);
      return {
        exists: true,
        isFile: fileStat.isFile(),
        isSymbolicLink: fileStat.isSymbolicLink(),
        sha256: fileStat.isFile() ? sha256(absolute) : undefined,
      };
    },
  });
}

function compatibilityEnvironment(extra = {}) {
  return {
    ...process.env,
    CI: "true",
    FORCE_COLOR: "0",
    NO_COLOR: "1",
    NO_UPDATE_NOTIFIER: "1",
    UPDATE_NOTIFIER_DISABLED: "1",
    npm_config_audit: "false",
    npm_config_engine_strict: "true",
    npm_config_fund: "false",
    npm_config_ignore_scripts: "true",
    npm_config_update_notifier: "false",
    PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH ?? ""}`,
    ...extra,
  };
}

function barePackageName(specifier) {
  if (
    specifier.startsWith(".") ||
    specifier.startsWith("/") ||
    specifier.startsWith("node:") ||
    builtinModules.includes(specifier)
  ) {
    return null;
  }
  return specifier.startsWith("@")
    ? specifier.split("/").slice(0, 2).join("/")
    : specifier.split("/")[0];
}

function testImportNames(workspaceDirectory) {
  const testDirectory = path.join(workspaceDirectory, "test");
  const names = new Set();
  if (!existsSync(testDirectory)) {
    return names;
  }
  for (const relativeFilename of readdirSync(testDirectory, {
    recursive: true,
  })) {
    if (
      typeof relativeFilename !== "string" ||
      !/\.[cm]?js$/.test(relativeFilename)
    ) {
      continue;
    }
    const source = readFileSync(
      path.join(testDirectory, relativeFilename),
      "utf8",
    );
    for (const line of source.split("\n")) {
      const match =
        line.match(/^\s*import\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/) ??
        line.match(/^\s*}\s*from\s*["']([^"']+)["']/);
      const name = match ? barePackageName(match[1]) : null;
      if (name) {
        names.add(name);
      }
    }
  }
  return names;
}

function uniqueDependencySpec(name, candidates, sourceLabel) {
  const specs = [
    ...new Set(candidates.map(({ spec }) => spec).filter(Boolean)),
  ];
  if (specs.length > 1) {
    fail(
      `${name} has conflicting ${sourceLabel} specs in the eligible unit harness: ${specs.join(", ")}`,
    );
  }
  return specs[0];
}

function resolveTestDependencies(eligiblePackages, workspaces) {
  const eligibleNames = new Set(eligiblePackages.map(({ name }) => name));
  const importedNames = new Set();
  for (const packageArtifact of eligiblePackages) {
    const workspace = workspaces.get(packageArtifact.name);
    for (const name of testImportNames(workspace.directory)) {
      if (!eligibleNames.has(name)) {
        importedNames.add(name);
      }
    }
  }

  const rootPackage = readJson(path.join(ROOT, "package.json"));
  const resolved = new Map();
  for (const name of [...importedNames].sort()) {
    const productionCandidates = [];
    const developmentCandidates = [];
    for (const packageArtifact of eligiblePackages) {
      const packageJson = workspaces.get(packageArtifact.name).packageJson;
      for (const field of PRODUCTION_DEPENDENCY_FIELDS) {
        if (packageJson[field]?.[name]) {
          productionCandidates.push({
            package: packageJson.name,
            spec: packageJson[field][name],
          });
        }
      }
      if (packageJson.devDependencies?.[name]) {
        developmentCandidates.push({
          package: packageJson.name,
          spec: packageJson.devDependencies[name],
        });
      }
    }
    const spec =
      uniqueDependencySpec(name, productionCandidates, "production") ??
      uniqueDependencySpec(name, developmentCandidates, "development") ??
      rootPackage.dependencies?.[name] ??
      rootPackage.devDependencies?.[name];
    if (!spec) {
      fail(`No dependency spec is declared for unit-test import ${name}`);
    }
    resolved.set(name, spec);
  }
  return resolved;
}

function installedPackageDirectory(consumerDirectory, packageName) {
  return path.join(
    consumerDirectory,
    "node_modules",
    ...packageName.split("/"),
  );
}

function packageDirectories(nodeModulesDirectory) {
  if (!existsSync(nodeModulesDirectory)) {
    return [];
  }
  const result = [];
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
          result.push(path.join(entryPath, scopedEntry.name));
        }
      }
    } else if (entry.isDirectory() || entry.isSymbolicLink()) {
      result.push(entryPath);
    }
  }
  return result;
}

function findPackedPackageCopies(consumerDirectory, packedNames) {
  const copies = new Map([...packedNames].map((name) => [name, []]));
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
    for (const packageDirectory of packageDirectories(nodeModulesDirectory)) {
      const packageFilename = path.join(packageDirectory, "package.json");
      if (!existsSync(packageFilename)) {
        continue;
      }
      const packageJson = readJson(packageFilename);
      if (copies.has(packageJson.name)) {
        copies.get(packageJson.name).push({
          directory: realpathSync(packageDirectory),
          version: packageJson.version,
        });
      }
      visit(path.join(packageDirectory, "node_modules"));
    }
  }

  visit(path.join(consumerDirectory, "node_modules"));
  return copies;
}

function verifyInstalledArtifacts(
  consumerDirectory,
  eligiblePackages,
  manifest,
) {
  const artifactsByName = new Map(
    manifest.packages.map((packageArtifact) => [
      packageArtifact.name,
      packageArtifact,
    ]),
  );
  const expectedNames = new Set(
    eligiblePackages.map((packageArtifact) => packageArtifact.name),
  );
  const consumerPackage = readJson(
    path.join(consumerDirectory, "package.json"),
  );
  const packageLock = readJson(
    path.join(consumerDirectory, "package-lock.json"),
  );
  const lockedRoot = packageLock.packages?.[""];
  if (!lockedRoot) {
    fail("npm did not create a root lockfile entry for the unit consumer");
  }

  for (const name of expectedNames) {
    const artifact = artifactsByName.get(name);
    const declared = consumerPackage.dependencies?.[name];
    const locked = lockedRoot.dependencies?.[name];
    for (const [source, spec] of [
      ["package.json", declared],
      ["package-lock.json", locked],
    ]) {
      if (
        typeof spec !== "string" ||
        !spec.startsWith("file:") ||
        !spec.endsWith(artifact.filename)
      ) {
        fail(`${source} does not pin ${name} to ${artifact.filename}`);
      }
    }
  }

  const copies = findPackedPackageCopies(
    consumerDirectory,
    new Set(artifactsByName.keys()),
  );
  for (const [name, found] of copies) {
    const expected = expectedNames.has(name);
    if (!expected && found.length > 0) {
      fail(`The consumer unexpectedly installed workspace package ${name}`);
    }
    if (!expected) {
      continue;
    }
    if (found.length !== 1) {
      fail(
        `The consumer installed ${found.length} copies of ${name}; expected exactly one tarball copy`,
      );
    }
    const artifact = artifactsByName.get(name);
    const expectedDirectory = realpathSync(
      installedPackageDirectory(consumerDirectory, name),
    );
    if (
      found[0].directory !== expectedDirectory ||
      found[0].version !== artifact.version
    ) {
      fail(
        `The consumer did not install current ${name}@${artifact.version} at its root`,
      );
    }
  }
}

function importInstalledPackages(consumerDirectory, eligiblePackages) {
  const importableNames = eligiblePackages
    .filter(({ importable }) => importable)
    .map(({ name }) => name);
  const script = `for (const packageName of ${JSON.stringify(importableNames)}) {
  try {
    await import(packageName);
    console.log(\`imported \${packageName}\`);
  } catch (error) {
    throw new Error(\`Could not import \${packageName}: \${error.stack ?? error.message}\`);
  }
}`;
  runCommand(process.execPath, ["--input-type=module", "--eval", script], {
    cwd: consumerDirectory,
    env: compatibilityEnvironment(),
  });
}

function runInstalledBinary(consumerDirectory, alias, args, cwd) {
  const invocation = installedPackageBinInvocation({
    alias,
    args,
    consumerDirectory,
  });
  if (!existsSync(invocation.filename)) {
    fail(`npm did not install bin alias ${alias}`);
  }
  return runCommand(invocation.command, invocation.args, {
    cwd,
    env: compatibilityEnvironment(),
    shell: invocation.shell,
  });
}

function assertIncludes(haystack, needle, message) {
  if (!haystack.includes(needle)) {
    fail(message);
  }
}

function runMetadataSmokes(consumerDirectory, cli) {
  const cwd = path.join(
    consumerDirectory,
    "cli smokes",
    cli.name.replaceAll("/", "-"),
    "metadata checks",
  );
  mkdirSync(cwd, { recursive: true });
  for (const alias of Object.keys(cli.bins)) {
    const help = runInstalledBinary(consumerDirectory, alias, ["--help"], cwd);
    if (!/(usage|options|help|call)/i.test(`${help.stdout}\n${help.stderr}`)) {
      fail(`${cli.name} bin alias ${alias} returned no recognisable help text`);
    }
    const version = runInstalledBinary(
      consumerDirectory,
      alias,
      ["--version"],
      cwd,
    );
    assertIncludes(
      `${version.stdout}\n${version.stderr}`,
      cli.version,
      `${cli.name} bin alias ${alias} did not report version ${cli.version}`,
    );
  }
}

function runRegisteredFunctionalSmoke(consumerDirectory, cli) {
  runFunctionalCliSmoke({
    cli,
    consumerDirectory,
    runBinary: ({ alias, args, cwd }) =>
      runInstalledBinary(consumerDirectory, alias, args, cwd),
  });
}

function runCodsenGlobSmoke(consumerDirectory) {
  const cwd = path.join(
    consumerDirectory,
    "library smokes",
    "codsen glob",
    "fixture root",
  );
  const nestedDirectory = path.join(cwd, "level one", "level two");
  mkdirSync(nestedDirectory, { recursive: true });
  writeFileSync(path.join(nestedDirectory, "keep file.js"), "export {};\n");
  writeFileSync(path.join(nestedDirectory, "ignore file.js"), "export {};\n");

  const script = `import assert from "node:assert/strict";
import path from "node:path";
import { glob, globSync } from "codsen-glob";

const relativePattern = path.join("level one", "**", "*.js");
const relativeIgnore = path.join("level one", "**", "ignore *.js");
const relativeExpected = ["level one/level two/keep file.js"];
assert.deepEqual(await glob(relativePattern, { cwd: process.cwd(), ignore: relativeIgnore }), relativeExpected);
assert.deepEqual(globSync(relativePattern, { cwd: process.cwd(), ignore: relativeIgnore }), relativeExpected);
const relativeSingleStarPattern = path.join("level one", "level two", "*.js");
const relativeSingleStarIgnore = path.join("level one", "level two", "ignore *.js");
assert.deepEqual(await glob(relativeSingleStarPattern, { cwd: process.cwd(), ignore: relativeSingleStarIgnore }), relativeExpected);
assert.deepEqual(globSync(relativeSingleStarPattern, { cwd: process.cwd(), ignore: relativeSingleStarIgnore }), relativeExpected);

const absolutePattern = path.join(process.cwd(), "level one", "**", "*.js");
const absoluteIgnore = path.join(process.cwd(), "level one", "**", "ignore *.js");
const absoluteExpected = [path.join(process.cwd(), "level one", "level two", "keep file.js")];
assert.deepEqual(await glob(absolutePattern, { ignore: absoluteIgnore }), absoluteExpected);
assert.deepEqual(globSync(absolutePattern, { ignore: absoluteIgnore }), absoluteExpected);
const absoluteSingleStarPattern = path.join(process.cwd(), "level one", "level two", "*.js");
const absoluteSingleStarIgnore = path.join(process.cwd(), "level one", "level two", "ignore *.js");
assert.deepEqual(await glob(absoluteSingleStarPattern, { ignore: absoluteSingleStarIgnore }), absoluteExpected);
assert.deepEqual(globSync(absoluteSingleStarPattern, { ignore: absoluteSingleStarIgnore }), absoluteExpected);
console.log("codsen-glob packed-artifact smoke passed");`;
  runCommand(process.execPath, ["--input-type=module", "--eval", script], {
    cwd,
    env: compatibilityEnvironment(),
  });
}

function copyWorkspaceForUnits(consumerDirectory, packageArtifact) {
  const sourceDirectory = path.join(ROOT, packageArtifact.directory);
  const targetDirectory = path.join(
    consumerDirectory,
    packageArtifact.directory,
  );
  cpSync(sourceDirectory, targetDirectory, {
    recursive: true,
    filter(source) {
      const relative = path.relative(sourceDirectory, source);
      if (!relative) {
        return true;
      }
      return !COPY_EXCLUSIONS.has(relative.split(path.sep)[0]);
    },
  });

  const installedDirectory = installedPackageDirectory(
    consumerDirectory,
    packageArtifact.name,
  );
  for (const generatedDirectory of ["dist", "types"]) {
    const installedGeneratedDirectory = path.join(
      installedDirectory,
      generatedDirectory,
    );
    if (existsSync(installedGeneratedDirectory)) {
      symlinkSync(
        installedGeneratedDirectory,
        path.join(targetDirectory, generatedDirectory),
        "dir",
      );
    }
  }
}

function prepareUnitMirror(consumerDirectory, eligiblePackages) {
  for (const packageArtifact of eligiblePackages) {
    copyWorkspaceForUnits(consumerDirectory, packageArtifact);
  }
  cpSync(
    path.join(ROOT, "ops", "helpers"),
    path.join(consumerDirectory, "ops", "helpers"),
    {
      recursive: true,
      filter(source) {
        return !source.split(path.sep).includes("node_modules");
      },
    },
  );
}

function outputTail(value, maximumCharacters = 6_000) {
  if (typeof value !== "string" || !value) {
    return "";
  }
  return value.length > maximumCharacters
    ? `[...truncated...]\n${value.slice(-maximumCharacters)}`
    : value;
}

function printFailedUnitResults(report) {
  for (const packageReport of report?.packages ?? []) {
    const result = packageReport.result;
    if (!result || result.status === "passed") {
      continue;
    }
    console.error(
      `\n${packageReport.name}: ${result.status}${result.signal ? ` (${result.signal})` : ""}`,
    );
    if (result.error) {
      console.error(result.error);
    }
    const stdout = outputTail(result.stdout);
    const stderr = outputTail(result.stderr);
    if (stdout) {
      console.error(`stdout tail:\n${stdout}`);
    }
    if (stderr) {
      console.error(`stderr tail:\n${stderr}`);
    }
  }
}

function runEligibleUnitSuites(
  consumerDirectory,
  eligiblePackages,
  nodeMajor,
  unitConcurrency,
) {
  const reportFilename = path.join(
    consumerDirectory,
    `node-${nodeMajor}-unit-report.json`,
  );
  const args = [
    path.join(ROOT, "ops", "scripts", "audit-package-units.js"),
    "--node",
    process.execPath,
    "--unit-root",
    consumerDirectory,
    "--output",
    reportFilename,
    "--timeout",
    String(UNIT_TIMEOUT_MS),
    "--concurrency",
    String(unitConcurrency),
  ];
  for (const packageArtifact of eligiblePackages) {
    args.push("--package", packageArtifact.name);
  }
  const result = executeCommand(process.execPath, args, {
    cwd: consumerDirectory,
    env: compatibilityEnvironment(),
    timeout: 60 * 60_000,
  });
  let report;
  if (existsSync(reportFilename)) {
    report = readJson(reportFilename);
    printFailedUnitResults(report);
  }
  if (result.error || result.status !== 0) {
    fail(commandFailure(process.execPath, args, result));
  }
  if (!report) {
    fail(`Unit runner created no report at ${reportFilename}`);
  }
  if (
    report.summary.total !== eligiblePackages.length ||
    report.summary.passed !== eligiblePackages.length
  ) {
    fail(
      `Node ${nodeMajor} unit report passed ${report.summary.passed}/${eligiblePackages.length}`,
    );
  }
}

function installAndVerifyPackages(
  artifactsDirectory,
  eligiblePackages,
  eligibleClis,
  manifest,
  workspaces,
  nodeMajor,
  npmCache,
  unitConcurrency,
  suppliedTempRoot,
) {
  const consumerRoot = suppliedTempRoot
    ? path.resolve(suppliedTempRoot)
    : tmpdir();
  if (suppliedTempRoot) {
    mkdirSync(consumerRoot, { recursive: true });
  }
  const consumerDirectory = mkdtempSync(
    path.join(consumerRoot, `codsen-node-${nodeMajor}-packages-`),
  );
  let succeeded = false;
  try {
    writeJson(path.join(consumerDirectory, "package.json"), {
      name: `codsen-node-${nodeMajor}-compatibility-consumer`,
      version: "1.0.0",
      private: true,
      type: "module",
    });
    const tarballs = eligiblePackages.map((artifact) =>
      path.join(artifactsDirectory, artifact.filename),
    );
    const testDependencies = resolveTestDependencies(
      eligiblePackages,
      workspaces,
    );
    const testDependencyArguments = [...testDependencies].map(
      ([name, spec]) => `${name}@${spec}`,
    );

    console.log(
      `Installing ${eligiblePackages.length} Node ${nodeMajor} package artifacts and ${testDependencies.size} unit dependencies`,
    );
    runNpm(
      [
        "install",
        "--engine-strict",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        "--omit=dev",
        ...tarballs,
        ...testDependencyArguments,
      ],
      {
        cwd: consumerDirectory,
        env: compatibilityEnvironment({ npm_config_cache: npmCache }),
        timeout: INSTALL_TIMEOUT_MS,
      },
    );
    verifyInstalledArtifacts(consumerDirectory, eligiblePackages, manifest);
    importInstalledPackages(consumerDirectory, eligiblePackages);
    for (const cli of eligibleClis) {
      runMetadataSmokes(consumerDirectory, cli);
      runRegisteredFunctionalSmoke(consumerDirectory, cli);
    }
    prepareUnitMirror(consumerDirectory, eligiblePackages);
    runEligibleUnitSuites(
      consumerDirectory,
      eligiblePackages,
      nodeMajor,
      unitConcurrency,
    );
    succeeded = true;
    console.log(
      `Verified all ${eligiblePackages.length} eligible packages on Node ${nodeMajor}`,
    );
  } finally {
    if (succeeded) {
      rmSync(consumerDirectory, { recursive: true, force: true });
    } else {
      console.error(`Preserved failing consumer at ${consumerDirectory}`);
    }
  }
}

function installAndSmokePackages(
  artifactsDirectory,
  smokePackages,
  manifest,
  npmCache,
  suppliedTempRoot,
) {
  const consumerRoot = suppliedTempRoot
    ? path.resolve(suppliedTempRoot)
    : tmpdir();
  if (suppliedTempRoot) {
    mkdirSync(consumerRoot, { recursive: true });
  }
  const consumerDirectory = mkdtempSync(
    path.join(consumerRoot, "codsen windows smoke packages -"),
  );
  let succeeded = false;
  try {
    writeJson(path.join(consumerDirectory, "package.json"), {
      name: "codsen-windows-smoke-consumer",
      version: "1.0.0",
      private: true,
      type: "module",
    });
    const tarballs = smokePackages.map((artifact) =>
      path.join(artifactsDirectory, artifact.filename),
    );
    console.log(
      `Installing ${smokePackages.length} CLI and codsen-glob runtime-closure artifacts`,
    );
    runNpm(
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
        env: compatibilityEnvironment({ npm_config_cache: npmCache }),
        timeout: INSTALL_TIMEOUT_MS,
      },
    );
    verifyInstalledArtifacts(consumerDirectory, smokePackages, manifest);
    for (const cli of manifest.clis) {
      runMetadataSmokes(consumerDirectory, cli);
      runRegisteredFunctionalSmoke(consumerDirectory, cli);
    }
    runCodsenGlobSmoke(consumerDirectory);
    succeeded = true;
    console.log(
      `Verified ${manifest.clis.length} packed CLIs and codsen-glob in ${consumerDirectory}`,
    );
  } finally {
    if (succeeded) {
      rmSync(consumerDirectory, { recursive: true, force: true });
    } else {
      console.error(`Preserved failing consumer at ${consumerDirectory}`);
    }
  }
}

function smokeCompatibilityArtifacts(
  artifactsDirectory,
  suppliedNpmCache,
  suppliedTempRoot,
) {
  const npmVersion = runNpm(["--version"], {
    env: compatibilityEnvironment(),
  }).stdout.trim();
  const manifestFilename = path.join(artifactsDirectory, MANIFEST_FILENAME);
  if (!existsSync(manifestFilename)) {
    fail(`Missing compatibility manifest: ${manifestFilename}`);
  }
  const manifest = readJson(manifestFilename);
  validateManifest(manifest, artifactsDirectory);
  verifyManifestMatchesCheckout(manifest);
  assertFunctionalCliSmokeInventory(manifest.clis);

  const plan = createCompatibilityPlan();
  const seedNames = [
    ...new Set(["codsen-glob", ...manifest.clis.map((cli) => cli.name)]),
  ].sort();
  const closureNames = runtimeDependencyClosureNames(plan.records, seedNames);
  const closureSet = new Set(closureNames);
  const smokePackages = manifest.packages.filter(({ name }) =>
    closureSet.has(name),
  );
  if (smokePackages.length !== closureNames.length) {
    const selectedNames = new Set(smokePackages.map(({ name }) => name));
    fail(
      `Compatibility manifest is missing smoke closure packages: ${closureNames
        .filter((name) => !selectedNames.has(name))
        .join(", ")}`,
    );
  }

  const ownsNpmCache = !suppliedNpmCache;
  const npmCache = suppliedNpmCache
    ? path.resolve(suppliedNpmCache)
    : mkdtempSync(path.join(tmpdir(), "codsen-windows-smoke-cache-"));
  if (suppliedNpmCache) {
    mkdirSync(npmCache, { recursive: true });
  }
  try {
    installAndSmokePackages(
      artifactsDirectory,
      smokePackages,
      manifest,
      npmCache,
      suppliedTempRoot,
    );
  } finally {
    if (ownsNpmCache) {
      rmSync(npmCache, { recursive: true, force: true });
    }
  }
  console.log(
    `Node ${process.versions.node}/npm ${npmVersion}: ${smokePackages.length} runtime-closure packages, ${manifest.clis.length} CLIs and codsen-glob passed smoke verification`,
  );
}

function verifyCompatibilityArtifacts(
  artifactsDirectory,
  nodeMajor,
  suppliedNpmCache,
  unitConcurrency,
  suppliedTempRoot,
) {
  assertCanonicalNodeVersion(nodeMajor, process.versions.node);
  const npmVersion = runNpm(["--version"], {
    env: compatibilityEnvironment(),
  }).stdout.trim();

  const manifestFilename = path.join(artifactsDirectory, MANIFEST_FILENAME);
  if (!existsSync(manifestFilename)) {
    fail(`Missing compatibility manifest: ${manifestFilename}`);
  }
  const manifest = readJson(manifestFilename);
  validateManifest(manifest, artifactsDirectory);
  verifyManifestMatchesCheckout(manifest);
  const plan = createCompatibilityPlan();

  assertFunctionalCliSmokeInventory(manifest.clis);

  const eligiblePackages = manifest.packages.filter(
    ({ nodeFloor }) => nodeFloor <= nodeMajor,
  );
  const eligibleNames = new Set(
    eligiblePackages.map((packageArtifact) => packageArtifact.name),
  );
  const eligibleClis = manifest.clis.filter((cli) =>
    eligibleNames.has(cli.name),
  );
  if (eligiblePackages.length === 0) {
    fail(`No packages declare support for Node ${nodeMajor}`);
  }

  const ownsNpmCache = !suppliedNpmCache;
  const npmCache = suppliedNpmCache
    ? path.resolve(suppliedNpmCache)
    : mkdtempSync(
        path.join(tmpdir(), `codsen-node-${nodeMajor}-verify-cache-`),
      );
  if (suppliedNpmCache) {
    mkdirSync(npmCache, { recursive: true });
  }
  try {
    installAndVerifyPackages(
      artifactsDirectory,
      eligiblePackages,
      eligibleClis,
      manifest,
      plan.workspaces,
      nodeMajor,
      npmCache,
      unitConcurrency,
      suppliedTempRoot,
    );
  } finally {
    if (ownsNpmCache) {
      rmSync(npmCache, { recursive: true, force: true });
    }
  }
  console.log(
    `Node ${process.versions.node}/npm ${npmVersion}: ${eligiblePackages.length} package installs, imports, CLI smokes and actual unit suites passed`,
  );
}

function main() {
  const { command, directory, nodeMajor, npmCache, tempRoot, unitConcurrency } =
    parseArguments(process.argv.slice(2));
  if (command === "pack") {
    packCompatibilityArtifacts(directory);
  } else if (command === "smoke") {
    smokeCompatibilityArtifacts(directory, npmCache, tempRoot);
  } else {
    verifyCompatibilityArtifacts(
      directory,
      nodeMajor,
      npmCache,
      unitConcurrency,
      tempRoot,
    );
  }
}

try {
  main();
} catch (error) {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
}
