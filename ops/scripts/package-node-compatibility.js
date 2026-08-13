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
import { supportedNodeMajors } from "../helpers/nodeCompatibility.js";
import {
  assertCompatibilityManifestMatchesPlan,
  COMPATIBILITY_MANIFEST_KIND,
  COMPATIBILITY_SCHEMA_VERSION,
  createCompatibilityPlan as createCompatibilityPlanCore,
  safeTarballFilename,
  validateCompatibilityManifest,
} from "../helpers/packageNodeCompatibility.js";
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

Verify options:
  --npm-cache <directory>  Reuse an npm cache owned by the caller
  --temp-root <directory>  Place the isolated consumer under this directory
  --unit-concurrency <n>   Maximum simultaneous unit suites (default: 1)

The pack command runs once after the root-supported build. Verification runs in
an isolated consumer on each of Node ${SUPPORTED_NODE_MAJORS.join(", ")}, selecting every
workspace whose declared Node floor is at or below that major.`);
}

function parseArguments(argv) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    process.exit(argv.length === 0 ? 1 : 0);
  }

  const command = argv[0];
  if (!new Set(["pack", "verify"]).has(command)) {
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
    const allowed =
      command === "pack"
        ? new Set(["output"])
        : new Set([
            "artifacts",
            "node-major",
            "npm-cache",
            "temp-root",
            "unit-concurrency",
          ]);
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
  const candidate = path.resolve(
    path.dirname(process.execPath),
    "../lib/node_modules/npm/bin/npm-cli.js",
  );
  if (!existsSync(candidate)) {
    fail(`Could not find npm paired with ${process.execPath}`);
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
    for (const workspace of plan.packages) {
      console.log(`Packing ${workspace.name}@${workspace.version}`);
      const result = runNpm(
        [
          "pack",
          path.join(ROOT, workspace.directory),
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
        fail(`npm pack returned invalid JSON for ${workspace.name}`);
      }
      if (!Array.isArray(report) || report.length !== 1) {
        fail(`npm pack returned an unexpected report for ${workspace.name}`);
      }
      const entry = report[0];
      if (
        entry.name !== workspace.name ||
        entry.version !== workspace.version
      ) {
        fail(
          `npm pack reported ${entry.name}@${entry.version}, expected ${workspace.name}@${workspace.version}`,
        );
      }
      if (!safeTarballFilename(entry.filename)) {
        fail(
          `npm pack returned an unsafe tarball filename for ${workspace.name}`,
        );
      }
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

function stableJson(value) {
  return JSON.stringify(value);
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
  if (path.basename(alias) !== alias) {
    fail(`Unsafe bin alias: ${alias}`);
  }
  const binary = path.join(consumerDirectory, "node_modules", ".bin", alias);
  if (!existsSync(binary)) {
    fail(`npm did not install bin alias ${alias}`);
  }
  return runCommand(binary, args, {
    cwd,
    env: compatibilityEnvironment(),
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
    "cli-smokes",
    cli.name.replaceAll("/", "-"),
    "metadata",
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

const SMOKE_TESTS = {
  codsen({ run }) {
    const result = run([]);
    assertIncludes(
      result.stdout,
      "C O D S E N",
      "codsen did not start normally",
    );
  },

  "csv-sort-cli"({ cwd, run }) {
    const original = `Acc Number,Description,Debit Amount,Credit Amount,Balance,
123456,Client payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`;
    writeFileSync(path.join(cwd, "input.csv"), original);
    run(["input.csv"]);
    const output = readFileSync(path.join(cwd, "input-1.csv"), "utf8");
    if (output.indexOf("Bought table") > output.indexOf("Bought carpet")) {
      fail("csv-sort-cli did not sort the fixture");
    }
  },

  "email-all-chars-within-ascii-cli"({ cwd, run }) {
    writeFileSync(path.join(cwd, "healthy.html"), "<p>ASCII only</p>\n");
    const result = run(["healthy.html"]);
    assertIncludes(
      result.stdout,
      "ALL OK",
      "ASCII checker rejected ASCII input",
    );
  },

  "generate-atomic-css-cli"({ cwd, run }) {
    const fixture = `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pt$$$ { padding-top: $$$px !important; } | 0 | 2 |
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
old
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`;
    const filename = path.join(cwd, "index.html");
    writeFileSync(filename, fixture);
    run(["index.html"]);
    assertIncludes(
      readFileSync(filename, "utf8"),
      ".pt2 { padding-top: 2px !important; }",
      "generate-atomic-css-cli did not generate the fixture classes",
    );
  },

  "js-row-num-cli"({ cwd, run }) {
    const filename = path.join(cwd, "sample.js");
    writeFileSync(
      filename,
      "console.log('999 first');\nconsole.log('999 second');\n",
    );
    run(["sample.js"]);
    const output = readFileSync(filename, "utf8");
    assertIncludes(output, "001 first", "js-row-num-cli missed row one");
    assertIncludes(output, "002 second", "js-row-num-cli missed row two");
  },

  "json-comb"({ cwd, run }) {
    writeJson(path.join(cwd, "first.json"), { a: "one" });
    writeJson(path.join(cwd, "second.json"), { b: "two" });
    run(["--normalise", "first.json", "second.json"]);
    for (const filename of ["first.json", "second.json"]) {
      const keys = Object.keys(readJson(path.join(cwd, filename))).sort();
      if (stableJson(keys) !== stableJson(["a", "b"])) {
        fail(`json-comb did not normalise ${filename}`);
      }
    }
  },

  "json-sort-cli"({ cwd, run }) {
    const filename = path.join(cwd, "sort-me.json");
    writeFileSync(filename, '{"z":1,"a":2}\n');
    run(["sort-me.json"]);
    const output = readFileSync(filename, "utf8");
    if (output.indexOf('"a"') > output.indexOf('"z"')) {
      fail("json-sort-cli did not sort the fixture keys");
    }
  },

  "lerna-clean-changelogs-cli"({ cwd, run }) {
    const filename = path.join(cwd, "changelog.md");
    const fixture = `# Change Log

## 2.0.1 (2020-01-02)

**Note:** Version bump only for package fixture

## 2.0.0 (2020-01-01)

### Features

- useful change
`;
    writeFileSync(filename, fixture);
    run(["changelog.md"]);
    const output = readFileSync(filename, "utf8");
    if (output === fixture || output.includes("Version bump only")) {
      fail("lerna-clean-changelogs-cli did not clean the fixture");
    }
  },

  "update-versions"({ cwd, run }) {
    const filename = path.join(cwd, "package.json");
    const fixture = {
      name: "update-versions-node18-smoke",
      version: "1.0.0",
      private: true,
    };
    writeJson(filename, fixture);
    run([]);
    if (stableJson(readJson(filename)) !== stableJson(fixture)) {
      fail("update-versions changed a dependency-free package.json fixture");
    }
  },
};

function runFunctionalSmoke(consumerDirectory, cli) {
  const smokeTest = SMOKE_TESTS[cli.name];
  if (!smokeTest) {
    fail(
      `No meaningful packed-artifact smoke test is registered for ${cli.name}`,
    );
  }
  const cwd = path.join(
    consumerDirectory,
    "cli-smokes",
    cli.name.replaceAll("/", "-"),
    "functional",
  );
  mkdirSync(cwd, { recursive: true });
  const alias = Object.keys(cli.bins)[0];
  smokeTest({
    cwd,
    run(args) {
      return runInstalledBinary(consumerDirectory, alias, args, cwd);
    },
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
      runFunctionalSmoke(consumerDirectory, cli);
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

  const registeredSmokes = Object.keys(SMOKE_TESTS).sort();
  const discoveredClis = manifest.clis.map((cli) => cli.name).sort();
  if (stableJson(registeredSmokes) !== stableJson(discoveredClis)) {
    fail(
      "Meaningful smoke-test registrations do not match the discovered CLIs",
    );
  }

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
