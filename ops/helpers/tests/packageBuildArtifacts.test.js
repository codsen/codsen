import path from "node:path";
import { test } from "uvu";
import { equal } from "uvu/assert";

import { missingPackageBuildArtifacts } from "../packageBuildArtifacts.js";

function fixture(existingPaths) {
  const existing = new Set(existingPaths.map((value) => path.normalize(value)));
  return {
    exists: (value) => existing.has(path.normalize(value)),
    packagesDirectory: "fixture-packages",
  };
}

test("01 - requires both user-facing artifacts from Rollup packages", () => {
  const options = fixture([
    "fixture-packages/library/rollup.config.js",
    "fixture-packages/library/dist/library.esm.js",
  ]);

  equal(
    missingPackageBuildArtifacts(["cli", "library"], options),
    [path.join("fixture-packages", "library", "types", "index.d.ts")],
    "01.01",
  );
});

test("02 - accepts a complete Rollup build and ignores non-Rollup packages", () => {
  const options = fixture([
    "fixture-packages/library/rollup.config.js",
    "fixture-packages/library/dist/library.esm.js",
    "fixture-packages/library/types/index.d.ts",
  ]);

  equal(missingPackageBuildArtifacts(["cli", "library"], options), [], "02.01");
});

test.run();
