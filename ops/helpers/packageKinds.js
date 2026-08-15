import { isDeepStrictEqual } from "node:util";

const PACKAGE_KINDS = Object.freeze({
  CLI: "cli",
  GENERATED_DATA: "generated-data",
  TYPESCRIPT_LIBRARY: "typescript-library",
});

const PACKAGE_KIND_VALUES = Object.freeze(Object.values(PACKAGE_KINDS));

const TYPESCRIPT_LIBRARY_BUILD_PROFILE = Object.freeze({
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
    "$TURBO_ROOT$/ops/helpers/nodeEngine.js",
    "$TURBO_ROOT$/ops/scripts/esbuild.js",
    "$TURBO_ROOT$/ops/typedefs/common.ts",
    "$TURBO_ROOT$/package-lock.json",
    "$TURBO_ROOT$/package.json",
    "$TURBO_ROOT$/tsconfig.base.json",
  ],
  outputs: ["dist/**", "types/**"],
});

const CLI_BUILD_PROFILE = Object.freeze({
  dependsOn: ["^build"],
  inputs: ["package.json"],
  outputs: [],
});

const LEGACY_CLI_BUILD_PROFILE = Object.freeze({
  dependsOn: ["^build"],
  outputs: [],
});

const PRECISE_INPUT_MIGRATION_CLI_BUILD_PROFILE = Object.freeze({
  dependsOn: ["^build"],
  inputs: ["$TURBO_DEFAULT$"],
  outputs: [],
});

const GENERATED_DATA_BUILD_PROFILE = Object.freeze({
  dependsOn: ["^build"],
  inputs: [
    "index.ts",
    "package.json",
    "sources/**",
    "tsconfig.json",
    "$TURBO_ROOT$/.node-version",
    "$TURBO_ROOT$/package-lock.json",
    "$TURBO_ROOT$/package.json",
    "$TURBO_ROOT$/tsconfig.base.json",
  ],
  outputs: ["dist/**"],
});

const TYPESCRIPT_LIBRARY_TYPECHECK_PROFILE = Object.freeze({
  dependsOn: ["^build"],
  inputs: [
    "package.json",
    "src/**",
    "test-types/**",
    "tsconfig.json",
    "$TURBO_ROOT$/ops/typedefs/common.ts",
    "$TURBO_ROOT$/package-lock.json",
    "$TURBO_ROOT$/package.json",
    "$TURBO_ROOT$/tsconfig.base.json",
  ],
  outputs: [],
});

const GENERATED_DATA_TYPECHECK_PROFILE = Object.freeze({
  dependsOn: ["^build"],
  inputs: [
    "index.ts",
    "package.json",
    "sources/**",
    "tsconfig.json",
    "$TURBO_ROOT$/package-lock.json",
    "$TURBO_ROOT$/package.json",
    "$TURBO_ROOT$/tsconfig.base.json",
  ],
  outputs: [],
});

const TYPESCRIPT_LIBRARY_UNIT_PROFILE = Object.freeze({
  dependsOn: ["build"],
  inputs: [
    "package.json",
    "test/**",
    "$TURBO_ROOT$/ops/helpers/common.js",
    "$TURBO_ROOT$/ops/helpers/shallow-compare.js",
  ],
  outputs: [],
});

const CLI_UNIT_PROFILE = Object.freeze({
  dependsOn: ["build"],
  inputs: [
    "*.js",
    "package.json",
    "test/**",
    "$TURBO_ROOT$/ops/helpers/spawn.js",
  ],
  outputs: [],
});

const GENERATED_DATA_UNIT_PROFILE = Object.freeze({
  dependsOn: ["build"],
  inputs: ["package.json"],
  outputs: [],
});

const GENERATED_TASK_PROFILES = Object.freeze([
  CLI_BUILD_PROFILE,
  GENERATED_DATA_BUILD_PROFILE,
  GENERATED_DATA_TYPECHECK_PROFILE,
  CLI_UNIT_PROFILE,
  GENERATED_DATA_UNIT_PROFILE,
  LEGACY_CLI_BUILD_PROFILE,
  PRECISE_INPUT_MIGRATION_CLI_BUILD_PROFILE,
]);

const GENERIC_TASK_PROFILES = Object.freeze({
  build: TYPESCRIPT_LIBRARY_BUILD_PROFILE,
  typecheck: TYPESCRIPT_LIBRARY_TYPECHECK_PROFILE,
  unit: TYPESCRIPT_LIBRARY_UNIT_PROFILE,
});

const DIRECT_NPM_PUBLISH = new RegExp(
  String.raw`(?:^|[;&|()\r\n])\s*` +
    String.raw`(?:(?:command|env)\s+|[A-Za-z_][A-Za-z0-9_]*=(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\s;&|()]+)\s+)*` +
    String.raw`(?:npm(?:\.cmd)?|[^\s;&|()]+[\\/]npm(?:\.cmd)?)\s+` +
    String.raw`[^;&|()\r\n]*\bpu(?:b(?:l(?:i(?:s(?:h)?)?)?)?)?(?=\s|[;&|()\r\n]|$)`,
  "u",
);

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function validatePackageKindRegistry(registry) {
  const errors = [];
  if (!isPlainObject(registry)) {
    return ["package-kinds.json must contain an object"];
  }

  const configuredKinds = Object.keys(registry);
  for (const kind of PACKAGE_KIND_VALUES) {
    if (!Object.hasOwn(registry, kind)) {
      errors.push(`package-kinds.json is missing the ${kind} list`);
    }
  }
  for (const kind of configuredKinds) {
    if (!PACKAGE_KIND_VALUES.includes(kind)) {
      errors.push(`package-kinds.json has an unknown kind: ${kind}`);
    }
  }

  const declaredNames = new Map();
  for (const kind of PACKAGE_KIND_VALUES) {
    const names = registry[kind];
    if (!Array.isArray(names)) {
      if (Object.hasOwn(registry, kind)) {
        errors.push(`package-kinds.json ${kind} must be an array`);
      }
      continue;
    }

    const allNamesValid = names.every(
      (name) => typeof name === "string" && name.length,
    );
    if (allNamesValid) {
      const sortedNames = [...names].sort((left, right) =>
        left.localeCompare(right),
      );
      if (JSON.stringify(names) !== JSON.stringify(sortedNames)) {
        errors.push(`package-kinds.json ${kind} must be sorted`);
      }
    }

    for (const name of names) {
      if (typeof name !== "string" || !name.length) {
        errors.push(`package-kinds.json ${kind} contains an invalid name`);
        continue;
      }
      if (declaredNames.has(name)) {
        errors.push(
          `package-kinds.json declares ${name} as both ${declaredNames.get(name)} and ${kind}`,
        );
      } else {
        declaredNames.set(name, kind);
      }
    }
  }

  return errors;
}

function createPackageKindResolver(registry) {
  const errors = validatePackageKindRegistry(registry);
  if (errors.length) {
    throw new Error(`Invalid package-kind registry:\n- ${errors.join("\n- ")}`);
  }

  const kindByName = new Map();
  const namesByKind = new Map();
  for (const kind of PACKAGE_KIND_VALUES) {
    const names = [...registry[kind]];
    namesByKind.set(kind, names);
    for (const name of names) {
      kindByName.set(name, kind);
    }
  }

  return Object.freeze({
    entries() {
      return [...kindByName.entries()];
    },
    kindFor(name) {
      const kind = kindByName.get(name);
      if (!kind) {
        throw new Error(`Package kind is not declared for ${name}`);
      }
      return kind;
    },
    namesFor(kind) {
      if (!PACKAGE_KIND_VALUES.includes(kind)) {
        throw new Error(`Unknown package kind: ${kind}`);
      }
      return [...namesByKind.get(kind)];
    },
  });
}

function validatePackageKindInventory({ registry, workspaceNames }) {
  const errors = validatePackageKindRegistry(registry);
  if (!Array.isArray(workspaceNames)) {
    return [...errors, "workspaceNames must be an array"];
  }

  const workspaceNameSet = new Set();
  for (const name of workspaceNames) {
    if (typeof name !== "string" || !name.length) {
      errors.push("Workspace inventory contains an invalid name");
    } else if (workspaceNameSet.has(name)) {
      errors.push(`Workspace inventory contains duplicate name: ${name}`);
    } else {
      workspaceNameSet.add(name);
    }
  }

  if (validatePackageKindRegistry(registry).length) {
    return errors;
  }

  const resolver = createPackageKindResolver(registry);
  const declaredNameSet = new Set(resolver.entries().map(([name]) => name));
  for (const name of [...workspaceNameSet].sort()) {
    if (!declaredNameSet.has(name)) {
      errors.push(`Workspace has no declared package kind: ${name}`);
    }
  }
  for (const name of [...declaredNameSet].sort()) {
    if (!workspaceNameSet.has(name)) {
      errors.push(`Package-kind declaration has no workspace: ${name}`);
    }
  }

  return errors;
}

function validatePackagePublishScripts(packageManifests) {
  if (!Array.isArray(packageManifests)) {
    return ["Package manifests must be an array"];
  }

  const errors = [];
  for (const manifest of packageManifests) {
    if (!isPlainObject(manifest) || !isPlainObject(manifest.scripts)) {
      continue;
    }
    const packageName =
      typeof manifest.name === "string" && manifest.name
        ? manifest.name
        : "<unnamed package>";
    for (const [scriptName, command] of Object.entries(manifest.scripts)) {
      if (typeof command === "string" && DIRECT_NPM_PUBLISH.test(command)) {
        errors.push(
          `${packageName}: scripts.${scriptName} directly runs npm publish; use the protected release workflow`,
        );
      }
    }
  }
  return errors;
}

function turboConfigForPackageKinds(turboConfig, registry) {
  if (!isPlainObject(turboConfig) || !isPlainObject(turboConfig.tasks)) {
    throw new TypeError("turbo.json must contain a tasks object");
  }
  if (!isPlainObject(turboConfig.tasks.build)) {
    throw new TypeError("turbo.json must contain the generic build task");
  }

  const resolver = createPackageKindResolver(registry);
  const declaredGeneratedTaskNames = new Set(
    resolver.entries().map(([name]) => `${name}#build`),
  );
  const libraryGenericTaskNames = new Set();
  for (const name of resolver.namesFor(PACKAGE_KINDS.TYPESCRIPT_LIBRARY)) {
    for (const taskName of Object.keys(GENERIC_TASK_PROFILES)) {
      libraryGenericTaskNames.add(`${name}#${taskName}`);
    }
  }

  const overridesAfterTask = new Map([
    ["build", {}],
    ["typecheck", {}],
    ["unit", {}],
  ]);
  for (const name of resolver.namesFor(PACKAGE_KINDS.CLI)) {
    overridesAfterTask.get("build")[`${name}#build`] =
      structuredClone(CLI_BUILD_PROFILE);
    overridesAfterTask.get("unit")[`${name}#unit`] =
      structuredClone(CLI_UNIT_PROFILE);
    declaredGeneratedTaskNames.add(`${name}#unit`);
  }
  for (const name of resolver.namesFor(PACKAGE_KINDS.GENERATED_DATA)) {
    overridesAfterTask.get("build")[`${name}#build`] = structuredClone(
      GENERATED_DATA_BUILD_PROFILE,
    );
    overridesAfterTask.get("typecheck")[`${name}#typecheck`] = structuredClone(
      GENERATED_DATA_TYPECHECK_PROFILE,
    );
    overridesAfterTask.get("unit")[`${name}#unit`] = structuredClone(
      GENERATED_DATA_UNIT_PROFILE,
    );
    declaredGeneratedTaskNames.add(`${name}#typecheck`);
    declaredGeneratedTaskNames.add(`${name}#unit`);
  }
  const managedTaskNames = new Set(
    [...overridesAfterTask.values()].flatMap((overrides) =>
      Object.keys(overrides),
    ),
  );

  const tasks = {};
  for (const [taskName, taskConfig] of Object.entries(turboConfig.tasks)) {
    const isGeneratedTaskProfile = GENERATED_TASK_PROFILES.some((profile) =>
      isDeepStrictEqual(taskConfig, profile),
    );
    const isMigratedGeneratedOverride =
      libraryGenericTaskNames.has(taskName) && isGeneratedTaskProfile;
    const isDeletedGeneratedOverride =
      taskName.includes("#") &&
      !taskName.startsWith("//#") &&
      !declaredGeneratedTaskNames.has(taskName) &&
      isGeneratedTaskProfile;
    if (
      managedTaskNames.has(taskName) ||
      isMigratedGeneratedOverride ||
      isDeletedGeneratedOverride
    ) {
      continue;
    }
    tasks[taskName] = Object.hasOwn(GENERIC_TASK_PROFILES, taskName)
      ? structuredClone(GENERIC_TASK_PROFILES[taskName])
      : taskConfig;
    if (overridesAfterTask.has(taskName)) {
      Object.assign(tasks, overridesAfterTask.get(taskName));
    }
  }

  return { ...turboConfig, tasks };
}

export {
  createPackageKindResolver,
  PACKAGE_KINDS,
  turboConfigForPackageKinds,
  validatePackageKindInventory,
  validatePackageKindRegistry,
  validatePackagePublishScripts,
};
