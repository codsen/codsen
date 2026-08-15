import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import typescript from "typescript";
import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  extractDeclarationReferences,
  resolveDeclarationReferences,
} from "../declarationDependencyResolution.js";
import {
  assertConsumerRuntimeSupportsPlans,
  assertResolvedProductionDeclarationDependencies,
  createReleaseConsumerPlans,
  hasRuntimeEntrypoint,
  hasTypeEntrypoint,
  isBareDeclarationSpecifier,
  missingResolvedProductionDeclarationDependencies,
  releaseDependencyClosureNames,
  strictConsumerTypeScriptConfig,
  strictConsumerTypeScriptSource,
} from "../npmReleaseConsumer.js";
import { readWorkspaceRecords } from "../workspaceInventoryFile.js";

const REPOSITORY_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TYPESCRIPT = path.join(
  REPOSITORY_ROOT,
  "node_modules/typescript/bin/tsc",
);

function writeJson(filename, value) {
  mkdirSync(path.dirname(filename), { recursive: true });
  writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`);
}

function releasePackage(name, dependencies = []) {
  return {
    dependencies,
    directory: `packages/${name}`,
    name,
    version: "1.0.0",
  };
}

function workspace(name, manifest = {}) {
  return {
    directory: `packages/${name}`,
    manifest: { name, version: "1.0.0", ...manifest },
  };
}

test("01 - plans an isolated consumer with only its exact release closure", () => {
  const packages = [
    releasePackage("alpha"),
    releasePackage("beta", ["alpha"]),
    releasePackage("gamma", ["beta"]),
  ];
  equal(
    releaseDependencyClosureNames(packages, "gamma"),
    ["alpha", "beta", "gamma"],
    "01.01",
  );

  const plans = createReleaseConsumerPlans(packages, [
    workspace("alpha", {
      exports: {
        default: "./dist/index.js",
        script: "./dist/alpha.umd.js",
        types: "./types/index.d.ts",
      },
      types: "types/index.d.ts",
    }),
    workspace("beta", {
      bin: { beta: "./cli.js" },
      dependencies: { alpha: "^1.0.0" },
    }),
    workspace("gamma", {
      dependencies: { beta: "^1.0.0" },
      exports: "./dist/index.js",
    }),
  ]);
  equal(plans[1].closureNames, ["alpha", "beta"], "01.02");
  equal(plans[0].typed, true, "01.03");
  equal(plans[0].importable, true, "01.04");
  equal(plans[1].bins, { beta: "cli.js" }, "01.05");
  equal(plans[1].importable, false, "01.06");
});

test("02 - distinguishes Node runtime, browser script, and type entrypoints", () => {
  equal(
    hasRuntimeEntrypoint({
      exports: { script: "./browser.js", types: "./index.d.ts" },
    }),
    false,
    "02.01",
  );
  equal(
    hasRuntimeEntrypoint({
      exports: { default: "./index.js", types: "./index.d.ts" },
    }),
    true,
    "02.02",
  );
  equal(
    hasTypeEntrypoint({
      exports: { default: "./index.js", types: "./index.d.ts" },
    }),
    true,
    "02.03",
  );
});

test("03 - extracts declaration modules and maps DefinitelyTyped ownership", () => {
  equal(
    extractDeclarationReferences({
      source: `
        /// <reference types="node" />
        import type { Root } from "hast";
        export type { Plugin } from "unified";
        type Local = import("./local.js").Local;
        import Legacy = require("legacy");
      `,
      typescript,
    }).map(({ specifier }) => specifier),
    ["./local.js", "hast", "legacy", "node", "unified"],
    "03.01",
  );
  equal(isBareDeclarationSpecifier("hast"), true, "03.02");
  equal(isBareDeclarationSpecifier("@scope/tree/feature"), true, "03.03");
  equal(isBareDeclarationSpecifier("node:path"), false, "03.04");
});

test("04 - rejects HAST, MDAST, and Unified types owned only in development", () => {
  const manifest = {
    devDependencies: {
      "@types/hast": "latest",
      "@types/mdast": "latest",
      unified: "latest",
    },
    name: "fixture",
  };
  const resolved = [
    { owner: "@types/hast", specifier: "hast" },
    { owner: "@types/mdast", specifier: "mdast" },
    { owner: "unified", specifier: "unified" },
  ];
  equal(
    missingResolvedProductionDeclarationDependencies(manifest, resolved).map(
      ({ specifier }) => specifier,
    ),
    ["hast", "mdast", "unified"],
    "04.01",
  );
  throws(
    () => assertResolvedProductionDeclarationDependencies(manifest, resolved),
    /hast -> @types\/hast, mdast -> @types\/mdast, unified -> unified/,
    "04.02",
  );
  equal(
    missingResolvedProductionDeclarationDependencies(
      {
        dependencies: {
          "@types/hast": "latest",
          "@types/mdast": "latest",
          unified: "latest",
        },
        name: "fixture",
      },
      resolved,
    ),
    [],
    "04.03",
  );
});

test("05 - catches a missing direct HAST type even when hoisting masks it from TypeScript", () => {
  const temporaryRoot = mkdtempSync(
    path.join(tmpdir(), "release-consumer-hoisted-types-"),
  );
  try {
    const fixtureDirectory = path.join(
      temporaryRoot,
      "node_modules",
      "fixture",
    );
    const hastDirectory = path.join(
      temporaryRoot,
      "node_modules",
      "@types",
      "hast",
    );
    const untypedHastDirectory = path.join(
      temporaryRoot,
      "node_modules",
      "hast",
    );
    mkdirSync(path.join(fixtureDirectory, "types"), { recursive: true });
    mkdirSync(path.join(fixtureDirectory, "dist"), { recursive: true });
    mkdirSync(hastDirectory, { recursive: true });
    mkdirSync(untypedHastDirectory, { recursive: true });
    writeJson(path.join(temporaryRoot, "package.json"), {
      name: "hoisted-type-consumer",
      private: true,
      type: "module",
      version: "1.0.0",
    });
    const fixtureManifest = {
      dependencies: { hast: "1.0.0" },
      exports: {
        default: "./dist/index.js",
        types: "./types/index.d.ts",
      },
      name: "fixture",
      type: "module",
      types: "./types/index.d.ts",
      version: "1.0.0",
    };
    writeJson(path.join(fixtureDirectory, "package.json"), fixtureManifest);
    writeJson(path.join(untypedHastDirectory, "package.json"), {
      main: "index.js",
      name: "hast",
      version: "1.0.0",
    });
    writeFileSync(path.join(untypedHastDirectory, "index.js"), "export {};\n");
    writeFileSync(path.join(fixtureDirectory, "dist/index.js"), "export {};\n");
    writeFileSync(
      path.join(fixtureDirectory, "types/index.d.ts"),
      'import type { Root } from "hast";\nexport type Tree = Root;\n',
    );
    writeJson(path.join(hastDirectory, "package.json"), {
      name: "@types/hast",
      types: "index.d.ts",
      version: "1.0.0",
    });
    writeFileSync(
      path.join(hastDirectory, "index.d.ts"),
      'export interface Root { type: "root"; }\n',
    );
    writeFileSync(
      path.join(temporaryRoot, "consumer.ts"),
      strictConsumerTypeScriptSource("fixture"),
    );
    writeJson(
      path.join(temporaryRoot, "tsconfig.json"),
      strictConsumerTypeScriptConfig(),
    );

    const compilation = spawnSync(
      process.execPath,
      [TYPESCRIPT, "--pretty", "false", "--project", "tsconfig.json"],
      { cwd: temporaryRoot, encoding: "utf8" },
    );
    equal(compilation.status, 0, "05.01");
    const containingFile = path.join(fixtureDirectory, "types/index.d.ts");
    const resolved = resolveDeclarationReferences({
      containingFile,
      references: extractDeclarationReferences({
        source: readFileSync(containingFile, "utf8"),
        typescript,
      }),
      typescript,
    });
    equal(resolved[0].owner, "@types/hast", "05.02");
    throws(
      () =>
        assertResolvedProductionDeclarationDependencies(
          fixtureManifest,
          resolved,
        ),
      /hast -> @types\/hast/,
      "05.03",
    );
  } finally {
    rmSync(temporaryRoot, { force: true, recursive: true });
  }
});

test("06 - selects strict declaration compilation for every TypeScript library", () => {
  const records = readWorkspaceRecords(REPOSITORY_ROOT);
  const workspaceNames = new Set(records.map(({ manifest }) => manifest.name));
  const packages = records.map(({ directory, manifest }) => ({
    dependencies: [
      ...new Set(
        [
          ...Object.keys(manifest.dependencies ?? {}),
          ...Object.keys(manifest.optionalDependencies ?? {}),
          ...Object.keys(manifest.peerDependencies ?? {}),
        ].filter((name) => workspaceNames.has(name)),
      ),
    ].sort((left, right) => left.localeCompare(right)),
    directory,
    name: manifest.name,
    version: manifest.version,
  }));
  const planByName = new Map(
    createReleaseConsumerPlans(packages, records).map((plan) => [
      plan.name,
      plan,
    ]),
  );
  const packageKinds = JSON.parse(
    readFileSync(path.join(REPOSITORY_ROOT, "ops/package-kinds.json"), "utf8"),
  );
  equal(
    packageKinds["typescript-library"].filter(
      (name) => !planByName.get(name)?.typed,
    ),
    [],
    "06.01",
  );
  equal(
    packageKinds["typescript-library"].filter(
      (name) => !planByName.get(name)?.importable,
    ),
    [],
    "06.02",
  );
});

test("07 - binds release dependency edges to the selected workspace graph", () => {
  const records = [
    workspace("alpha"),
    workspace("beta", { dependencies: { alpha: "^1.0.0" } }),
  ];
  throws(
    () =>
      createReleaseConsumerPlans(
        [releasePackage("alpha"), releasePackage("beta")],
        records,
      ),
    /beta release dependencies \[\] do not match selected production dependencies \[alpha\]/,
    "07.01",
  );
  throws(
    () =>
      createReleaseConsumerPlans(
        [releasePackage("alpha"), releasePackage("beta", ["alpha"])],
        [workspace("alpha"), workspace("beta")],
      ),
    /beta release dependencies \[alpha\] do not match selected production dependencies \[\]/,
    "07.02",
  );
  const plans = createReleaseConsumerPlans(
    [
      releasePackage("alpha"),
      releasePackage("beta", ["alpha", "gamma"]),
      releasePackage("gamma"),
    ],
    [
      workspace("alpha"),
      workspace("beta", {
        optionalDependencies: { alpha: "^1.0.0" },
        peerDependencies: { gamma: "^1.0.0" },
      }),
      workspace("gamma"),
    ],
  );
  equal(plans[1].closureNames, ["alpha", "beta", "gamma"], "07.03");
});

test("08 - rejects a future Node floor before engine-strict installation", () => {
  throws(
    () =>
      assertConsumerRuntimeSupportsPlans(
        [{ name: "future", nodeEngine: ">=26.7.0" }],
        "24.19.0",
      ),
    /raise the pinned root toolchain or move exact-artifact runtime verification/,
    "08.01",
  );
  assertConsumerRuntimeSupportsPlans(
    [{ name: "future", nodeEngine: ">=26.7.0" }],
    "26.7.0",
  );
  equal(true, true, "08.02");
});

test.run();
