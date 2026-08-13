import { test } from "uvu";
import { equal, match } from "uvu/assert";

import {
  coverageConfigForPackage,
  validateCoveragePolicy,
} from "../coveragePolicy.js";

function policy() {
  return {
    profiles: {
      default: {
        "check-coverage": true,
        exclude: ["**/test/**/*.*"],
        lines: 100,
      },
      cli: { all: true },
      rollup: { all: true, include: ["dist/*.esm.js"] },
      full: { branches: 100, functions: 100, statements: 100 },
    },
    fullCoveragePackages: ["strict-package"],
    packageOverrides: {
      "strict-package": { reporter: ["text", "text-summary"] },
    },
    workspaceExemptions: {},
    waivers: {
      "waived-cli": {
        config: { lines: 80 },
        reason: "Subprocess coverage has known gaps.",
        followUp: "Add cases and remove the waiver.",
      },
    },
  };
}

function record(name, { bin = false, c8, isRollup = true } = {}) {
  const manifest = { name };
  if (bin) {
    manifest.bin = { [name]: "cli.js" };
  }
  manifest.c8 =
    c8 ?? coverageConfigForPackage(policy(), manifest, { isRollup });
  return { directory: `packages/${name}`, isRollup, manifest };
}

test("01 - resolves default, Rollup, full, override, CLI, and waiver layers", () => {
  equal(
    coverageConfigForPackage(
      policy(),
      { name: "default-package" },
      { isRollup: true },
    ),
    {
      "check-coverage": true,
      exclude: ["**/test/**/*.*"],
      lines: 100,
      all: true,
      include: ["dist/*.esm.js"],
    },
    "01.01",
  );
  equal(
    coverageConfigForPackage(
      policy(),
      { name: "strict-package" },
      { isRollup: true },
    ),
    {
      "check-coverage": true,
      exclude: ["**/test/**/*.*"],
      lines: 100,
      all: true,
      include: ["dist/*.esm.js"],
      branches: 100,
      functions: 100,
      statements: 100,
      reporter: ["text", "text-summary"],
    },
    "01.02",
  );
  equal(
    coverageConfigForPackage(
      policy(),
      {
        name: "waived-cli",
        bin: { waived: "cli.js" },
      },
      { isRollup: false },
    ),
    {
      "check-coverage": true,
      exclude: ["**/test/**/*.*"],
      lines: 80,
      all: true,
    },
    "01.03",
  );
});

test("02 - accepts matching package configs and documented waivers", () => {
  const records = [
    record("default-package"),
    record("strict-package"),
    record("waived-cli", { bin: true, isRollup: false }),
  ];

  equal(
    validateCoveragePolicy({ policy: policy(), records }).errors,
    [],
    "02.01",
  );
});

test("03 - reports manifest drift and unknown policy package names", () => {
  const currentPolicy = policy();
  currentPolicy.fullCoveragePackages.push("removed-package");
  const records = [
    record("default-package", { c8: { "check-coverage": false } }),
    record("strict-package"),
    record("waived-cli", { bin: true, isRollup: false }),
  ];
  const message = validateCoveragePolicy({
    policy: currentPolicy,
    records,
  }).errors.join("\n");

  match(message, /unknown package removed-package/, "03.01");
  match(message, /default-package: c8 config differs/, "03.02");
});

test("04 - rejects undocumented and non-enforcing waivers", () => {
  const currentPolicy = policy();
  currentPolicy.waivers["waived-cli"] = {
    config: { "check-coverage": false, lines: 100 },
    reason: "",
    followUp: "",
  };
  const records = [
    record("default-package"),
    record("strict-package"),
    record("waived-cli", { bin: true, isRollup: false }),
  ];
  const message = validateCoveragePolicy({
    policy: currentPolicy,
    records,
  }).errors.join("\n");

  match(message, /reason must document/, "04.01");
  match(message, /followUp must document/, "04.02");
  match(message, /contains non-threshold keys/, "04.03");
  match(message, /must lower an applicable threshold/, "04.04");
});

test("05 - rejects a CLI-family profile that can pass at zero files", () => {
  const currentPolicy = policy();
  currentPolicy.profiles.cli = {};
  const records = [
    record("default-package"),
    record("strict-package"),
    record("waived-cli", { isRollup: false }),
  ];
  const message = validateCoveragePolicy({
    policy: currentPolicy,
    records,
  }).errors.join("\n");

  match(message, /profiles.cli must set all=true/, "05.01");
  match(message, /resolved CLI-family config must set all=true/, "05.02");
});

test("06 - package overrides cannot bypass coverage enforcement", () => {
  const currentPolicy = policy();
  currentPolicy.packageOverrides["strict-package"] = {
    "check-coverage": false,
    lines: 0,
  };
  const records = [
    record("default-package"),
    record("strict-package", {
      c8: coverageConfigForPackage(
        currentPolicy,
        { name: "strict-package" },
        { isRollup: true },
      ),
    }),
    record("waived-cli", { isRollup: false }),
  ];
  const message = validateCoveragePolicy({
    policy: currentPolicy,
    records,
  }).errors.join("\n");

  match(message, /contains unsupported keys/, "06.01");
  match(message, /resolved coverage checks must be enabled/, "06.02");
  match(message, /resolved line threshold must be positive/, "06.03");
});

test("07 - full-profile waivers lower an applicable metric", () => {
  const currentPolicy = policy();
  currentPolicy.waivers["strict-package"] = {
    config: { branches: 90 },
    reason: "One branch is not yet covered.",
    followUp: "Add the missing case and remove the waiver.",
  };
  const strictManifest = { name: "strict-package" };
  const records = [
    record("default-package"),
    record("strict-package", {
      c8: coverageConfigForPackage(currentPolicy, strictManifest, {
        isRollup: true,
      }),
    }),
    record("waived-cli", { isRollup: false }),
  ];

  equal(
    validateCoveragePolicy({ policy: currentPolicy, records }).errors,
    [],
    "07.01",
  );
});

test("08 - rejects Rollup discovery that can pass at zero files", () => {
  const currentPolicy = policy();
  currentPolicy.profiles.rollup.include.push("!dist/*.esm.js");
  const records = [
    record("default-package"),
    record("strict-package"),
    record("waived-cli", { isRollup: false }),
  ];
  const message = validateCoveragePolicy({
    policy: currentPolicy,
    records,
  }).errors.join("\n");

  match(message, /profiles.rollup must set all=true/, "08.01");
  match(message, /resolved Rollup config must discover/, "08.02");
});

test("09 - rejects exclusion bypasses and missing family classification", () => {
  const currentPolicy = policy();
  currentPolicy.packageOverrides["strict-package"] = {
    exclude: ["**"],
  };
  currentPolicy.profiles.cli.exclude = ["**"];
  currentPolicy.waivers["waived-cli"].config.exclude = ["**"];
  const records = [
    record("default-package"),
    record("strict-package"),
    { directory: "packages/unclassified", manifest: { name: "unclassified" } },
    record("waived-cli", { isRollup: false }),
  ];
  const message = validateCoveragePolicy({
    policy: currentPolicy,
    records,
  }).errors.join("\n");

  match(message, /profiles.cli contains unsupported keys: exclude/, "09.01");
  match(message, /packageOverrides.*unsupported keys: exclude/, "09.02");
  match(message, /contains non-threshold keys: exclude/, "09.03");
  match(message, /unclassified: isRollup must be a boolean/, "09.04");
});

test("10 - requires every non-package workspace to be documented", () => {
  const currentPolicy = policy();
  const records = [
    record("default-package"),
    record("strict-package"),
    record("waived-cli", { isRollup: false }),
  ];
  const generatedWorkspace = {
    directory: "data",
    isRollup: false,
    manifest: { name: "@example/data" },
  };
  let message = validateCoveragePolicy({
    policy: currentPolicy,
    records,
    workspaceRecords: [...records, generatedWorkspace],
  }).errors.join("\n");

  match(
    message,
    /workspace is neither covered nor explicitly exempted/,
    "10.01",
  );

  currentPolicy.workspaceExemptions["@example/data"] = {
    reason: "Generated data is verified separately.",
    followUp: "Add coverage if runtime logic is introduced.",
  };
  message = validateCoveragePolicy({
    policy: currentPolicy,
    records,
    workspaceRecords: [...records, generatedWorkspace],
  }).errors.join("\n");

  equal(message, "", "10.02");
});

test("11 - rejects a weakened default line threshold", () => {
  const currentPolicy = policy();
  currentPolicy.profiles.default.lines = 1;
  const records = [
    record("default-package"),
    record("strict-package"),
    record("waived-cli", { isRollup: false }),
  ];
  const message = validateCoveragePolicy({
    policy: currentPolicy,
    records,
  }).errors.join("\n");

  match(message, /profiles.default.lines must be 100/, "11.01");
});

test.run();
