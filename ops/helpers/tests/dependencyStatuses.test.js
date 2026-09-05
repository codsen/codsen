import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "uvu";
import { equal } from "uvu/assert";
import { normaliseDevDependencies } from "../../lect/plugins/pack.js";
import readme from "../../lect/plugins/readme.js";
import { dependencyStatuses } from "../dependencyStatuses.js";

test("01 - absent and empty dependency sets qualify for both markers", () => {
  equal(
    dependencyStatuses([
      { name: "zero", dependencies: {}, devDependencies: {} },
      { name: "absent" },
    ]),
    {
      noDependencies: ["absent", "zero"],
      noThirdPartyDependencies: ["absent", "zero"],
      thirdPartyDependencies: [],
    },
    "01.01",
  );
});

test("02 - both dependency sets are checked at every depth", () => {
  equal(
    dependencyStatuses([
      { name: "leaf" },
      { name: "own", dependencies: { leaf: "^1.0.0" } },
      { name: "own-dev", devDependencies: { own: "^1.0.0" } },
      { name: "external", dependencies: { third: "^1.0.0" } },
      {
        name: "external-dev",
        dependencies: {},
        devDependencies: { third: "^1.0.0" },
      },
      { name: "indirect", dependencies: { "external-dev": "^1.0.0" } },
      { name: "deep", devDependencies: { indirect: "^1.0.0" } },
    ]),
    {
      noDependencies: ["leaf"],
      noThirdPartyDependencies: ["leaf", "own", "own-dev"],
      thirdPartyDependencies: ["deep", "external", "external-dev", "indirect"],
    },
    "02.01",
  );
});

test("03 - internal cycles qualify until any member reaches an external dependency", () => {
  const manifests = [
    { name: "a", dependencies: { b: "*", c: "*" } },
    { name: "b", devDependencies: { a: "*" } },
    { name: "c" },
    { name: "consumer", dependencies: { b: "*" } },
  ];
  equal(
    dependencyStatuses(manifests),
    {
      noDependencies: ["c"],
      noThirdPartyDependencies: ["a", "b", "c", "consumer"],
      thirdPartyDependencies: [],
    },
    "03.01",
  );
  manifests[2].devDependencies = { third: "*" };
  equal(
    dependencyStatuses(manifests),
    {
      noDependencies: [],
      noThirdPartyDependencies: [],
      thirdPartyDependencies: ["a", "b", "c", "consumer"],
    },
    "03.02",
  );
  equal(
    dependencyStatuses([...manifests].reverse()),
    {
      noDependencies: [],
      noThirdPartyDependencies: [],
      thirdPartyDependencies: ["a", "b", "c", "consumer"],
    },
    "03.03",
  );
});

test("04 - shared dependency paths and duplicate edges retain every consumer", () => {
  equal(
    dependencyStatuses([
      { name: "leaf" },
      {
        name: "left",
        dependencies: { leaf: "*" },
        devDependencies: { leaf: "*" },
      },
      { name: "right", dependencies: { leaf: "*" } },
      { name: "top", dependencies: { left: "*", right: "*" } },
    ]),
    {
      noDependencies: ["leaf"],
      noThirdPartyDependencies: ["leaf", "left", "right", "top"],
      thirdPartyDependencies: [],
    },
    "04.01",
  );
});

test("05 - private packages are scanned but never advertised", () => {
  equal(
    dependencyStatuses([
      { name: "hidden", private: true, dependencies: { third: "*" } },
      { name: "empty-hidden", private: true },
      { name: "consumer", dependencies: { hidden: "*" } },
      { name: "unknown-codsen", dependencies: { "codsen-missing": "*" } },
    ]),
    {
      noDependencies: [],
      noThirdPartyDependencies: [],
      thirdPartyDependencies: ["consumer", "unknown-codsen"],
    },
    "05.01",
  );
});

test("06 - aliases and redirected sources do not inherit a local package's marker", () => {
  equal(
    dependencyStatuses([
      { name: "leaf" },
      { name: "alias", dependencies: { leaf: "npm:third@1" } },
      { name: "file", dependencies: { leaf: "file:../third" } },
      { name: "shorthand", dependencies: { leaf: "someone/third" } },
      { name: "gitlab", dependencies: { leaf: "gitlab:someone/third" } },
      {
        name: "duplicate",
        dependencies: { leaf: "*" },
        devDependencies: { leaf: "npm:third@1" },
      },
    ]),
    {
      noDependencies: ["leaf"],
      noThirdPartyDependencies: ["leaf"],
      thirdPartyDependencies: [
        "alias",
        "duplicate",
        "file",
        "gitlab",
        "shorthand",
      ],
    },
    "06.01",
  );
});

test("07 - lect projects dev-dependency cleanup without mutating manifests", () => {
  const manifests = [
    { name: "consumer", dependencies: { leaf: "*" } },
    { name: "leaf", devDependencies: { tool: "*" } },
  ];
  const before = structuredClone(manifests);
  const projected = manifests.map((manifest) =>
    normaliseDevDependencies(manifest, {
      devDependencies: { tool: "*" },
    }),
  );
  equal(
    dependencyStatuses(projected),
    {
      noDependencies: ["leaf"],
      noThirdPartyDependencies: ["consumer", "leaf"],
      thirdPartyDependencies: [],
    },
    "07.01",
  );
  equal(manifests, before, "07.02");
});

test("08 - generated READMEs show the strongest marker and remove stale claims", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "dependency-statuses-"));
  const state = {
    root,
    currentYear: 2026,
    pack: { name: "example", description: "Example" },
    packageManifests: [{ name: "leaf" }],
  };
  const filename = path.join(root, "README.md");
  try {
    await readme({ state });
    equal(
      readFileSync(filename, "utf8").includes(
        "**No dependencies whatsoever.**",
      ),
      true,
      "08.01",
    );
    equal(
      readFileSync(filename, "utf8").includes("**No 3rd party dependencies.**"),
      false,
      "08.02",
    );
    state.pack.dependencies = { leaf: "*" };
    await readme({ state });
    equal(
      readFileSync(filename, "utf8").includes("**No 3rd party dependencies.**"),
      true,
      "08.03",
    );
    equal(
      readFileSync(filename, "utf8").includes(
        "**No dependencies whatsoever.**",
      ),
      false,
      "08.04",
    );
    state.packageManifests[0].devDependencies = { third: "*" };
    await readme({ state });
    equal(
      readFileSync(filename, "utf8").includes("**No 3rd party dependencies.**"),
      false,
      "08.05",
    );
    await readme({ state, mode: "check" });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test.run();
