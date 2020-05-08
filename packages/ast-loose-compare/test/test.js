import tap from "tap";
import looseCompare from "../dist/ast-loose-compare.esm";

// ==============================
// Precautions
// ==============================

tap.test("01 - both inputs missing", (t) => {
  t.equal(looseCompare(), undefined, "01");
  t.end();
});

tap.test("02 - first input missing", (t) => {
  t.equal(looseCompare({ a: "a" }), undefined, "02");
  t.end();
});

tap.test("03 - second input missing", (t) => {
  t.equal(looseCompare(undefined, { a: "a" }), undefined, "03");
  t.end();
});

tap.test("04 - null as input", (t) => {
  t.equal(looseCompare(undefined, { a: "a" }), undefined, "04");
  t.end();
});

tap.test("05 - falsey inputs", (t) => {
  t.equal(looseCompare(null, undefined), undefined, "05");
  t.end();
});

tap.test("06 - undefined in a second-level depth", (t) => {
  t.equal(
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
  t.end();
});

// ==============================
// Obj - Simples
// ==============================

tap.test("07 - simple plain objects", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }),
    true,
    "07"
  );
  t.end();
});

tap.test("08 - simple plain objects #2", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }),
    false,
    "08"
  );
  t.end();
});

tap.test("09 - comparison against empty plain objects", (t) => {
  t.equal(looseCompare({}, { a: "1", b: "2" }), false, "09.01");
  t.equal(looseCompare({ a: "1", b: "2", c: "3" }, {}), false, "09.02");
  t.end();
});

tap.test("10 - comparing two empty plain objects", (t) => {
  t.equal(looseCompare({}, {}), true, "10");
  t.end();
});

tap.test("11 - false match involving empty arrays, sneaky similarity", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: ["3"] }),
    false,
    "11.01"
  );
  t.equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: 3 }),
    false,
    "11.02"
  );
  t.equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: { d: "3" } }),
    false,
    "11.03"
  );
  t.end();
});

tap.test("12 - simple plain arrays, integer, match", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "2", c: 3 }, { a: "1", b: "2" }),
    true,
    "12"
  );
  t.end();
});

tap.test("13 - simple plain arrays, integer, no match", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "2" }, { a: "1", b: "2", c: 3 }),
    false,
    "13"
  );
  t.end();
});

// ==============================
// Obj - Nested
// ==============================

tap.test("14 - simple nested plain objects", (t) => {
  t.equal(
    looseCompare({ a: { d: "4" }, b: "2", c: "3" }, { a: { d: "4" }, b: "2" }),
    true,
    "14"
  );
  t.end();
});

tap.test("15 - simple nested plain objects + array wrapper", (t) => {
  t.equal(
    looseCompare(
      { a: [{ d: "4" }], b: "2", c: "3" },
      { a: [{ d: "4" }], b: "2" }
    ),
    true,
    "15"
  );
  t.end();
});

tap.test("16 - simple nested plain objects, won't find", (t) => {
  t.equal(
    looseCompare({ a: { d: "4" }, b: "2" }, { a: { d: "4" }, b: "2", c: "3" }),
    false,
    "16"
  );
  t.end();
});

tap.test(
  "17 - simple nested plain objects + array wrapper, won't find",
  (t) => {
    t.equal(
      looseCompare(
        { a: [{ d: "4" }], b: "2" },
        { a: [{ d: "4" }], b: "2", c: "3" }
      ),
      false,
      "17"
    );
    t.end();
  }
);

tap.test("18 - obj, multiple nested levels, bigObj has more", (t) => {
  t.equal(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }] } } } }
    ),
    true,
    "18"
  );
  t.end();
});

tap.test("19 - obj, multiple nested levels, equal", (t) => {
  t.equal(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    true,
    "19"
  );
  t.end();
});

tap.test("20 - obj, multiple nested levels, smallObj has more", (t) => {
  t.equal(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    false,
    "20"
  );
  t.end();
});

// ==============================
// Arr - simples
// ==============================

tap.test("21 - simple arrays with strings", (t) => {
  t.equal(looseCompare(["a", "b", "c"], ["a", "b"]), true, "21.01");
  t.equal(looseCompare(["a", "b"], ["a", "b", "c"]), false, "21.02");
  t.end();
});

tap.test("22 - simple arrays with plain objects", (t) => {
  t.equal(
    looseCompare(
      [{ a: "1" }, { b: "2" }, { c: "3" }],
      [{ a: "1" }, { b: "2" }]
    ),
    true,
    "22.01"
  );
  t.equal(
    looseCompare(
      [{ a: "1" }, { b: "2" }],
      [{ a: "1" }, { b: "2" }, { c: "3" }]
    ),
    false,
    "22.02"
  );
  t.end();
});

tap.test("23 - arrays, nested with strings and objects", (t) => {
  t.equal(
    looseCompare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]]
    ),
    true,
    "23.01"
  );
  t.equal(
    looseCompare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"]
    ),
    false,
    "23.02"
  );
  t.end();
});

tap.test("24 - comparing empty arrays (variations)", (t) => {
  t.equal(looseCompare([], []), true, "24.01");
  t.equal(looseCompare([{}], [{}]), true, "24.02");
  t.equal(looseCompare([{}, {}], [{}]), true, "24.03");
  t.equal(looseCompare([{ a: [] }, {}, []], [{ a: [] }]), true, "24.04");
  t.end();
});

// ==============================
// Strings
// ==============================

tap.test("25 - simple strings", (t) => {
  t.equal(looseCompare("aaaaa\nbbbbb", "aaaaa\nbbbbb"), true, "25.01");
  t.equal(looseCompare("aaaaa\nbbbbb", "aaaaa\nc"), false, "25.02");
  t.end();
});

tap.test("26 - strings compared and fails", (t) => {
  t.equal(looseCompare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"]), false, "26");
  t.end();
});

tap.test("27 - strings compared, positive", (t) => {
  t.equal(looseCompare(["aaaaa\nbbbbb"], ["aaaaa\nbbbbb"]), true, "27");
  t.end();
});

tap.test("28 - strings compared, positive", (t) => {
  t.equal(looseCompare(["aaaaa\nbbbbb"], []), false, "28");
  t.end();
});

// ==============================
// Random
// ==============================

tap.test("29 - weird comparisons", (t) => {
  t.equal(looseCompare(null, null), undefined, "29.01");
  t.equal(looseCompare(null, undefined), undefined, "29.02");
  t.equal(looseCompare([null], [undefined]), false, "29.03");
  t.end();
});

tap.test("30 - real-life - won't find", (t) => {
  t.equal(
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
  t.end();
});

tap.test("31 - real-life - will find", (t) => {
  t.equal(
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
  t.end();
});

tap.test("32 - from README", (t) => {
  t.equal(
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
  t.end();
});

tap.test("33 - from real-life, precaution against false-positives", (t) => {
  t.equal(
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
  t.end();
});

// ==============================
// Obj - Comparing empty space with empty space
// ==============================

tap.test("34 - simple plain objects #1", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "1", b: "\n\n\n" }),
    true,
    "34.01"
  );
  t.equal(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "2", b: "\n\n\n" }),
    false,
    "34.02"
  );
  t.equal(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "", b: "\n\n\n" }),
    false,
    "34.03"
  );
  t.equal(
    looseCompare({ a: "", b: "\t\t\t", c: "3" }, { a: "1", b: "\n\n\n" }),
    false,
    "34.04"
  );
  t.equal(
    looseCompare({ a: "", b: "\t\t\t", c: "3" }, { a: "", b: "\n\n\n" }),
    true,
    "34.05"
  );
  t.end();
});

tap.test("35 - simple plain objects #2", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: "\t\t\t", c: "3" },
      { a: "1", b: ["\n\n\n", "   "] }
    ),
    true,
    "35.01"
  );
  t.equal(
    looseCompare(
      { a: "1", b: ["\t\t\t"], c: "3" },
      { a: "1", b: ["\n\n\n", "   "] }
    ),
    true,
    "35.02"
  );
  t.equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "   ", "\n "], c: "3" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "35.03"
  );
  t.end();
});

tap.test("36 - simple plain objects #3", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "  ", ["\t"]], c: "3" },
      { a: "1", b: ["\n\n\n"] }
    ),
    true,
    "36"
  );
  t.end();
});

tap.test("37 - simple plain objects #4", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "    ", " "], c: "2" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "37"
  );
  t.end();
});

tap.test("38 - simple plain objects #5", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "   ", "   \n   "], c: "2" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "38"
  );
  t.end();
});

// ==============================
// Nested obj - Comparing empty space with empty space
// ==============================

tap.test("39 - simple nested plain objects - will find", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: { c: { d: "\t\t\t" } }, c: "3" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "39.01"
  );
  t.equal(
    looseCompare(
      { a: "1", b: "\n\n\n", c: "3" },
      { a: "1", b: { c: { d: "\t\t\t" } } }
    ),
    true,
    "39.02"
  );
  t.equal(
    looseCompare(
      { a: "1", b: ["\n\n\n", "\t\t   "], c: "3" },
      { a: "1", b: { c: [{ d: ["\t\t\t \n"] }] } }
    ),
    true,
    "39.03"
  );
  t.end();
});

tap.test("40 - simple nested plain objects - won't find", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: { c: { d: "\t\t\t" } }, c: "3" },
      { a: "2", b: "\n\n\n" }
    ),
    false,
    "40.01"
  );
  t.equal(
    looseCompare(
      { a: "1", b: "\n\n\n", c: "3" },
      { a: "2", b: { c: { d: "\t\t\t" } } }
    ),
    false,
    "40.02"
  );
  t.equal(
    looseCompare(
      { a: "1", b: ["\n\n\n", "\t\t   "], c: "3" },
      { a: "2", b: { c: { d: "\t\t\t \n" } } }
    ),
    false,
    "40.03"
  );
  t.end();
});

// ==============================
// Strings - empty space cases
// ==============================

tap.test("41 - Strings vs strings", (t) => {
  t.equal(looseCompare("\n\n\n", "\t\t\t"), true, "41");
  t.end();
});

tap.test("42 - Comparing empty string to string", (t) => {
  t.equal(looseCompare("", "\t\t\t"), true, "42");
  t.end();
});

tap.test("43 - Comparing string to empty string in an array", (t) => {
  t.equal(looseCompare(["\n\n\n"], ""), true, "43");
  t.end();
});

tap.test("44 - Comparing empty to empty string", (t) => {
  t.equal(looseCompare("", ""), true, "44.01");
  t.equal(looseCompare([""], ""), true, "44.02");
  t.equal(looseCompare("", [""]), true, "44.03");
  t.end();
});

tap.test("45 - Comparing empty array to empty plain object", (t) => {
  t.equal(looseCompare({ a: "" }, [""]), true, "45");
  t.end();
});

// ==============================
// Other cases
// ==============================

tap.test("46 - both are plain objects, didn't match - returns false", (t) => {
  t.equal(
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
  t.end();
});

tap.test("47 - two functions given - returns false", (t) => {
  function dummy() {
    return "zzz";
  }
  t.equal(looseCompare(dummy, dummy), false, "47");
  t.end();
});
