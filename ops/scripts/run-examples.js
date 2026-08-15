import fs from "node:fs/promises";
import path from "node:path";
import { execa } from "execa";

const EXAMPLE_EXTENSIONS = new Set([".js", ".mjs"]);
const examplesDirectory = path.resolve(".", "examples");

// black on green, white bold on red, and green:
const PASS = "\u001B[30m\u001B[42m PASS \u001B[49m\u001B[39m";
const FAIL = "\u001B[37;1;41m FAIL \u001B[49m";
const OK = "\u001B[32mOK\u001B[39m";

async function readExampleFilenames() {
  try {
    const files = await fs.readdir(examplesDirectory);
    return files
      .filter((file) => EXAMPLE_EXTENSIONS.has(path.extname(file)))
      .sort();
  } catch (err) {
    if (err.code === "ENOENT") {
      // a package without an examples/ directory has nothing to run
      return [];
    }
    throw err;
  }
}

async function runExample(file) {
  // no shell: the resolved path can contain spaces, and process.execPath does
  // not depend on "node" being resolvable through PATH
  const result = await execa(
    process.execPath,
    [path.join(examplesDirectory, file)],
    { all: true, reject: false },
  );
  return {
    error: result.failed ? (result.shortMessage ?? result.message) : undefined,
    file,
    output: result.all,
  };
}

async function runExamples() {
  // the examples run concurrently, but each one's output is held back and
  // reported under its own heading, so concurrent failures stay readable
  const results = await Promise.all(
    (await readExampleFilenames()).map((file) => runExample(file)),
  );

  for (const { error, file, output } of results) {
    console.log(
      error
        ? `${FAIL} examples/${file}:\n${error}`
        : `${PASS} examples/${file} ${OK}`,
    );
    if (output) {
      console.log(output);
    }
  }

  return results.every(({ error }) => !error);
}

// an unexpected failure here must not be reported as a passing examples run,
// so the exit code is set explicitly rather than left to Node's default
// handling of an unhandled rejection
try {
  if (!(await runExamples())) {
    process.exitCode = 1;
  }
} catch (err) {
  console.error(`ops/scripts/run-examples.js failed:\n${err?.stack ?? err}`);
  process.exitCode = 1;
}
