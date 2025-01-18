import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../dist/ast-compare.esm.js";

// nested
// -----------------------------------------------------------------------------

test("01 - simple nested plain objects", () => {
  equal(
    compare({ a: { d: "4" }, b: "2", c: "3" }, { a: { d: "4" }, b: "2" }),
    true,
    "01.01",
  );
});

test("02 - simple nested plain objects + array wrapper", () => {
  equal(
    compare({ a: [{ d: "4" }], b: "2", c: "3" }, { a: [{ d: "4" }], b: "2" }),
    true,
    "02.01",
  );
});

test("03 - simple nested plain objects, won't find", () => {
  equal(
    compare({ a: { d: "4" }, b: "2" }, { a: { d: "4" }, b: "2", c: "3" }),
    false,
    "03.01",
  );
});

test("04 - simple nested plain objects + array wrapper, won't find", () => {
  equal(
    compare({ a: [{ d: "4" }], b: "2" }, { a: [{ d: "4" }], b: "2", c: "3" }),
    false,
    "04.01",
  );
});

test("05 - obj, multiple nested levels, bigObj has more", () => {
  equal(
    compare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }] } } } },
    ),
    true,
    "05.01",
  );
});

test("06 - obj, multiple nested levels, equal", () => {
  equal(
    compare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
    ),
    true,
    "06.01",
  );
});

test("07 - obj, multiple nested levels, smallObj has more", () => {
  equal(
    compare(
      { a: { b: { c: { d: [{ e: "1" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
    ),
    false,
    "07.01",
  );
});

test("08 - obj, deeper level doesn't match", () => {
  equal(compare({ a: { b: "c" } }, { a: { b: "d" } }), false, "08.01");
});

test("09 - empty string and empty nested object - defaults", () => {
  equal(
    compare("", {
      key2: [],
      key3: [""],
    }),
    false,
    "09.01",
  );
});

test("10 - empty string and empty nested object - hungryForWhitespace", () => {
  equal(
    compare(
      "",
      {
        key2: [],
        key3: [""],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    true,
    "10.01",
  );
});

test("11 - empty string and empty nested object - matchStrictly", () => {
  equal(
    compare(
      "",
      {
        key2: [],
        key3: [""],
      },
      {
        matchStrictly: true,
      },
    ),
    false,
    "11.01",
  );
});

test("12 - empty string and empty nested object - hungryForWhitespace + matchStrictly", () => {
  equal(
    compare(
      "",
      {
        key2: [],
        key3: [""],
      },
      {
        hungryForWhitespace: true,
        matchStrictly: true,
      },
    ),
    false,
    "12.01",
  );
});

test("13 - empty string and empty nested object - hungryForWhitespace + matchStrictly", () => {
  equal(
    compare(
      "",
      {},
      {
        hungryForWhitespace: true,
        matchStrictly: true,
      },
    ),
    true,
    "13.01",
  );
});

test("14 - multiple keys", () => {
  equal(
    compare(
      {
        key2: "\n\n \t \n \n    ",
        key3: "val3",
        key4: "val4",
      },
      {
        key2: [],
        key3: [],
      },
    ),
    false,
    "14.01",
  );
});

test("15 - multiple keys", () => {
  equal(
    compare(
      {
        key2: "\n\n \t \n \n    ",
        key3: "val3",
        key4: "val4",
      },
      {
        key2: [],
        key3: [],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    false,
    "15.01",
  );
});

test.run();
