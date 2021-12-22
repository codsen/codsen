import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { looseCompare } from "../dist/ast-loose-compare.esm.js";

// ==============================
// Precautions
// ==============================

test("01 - both inputs missing", () => {
  equal(looseCompare(), undefined, "01");
});

test("02 - first input missing", () => {
  equal(looseCompare({ a: "a" }), undefined, "02");
});

test("03 - second input missing", () => {
  equal(looseCompare(undefined, { a: "a" }), undefined, "03");
});

test("04 - null as input", () => {
  equal(looseCompare(undefined, { a: "a" }), undefined, "04");
});

test("05 - falsey inputs", () => {
  equal(looseCompare(null, undefined), undefined, "05");
});

test("06 - undefined in a second-level depth", () => {
  equal(
    looseCompare(
      {
        a: "a",
        b: {
          c: "c",
        },
      },
      {
        a: "a",
        b: undefined,
      }
    ),
    false,
    "06"
  );
});

// ==============================
// Obj - Simples
// ==============================

test("07 - simple plain objects", () => {
  equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }),
    true,
    "07"
  );
});

test("08 - simple plain objects #2", () => {
  equal(
    looseCompare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }),
    false,
    "08"
  );
});

test("09 - comparison against empty plain objects", () => {
  equal(looseCompare({}, { a: "1", b: "2" }), false, "09.01");
  equal(looseCompare({ a: "1", b: "2", c: "3" }, {}), false, "09.02");
});

test("10 - comparing two empty plain objects", () => {
  equal(looseCompare({}, {}), true, "10");
});

test("11 - false match involving empty arrays, sneaky similarity", () => {
  equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: ["3"] }),
    false,
    "11.01"
  );
  equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: 3 }),
    false,
    "11.02"
  );
  equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: { d: "3" } }),
    false,
    "11.03"
  );
});

test("12 - simple plain arrays, integer, match", () => {
  equal(looseCompare({ a: "1", b: "2", c: 3 }, { a: "1", b: "2" }), true, "12");
});

test("13 - simple plain arrays, integer, no match", () => {
  equal(
    looseCompare({ a: "1", b: "2" }, { a: "1", b: "2", c: 3 }),
    false,
    "13"
  );
});

// ==============================
// Obj - Nested
// ==============================

test("14 - simple nested plain objects", () => {
  equal(
    looseCompare({ a: { d: "4" }, b: "2", c: "3" }, { a: { d: "4" }, b: "2" }),
    true,
    "14"
  );
});

test("15 - simple nested plain objects + array wrapper", () => {
  equal(
    looseCompare(
      { a: [{ d: "4" }], b: "2", c: "3" },
      { a: [{ d: "4" }], b: "2" }
    ),
    true,
    "15"
  );
});

test("16 - simple nested plain objects, won't find", () => {
  equal(
    looseCompare({ a: { d: "4" }, b: "2" }, { a: { d: "4" }, b: "2", c: "3" }),
    false,
    "16"
  );
});

test("17 - simple nested plain objects + array wrapper, won't find", () => {
  equal(
    looseCompare(
      { a: [{ d: "4" }], b: "2" },
      { a: [{ d: "4" }], b: "2", c: "3" }
    ),
    false,
    "17"
  );
});

test("18 - obj, multiple nested levels, bigObj has more", () => {
  equal(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }] } } } }
    ),
    true,
    "18"
  );
});

test("19 - obj, multiple nested levels, equal", () => {
  equal(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    true,
    "19"
  );
});

test("20 - obj, multiple nested levels, smallObj has more", () => {
  equal(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    false,
    "20"
  );
});

// ==============================
// Arr - simples
// ==============================

test("21 - simple arrays with strings", () => {
  equal(looseCompare(["a", "b", "c"], ["a", "b"]), true, "21.01");
  equal(looseCompare(["a", "b"], ["a", "b", "c"]), false, "21.02");
});

test("22 - simple arrays with plain objects", () => {
  equal(
    looseCompare(
      [{ a: "1" }, { b: "2" }, { c: "3" }],
      [{ a: "1" }, { b: "2" }]
    ),
    true,
    "22.01"
  );
  equal(
    looseCompare(
      [{ a: "1" }, { b: "2" }],
      [{ a: "1" }, { b: "2" }, { c: "3" }]
    ),
    false,
    "22.02"
  );
});

test("23 - arrays, nested with strings and objects", () => {
  equal(
    looseCompare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]]
    ),
    true,
    "23.01"
  );
  equal(
    looseCompare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"]
    ),
    false,
    "23.02"
  );
});

test("24 - comparing empty arrays (variations)", () => {
  equal(looseCompare([], []), true, "24.01");
  equal(looseCompare([{}], [{}]), true, "24.02");
  equal(looseCompare([{}, {}], [{}]), true, "24.03");
  equal(looseCompare([{ a: [] }, {}, []], [{ a: [] }]), true, "24.04");
});

// ==============================
// Strings
// ==============================

test("25 - simple strings", () => {
  equal(looseCompare("aaaaa\nbbbbb", "aaaaa\nbbbbb"), true, "25.01");
  equal(looseCompare("aaaaa\nbbbbb", "aaaaa\nc"), false, "25.02");
});

test("26 - strings compared and fails", () => {
  equal(looseCompare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"]), false, "26");
});

test("27 - strings compared, positive", () => {
  equal(looseCompare(["aaaaa\nbbbbb"], ["aaaaa\nbbbbb"]), true, "27");
});

test("28 - strings compared, positive", () => {
  equal(looseCompare(["aaaaa\nbbbbb"], []), false, "28");
});

// ==============================
// Random
// ==============================

test("29 - weird comparisons", () => {
  equal(looseCompare(null, null), undefined, "29.01");
  equal(looseCompare(null, undefined), undefined, "29.02");
  equal(looseCompare([null], [undefined]), false, "29.03");
});

test("30 - real-life - won't find", () => {
  equal(
    looseCompare(
      {
        type: "rule",
        selectors: [".w2"],
      },
      {
        type: "rule",
        selectors: [],
      }
    ),
    false,
    "30"
  );
});

test("31 - real-life - will find", () => {
  equal(
    looseCompare(
      {
        type: "rule",
        selectors: [" \n "],
      },
      {
        type: "rule",
        selectors: [],
      }
    ),
    true,
    "31"
  );
});

test("32 - from README", () => {
  equal(
    looseCompare(
      {
        a: "a",
        b: [[["\n \n\n"]]],
        c: "c",
      },
      {
        a: "a",
        b: { c: { d: "   \t\t \t" } },
      }
    ),
    true,
    "32"
  );
});

test("33 - from real-life, precaution against false-positives", () => {
  equal(
    looseCompare(
      {
        x: [[["\n \n\n"]]],
        y: "a",
      },
      {
        z: "",
      }
    ),
    false,
    "33"
  );
});

// ==============================
// Obj - Comparing empty space with empty space
// ==============================

test("34 - simple plain objects #1", () => {
  equal(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "1", b: "\n\n\n" }),
    true,
    "34.01"
  );
  equal(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "2", b: "\n\n\n" }),
    false,
    "34.02"
  );
  equal(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "", b: "\n\n\n" }),
    false,
    "34.03"
  );
  equal(
    looseCompare({ a: "", b: "\t\t\t", c: "3" }, { a: "1", b: "\n\n\n" }),
    false,
    "34.04"
  );
  equal(
    looseCompare({ a: "", b: "\t\t\t", c: "3" }, { a: "", b: "\n\n\n" }),
    true,
    "34.05"
  );
});

test("35 - simple plain objects #2", () => {
  equal(
    looseCompare(
      { a: "1", b: "\t\t\t", c: "3" },
      { a: "1", b: ["\n\n\n", "   "] }
    ),
    true,
    "35.01"
  );
  equal(
    looseCompare(
      { a: "1", b: ["\t\t\t"], c: "3" },
      { a: "1", b: ["\n\n\n", "   "] }
    ),
    true,
    "35.02"
  );
  equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "   ", "\n "], c: "3" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "35.03"
  );
});

test("36 - simple plain objects #3", () => {
  equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "  ", ["\t"]], c: "3" },
      { a: "1", b: ["\n\n\n"] }
    ),
    true,
    "36"
  );
});

test("37 - simple plain objects #4", () => {
  equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "    ", " "], c: "2" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "37"
  );
});

test("38 - simple plain objects #5", () => {
  equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "   ", "   \n   "], c: "2" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "38"
  );
});

// ==============================
// Nested obj - Comparing empty space with empty space
// ==============================

test("39 - simple nested plain objects - will find", () => {
  equal(
    looseCompare(
      { a: "1", b: { c: { d: "\t\t\t" } }, c: "3" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "39.01"
  );
  equal(
    looseCompare(
      { a: "1", b: "\n\n\n", c: "3" },
      { a: "1", b: { c: { d: "\t\t\t" } } }
    ),
    true,
    "39.02"
  );
  equal(
    looseCompare(
      { a: "1", b: ["\n\n\n", "\t\t   "], c: "3" },
      { a: "1", b: { c: [{ d: ["\t\t\t \n"] }] } }
    ),
    true,
    "39.03"
  );
});

test("40 - simple nested plain objects - won't find", () => {
  equal(
    looseCompare(
      { a: "1", b: { c: { d: "\t\t\t" } }, c: "3" },
      { a: "2", b: "\n\n\n" }
    ),
    false,
    "40.01"
  );
  equal(
    looseCompare(
      { a: "1", b: "\n\n\n", c: "3" },
      { a: "2", b: { c: { d: "\t\t\t" } } }
    ),
    false,
    "40.02"
  );
  equal(
    looseCompare(
      { a: "1", b: ["\n\n\n", "\t\t   "], c: "3" },
      { a: "2", b: { c: { d: "\t\t\t \n" } } }
    ),
    false,
    "40.03"
  );
});

// ==============================
// Strings - empty space cases
// ==============================

test("41 - Strings vs strings", () => {
  equal(looseCompare("\n\n\n", "\t\t\t"), true, "41");
});

test("42 - Comparing empty string to string", () => {
  equal(looseCompare("", "\t\t\t"), true, "42");
});

test("43 - Comparing string to empty string in an array", () => {
  equal(looseCompare(["\n\n\n"], ""), true, "43");
});

test("44 - Comparing empty to empty string", () => {
  equal(looseCompare("", ""), true, "44.01");
  equal(looseCompare([""], ""), true, "44.02");
  equal(looseCompare("", [""]), true, "44.03");
});

test("45 - Comparing empty array to empty plain object", () => {
  equal(looseCompare({ a: "" }, [""]), true, "45");
});

// ==============================
// Other cases
// ==============================

test("46 - both are plain objects, didn't match - returns false", () => {
  equal(
    looseCompare(
      {
        a: [{}],
      },
      {
        a: NaN,
      }
    ),
    false,
    "46"
  );
});

test("47 - two functions given - returns false", () => {
  function dummy() {
    return "zzz";
  }
  equal(looseCompare(dummy, dummy), false, "47");
});

test.run();
