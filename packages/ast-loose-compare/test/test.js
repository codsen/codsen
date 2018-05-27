import test from "ava";
import looseCompare from "../dist/ast-loose-compare.esm";

// ==============================
// Precautions
// ==============================

test("1.1 - both inputs missing", t => {
  t.is(looseCompare(), undefined, "1.1");
});

test("1.2 - first input missing", t => {
  t.is(looseCompare({ a: "a" }), undefined, "1.2");
});

test("1.3 - second input missing", t => {
  t.is(looseCompare(undefined, { a: "a" }), undefined, "1.3");
});

test("1.4 - null as input", t => {
  t.is(looseCompare(undefined, { a: "a" }), undefined, "1.4");
});

test("1.5 - falsey inputs", t => {
  t.is(looseCompare(null, undefined), undefined, "1.5");
});

test("1.6 - undefined in a second-level depth", t => {
  t.is(
    looseCompare(
      {
        a: "a",
        b: {
          c: "c"
        }
      },
      {
        a: "a",
        b: undefined
      }
    ),
    false,
    "1.6"
  );
});

// ==============================
// Obj - Simples
// ==============================

test("2.1 - simple plain objects", t => {
  t.is(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }),
    true,
    "2.1"
  );
});

test("2.2 - simple plain objects #2", t => {
  t.is(
    looseCompare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }),
    false,
    "2.2"
  );
});

test("2.3 - comparison against empty plain objects", t => {
  t.is(looseCompare({}, { a: "1", b: "2" }), false, "2.3");
  t.is(looseCompare({ a: "1", b: "2", c: "3" }, {}), false, "2.3");
});

test("2.4 - comparing two empty plain objects", t => {
  t.is(looseCompare({}, {}), true, "2.4");
});

test("2.5 - false match involving empty arrays, sneaky similarity", t => {
  t.is(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: ["3"] }),
    false,
    "2.5"
  );
  t.is(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: 3 }),
    false,
    "2.5"
  );
  t.is(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: { d: "3" } }),
    false,
    "2.5"
  );
});

test("2.6 - simple plain arrays, integer, match", t => {
  t.is(looseCompare({ a: "1", b: "2", c: 3 }, { a: "1", b: "2" }), true, "2.6");
});

test("2.7 - simple plain arrays, integer, no match", t => {
  t.is(
    looseCompare({ a: "1", b: "2" }, { a: "1", b: "2", c: 3 }),
    false,
    "2.7"
  );
});

// ==============================
// Obj - Nested
// ==============================

test("3.1 - simple nested plain objects", t => {
  t.is(
    looseCompare({ a: { d: "4" }, b: "2", c: "3" }, { a: { d: "4" }, b: "2" }),
    true,
    "3.1"
  );
});

test("3.2 - simple nested plain objects + array wrapper", t => {
  t.is(
    looseCompare(
      { a: [{ d: "4" }], b: "2", c: "3" },
      { a: [{ d: "4" }], b: "2" }
    ),
    true,
    "3.2"
  );
});

test("3.3 - simple nested plain objects, won't find", t => {
  t.is(
    looseCompare({ a: { d: "4" }, b: "2" }, { a: { d: "4" }, b: "2", c: "3" }),
    false,
    "3.3"
  );
});

test("3.4 - simple nested plain objects + array wrapper, won't find", t => {
  t.is(
    looseCompare(
      { a: [{ d: "4" }], b: "2" },
      { a: [{ d: "4" }], b: "2", c: "3" }
    ),
    false,
    "3.4"
  );
});

test("3.5 - obj, multiple nested levels, bigObj has more", t => {
  t.is(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }] } } } }
    ),
    true,
    "3.5"
  );
});

test("3.6 - obj, multiple nested levels, equal", t => {
  t.is(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    true,
    "3.6"
  );
});

test("3.7 - obj, multiple nested levels, smallObj has more", t => {
  t.is(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    false,
    "3.7"
  );
});

// ==============================
// Arr - simples
// ==============================

test("4.1 - simple arrays with strings", t => {
  t.is(looseCompare(["a", "b", "c"], ["a", "b"]), true, "4.1.1");
  t.is(looseCompare(["a", "b"], ["a", "b", "c"]), false, "4.1.2");
});

test("4.2 - simple arrays with plain objects", t => {
  t.is(
    looseCompare(
      [{ a: "1" }, { b: "2" }, { c: "3" }],
      [{ a: "1" }, { b: "2" }]
    ),
    true,
    "4.2.1"
  );
  t.is(
    looseCompare(
      [{ a: "1" }, { b: "2" }],
      [{ a: "1" }, { b: "2" }, { c: "3" }]
    ),
    false,
    "4.2.2"
  );
});

test("4.3 - arrays, nested with strings and objects", t => {
  t.is(
    looseCompare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]]
    ),
    true,
    "4.3.1"
  );
  t.is(
    looseCompare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"]
    ),
    false,
    "4.3.2"
  );
});

test("4.3 - comparing empty arrays (variations)", t => {
  t.is(looseCompare([], []), true, "4.3.1");
  t.is(looseCompare([{}], [{}]), true, "4.3.2");
  t.is(looseCompare([{}, {}], [{}]), true, "4.3.3");
  t.is(looseCompare([{ a: [] }, {}, []], [{ a: [] }]), true, "4.3.3");
});

// ==============================
// Strings
// ==============================

test("5.1 - simple strings", t => {
  t.is(looseCompare("aaaaa\nbbbbb", "aaaaa\nbbbbb"), true, "5.1.1");
  t.is(looseCompare("aaaaa\nbbbbb", "aaaaa\nc"), false, "5.1.2");
});

test("5.2 - strings compared and fails", t => {
  t.is(looseCompare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"]), false, "5.2");
});

test("5.3 - strings compared, positive", t => {
  t.is(looseCompare(["aaaaa\nbbbbb"], ["aaaaa\nbbbbb"]), true, "5.3");
});

test("5.4 - strings compared, positive", t => {
  t.is(looseCompare(["aaaaa\nbbbbb"], []), false, "5.4");
});

// ==============================
// Random
// ==============================

test("6.1 - weird comparisons", t => {
  t.is(looseCompare(null, null), undefined, "6.1.1");
  t.is(looseCompare(null, undefined), undefined, "6.1.2");
  t.is(looseCompare([null], [undefined]), false, "6.1.3");
});

test("6.2 - real-life - won't find", t => {
  t.is(
    looseCompare(
      {
        type: "rule",
        selectors: [".w2"]
      },
      {
        type: "rule",
        selectors: []
      }
    ),
    false,
    "6.2"
  );
});

test("6.3 - real-life - will find", t => {
  t.is(
    looseCompare(
      {
        type: "rule",
        selectors: [" \n "]
      },
      {
        type: "rule",
        selectors: []
      }
    ),
    true,
    "6.3"
  );
});

test("6.4 - from README", t => {
  t.is(
    looseCompare(
      {
        a: "a",
        b: [[["\n \n\n"]]],
        c: "c"
      },
      {
        a: "a",
        b: { c: { d: "   \t\t \t" } }
      }
    ),
    true,
    "6.4"
  );
});

test("6.5 - from real-life, precaution against false-positives", t => {
  t.is(
    looseCompare(
      {
        x: [[["\n \n\n"]]],
        y: "a"
      },
      {
        z: ""
      }
    ),
    false,
    "6.5"
  );
});

// ==============================
// Obj - Comparing empty space with empty space
// ==============================

test("7.1 - simple plain objects #1", t => {
  t.is(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "1", b: "\n\n\n" }),
    true,
    "7.1.1"
  );
  t.is(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "2", b: "\n\n\n" }),
    false,
    "7.1.2"
  );
  t.is(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "", b: "\n\n\n" }),
    false,
    "7.1.3"
  );
  t.is(
    looseCompare({ a: "", b: "\t\t\t", c: "3" }, { a: "1", b: "\n\n\n" }),
    false,
    "7.1.4"
  );
  t.is(
    looseCompare({ a: "", b: "\t\t\t", c: "3" }, { a: "", b: "\n\n\n" }),
    true,
    "7.1.5"
  );
});

test("7.2 - simple plain objects #2", t => {
  t.is(
    looseCompare(
      { a: "1", b: "\t\t\t", c: "3" },
      { a: "1", b: ["\n\n\n", "   "] }
    ),
    true,
    "7.2.1"
  );
  t.is(
    looseCompare(
      { a: "1", b: ["\t\t\t"], c: "3" },
      { a: "1", b: ["\n\n\n", "   "] }
    ),
    true,
    "7.2.2"
  );
  t.is(
    looseCompare(
      { a: "1", b: ["\t\t\t", "   ", "\n "], c: "3" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "7.2.3"
  );
});

test("7.3 - simple plain objects #3", t => {
  t.is(
    looseCompare(
      { a: "1", b: ["\t\t\t", "  ", ["\t"]], c: "3" },
      { a: "1", b: ["\n\n\n"] }
    ),
    true,
    "7.3"
  );
});

test("7.4 - simple plain objects #4", t => {
  t.is(
    looseCompare(
      { a: "1", b: ["\t\t\t", "    ", " "], c: "2" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "7.4"
  );
});

test("7.5 - simple plain objects #5", t => {
  t.is(
    looseCompare(
      { a: "1", b: ["\t\t\t", "   ", "   \n   "], c: "2" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "7.5"
  );
});

// ==============================
// Nested obj - Comparing empty space with empty space
// ==============================

test("8.1 - simple nested plain objects - will find", t => {
  t.is(
    looseCompare(
      { a: "1", b: { c: { d: "\t\t\t" } }, c: "3" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "8.1.1"
  );
  t.is(
    looseCompare(
      { a: "1", b: "\n\n\n", c: "3" },
      { a: "1", b: { c: { d: "\t\t\t" } } }
    ),
    true,
    "8.1.2"
  );
  t.is(
    looseCompare(
      { a: "1", b: ["\n\n\n", "\t\t   "], c: "3" },
      { a: "1", b: { c: [{ d: ["\t\t\t \n"] }] } }
    ),
    true,
    "8.1.3"
  );
});

test("8.2 - simple nested plain objects - won't find", t => {
  t.is(
    looseCompare(
      { a: "1", b: { c: { d: "\t\t\t" } }, c: "3" },
      { a: "2", b: "\n\n\n" }
    ),
    false,
    "8.2.1"
  );
  t.is(
    looseCompare(
      { a: "1", b: "\n\n\n", c: "3" },
      { a: "2", b: { c: { d: "\t\t\t" } } }
    ),
    false,
    "8.2.2"
  );
  t.is(
    looseCompare(
      { a: "1", b: ["\n\n\n", "\t\t   "], c: "3" },
      { a: "2", b: { c: { d: "\t\t\t \n" } } }
    ),
    false,
    "8.2.3"
  );
});

// ==============================
// Strings - empty space cases
// ==============================

test("9.1 - Strings vs strings", t => {
  t.is(looseCompare("\n\n\n", "\t\t\t"), true, "9.1");
});

test("9.2 - Comparing empty string to string", t => {
  t.is(looseCompare("", "\t\t\t"), true, "9.2");
});

test("9.3 - Comparing string to empty string in an array", t => {
  t.is(looseCompare(["\n\n\n"], ""), true, "9.3");
});

test("9.4 - Comparing empty to empty string", t => {
  t.is(looseCompare("", ""), true, "9.4.1");
  t.is(looseCompare([""], ""), true, "9.4.2");
  t.is(looseCompare("", [""]), true, "9.4.3");
});

test("9.5 - Comparing empty array to empty plain object", t => {
  t.is(looseCompare({ a: "" }, [""]), true, "9.5");
});

// ==============================
// Other cases
// ==============================

test("10.1 - both are plain objects, didn't match - returns false", t => {
  t.is(
    looseCompare(
      {
        a: [{}]
      },
      {
        a: NaN
      }
    ),
    false,
    "10.1"
  );
});

function dummy() {
  return "zzz";
}
test("10.2 - two functions given - returns false", t => {
  t.is(looseCompare(dummy, dummy), false, "10.2");
});
