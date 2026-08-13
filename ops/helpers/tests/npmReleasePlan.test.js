import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";

import {
  buildLayers,
  DEPENDENCY_FIELDS,
  PLAN_KIND,
  planProjection,
  RELEASE_SCHEMA_VERSION,
  releasePackages,
  releaseSummary,
  validatePlan,
  versionChange,
} from "../npmReleasePlan.js";

const sha = (character) => character.repeat(40);

function plan(packages, layers) {
  return {
    baseRef: "main",
    baseSha: sha("a"),
    createdAt: "2026-08-14T00:00:00.000Z",
    dependencyFields: DEPENDENCY_FIELDS,
    kind: PLAN_KIND,
    layers,
    packages,
    plannedAtSha: sha("b"),
    preparedTreeSha256: "c".repeat(64),
    schemaVersion: RELEASE_SCHEMA_VERSION,
    selectedCount: packages.length,
    workspaceCount: 3,
  };
}

function selected(name, dependencies = {}, baseVersion = "1.0.0") {
  return {
    baseVersion,
    directory: name === "@codsen/data" ? "data" : `packages/${name}`,
    manifest: { dependencies, name },
    name,
    version: "1.0.1",
  };
}

test("01 - creates sorted dependency layers and publishes data last", () => {
  const result = releasePackages([
    selected("consumer", { helper: "^1.0.0" }),
    selected("@codsen/data"),
    selected("helper"),
  ]);

  equal(result.layers, [["helper"], ["consumer"], ["@codsen/data"]], "01.01");
  equal(
    result.packages.map(({ dependencies, layer, name }) => ({
      dependencies,
      layer,
      name,
    })),
    [
      { dependencies: [], layer: 2, name: "@codsen/data" },
      { dependencies: ["helper"], layer: 1, name: "consumer" },
      { dependencies: [], layer: 0, name: "helper" },
    ],
    "01.02",
  );
});

test("02 - rejects cycles, duplicate names, and dependencies on data", () => {
  throws(
    () =>
      buildLayers([
        { dependencies: ["b"], name: "a" },
        { dependencies: ["a"], name: "b" },
      ]),
    /dependency cycle/,
    "02.01",
  );
  throws(
    () =>
      buildLayers([
        { dependencies: [], name: "a" },
        { dependencies: [], name: "a" },
      ]),
    /unique names/,
    "02.02",
  );
  throws(
    () =>
      buildLayers([
        { dependencies: ["@codsen/data"], name: "consumer" },
        { dependencies: [], name: "@codsen/data" },
      ]),
    /must publish last/,
    "02.03",
  );
});

test("03 - validates an exact, sorted release-plan schema", () => {
  const packages = [
    {
      baseVersion: "1.0.0",
      dependencies: [],
      directory: "packages/example",
      layer: 0,
      name: "example",
      version: "1.0.1",
    },
  ];
  const value = plan(packages, [["example"]]);

  equal(validatePlan(value, { repositoryRoot: "/fixture" }), value, "03.01");
  equal(
    Object.keys(planProjection(value)),
    [
      "baseSha",
      "dependencyFields",
      "layers",
      "packages",
      "preparedTreeSha256",
      "selectedCount",
      "workspaceCount",
    ],
    "03.02",
  );
  throws(
    () =>
      validatePlan(
        { ...value, unexpected: true },
        { repositoryRoot: "/fixture" },
      ),
    /contain exactly/,
    "03.03",
  );
  throws(
    () =>
      validatePlan(
        {
          ...value,
          packages: [{ ...packages[0], directory: "..\\escape" }],
        },
        { repositoryRoot: "/fixture" },
      ),
    /repository-relative POSIX path/,
    "03.04",
  );
});

test("04 - classifies stable and prerelease version changes", () => {
  equal(
    [
      versionChange(null, "1.0.0", "example"),
      versionChange("1.0.0", "2.0.0", "example"),
      versionChange("1.0.0", "1.1.0-beta.1", "example"),
      versionChange("1.0.0-beta.1", "1.0.0-beta.2", "example"),
      versionChange("1.0.0-beta.2", "1.0.0", "example"),
    ],
    ["new", "major", "preminor", "prerelease", "stable"],
    "04.01",
  );
  throws(() => versionChange("2.0.0", "1.0.0", "example"), /lowers/, "04.02");
  throws(
    () => versionChange("1.0.0+one", "1.0.0+two", "example"),
    /equal-precedence/,
    "04.03",
  );
});

test("05 - renders a bounded Markdown-safe summary from the plan", () => {
  const packages = [
    {
      baseVersion: "1.0.0",
      dependencies: [],
      directory: "packages/example",
      layer: 0,
      name: "example&<unsafe>|",
      version: "1.0.1",
    },
  ];
  const summary = releaseSummary(plan(packages, [["example&<unsafe>|"]]));

  match(summary, /<code>example&amp;&lt;unsafe&gt;&#124;<\/code>/, "05.01");
  match(summary, /1 patch/, "05.02");
  match(summary, /npm-production/, "05.03");
});

test.run();
