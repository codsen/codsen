import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { test } from "uvu";
import { equal, match, ok } from "uvu/assert";
import { deleteGeneratedFile, writeGeneratedFile } from "../generatedFiles.js";
import { formatGeneratedContents } from "../generatedFormatting.js";

const repositoryRoot = path.resolve(import.meta.dirname, "../../..");

function withTemporaryRoot(callback) {
  const root = mkdtempSync(path.join(tmpdir(), "generated-files-"));
  return Promise.resolve(callback(root)).finally(() => {
    rmSync(root, { force: true, recursive: true });
  });
}

test("01 - check accepts current content without changing metadata", async () => {
  await withTemporaryRoot(async (root) => {
    const filename = path.join(root, "current.txt");
    writeFileSync(filename, "current\n");
    const before = statSync(filename).mtimeMs;
    const changed = await writeGeneratedFile({
      contents: "current\n",
      filename,
      fixCommand: "npm run generate",
      mode: "check",
    });

    equal(changed, false, "01.01");
    equal(statSync(filename).mtimeMs, before, "01.02");
  });
});

test("02 - check reports a missing file without creating it", async () => {
  await withTemporaryRoot(async (root) => {
    const filename = path.join(root, "missing.txt");
    let error;
    try {
      await writeGeneratedFile({
        contents: "expected\n",
        filename,
        fixCommand: "npm run generate",
        mode: "check",
      });
    } catch (caught) {
      error = caught;
    }

    match(error.message, /missing\.txt.*npm run generate/, "02.01");
    equal(existsSync(filename), false, "02.02");
  });
});

test("03 - check reports stale bytes without replacing them", async () => {
  await withTemporaryRoot(async (root) => {
    const filename = path.join(root, "stale.txt");
    writeFileSync(filename, "old\n");
    let error;
    try {
      await writeGeneratedFile({
        contents: "new\n",
        filename,
        fixCommand: "npm run generate",
        mode: "check",
      });
    } catch (caught) {
      error = caught;
    }

    match(error.message, /stale\.txt.*npm run generate/, "03.01");
    equal(readFileSync(filename, "utf8"), "old\n", "03.02");
  });
});

test("04 - check reports a forbidden generated path without deleting it", async () => {
  await withTemporaryRoot(async (root) => {
    const filename = path.join(root, "forbidden.txt");
    writeFileSync(filename, "keep\n");
    let error;
    try {
      await deleteGeneratedFile({
        filename,
        fixCommand: "npm run generate",
        mode: "check",
      });
    } catch (caught) {
      error = caught;
    }

    match(error.message, /forbidden\.txt.*npm run generate/, "04.01");
    equal(readFileSync(filename, "utf8"), "keep\n", "04.02");
  });
});

test("05 - write mode updates stale files and removes forbidden paths", async () => {
  await withTemporaryRoot(async (root) => {
    const generated = path.join(root, "nested/generated.txt");
    const forbidden = path.join(root, "forbidden.txt");
    mkdirSync(path.dirname(generated), { recursive: true });
    writeFileSync(generated, "old\n");
    writeFileSync(forbidden, "remove\n");

    ok(
      await writeGeneratedFile({
        contents: "new\n",
        filename: generated,
        fixCommand: "npm run generate",
      }),
      "05.01",
    );
    ok(
      await deleteGeneratedFile({
        filename: forbidden,
        fixCommand: "npm run generate",
      }),
      "05.02",
    );
    equal(readFileSync(generated, "utf8"), "new\n", "05.03");
  });
});

test("06 - generated JSON uses the repository formatter", () => {
  const contents = formatGeneratedContents({
    contents: `${JSON.stringify({ values: ["one"] }, null, 2)}\n`,
    filename: path.join(repositoryRoot, "packages/example/package.json"),
    repositoryRoot,
  });

  equal(contents, '{\n  "values": ["one"]\n}\n', "06.01");
});

test("07 - formatter failures retain the generated target", () => {
  const filename = path.join(repositoryRoot, "package.json");
  let error;
  try {
    formatGeneratedContents({
      contents: "{}\n",
      filename,
      repositoryRoot,
      runProcess: () => ({ status: 1, stderr: "injected failure" }),
    });
  } catch (caught) {
    error = caught;
  }

  match(error.message, /package\.json.*injected failure/, "07.01");
});

test.run();
