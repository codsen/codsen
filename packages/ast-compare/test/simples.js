import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../dist/ast-compare.esm.js";

// (input, objToDelete, strictOrNot)

// =============
// Obj - Simples
// =============

test("01 - plain objects", () => {
  equal(compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }), true, "01");
});

test("02 - plain objects", () => {
  equal(compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }), false, "02");
});

test("03 - plain objects", () => {
  is(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "2", c: "3" },
      { verboseWhenMismatches: true }
    ),
    `The given object has key "c" which the other-one does not have.`,
    "03"
  );
});

test("04 - plain objects", () => {
  equal(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "1", b: "2" },
      { matchStrictly: true }
    ),
    false,
    "04"
  );
});

test("05 - plain objects", () => {
  type(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "1", b: "2" },
      { matchStrictly: true, verboseWhenMismatches: true }
    ),
    "string"
  );
});

test("06 - plain objects", () => {
  equal(
    compare({ a: "1", b: "2" }, { a: "1", b: "2" }, { matchStrictly: true }),
    true,
    "06"
  );
});

test("07 - plain objects", () => {
  // matchStrictly trumps hungryForWhitespace if key count does not match
  equal(
    compare(
      { a: "1", b: "2", c: "\n\n\n" },
      { a: "1", b: "2" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    false,
    "07"
  );
});

test("08 - plain objects", () => {
  // matchStrictly trumps hungryForWhitespace if key count does not match
  type(
    compare(
      { a: "1", b: "2", c: "\n\n\n" },
      { a: "1", b: "2" },
      {
        matchStrictly: true,
        hungryForWhitespace: true,
        verboseWhenMismatches: true,
      }
    ),
    "string"
  );
});

test("09 - plain objects - two whitespaces", () => {
  // keys match exactly, different white space matched
  equal(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "09"
  );
});

test("10 - plain objects - whitespace vs empty str", () => {
  // keys match exactly, white space matches to empty string
  equal(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "10"
  );
});

test("11 - plain objects - empty str vs whitespace", () => {
  // keys match exactly, empty string matches to white space
  equal(
    compare(
      { a: "1", b: "" },
      { a: "1", b: "\t\t\t \n\n\n" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "11"
  );
});

test("12 - plain objects", () => {
  // keys match exactly, string does not match to empty string
  equal(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    false,
    "12"
  );
});

test("13 - plain objects", () => {
  // keys match exactly, string does not match to empty string
  type(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "     " },
      {
        matchStrictly: true,
        hungryForWhitespace: true,
        verboseWhenMismatches: true,
      }
    ),
    "string"
  );
});

test("14 - plain objects", () => {
  // keys match exactly, different white space matched
  equal(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: false }
    ),
    false,
    "14"
  );
});

test("15 - plain objects", () => {
  // keys match exactly, different white space matched
  type(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      {
        matchStrictly: true,
        hungryForWhitespace: false,
        verboseWhenMismatches: true,
      }
    ),
    "string"
  );
});

test("16 - comparison of empty plain objects", () => {
  equal(compare({}, { a: "1", b: "2" }), false, "16");
});

test("17 - comparison of empty plain objects", () => {
  equal(
    compare({}, { a: "1", b: "2" }, { hungryForWhitespace: true }),
    false,
    "17"
  );
});

test("18 - comparison of empty plain objects", () => {
  equal(compare({}, { a: "1", b: "2" }, { matchStrictly: true }), false, "18");
});

test("19 - comparison of empty plain objects", () => {
  equal(compare({ a: "1", b: "2", c: "3" }, {}), false, "19");
});

test("20 - comparison of empty plain objects", () => {
  equal(
    compare({ a: "1", b: "2", c: "3" }, {}, { hungryForWhitespace: true }),
    false,
    "20"
  );
});

test("21 - comparison of empty plain objects", () => {
  equal(
    compare({ a: "1", b: "2", c: "3" }, {}, { matchStrictly: true }),
    false,
    "21"
  );
});

test("22 - comparison of empty plain objects", () => {
  equal(
    compare(
      { a: "1", b: "2", c: "3" },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "22"
  );
});

test("23 - comparison of empty plain objects", () => {
  equal(compare({ a: "1", b: "2", c: "3" }, { a: "\n\n\n" }), false, "23");
});

test("24 - comparison of empty plain objects", () => {
  equal(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false,
    "24"
  );
});

test("25 - comparison of empty plain objects", () => {
  equal(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    false,
    "25"
  );
});

test("26 - comparison of empty plain objects", () => {
  equal(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false,
    "26"
  );
});

test("27 - comparison of empty plain objects", () => {
  equal(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "27"
  );
});

test("28 - comparing two empty plain objects", () => {
  equal(compare({}, {}), true, "28");
});

test("29 - comparison of empty plain objects", () => {
  equal(
    compare({}, {}, { hungryForWhitespace: true, matchStrictly: false }),
    true,
    "29"
  );
});

test("30 - comparison of empty plain objects", () => {
  equal(
    compare({}, {}, { hungryForWhitespace: true, matchStrictly: true }),
    true,
    "30"
  );
});

test("31 - catching row 199 for 100% coverage", () => {
  equal(
    compare(
      { a: { b: [] } },
      { a: { b: {} } },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "31"
  );
});

test("32 - sneaky similarity", () => {
  equal(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: ["3"] }),
    false,
    "32"
  );
});

test("33 - comparison of empty plain objects", () => {
  equal(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: 3 }),
    false,
    "33"
  );
});

test("34 - comparison of empty plain objects", () => {
  equal(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: { d: "3" } }),
    false,
    "34"
  );
});

test("35 - big object has one element extra", () => {
  equal(compare({ a: "1", b: "2", c: 3 }, { a: "1", b: "2" }), true, "35");
});

test("36 - small object has one element extra", () => {
  equal(compare({ a: "1", b: "2" }, { a: "1", b: "2", c: 3 }), false, "36");
});

test("37 - object values are arrays, one has a string, another has none", () => {
  equal(
    compare(
      {
        key: ["a"],
      },
      {
        key: [],
      }
    ),
    false,
    "37"
  );
});

test("38 - comparison of empty plain objects", () => {
  // relying on default
  type(
    compare(
      {
        key: ["a"],
      },
      {
        key: [],
      },
      {
        verboseWhenMismatches: true,
      }
    ),
    "string",
    "38"
  );
});

test("39 - comparison of empty plain objects", () => {
  // same, default hardcoded
  equal(
    compare(
      {
        key: ["a"],
      },
      {
        key: [],
      },
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false,
    "39"
  );
});

test("40 - comparison of empty plain objects - hungryForWhitespace", () => {
  equal(
    compare(
      {
        key: ["a"],
      },
      {
        key: [],
      },
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    true,
    "40"
  );
});

test("41 - comparison of empty plain objects - same, default hardcoded", () => {
  equal(
    compare(
      {
        key: ["a"],
      },
      {
        key: [],
      },
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false,
    "41"
  );
});

test("42 - comparison of empty plain objects - matchStrictly trump hungryForWhitespace", () => {
  // matchStrictly trump hungryForWhitespace - element count is uneven hence a falsey result
  equal(
    compare(
      {
        key: ["a"],
      },
      {
        key: [],
      },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "42"
  );
});

test("43 - empty object with keys vs object with no keys", () => {
  equal(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false,
    "43"
  );
});

test("44 - empty object with keys vs object with no keys", () => {
  equal(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false,
    "44"
  );
});

test("45 - empty object with keys vs object with no keys", () => {
  equal(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    true,
    "45"
  );
});

test("46 - empty object with keys vs object with no keys", () => {
  equal(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "46"
  );
});

test("47 - Boolean and numeric values", () => {
  // control - booleans and numbers as obj values
  equal(compare({ a: false, b: 2, c: "3" }, { a: false, b: 2 }), true, "47");
});

test("48 - s is zero length, b is empty - defaults", () => {
  equal(
    compare({ a: "\n\n\n   \t\t\t", b: "2" }, { a: "", b: "2" }),
    false,
    "48"
  );
});

test("49 - s is zero length, b is empty - opts.hungryForWhitespace", () => {
  equal(
    compare(
      { a: "\n\n\n   \t\t\t", b: "2" },
      { a: "", b: "2" },
      { hungryForWhitespace: true }
    ),
    true,
    "49"
  );
});

test("50 - s is zero length, b is empty - opts.hungryForWhitespace", () => {
  // no keys array vs array with all empty vales
  equal(
    compare([{ a: "\n\n\n" }], {}, { hungryForWhitespace: true }),
    true,
    "50"
  );
});

test.run();
