import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";

import {
  eligiblePackageNamesForMajor,
  githubActionsNodeMatrix,
  runtimeDependencyClosureNames,
  supportedNodeEngines,
  validateNodeCompatibility,
  validateUnchangedNodeEngines,
} from "../nodeCompatibility.js";

function record(
  name,
  { dependencies = {}, devDependencies = {}, engine = ">=18.20.8" } = {},
) {
  return {
    directory: `packages/${name}`,
    manifest: {
      name,
      dependencies,
      devDependencies,
      engines: { node: engine },
    },
  };
}

function lockPackages(records) {
  return Object.fromEntries(
    records.map((item) => [
      item.directory,
      { engines: { node: item.manifest.engines.node } },
    ]),
  );
}

test("01 - accepts exact floors, compatible internal edges and lock parity", () => {
  const records = [
    record("node18-helper"),
    record("node20-consumer", {
      dependencies: { "node18-helper": "^1.0.0" },
      engine: ">=20.19.4",
    }),
    record("node24-package", { engine: ">=24.19.0" }),
  ];
  const { eligibleByMajor, errors } = validateNodeCompatibility({
    records,
    lockPackages: lockPackages(records),
  });

  equal(errors, [], "01.01");
  equal(eligibleByMajor[18], ["node18-helper"], "01.02");
  equal(eligibleByMajor[20], ["node18-helper", "node20-consumer"], "01.03");
  equal(eligibleByMajor[26].length, 3, "01.04");
});

test("02 - reports unsupported floors, incompatible edges and lock drift", () => {
  const records = [
    record("low-consumer", {
      dependencies: { "high-dependency": "^1.0.0" },
    }),
    record("high-dependency", { engine: ">=22.21.1" }),
    record("unsupported-floor", { engine: ">=20" }),
  ];
  const locks = lockPackages(records);
  locks["packages/low-consumer"].engines.node = ">=18";
  const { errors } = validateNodeCompatibility({
    records,
    lockPackages: locks,
  });
  const message = errors.join("\n");

  match(message, /runtime depends on high-dependency/, "02.01");
  match(message, /must be one of/, "02.02");
  match(message, /package-lock engine/, "02.03");
});

test("03 - eligibility rejects a CI major outside the supported matrix", () => {
  throws(
    () => eligiblePackageNamesForMajor([record("example")], 19),
    /must be one of 18, 20, 22, 24, 26/,
    "03.01",
  );
});

test("04 - supported engine declarations remain exact and intentional", () => {
  equal(
    [...supportedNodeEngines],
    [
      [18, ">=18.20.8"],
      [20, ">=20.19.4"],
      [22, ">=22.21.1"],
      [24, ">=24.19.0"],
      [26, ">=26.7.0"],
    ],
    "04.01",
  );
});

test("05 - GitHub Actions matrix is derived from exact supported engines", () => {
  equal(
    githubActionsNodeMatrix(),
    {
      include: [
        { "node-version": "18.20.8", "node-major": 18 },
        { "node-version": "20.19.4", "node-major": 20 },
        { "node-version": "22.21.1", "node-major": 22 },
        { "node-version": "24.19.0", "node-major": 24 },
        { "node-version": "26.7.0", "node-major": 26 },
      ],
    },
    "05.01",
  );
  equal(githubActionsNodeMatrix().include.length, 5, "05.02");
});

test("06 - matrix starts at the lowest package floor and remains cumulative", () => {
  equal(
    githubActionsNodeMatrix([
      record("node20-package", { engine: ">=20.19.4" }),
      record("node24-package", { engine: ">=24.19.0" }),
    ]),
    {
      include: [
        { "node-version": "20.19.4", "node-major": 20 },
        { "node-version": "22.21.1", "node-major": 22 },
        { "node-version": "24.19.0", "node-major": 24 },
        { "node-version": "26.7.0", "node-major": 26 },
      ],
    },
    "06.01",
  );
});

test("07 - matrix rejects empty or unsupported package inventories", () => {
  throws(() => githubActionsNodeMatrix([]), /without packages/, "07.01");
  throws(
    () =>
      githubActionsNodeMatrix([record("imprecise-floor", { engine: ">=20" })]),
    /unsupported engine/,
    "07.02",
  );
});

test("08 - automated dependency updates must preserve every Node floor", () => {
  const baseRecords = [
    record("alpha"),
    record("beta", { engine: ">=20.19.4" }),
    {
      directory: ".",
      manifest: { name: "root", engines: { node: ">=24.19.0" } },
    },
  ];
  equal(
    validateUnchangedNodeEngines({
      baseRecords,
      currentRecords: structuredClone(baseRecords),
    }),
    [],
    "08.01",
  );

  const currentRecords = structuredClone(baseRecords);
  currentRecords[0].manifest.engines.node = ">=20.19.4";
  currentRecords[1].manifest.engines = {};
  currentRecords.pop();
  currentRecords.push(record("gamma"));
  equal(
    validateUnchangedNodeEngines({ baseRecords, currentRecords }),
    [
      "package.json: package was removed; automated dependency updates must not change the package inventory",
      "packages/alpha/package.json: engines.node changed from >=18.20.8 to >=20.19.4; automated dependency updates must preserve Node floors",
      "packages/beta/package.json: engines.node changed from >=20.19.4 to <missing>; automated dependency updates must preserve Node floors",
      "packages/gamma/package.json: package was added; automated dependency updates must not change the package inventory",
    ],
    "08.02",
  );
  throws(
    () =>
      validateUnchangedNodeEngines({
        baseRecords: [record("alpha"), record("alpha")],
        currentRecords: [],
      }),
    /duplicate directory packages\/alpha/,
    "08.03",
  );
});

test("09 - closes internal runtime dependencies deterministically", () => {
  const records = [
    record("z-cli", {
      dependencies: { alpha: "^1.0.0", external: "^1.0.0" },
      devDependencies: { "dev-only": "^1.0.0" },
    }),
    {
      directory: "packages/alpha",
      manifest: {
        name: "alpha",
        optionalDependencies: { beta: "^1.0.0" },
      },
    },
    {
      directory: "packages/beta",
      manifest: {
        name: "beta",
        peerDependencies: { gamma: "^1.0.0" },
      },
    },
    record("gamma", { dependencies: { alpha: "^1.0.0" } }),
    record("dev-only"),
    record("codsen-glob"),
  ];
  const expected = ["alpha", "beta", "codsen-glob", "gamma", "z-cli"];

  equal(
    runtimeDependencyClosureNames(records, ["z-cli", "codsen-glob"]),
    expected,
    "09.01",
  );
  equal(
    runtimeDependencyClosureNames(records.toReversed(), [
      "codsen-glob",
      "z-cli",
    ]),
    expected,
    "09.02",
  );
});

test("10 - rejects invalid and duplicate package records", () => {
  throws(
    () => runtimeDependencyClosureNames(undefined, ["alpha"]),
    /records must be a non-empty array/,
    "10.01",
  );
  throws(
    () => runtimeDependencyClosureNames([null], ["alpha"]),
    /invalid package record at index 0/,
    "10.02",
  );
  throws(
    () =>
      runtimeDependencyClosureNames(
        [record("alpha"), record("alpha")],
        ["alpha"],
      ),
    /duplicate package alpha/,
    "10.03",
  );
  const invalidDependencies = record("alpha");
  invalidDependencies.manifest.optionalDependencies = [];
  throws(
    () => runtimeDependencyClosureNames([invalidDependencies], ["alpha"]),
    /alpha has invalid optionalDependencies/,
    "10.04",
  );
  const duplicateDirectory = record("beta");
  duplicateDirectory.directory = "packages/alpha";
  throws(
    () =>
      runtimeDependencyClosureNames(
        [record("alpha"), duplicateDirectory],
        ["alpha"],
      ),
    /duplicate directory packages\/alpha/,
    "10.05",
  );
});

test("11 - rejects invalid, duplicate, and missing closure seeds", () => {
  const records = [record("alpha")];
  throws(
    () => runtimeDependencyClosureNames(records),
    /seeds must be a non-empty array of package names/,
    "11.01",
  );
  throws(
    () => runtimeDependencyClosureNames(records, [42]),
    /seeds must be a non-empty array of package names/,
    "11.02",
  );
  throws(
    () => runtimeDependencyClosureNames(records, ["alpha", "alpha"]),
    /seeds must be unique/,
    "11.03",
  );
  throws(
    () => runtimeDependencyClosureNames(records, ["missing"]),
    /seed missing is not a workspace package/,
    "11.04",
  );
});

test.run();
