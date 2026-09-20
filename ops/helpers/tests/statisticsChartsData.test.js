import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import { retired } from "../codsenPackages.js";
import {
  assertLockedWorkspaceDependencies,
  completeInterdeps,
  parseInterdepsSource,
} from "../statisticsChartsData.js";

const records = [
  {
    manifest: {
      name: "chart-app",
      dependencies: {
        "chart-leaf": "^1",
        "codsen-parser": "^1",
        external: "^1",
      },
    },
  },
  { manifest: { name: "chart-leaf" } },
  { manifest: { name: "chart-isolate" } },
  { manifest: { name: "@codsen/data" } },
];
const source = [
  { name: "chart-app", imports: ["chart-leaf", "codsen-parser"] },
  { name: "chart-leaf", imports: [] },
];

test("01 - reads generated data without executing source", () => {
  equal(
    parseInterdepsSource(
      `export const interdeps = ${JSON.stringify(source)};\n`,
    ),
    source,
    "01.01",
  );
  throws(() => parseInterdepsSource("export const interdeps = (() => [])();"));
  throws(() => parseInterdepsSource("export const interdeps = {};"));
});

test("02 - restores isolates and explicitly unknown outside-checkout nodes", () => {
  const graph = completeInterdeps(source, records);
  equal(
    graph.find((node) => node.name === "chart-isolate"),
    { name: "chart-isolate", imports: [], unknownImports: false },
    "02.01",
  );
  equal(
    graph.find((node) => node.name === "codsen-parser"),
    { name: "codsen-parser", imports: [], unknownImports: true },
    "02.02",
  );
  equal(
    graph.some(
      (node) => node.name === "@codsen/data" || node.name === "external",
    ),
    false,
    "02.03",
  );
  equal(
    graph.find((node) => node.name === "chart-app").imports,
    ["chart-leaf", "codsen-parser"],
    "02.04",
  );
  equal(
    graph.filter((node) => retired.includes(node.name)),
    [],
    "02.05",
  );
});

test("03 - refuses stale or duplicated source edges", () => {
  throws(() => completeInterdeps(source.slice(1), records), /stale/);
  throws(() => completeInterdeps([...source, source[0]], records), /duplicate/);
  throws(
    () =>
      completeInterdeps(
        [{ ...source[0], imports: ["chart-leaf"] }, source[1]],
        records,
      ),
    /stale/,
  );
});

test("04 - catalogue order is independent of source and filesystem order", () => {
  equal(
    completeInterdeps([...source].reverse(), [...records].reverse()),
    completeInterdeps(source, records),
    "04.01",
  );
});

test("05 - adds optional workspace edges absent from the generated source contract", () => {
  const optionalRecords = records.map((record) => ({
    manifest: { ...record.manifest },
  }));
  optionalRecords[2].manifest.optionalDependencies = { "chart-leaf": "^1" };
  const graph = completeInterdeps(source, optionalRecords);
  equal(
    graph.find((node) => node.name === "chart-isolate").imports,
    ["chart-leaf"],
    "05.01",
  );
});

test("06 - refuses stale production or optional lockfile declarations", () => {
  const workspaces = [
    {
      directory: "packages/chart-app",
      manifest: {
        name: "chart-app",
        dependencies: { external: "^2" },
        optionalDependencies: { optional: "^1" },
      },
    },
  ];
  const locked = {
    "packages/chart-app": {
      dependencies: { external: "^1" },
      optionalDependencies: { optional: "^1" },
    },
  };
  throws(
    () => assertLockedWorkspaceDependencies(workspaces, locked),
    /lockfile/,
  );
  locked["packages/chart-app"].dependencies.external = "^2";
  locked["packages/chart-app"].optionalDependencies.optional = "^2";
  throws(
    () => assertLockedWorkspaceDependencies(workspaces, locked),
    /lockfile/,
  );
  throws(() => assertLockedWorkspaceDependencies(workspaces, {}), /lockfile/);
  locked["packages/chart-app"].optionalDependencies.optional = "^1";
  equal(
    assertLockedWorkspaceDependencies(workspaces, locked),
    undefined,
    "06.01",
  );
});

test("07 - accepts reordered lockfile declarations and current workspace versions", () => {
  equal(
    assertLockedWorkspaceDependencies(
      [
        {
          directory: "packages/chart-app",
          manifest: {
            name: "chart-app",
            version: "2.0.0",
            dependencies: { beta: "^1", alpha: "^1" },
            devDependencies: { test: "^2" },
          },
        },
      ],
      {
        "packages/chart-app": {
          version: "1.0.0",
          dependencies: { alpha: "^1", beta: "^1" },
          devDependencies: { test: "^1" },
        },
      },
    ),
    undefined,
    "07.01",
  );
});

test.run();
