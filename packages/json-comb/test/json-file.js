import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal } from "uvu/assert";
import { readJson, writeJson } from "../json-file.js";

test("01 - prefixes malformed JSON errors with the filename", async () => {
  const file = path.join(temporaryDirectory(), "fixture.json");
  await writeFile(file, "{");
  let caught;

  try {
    await readJson(file);
  } catch (error) {
    caught = error;
  }

  equal(caught instanceof SyntaxError, true, "01.01");
  equal(caught.message.startsWith(`${file}: `), true, "01.02");
});

test("02 - rejects unsupported JSON values with TypeError", async () => {
  const file = path.join(temporaryDirectory(), "fixture.json");
  let caught;

  try {
    await writeJson(file, undefined);
  } catch (error) {
    caught = error;
  }

  equal(caught instanceof TypeError, true, "02.01");
  equal(
    caught.message,
    "json-comb/writeJson(): [THROW_ID_01] Converting undefined value to JSON is not supported",
    "02.02",
  );
});

test("03 - exposes filesystem write failures", async () => {
  const file = path.join(
    temporaryDirectory(),
    "missing-directory",
    "fixture.json",
  );
  let caught;

  try {
    await writeJson(file, {});
  } catch (error) {
    caught = error;
  }

  equal(caught?.code, "ENOENT", "03.01");
  equal(
    await readFile(path.dirname(file)).catch((error) => error.code),
    "ENOENT",
    "03.02",
  );
});

test.run();
