import { spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match, ok } from "uvu/assert";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const sourceReleaseCli = path.join(
  repositoryRoot,
  "ops/scripts/npm-release.js",
);
const typescript = path.join(repositoryRoot, "node_modules/typescript/bin/tsc");
const helperFiles = [
  "declarationDependencyResolution.js",
  "nodeEngine.js",
  "nodeProcessInvocation.js",
  "npmPackagePayload.js",
  "npmReleasePlan.js",
  "npmReleaseRegistry.js",
  "npmReleaseConsumer.js",
  "packedArtifactCliSmokes.js",
  "releaseReproducibility.js",
  "workspaceInventory.js",
  "workspaceInventoryFile.js",
];

function writeJson(filename, value) {
  mkdirSync(path.dirname(filename), { recursive: true });
  writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`);
}

function run(command, arguments_, options = {}) {
  const result = spawnSync(command, arguments_, {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    ...options,
  });
  if (result.error || result.status !== 0) {
    throw new Error(
      [
        `Command failed: ${command} ${arguments_.join(" ")}`,
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

function git(root, ...arguments_) {
  return run("git", arguments_, { cwd: root }).stdout.trim();
}

function cli(root, ...arguments_) {
  const environment = {
    ...process.env,
    npm_config_cache: path.join(path.dirname(root), "npm cache"),
  };
  delete environment.FORCE_COLOR;
  // The fixture is a standalone repository, so the ambient workflow variables
  // describe a foreign checkout; GITHUB_SHA in particular would pin the CLI to
  // a commit this repository does not contain. Re-point it at the fixture HEAD
  // so the pack head binding is exercised instead of merely bypassed.
  for (const key of Object.keys(environment)) {
    if (key.startsWith("GITHUB_")) {
      delete environment[key];
    }
  }
  environment.GITHUB_SHA = git(root, "rev-parse", "HEAD");
  return run(
    process.execPath,
    [path.join(root, "ops/scripts/npm-release.js"), ...arguments_],
    {
      cwd: root,
      env: environment,
    },
  );
}

test("01 - real CLI plans, summarizes, packs, and reproduces offline", () => {
  const temporaryRoot = mkdtempSync(path.join(tmpdir(), "npm-release-cli-"));
  const fixtureRoot = path.join(temporaryRoot, "fixture repository");
  const packageDirectory = path.join(fixtureRoot, "packages/example");
  const dependencyDirectory = path.join(
    fixtureRoot,
    "packages/fixture-dependency",
  );
  const planFile = path.join(fixtureRoot, ".github/npm-release-plan.json");
  const summaryFile = path.join(temporaryRoot, "summary.md");
  const firstArtifacts = path.join(temporaryRoot, "first artifacts");
  const secondArtifacts = path.join(temporaryRoot, "second artifacts");
  try {
    mkdirSync(path.join(packageDirectory, "dist"), { recursive: true });
    mkdirSync(path.join(packageDirectory, "types"), { recursive: true });
    mkdirSync(path.join(packageDirectory, ".turbo"), { recursive: true });
    mkdirSync(path.join(packageDirectory, "coverage"), { recursive: true });
    mkdirSync(path.join(packageDirectory, "test"), { recursive: true });
    mkdirSync(path.join(dependencyDirectory, "dist"), { recursive: true });
    mkdirSync(path.join(dependencyDirectory, "types"), { recursive: true });
    mkdirSync(path.join(fixtureRoot, "ops/helpers"), { recursive: true });
    mkdirSync(path.join(fixtureRoot, "ops/scripts"), { recursive: true });
    cpSync(
      sourceReleaseCli,
      path.join(fixtureRoot, "ops/scripts/npm-release.js"),
    );
    for (const filename of helperFiles) {
      cpSync(
        path.join(repositoryRoot, "ops/helpers", filename),
        path.join(fixtureRoot, "ops/helpers", filename),
      );
    }
    writeJson(path.join(fixtureRoot, "package.json"), {
      name: "release-fixture",
      private: true,
      type: "module",
      version: "0.0.0",
      workspaces: ["packages/*", "data"],
    });
    writeJson(path.join(fixtureRoot, "lerna.json"), {
      packages: ["packages/*", "data"],
      version: "independent",
    });
    writeJson(path.join(fixtureRoot, "data/package.json"), {
      name: "@codsen/data",
      private: true,
      version: "1.0.0",
    });
    writeJson(path.join(packageDirectory, "package.json"), {
      dependencies: { "json-sort-cli": "^1.0.0" },
      exports: {
        default: "./dist/index.js",
        types: "./types/index.d.ts",
      },
      name: "release-fixture-package",
      type: "module",
      types: "./types/index.d.ts",
      version: "1.0.0",
    });
    writeFileSync(
      path.join(packageDirectory, "dist/index.js"),
      'import { dependency } from "json-sort-cli";\nexport const fixture = dependency;\n',
    );
    writeFileSync(
      path.join(packageDirectory, "types/index.d.ts"),
      'export type { FixtureDependency } from "json-sort-cli";\nexport declare const fixture: true;\n',
    );
    writeFileSync(path.join(packageDirectory, ".turbo/cache"), "debris\n");
    writeFileSync(path.join(packageDirectory, "coverage/report.json"), "{}\n");
    writeFileSync(path.join(packageDirectory, "test/basic.js"), "throw 1;\n");
    writeJson(path.join(dependencyDirectory, "package.json"), {
      bin: { jsonsort: "cli.js" },
      exports: {
        default: "./dist/index.js",
        types: "./types/index.d.ts",
      },
      name: "json-sort-cli",
      type: "module",
      types: "./types/index.d.ts",
      version: "1.0.0",
    });
    writeFileSync(
      path.join(dependencyDirectory, "cli.js"),
      `#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
if (process.argv.includes("--version")) {
  console.log(manifest.version);
} else if (process.argv.includes("--help")) {
  console.log("Usage: jsonsort [options] file.json");
} else if (process.argv.length === 2) {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const sorted = Object.fromEntries(Object.entries(input).sort(([left], [right]) => left.localeCompare(right)));
  console.log(JSON.stringify(sorted, null, 2));
} else {
  const filename = process.argv.at(-1);
  const input = JSON.parse(readFileSync(filename, "utf8"));
  const sorted = Object.fromEntries(Object.entries(input).sort(([left], [right]) => left.localeCompare(right)));
  writeFileSync(filename, JSON.stringify(sorted, null, 2));
}
`,
    );
    chmodSync(path.join(dependencyDirectory, "cli.js"), 0o755);
    writeFileSync(
      path.join(dependencyDirectory, "dist/index.js"),
      "export const dependency = true;\n",
    );
    writeFileSync(
      path.join(dependencyDirectory, "types/index.d.ts"),
      "export type FixtureDependency = true;\nexport declare const dependency: true;\n",
    );
    git(fixtureRoot, "init", "--initial-branch=main");
    git(fixtureRoot, "config", "user.email", "fixture@example.com");
    git(fixtureRoot, "config", "user.name", "Release Fixture");
    git(fixtureRoot, "add", ".");
    git(fixtureRoot, "commit", "--message", "base");
    const baseSha = git(fixtureRoot, "rev-parse", "HEAD");

    writeJson(path.join(packageDirectory, "package.json"), {
      dependencies: { "json-sort-cli": "^1.0.0" },
      exports: {
        default: "./dist/index.js",
        types: "./types/index.d.ts",
      },
      name: "release-fixture-package",
      type: "module",
      types: "./types/index.d.ts",
      version: "1.0.1",
    });
    writeJson(path.join(dependencyDirectory, "package.json"), {
      bin: { jsonsort: "cli.js" },
      exports: {
        default: "./dist/index.js",
        types: "./types/index.d.ts",
      },
      name: "json-sort-cli",
      type: "module",
      types: "./types/index.d.ts",
      version: "1.0.1",
    });
    const planResult = cli(
      fixtureRoot,
      "plan",
      "--base",
      baseSha,
      "--output",
      planFile,
    );
    match(planResult.stdout, /Planned 2 package/, "01.01");
    const plan = JSON.parse(readFileSync(planFile, "utf8"));
    equal(
      plan.layers,
      [["json-sort-cli"], ["release-fixture-package"]],
      "01.02",
    );
    equal(
      plan.packages.find(({ name }) => name === "release-fixture-package")
        .version,
      "1.0.1",
      "01.03",
    );

    git(
      fixtureRoot,
      "add",
      ".github",
      "packages/example/package.json",
      "packages/fixture-dependency/package.json",
    );
    git(fixtureRoot, "commit", "--message", "prepare release");
    const summaryResult = cli(
      fixtureRoot,
      "summary",
      "--plan",
      planFile,
      "--output",
      summaryFile,
    );
    match(summaryResult.stdout, /Rendered 2 package bump/, "01.04");
    match(readFileSync(summaryFile, "utf8"), /\*\*patch\*\*/, "01.05");

    const packResult = cli(
      fixtureRoot,
      "pack",
      "--plan",
      planFile,
      "--output",
      firstArtifacts,
    );
    match(packResult.stdout, /Packed release-fixture-package@1\.0\.1/, "01.06");
    const firstManifest = JSON.parse(
      readFileSync(path.join(firstArtifacts, "manifest.json"), "utf8"),
    );
    equal(firstManifest.packageCount, 2, "01.07");
    ok(
      firstManifest.packages.every(({ tarball }) =>
        tarball.file.endsWith(".tgz"),
      ),
      "01.08",
    );
    const fixtureTarball = firstManifest.packages.find(
      ({ name }) => name === "release-fixture-package",
    ).tarball.file;
    const packedFiles = run(
      "tar",
      ["--list", "--gzip", "--file", path.join(firstArtifacts, fixtureTarball)],
      { cwd: fixtureRoot },
    ).stdout.split(/\r?\n/);
    equal(
      packedFiles.some((filename) =>
        /package\/(?:\.turbo|coverage|test)(?:\/|$)/.test(filename),
      ),
      false,
      "01.09",
    );

    const referenceResult = cli(
      fixtureRoot,
      "pack",
      "--plan",
      planFile,
      "--output",
      secondArtifacts,
      "--reference",
      path.join(firstArtifacts, "manifest.json"),
    );
    match(
      referenceResult.stdout,
      /Verified reproducible release artifacts/,
      "01.10",
    );
    equal(
      JSON.parse(
        readFileSync(path.join(secondArtifacts, "manifest.json"), "utf8"),
      ).packages,
      firstManifest.packages,
      "01.11",
    );

    const consumerResult = cli(
      fixtureRoot,
      "verify-consumers",
      "--manifest",
      path.join(firstArtifacts, "manifest.json"),
      "--typescript",
      typescript,
      "--concurrency",
      "1",
    );
    match(
      consumerResult.stdout,
      /Verified 2 exact publish-shaped tarball consumer\(s\), including 2 strict declaration compilation\(s\)/,
      "01.12",
    );
  } finally {
    rmSync(temporaryRoot, { force: true, recursive: true });
  }
});

test.run();
