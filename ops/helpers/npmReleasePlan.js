import path from "node:path";

const DATA_PACKAGE = "@codsen/data";
const DEPENDENCY_FIELDS = [
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
];
const PLAN_KIND = "codsen-npm-release-plan";
const RELEASE_SCHEMA_VERSION = 1;
const COMMITTED_PLAN_PATH = ".github/npm-release-plan.json";
const VERSION_RE =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function fail(message) {
  throw new Error(message);
}

function assertObjectKeys(value, required, context) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${context} must be an object`);
  }
  const actual = Object.keys(value).sort();
  const expected = [...required].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(
      `${context} must contain exactly [${expected.join(", ")}], received [${actual.join(", ")}]`,
    );
  }
}

function assertSha(value, context) {
  if (typeof value !== "string" || !/^[0-9a-f]{40}$/.test(value)) {
    fail(`${context} must be a full lowercase Git commit SHA`);
  }
}

function assertVersion(value, context) {
  if (typeof value !== "string" || !VERSION_RE.test(value)) {
    fail(`${context} must be a valid SemVer version`);
  }
}

function assertPackageName(value, context) {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > 214 ||
    /\s/.test(value) ||
    [...value].some((character) => {
      const code = character.codePointAt(0);
      return code < 32 || code === 127;
    })
  ) {
    fail(`${context} is not a safe npm package name`);
  }
}

function safeRepositoryPath(relative, context, repositoryRoot) {
  if (
    typeof relative !== "string" ||
    !relative ||
    path.posix.isAbsolute(relative) ||
    relative.includes("\\")
  ) {
    fail(`${context} must be a repository-relative POSIX path`);
  }
  const normalized = path.posix.normalize(relative);
  if (
    normalized !== relative ||
    normalized === ".." ||
    normalized.startsWith("../")
  ) {
    fail(`${context} escapes the repository: ${relative}`);
  }
  const root = path.resolve(repositoryRoot);
  const absolute = path.resolve(root, ...relative.split("/"));
  if (!absolute.startsWith(`${root}${path.sep}`)) {
    fail(`${context} escapes the repository: ${relative}`);
  }
  return absolute;
}

function selectedDependencies(manifest, selectedNames) {
  const dependencies = new Set();
  for (const field of DEPENDENCY_FIELDS) {
    if (manifest[field] === undefined) {
      continue;
    }
    if (!manifest[field] || typeof manifest[field] !== "object") {
      fail(`${manifest.name} ${field} must be an object`);
    }
    for (const name of Object.keys(manifest[field])) {
      if (selectedNames.has(name)) {
        dependencies.add(name);
      }
    }
  }
  return [...dependencies].sort();
}

function buildLayers(packages) {
  const packageByName = new Map(packages.map((item) => [item.name, item]));
  const selectedNames = new Set(packageByName.keys());
  if (selectedNames.size !== packages.length) {
    fail("Selected release packages must have unique names");
  }
  const data = packageByName.get(DATA_PACKAGE);
  if (data) {
    for (const item of packages) {
      if (
        item.name !== DATA_PACKAGE &&
        item.dependencies.includes(DATA_PACKAGE)
      ) {
        fail(
          `${item.name} depends on ${DATA_PACKAGE}, which must publish last`,
        );
      }
    }
  }

  const pending = new Set(
    [...selectedNames].filter((name) => name !== DATA_PACKAGE),
  );
  const layers = [];
  while (pending.size > 0) {
    const ready = [...pending]
      .filter((name) =>
        packageByName
          .get(name)
          .dependencies.filter((dependency) => dependency !== DATA_PACKAGE)
          .every((dependency) => !pending.has(dependency)),
      )
      .sort();
    if (ready.length === 0) {
      const cycle = [...pending].sort().map(
        (name) =>
          `${name} -> ${packageByName
            .get(name)
            .dependencies.filter((dependency) => pending.has(dependency))
            .join(", ")}`,
      );
      fail(`Selected workspace dependency cycle:\n${cycle.join("\n")}`);
    }
    layers.push(ready);
    for (const name of ready) {
      pending.delete(name);
    }
  }
  if (data) {
    layers.push([DATA_PACKAGE]);
  }
  return layers;
}

function releasePackages(selected) {
  const sorted = [...selected].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const selectedNames = new Set(sorted.map(({ name }) => name));
  if (selectedNames.size !== sorted.length) {
    fail("Selected release packages must have unique names");
  }
  const packages = sorted.map((item) => ({
    baseVersion: item.baseVersion,
    dependencies: selectedDependencies(item.manifest, selectedNames),
    directory: item.directory,
    layer: -1,
    name: item.name,
    version: item.version,
  }));
  const layers = buildLayers(packages);
  const layerByName = new Map();
  layers.forEach((layer, index) => {
    layer.forEach((name) => {
      layerByName.set(name, index);
    });
  });
  for (const item of packages) {
    item.layer = layerByName.get(item.name);
  }
  return { layers, packages };
}

function validateLayers(packages, layers, context) {
  if (!Array.isArray(layers) || layers.some((layer) => !Array.isArray(layer))) {
    fail(`${context}.layers must be an array of arrays`);
  }
  const flattened = layers.flat();
  const names = packages.map(({ name }) => name);
  if (
    flattened.length !== names.length ||
    new Set(flattened).size !== flattened.length ||
    [...flattened].sort().join("\0") !== [...names].sort().join("\0")
  ) {
    fail(`${context}.layers must contain every package exactly once`);
  }
  for (const layer of layers) {
    if (JSON.stringify(layer) !== JSON.stringify([...layer].sort())) {
      fail(`${context}.layers entries must be sorted`);
    }
  }
  const dataLayer = layers.findIndex((layer) => layer.includes(DATA_PACKAGE));
  if (
    dataLayer !== -1 &&
    (dataLayer !== layers.length - 1 || layers[dataLayer].length !== 1)
  ) {
    fail(`${DATA_PACKAGE} must be alone in the final release layer`);
  }
  const layerByName = new Map();
  layers.forEach((layer, index) => {
    layer.forEach((name) => {
      layerByName.set(name, index);
    });
  });
  for (const item of packages) {
    if (item.layer !== layerByName.get(item.name)) {
      fail(`${item.name} has an incorrect layer number`);
    }
    for (const dependency of item.dependencies) {
      if (!layerByName.has(dependency)) {
        fail(`${item.name} lists an unselected dependency: ${dependency}`);
      }
      if (layerByName.get(dependency) >= item.layer) {
        fail(`${item.name} is not after dependency ${dependency}`);
      }
    }
  }
}

function validatePlan(plan, { repositoryRoot }) {
  assertObjectKeys(
    plan,
    [
      "baseRef",
      "baseSha",
      "createdAt",
      "dependencyFields",
      "kind",
      "layers",
      "packages",
      "plannedAtSha",
      "preparedTreeSha256",
      "schemaVersion",
      "selectedCount",
      "workspaceCount",
    ],
    "release plan",
  );
  if (
    plan.kind !== PLAN_KIND ||
    plan.schemaVersion !== RELEASE_SCHEMA_VERSION
  ) {
    fail("Unsupported release plan kind or schema version");
  }
  assertSha(plan.baseSha, "release plan baseSha");
  assertSha(plan.plannedAtSha, "release plan plannedAtSha");
  if (!/^[0-9a-f]{64}$/.test(plan.preparedTreeSha256)) {
    fail("release plan preparedTreeSha256 is invalid");
  }
  if (typeof plan.baseRef !== "string" || !plan.baseRef) {
    fail("release plan baseRef must be a non-empty string");
  }
  if (Number.isNaN(Date.parse(plan.createdAt))) {
    fail("release plan createdAt must be an ISO timestamp");
  }
  if (
    JSON.stringify(plan.dependencyFields) !== JSON.stringify(DEPENDENCY_FIELDS)
  ) {
    fail("release plan dependencyFields is unsupported");
  }
  if (!Number.isInteger(plan.workspaceCount) || plan.workspaceCount < 1) {
    fail("release plan workspaceCount must be a positive integer");
  }
  if (!Array.isArray(plan.packages)) {
    fail("release plan packages must be an array");
  }
  if (plan.selectedCount !== plan.packages.length || plan.selectedCount < 1) {
    fail(
      "release plan must select at least one package and selectedCount must match packages.length",
    );
  }
  for (const [index, item] of plan.packages.entries()) {
    assertObjectKeys(
      item,
      ["baseVersion", "dependencies", "directory", "layer", "name", "version"],
      `release plan packages[${index}]`,
    );
    assertPackageName(item.name, `release plan packages[${index}].name`);
    assertVersion(item.version, `${item.name} version`);
    if (item.baseVersion !== null) {
      assertVersion(item.baseVersion, `${item.name} baseVersion`);
    }
    safeRepositoryPath(
      item.directory,
      `${item.name} directory`,
      repositoryRoot,
    );
    if (!Array.isArray(item.dependencies)) {
      fail(`${item.name} dependencies must be an array`);
    }
    for (const dependency of item.dependencies) {
      assertPackageName(dependency, `${item.name} dependency`);
    }
    if (
      new Set(item.dependencies).size !== item.dependencies.length ||
      JSON.stringify(item.dependencies) !==
        JSON.stringify([...item.dependencies].sort())
    ) {
      fail(`${item.name} dependencies must be unique and sorted`);
    }
    if (!Number.isInteger(item.layer) || item.layer < 0) {
      fail(`${item.name} layer must be a non-negative integer`);
    }
  }
  const names = plan.packages.map(({ name }) => name);
  if (
    new Set(names).size !== names.length ||
    JSON.stringify(names) !== JSON.stringify([...names].sort())
  ) {
    fail("release plan packages must have unique, sorted names");
  }
  validateLayers(plan.packages, plan.layers, "release plan");
  return plan;
}

function planProjection(plan) {
  return {
    baseSha: plan.baseSha,
    dependencyFields: plan.dependencyFields,
    layers: plan.layers,
    packages: plan.packages,
    preparedTreeSha256: plan.preparedTreeSha256,
    selectedCount: plan.selectedCount,
    workspaceCount: plan.workspaceCount,
  };
}

function parseVersion(value) {
  const match = VERSION_RE.exec(value);
  if (!match) {
    fail(`${value} must be a valid SemVer version`);
  }
  const withoutBuild = value.split("+", 1)[0];
  const prereleaseAt = withoutBuild.indexOf("-");
  return {
    core: match.slice(1, 4),
    prerelease:
      prereleaseAt === -1
        ? []
        : withoutBuild.slice(prereleaseAt + 1).split("."),
  };
}

function compareNumericIdentifier(left, right) {
  if (left.length !== right.length) {
    return left.length < right.length ? -1 : 1;
  }
  return left === right ? 0 : left < right ? -1 : 1;
}

function comparePrerelease(left, right) {
  if (left.length === 0 || right.length === 0) {
    return left.length === right.length ? 0 : left.length === 0 ? 1 : -1;
  }
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const leftPart = left[index];
    const rightPart = right[index];
    if (leftPart === undefined || rightPart === undefined) {
      return leftPart === rightPart ? 0 : leftPart === undefined ? -1 : 1;
    }
    if (leftPart === rightPart) {
      continue;
    }
    const leftNumeric = /^\d+$/.test(leftPart);
    const rightNumeric = /^\d+$/.test(rightPart);
    if (leftNumeric && rightNumeric) {
      return compareNumericIdentifier(leftPart, rightPart);
    }
    if (leftNumeric !== rightNumeric) {
      return leftNumeric ? -1 : 1;
    }
    return leftPart < rightPart ? -1 : 1;
  }
  return 0;
}

function versionChange(baseVersion, version, packageName) {
  if (baseVersion === null) {
    return "new";
  }
  if (baseVersion === version) {
    fail(`${packageName} release plan does not change its version`);
  }
  const base = parseVersion(baseVersion);
  const next = parseVersion(version);
  const labels = ["major", "minor", "patch"];
  for (let index = 0; index < labels.length; index += 1) {
    if (next.core[index] !== base.core[index]) {
      if (compareNumericIdentifier(next.core[index], base.core[index]) < 0) {
        fail(`${packageName} release plan lowers ${baseVersion} to ${version}`);
      }
      return `${next.prerelease.length === 0 ? "" : "pre"}${labels[index]}`;
    }
  }
  const prereleaseOrder = comparePrerelease(base.prerelease, next.prerelease);
  if (prereleaseOrder > 0) {
    fail(`${packageName} release plan lowers ${baseVersion} to ${version}`);
  }
  if (prereleaseOrder < 0) {
    return next.prerelease.length === 0 ? "stable" : "prerelease";
  }
  fail(
    `${packageName} release plan changes ${baseVersion} to equal-precedence ${version}`,
  );
}

function markdownCode(value) {
  return `<code>${String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("|", "&#124;")}</code>`;
}

function releaseSummary(plan) {
  const rows = plan.packages.map((item) => ({
    ...item,
    change: versionChange(item.baseVersion, item.version, item.name),
  }));
  const counts = new Map();
  for (const { change } of rows) {
    counts.set(change, (counts.get(change) ?? 0) + 1);
  }
  const order = [
    "major",
    "minor",
    "patch",
    "premajor",
    "preminor",
    "prepatch",
    "prerelease",
    "stable",
    "new",
  ];
  const breakdown = order
    .filter((change) => counts.has(change))
    .map((change) => `${counts.get(change)} ${change}`)
    .join(", ");
  const table = rows
    .map(
      ({ baseVersion, change, layer, name, version }) =>
        `| ${markdownCode(name)} | ${baseVersion === null ? "—" : markdownCode(baseVersion)} | ${markdownCode(version)} | **${change}** | ${layer + 1} |`,
    )
    .join("\n");

  return `## npm release proposal

**${plan.selectedCount} package${plan.selectedCount === 1 ? "" : "s"} selected across ${plan.layers.length} publish layer${plan.layers.length === 1 ? "" : "s"}** from base ${markdownCode(plan.baseSha)}.

**Bump summary:** ${breakdown}.

| Package | Current | Proposed | Bump | Publish layer |
| :-- | --: | --: | :-- | --: |
${table}

Lower-numbered layers publish first. Publishing starts only after this PR is merged, CI passes, and the protected ${markdownCode("npm-production")} deployment is approved. The committed ${markdownCode(COMMITTED_PLAN_PATH)} file is the source of truth for the exact versions above.
`;
}

export {
  assertObjectKeys,
  assertPackageName,
  assertSha,
  assertVersion,
  buildLayers,
  COMMITTED_PLAN_PATH,
  DATA_PACKAGE,
  DEPENDENCY_FIELDS,
  PLAN_KIND,
  planProjection,
  RELEASE_SCHEMA_VERSION,
  releasePackages,
  releaseSummary,
  safeRepositoryPath,
  selectedDependencies,
  validateLayers,
  validatePlan,
  versionChange,
};
