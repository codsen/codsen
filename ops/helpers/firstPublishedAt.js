const VERSION = /^\d+\.\d+\.\d+(?:-[\da-z.-]+)?(?:\+[\da-z.-]+)?$/i;

function firstPublishedAtFromMetadata(packageName, metadata) {
  if (
    metadata?.name !== packageName ||
    !metadata.time ||
    typeof metadata.time !== "object" ||
    Array.isArray(metadata.time)
  ) {
    throw new Error(`Invalid npm publication metadata for ${packageName}`);
  }

  let earliest = null;
  // Include version times retained after unpublishing. Neither time.created
  // nor time.modified identifies the first version's publication precisely.
  for (const [version, date] of Object.entries(metadata.time)) {
    if (!VERSION.test(version)) {
      continue;
    }
    const timestamp = typeof date === "string" ? Date.parse(date) : NaN;
    if (!Number.isSafeInteger(timestamp) || timestamp <= 0) {
      throw new Error(
        `Invalid npm publication time for ${packageName}@${version}`,
      );
    }
    earliest = earliest === null ? timestamp : Math.min(earliest, timestamp);
  }
  if (earliest === null && Object.keys(metadata.versions || {}).length) {
    throw new Error(`Missing npm version publication times for ${packageName}`);
  }
  return earliest;
}

function projectFirstPublishedAt(packageNames, previous) {
  return Object.fromEntries(
    [...packageNames].sort().map((name) => {
      const timestamp = Object.hasOwn(previous, name) ? previous[name] : null;
      if (
        timestamp !== null &&
        (!Number.isSafeInteger(timestamp) ||
          timestamp <= 0 ||
          !Number.isFinite(new Date(timestamp).getTime()))
      ) {
        throw new Error(
          `Invalid saved first-publication timestamp for ${name}`,
        );
      }
      return [name, timestamp];
    }),
  );
}

async function refreshFirstPublishedAt(
  packageNames,
  previous,
  { fetchMetadata = fetch } = {},
) {
  const result = projectFirstPublishedAt(packageNames, previous);
  const names = Object.keys(result);
  // Limit concurrent full-metadata requests; no registry work occurs in the
  // ordinary offline projection or when consumers import @codsen/data.
  for (let offset = 0; offset < names.length; offset += 8) {
    await Promise.all(
      names.slice(offset, offset + 8).map(async (name) => {
        let timestamp;
        try {
          const response = await fetchMetadata(
            `https://registry.npmjs.org/${encodeURIComponent(name)}`,
            {
              headers: { Accept: "application/json" },
              signal: AbortSignal.timeout(30_000),
            },
          );
          if (response.status === 404) {
            timestamp = null;
          } else {
            if (!response.ok) {
              throw new Error(`npm registry returned HTTP ${response.status}`);
            }
            timestamp = firstPublishedAtFromMetadata(
              name,
              await response.json(),
            );
          }
        } catch (error) {
          throw new Error(
            `Could not refresh first-publication date for ${name}`,
            {
              cause: error,
            },
          );
        }
        // Once observed, a publication remains historical evidence even if
        // npm subsequently removes that version or the entire package.
        if (timestamp !== null) {
          result[name] =
            result[name] === null
              ? timestamp
              : Math.min(result[name], timestamp);
        }
      }),
    );
  }
  return result;
}

export {
  firstPublishedAtFromMetadata,
  projectFirstPublishedAt,
  refreshFirstPublishedAt,
};
