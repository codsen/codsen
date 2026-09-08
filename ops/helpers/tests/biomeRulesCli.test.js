import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal } from "uvu/assert";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const biome = path.join(
  repositoryRoot,
  "node_modules/@biomejs/biome/bin/biome",
);

function lint(files) {
  const root = mkdtempSync(path.join(tmpdir(), "biome rules "));
  try {
    // Index the fixture as its own project while inheriting the actual rules.
    // Relative plugin paths resolve here, so copy their current implementation.
    writeFileSync(
      path.join(root, "biome.json"),
      JSON.stringify({ extends: [path.join(repositoryRoot, "biome.json")] }),
    );
    cpSync(
      path.join(repositoryRoot, "ops/biome"),
      path.join(root, "ops/biome"),
      {
        recursive: true,
      },
    );
    const filenames = Object.entries(files).map(([name, source]) => {
      const filename = path.join(root, name);
      mkdirSync(path.dirname(filename), { recursive: true });
      writeFileSync(filename, source);
      return filename;
    });
    const result = spawnSync(
      process.execPath,
      [
        biome,
        "lint",
        `--config-path=${root}`,
        "--vcs-enabled=false",
        "--reporter=json",
        "--error-on-warnings",
        ...filenames,
      ],
      { cwd: root, encoding: "utf8", timeout: 10000 },
    );
    if (result.error) throw result.error;
    const report = JSON.parse(result.stdout);
    if (
      report.command !== "lint" ||
      report.summary.unchanged !== filenames.length ||
      report.summary.skipped !== 0
    ) {
      throw new Error(
        `Biome did not lint every fixture file: ${result.stdout}\n${result.stderr}`,
      );
    }
    return { status: result.status, report };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function severities(result, rule) {
  return [
    ...new Set(
      result.report.diagnostics
        .filter((diagnostic) => diagnostic.category === `lint/${rule}`)
        .map((diagnostic) => diagnostic.severity),
    ),
  ];
}

test("01 - constant binary expressions fail while meaningful fallbacks pass", () => {
  const bad = lint({ "sample.js": "export const result = {} || null;\n" });
  equal(bad.status, 1, "01.01");
  equal(
    severities(bad, "suspicious/noConstantBinaryExpressions"),
    ["error"],
    "01.02",
  );
  const good = lint({
    "sample.js": "export function fallback(value) { return value || null; }\n",
  });
  equal(good.status, 0, "01.03");
  equal(good.report.diagnostics, [], "01.04");
});

test("02 - discarded instances fail while owned and deliberate validation instances pass", () => {
  const bad = lint({ "sample.js": 'new Error("A throw was omitted");\n' });
  equal(bad.status, 1, "02.01");
  equal(
    severities(bad, "correctness/noUnusedInstantiation"),
    ["error"],
    "02.02",
  );
  const good = lint({
    "sample.js": `export const error = new Error("Owned instance");
export function validateUrl(candidate) {
  try {
    // biome-ignore lint/correctness/noUnusedInstantiation: Constructor validation intentionally uses its thrown error and discards the URL instance.
    new URL(candidate);
    return true;
  } catch {
    return false;
  }
}
`,
  });
  equal(good.status, 0, "02.03");
  equal(good.report.diagnostics, [], "02.04");
});

test("03 - built-in errors need a message", () => {
  const bad = lint({ "sample.js": "export const error = new Error();\n" });
  equal(bad.status, 1, "03.01");
  equal(severities(bad, "suspicious/useErrorMessage"), ["error"], "03.02");
  const good = lint({
    "sample.js": 'export const error = new Error("The input is invalid");\n',
  });
  equal(good.status, 0, "03.03");
  equal(good.report.diagnostics, [], "03.04");
});

test("04 - manifests reject duplicated runtime and development dependencies", () => {
  const bad = lint({
    "package.json": JSON.stringify({
      name: "biome-rule-fixture",
      dependencies: { example: "1.0.0" },
      devDependencies: { example: "1.0.0" },
    }),
  });
  equal(bad.status, 1, "04.01");
  equal(
    severities(bad, "suspicious/noDuplicateDependencies"),
    ["error"],
    "04.02",
  );
  const good = lint({
    "package.json": JSON.stringify({
      name: "biome-rule-fixture",
      dependencies: { example: "1.0.0" },
      devDependencies: { tooling: "1.0.0" },
    }),
  });
  equal(good.status, 0, "04.03");
  equal(good.report.diagnostics, [], "04.04");
});

test("05 - an unassigned value fails while explicit undefined remains valid", () => {
  const bad = lint({
    "sample.js": "export function read() { let value; return value; }\n",
  });
  equal(bad.status, 1, "05.01");
  equal(
    severities(bad, "suspicious/noUnassignedVariables"),
    ["error"],
    "05.02",
  );
  const good = lint({
    "sample.js": "export const value = undefined;\n",
  });
  equal(good.status, 0, "05.03");
  equal(good.report.diagnostics, [], "05.04");
});

test("06 - recursive-only parameters fail while accumulated values remain valid", () => {
  const bad = lint({
    "sample.js": `export function factorial(n, acc) {
  if (n === 0) return 1;
  return factorial(n - 1, acc);
}
`,
  });
  equal(bad.status, 1, "06.01");
  equal(
    severities(bad, "suspicious/noParametersOnlyUsedInRecursion"),
    ["error"],
    "06.02",
  );
  const good = lint({
    "sample.js": `export function factorial(n, acc) {
  if (n === 0) return acc;
  return factorial(n - 1, acc * n);
}
`,
  });
  equal(good.status, 0, "06.03");
  equal(good.report.diagnostics, [], "06.04");
});

test("07 - runtime import cycles fail while one-way imports remain valid", () => {
  const bad = lint({
    "a.js":
      'import { b } from "./b.js";\nexport function a() { return b(); }\n',
    "b.js":
      'import { a } from "./a.js";\nexport function b() { return a(); }\n',
  });
  equal(bad.status, 1, "07.01");
  equal(severities(bad, "suspicious/noImportCycles"), ["error"], "07.02");
  const good = lint({
    "a.js":
      'import { b } from "./b.js";\nexport function a() { return b(); }\n',
    "b.js": "export function b() { return 42; }\n",
  });
  equal(good.status, 0, "07.03");
  equal(good.report.diagnostics, [], "07.04");
});

test.run();
