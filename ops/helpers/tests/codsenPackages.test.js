import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  catalogueExclusions,
  codsenPackagesOutsideWorkspace,
  createCodsenPackageLists,
  packagesOutsideMonorepo,
  packagesOutsideMonorepoObj,
  retired,
} from "../codsenPackages.js";
import { readWorkspaceRecords } from "../workspaceInventoryFile.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

test("01 - separates the complete inventory from location and retirement", () => {
  const result = createCodsenPackageLists([
    "zeta",
    "@example/library",
    "alpha",
  ]);
  const expected = [
    "zeta",
    "@example/library",
    "alpha",
    ...packagesOutsideMonorepo,
  ].sort();
  equal(result.all, [...expected, ...retired].sort(), "01.01");
  equal(result.current, expected, "01.02");
  equal(result.historical, [...expected, ...retired].sort(), "01.03");
  equal(result.retired, [...retired].sort(), "01.04");
  equal(
    result.packagesOutsideMonorepo,
    [...packagesOutsideMonorepo].sort(),
    "01.05",
  );
  equal(new Set(result.all).size, result.all.length, "01.06");
  equal(result.inMonorepo, ["@example/library", "alpha", "zeta"], "01.07");
  equal(
    result.outsideMonorepo,
    [...packagesOutsideMonorepo, ...retired].sort(),
    "01.08",
  );
});

test("02 - excludes auxiliary, test, third-party and unpublished alias names", () => {
  const excluded = Object.keys(catalogueExclusions);
  const result = createCodsenPackageLists(["example", ...excluded]);
  equal(
    result.all,
    ["example", ...packagesOutsideMonorepo, ...retired].sort(),
    "02.01",
  );
  equal(
    result.historical.some((name) => excluded.includes(name)),
    false,
    "02.02",
  );
  equal(
    excluded.every(
      (name) =>
        typeof catalogueExclusions[name] === "string" &&
        catalogueExclusions[name].length > 0,
    ),
    true,
    "02.03",
  );
});

test("03 - retirement does not erase inventory or repository membership", () => {
  const result = createCodsenPackageLists(["example", ...retired]);
  equal(
    result.current.some((name) => retired.includes(name)),
    false,
    "03.01",
  );
  equal(
    retired.every((name) => result.historical.includes(name)),
    true,
    "03.02",
  );
  equal(result.retired.length, 33, "03.03");
  equal(
    retired.every((name) => codsenPackagesOutsideWorkspace.has(name)),
    true,
    "03.04",
  );
  equal(
    retired.every((name) => result.inMonorepo.includes(name)),
    true,
    "03.05",
  );
  equal(
    result.outsideMonorepo.some((name) => retired.includes(name)),
    false,
    "03.06",
  );
});

test("04 - includes the audited canonical ESLint plugins in products and dependency ownership", () => {
  const result = createCodsenPackageLists([]);
  equal(
    ["eslint-plugin-row-num", "eslint-plugin-test-num"].map(
      (name) =>
        result.all.includes(name) && codsenPackagesOutsideWorkspace.has(name),
    ),
    [true, true],
    "04.01",
  );
  equal(
    packagesOutsideMonorepoObj["eslint-plugin-row-num"].description,
    "ESLint plugin to update row numbers on each console.log",
    "04.02",
  );
  equal(
    packagesOutsideMonorepoObj["eslint-plugin-test-num"].description,
    "ESLint plugin to update unit test numbers automatically",
    "04.03",
  );
  equal(
    [...codsenPackagesOutsideWorkspace].sort(),
    [...packagesOutsideMonorepo, ...retired].sort(),
    "04.04",
  );
});

test("05 - rejects malformed workspace lists and invalid package names", () => {
  for (const names of [null, undefined, {}, new Set(["example"]), "example"]) {
    throws(() => createCodsenPackageLists(names), /must be an array/);
  }
  for (const name of [
    null,
    42,
    "",
    "has space",
    " ../escape",
    "../escape",
    "@scope",
    "@scope/../escape",
    "UpperCase",
    "a".repeat(215),
  ]) {
    throws(
      () => createCodsenPackageLists([name]),
      /Invalid Codsen workspace package name/,
    );
  }
});

test("06 - rejects duplicate inputs even when the package would be excluded", () => {
  for (const name of ["example", "@codsen/data", "bitsausage"]) {
    throws(
      () => createCodsenPackageLists([name, name]),
      /Duplicate Codsen workspace package name/,
    );
  }
});

test("07 - rejects collisions between workspace and external inventories", () => {
  for (const name of [
    "lect",
    "eslint-plugin-row-num",
    "array-of-arrays-into-ast",
  ]) {
    throws(
      () => createCodsenPackageLists([name]),
      /both a workspace and external/,
    );
  }
});

test("08 - never mutates input names, exported policy arrays or another result", () => {
  const names = ["zeta", "alpha"];
  const originalRetired = [...retired];
  const originalOutside = [...packagesOutsideMonorepo];
  const first = createCodsenPackageLists(names);
  const second = createCodsenPackageLists(names);
  first.all.length = 0;
  first.current.length = 0;
  first.historical.length = 0;
  first.deprecated.length = 0;
  first.retired.length = 0;
  first.inMonorepo.length = 0;
  first.outsideMonorepo.length = 0;
  first.packagesOutsideMonorepo.length = 0;
  equal(names, ["zeta", "alpha"], "08.01");
  equal(retired, originalRetired, "08.02");
  equal(packagesOutsideMonorepo, originalOutside, "08.03");
  equal(createCodsenPackageLists(names), second, "08.04");
});

test("09 - projects the real public catalogue without the auxiliary data workspace", () => {
  const names = readWorkspaceRecords(repositoryRoot)
    .filter(({ manifest }) => !manifest.private)
    .map(({ manifest }) => manifest.name);
  const result = createCodsenPackageLists(names);
  equal(result.all.length, 156, "09.01");
  equal(result.historical.length, 156, "09.02");
  equal(result.all.includes("@codsen/data"), false, "09.03");
  equal(result.all, [...result.all].sort(), "09.04");
  equal(result.packagesOutsideMonorepo.length, 28, "09.05");
  equal(result.inMonorepo.length, 95, "09.06");
  equal(result.outsideMonorepo.length, 61, "09.07");
  equal(result.retired.length, 33, "09.08");
  equal(result.deprecated.length, 24, "09.09");
  equal(result.deprecated.includes("posthtml-ast-compare"), false, "09.10");
  equal(result.retired.includes("posthtml-ast-compare"), true, "09.11");
  equal(result.current.length, 123, "09.12");
});

test("10 - npm deprecation is independent of location and Codsen retirement", () => {
  const snapshot = {
    schemaVersion: 1,
    registry: "https://registry.npmjs.org",
    checkedAt: "2026-09-20T00:00:00.000Z",
    packages: {
      example: {
        status: "available",
        version: "1.0.0",
        deprecated: "Use another version",
      },
    },
  };
  const result = createCodsenPackageLists(["example"], snapshot);
  equal(result.deprecated, ["example"], "10.01");
  equal(result.inMonorepo, ["example"], "10.02");
  equal(result.retired.includes("example"), false, "10.03");
  equal(result.current.includes("example"), true, "10.04");
});

test.run();
