import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  catalogueExclusions,
  createCodsenPackageLists,
  deprecated,
  packagesOutsideMonorepo,
} from "../codsenPackages.js";
import { readNpmDownloadsRoster } from "../npmDownloadsRoster.js";
import { readWorkspaceRecords } from "../workspaceInventoryFile.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

function writeJson(filename, value) {
  mkdirSync(path.dirname(filename), { recursive: true });
  writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`);
}

function writeDates(root, dates) {
  const filename = path.join(root, "data/sources/firstPublishedAt.ts");
  mkdirSync(path.dirname(filename), { recursive: true });
  writeFileSync(
    filename,
    `import type { Package } from "./packages.js";\nexport const firstPublishedAt: Record<Package, number | null> = ${JSON.stringify(dates)};\n`,
  );
}

function withFixture(callback, { packages, dates } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "npm-downloads-roster-"));
  try {
    writeJson(path.join(root, "package.json"), {
      name: "fixture",
      private: true,
      workspaces: ["packages/*", "data"],
    });
    writeJson(path.join(root, "lerna.json"), {
      packages: ["packages/*", "data"],
    });
    for (const [directory, manifest] of packages ?? [
      ["packages/zeta", { name: "zeta" }],
      ["packages/scoped", { name: "@codsen/example" }],
      ["packages/private", { name: "private-example", private: true }],
      ["data", { name: "@codsen/data" }],
    ]) {
      writeJson(path.join(root, directory, "package.json"), manifest);
    }
    writeDates(root, dates ?? {});
    callback(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function metadata(overrides = {}) {
  return {
    status: "current",
    includedInPortfolio: true,
    firstPublishedDay: null,
    ...overrides,
  };
}

test("01 - combines published workspaces and curated catalogue in stable order", () => {
  withFixture((root) => {
    const result = readNpmDownloadsRoster(root);
    const expected = [
      ...packagesOutsideMonorepo,
      "zeta",
      "@codsen/example",
    ].sort();
    equal(Object.keys(result), expected, "01.01");
    equal(result.zeta, metadata(), "01.02");
    equal(result["@codsen/example"], metadata(), "01.03");
    equal(Object.hasOwn(result, "@codsen/data"), false, "01.04");
    equal(result.lect, metadata(), "01.05");
    equal(
      deprecated.every((name) => !Object.hasOwn(result, name)),
      true,
      "01.06",
    );
    equal(Object.getPrototypeOf(result), Object.prototype, "01.07");
  });
});

test("02 - reads UTC days from the generated publication snapshot without building", () => {
  withFixture(
    (root) => {
      const result = readNpmDownloadsRoster(root);
      equal(result.zeta.firstPublishedDay, "2020-01-02", "02.01");
      equal(result.lect.firstPublishedDay, "2020-01-03", "02.02");
      equal(result["@codsen/example"].firstPublishedDay, null, "02.03");
    },
    {
      dates: {
        zeta: Date.parse("2020-01-02T23:59:59.999Z"),
        lect: Date.parse("2020-01-03T00:00:00.001Z"),
        "@codsen/example": null,
      },
    },
  );
});

test("03 - canonical membership overrides stale decisions and excludes removed packages", () => {
  withFixture((root) => {
    const previous = {
      removed: metadata({ firstPublishedDay: "2019-01-01" }),
      "removed-excluded": metadata({ includedInPortfolio: false }),
      zeta: metadata({
        status: "archived",
        includedInPortfolio: false,
        firstPublishedDay: "2019-01-01",
      }),
      "@codsen/data": metadata({
        status: "auxiliary",
        includedInPortfolio: true,
      }),
    };
    const copy = structuredClone(previous);
    const result = readNpmDownloadsRoster(root, previous);
    equal(Object.hasOwn(result, "removed"), false, "03.01");
    equal(Object.hasOwn(result, "removed-excluded"), false, "03.02");
    equal(result.zeta, metadata({ firstPublishedDay: "2019-01-01" }), "03.03");
    equal(Object.hasOwn(result, "@codsen/data"), false, "03.04");
    equal(previous, copy, "03.05");
  });
});

test("04 - an earlier observed date survives missing, unknown or later source dates", () => {
  withFixture(
    (root) => {
      const previous = {
        zeta: metadata({ firstPublishedDay: "2019-01-01" }),
        lect: metadata({ firstPublishedDay: "2019-01-01" }),
        "@codsen/example": metadata({ firstPublishedDay: "2019-01-01" }),
      };
      const result = readNpmDownloadsRoster(root, previous);
      equal(result.zeta.firstPublishedDay, "2019-01-01", "04.01");
      equal(result.lect.firstPublishedDay, "2019-01-01", "04.02");
      equal(result["@codsen/example"].firstPublishedDay, "2019-01-01", "04.03");
    },
    { dates: { zeta: Date.parse("2020-01-01"), lect: null } },
  );
});

test("05 - accepts newly discovered earlier dates and updates current status", () => {
  withFixture(
    (root) => {
      const result = readNpmDownloadsRoster(root, {
        zeta: metadata({ status: "archived", firstPublishedDay: "2020-01-01" }),
        bitsausage: metadata(),
      });
      equal(
        result.zeta,
        metadata({ firstPublishedDay: "2019-01-01" }),
        "05.01",
      );
      equal(Object.hasOwn(result, "bitsausage"), false, "05.02");
    },
    { dates: { zeta: Date.parse("2019-01-01") } },
  );
});

test("06 - rejects malformed previous roster containers and entries", () => {
  withFixture((root) => {
    for (const previous of [null, [], 1, "packages", new Date()]) {
      throws(() => readNpmDownloadsRoster(root, previous), /plain object/);
    }
    for (const invalid of [
      null,
      [],
      1,
      "entry",
      {},
      metadata({ status: "gone" }),
      metadata({ includedInPortfolio: "yes" }),
    ]) {
      throws(() => readNpmDownloadsRoster(root, { zeta: invalid }), /metadata/);
    }
    const missingDate = metadata();
    delete missingDate.firstPublishedDay;
    throws(
      () => readNpmDownloadsRoster(root, { zeta: missingDate }),
      /metadata/,
    );
  });
});

test("07 - rejects invalid saved days including rolled calendar dates", () => {
  withFixture((root) => {
    for (const day of [
      undefined,
      0,
      "2020-02-30",
      "2021-02-29",
      "2020-13-01",
      "2020-1-01",
      "2020-01-01T00:00:00Z",
    ]) {
      throws(() =>
        readNpmDownloadsRoster(root, {
          zeta: metadata({ firstPublishedDay: day }),
        }),
      );
    }
    equal(
      readNpmDownloadsRoster(root, {
        zeta: metadata({ firstPublishedDay: "2020-02-29" }),
      }).zeta.firstPublishedDay,
      "2020-02-29",
      "07.01",
    );
  });
});

test("08 - rejects corrupt publication timestamps and payloads", () => {
  withFixture((root) => {
    for (const timestamp of ["1590000000", 0, -1, 1.5, 9e15]) {
      writeDates(root, { zeta: timestamp });
      throws(() => readNpmDownloadsRoster(root), /timestamp/);
    }
    for (const dates of [null, [], 1]) {
      writeDates(root, dates);
      throws(() => readNpmDownloadsRoster(root), /plain object/);
    }
    const filename = path.join(root, "data/sources/firstPublishedAt.ts");
    writeFileSync(filename, "export const other = {};\n");
    throws(() => readNpmDownloadsRoster(root), /no firstPublishedAt export/);
    writeFileSync(
      filename,
      "export const firstPublishedAt = (() => { throw new Error('executed'); })();\n",
    );
    throws(() => readNpmDownloadsRoster(root), /invalid JSON/);
  });
});

test("09 - validates names from workspaces, dates and retained metadata", () => {
  for (const name of [
    "../escape",
    "@codsen/../escape",
    "@codsen",
    "has space",
  ]) {
    withFixture((root) => {
      throws(() => readNpmDownloadsRoster(root, { [name]: metadata() }));
      writeDates(root, { [name]: null });
      throws(() => readNpmDownloadsRoster(root));
    });
    withFixture(
      (root) => {
        throws(() => readNpmDownloadsRoster(root));
      },
      { packages: [["packages/invalid", { name }]] },
    );
  }
});

test("10 - follows the audited product catalogue including both canonical ESLint plugins", () => {
  const result = readNpmDownloadsRoster(repositoryRoot);
  equal(
    Object.keys(catalogueExclusions).filter((name) =>
      Object.hasOwn(result, name),
    ),
    [],
    "10.01",
  );
  equal(
    Object.keys(result),
    createCodsenPackageLists(
      readWorkspaceRecords(repositoryRoot)
        .filter(({ manifest }) => !manifest.private)
        .map(({ manifest }) => manifest.name),
    ).all,
    "10.02",
  );
  equal(
    result["object-boolean-combinations"].firstPublishedDay,
    "2015-12-14",
    "10.03",
  );
  equal(Object.keys(result).length, 137, "10.04");
  equal(
    ["eslint-plugin-row-num", "eslint-plugin-test-num"].map(
      (name) => result[name].includedInPortfolio,
    ),
    [true, true],
    "10.05",
  );
});

test("11 - projects roster fields from full archive entries deterministically", () => {
  withFixture((root) => {
    const previous = {
      zeta: {
        ...metadata({ firstPublishedDay: "2019-01-01" }),
        availability: "available",
        file: "packages/zeta.ndjson",
        sha256: "a".repeat(64),
        coverage: {
          start: "2019-01-01",
          end: "2019-01-01",
          days: 1,
          missing: [],
        },
        total: 3,
      },
    };
    const result = readNpmDownloadsRoster(root, previous);
    equal(result.zeta, metadata({ firstPublishedDay: "2019-01-01" }), "11.01");
    equal(readNpmDownloadsRoster(root, result), result, "11.02");
  });
});

test("12 - stale manifests cannot reintroduce retired or excluded catalogue names", () => {
  withFixture((root) => {
    const previous = Object.fromEntries(
      [
        ...deprecated,
        ...Object.keys(catalogueExclusions),
        "former-product",
      ].map((name) => [name, metadata({ firstPublishedDay: "2015-01-10" })]),
    );
    const result = readNpmDownloadsRoster(root, previous);
    equal(result, readNpmDownloadsRoster(root), "12.01");
    equal(
      Object.values(result).every(
        (entry) => entry.status === "current" && entry.includedInPortfolio,
      ),
      true,
      "12.02",
    );
  });
});

test.run();
