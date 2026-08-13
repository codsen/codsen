import { existsSync } from "node:fs";
import path from "node:path";

function missingPackageBuildArtifacts(
  packageNames,
  { exists = existsSync, packagesDirectory = "packages" } = {},
) {
  const missing = [];

  for (const packageName of packageNames) {
    if (
      !exists(path.join(packagesDirectory, packageName, "rollup.config.js"))
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
