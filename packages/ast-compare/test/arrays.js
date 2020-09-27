import tap from "tap";
import compare from "../dist/ast-compare.esm";

// arrays
// -----------------------------------------------------------------------------

tap.test("01 - simple arrays with strings", (t) => {
  t.strictSame(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    true,
    "01.01"
  );
  t.strictSame(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "01.02"
  );

  t.strictSame(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "01.03"
  );
  t.strictSame(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "01.04"
  );
  t.not(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: true,
      verboseWhenMismatches: true,
    }),
    true,
    "04.01.05"
  );

  t.strictSame(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "01.05"
  );
  t.strictSame(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "01.06"
  );

  t.strictSame(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "01.07"
  );
  t.strictSame(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "01.08"
  );
  t.not(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: true,
      verboseWhenMismatches: true,
    }),
    true,
    "04.01.10"
  );
  t.end();
});

tap.test("02 - simple arrays with plain objects", (t) => {
  t.strictSame(
    compare([{ a: "1" }, { b: "2" }, { c: "3" }], [{ a: "1" }, { b: "2" }]),
    true,
    "02.01"
  );
  t.strictSame(
    compare([{ a: "1" }, { b: "2" }], [{ a: "1" }, { b: "2" }, { c: "3" }]),
    false,
    "02.02"
  );
  t.end();
});

tap.test("03 - arrays, nested with strings and objects", (t) => {
  t.strictSame(
    compare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]]
    ),
    true,
    "03.01"
  );
  t.strictSame(
    compare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"]
    ),
    false,
    "03.02"
  );
  t.end();
});

tap.test("04 - comparing empty arrays (variations)", (t) => {
  t.strictSame(compare([], []), true, "04.01");
  t.strictSame(compare([{}], [{}]), true, "04.02");
  t.strictSame(compare([{}, {}], [{}]), true, "04.03");
  t.strictSame(compare([{}], [{}, {}]), false, "04.04");
  t.strictSame(compare([{ a: [] }, {}, []], [{ a: [] }]), true, "04.05");
  t.strictSame(compare([], [], { hungryForWhitespace: true }), true, "04.06");
  t.strictSame(
    compare([{}], [{}], { hungryForWhitespace: true }),
    true,
    "04.07"
  );
  t.strictSame(
    compare([{}, {}], [{}], { hungryForWhitespace: true }),
    true,
    "04.08"
  );
  t.strictSame(
    compare([{}], [{}, {}], { hungryForWhitespace: true }),
    true,
    "04.09"
  );
  t.strictSame(
    compare([{ a: [] }, {}, []], [{ a: [] }], { hungryForWhitespace: true }),
    true,
    "04.10"
  );
  t.end();
});

tap.test("05 - empty arrays within obj key values", (t) => {
  t.strictSame(
    compare(
      {
        a: [],
      },
      {
        a: {
          b: "b",
        },
      }
    ),
    false,
    "05.01"
  );
  t.strictSame(
    compare(
      {
        a: {
          b: "b",
        },
      },
      {
        a: [],
      }
    ),
    false,
    "05.02"
  );
  t.strictSame(
    compare(
      {
        a: [],
      },
      {
        a: {
          b: "b",
        },
      },
      { hungryForWhitespace: true }
    ),
    false,
    "05.03"
  );
  t.not(
    compare(
      {
        a: [],
      },
      {
        a: {
          b: "b",
        },
      },
      { hungryForWhitespace: true, verboseWhenMismatches: true }
    ),
    true,
    "04.05.04"
  );
  t.strictSame(
    compare(
      {
        a: {
          b: "b",
        },
      },
      {
        a: [],
      },
      { hungryForWhitespace: true }
    ),
    false,
    "05.04"
  );
  t.end();
});

tap.test("06 - empty arrays vs empty objects", (t) => {
  t.strictSame(
    compare(
      {
        a: [],
      },
      {
        a: {},
      }
    ),
    false,
    "06.01"
  );
  t.strictSame(
    compare(
      {
        a: {},
      },
      {
        a: [],
      }
    ),
    false,
    "06.02"
  );
  t.strictSame(
    compare(
      {
        a: [],
      },
      {
        a: {},
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.03"
  );
  t.strictSame(
    compare(
      {
        a: {},
      },
      {
        a: [],
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.04"
  );
  t.strictSame(
    compare(
      {
        a: {
          b: [],
        },
        x: "y",
      },
      {
        a: {
          b: {},
        },
        x: "y",
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.05"
  );
  t.strictSame(
    compare(
      {
        a: {
          b: {},
        },
        x: "y",
      },
      {
        a: {
          b: [],
        },
        x: "y",
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.06"
  );
  t.end();
});

tap.test("07 - empty arrays vs empty strings", (t) => {
  t.strictSame(
    compare(
      {
        a: [],
      },
      {
        a: "",
      }
    ),
    false,
    "07.01"
  );
  t.strictSame(
    compare(
      {
        a: "",
      },
      {
        a: [],
      }
    ),
    false,
    "07.02"
  );
  t.strictSame(
    compare(
      {
        a: [],
      },
      {
        a: "",
      },
      { hungryForWhitespace: true }
    ),
    true,
    "07.03"
  );
  t.strictSame(
    compare(
      {
        a: "",
      },
      {
        a: [],
      },
      { hungryForWhitespace: true }
    ),
    true,
    "07.04"
  );
  t.end();
});

tap.test("08 - two arrays, matches middle, string within", (t) => {
  t.strictSame(
    compare(["a", "b", "c", "d", "e"], ["b", "c", "d"]),
    true,
    "08.01"
  );
  t.strictSame(
    compare(["b", "c", "d"], ["a", "b", "c", "d", "e"]),
    false,
    "08.02 opposite"
  );

  t.strictSame(
    compare(["a", "b", "c", "d", "e"], ["b", "c", "e"]),
    true,
    "08.03"
  );
  t.strictSame(
    compare(["b", "c", "e"], ["a", "b", "c", "d", "e"]),
    false,
    "08.04 opposite"
  );

  t.strictSame(
    compare(["a", "b", "c", "d", "e"], ["a", "b", "c"]),
    true,
    "08.05"
  );
  t.strictSame(
    compare(["a", "b", "c"], ["a", "b", "c", "d", "e"]),
    false,
    "08.06 opposite"
  );

  t.strictSame(
    compare(["a", "b", "c", "d", "e"], ["c", "d", "e"]),
    true,
    "08.07"
  );
  t.strictSame(
    compare(["c", "d", "e"], ["a", "b", "c", "d", "e"]),
    false,
    "08.08 opposite"
  );

  t.strictSame(compare(["a", "b", "c", "d", "e"], ["e"]), true, "08.09");
  t.strictSame(
    compare(["e"], ["a", "b", "c", "d", "e"]),
    false,
    "08.10 opposite"
  );
  t.end();
});

tap.test("09 - two arrays, matches middle, objects within", (t) => {
  t.strictSame(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ b: "b" }, { c: "c" }, { d: "d" }]
    ),
    true,
    "09.01"
  );
  t.strictSame(
    compare(
      [{ b: "b" }, { c: "c" }, { d: "d" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "09.02 opposite"
  );

  t.strictSame(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ b: "b" }, { c: "c" }, { e: "e" }]
    ),
    true,
    "09.03"
  );
  t.strictSame(
    compare(
      [{ b: "b" }, { c: "c" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "09.04 opposite"
  );

  t.strictSame(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }]
    ),
    true,
    "09.05"
  );
  t.strictSame(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "09.06 opposite"
  );

  t.strictSame(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ c: "c" }, { d: "d" }, { e: "e" }]
    ),
    true,
    "09.07"
  );
  t.strictSame(
    compare(
      [{ c: "c" }, { d: "d" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "09.08 opposite"
  );

  t.strictSame(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ e: "e" }]
    ),
    true,
    "09.09"
  );
  t.strictSame(
    compare(
      [{ e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "09.10 opposite"
  );

  t.strictSame(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" },
      ],
      [
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
      ]
    ),
    true,
    "09.11"
  );
  t.strictSame(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" },
      ],
      [
        { c2: "c2", c1: "c1" },
        { d2: "d2", d1: "d1" },
      ]
    ),
    true,
    "09.12"
  );
  t.strictSame(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d2: "d2" },
        { e: "e" },
      ],
      [
        { c2: "c2", c1: "c1" },
        { d2: "d2", d1: "d1" },
      ]
    ),
    false,
    "09.13"
  );
  t.strictSame(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" },
      ],
      [{ c1: "c1" }, { d2: "d2" }]
    ),
    true,
    "09.14"
  );
  t.strictSame(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" },
      ],
      [{ d2: "d2" }, { c1: "c1" }]
    ),
    false,
    "09.15"
  );
  t.end();
});

tap.test("10 - two arrays, one empty, string within", (t) => {
  t.strictSame(compare(["a", "b", "c"], []), false, "10.01");
  t.not(
    compare(["a", "b", "c"], [], { verboseWhenMismatches: true }),
    true,
    "04.10.02"
  );
  t.strictSame(
    compare(["a", "b", "c"], [], { hungryForWhitespace: true }),
    true,
    "10.02"
  );
  t.end();
});
