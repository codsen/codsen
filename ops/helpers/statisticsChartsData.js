import { createCodsenPackageLists } from "./codsenPackages.js";

function parseInterdepsSource(source) {
  const match = /^export const interdeps\s*=\s*([\s\S]*?);?\s*$/.exec(source);
  if (!match)
    throw new Error("statistics charts: expected interdeps JSON export");
  const interdeps = JSON.parse(match[1]);
  if (!Array.isArray(interdeps)) {
    throw new Error("statistics charts: interdeps must be an array");
  }
  return interdeps;
}

function completeInterdeps(interdeps, workspaceRecords) {
  const records = workspaceRecords.filter(({ manifest }) => !manifest.private);
  const { current } = createCodsenPackageLists(
    records.map(({ manifest }) => manifest.name),
  );
  const currentNames = new Set(current);
  const manifests = new Map(
    records.map(({ manifest }) => [manifest.name, manifest]),
  );
  const entries = new Map();
  for (const entry of interdeps) {
    if (
      !entry ||
      !currentNames.has(entry.name) ||
      !manifests.has(entry.name) ||
      entries.has(entry.name) ||
      !Array.isArray(entry.imports) ||
      entry.imports.some((name) => typeof name !== "string") ||
      new Set(entry.imports).size !== entry.imports.length
    ) {
      throw new Error(
        `statistics charts: invalid or duplicate interdeps entry ${entry?.name}`,
      );
    }
    entries.set(entry.name, entry);
  }
  return current.map((name) => {
    const manifest = manifests.get(name);
    if (!manifest) return { name, imports: [], unknownImports: true };
    const imports = Object.keys({
      ...manifest.dependencies,
      ...manifest.optionalDependencies,
    })
      .filter((dependency) => currentNames.has(dependency))
      .sort();
    const entry = entries.get(name);
    const generatedImports = Object.keys(manifest.dependencies ?? {})
      .filter((dependency) => currentNames.has(dependency))
      .sort();
    // The generated source intentionally omits isolates, but a missing connected
    // workspace or changed edge means it needs regenerating before chart baking.
    const connected =
      generatedImports.length ||
      [...manifests.values()].some(
        (other) =>
          currentNames.has(other.name) &&
          Object.hasOwn(other.dependencies ?? {}, name),
      );
    if (
      (connected && !entry) ||
      (entry &&
        JSON.stringify(
          entry.imports
            .filter((dependency) => currentNames.has(dependency))
            .sort(),
        ) !== JSON.stringify(generatedImports))
    ) {
      throw new Error(
        `statistics charts: interdeps is stale for ${name}; run npm run ci:generate:info`,
      );
    }
    return { ...entry, name, imports, unknownImports: false };
  });
}

function assertLockedWorkspaceDependencies(workspaceRecords, lockPackages) {
  const sortedEntries = (value) =>
    Object.entries(value ?? {}).sort(([left], [right]) =>
      left < right ? -1 : left > right ? 1 : 0,
    );
  for (const { directory, manifest } of workspaceRecords) {
    const locked = lockPackages?.[directory];
    if (
      !locked ||
      ["dependencies", "optionalDependencies"].some(
        (field) =>
          JSON.stringify(sortedEntries(manifest[field])) !==
          JSON.stringify(sortedEntries(locked[field])),
      )
    ) {
      throw new Error(
        `statistics charts: package-lock.json is stale for ${manifest.name}; update the lockfile before baking dependency charts`,
      );
    }
  }
}

export {
  assertLockedWorkspaceDependencies,
  completeInterdeps,
  parseInterdepsSource,
};
