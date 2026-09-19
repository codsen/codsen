import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  catalogueExclusions,
  codsenPackagesOutsideWorkspace,
  createCodsenPackageLists,
  deprecated,
  packagesOutsideMonorepo,
  packagesOutsideMonorepoObj,
} from "../codsenPackages.js";
import { readWorkspaceRecords } from "../workspaceInventoryFile.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

test("01 - returns sorted current products and a separate historical union", () => {
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
  equal(result.all, expected, "01.01");
  equal(result.current, expected, "01.02");
  equal(result.historical, [...expected, ...deprecated].sort(), "01.03");
  equal(result.deprecated, [...deprecated].sort(), "01.04");
  equal(
    result.packagesOutsideMonorepo,
    [...packagesOutsideMonorepo].sort(),
    "01.05",
  );
  equal(new Set(result.historical).size, result.historical.length, "01.06");
});

test("02 - excludes auxiliary, test, third-party and unpublished alias names", () => {
  const excluded = Object.keys(catalogueExclusions);
  const result = createCodsenPackageLists(["example", ...excluded]);
  equal(result.all, ["example", ...packagesOutsideMonorepo].sort(), "02.01");
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

test("03 - retains retired packages in historical ownership without listing them as products", () => {
  const result = createCodsenPackageLists(["example", ...deprecated]);
  equal(
    result.all.some((name) => deprecated.includes(name)),
    false,
    "03.01",
  );
  equal(
    deprecated.every((name) => result.historical.includes(name)),
    true,
    "03.02",
  );
  equal(result.deprecated.length, 19, "03.03");
  equal(
    deprecated.every((name) => codsenPackagesOutsideWorkspace.has(name)),
    true,
    "03.04",
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
    [...packagesOutsideMonorepo, ...deprecated].sort(),
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
  const originalDeprecated = [...deprecated];
  const originalOutside = [...packagesOutsideMonorepo];
  const first = createCodsenPackageLists(names);
  const second = createCodsenPackageLists(names);
  first.all.length = 0;
  first.current.length = 0;
  first.historical.length = 0;
  first.deprecated.length = 0;
  first.packagesOutsideMonorepo.length = 0;
  equal(names, ["zeta", "alpha"], "08.01");
  equal(deprecated, originalDeprecated, "08.02");
  equal(packagesOutsideMonorepo, originalOutside, "08.03");
  equal(createCodsenPackageLists(names), second, "08.04");
});

test("09 - projects the real public catalogue without the auxiliary data workspace", () => {
  const names = readWorkspaceRecords(repositoryRoot)
    .filter(({ manifest }) => !manifest.private)
    .map(({ manifest }) => manifest.name);
  const result = createCodsenPackageLists(names);
  equal(result.all.length, 137, "09.01");
  equal(result.historical.length, 156, "09.02");
  equal(result.all.includes("@codsen/data"), false, "09.03");
  equal(result.all, [...result.all].sort(), "09.04");
  equal(result.packagesOutsideMonorepo.length, 28, "09.05");
});

test.run();
