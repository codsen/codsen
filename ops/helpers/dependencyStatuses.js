// Pass complete current Codsen manifests, never the website's description-only
// entries for packages maintained outside this checkout. Root tooling is excluded.
function dependencyStatuses(manifests) {
  const byName = new Map(
    manifests.map((manifest) => [manifest.name, manifest]),
  );
  const dependents = new Map();
  const external = new Set();
  const noDependencies = [];

  for (const manifest of manifests) {
    const dependencies = [
      ...Object.entries(manifest.dependencies || {}),
      ...Object.entries(manifest.devDependencies || {}),
    ];
    if (!manifest.private && !dependencies.length) {
      noDependencies.push(manifest.name);
    }
    for (const [name, specifier] of dependencies) {
      // Aliases, protocols and paths can resolve a Codsen name to unrelated
      // code. Those sources need their own manifest audit before making a claim.
      if (!byName.has(name) || /[:/\\]/u.test(specifier)) {
        external.add(manifest.name);
      } else {
        if (!dependents.has(name)) {
          dependents.set(name, new Set());
        }
        dependents.get(name).add(manifest.name);
      }
    }
  }

  // Propagate external dependencies back to every consumer. This also handles
  // cycles without prematurely caching a clean result for part of a cycle.
  const queue = [...external];
  for (let i = 0; i < queue.length; i++) {
    for (const name of dependents.get(queue[i]) || []) {
      if (!external.has(name)) {
        external.add(name);
        queue.push(name);
      }
    }
  }

  return {
    noDependencies: noDependencies.sort(),
    noThirdPartyDependencies: manifests
      .filter((manifest) => !manifest.private && !external.has(manifest.name))
      .map((manifest) => manifest.name)
      .sort(),
    thirdPartyDependencies: manifests
      .filter((manifest) => !manifest.private && external.has(manifest.name))
      .map((manifest) => manifest.name)
      .sort(),
  };
}

export { dependencyStatuses };
