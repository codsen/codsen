import { existsSync } from "node:fs";
import path from "node:path";
import { PACKAGE_KINDS } from "./packageKinds.js";

function missingPackageBuildArtifacts(
  packageNames,
  { exists = existsSync, packageKinds, packagesDirectory = "packages" } = {},
) {
  const missing = [];
  if (!packageKinds) {
    throw new TypeError("packageKinds resolver is required");
  }

  for (const packageName of packageNames) {
    if (
      packageKinds.kindFor(packageName) !== PACKAGE_KINDS.TYPESCRIPT_LIBRARY
    ) {
      continue;
    }

    for (const relativeArtifact of [
      path.join("dist", `${packageName}.esm.js`),
      path.join("types", "index.d.ts"),
    ]) {
      const artifact = path.join(
        packagesDirectory,
        packageName,
        relativeArtifact,
      );
      if (!exists(artifact)) {
        missing.push(artifact);
      }
    }
  }

  return missing;
}

export { missingPackageBuildArtifacts };
