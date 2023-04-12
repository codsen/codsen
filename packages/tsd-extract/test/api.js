import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - source defs arg is wrong", () => {
  throws(
    () => {
      extract();
    },
    /THROW_ID_01/g,
    "01.01"
  );
  throws(
    () => {
      extract(1);
    },
    /THROW_ID_01/g,
    "01.02"
  );
  throws(
    () => {
      extract(true);
    },
    /THROW_ID_01/g,
    "01.03"
  );
});

test("02 - def arg is wrong", () => {
  throws(
    () => {
      extract("");
    },
    /THROW_ID_02/g,
    "02.01"
  );
  throws(
    () => {
      extract("zzz", 1);
    },
    /THROW_ID_02/g,
    "02.02"
  );
});

test("03 - opts arg is wrong", () => {
  throws(
    () => {
      extract("zzz", "zzz", 1);
    },
    /THROW_ID_03/g,
    "03.01"
  );
  throws(
    () => {
      extract("zzz", "zzz", []);
    },
    /THROW_ID_03/g,
    "03.02"
  );
  throws(
    () => {
      extract("zzz", "zzz", [""]);
    },
    /THROW_ID_03/g,
    "03.03"
  );
  throws(
    () => {
      extract("zzz", "zzz", ["throwIfNotFound"]);
    },
    /THROW_ID_03/g,
    "03.04"
  );
});

test("04 - defs arg is not found", () => {
  equal(
    extract("a", "b", { extractAll: true }),
    {
      identifiers: [],
      identifiersStartAt: null,
      identifiersEndAt: null,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: null,
      valueStartsAt: null,
      valueEndsAt: null,
      error: "not found",
      all: ["a"],
    },
    "04.01"
  );
  equal(
    extract("a", "b", { extractAll: false }),
    {
      identifiers: [],
      identifiersStartAt: null,
      identifiersEndAt: null,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: null,
      valueStartsAt: null,
      valueEndsAt: null,
      error: "not found",
      all: [],
    },
    "04.02"
  );
});

test("05 - minimal #1", () => {
  equal(
    extract("x", "x", { extractAll: true }),
    {
      identifiers: ["x"],
      identifiersStartAt: 0,
      identifiersEndAt: 1,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "x",
      valueStartsAt: 0,
      valueEndsAt: 1,
      error: null,
      all: ["x"],
    },
    "05.01"
  );
  equal(
    extract("x", "x", { extractAll: false }),
    {
      identifiers: ["x"],
      identifiersStartAt: 0,
      identifiersEndAt: 1,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "x",
      valueStartsAt: 0,
      valueEndsAt: 1,
      error: null,
      all: [],
    },
    "05.02"
  );
});

test("06 - minimal #2", () => {
  equal(
    extract("a b", "b", { extractAll: true }),
    {
      identifiers: ["a", "b"],
      identifiersStartAt: 0,
      identifiersEndAt: 3,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "a b",
      valueStartsAt: 0,
      valueEndsAt: 3,
      error: null,
      all: ["a", "b"],
    },
    "06.01"
  );
  equal(
    extract("a b", "b", { extractAll: false }),
    {
      identifiers: ["a", "b"],
      identifiersStartAt: 0,
      identifiersEndAt: 3,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: "a b",
      valueStartsAt: 0,
      valueEndsAt: 3,
      error: null,
      all: [],
    },
    "06.02"
  );
});

test("07 - minimal #3", () => {
  equal(
    extract("ab", "b", { extractAll: true }),
    {
      identifiers: [],
      identifiersStartAt: null,
      identifiersEndAt: null,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: null,
      valueStartsAt: null,
      valueEndsAt: null,
      error: "not found",
      all: ["ab"],
    },
    "07.01"
  );
  equal(
    extract("ab", "b", { extractAll: false }),
    {
      identifiers: [],
      identifiersStartAt: null,
      identifiersEndAt: null,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: null,
      valueStartsAt: null,
      valueEndsAt: null,
      error: "not found",
      all: [],
    },
    "07.02"
  );
});

test("08 - unclosed comment range - found", () => {
  equal(
    extract(
      `interface x { y: boolean }; /*
    `,
      "x",
      { extractAll: true }
    ),
    {
      identifiers: ["interface", "x"],
      identifiersStartAt: 0,
      identifiersEndAt: 11,
      content: "{ y: boolean };",
      contentStartsAt: 12,
      contentEndsAt: 27,
      value: "interface x { y: boolean };",
      valueStartsAt: 0,
      valueEndsAt: 27,
      error: null,
      all: ["x"],
    },
    "08.01"
  );
});

test("09 - unclosed comment range - not found", () => {
  equal(
    extract(
      `/*interface x { y: boolean };
    `,
      "x",
      { extractAll: true }
    ),
    {
      identifiers: [],
      identifiersStartAt: null,
      identifiersEndAt: null,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: null,
      valueStartsAt: null,
      valueEndsAt: null,
      error: "not found",
      all: [],
    },
    "09.01"
  );
});

test("10 - unclosed line comment", () => {
  equal(
    extract("//", "x", { extractAll: true }),
    {
      identifiers: [],
      identifiersStartAt: null,
      identifiersEndAt: null,
      content: null,
      contentStartsAt: null,
      contentEndsAt: null,
      value: null,
      valueStartsAt: null,
      valueEndsAt: null,
      error: "not found",
      all: [],
    },
    "10.01"
  );
});

test("11 - supports CR line endings", () => {
  equal(
    extract(
      "interface a { b: boolean }; //\rinterface c { d: boolean };",
      "a",
      { extractAll: true }
    ),
    {
      identifiers: ["interface", "a"],
      identifiersStartAt: 0,
      identifiersEndAt: 11,
      content: "{ b: boolean };",
      contentStartsAt: 12,
      contentEndsAt: 27,
      value: "interface a { b: boolean };",
      valueStartsAt: 0,
      valueEndsAt: 27,
      error: null,
      all: ["a", "c"],
    },
    "11.01"
  );
  equal(
    extract(
      "interface a { b: boolean }; //\rinterface c { d: boolean };",
      "c",
      { extractAll: true }
    ),
    {
      identifiers: ["interface", "c"],
      identifiersStartAt: 31,
      identifiersEndAt: 42,
      content: "{ d: boolean };",
      contentStartsAt: 43,
      contentEndsAt: 58,
      value: "interface c { d: boolean };",
      valueStartsAt: 31,
      valueEndsAt: 58,
      error: null,
      all: ["a", "c"],
    },
    "11.02"
  );
});

test.run();
