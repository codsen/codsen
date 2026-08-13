import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  assertCompatibilityManifestMatchesPlan,
  COMPATIBILITY_MANIFEST_KIND,
  COMPATIBILITY_SCHEMA_VERSION,
  createCompatibilityPlan,
  normaliseBins,
  validateCompatibilityManifest,
} from "../packageNodeCompatibility.js";

function packageArtifact(name = "example", filename = `${name}-1.0.0.tgz`) {
  return {
    directory: `packages/${name}`,
    engines: { node: ">=18.20.8" },
    filename,
    hasUnitFiles: true,
    importable: true,
    name,
    nodeFloor: 18,
    sha256: "a".repeat(64),
    unitCommand: "uvu test",
    version: "1.0.0",
  };
}

function cli(name = "example", alias = name) {
  return {
    bins: { [alias]: "cli.js" },
    engines: { node: ">=18.20.8" },
    name,
    version: "1.0.0",
  };
}

function manifest(packages = [packageArtifact()], clis = [cli()]) {
  return {
    clis,
    kind: COMPATIBILITY_MANIFEST_KIND,
    packages,
    schemaVersion: COMPATIBILITY_SCHEMA_VERSION,
  };
}

const inspectArtifact = () => ({
  exists: true,
  isFile: true,
  isSymbolicLink: false,
  sha256: "a".repeat(64),
});

test("01 - normalises valid bins and rejects malformed definitions", () => {
  equal(
    normaliseBins({ bin: "cli.js", name: "@scope/tool" }),
    { tool: "cli.js" },
    "01.01",
  );
  equal(
    normaliseBins({ bin: { zed: "z.js", alpha: "a.js" }, name: "tool" }),
    { alpha: "a.js", zed: "z.js" },
    "01.02",
  );
  throws(
    () => normaliseBins({ bin: ["cli.js"], name: "tool" }),
    /bin must be a string or string-valued object/,
    "01.03",
  );
  throws(
    () => normaliseBins({ bin: { tool: false }, name: "tool" }),
    /safe package-relative POSIX path/,
    "01.04",
  );
});

test("02 - creates a sorted pure plan with exact Node floors and CLI metadata", () => {
  const result = createCompatibilityPlan(
    [
      {
        directory: "packages/zeta",
        manifest: {
          engines: { node: ">=20.19.4" },
          exports: "./dist/index.js",
          name: "zeta",
          scripts: { unit: "uvu test" },
          version: "2.0.0",
        },
      },
      {
        directory: "packages/alpha-cli",
        manifest: {
          bin: { alpha: "cli.js" },
          engines: { node: ">=18.20.8" },
          name: "alpha-cli",
          version: "1.0.0",
        },
      },
    ],
    { hasUnitFiles: (directory) => directory.endsWith("zeta") },
  );

  equal(
    result.packages.map(({ name }) => name),
    ["alpha-cli", "zeta"],
    "02.01",
  );
  equal(result.clis, [cli("alpha-cli", "alpha")], "02.02");
  equal(result.packages[1].nodeFloor, 20, "02.03");
  equal(result.packages[1].hasUnitFiles, true, "02.04");
});

test("03 - validates the exact compatibility manifest and artifact report", () => {
  const value = manifest();
  equal(
    validateCompatibilityManifest(value, { inspectArtifact }),
    value,
    "03.01",
  );
  throws(
    () =>
      validateCompatibilityManifest(
        { ...value, extra: true },
        { inspectArtifact },
      ),
    /unsupported fields/,
    "03.02",
  );
  throws(
    () => validateCompatibilityManifest(manifest([], []), { inspectArtifact }),
    /must contain packages and CLIs/,
    "03.03",
  );
  throws(
    () =>
      validateCompatibilityManifest(manifest([packageArtifact()], [null]), {
        inspectArtifact,
      }),
    /Compatibility CLI 0 must be an object/,
    "03.04",
  );
});

test("04 - rejects slash variants, non-tarballs, bad checksums, and duplicates", () => {
  for (const [index, filename] of [
    "nested/example.tgz",
    "nested\\example.tgz",
    "example.tar",
  ].entries()) {
    throws(
      () =>
        validateCompatibilityManifest(
          manifest([packageArtifact("example", filename)]),
          { inspectArtifact },
        ),
      /Unsafe tarball filename/,
      `04.0${index + 1}`,
    );
  }
  throws(
    () =>
      validateCompatibilityManifest(
        manifest([{ ...packageArtifact(), sha256: "bad" }]),
        { inspectArtifact },
      ),
    /Invalid compatibility checksum/,
    "04.04",
  );
  throws(
    () =>
      validateCompatibilityManifest(
        manifest(
          [
            packageArtifact("alpha", "shared.tgz"),
            packageArtifact("beta", "shared.tgz"),
          ],
          [cli("alpha", "alpha")],
        ),
        { inspectArtifact },
      ),
    /Duplicate tarball filename/,
    "04.05",
  );
});

test("05 - rejects unsorted inventories and broken CLI references", () => {
  throws(
    () =>
      validateCompatibilityManifest(
        manifest(
          [packageArtifact("zeta"), packageArtifact("alpha")],
          [cli("alpha")],
        ),
        { inspectArtifact },
      ),
    /unique, sorted names/,
    "05.01",
  );
  throws(
    () =>
      validateCompatibilityManifest(
        manifest([packageArtifact()], [cli("missing")]),
        {
          inspectArtifact,
        },
      ),
    /does not reference a packed package/,
    "05.02",
  );
  throws(
    () =>
      validateCompatibilityManifest(
        manifest(
          [packageArtifact("alpha"), packageArtifact("beta")],
          [cli("alpha", "same"), cli("beta", "same")],
        ),
        { inspectArtifact },
      ),
    /alias same is declared more than once/,
    "05.03",
  );
});

test("06 - requires regular artifact files with exact checksums", () => {
  throws(
    () =>
      validateCompatibilityManifest(manifest(), {
        inspectArtifact: () => ({ exists: false }),
      }),
    /Missing compatibility tarball/,
    "06.01",
  );
  throws(
    () =>
      validateCompatibilityManifest(manifest(), {
        inspectArtifact: () => ({
          exists: true,
          isFile: true,
          isSymbolicLink: false,
          sha256: "b".repeat(64),
        }),
      }),
    /Checksum mismatch/,
    "06.02",
  );
});

test("07 - compares artifact metadata with the exact current plan projection", () => {
  const value = manifest();
  const plan = {
    clis: value.clis,
    packages: value.packages.map(
      ({ filename: _filename, sha256: _sha256, ...rest }) => rest,
    ),
  };

  assertCompatibilityManifestMatchesPlan(value, plan);
  equal(true, true, "07.01");
  throws(
    () =>
      assertCompatibilityManifestMatchesPlan(value, {
        ...plan,
        packages: [{ ...plan.packages[0], version: "1.0.1" }],
      }),
    /do not match/,
    "07.02",
  );
});

test.run();
