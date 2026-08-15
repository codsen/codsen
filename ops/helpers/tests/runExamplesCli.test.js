import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match, not } from "uvu/assert";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const runExamplesScript = path.join(
  repositoryRoot,
  "ops/scripts/run-examples.js",
);

// every segment carries a space, and one carries a shell metacharacter, so a
// runner which hands the path to a shell cannot pass these tests
function createPackage(files = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "run examples "));
  const consumerDirectory = path.join(root, "level one", "level two & three");
  mkdirSync(consumerDirectory, { recursive: true });
  for (const [name, contents] of Object.entries(files)) {
    const filename = path.join(consumerDirectory, name);
    mkdirSync(path.dirname(filename), { recursive: true });
    writeFileSync(filename, contents);
  }
  return { consumerDirectory, root };
}

function runExamples(consumerDirectory) {
  return spawnSync(process.execPath, [runExamplesScript], {
    cwd: consumerDirectory,
    encoding: "utf8",
  });
}

test("01 - runs every example from a nested path containing a space", () => {
  const { consumerDirectory, root } = createPackage({
    "examples/quick take.js": `console.log("QUICK_TAKE_RAN");\n`,
    "examples/second example.mjs": `console.log("SECOND_EXAMPLE_RAN");\n`,
    "examples/notes.txt": "not an example\n",
  });
  try {
    const result = runExamples(consumerDirectory);

    equal(result.status, 0, "01.01");
    match(result.stdout, /PASS.*examples\/quick take\.js/u, "01.02");
    match(result.stdout, /PASS.*examples\/second example\.mjs/u, "01.03");
    match(result.stdout, /QUICK_TAKE_RAN/u, "01.04");
    match(result.stdout, /SECOND_EXAMPLE_RAN/u, "01.05");
    // only .js and .mjs files are examples
    not.match(result.stdout, /notes\.txt/u, "01.06");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test("02 - a failing example fails the run and every example is reported", () => {
  const { consumerDirectory, root } = createPackage({
    "examples/a passing one.js": `console.log("PASSING_RAN");\n`,
    "examples/b failing one.js": `throw new Error("EXAMPLE_BLEW_UP");\n`,
  });
  try {
    const result = runExamples(consumerDirectory);

    equal(result.status, 1, "02.01");
    match(result.stdout, /PASS.*examples\/a passing one\.js/u, "02.02");
    match(result.stdout, /FAIL.*examples\/b failing one\.js/u, "02.03");
    match(result.stdout, /EXAMPLE_BLEW_UP/u, "02.04");
    // each example's output is reported under its own heading
    match(
      result.stdout,
      /PASSING_RAN[\s\S]*FAIL[\s\S]*EXAMPLE_BLEW_UP/u,
      "02.05",
    );
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test("03 - a package without an examples directory passes", () => {
  const { consumerDirectory, root } = createPackage();
  try {
    const result = runExamples(consumerDirectory);

    equal(result.status, 0, "03.01");
    equal(result.stdout.trim(), "", "03.02");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test("04 - an unreadable examples directory fails the run", () => {
  const { consumerDirectory, root } = createPackage({
    examples: "a file where the examples directory belongs\n",
  });
  try {
    const result = runExamples(consumerDirectory);

    // ENOTDIR is not ENOENT: it cannot be reported as a passing run
    equal(result.status, 1, "04.01");
    match(result.stderr, /run-examples\.js failed/u, "04.02");
    match(result.stderr, /ENOTDIR/u, "04.03");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test.run();
