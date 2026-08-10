import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal } from "uvu/assert";
import { readJson, writeJson } from "../json-file.js";

test("01 - preserves spacing, EOL and final EOL options", async () => {
  const file = path.join(temporaryDirectory(), "fixture.json");

  await writeJson(
    file,
    { alpha: 1 },
    {
      spaces: "\t",
      EOL: "\r\n",
      finalEOL: false,
    },
  );

  equal(await readFile(file, "utf8"), '{\r\n\t"alpha": 1\r\n}', "01.01");
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
    "json-sort-cli/writeJson(): [THROW_ID_01] Converting undefined value to JSON is not supported",
    "02.02",
  );
});

test("03 - strips a BOM and supports a reviver", async () => {
  const file = path.join(temporaryDirectory(), "fixture.json");
  await writeFile(file, '\uFEFF{"alpha": 1}');

  equal(await readJson(file), { alpha: 1 }, "03.01");

  const received = await readJson(file, {
    encoding: "utf8",
    reviver: (key, value) => (key === "alpha" ? value + 1 : value),
  });

  equal(received, { alpha: 2 }, "03.02");
});

test("04 - prefixes JSON parse errors with the filename", async () => {
  const file = path.join(temporaryDirectory(), "fixture.json");
  await writeFile(file, "{");
  let caught;

  try {
    await readJson(file, "utf8");
  } catch (error) {
    caught = error;
  }

  equal(caught instanceof SyntaxError, true, "04.01");
  equal(caught.message.startsWith(`${file}: `), true, "04.02");
});

test("05 - returns null for invalid JSON when throws is false", async () => {
  const file = path.join(temporaryDirectory(), "fixture.json");
  await writeFile(file, "{");

  equal(await readJson(file, { throws: false }), null, "05.01");
});

test.run();
