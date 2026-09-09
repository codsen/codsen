import { createHash } from "node:crypto";
import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { test } from "uvu";
import { equal, match, ok, throws } from "uvu/assert";

import {
  createNpmDownloadsSnapshot,
  readNpmDownloadsSnapshot,
  recoverNpmDownloadsPromotion,
  writeNpmDownloadsSnapshot,
} from "../npmDownloadsFile.js";

const observedAt = "2026-09-09T12:00:00.000Z";

function input(overrides = {}) {
  return {
    through: "2026-09-03",
    roster: {
      alpha: {
        status: "current",
        includedInPortfolio: true,
        firstPublishedDay: "2026-09-01",
      },
      "@codsen/data": {
        status: "auxiliary",
        includedInPortfolio: false,
        firstPublishedDay: "2026-09-01",
      },
    },
    series: {
      alpha: [
        { day: "2026-09-01", downloads: 120 },
        { day: "2026-09-02", downloads: 0 },
        { day: "2026-09-03", downloads: 240 },
      ],
      "@codsen/data": [
        { day: "2026-09-01", downloads: 7 },
        { day: "2026-09-03", downloads: 0 },
      ],
    },
    availability: { alpha: "available", "@codsen/data": "available" },
    observedAt,
    ...overrides,
  };
}

function retiredInput(overrides = {}) {
  return {
    through: "2026-09-02",
    roster: {
      legacy: {
        status: "archived",
        includedInPortfolio: false,
        firstPublishedDay: "2026-09-01",
      },
      "@retired/tool": {
        status: "auxiliary",
        includedInPortfolio: false,
        firstPublishedDay: "2026-09-01",
      },
    },
    series: {
      legacy: [
        { day: "2026-09-01", downloads: 11 },
        { day: "2026-09-02", downloads: 12 },
      ],
      "@retired/tool": [{ day: "2026-09-01", downloads: 3 }],
    },
    availability: { legacy: "available", "@retired/tool": "unavailable" },
    observedAt: "2026-09-08T12:00:00.000Z",
    ...overrides,
  };
}

async function fixture(operation) {
  const root = await mkdtemp(path.join(tmpdir(), "npm-downloads-files-"));
  try {
    await operation({
      root,
      directory: path.join(root, "statistics with spaces", "npm-downloads"),
      workDirectory: path.join(root, "staging"),
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function captureError(operation) {
  try {
    await operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected operation to reject");
}

async function mutateManifest(directory, mutation) {
  const file = path.join(directory, "manifest.json");
  const manifest = JSON.parse(await readFile(file, "utf8"));
  mutation(manifest);
  await writeFile(file, `${JSON.stringify(manifest, null, 2)}\n`);
}

test("01 - snapshots record exact coverage and distinguish missing days from zero", () => {
  const { manifest } = createNpmDownloadsSnapshot(input());
  equal(Object.keys(manifest.packages), ["@codsen/data", "alpha"], "01.01");
  equal(manifest.packages.alpha.total, 360, "01.02");
  equal(
    manifest.packages.alpha.coverage,
    { start: "2026-09-01", end: "2026-09-03", days: 3, missing: [] },
    "01.03",
  );
  equal(
    manifest.packages["@codsen/data"].coverage,
    {
      start: "2026-09-01",
      end: "2026-09-03",
      days: 2,
      missing: [{ start: "2026-09-02", end: "2026-09-02" }],
    },
    "01.04",
  );
  equal(manifest.packages["@codsen/data"].total, 7, "01.05");
  equal(manifest.packages["@codsen/data"].includedInPortfolio, false, "01.06");
});

test("02 - unchanged content retains its revision and observation timestamp", () => {
  const first = createNpmDownloadsSnapshot(input());
  const next = createNpmDownloadsSnapshot(
    input({
      previousManifest: first.manifest,
      observedAt: "2026-09-10T13:00:00.000Z",
    }),
  );
  equal(next.manifest, first.manifest, "02.01");
  const revisedInput = input({
    previousManifest: first.manifest,
    observedAt: "2026-09-10T13:00:00.000Z",
  });
  revisedInput.series.alpha[1].downloads = 180;
  const revised = createNpmDownloadsSnapshot(revisedInput);
  ok(revised.manifest.revision !== first.manifest.revision, "02.02");
  equal(revised.manifest.updatedAt, "2026-09-10T13:00:00.000Z", "02.03");
  equal(revised.manifest.packages.alpha.total, 540, "02.04");
});

test("03 - unavailable packages retain known observations and expose missing coverage", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const snapshotInput = input({ through: "2026-09-05" });
    snapshotInput.availability.alpha = "unavailable";
    snapshotInput.series["@codsen/data"] = [];
    snapshotInput.availability["@codsen/data"] = "unavailable";
    const snapshot = createNpmDownloadsSnapshot(snapshotInput);
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    const saved = await readNpmDownloadsSnapshot(directory);
    equal(saved.series.alpha, input().series.alpha, "03.01");
    equal(saved.manifest.packages.alpha.total, 360, "03.02");
    equal(saved.manifest.packages.alpha.availability, "unavailable", "03.03");
    equal(
      saved.manifest.packages.alpha.coverage.missing,
      [{ start: "2026-09-04", end: "2026-09-05" }],
      "03.04",
    );
    equal(saved.manifest.packages["@codsen/data"].total, null, "03.05");
    equal(
      saved.manifest.packages["@codsen/data"].coverage,
      {
        start: null,
        end: null,
        days: 0,
        missing: [{ start: "2026-09-01", end: "2026-09-05" }],
      },
      "03.06",
    );
  });
});

test("04 - publications after the cutoff have no invented history", () => {
  const snapshotInput = input();
  snapshotInput.roster.alpha.firstPublishedDay = "2026-09-05";
  snapshotInput.availability.alpha = "not-yet-published";
  snapshotInput.series.alpha = [];
  const { manifest } = createNpmDownloadsSnapshot(snapshotInput);
  equal(
    manifest.packages.alpha.coverage,
    { start: null, end: null, days: 0, missing: [] },
    "04.01",
  );
  equal(manifest.packages.alpha.total, null, "04.02");
  throws(
    () =>
      createNpmDownloadsSnapshot({
        ...snapshotInput,
        availability: { ...snapshotInput.availability, alpha: "available" },
      }),
    /inconsistent publication state/,
  );
  snapshotInput.series.alpha = [{ day: "2026-09-04", downloads: 0 }];
  throws(
    () => createNpmDownloadsSnapshot(snapshotInput),
    /out-of-coverage observation/,
  );
});

test("05 - invalid source metadata and unsafe aggregate totals are rejected", () => {
  for (const changes of [
    { through: "2015-01-09" },
    { observedAt: "yesterday" },
    { observedAt: "2026-09-09" },
    { roster: {} },
    { series: { alpha: [] } },
    { availability: { alpha: "invented", "@codsen/data": "available" } },
  ]) {
    throws(() => createNpmDownloadsSnapshot(input(changes)));
  }
  const snapshotInput = input();
  snapshotInput.series.alpha[0].downloads = Number.MAX_SAFE_INTEGER;
  throws(() => createNpmDownloadsSnapshot(snapshotInput), /unsafe aggregate/);
  snapshotInput.series.alpha[0] = { day: "2015-01-09", downloads: 1 };
  throws(
    () => createNpmDownloadsSnapshot(snapshotInput),
    /out-of-coverage observation/,
  );
});

test("06 - writing and reading verify canonical bytes and package hashes", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const snapshot = createNpmDownloadsSnapshot(input());
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    equal(await readNpmDownloadsSnapshot(directory), snapshot, "06.01");
    const alphaBytes = await readFile(
      path.join(directory, "packages/alpha.ndjson"),
    );
    equal(
      alphaBytes.toString("utf8"),
      '{"day":"2026-09-01","downloads":120}\n{"day":"2026-09-02","downloads":0}\n{"day":"2026-09-03","downloads":240}\n',
      "06.02",
    );
    equal(
      createHash("sha256").update(alphaBytes).digest("hex"),
      snapshot.manifest.packages.alpha.sha256,
      "06.03",
    );
    equal(
      await readFile(path.join(directory, "manifest.json"), "utf8"),
      `${JSON.stringify(snapshot.manifest, null, 2)}\n`,
      "06.04",
    );
    equal(
      await readFile(
        path.join(directory, "packages/@codsen/data.ndjson"),
        "utf8",
      ),
      '{"day":"2026-09-01","downloads":7}\n{"day":"2026-09-03","downloads":0}\n',
      "06.05",
    );
  });
});

test("07 - replacement preserves archive documentation and validates before promotion", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const original = createNpmDownloadsSnapshot(input());
    await writeNpmDownloadsSnapshot(directory, workDirectory, original);
    await writeFile(
      path.join(directory, "README.md"),
      "# Maintained archive guide\n",
    );
    const revisedInput = input();
    revisedInput.series.alpha[1].downloads = 5;
    const revised = createNpmDownloadsSnapshot(revisedInput);
    await writeNpmDownloadsSnapshot(directory, workDirectory, revised);
    equal(await readNpmDownloadsSnapshot(directory), revised, "07.01");
    equal(
      await readFile(path.join(directory, "README.md"), "utf8"),
      "# Maintained archive guide\n",
      "07.02",
    );
    const invalid = structuredClone(revised);
    invalid.manifest.packages.alpha.total++;
    let renames = 0;
    match(
      (
        await captureError(() =>
          writeNpmDownloadsSnapshot(directory, workDirectory, invalid, {
            renameImpl: async () => {
              renames++;
            },
          }),
        )
      ).message,
      /manifest metadata, hashes, or revision mismatch/,
      "07.03",
    );
    equal(renames, 0, "07.04");
    equal(await readNpmDownloadsSnapshot(directory), revised, "07.05");
  });
});

test("08 - canonical source edits invalidate stored hashes and totals", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    await writeNpmDownloadsSnapshot(
      directory,
      workDirectory,
      createNpmDownloadsSnapshot(input()),
    );
    const file = path.join(directory, "packages/alpha.ndjson");
    const contents = await readFile(file, "utf8");
    await writeFile(
      file,
      contents.replace('"downloads":120', '"downloads":121'),
    );
    match(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
      /manifest metadata, hashes, or revision mismatch/,
      "08.01",
    );
  });
});

test("09 - manifest edits to aggregates, coverage, source, and revision are rejected", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const snapshot = createNpmDownloadsSnapshot(input());
    for (const mutation of [
      (manifest) => {
        manifest.packages.alpha.total++;
      },
      (manifest) => {
        manifest.packages.alpha.sha256 = "0".repeat(64);
      },
      (manifest) => {
        manifest.packages.alpha.coverage.days--;
      },
      (manifest) => {
        manifest.packages["@codsen/data"].coverage.missing = [];
      },
      (manifest) => {
        manifest.source.earliestDay = "2014-01-01";
      },
      (manifest) => {
        manifest.revision = "0".repeat(64);
      },
      (manifest) => {
        manifest.extra = true;
      },
    ]) {
      await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
      await mutateManifest(directory, mutation);
      match(
        (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
        /manifest metadata, hashes, or revision mismatch/,
        "09.01",
      );
    }
  });
});

test("10 - valid JSON with noncanonical framing or property order is rejected", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const snapshot = createNpmDownloadsSnapshot(input());
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    const packagePath = path.join(directory, "packages/alpha.ndjson");
    const contents = await readFile(packagePath, "utf8");
    await writeFile(
      packagePath,
      contents.replace(
        '{"day":"2026-09-01","downloads":120}',
        '{"downloads":120,"day":"2026-09-01"}',
      ),
    );
    match(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
      /noncanonical NDJSON/,
      "10.01",
    );
    await writeFile(packagePath, contents);
    await writeFile(
      path.join(directory, "manifest.json"),
      JSON.stringify(snapshot.manifest),
    );
    match(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
      /manifest metadata, hashes, or revision mismatch/,
      "10.02",
    );
  });
});

test("11 - extra files, traversal paths, and symlinks cannot enter an archive", async () => {
  await fixture(async ({ root, directory, workDirectory }) => {
    const snapshot = createNpmDownloadsSnapshot(input());
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    const extra = path.join(directory, "packages/forgotten.ndjson");
    await writeFile(extra, "");
    match(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
      /file inventory mismatch/,
      "11.01",
    );
    await rm(extra);
    await mutateManifest(directory, (manifest) => {
      manifest.packages.alpha.file = "../outside.ndjson";
    });
    match(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
      /invalid archive path/,
      "11.02",
    );
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    const source = path.join(directory, "packages/alpha.ndjson");
    const outside = path.join(root, "outside.ndjson");
    await rename(source, outside);
    await symlink(outside, source);
    match(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
      /symbolic link in archive/,
      "11.03",
    );
  });
});

test("12 - a missing manifest is optional only for an absent or documentation-only archive", async () => {
  await fixture(async ({ directory }) => {
    equal(
      await readNpmDownloadsSnapshot(directory, { allowMissing: true }),
      null,
      "12.01",
    );
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "README.md"), "# Archive\n");
    equal(
      await readNpmDownloadsSnapshot(directory, { allowMissing: true }),
      null,
      "12.02",
    );
    equal(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).code,
      "ENOENT",
      "12.03",
    );
    await mkdir(path.join(directory, "packages"));
    await writeFile(path.join(directory, "packages/alpha.ndjson"), "");
    match(
      (
        await captureError(() =>
          readNpmDownloadsSnapshot(directory, { allowMissing: true }),
        )
      ).message,
      /archive files exist without a manifest/,
      "12.04",
    );
  });
});

test("13 - a failed final directory rename restores the complete previous snapshot", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const original = createNpmDownloadsSnapshot(input());
    await writeNpmDownloadsSnapshot(directory, workDirectory, original);
    await writeFile(path.join(directory, "README.md"), "Original guide\n");
    const revisedInput = input();
    revisedInput.series.alpha[1].downloads = 15;
    const revised = createNpmDownloadsSnapshot(revisedInput);
    const calls = [];
    const error = await captureError(() =>
      writeNpmDownloadsSnapshot(directory, workDirectory, revised, {
        async renameImpl(from, to) {
          calls.push([from, to]);
          if (from === path.join(workDirectory, "candidate")) {
            throw new Error("Injected candidate promotion failure");
          }
          await rename(from, to);
        },
      }),
    );
    match(error.message, /Injected candidate promotion failure/, "13.01");
    equal(calls.length, 2, "13.02");
    equal(await readNpmDownloadsSnapshot(directory), original, "13.03");
    equal(
      await readFile(path.join(directory, "README.md"), "utf8"),
      "Original guide\n",
      "13.04",
    );
    equal(
      (await captureError(() => access(path.join(workDirectory, "backup"))))
        .code,
      "ENOENT",
      "13.05",
    );
  });
});

test("14 - interrupted promotion restores a backup when the target is absent", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const original = createNpmDownloadsSnapshot(input());
    await writeNpmDownloadsSnapshot(directory, workDirectory, original);
    await rename(directory, path.join(workDirectory, "backup"));
    await recoverNpmDownloadsPromotion(directory, workDirectory);
    equal(await readNpmDownloadsSnapshot(directory), original, "14.01");
    equal(
      (await captureError(() => access(path.join(workDirectory, "backup"))))
        .code,
      "ENOENT",
      "14.02",
    );
    await recoverNpmDownloadsPromotion(directory, workDirectory);
    equal(await readNpmDownloadsSnapshot(directory), original, "14.03");
  });
});

test("15 - a valid promoted candidate survives interrupted backup cleanup", async () => {
  await fixture(async ({ root, directory, workDirectory }) => {
    const original = createNpmDownloadsSnapshot(input());
    await writeNpmDownloadsSnapshot(directory, workDirectory, original);
    const savedBackup = path.join(workDirectory, "backup");
    await cp(directory, savedBackup, { recursive: true });
    const revisedInput = input();
    revisedInput.series.alpha[1].downloads = 25;
    const revised = createNpmDownloadsSnapshot(revisedInput);
    await writeNpmDownloadsSnapshot(
      directory,
      path.join(root, "second-stage"),
      revised,
    );
    await recoverNpmDownloadsPromotion(directory, workDirectory);
    equal(await readNpmDownloadsSnapshot(directory), revised, "15.01");
    equal(
      (await captureError(() => access(savedBackup))).code,
      "ENOENT",
      "15.02",
    );
  });
});

test("16 - recovery preserves the backup if the promoted target is invalid", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const original = createNpmDownloadsSnapshot(input());
    await writeNpmDownloadsSnapshot(directory, workDirectory, original);
    const savedBackup = path.join(workDirectory, "backup");
    await cp(directory, savedBackup, { recursive: true });
    await mutateManifest(directory, (manifest) => {
      manifest.packages.alpha.total++;
    });
    match(
      (
        await captureError(() =>
          recoverNpmDownloadsPromotion(directory, workDirectory),
        )
      ).message,
      /manifest metadata, hashes, or revision mismatch/,
      "16.01",
    );
    equal(await readNpmDownloadsSnapshot(savedBackup), original, "16.02");
  });
});

test("17 - retired snapshots are optional without changing earlier schema bytes", () => {
  const original = createNpmDownloadsSnapshot(input());
  const explicitNull = createNpmDownloadsSnapshot(input({ retired: null }));
  equal(explicitNull, original, "17.01");
  equal(Object.hasOwn(original.manifest, "retiredRevision"), false, "17.02");
  equal(Object.hasOwn(original, "retired"), false, "17.03");
  const retired = createNpmDownloadsSnapshot(retiredInput());
  const combined = createNpmDownloadsSnapshot(input({ retired }));
  equal(
    Object.keys(combined.manifest.packages),
    Object.keys(original.manifest.packages),
    "17.04",
  );
  equal(combined.retired, retired, "17.05");
  equal(combined.manifest.retiredRevision, retired.manifest.revision, "17.06");
  ok(combined.manifest.revision !== original.manifest.revision, "17.07");
});

test("18 - one validated archive contains both manifests and scoped retired histories", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const retired = createNpmDownloadsSnapshot(retiredInput());
    const snapshot = createNpmDownloadsSnapshot(input({ retired }));
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    equal(await readNpmDownloadsSnapshot(directory), snapshot, "18.01");
    equal(
      await readFile(path.join(directory, "retired/manifest.json"), "utf8"),
      `${JSON.stringify(retired.manifest, null, 2)}\n`,
      "18.02",
    );
    const bytes = await readFile(
      path.join(directory, "retired/packages/legacy.ndjson"),
    );
    equal(
      bytes.toString("utf8"),
      '{"day":"2026-09-01","downloads":11}\n{"day":"2026-09-02","downloads":12}\n',
      "18.03",
    );
    equal(
      createHash("sha256").update(bytes).digest("hex"),
      retired.manifest.packages.legacy.sha256,
      "18.04",
    );
    equal(
      await readFile(
        path.join(directory, "retired/packages/@retired/tool.ndjson"),
        "utf8",
      ),
      '{"day":"2026-09-01","downloads":3}\n',
      "18.05",
    );
  });
});

test("19 - primary refresh preserves retired cutoff, timestamps, and coverage", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const retired = createNpmDownloadsSnapshot(retiredInput());
    const original = createNpmDownloadsSnapshot(input({ retired }));
    await writeNpmDownloadsSnapshot(directory, workDirectory, original);
    await writeFile(
      path.join(directory, "README.md"),
      "Primary archive guide\n",
    );
    const retiredBytes = await readFile(
      path.join(directory, "retired/manifest.json"),
      "utf8",
    );
    const next = createNpmDownloadsSnapshot(
      input({
        through: "2026-09-05",
        observedAt: "2026-09-10T12:00:00.000Z",
        retired,
        previousManifest: original.manifest,
      }),
    );
    await writeNpmDownloadsSnapshot(directory, workDirectory, next);
    const saved = await readNpmDownloadsSnapshot(directory);
    equal(saved.retired, retired, "19.01");
    equal(saved.retired.manifest.through, "2026-09-02", "19.02");
    equal(
      saved.retired.manifest.updatedAt,
      "2026-09-08T12:00:00.000Z",
      "19.03",
    );
    equal(saved.retired.manifest.packages.legacy.coverage.missing, [], "19.04");
    equal(
      await readFile(path.join(directory, "retired/manifest.json"), "utf8"),
      retiredBytes,
      "19.05",
    );
    equal(
      await readFile(path.join(directory, "README.md"), "utf8"),
      "Primary archive guide\n",
      "19.06",
    );
  });
});

test("20 - retired pointers must identify an existing child with its exact revision", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const snapshot = createNpmDownloadsSnapshot(
      input({ retired: createNpmDownloadsSnapshot(retiredInput()) }),
    );
    for (const pointer of [null, "invalid", "0".repeat(64)]) {
      await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
      await mutateManifest(directory, (manifest) => {
        manifest.retiredRevision = pointer;
      });
      match(
        (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
        /retired snapshot revision/,
        "20.01",
      );
    }
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    await rm(path.join(directory, "retired/manifest.json"));
    equal(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).code,
      "ENOENT",
      "20.02",
    );
  });
});

test("21 - unreferenced retired data and unexpected child files are rejected", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const snapshot = createNpmDownloadsSnapshot(
      input({ retired: createNpmDownloadsSnapshot(retiredInput()) }),
    );
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    await writeFile(
      path.join(directory, "manifest.json"),
      `${JSON.stringify(createNpmDownloadsSnapshot(input()).manifest, null, 2)}\n`,
    );
    match(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
      /file inventory mismatch/,
      "21.01",
    );
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    await writeFile(
      path.join(directory, "retired/packages/forgotten.ndjson"),
      "",
    );
    match(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
      /file inventory mismatch/,
      "21.02",
    );
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    await rm(path.join(directory, "retired/packages/legacy.ndjson"));
    equal(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).code,
      "ENOENT",
      "21.03",
    );
  });
});

test("22 - child data and metadata changes invalidate the complete archive", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const snapshot = createNpmDownloadsSnapshot(
      input({ retired: createNpmDownloadsSnapshot(retiredInput()) }),
    );
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    const childFile = path.join(directory, "retired/packages/legacy.ndjson");
    const contents = await readFile(childFile, "utf8");
    await writeFile(
      childFile,
      contents.replace('"downloads":11', '"downloads":13'),
    );
    match(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
      /metadata, hashes, or revision mismatch/,
      "22.01",
    );
    await writeNpmDownloadsSnapshot(directory, workDirectory, snapshot);
    await mutateManifest(path.join(directory, "retired"), (manifest) => {
      manifest.packages.legacy.total++;
    });
    match(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
      /metadata, hashes, or revision mismatch/,
      "22.02",
    );
  });
});

test("23 - retired packages are disjoint, excluded from totals, and independently verified", () => {
  const overlapInput = retiredInput();
  overlapInput.roster.alpha = overlapInput.roster.legacy;
  overlapInput.series.alpha = overlapInput.series.legacy;
  overlapInput.availability.alpha = "available";
  const overlap = createNpmDownloadsSnapshot(overlapInput);
  throws(
    () => createNpmDownloadsSnapshot(input({ retired: overlap })),
    /retired package also in main archive: alpha/,
    "23.01",
  );
  const includedInput = retiredInput();
  includedInput.roster.legacy.includedInPortfolio = true;
  const included = createNpmDownloadsSnapshot(includedInput);
  throws(
    () => createNpmDownloadsSnapshot(input({ retired: included })),
    /retired package included in portfolio: legacy/,
    "23.02",
  );
  const corrupt = createNpmDownloadsSnapshot(retiredInput());
  corrupt.manifest.packages.legacy.total++;
  throws(
    () => createNpmDownloadsSnapshot(input({ retired: corrupt })),
    /retired snapshot metadata, hashes, or revision mismatch/,
    "23.03",
  );
  throws(
    () => createNpmDownloadsSnapshot(input({ retired: {} })),
    /invalid retired snapshot/,
    "23.04",
  );
});

test("24 - retired snapshots cannot contain another nested retired archive", async () => {
  const child = createNpmDownloadsSnapshot(retiredInput());
  const nested = createNpmDownloadsSnapshot(input({ retired: child }));
  throws(
    () => createNpmDownloadsSnapshot(input({ retired: nested })),
    /retired snapshots cannot be nested/,
    "24.01",
  );
  await fixture(async ({ directory, workDirectory }) => {
    await writeNpmDownloadsSnapshot(directory, workDirectory, nested);
    await mutateManifest(path.join(directory, "retired"), (manifest) => {
      manifest.retiredRevision = "0".repeat(64);
    });
    match(
      (await captureError(() => readNpmDownloadsSnapshot(directory))).message,
      /retired snapshots cannot be nested/,
      "24.02",
    );
  });
});

test("25 - failed promotion restores primary and retired manifests and histories together", async () => {
  await fixture(async ({ directory, workDirectory }) => {
    const original = createNpmDownloadsSnapshot(
      input({ retired: createNpmDownloadsSnapshot(retiredInput()) }),
    );
    await writeNpmDownloadsSnapshot(directory, workDirectory, original);
    const revisedChildInput = retiredInput();
    revisedChildInput.series.legacy[0].downloads = 100;
    const revisedInput = input({
      retired: createNpmDownloadsSnapshot(revisedChildInput),
    });
    revisedInput.series.alpha[0].downloads = 500;
    const revised = createNpmDownloadsSnapshot(revisedInput);
    const error = await captureError(() =>
      writeNpmDownloadsSnapshot(directory, workDirectory, revised, {
        async renameImpl(from, to) {
          if (from === path.join(workDirectory, "candidate"))
            throw new Error("Injected combined promotion failure");
          await rename(from, to);
        },
      }),
    );
    match(error.message, /Injected combined promotion failure/, "25.01");
    equal(await readNpmDownloadsSnapshot(directory), original, "25.02");
    equal(
      await readNpmDownloadsSnapshot(path.join(directory, "retired")),
      original.retired,
      "25.03",
    );
    await rename(directory, path.join(workDirectory, "backup"));
    await recoverNpmDownloadsPromotion(directory, workDirectory);
    equal(await readNpmDownloadsSnapshot(directory), original, "25.04");
  });
});

test.run();
