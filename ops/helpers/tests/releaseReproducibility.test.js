import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  assertReproducibleReleaseManifests,
  releaseManifestProjection,
} from "../releaseReproducibility.js";

function manifest(createdAt = "2026-08-13T10:00:00.000Z") {
  return {
    baseSha: "a".repeat(40),
    createdAt,
    packages: [
      {
        name: "example",
        tarball: {
          file: "example-1.0.0.tgz",
          sha256: "b".repeat(64),
          size: 123,
        },
      },
    ],
  };
}

test("01 - ignores only the generated manifest timestamp", () => {
  const reference = manifest();
  const candidate = manifest("2026-08-13T10:01:00.000Z");

  assertReproducibleReleaseManifests(reference, candidate);
  equal(
    releaseManifestProjection(candidate),
    {
      baseSha: "a".repeat(40),
      packages: reference.packages,
    },
    "01.01",
  );
});

test("02 - reports the first changed tarball property", () => {
  const reference = manifest();
  const candidate = manifest();
  candidate.packages[0].tarball.sha256 = "c".repeat(64);

  throws(
    () => assertReproducibleReleaseManifests(reference, candidate),
    /manifest\.packages\[0\]\.tarball\.sha256/,
    "02.01",
  );
});

test("03 - detects added or removed manifest data", () => {
  const reference = manifest();
  const candidate = manifest();
  candidate.packages[0].dependencies = [];

  throws(
    () => assertReproducibleReleaseManifests(reference, candidate),
    /manifest\.packages\[0\]\.dependencies/,
    "03.01",
  );
});

test("04 - rejects non-object manifests", () => {
  throws(
    () => releaseManifestProjection([]),
    /release manifest must be an object/,
    "04.01",
  );
});

test.run();
