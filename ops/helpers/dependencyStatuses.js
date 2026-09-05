// Pass complete current Codsen manifests, never the website's description-only
// entries for packages maintained outside this checkout. Root tooling is excluded.

import { codsenPackagesOutsideWorkspace } from "./codsenPackages.js";

const TYPES_SCOPE = "@types/";

// Aliases, protocols and paths can resolve a Codsen name to unrelated code, so
// the declared name tells us nothing. One shared token keeps every such source
// unnameable, which is enough to disqualify a "powered by" claim.
const REDIRECTED = Symbol("redirected specifier");

// A Codsen package published from outside this checkout is not third party, so
// it must never be named as what powers a package. Its own graph is still
// unreadable from here, so it cannot establish a clean marker either.
const UNAUDITED = Symbol("unaudited Codsen package");

// `@types/x` is not a library of its own, it is the type surface of `x`.
// DefinitelyTyped folds a scoped name's slash into a double underscore.
function conceptualName(name) {
  if (!name.startsWith(TYPES_SCOPE)) {
    return name;
  }
  const subject = name.slice(TYPES_SCOPE.length);
  return subject.includes("__") ? `@${subject.replace("__", "/")}` : subject;
}

// Names one library when that is the whole third-party footprint, else null.
function soleThirdParty(names) {
  let sole = null;
  let installed = false;
  for (const name of names) {
    if (typeof name !== "string") {
      return null;
    }
    const label = conceptualName(name);
    if (sole === null) {
      sole = label;
    } else if (sole !== label) {
      return null;
    }
    installed ||= !name.startsWith(TYPES_SCOPE);
  }
  // Typings on their own describe a library this package never installs, so
  // there is nothing here to be powered by.
  return installed ? sole : null;
}

function dependencyStatuses(manifests) {
  const byName = new Map(
    manifests.map((manifest) => [manifest.name, manifest]),
  );
  const dependents = new Map();
  const external = new Map();
  const noDependencies = [];
  // Every (package, token) pair enters once, so cycles settle instead of
  // spinning and no part of a cycle caches a clean result too early.
  const queue = [];

  function addExternal(name, token) {
    let tokens = external.get(name);
    if (!tokens) {
      tokens = new Set();
      external.set(name, tokens);
    }
    if (!tokens.has(token)) {
      tokens.add(token);
      queue.push([name, token]);
    }
  }

  for (const manifest of manifests) {
    const dependencies = [
      ...Object.entries(manifest.dependencies || {}),
      ...Object.entries(manifest.devDependencies || {}),
    ];
    if (!manifest.private && !dependencies.length) {
      noDependencies.push(manifest.name);
    }
    for (const [name, specifier] of dependencies) {
      if (/[:/\\]/u.test(specifier)) {
        addExternal(manifest.name, REDIRECTED);
      } else if (byName.has(name)) {
        if (!dependents.has(name)) {
          dependents.set(name, new Set());
        }
        dependents.get(name).add(manifest.name);
      } else if (codsenPackagesOutsideWorkspace.has(name)) {
        addExternal(manifest.name, UNAUDITED);
      } else {
        addExternal(manifest.name, name);
      }
    }
  }

  // Propagate external dependencies back to every consumer.
  for (let i = 0; i < queue.length; i++) {
    const [name, token] = queue[i];
    for (const consumer of dependents.get(name) || []) {
      addExternal(consumer, token);
    }
  }

  const advertised = manifests
    .filter((manifest) => !manifest.private)
    .map((manifest) => manifest.name)
    .sort();

  return {
    noDependencies: noDependencies.sort(),
    noThirdPartyDependencies: advertised.filter(
      (name) => !external.get(name)?.size,
    ),
    singleThirdPartyDependency: Object.fromEntries(
      advertised
        .map((name) => [name, soleThirdParty(external.get(name) || [])])
        .filter(([, sole]) => sole),
    ),
    thirdPartyDependencies: advertised.filter(
      (name) => external.get(name)?.size,
    ),
  };
}

export { dependencyStatuses };
