import { readFileSync } from "node:fs";
import path from "node:path";

import { createPackageKindResolver } from "./packageKinds.js";

function readPackageKindRegistry(repositoryRoot) {
  return JSON.parse(
    readFileSync(path.join(repositoryRoot, "ops/package-kinds.json"), "utf8"),
  );
}

function readPackageKindResolver(repositoryRoot) {
  return createPackageKindResolver(readPackageKindRegistry(repositoryRoot));
}

export { readPackageKindRegistry, readPackageKindResolver };
