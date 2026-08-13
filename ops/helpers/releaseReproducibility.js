import { isDeepStrictEqual } from "node:util";

function releaseManifestProjection(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new TypeError("release manifest must be an object");
  }
  const { createdAt: _createdAt, ...projection } = manifest;
  return projection;
}

function valueSummary(value) {
  const summary = JSON.stringify(value);
  if (summary === undefined) {
    return String(value);
  }
  return summary.length > 160 ? `${summary.slice(0, 157)}...` : summary;
}

function childPath(parent, key, array) {
  if (array) {
    return `${parent}[${key}]`;
  }
  return /^[A-Za-z_$][\w$]*$/.test(key)
    ? `${parent}.${key}`
    : `${parent}[${JSON.stringify(key)}]`;
}

function firstDifference(reference, candidate, currentPath = "manifest") {
  if (isDeepStrictEqual(reference, candidate)) {
    return undefined;
  }
  const referenceObject = reference !== null && typeof reference === "object";
  const candidateObject = candidate !== null && typeof candidate === "object";
  if (!referenceObject || !candidateObject) {
    return { candidate, path: currentPath, reference };
  }
  const referenceArray = Array.isArray(reference);
  if (referenceArray !== Array.isArray(candidate)) {
    return { candidate, path: currentPath, reference };
  }
  const keys = [
    ...new Set([...Object.keys(reference), ...Object.keys(candidate)]),
  ].sort();
  for (const key of keys) {
    if (!(key in reference) || !(key in candidate)) {
      return {
        candidate: candidate[key],
        path: childPath(currentPath, key, referenceArray),
        reference: reference[key],
      };
    }
    const difference = firstDifference(
      reference[key],
      candidate[key],
      childPath(currentPath, key, referenceArray),
    );
    if (difference) {
      return difference;
    }
  }
  return { candidate, path: currentPath, reference };
}

function assertReproducibleReleaseManifests(reference, candidate) {
  const difference = firstDifference(
    releaseManifestProjection(reference),
    releaseManifestProjection(candidate),
  );
  if (difference) {
    throw new Error(
      `Release artifacts are not reproducible at ${difference.path}: expected ${valueSummary(difference.reference)}; received ${valueSummary(difference.candidate)}`,
    );
  }
}

export { assertReproducibleReleaseManifests, releaseManifestProjection };
