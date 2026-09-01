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

test("06 - preserves or safely normalizes values thrown by revivers", async () => {
  const file = path.join(temporaryDirectory(), "fixture.json");
  await writeFile(file, '{"alpha": 1}');
  const unstringifiable = {
    [Symbol.toPrimitive]() {
      throw new Error("can't stringify");
    },
  };
  const frozenError = Object.freeze(new Error("frozen"));
  const values = [
    new Error("boom"),
    frozenError,
    "boom",
    7,
    false,
    Symbol("boom"),
    {},
    null,
    unstringifiable,
  ];
  const received = [];

  for (const value of values) {
    try {
      await readJson(file, {
        reviver: () => {
          throw value;
        },
      });
    } catch (error) {
      received.push({
        cause: error.cause,
        message: error.message,
        sameError: error === value,
      });
    }
  }

  equal(
    received.map(({ cause, message, sameError }, index) => ({
      message: message.slice(file.length + 2),
      sameCause: cause === values[index],
      sameError,
    })),
    [
      { message: "boom", sameCause: false, sameError: true },
      { message: "frozen", sameCause: true, sameError: false },
      { message: "JSON reviver threw boom", sameCause: true, sameError: false },
      { message: "JSON reviver threw 7", sameCause: true, sameError: false },
      {
        message: "JSON reviver threw false",
        sameCause: true,
        sameError: false,
      },
      {
        message: "JSON reviver threw Symbol(boom)",
        sameCause: true,
        sameError: false,
      },
      {
        message: "JSON reviver threw [object Object]",
        sameCause: true,
        sameError: false,
      },
      { message: "JSON reviver threw null", sameCause: true, sameError: false },
      {
        message: "JSON reviver threw Unknown non-Error value",
        sameCause: true,
        sameError: false,
      },
    ],
    "06.01",
  );

  equal(
    await readJson(file, {
      reviver: () => {
        throw "boom";
      },
      throws: false,
    }),
    null,
    "06.02",
  );
});

test("07 - invalid UTF-8 follows the configured throw policy", async () => {
  const file = path.join(temporaryDirectory(), "fixture.json");
  const source = Buffer.from([
    0x7b, 0x22, 0x61, 0x22, 0x3a, 0x22, 0x80, 0x22, 0x7d,
  ]);
  await writeFile(file, source);

  equal(await readJson(file, { throws: false }), null, "07.01");

  let caught;
  try {
    await readJson(file);
  } catch (error) {
    caught = error;
  }
  equal(caught instanceof SyntaxError, true, "07.02");
  equal(caught.message.startsWith(`${file}: `), true, "07.03");
  equal(await readFile(file), source, "07.04");

  await writeFile(file, Buffer.from("\uFEFF\uFEFF{}"));
  equal(await readJson(file, { throws: false }), null, "07.05");
});

test("08 - rejects encoding requests that cannot preserve JSON UTF-8", async () => {
  const file = path.join(temporaryDirectory(), "fixture.json");
  await writeFile(file, "{}");
  let caught;

  try {
    await readJson(file, "utf16le");
  } catch (error) {
    caught = error;
  }

  equal(caught instanceof TypeError, true, "08.01");
  equal(
    caught.message,
    "json-sort-cli/readJson(): [THROW_ID_01] options.encoding must be utf8 or utf-8",
    "08.02",
  );
  equal(await readJson(file, "utf-8"), {}, "08.03");
});

test.run();
