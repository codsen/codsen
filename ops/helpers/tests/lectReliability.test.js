import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match, ok } from "uvu/assert";
import allContrib from "../../lect/plugins/allContributors.js";
import hardDelete from "../../lect/plugins/hardDelete.js";
import hardWrite from "../../lect/plugins/hardWrite.js";
import tsconfig from "../../lect/plugins/tsconfig.js";
import { runLect, runLectPhases } from "../../lect/runLect.js";
import { PACKAGE_KINDS } from "../packageKinds.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

function createTemporaryRoot() {
  return mkdtempSync(path.join(tmpdir(), "lect-reliability-"));
}

function removeTemporaryRoot(root) {
  rmSync(root, { force: true, recursive: true });
}

function copyExampleManifest(root, description) {
  const manifest = JSON.parse(
    readFileSync(
      path.join(repositoryRoot, "packages/arrayiffy-if-string/package.json"),
      "utf8",
    ),
  );
  manifest.description = description;
  writeFileSync(
    path.join(root, "package.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}

test("01 - deletion ignores only a missing path", async () => {
  const root = createTemporaryRoot();
  try {
    await hardDelete({ lectrc: { files: { delete: ["missing"] } }, root });
    mkdirSync(path.join(root, "blocked"));
    let error;
    try {
      await hardDelete({ lectrc: { files: { delete: ["blocked"] } }, root });
    } catch (caught) {
      error = caught;
    }
    ok(error, "01.01");
    match(error.code, /^(EISDIR|EPERM)$/, "01.02");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("02 - CLI tsconfig deletion is awaited and reports failures", async () => {
  const root = createTemporaryRoot();
  const state = { packageKind: PACKAGE_KINDS.CLI, repositoryRoot, root };
  try {
    const filename = path.join(root, "tsconfig.json");
    writeFileSync(filename, "{}\n");
    await tsconfig({ state });
    equal(existsSync(filename), false, "02.01");

    mkdirSync(filename);
    let error;
    try {
      await tsconfig({ state });
    } catch (caught) {
      error = caught;
    }
    ok(error, "02.02");
    match(error.code, /^(EISDIR|EPERM)$/, "02.03");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("03 - malformed library tsconfig is preserved and rejected", async () => {
  const root = createTemporaryRoot();
  const filename = path.join(root, "tsconfig.json");
  try {
    writeFileSync(filename, "{");
    let error;
    try {
      await tsconfig({
        state: {
          packageKind: PACKAGE_KINDS.TYPESCRIPT_LIBRARY,
          repositoryRoot,
          root,
        },
      });
    } catch (caught) {
      error = caught;
    }
    ok(error, "03.01");
    match(error.message, /JSON/, "03.02");
    equal(readFileSync(filename, "utf8"), "{", "03.03");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("04 - malformed hard-write and contributor files reject", async () => {
  const root = createTemporaryRoot();
  try {
    mkdirSync(path.join(root, "blocked"));
    let hardWriteError;
    try {
      await hardWrite({
        lectrc: {
          files: { write_hard: [{ contents: "value", name: "blocked" }] },
        },
        root,
      });
    } catch (caught) {
      hardWriteError = caught;
    }
    ok(hardWriteError, "04.01");

    writeFileSync(path.join(root, ".all-contributorsrc"), "{");
    let contributorError;
    try {
      await allContrib({
        state: { pack: { name: "example" }, repositoryRoot, root },
      });
    } catch (caught) {
      contributorError = caught;
    }
    ok(contributorError, "04.02");
    match(contributorError.message, /JSON/, "04.03");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("05 - phases are ordered and README sees the canonical manifest", async () => {
  const calls = [];
  const state = {
    pack: { description: "lowercase description", name: "example" },
    root: "/fixture",
  };
  const operation = (name) => async () => {
    calls.push(name);
  };
  const operations = {
    allContrib: operation("allContrib"),
    hardDelete: operation("hardDelete"),
    hardWrite: operation("hardWrite"),
    licence: operation("licence"),
    pack: async () => {
      calls.push("pack");
      return { ...state.pack, description: "Lowercase description" };
    },
    readme: async ({ state: currentState }) => {
      calls.push(`readme:${currentState.pack.description}`);
    },
    rollupConfig: operation("rollupConfig"),
    tsconfig: operation("tsconfig"),
  };

  await runLectPhases({
    coveragePolicy: {},
    lectrc: {},
    operations,
    rootPackageJSON: {},
    state,
  });

  equal(
    calls,
    [
      "hardDelete",
      "hardWrite",
      "pack",
      "rollupConfig",
      "tsconfig",
      "allContrib",
      "licence",
      "readme:Lowercase description",
    ],
    "05.01",
  );
});

test("06 - a failed phase prevents every later mutation", async () => {
  const calls = [];
  const later = (name) => async () => calls.push(name);
  const operations = {
    allContrib: later("allContrib"),
    hardDelete: async () => {
      calls.push("hardDelete");
      throw new Error("injected failure");
    },
    hardWrite: later("hardWrite"),
    licence: later("licence"),
    pack: later("pack"),
    readme: later("readme"),
    rollupConfig: later("rollupConfig"),
    tsconfig: later("tsconfig"),
  };
  let error;
  try {
    await runLectPhases({
      coveragePolicy: {},
      lectrc: {},
      operations,
      rootPackageJSON: {},
      state: { pack: {}, root: "/fixture" },
    });
  } catch (caught) {
    error = caught;
  }

  match(error.message, /injected failure/, "06.01");
  equal(calls, ["hardDelete"], "06.02");
});

test("07 - malformed quick take aborts before mutation", async () => {
  const root = createTemporaryRoot();
  try {
    copyExampleManifest(root, "A valid description");
    mkdirSync(path.join(root, "examples"));
    writeFileSync(path.join(root, "examples/_quickTake.js"), "no example");
    const before = readFileSync(path.join(root, "package.json"), "utf8");
    let error;
    try {
      await runLect({ packageRoot: root, repositoryRoot });
    } catch (caught) {
      error = caught;
    }
    match(error.message, /prepExampleFileStr: no import/, "07.01");
    equal(
      readFileSync(path.join(root, "package.json"), "utf8"),
      before,
      "07.02",
    );
    equal(existsSync(path.join(root, "README.md")), false, "07.03");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("08 - one pass uses the normalised manifest in the README", async () => {
  const root = createTemporaryRoot();
  try {
    copyExampleManifest(root, "lowercase description");
    await runLect({ packageRoot: root, repositoryRoot });
    const manifest = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8"),
    );
    const readme = readFileSync(path.join(root, "README.md"), "utf8");

    equal(manifest.description, "Lowercase description", "08.01");
    match(readme, /<p align="center">Lowercase description<\/p>/, "08.02");
    equal(
      manifest.scripts.build,
      "node ../../ops/scripts/esbuild.js && npm run dts",
      "08.03",
    );
    equal(
      manifest.scripts.dev,
      "node ../../ops/scripts/esbuild.js --dev && npm run dts",
      "08.04",
    );
  } finally {
    removeTemporaryRoot(root);
  }
});

test("09 - CLI failure exits nonzero before later files are written", () => {
  const root = createTemporaryRoot();
  try {
    copyExampleManifest(root, "A valid description");
    mkdirSync(path.join(root, ".npmignore"));
    const result = spawnSync(
      process.execPath,
      [path.join(repositoryRoot, "ops/lect/lect.js")],
      { cwd: root, encoding: "utf8" },
    );

    equal(result.status, 1, "09.01");
    match(result.stderr, /failure.*(?:EISDIR|EPERM)/s, "09.02");
    equal(existsSync(path.join(root, "README.md")), false, "09.03");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("10 - root licence check does not touch package licences", () => {
  const beforePackageLicence = readFileSync(
    path.join(repositoryRoot, "packages/arrayiffy-if-string/LICENSE"),
    "utf8",
  );
  const result = spawnSync(
    process.execPath,
    [path.join(repositoryRoot, "ops/lect/root.js"), "--check"],
    { cwd: repositoryRoot, encoding: "utf8" },
  );

  equal(result.status, 0, "10.01");
  equal(
    readFileSync(
      path.join(repositoryRoot, "packages/arrayiffy-if-string/LICENSE"),
      "utf8",
    ),
    beforePackageLicence,
    "10.02",
  );
});

test("11 - check mode reports stale output without changing it", async () => {
  const root = createTemporaryRoot();
  try {
    copyExampleManifest(root, "A valid description");
    await runLect({ packageRoot: root, repositoryRoot });
    const readmeFilename = path.join(root, "README.md");
    writeFileSync(readmeFilename, "stale\n");
    let error;
    try {
      await runLect({ mode: "check", packageRoot: root, repositoryRoot });
    } catch (caught) {
      error = caught;
    }

    match(error.message, /README\.md.*npm run lect/, "11.01");
    equal(readFileSync(readmeFilename, "utf8"), "stale\n", "11.02");
    await runLect({ packageRoot: root, repositoryRoot });
    await runLect({ mode: "check", packageRoot: root, repositoryRoot });
    match(
      readFileSync(readmeFilename, "utf8"),
      /<p align="center">A valid description<\/p>/,
      "11.03",
    );
  } finally {
    removeTemporaryRoot(root);
  }
});

test("12 - check ignores cleanup-only files but enforces obsolete files", async () => {
  const root = createTemporaryRoot();
  const lectrc = {
    files: {
      cleanup_only: [".DS_Store"],
      delete: [".npmignore"],
    },
  };
  try {
    writeFileSync(path.join(root, ".DS_Store"), "ignored cleanup\n");
    await hardDelete({ lectrc, mode: "check", root });
    equal(existsSync(path.join(root, ".DS_Store")), true, "12.01");

    writeFileSync(path.join(root, ".npmignore"), "obsolete\n");
    let error;
    try {
      await hardDelete({ lectrc, mode: "check", root });
    } catch (caught) {
      error = caught;
    }
    match(error.message, /\.npmignore.*npm run lect/, "12.02");
    equal(
      readFileSync(path.join(root, ".npmignore"), "utf8"),
      "obsolete\n",
      "12.03",
    );

    await hardDelete({ lectrc, root });
    equal(existsSync(path.join(root, ".DS_Store")), false, "12.04");
    equal(existsSync(path.join(root, ".npmignore")), false, "12.05");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("13 - library tsconfig retires stale includes and is idempotent", async () => {
  const root = createTemporaryRoot();
  const filename = path.join(root, "tsconfig.json");
  const state = {
    packageKind: PACKAGE_KINDS.TYPESCRIPT_LIBRARY,
    repositoryRoot,
    root,
  };
  try {
    writeFileSync(
      filename,
      `${JSON.stringify(
        {
          include: [
            "src/**/*",
            "src/**/*.json",
            "package.json",
            "../../ops/typedefs/common.d.ts",
            "../../ops/typedefs/common.ts",
            "fixtures/**/*.ts",
          ],
        },
        null,
        2,
      )}\n`,
    );

    await tsconfig({ state });
    const firstPass = readFileSync(filename, "utf8");
    equal(
      JSON.parse(firstPass).include,
      [
        "src/**/*",
        "src/**/*.json",
        "package.json",
        "../../ops/typedefs/common.ts",
        "fixtures/**/*.ts",
      ],
      "13.01",
    );

    await tsconfig({ state });
    equal(readFileSync(filename, "utf8"), firstPass, "13.02");
  } finally {
    removeTemporaryRoot(root);
  }
});

test.run();
