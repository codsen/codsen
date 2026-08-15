import { builtinModules } from "node:module";
import path from "node:path";

import { lowestNodeMajor } from "./nodeEngine.js";

const PRODUCTION_DEPENDENCY_FIELDS = Object.freeze([
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
]);
const BUILTIN_MODULES = new Set(
  builtinModules.flatMap((name) => [name, `node:${name}`]),
);

function fail(message) {
  throw new Error(message);
}

function safePackageTarget(value, context) {
  const stripped =
    typeof value === "string" && value.startsWith("./")
      ? value.slice(2)
      : value;
  if (
    typeof stripped !== "string" ||
    !stripped ||
    path.posix.isAbsolute(stripped) ||
    stripped.includes("\\") ||
    path.posix.normalize(stripped) !== stripped ||
    stripped === ".." ||
    stripped.startsWith("../")
  ) {
    fail(`${context} must be a safe package-relative POSIX path`);
  }
  return stripped;
}

function normaliseBins(manifest) {
  if (manifest.bin === undefined) {
    return {};
  }
  if (typeof manifest.bin === "string") {
    const alias = manifest.name.includes("/")
      ? manifest.name.slice(manifest.name.lastIndexOf("/") + 1)
      : manifest.name;
    return {
      [alias]: safePackageTarget(manifest.bin, `${manifest.name} bin`),
    };
  }
  if (
    !manifest.bin ||
    typeof manifest.bin !== "object" ||
    Array.isArray(manifest.bin)
  ) {
    fail(`${manifest.name} bin must be a string or string-valued object`);
  }
  const bins = {};
  for (const [alias, target] of Object.entries(manifest.bin).sort(
    ([left], [right]) => left.localeCompare(right),
  )) {
    if (!/^[A-Za-z0-9._-]+$/.test(alias)) {
      fail(`${manifest.name} has unsafe bin alias ${alias}`);
    }
    bins[alias] = safePackageTarget(target, `${manifest.name} bin ${alias}`);
  }
  return bins;
}

function hasTypeExport(value, condition) {
  if (typeof value === "string") {
    return condition === "types";
  }
  if (Array.isArray(value)) {
    return value.some((item) => hasTypeExport(item, condition));
  }
  return Boolean(
    value &&
      typeof value === "object" &&
      Object.entries(value).some(([key, item]) => hasTypeExport(item, key)),
  );
}

function hasRuntimeExport(value, condition) {
  if (typeof value === "string") {
    return !new Set(["browser", "script", "types"]).has(condition);
  }
  if (Array.isArray(value)) {
    return value.some((item) => hasRuntimeExport(item, condition));
  }
  return Boolean(
    value &&
      typeof value === "object" &&
      Object.entries(value).some(([key, item]) =>
        new Set(["browser", "script", "types"]).has(key)
          ? false
          : hasRuntimeExport(item, key),
      ),
  );
}

function hasTypeEntrypoint(manifest) {
  return Boolean(
    (typeof manifest.types === "string" && manifest.types) ||
      (typeof manifest.typings === "string" && manifest.typings) ||
      hasTypeExport(manifest.exports),
  );
}

function hasRuntimeEntrypoint(manifest) {
  return Boolean(
    (typeof manifest.main === "string" && manifest.main) ||
      hasRuntimeExport(manifest.exports),
  );
}

function releaseDependencyClosureNames(packages, targetName) {
  if (!Array.isArray(packages) || packages.length === 0) {
    fail("Release dependency closure requires packages");
  }
  const packageByName = new Map();
  for (const item of packages) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.name !== "string" ||
      !item.name ||
      !Array.isArray(item.dependencies)
    ) {
      fail("Release dependency closure contains an invalid package");
    }
    if (packageByName.has(item.name)) {
      fail(`Release dependency closure contains duplicate ${item.name}`);
    }
    packageByName.set(item.name, item);
  }
  if (!packageByName.has(targetName)) {
    fail(`Release dependency closure has no target ${targetName}`);
  }

  const closure = new Set();
  const pending = [targetName];
  while (pending.length > 0) {
    const name = pending.pop();
    if (closure.has(name)) {
      continue;
    }
    const item = packageByName.get(name);
    if (!item) {
      fail(`Release dependency closure references missing package ${name}`);
    }
    closure.add(name);
    for (const dependency of item.dependencies) {
      pending.push(dependency);
    }
  }
  return [...closure].sort((left, right) => left.localeCompare(right));
}

function productionDependencyNames(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    fail("Published package manifest must be an object");
  }
  const dependencies = new Set();
  for (const field of PRODUCTION_DEPENDENCY_FIELDS) {
    const value = manifest[field];
    if (value === undefined) {
      continue;
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      fail(`${manifest.name} ${field} must be an object`);
    }
    for (const name of Object.keys(value)) {
      dependencies.add(name);
    }
  }
  return [...dependencies].sort((left, right) => left.localeCompare(right));
}

function selectedProductionDependencyNames(manifest, selectedNames) {
  return productionDependencyNames(manifest).filter((name) =>
    selectedNames.has(name),
  );
}

function createReleaseConsumerPlans(packages, workspaceRecords) {
  if (!Array.isArray(workspaceRecords) || workspaceRecords.length === 0) {
    fail("Release consumer planning requires workspace records");
  }
  const workspaceByName = new Map(
    workspaceRecords.map((record) => [record.manifest?.name, record]),
  );
  if (workspaceByName.size !== workspaceRecords.length) {
    fail("Release consumer planning requires unique workspace names");
  }
  if (!Array.isArray(packages) || packages.length === 0) {
    fail("Release consumer planning requires release packages");
  }
  const selectedNames = new Set(packages.map(({ name }) => name));
  if (selectedNames.size !== packages.length) {
    fail("Release consumer planning requires unique release package names");
  }

  return packages.map((item) => {
    const workspace = workspaceByName.get(item.name);
    if (
      !workspace ||
      workspace.directory !== item.directory ||
      workspace.manifest.version !== item.version
    ) {
      fail(
        `${item.name}@${item.version} does not match its current workspace manifest`,
      );
    }
    const selectedDependencies = selectedProductionDependencyNames(
      workspace.manifest,
      selectedNames,
    );
    if (
      JSON.stringify(item.dependencies) !== JSON.stringify(selectedDependencies)
    ) {
      fail(
        `${item.name} release dependencies [${item.dependencies.join(", ")}] do not match selected production dependencies [${selectedDependencies.join(", ")}]`,
      );
    }
    return {
      bins: normaliseBins(workspace.manifest),
      closureNames: releaseDependencyClosureNames(packages, item.name),
      importable: hasRuntimeEntrypoint(workspace.manifest),
      name: item.name,
      nodeEngine: workspace.manifest.engines?.node ?? null,
      typed: hasTypeEntrypoint(workspace.manifest),
      version: item.version,
    };
  });
}

function assertConsumerRuntimeSupportsPlans(plans, actualNodeVersion) {
  if (!Array.isArray(plans) || plans.length === 0) {
    fail("Consumer runtime validation requires release plans");
  }
  const actualMajor = Number(
    String(actualNodeVersion).replace(/^v/, "").split(".")[0],
  );
  if (!Number.isInteger(actualMajor) || actualMajor < 1) {
    fail(`Consumer runtime has invalid Node version ${actualNodeVersion}`);
  }
  const unsupported = plans.filter(
    ({ nodeEngine }) =>
      typeof nodeEngine === "string" &&
      lowestNodeMajor(nodeEngine) > actualMajor,
  );
  if (unsupported.length > 0) {
    const details = unsupported
      .map(({ name, nodeEngine }) => `${name} (${nodeEngine})`)
      .join(", ");
    fail(
      `Exact release consumers run on Node ${actualMajor}, below ${details}; raise the pinned root toolchain or move exact-artifact runtime verification into the canonical eligible Node lane before releasing`,
    );
  }
}

function barePackageName(specifier) {
  if (
    typeof specifier !== "string" ||
    !specifier ||
    specifier.startsWith(".") ||
    specifier.startsWith("#") ||
    specifier.startsWith("/") ||
    BUILTIN_MODULES.has(specifier)
  ) {
    return null;
  }
  if (specifier.startsWith("@")) {
    const parts = specifier.split("/");
    return parts.length >= 2 ? parts.slice(0, 2).join("/") : specifier;
  }
  return specifier.split("/", 1)[0];
}

function isBareDeclarationSpecifier(specifier) {
  return barePackageName(specifier) !== null;
}

function missingResolvedProductionDeclarationDependencies(
  manifest,
  resolvedReferences,
) {
  if (!Array.isArray(resolvedReferences)) {
    fail("Resolved declaration references must be an array");
  }
  const declared = new Set(productionDependencyNames(manifest));
  return resolvedReferences.filter(({ owner, specifier }) => {
    if (
      typeof owner !== "string" ||
      !owner ||
      typeof specifier !== "string" ||
      !specifier
    ) {
      fail(
        "Resolved declaration reference must contain an owner and specifier",
      );
    }
    return owner !== manifest.name && !declared.has(owner);
  });
}

function assertResolvedProductionDeclarationDependencies(
  manifest,
  resolvedReferences,
) {
  const missing = missingResolvedProductionDeclarationDependencies(
    manifest,
    resolvedReferences,
  );
  if (missing.length > 0) {
    fail(
      `${manifest.name} declarations resolve through packages without direct production dependency ownership: ${missing
        .map(({ owner, specifier }) => `${specifier} -> ${owner}`)
        .join(", ")}`,
    );
  }
}

function strictConsumerTypeScriptConfig() {
  return {
    compilerOptions: {
      forceConsistentCasingInFileNames: true,
      module: "NodeNext",
      moduleResolution: "NodeNext",
      noEmit: true,
      skipLibCheck: false,
      strict: true,
      target: "ES2022",
      types: [],
    },
    files: ["consumer.ts"],
  };
}

function strictConsumerTypeScriptSource(packageName) {
  if (typeof packageName !== "string" || !packageName) {
    fail("Strict TypeScript consumer requires a package name");
  }
  return `import * as packageApi from ${JSON.stringify(packageName)};\n\nvoid packageApi;\n`;
}

export {
  assertConsumerRuntimeSupportsPlans,
  assertResolvedProductionDeclarationDependencies,
  createReleaseConsumerPlans,
  hasRuntimeEntrypoint,
  hasTypeEntrypoint,
  isBareDeclarationSpecifier,
  missingResolvedProductionDeclarationDependencies,
  releaseDependencyClosureNames,
  selectedProductionDependencyNames,
  strictConsumerTypeScriptConfig,
  strictConsumerTypeScriptSource,
};
