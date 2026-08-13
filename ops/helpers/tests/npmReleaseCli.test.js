import { spawnSync } from "node:child_process";
import {
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
const helperFiles = [
  "npmPackagePayload.js",
  "npmReleasePlan.js",
  "npmReleaseRegistry.js",
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
  const planFile = path.join(fixtureRoot, ".github/npm-release-plan.json");
  const summaryFile = path.join(temporaryRoot, "summary.md");
  const firstArtifacts = path.join(temporaryRoot, "first artifacts");
  const secondArtifacts = path.join(temporaryRoot, "second artifacts");
  try {
    mkdirSync(path.join(packageDirectory, "dist"), { recursive: true });
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
      exports: "./dist/index.js",
      name: "release-fixture-package",
      type: "module",
      version: "1.0.0",
    });
    writeFileSync(
      path.join(packageDirectory, "dist/index.js"),
      "export const fixture = true;\n",
    );
    git(fixtureRoot, "init", "--initial-branch=main");
    git(fixtureRoot, "config", "user.email", "fixture@example.com");
    git(fixtureRoot, "config", "user.name", "Release Fixture");
    git(fixtureRoot, "add", ".");
    git(fixtureRoot, "commit", "--message", "base");
    const baseSha = git(fixtureRoot, "rev-parse", "HEAD");

    writeJson(path.join(packageDirectory, "package.json"), {
      exports: "./dist/index.js",
      name: "release-fixture-package",
      type: "module",
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
    match(planResult.stdout, /Planned 1 package/, "01.01");
    const plan = JSON.parse(readFileSync(planFile, "utf8"));
    equal(plan.layers, [["release-fixture-package"]], "01.02");
    equal(plan.packages[0].version, "1.0.1", "01.03");

    git(fixtureRoot, "add", ".github", "packages/example/package.json");
    git(fixtureRoot, "commit", "--message", "prepare release");
    const summaryResult = cli(
      fixtureRoot,
      "summary",
      "--plan",
      planFile,
      "--output",
      summaryFile,
    );
    match(summaryResult.stdout, /Rendered 1 package bump/, "01.04");
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
    equal(firstManifest.packageCount, 1, "01.07");
    ok(firstManifest.packages[0].tarball.file.endsWith(".tgz"), "01.08");

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
      "01.09",
    );
    equal(
      JSON.parse(
        readFileSync(path.join(secondArtifacts, "manifest.json"), "utf8"),
      ).packages,
      firstManifest.packages,
      "01.10",
    );
  } finally {
    rmSync(temporaryRoot, { force: true, recursive: true });
  }
});

test.run();
