import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";

import {
  createPackageKindResolver,
  PACKAGE_KINDS,
  turboConfigForPackageKinds,
  validatePackageKindInventory,
  validatePackageKindRegistry,
  validatePackagePublishScripts,
} from "../packageKinds.js";

function registry() {
  return {
    "typescript-library": ["library"],
    cli: ["cli"],
    "generated-data": ["@example/data"],
  };
}

test("01 - resolves every kind from an immutable snapshot", () => {
  const source = registry();
  const resolver = createPackageKindResolver(source);
  source.cli.push("later-cli");

  equal(resolver.kindFor("library"), PACKAGE_KINDS.TYPESCRIPT_LIBRARY, "01.01");
  equal(resolver.kindFor("cli"), PACKAGE_KINDS.CLI, "01.02");
  equal(resolver.namesFor(PACKAGE_KINDS.CLI), ["cli"], "01.03");
  const names = resolver.namesFor(PACKAGE_KINDS.CLI);
  names.push("mutated-copy");
  equal(resolver.namesFor(PACKAGE_KINDS.CLI), ["cli"], "01.04");
});

test("02 - rejects missing and unknown registry kinds", () => {
  const source = registry();
  delete source.cli;
  source.other = [];
  const message = validatePackageKindRegistry(source).join("\n");

  match(message, /missing the cli list/, "02.01");
  match(message, /unknown kind: other/, "02.02");
});

test("03 - rejects unsorted, invalid, and duplicate names", () => {
  const source = registry();
  source["typescript-library"] = ["z-library", "a-library"];
  source.cli = ["cli", "cli"];
  source["generated-data"] = ["cli", null];
  const message = validatePackageKindRegistry(source).join("\n");

  match(message, /typescript-library must be sorted/, "03.01");
  match(message, /contains an invalid name/, "03.02");
  match(message, /both cli and cli/, "03.03");
  match(message, /both cli and generated-data/, "03.04");
});

test("04 - requires exact workspace inventory parity", () => {
  const errors = validatePackageKindInventory({
    registry: registry(),
    workspaceNames: ["cli", "library", "library", "new-workspace"],
  });
  const message = errors.join("\n");

  match(message, /duplicate name: library/, "04.01");
  match(message, /no declared package kind: new-workspace/, "04.02");
  match(message, /no workspace: @example\/data/, "04.03");
});

test("05 - fails closed for unknown package names and kinds", () => {
  const resolver = createPackageKindResolver(registry());

  throws(() => resolver.kindFor("unknown"), /not declared/, "05.01");
  throws(() => resolver.namesFor("unknown"), /Unknown package kind/, "05.02");
});

test("06 - projects kind-specific build profiles and preserves custom tasks", () => {
  const result = turboConfigForPackageKinds(
    {
      tasks: {
        build: { dependsOn: ["^build"], outputs: ["dist/**", "types/**"] },
        "external#build": { outputs: ["custom/**"] },
        coverage: { outputs: [] },
        lint: { outputs: [] },
        typecheck: { outputs: [] },
        unit: { outputs: [] },
      },
    },
    registry(),
  );

  equal(
    result.tasks.build,
    {
      dependsOn: ["^build"],
      inputs: [
        "package.json",
        "rollup.config.js",
        "src/**",
        "tsconfig.json",
        "$TURBO_ROOT$/.node-version",
        "$TURBO_ROOT$/biome.json",
        "$TURBO_ROOT$/ops/biome/**",
        "$TURBO_ROOT$/ops/helpers/browserCompatibility.js",
        "$TURBO_ROOT$/ops/helpers/devGuardedSource.js",
        "$TURBO_ROOT$/ops/helpers/devLogOrigins.js",
        "$TURBO_ROOT$/ops/helpers/nodeEngine.js",
        "$TURBO_ROOT$/ops/scripts/esbuild.js",
        "$TURBO_ROOT$/ops/typedefs/common.ts",
        "$TURBO_ROOT$/tsconfig.base.json",
      ],
      outputs: ["dist/**", "types/**"],
    },
    "06.01",
  );
  equal(
    result.tasks["cli#build"],
    {
      dependsOn: ["^build"],
      inputs: ["package.json"],
      outputs: [],
    },
    "06.02",
  );
  equal(
    result.tasks["@example/data#build"],
    {
      dependsOn: ["^build"],
      inputs: [
        "index.ts",
        "package.json",
        "sources/**",
        "tsconfig.json",
        "$TURBO_ROOT$/.node-version",
        "$TURBO_ROOT$/tsconfig.base.json",
      ],
      outputs: ["dist/**"],
    },
    "06.03",
  );
  equal(result.tasks["external#build"], { outputs: ["custom/**"] }, "06.04");
  equal(result.tasks.lint, { outputs: [] }, "06.05");
  equal(
    result.tasks.typecheck,
    {
      dependsOn: ["^build"],
      inputs: [
        "package.json",
        "src/**",
        "test-types/**",
        "tsconfig.json",
        "$TURBO_ROOT$/ops/typedefs/common.ts",
        "$TURBO_ROOT$/tsconfig.base.json",
      ],
      outputs: [],
    },
    "06.06",
  );
  equal(
    result.tasks["@example/data#typecheck"],
    {
      dependsOn: ["^build"],
      inputs: [
        "index.ts",
        "package.json",
        "sources/**",
        "tsconfig.json",
        "$TURBO_ROOT$/tsconfig.base.json",
      ],
      outputs: [],
    },
    "06.07",
  );
  equal(
    result.tasks.unit,
    {
      dependsOn: ["build"],
      inputs: [
        "package.json",
        "test/**",
        "$TURBO_ROOT$/ops/helpers/common.js",
        "$TURBO_ROOT$/ops/helpers/shallow-compare.js",
      ],
      outputs: [],
    },
    "06.08",
  );
  equal(
    result.tasks["cli#unit"],
    {
      dependsOn: ["build"],
      inputs: [
        "*.js",
        "package.json",
        "test/**",
        "$TURBO_ROOT$/ops/helpers/spawn.js",
      ],
      outputs: [],
    },
    "06.09",
  );
  equal(
    result.tasks["@example/data#unit"],
    {
      dependsOn: ["build"],
      inputs: ["package.json"],
      outputs: [],
    },
    "06.10",
  );
  // coverage reruns the unit suite under c8, so it mirrors the unit inputs;
  // the coverage-exempt generated-data workspace has no coverage script
  equal(
    result.tasks.coverage,
    {
      dependsOn: ["build"],
      inputs: [
        "package.json",
        "test/**",
        "$TURBO_ROOT$/ops/helpers/common.js",
        "$TURBO_ROOT$/ops/helpers/shallow-compare.js",
      ],
      outputs: [],
    },
    "06.11",
  );
  equal(
    result.tasks["cli#coverage"],
    {
      dependsOn: ["build"],
      inputs: [
        "*.js",
        "package.json",
        "test/**",
        "$TURBO_ROOT$/ops/helpers/spawn.js",
      ],
      outputs: [],
    },
    "06.12",
  );
  equal(Object.hasOwn(result.tasks, "@example/data#coverage"), false, "06.13");
});

test("07 - removes former generated profiles after kind migrations", () => {
  const sourceRegistry = registry();
  sourceRegistry["typescript-library"].push("old-library");
  const result = turboConfigForPackageKinds(
    {
      tasks: {
        build: { outputs: ["dist/**", "types/**"] },
        "library#build": {
          dependsOn: ["^build"],
          inputs: ["$TURBO_DEFAULT$"],
          outputs: [],
        },
        "old-library#build": {
          dependsOn: ["^build"],
          outputs: [],
        },
      },
    },
    sourceRegistry,
  );

  equal(Object.hasOwn(result.tasks, "library#build"), false, "07.01");
  equal(Object.hasOwn(result.tasks, "old-library#build"), false, "07.02");
  equal(turboConfigForPackageKinds(result, sourceRegistry), result, "07.03");
});

test("08 - cleans deleted generated tasks and preserves custom tasks", () => {
  const result = turboConfigForPackageKinds(
    {
      tasks: {
        build: { outputs: ["dist/**", "types/**"] },
        "deleted-cli#build": {
          dependsOn: ["^build"],
          inputs: ["$TURBO_DEFAULT$"],
          outputs: [],
        },
        "library#build": { outputs: ["custom-library/**"] },
        "external#build": { outputs: ["custom/**"] },
      },
    },
    registry(),
  );

  equal(Object.hasOwn(result.tasks, "deleted-cli#build"), false, "08.01");
  equal(
    result.tasks["library#build"],
    { outputs: ["custom-library/**"] },
    "08.02",
  );
  equal(result.tasks["external#build"], { outputs: ["custom/**"] }, "08.03");
});

test("09 - returns isolated generated profiles", () => {
  const source = {
    tasks: {
      build: { outputs: ["incorrect/**"] },
    },
  };
  const first = turboConfigForPackageKinds(source, registry());
  first.tasks.build.outputs.push("mutated/**");
  first.tasks["cli#build"].inputs.push("mutated/**");
  const second = turboConfigForPackageKinds(source, registry());

  equal(second.tasks.build.outputs, ["dist/**", "types/**"], "09.01");
  equal(second.tasks["cli#build"].inputs, ["package.json"], "09.02");
});

test("10 - rejects malformed Turbo configuration", () => {
  throws(
    () => turboConfigForPackageKinds({}, registry()),
    /tasks object/,
    "10.01",
  );
  throws(
    () => turboConfigForPackageKinds({ tasks: {} }, registry()),
    /generic build task/,
    "10.02",
  );
});

test("11 - rejects direct package publish scripts", () => {
  equal(
    validatePackagePublishScripts([
      {
        name: "repository-root",
        scripts: {
          aggregate: "npm --workspace example-package publish",
          abbreviated1: "npm pu",
          abbreviated2: "npm pub",
          abbreviated3: "npm publ",
          abbreviated4: "npm publi",
          abbreviated5: "npm publis",
        },
      },
      {
        name: "example-package",
        scripts: {
          leading: "  npm publish --provenance",
          linebreak: "echo ready\nnpm publish --provenance",
          nested: "npm run build && npm\n publish --provenance",
          optioned: "npm --registry=https://registry.npmjs.org publish",
          parenthesized: "(npm publish)",
          pathful: "/usr/local/bin/npm publish",
          prefixed: 'CHANNEL="stable release" env npm publish',
          release: "npm publish --provenance",
          safe: "node ../../ops/scripts/npm-release.js publish --manifest plan.json",
          terminated: "npm publish; echo done",
          workspace: "npm --workspace example-package publish",
        },
      },
    ]),
    [
      "repository-root: scripts.aggregate directly runs npm publish; use the protected release workflow",
      "repository-root: scripts.abbreviated1 directly runs npm publish; use the protected release workflow",
      "repository-root: scripts.abbreviated2 directly runs npm publish; use the protected release workflow",
      "repository-root: scripts.abbreviated3 directly runs npm publish; use the protected release workflow",
      "repository-root: scripts.abbreviated4 directly runs npm publish; use the protected release workflow",
      "repository-root: scripts.abbreviated5 directly runs npm publish; use the protected release workflow",
      "example-package: scripts.leading directly runs npm publish; use the protected release workflow",
      "example-package: scripts.linebreak directly runs npm publish; use the protected release workflow",
      "example-package: scripts.nested directly runs npm publish; use the protected release workflow",
      "example-package: scripts.optioned directly runs npm publish; use the protected release workflow",
      "example-package: scripts.parenthesized directly runs npm publish; use the protected release workflow",
      "example-package: scripts.pathful directly runs npm publish; use the protected release workflow",
      "example-package: scripts.prefixed directly runs npm publish; use the protected release workflow",
      "example-package: scripts.release directly runs npm publish; use the protected release workflow",
      "example-package: scripts.terminated directly runs npm publish; use the protected release workflow",
      "example-package: scripts.workspace directly runs npm publish; use the protected release workflow",
    ],
    "11.01",
  );
  equal(validatePackagePublishScripts([]), [], "11.02");
  equal(
    validatePackagePublishScripts(null),
    ["Package manifests must be an array"],
    "11.03",
  );
});

test.run();
