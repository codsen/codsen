import path from "node:path";
import { test } from "uvu";
import { equal } from "uvu/assert";

import { missingPackageBuildArtifacts } from "../packageBuildArtifacts.js";
import { createPackageKindResolver } from "../packageKinds.js";

function fixture(existingPaths) {
  const existing = new Set(existingPaths.map((value) => path.normalize(value)));
  return {
    exists: (value) => existing.has(path.normalize(value)),
    packageKinds: createPackageKindResolver({
      "typescript-library": ["library"],
      cli: ["cli"],
      "generated-data": [],
    }),
    packagesDirectory: "fixture-packages",
  };
}

test("01 - requires both artifacts from declared TypeScript libraries", () => {
  const options = fixture(["fixture-packages/library/dist/library.esm.js"]);

  equal(
    missingPackageBuildArtifacts(["cli", "library"], options),
    [path.join("fixture-packages", "library", "types", "index.d.ts")],
    "01.01",
  );
});

test("02 - accepts a complete library build and ignores declared CLIs", () => {
  const options = fixture([
    "fixture-packages/library/dist/library.esm.js",
    "fixture-packages/library/types/index.d.ts",
  ]);

  equal(missingPackageBuildArtifacts(["cli", "library"], options), [], "02.01");
});

test.run();
