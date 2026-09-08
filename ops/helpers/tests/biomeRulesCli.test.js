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

function lint(
  files,
  { command = "lint", directory, expectedFiles, args = [] } = {},
) {
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
        command,
        `--config-path=${root}`,
        "--vcs-enabled=false",
        "--reporter=json",
        "--error-on-warnings",
        ...args,
        ...(directory ? [path.join(root, directory)] : filenames),
      ],
      { cwd: root, encoding: "utf8", timeout: 10000 },
    );
    if (result.error) throw result.error;
    const report = JSON.parse(result.stdout);
    if (
      report.command !== command ||
      report.summary.unchanged !== (expectedFiles ?? filenames.length) ||
      report.summary.skipped !== 0
    ) {
      throw new Error(
        `Biome did not process the expected fixture files: ${result.stdout}\n${result.stderr}`,
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

test("08 - maintained JavaScript extensions reject undeclared names", () => {
  for (const extension of ["js", "mjs", "cjs", "jsx"]) {
    const filename = `ops/sentinel.${extension}`;
    const bad = lint({ [filename]: "console.log(missingSentinel);\n" });
    equal(bad.status, 1, `08.01 - ${extension}`);
    equal(
      severities(bad, "correctness/noUndeclaredVariables"),
      ["error"],
      `08.02 - ${extension}`,
    );
    const good = lint({
      [filename]: "const sentinel = 42;\nconsole.log(sentinel);\n",
    });
    equal(good.status, 0, `08.03 - ${extension}`);
    equal(good.report.diagnostics, [], `08.04 - ${extension}`);
  }
});

test("09 - package source imports require the nearest manifest declaration", () => {
  const source =
    'import { external } from "fixture-dependency";\nexport const value = external;\n';
  const bad = lint({
    "package.json": JSON.stringify({
      name: "fixture-root",
      dependencies: { "fixture-dependency": "1.0.0" },
    }),
    "packages/fixture/package.json": JSON.stringify({ name: "fixture" }),
    "packages/fixture/src/main.ts": source,
  });
  equal(bad.status, 1, "09.01");
  equal(
    severities(bad, "correctness/noUndeclaredDependencies"),
    ["error"],
    "09.02",
  );
  const good = lint({
    "packages/fixture/package.json": JSON.stringify({
      name: "fixture",
      dependencies: { "fixture-dependency": "1.0.0" },
    }),
    "packages/fixture/src/main.ts": source,
  });
  equal(good.status, 0, "09.03");
  equal(good.report.diagnostics, [], "09.04");
});

test("10 - source dependency checking retains the default development dependency allowance", () => {
  const good = lint({
    "packages/fixture/package.json": JSON.stringify({
      name: "fixture",
      devDependencies: { "fixture-tool": "1.0.0" },
    }),
    "packages/fixture/src/main.ts":
      'import { external } from "fixture-tool";\nexport const value = external;\n',
  });
  equal(good.status, 0, "10.01");
  equal(good.report.diagnostics, [], "10.02");
});

test("11 - package source rejects empty blocks while intentional blocks pass", () => {
  const bad = lint({
    "packages/fixture/src/main.ts": "export function callback() {}\n",
  });
  equal(bad.status, 1, "11.01");
  equal(
    severities(bad, "suspicious/noEmptyBlockStatements"),
    ["error"],
    "11.02",
  );
  const good = lint({
    "packages/fixture/src/main.ts":
      "export function callback() { /* Deliberately accepts notification without work. */ }\n",
  });
  equal(good.status, 0, "11.03");
  equal(good.report.diagnostics, [], "11.04");
});

test("12 - dependency and empty-block checks stay limited to package source", () => {
  const source =
    'import { external } from "fixture-tool";\nexport const value = external;\nexport function callback() {}\n';
  const good = lint({
    "package.json": JSON.stringify({ name: "fixture-root" }),
    "packages/fixture/package.json": JSON.stringify({ name: "fixture" }),
    "packages/fixture/test/sentinel.js": source,
    "packages/fixture/cli.js": source,
    "ops/sentinel.mjs": source,
  });
  equal(good.status, 0, "12.01");
  equal(good.report.diagnostics, [], "12.02");
});

test("13 - valid TypeScript class arguments remain outside the JavaScript rule", () => {
  const good = lint({
    "packages/fixture/src/main.ts": `export class Collector {
  count() {
    // biome-ignore lint/complexity/noArguments: Preserve argument count without allocating a rest array.
    return arguments.length;
  }
}
`,
  });
  equal(good.status, 0, "13.01");
  equal(good.report.diagnostics, [], "13.02");
});

test("14 - JavaScript enforcement composes with existing file exceptions", () => {
  // biome-ignore lint/suspicious/noTemplateCurlyInString: Exercise the literal-template exception in the js-row-num fixture.
  const source = 'export function named(unused) { return "${value}"; }\n';
  const filename = "packages/js-row-num/test/test.js";
  const bad = lint({
    [filename]: `${source}console.log(missingSentinel);\n`,
  });
  equal(bad.status, 1, "14.01");
  equal(
    severities(bad, "correctness/noUndeclaredVariables"),
    ["error"],
    "14.02",
  );
  equal(
    bad.report.diagnostics.map((diagnostic) => diagnostic.category),
    ["lint/correctness/noUndeclaredVariables"],
    "14.03",
  );
  const good = lint({ [filename]: source });
  equal(good.status, 0, "14.04");
  equal(good.report.diagnostics, [], "14.05");
});

test("15 - generated declarations retain their import order exemption", () => {
  const source = `import type { Stats } from "node:fs";
import type { Buffer } from "node:buffer";
export type Pair = [Stats, Buffer];
`;
  const options = { command: "check", args: ["--formatter-enabled=false"] };
  const bad = lint({ "packages/fixture/src/main.ts": source }, options);
  equal(bad.status, 1, "15.01");
  equal(
    bad.report.diagnostics.map((diagnostic) => diagnostic.category),
    ["assist/source/organizeImports"],
    "15.02",
  );
  const good = lint({ "packages/fixture/types/index.d.ts": source }, options);
  equal(good.status, 0, "15.03");
  equal(good.report.diagnostics, [], "15.04");
});

test("16 - a project scan excludes tap files from every Biome operation", () => {
  const files = {
    "packages/fixture/src/main.js":
      'new Error("This instance has no owner");\n',
    "packages/fixture/tap/broken.js": "const broken = ;\n",
    "packages/fixture/tap/unformatted.js": "export   const value=1\n",
  };
  const options = {
    command: "check",
    directory: "packages",
    expectedFiles: 1,
  };
  const bad = lint(files, options);
  equal(bad.status, 1, "16.01");
  equal(
    bad.report.diagnostics.map((diagnostic) => diagnostic.category),
    ["lint/correctness/noUnusedInstantiation"],
    "16.02",
  );
  const good = lint(
    { ...files, "packages/fixture/src/main.js": "export const value = 1;\n" },
    options,
  );
  equal(good.status, 0, "16.03");
  equal(good.report.diagnostics, [], "16.04");
});

test.run();
