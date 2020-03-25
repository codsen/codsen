const t = require("tap");
const looseCompare = require("../dist/ast-loose-compare.cjs");

// ==============================
// Precautions
// ==============================

t.test("1.1 - both inputs missing", (t) => {
  t.equal(looseCompare(), undefined, "1.1");
  t.end();
});

t.test("1.2 - first input missing", (t) => {
  t.equal(looseCompare({ a: "a" }), undefined, "1.2");
  t.end();
});

t.test("1.3 - second input missing", (t) => {
  t.equal(looseCompare(undefined, { a: "a" }), undefined, "1.3");
  t.end();
});

t.test("1.4 - null as input", (t) => {
  t.equal(looseCompare(undefined, { a: "a" }), undefined, "1.4");
  t.end();
});

t.test("1.5 - falsey inputs", (t) => {
  t.equal(looseCompare(null, undefined), undefined, "1.5");
  t.end();
});

t.test("1.6 - undefined in a second-level depth", (t) => {
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
    "1.6"
  );
  t.end();
});

// ==============================
// Obj - Simples
// ==============================

t.test("2.1 - simple plain objects", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }),
    true,
    "2.1"
  );
  t.end();
});

t.test("2.2 - simple plain objects #2", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }),
    false,
    "2.2"
  );
  t.end();
});

t.test("2.3 - comparison against empty plain objects", (t) => {
  t.equal(looseCompare({}, { a: "1", b: "2" }), false, "2.3");
  t.equal(looseCompare({ a: "1", b: "2", c: "3" }, {}), false, "2.3");
  t.end();
});

t.test("2.4 - comparing two empty plain objects", (t) => {
  t.equal(looseCompare({}, {}), true, "2.4");
  t.end();
});

t.test("2.5 - false match involving empty arrays, sneaky similarity", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: ["3"] }),
    false,
    "2.5"
  );
  t.equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: 3 }),
    false,
    "2.5"
  );
  t.equal(
    looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: { d: "3" } }),
    false,
    "2.5"
  );
  t.end();
});

t.test("2.6 - simple plain arrays, integer, match", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "2", c: 3 }, { a: "1", b: "2" }),
    true,
    "2.6"
  );
  t.end();
});

t.test("2.7 - simple plain arrays, integer, no match", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "2" }, { a: "1", b: "2", c: 3 }),
    false,
    "2.7"
  );
  t.end();
});

// ==============================
// Obj - Nested
// ==============================

t.test("3.1 - simple nested plain objects", (t) => {
  t.equal(
    looseCompare({ a: { d: "4" }, b: "2", c: "3" }, { a: { d: "4" }, b: "2" }),
    true,
    "3.1"
  );
  t.end();
});

t.test("3.2 - simple nested plain objects + array wrapper", (t) => {
  t.equal(
    looseCompare(
      { a: [{ d: "4" }], b: "2", c: "3" },
      { a: [{ d: "4" }], b: "2" }
    ),
    true,
    "3.2"
  );
  t.end();
});

t.test("3.3 - simple nested plain objects, won't find", (t) => {
  t.equal(
    looseCompare({ a: { d: "4" }, b: "2" }, { a: { d: "4" }, b: "2", c: "3" }),
    false,
    "3.3"
  );
  t.end();
});

t.test("3.4 - simple nested plain objects + array wrapper, won't find", (t) => {
  t.equal(
    looseCompare(
      { a: [{ d: "4" }], b: "2" },
      { a: [{ d: "4" }], b: "2", c: "3" }
    ),
    false,
    "3.4"
  );
  t.end();
});

t.test("3.5 - obj, multiple nested levels, bigObj has more", (t) => {
  t.equal(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }] } } } }
    ),
    true,
    "3.5"
  );
  t.end();
});

t.test("3.6 - obj, multiple nested levels, equal", (t) => {
  t.equal(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    true,
    "3.6"
  );
  t.end();
});

t.test("3.7 - obj, multiple nested levels, smallObj has more", (t) => {
  t.equal(
    looseCompare(
      { a: { b: { c: { d: [{ e: "1" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    false,
    "3.7"
  );
  t.end();
});

// ==============================
// Arr - simples
// ==============================

t.test("4.1 - simple arrays with strings", (t) => {
  t.equal(looseCompare(["a", "b", "c"], ["a", "b"]), true, "4.1.1");
  t.equal(looseCompare(["a", "b"], ["a", "b", "c"]), false, "4.1.2");
  t.end();
});

t.test("4.2 - simple arrays with plain objects", (t) => {
  t.equal(
    looseCompare(
      [{ a: "1" }, { b: "2" }, { c: "3" }],
      [{ a: "1" }, { b: "2" }]
    ),
    true,
    "4.2.1"
  );
  t.equal(
    looseCompare(
      [{ a: "1" }, { b: "2" }],
      [{ a: "1" }, { b: "2" }, { c: "3" }]
    ),
    false,
    "4.2.2"
  );
  t.end();
});

t.test("4.3 - arrays, nested with strings and objects", (t) => {
  t.equal(
    looseCompare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]]
    ),
    true,
    "4.3.1"
  );
  t.equal(
    looseCompare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"]
    ),
    false,
    "4.3.2"
  );
  t.end();
});

t.test("4.3 - comparing empty arrays (variations)", (t) => {
  t.equal(looseCompare([], []), true, "4.3.1");
  t.equal(looseCompare([{}], [{}]), true, "4.3.2");
  t.equal(looseCompare([{}, {}], [{}]), true, "4.3.3");
  t.equal(looseCompare([{ a: [] }, {}, []], [{ a: [] }]), true, "4.3.3");
  t.end();
});

// ==============================
// Strings
// ==============================

t.test("5.1 - simple strings", (t) => {
  t.equal(looseCompare("aaaaa\nbbbbb", "aaaaa\nbbbbb"), true, "5.1.1");
  t.equal(looseCompare("aaaaa\nbbbbb", "aaaaa\nc"), false, "5.1.2");
  t.end();
});

t.test("5.2 - strings compared and fails", (t) => {
  t.equal(looseCompare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"]), false, "5.2");
  t.end();
});

t.test("5.3 - strings compared, positive", (t) => {
  t.equal(looseCompare(["aaaaa\nbbbbb"], ["aaaaa\nbbbbb"]), true, "5.3");
  t.end();
});

t.test("5.4 - strings compared, positive", (t) => {
  t.equal(looseCompare(["aaaaa\nbbbbb"], []), false, "5.4");
  t.end();
});

// ==============================
// Random
// ==============================

t.test("6.1 - weird comparisons", (t) => {
  t.equal(looseCompare(null, null), undefined, "6.1.1");
  t.equal(looseCompare(null, undefined), undefined, "6.1.2");
  t.equal(looseCompare([null], [undefined]), false, "6.1.3");
  t.end();
});

t.test("6.2 - real-life - won't find", (t) => {
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
    "6.2"
  );
  t.end();
});

t.test("6.3 - real-life - will find", (t) => {
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
    "6.3"
  );
  t.end();
});

t.test("6.4 - from README", (t) => {
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
    "6.4"
  );
  t.end();
});

t.test("6.5 - from real-life, precaution against false-positives", (t) => {
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
    "6.5"
  );
  t.end();
});

// ==============================
// Obj - Comparing empty space with empty space
// ==============================

t.test("7.1 - simple plain objects #1", (t) => {
  t.equal(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "1", b: "\n\n\n" }),
    true,
    "7.1.1"
  );
  t.equal(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "2", b: "\n\n\n" }),
    false,
    "7.1.2"
  );
  t.equal(
    looseCompare({ a: "1", b: "\t\t\t", c: "3" }, { a: "", b: "\n\n\n" }),
    false,
    "7.1.3"
  );
  t.equal(
    looseCompare({ a: "", b: "\t\t\t", c: "3" }, { a: "1", b: "\n\n\n" }),
    false,
    "7.1.4"
  );
  t.equal(
    looseCompare({ a: "", b: "\t\t\t", c: "3" }, { a: "", b: "\n\n\n" }),
    true,
    "7.1.5"
  );
  t.end();
});

t.test("7.2 - simple plain objects #2", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: "\t\t\t", c: "3" },
      { a: "1", b: ["\n\n\n", "   "] }
    ),
    true,
    "7.2.1"
  );
  t.equal(
    looseCompare(
      { a: "1", b: ["\t\t\t"], c: "3" },
      { a: "1", b: ["\n\n\n", "   "] }
    ),
    true,
    "7.2.2"
  );
  t.equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "   ", "\n "], c: "3" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "7.2.3"
  );
  t.end();
});

t.test("7.3 - simple plain objects #3", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "  ", ["\t"]], c: "3" },
      { a: "1", b: ["\n\n\n"] }
    ),
    true,
    "7.3"
  );
  t.end();
});

t.test("7.4 - simple plain objects #4", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "    ", " "], c: "2" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "7.4"
  );
  t.end();
});

t.test("7.5 - simple plain objects #5", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: ["\t\t\t", "   ", "   \n   "], c: "2" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "7.5"
  );
  t.end();
});

// ==============================
// Nested obj - Comparing empty space with empty space
// ==============================

t.test("8.1 - simple nested plain objects - will find", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: { c: { d: "\t\t\t" } }, c: "3" },
      { a: "1", b: "\n\n\n" }
    ),
    true,
    "8.1.1"
  );
  t.equal(
    looseCompare(
      { a: "1", b: "\n\n\n", c: "3" },
      { a: "1", b: { c: { d: "\t\t\t" } } }
    ),
    true,
    "8.1.2"
  );
  t.equal(
    looseCompare(
      { a: "1", b: ["\n\n\n", "\t\t   "], c: "3" },
      { a: "1", b: { c: [{ d: ["\t\t\t \n"] }] } }
    ),
    true,
    "8.1.3"
  );
  t.end();
});

t.test("8.2 - simple nested plain objects - won't find", (t) => {
  t.equal(
    looseCompare(
      { a: "1", b: { c: { d: "\t\t\t" } }, c: "3" },
      { a: "2", b: "\n\n\n" }
    ),
    false,
    "8.2.1"
  );
  t.equal(
    looseCompare(
      { a: "1", b: "\n\n\n", c: "3" },
      { a: "2", b: { c: { d: "\t\t\t" } } }
    ),
    false,
    "8.2.2"
  );
  t.equal(
    looseCompare(
      { a: "1", b: ["\n\n\n", "\t\t   "], c: "3" },
      { a: "2", b: { c: { d: "\t\t\t \n" } } }
    ),
    false,
    "8.2.3"
  );
  t.end();
});

// ==============================
// Strings - empty space cases
// ==============================

t.test("9.1 - Strings vs strings", (t) => {
  t.equal(looseCompare("\n\n\n", "\t\t\t"), true, "9.1");
  t.end();
});

t.test("9.2 - Comparing empty string to string", (t) => {
  t.equal(looseCompare("", "\t\t\t"), true, "9.2");
  t.end();
});

t.test("9.3 - Comparing string to empty string in an array", (t) => {
  t.equal(looseCompare(["\n\n\n"], ""), true, "9.3");
  t.end();
});

t.test("9.4 - Comparing empty to empty string", (t) => {
  t.equal(looseCompare("", ""), true, "9.4.1");
  t.equal(looseCompare([""], ""), true, "9.4.2");
  t.equal(looseCompare("", [""]), true, "9.4.3");
  t.end();
});

t.test("9.5 - Comparing empty array to empty plain object", (t) => {
  t.equal(looseCompare({ a: "" }, [""]), true, "9.5");
  t.end();
});

// ==============================
// Other cases
// ==============================

t.test("10.1 - both are plain objects, didn't match - returns false", (t) => {
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
    "10.1"
  );
  t.end();
});

t.test("10.2 - two functions given - returns false", (t) => {
  function dummy() {
    return "zzz";
  }
  t.equal(looseCompare(dummy, dummy), false, "10.2");
  t.end();
});
