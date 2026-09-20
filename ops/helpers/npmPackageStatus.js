const registry = "https://registry.npmjs.org";
const unavailableReasons = new Set(["not-found", "unpublished", "no-latest"]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function packageNamesInOrder(packageNames) {
  if (!Array.isArray(packageNames)) {
    throw new TypeError("npm status package names must be an array");
  }
  const seen = new Set();
  for (const name of packageNames) {
    if (
      typeof name !== "string" ||
      name.length > 214 ||
      !/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name)
    ) {
      throw new TypeError(`Invalid npm status package name: ${String(name)}`);
    }
    if (seen.has(name)) {
      throw new TypeError(`Duplicate npm status package name: ${name}`);
    }
    seen.add(name);
  }
  return [...seen].sort();
}

function isTimestamp(value) {
  return (
    typeof value === "string" &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}

/** Validate the saved observation without accessing npm or changing checkedAt.
 * Supply packageNames to require complete, exact coverage of a catalogue. */
function validateNpmPackageStatus(snapshot, packageNames) {
  if (
    !isRecord(snapshot) ||
    snapshot.schemaVersion !== 1 ||
    snapshot.registry !== registry ||
    !isTimestamp(snapshot.checkedAt) ||
    !isRecord(snapshot.packages)
  ) {
    throw new TypeError("Invalid npm package status snapshot header");
  }
  const names = packageNamesInOrder(Object.keys(snapshot.packages));
  for (const name of names) {
    const entry = snapshot.packages[name];
    if (
      !isRecord(entry) ||
      (entry.status === "available"
        ? typeof entry.version !== "string" ||
          !entry.version.trim() ||
          !(
            entry.deprecated === null ||
            (typeof entry.deprecated === "string" &&
              entry.deprecated.length > 0)
          ) ||
          Object.keys(entry).sort().join(",") !== "deprecated,status,version"
        : entry.status !== "unavailable" ||
          !unavailableReasons.has(entry.reason) ||
          Object.keys(entry).sort().join(",") !== "reason,status")
    ) {
      throw new TypeError(`Invalid npm package status entry: ${name}`);
    }
  }
  if (packageNames !== undefined) {
    const expected = packageNamesInOrder(packageNames);
    const expectedSet = new Set(expected);
    const actualSet = new Set(names);
    const missing = expected.filter((name) => !actualSet.has(name));
    const unexpected = names.filter((name) => !expectedSet.has(name));
    if (missing.length || unexpected.length) {
      throw new Error(
        `npm package status inventory differs; missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"}. Refresh with --npm-status.`,
      );
    }
  }
  return snapshot;
}

/** Only a nonempty deprecation message on the latest dist-tag counts.
 * Unavailable packages remain unknown, never an inferred negative result. */
function deprecatedPackageNames(snapshot, packageNames) {
  validateNpmPackageStatus(snapshot, packageNames);
  return Object.keys(snapshot.packages)
    .filter((name) => {
      const entry = snapshot.packages[name];
      return entry.status === "available" && entry.deprecated !== null;
    })
    .sort();
}

function statusFromPackument(name, packument) {
  if (!isRecord(packument) || packument.name !== name) {
    throw new Error(`Invalid npm registry package document: ${name}`);
  }
  if (isRecord(packument.time?.unpublished)) {
    return { status: "unavailable", reason: "unpublished" };
  }
  if (
    !isRecord(packument.versions) ||
    (packument["dist-tags"] !== undefined && !isRecord(packument["dist-tags"]))
  ) {
    throw new Error(`Invalid npm registry versions or dist-tags: ${name}`);
  }
  const version = packument["dist-tags"]?.latest;
  if (version === undefined) {
    return { status: "unavailable", reason: "no-latest" };
  }
  const latest = packument.versions[version];
  if (
    typeof version !== "string" ||
    !version.trim() ||
    !isRecord(latest) ||
    latest.version !== version ||
    (latest.deprecated !== undefined && typeof latest.deprecated !== "string")
  ) {
    throw new Error(`Invalid npm registry latest version: ${name}`);
  }
  return {
    status: "available",
    version,
    deprecated: latest.deprecated || null,
  };
}

/** Explicit network refresh. The caller decides when to persist the complete
 * result; a failed request never produces a partial replacement snapshot. */
async function refreshNpmPackageStatus(
  packageNames,
  {
    fetchImpl = globalThis.fetch,
    checkedAt = new Date().toISOString(),
    concurrency = 6,
    timeoutMs = 30_000,
  } = {},
) {
  const names = packageNamesInOrder(packageNames);
  if (
    typeof fetchImpl !== "function" ||
    !isTimestamp(checkedAt) ||
    !Number.isInteger(concurrency) ||
    concurrency < 1 ||
    concurrency > 32 ||
    !Number.isInteger(timeoutMs) ||
    timeoutMs < 1
  ) {
    throw new TypeError("Invalid npm package status refresh options");
  }
  const entries = new Array(names.length);
  let next = 0;
  let failure;
  async function worker() {
    while (next < names.length && failure === undefined) {
      const index = next++;
      const name = names[index];
      try {
        const response = await fetchImpl(
          `${registry}/${encodeURIComponent(name)}`,
          {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(timeoutMs),
          },
        );
        if (response.status === 404) {
          entries[index] = [
            name,
            { status: "unavailable", reason: "not-found" },
          ];
        } else if (!response.ok) {
          throw new Error(`npm registry returned HTTP ${response.status}`);
        } else {
          entries[index] = [
            name,
            statusFromPackument(name, await response.json()),
          ];
        }
      } catch (error) {
        failure ??= new Error(`Could not refresh npm status for ${name}`, {
          cause: error,
        });
      }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, names.length) }, () => worker()),
  );
  if (failure !== undefined) {
    throw failure;
  }
  return validateNpmPackageStatus(
    {
      schemaVersion: 1,
      registry,
      checkedAt,
      packages: Object.fromEntries(entries),
    },
    names,
  );
}

export {
  deprecatedPackageNames,
  refreshNpmPackageStatus,
  validateNpmPackageStatus,
};
