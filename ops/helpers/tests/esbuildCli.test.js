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
import { equal, match } from "uvu/assert";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const esbuildScript = path.join(repositoryRoot, "ops/scripts/esbuild.js");
const debugMarker = "REV022_DEBUG_MARKER";
const longIdentifier = "deliberatelyVerboseLocalIdentifier";

function createFixture() {
  const root = mkdtempSync(path.join(tmpdir(), "esbuild-mode-"));
  mkdirSync(path.join(root, "src"));
  writeFileSync(
    path.join(root, "package.json"),
    `${JSON.stringify(
      {
        name: "esbuild-mode-fixture",
        version: "1.0.0",
        description: "Exercise explicit esbuild modes",
        type: "module",
        engines: { node: ">=18.20.8" },
        exports: {
          types: "./types/index.d.ts",
          script: "./dist/browser.js",
          default: "./dist/index.js",
        },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    path.join(root, "src/main.ts"),
    `declare let DEV: boolean;

const ${longIdentifier} = "fixture value";

function fixtureValue(): string {
  DEV && console.log("${debugMarker}", ${longIdentifier});
  return ${longIdentifier};
}

export { fixtureValue };
`,
  );
  return root;
}

function runBuild(root, { args = [], ambientDev } = {}) {
  const environment = { ...process.env };
  if (ambientDev === undefined) {
    delete environment.DEV;
  } else {
    environment.DEV = ambientDev;
  }
  return spawnSync(process.execPath, [esbuildScript, ...args], {
    cwd: root,
    encoding: "utf8",
    env: environment,
  });
}

function readOutputs(root) {
  const outputStem = path.basename(root);
  return {
    esm: readFileSync(path.join(root, `dist/${outputStem}.esm.js`), "utf8"),
    iife: readFileSync(path.join(root, `dist/${outputStem}.umd.js`), "utf8"),
  };
}

test("01 - production ignores ambient DEV", () => {
  const root = createFixture();
  try {
    const withoutDev = runBuild(root);
    equal(withoutDev.status, 0, "01.01");
    const expected = readOutputs(root);

    const withTrue = runBuild(root, { ambientDev: "true" });
    equal(withTrue.status, 0, "01.02");
    equal(readOutputs(root), expected, "01.03");

    const withFalse = runBuild(root, { ambientDev: "false" });
    equal(withFalse.status, 0, "01.04");
    equal(readOutputs(root), expected, "01.05");
    equal(expected.esm.includes(debugMarker), false, "01.06");
    equal(expected.iife.includes(debugMarker), false, "01.07");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test("02 - --dev keeps logging and leaves both bundles unminified", () => {
  const root = createFixture();
  try {
    const productionResult = runBuild(root);
    equal(productionResult.status, 0, "02.01");
    const production = readOutputs(root);

    const developmentResult = runBuild(root, { args: ["--dev"] });
    equal(developmentResult.status, 0, "02.02");
    const development = readOutputs(root);

    equal(production.esm.includes(debugMarker), false, "02.03");
    equal(production.iife.includes(debugMarker), false, "02.04");
    equal(development.esm.includes(debugMarker), true, "02.05");
    equal(development.iife.includes(debugMarker), true, "02.06");
    equal(production.esm.includes(longIdentifier), false, "02.07");
    equal(production.iife.includes(longIdentifier), false, "02.08");
    equal(development.esm.includes(longIdentifier), true, "02.09");
    equal(development.iife.includes(longIdentifier), true, "02.10");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test("03 - unknown mode flags fail before deleting output", () => {
  const root = createFixture();
  const marker = path.join(root, "dist/keep.txt");
  try {
    mkdirSync(path.dirname(marker));
    writeFileSync(marker, "keep\n");

    const result = runBuild(root, { args: ["--development"] });

    equal(result.status, 1, "03.01");
    match(
      result.stderr,
      /Usage: node ops\/scripts\/esbuild\.js \[--dev\]/u,
      "03.02",
    );
    equal(existsSync(marker), true, "03.03");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test.run();
