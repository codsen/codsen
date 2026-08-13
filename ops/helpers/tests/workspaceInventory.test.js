import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";

import {
  normaliseWorkspacePattern,
  validateWorkspacePatterns,
  workspacePatterns,
} from "../workspaceInventory.js";
import {
  expandWorkspacePatterns,
  readWorkspaceRecords,
} from "../workspaceInventoryFile.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

function writeJson(filename, value) {
  mkdirSync(path.dirname(filename), { recursive: true });
  writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`);
}

function createFixture({
  lernaPackages = ["packages/*", "data"],
  packages = [
    ["packages/example", { name: "example", version: "1.0.0" }],
    ["data", { name: "@example/data", version: "1.0.0" }],
  ],
  workspaces = ["packages/*", "data/"],
} = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "workspace-inventory-"));
  writeJson(path.join(root, "package.json"), { name: "fixture", workspaces });
  writeJson(path.join(root, "lerna.json"), { packages: lernaPackages });
  for (const [directory, manifest] of packages) {
    writeJson(path.join(root, directory, "package.json"), manifest);
  }
  return root;
}

function withFixture(options, callback) {
  const root = createFixture(options);
  try {
    callback(root);
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
}

test("01 - supports both npm workspace forms", () => {
  equal(
    workspacePatterns({ workspaces: ["packages/*"] }, "workspaces"),
    ["packages/*"],
    "01.01",
  );
  equal(
    workspacePatterns(
      { workspaces: { packages: ["packages/*"] } },
      "workspaces",
    ),
    ["packages/*"],
    "01.02",
  );
  withFixture({ workspaces: { packages: ["packages/*", "data/"] } }, (root) => {
    equal(
      readWorkspaceRecords(root).map(({ directory, manifest }) => [
        directory,
        manifest.name,
      ]),
      [
        ["data", "@example/data"],
        ["packages/example", "example"],
      ],
      "01.03",
    );
  });
});

test("02 - expands one-level globs and deduplicates overlapping patterns", () => {
  withFixture({}, (root) => {
    mkdirSync(path.join(root, "packages/no-manifest"), { recursive: true });
    equal(
      expandWorkspacePatterns(
        root,
        ["packages/*", "packages/example", "missing"],
        "workspaces",
      ),
      ["packages/example"],
      "02.01",
    );
  });
});

test("03 - rejects unsafe and unsupported workspace patterns", () => {
  for (const [index, pattern] of [
    "/absolute",
    "../outside",
    "packages\\*",
    "packages/**",
    "packages/example?",
    "packages/[ab]",
    "packages/{a,b}",
    "packages/!(example)",
    "!packages/example",
  ].entries()) {
    throws(
      () => normaliseWorkspacePattern(pattern, "workspaces"),
      /unsafe|unsupported/,
      `03.${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("04 - rejects malformed npm and Lerna workspace lists", () => {
  throws(
    () => workspacePatterns({ workspaces: "packages/*" }, "npm workspaces"),
    /npm workspaces must provide a string array/,
    "04.01",
  );
  throws(
    () => validateWorkspacePatterns([42], "lerna.json packages"),
    /lerna\.json packages must provide a string array/,
    "04.02",
  );
});

test("05 - rejects duplicate workspace package names", () => {
  withFixture(
    {
      packages: [
        ["packages/one", { name: "duplicate", version: "1.0.0" }],
        ["packages/two", { name: "duplicate", version: "1.0.0" }],
        ["data", { name: "@example/data", version: "1.0.0" }],
      ],
    },
    (root) => {
      throws(
        () => readWorkspaceRecords(root),
        /Duplicate workspace package name duplicate in packages\/one and packages\/two/,
        "05.01",
      );
    },
  );
});

test("06 - rejects missing and blank workspace package names", () => {
  for (const [index, name] of [undefined, "   "].entries()) {
    withFixture(
      {
        packages: [
          ["packages/example", { name, version: "1.0.0" }],
          ["data", { name: "@example/data", version: "1.0.0" }],
        ],
      },
      (root) => {
        throws(
          () => readWorkspaceRecords(root),
          /Workspace has no package name: packages\/example/,
          `06.${String(index + 1).padStart(2, "0")}`,
        );
      },
    );
  }
});

test("07 - reports npm and Lerna workspace disagreement", () => {
  withFixture({ lernaPackages: ["packages/*"] }, (root) => {
    throws(
      () => readWorkspaceRecords(root),
      /npm\/Lerna workspace mismatch \(npm-only: data; Lerna-only: none\)/,
      "07.01",
    );
  });
});

test("08 - reports missing and malformed inventory JSON", () => {
  const missingRoot = mkdtempSync(path.join(tmpdir(), "workspace-inventory-"));
  try {
    throws(
      () => readWorkspaceRecords(missingRoot),
      /root package\.json does not exist/,
      "08.01",
    );
  } finally {
    rmSync(missingRoot, { force: true, recursive: true });
  }

  withFixture({}, (root) => {
    writeFileSync(path.join(root, "lerna.json"), "{");
    throws(
      () => readWorkspaceRecords(root),
      /lerna\.json is not valid JSON/,
      "08.02",
    );
  });
  withFixture({}, (root) => {
    writeFileSync(path.join(root, "package.json"), "null\n");
    throws(
      () => readWorkspaceRecords(root),
      /root package\.json must be an object/,
      "08.03",
    );
  });
  withFixture({}, (root) => {
    writeFileSync(path.join(root, "lerna.json"), "null\n");
    throws(
      () => readWorkspaceRecords(root),
      /lerna\.json must be an object/,
      "08.04",
    );
  });
  withFixture({}, (root) => {
    writeFileSync(path.join(root, "packages/example/package.json"), "null\n");
    throws(
      () => readWorkspaceRecords(root),
      /packages\/example\/package\.json must be an object/,
      "08.05",
    );
  });
});

test("09 - returns the current repository inventory in stable order", () => {
  const records = readWorkspaceRecords(repositoryRoot);
  const names = records.map(({ manifest }) => manifest.name);

  equal(records.length > 0, true, "09.01");
  equal(names, [...names].sort(), "09.02");
  equal(new Set(names).size, names.length, "09.03");
  match(names.join("\n"), /^@codsen\/data$/m, "09.04");
});

test.run();
