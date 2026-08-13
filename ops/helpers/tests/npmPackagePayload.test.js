import { test } from "uvu";
import { equal, ok, throws } from "uvu/assert";

import {
  entrypointTargets,
  forbiddenPackedPath,
  localSpecifiers,
  MANIFEST_KIND,
  packageTarget,
  validatePackedFiles,
  validateReleaseManifest,
  wildcardRegExp,
} from "../npmPackagePayload.js";
import { RELEASE_SCHEMA_VERSION } from "../npmReleasePlan.js";

function tarball(file = "example-1.0.0.tgz") {
  return {
    entryCount: 2,
    file,
    integrity: "sha512-YQ==",
    sha1: "a".repeat(40),
    sha256: "b".repeat(64),
    sha512: "c".repeat(128),
    size: 123,
  };
}

function packageItem(name = "example", file = `${name}-1.0.0.tgz`) {
  return {
    dependencies: [],
    directory: `packages/${name}`,
    layer: 0,
    name,
    tarball: tarball(file),
    version: "1.0.0",
  };
}

function releaseManifest(packages, layers) {
  return {
    baseSha: "a".repeat(40),
    createdAt: "2026-08-14T00:00:00.000Z",
    headSha: "b".repeat(40),
    kind: MANIFEST_KIND,
    layers,
    packageCount: packages.length,
    packages,
    planSha256: "d".repeat(64),
    schemaVersion: RELEASE_SCHEMA_VERSION,
    workspaceCount: 3,
  };
}

function inspection(item) {
  return {
    exists: true,
    hashes: {
      integrity: item.tarball.integrity,
      sha1: item.tarball.sha1,
      sha256: item.tarball.sha256,
      sha512: item.tarball.sha512,
      size: item.tarball.size,
    },
    isFile: true,
    isSymbolicLink: false,
  };
}

test("01 - rejects absolute, traversal, and backslash package targets", () => {
  equal(packageTarget("./dist/index.js", "target"), "dist/index.js", "01.01");
  throws(() => packageTarget("/etc/passwd", "target"), /not a safe/, "01.02");
  throws(() => packageTarget("../outside.js", "target"), /not a safe/, "01.03");
  throws(
    () => packageTarget("dist\\index.js", "target"),
    /not a safe/,
    "01.04",
  );
});

test("02 - recursively collects conditional, array, null, browser and bin targets", () => {
  equal(
    entrypointTargets({
      bin: { example: "./cli.js" },
      browser: { "./dist/index.js": "./browser/index.js", ignored: false },
      exports: {
        ".": {
          import: ["./dist/index.js", null],
          types: "./types/index.d.ts",
        },
        "./feature/*": "./dist/*.js",
      },
      name: "example",
    }),
    [
      "browser/index.js",
      "cli.js",
      "dist/*.js",
      "dist/index.js",
      "types/index.d.ts",
    ],
    "02.01",
  );
  throws(
    () => entrypointTargets({ name: "example" }),
    /has no exports/,
    "02.02",
  );
  throws(
    () => entrypointTargets({ exports: { import: false }, name: "example" }),
    /unsupported package target/,
    "02.03",
  );
});

test("03 - recognises local dependency syntax and one-segment wildcards", () => {
  equal(
    localSpecifiers(`
      import value from "./one.js";
      export { value } from "./two.js";
      await import("./three.js");
      require("./four.cjs");
      new URL("./five.txt", import.meta.url);
      import "external";
    `),
    ["./one.js", "./two.js", "./three.js", "./four.cjs", "./five.txt"],
    "03.01",
  );
  ok(wildcardRegExp("dist/*.js").test("dist/feature.js"), "03.02");
  equal(
    wildcardRegExp("dist/*.js").test("dist/nested/feature.js"),
    false,
    "03.03",
  );
});

test("04 - classifies transient and generated paths as forbidden", () => {
  equal(
    [
      forbiddenPackedPath("node_modules/pkg/index.js"),
      forbiddenPackedPath("dist/cache.tsbuildinfo"),
      forbiddenPackedPath("dist/index.js"),
    ],
    [true, true, false],
    "04.01",
  );
});

test("05 - accepts only the controlled complete payload and executable bin", () => {
  const item = { name: "example" };
  const manifest = { bin: { example: "cli.js" } };
  const staged = new Set([
    "package.json",
    "cli.js",
    "dist/chunk.js",
    "dist/index.js",
  ]);
  const report = {
    files: [
      { mode: 0o644, path: "package/package.json" },
      { mode: 0o755, path: "package/cli.js" },
      { mode: 0o644, path: "package/dist/chunk.js" },
      { mode: 0o644, path: "package/dist/index.js" },
    ],
  };

  equal(
    [
      ...validatePackedFiles(
        item,
        manifest,
        report,
        staged,
        ["cli.js", "dist/index.js"],
        ["cli.js", "dist/chunk.js", "dist/index.js"],
      ).keys(),
    ],
    ["package.json", "cli.js", "dist/chunk.js", "dist/index.js"],
    "05.01",
  );
});

test("06 - rejects missing closure files, duplicate paths, and non-executable bins", () => {
  const item = { name: "example" };
  const staged = new Set(["package.json", "cli.js", "dist/index.js"]);
  const base = [
    { mode: 0o644, path: "package.json" },
    { mode: 0o755, path: "cli.js" },
  ];
  throws(
    () =>
      validatePackedFiles(
        item,
        { bin: "cli.js" },
        { files: base },
        staged,
        ["cli.js"],
        ["cli.js", "dist/index.js"],
      ),
    /omits payload closure file/,
    "06.01",
  );
  throws(
    () =>
      validatePackedFiles(
        item,
        {},
        { files: [base[0], base[0]] },
        staged,
        [],
        [],
      ),
    /duplicate file/,
    "06.02",
  );
  throws(
    () =>
      validatePackedFiles(
        item,
        { bin: "cli.js" },
        { files: [base[0], { mode: 0o644, path: "cli.js" }] },
        staged,
        ["cli.js"],
        ["cli.js"],
      ),
    /not executable/,
    "06.03",
  );
});

test("07 - rejects files outside staging, forbidden paths, and missing package metadata", () => {
  const item = { name: "example" };
  throws(
    () =>
      validatePackedFiles(
        item,
        {},
        { files: [{ path: "surprise.js" }] },
        new Set(["package.json"]),
        [],
        [],
      ),
    /outside the controlled staging set/,
    "07.01",
  );
  throws(
    () =>
      validatePackedFiles(
        item,
        {},
        { files: [{ path: "tap/fixture.js" }] },
        new Set(["tap/fixture.js"]),
        [],
        [],
      ),
    /forbidden transient path/,
    "07.02",
  );
  throws(
    () => validatePackedFiles(item, {}, { files: [] }, new Set(), [], []),
    /does not contain package.json/,
    "07.03",
  );
});

test("08 - validates archive hashes and rejects cross-platform or duplicate names", () => {
  const first = packageItem("alpha", "shared.tgz");
  const valid = releaseManifest([first], [["alpha"]]);
  equal(
    validateReleaseManifest(valid, {
      inspectTarball: () => inspection(first),
      manifestDirectory: "/artifacts",
      repositoryRoot: "/repository",
    }),
    valid,
    "08.01",
  );

  const unsafe = packageItem("alpha", "nested\\alpha.tgz");
  throws(
    () =>
      validateReleaseManifest(releaseManifest([unsafe], [["alpha"]]), {
        inspectTarball: () => inspection(unsafe),
        manifestDirectory: "/artifacts",
        repositoryRoot: "/repository",
      }),
    /unsafe tarball filename/,
    "08.02",
  );

  const second = packageItem("beta", "shared.tgz");
  throws(
    () =>
      validateReleaseManifest(
        releaseManifest([first, second], [["alpha", "beta"]]),
        {
          inspectTarball: () => inspection(first),
          manifestDirectory: "/artifacts",
          repositoryRoot: "/repository",
        },
      ),
    /Duplicate release tarball filename/,
    "08.03",
  );
});

test.run();
