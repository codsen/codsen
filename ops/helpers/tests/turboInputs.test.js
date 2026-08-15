import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal } from "uvu/assert";

import { turboConfigForPackageKinds } from "../packageKinds.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const turboCli = path.join(repositoryRoot, "node_modules/turbo/bin/turbo");

function write(root, relative, contents = `${relative}\n`) {
  const filename = path.join(root, relative);
  mkdirSync(path.dirname(filename), { recursive: true });
  writeFileSync(filename, contents);
}

function packageManifest(name, dependencies = {}) {
  return `${JSON.stringify(
    {
      name,
      version: "1.0.0",
      private: true,
      scripts: {
        build: 'node -e ""',
        typecheck: 'node -e ""',
        unit: 'node -e ""',
      },
      dependencies,
    },
    null,
    2,
  )}\n`;
}

function taskHash(root, packageName, taskName) {
  const result = spawnSync(
    process.execPath,
    [turboCli, "run", taskName, `--filter=${packageName}`, "--dry=json"],
    {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, TURBO_TELEMETRY_DISABLED: "1" },
    },
  );
  if (result.error || result.status !== 0) {
    throw new Error(
      `Turbo dry run failed: ${result.error?.message ?? result.stderr}`,
    );
  }
  const dryRun = JSON.parse(result.stdout);
  const task = dryRun.tasks.find(
    (candidate) =>
      candidate.package === packageName && candidate.task === taskName,
  );
  if (!task) {
    throw new Error(`Turbo omitted ${packageName}#${taskName}`);
  }
  return task.hash;
}

test("01 - task hashes include only the files each task consumes", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "codsen-turbo-inputs-"));
  try {
    const registry = {
      "typescript-library": ["dependency", "library"],
      cli: ["cli"],
      "generated-data": ["@example/data"],
    };
    const turboConfig = turboConfigForPackageKinds(
      {
        tasks: {
          build: { outputs: [] },
          typecheck: { outputs: [] },
          unit: { outputs: [] },
        },
      },
      registry,
    );

    write(
      fixture,
      "package.json",
      `${JSON.stringify(
        {
          name: "turbo-input-fixture",
          private: true,
          packageManager: "npm@11.16.0",
          workspaces: ["packages/*"],
        },
        null,
        2,
      )}\n`,
    );
    write(
      fixture,
      "package-lock.json",
      `${JSON.stringify(
        {
          name: "turbo-input-fixture",
          lockfileVersion: 3,
          requires: true,
          packages: {},
        },
        null,
        2,
      )}\n`,
    );
    write(fixture, "turbo.json", `${JSON.stringify(turboConfig, null, 2)}\n`);
    for (const relative of [
      ".node-version",
      "biome.json",
      "ops/biome/plugin.grit",
      "ops/helpers/browserCompatibility.js",
      "ops/helpers/common.js",
      "ops/helpers/nodeEngine.js",
      "ops/helpers/shallow-compare.js",
      "ops/helpers/spawn.js",
      "ops/scripts/esbuild.js",
      "ops/typedefs/common.ts",
      "tsconfig.base.json",
    ]) {
      write(fixture, relative);
    }

    for (const name of ["dependency", "library"]) {
      write(
        fixture,
        `packages/${name}/package.json`,
        packageManifest(
          name,
          name === "library" ? { dependency: "1.0.0" } : {},
        ),
      );
      for (const relative of [
        "README.md",
        "examples/example.js",
        "perf/historical.json",
        "rollup.config.js",
        "src/main.ts",
        "test/basic.js",
        "test/fixtures/input.txt",
        "test-types/index.ts",
        "tsconfig.json",
      ]) {
        write(fixture, `packages/${name}/${relative}`);
      }
    }
    write(fixture, "packages/cli/package.json", packageManifest("cli"));
    write(fixture, "packages/cli/cli.js");
    write(fixture, "packages/cli/test/basic.js");
    write(
      fixture,
      "packages/data/package.json",
      packageManifest("@example/data"),
    );
    write(fixture, "packages/data/index.ts");
    write(fixture, "packages/data/sources/generated.ts");
    write(fixture, "packages/data/tsconfig.json");
    write(fixture, "packages/data/README.md");

    const buildHash = taskHash(fixture, "library", "build");
    for (const relative of [
      "README.md",
      "examples/example.js",
      "perf/historical.json",
      "test/basic.js",
    ]) {
      write(fixture, `packages/library/${relative}`, "excluded change\n");
    }
    equal(taskHash(fixture, "library", "build"), buildHash, "01.01");

    write(fixture, "packages/library/src/main.ts", "source change\n");
    equal(taskHash(fixture, "library", "build") === buildHash, false, "01.02");

    const downstreamHash = taskHash(fixture, "library", "build");
    write(fixture, "packages/dependency/src/main.ts", "dependency change\n");
    equal(
      taskHash(fixture, "library", "build") === downstreamHash,
      false,
      "01.03",
    );

    const unitHash = taskHash(fixture, "library", "unit");
    write(fixture, "packages/library/README.md", "another doc change\n");
    equal(taskHash(fixture, "library", "unit"), unitHash, "01.04");
    write(
      fixture,
      "packages/library/test/fixtures/input.txt",
      "fixture change\n",
    );
    equal(taskHash(fixture, "library", "unit") === unitHash, false, "01.05");

    const typecheckHash = taskHash(fixture, "library", "typecheck");
    write(fixture, "packages/library/test-types/index.ts", "type change\n");
    equal(
      taskHash(fixture, "library", "typecheck") === typecheckHash,
      false,
      "01.06",
    );

    const cliUnitHash = taskHash(fixture, "cli", "unit");
    write(fixture, "packages/cli/cli.js", "cli source change\n");
    equal(taskHash(fixture, "cli", "unit") === cliUnitHash, false, "01.07");

    const dataBuildHash = taskHash(fixture, "@example/data", "build");
    write(fixture, "packages/data/README.md", "data docs change\n");
    equal(taskHash(fixture, "@example/data", "build"), dataBuildHash, "01.08");
    write(fixture, "packages/data/sources/generated.ts", "data change\n");
    equal(
      taskHash(fixture, "@example/data", "build") === dataBuildHash,
      false,
      "01.09",
    );
  } finally {
    rmSync(fixture, { force: true, recursive: true });
  }
});

test.run();
