// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { compare, defaults } from "../dist/ast-compare.esm.js";

// arrays
// -----------------------------------------------------------------------------

test("01 - simple arrays with strings", () => {
  equal(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    true,
    "01.01",
  );
  equal(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "01.02",
  );

  equal(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "01.03",
  );
  equal(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "01.04",
  );
  not.equal(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: true,
      verboseWhenMismatches: true,
    }),
    true,
    "01.05",
  );

  equal(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "01.06",
  );
  equal(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "01.07",
  );

  equal(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "01.08",
  );
  equal(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "01.09",
  );
  not.equal(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: true,
      verboseWhenMismatches: true,
    }),
    true,
    "01.10",
  );
});

test("02 - simple arrays with plain objects", () => {
  equal(
    compare([{ a: "1" }, { b: "2" }, { c: "3" }], [{ a: "1" }, { b: "2" }]),
    true,
    "02.01",
  );
  equal(
    compare([{ a: "1" }, { b: "2" }], [{ a: "1" }, { b: "2" }, { c: "3" }]),
    false,
    "02.02",
  );
});

test("03 - arrays, nested with strings and objects", () => {
  equal(
    compare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]],
    ),
    true,
    "03.01",
  );
  equal(
    compare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"],
    ),
    false,
    "03.02",
  );
});

test("04 - comparing empty arrays (variations)", () => {
  equal(compare([], []), true, "04.01");
  equal(compare([{}], [{}]), true, "04.02");
  equal(compare([{}, {}], [{}]), true, "04.03");
  equal(compare([{}], [{}, {}]), false, "04.04");
  equal(compare([{ a: [] }, {}, []], [{ a: [] }]), true, "04.05");
  equal(compare([], [], { hungryForWhitespace: true }), true, "04.06");
  equal(compare([{}], [{}], { hungryForWhitespace: true }), true, "04.07");
  equal(compare([{}, {}], [{}], { hungryForWhitespace: true }), true, "04.08");
  equal(compare([{}], [{}, {}], { hungryForWhitespace: true }), true, "04.09");
  equal(
    compare([{ a: [] }, {}, []], [{ a: [] }], { hungryForWhitespace: true }),
    true,
    "04.10",
  );
});

test("05 - empty arrays within obj key values", () => {
  equal(
    compare(
      {
        a: [],
      },
      {
        a: {
          b: "b",
        },
      },
    ),
    false,
    "05.01",
  );
  equal(
    compare(
      {
        a: {
          b: "b",
        },
      },
      {
        a: [],
      },
    ),
    false,
    "05.02",
  );
  equal(
    compare(
      {
        a: [],
      },
      {
        a: {
          b: "b",
        },
      },
      { hungryForWhitespace: true },
    ),
    false,
    "05.03",
  );
  not.equal(
    compare(
      {
        a: [],
      },
      {
        a: {
          b: "b",
        },
      },
      { hungryForWhitespace: true, verboseWhenMismatches: true },
    ),
    true,
    "05.04",
  );
  equal(
    compare(
      {
        a: {
          b: "b",
        },
      },
      {
        a: [],
      },
      { hungryForWhitespace: true },
    ),
    false,
    "05.05",
  );
});

test("06 - empty arrays vs empty objects", () => {
  equal(
    compare(
      {
        a: [],
      },
      {
        a: {},
      },
    ),
    false,
    "06.01",
  );
  equal(
    compare(
      {
        a: {},
      },
      {
        a: [],
      },
    ),
    false,
    "06.02",
  );
  equal(
    compare(
      {
        a: [],
      },
      {
        a: {},
      },
      { hungryForWhitespace: true },
    ),
    true,
    "06.03",
  );
  equal(
    compare(
      {
        a: {},
      },
      {
        a: [],
      },
      { hungryForWhitespace: true },
    ),
    true,
    "06.04",
  );
  equal(
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
      { hungryForWhitespace: true },
    ),
    true,
    "06.05",
  );
  equal(
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
      { hungryForWhitespace: true },
    ),
    true,
    "06.06",
  );
});

test("07 - empty arrays vs empty strings", () => {
  equal(
    compare(
      {
        a: [],
      },
      {
        a: "",
      },
    ),
    false,
    "07.01",
  );
  equal(
    compare(
      {
        a: "",
      },
      {
        a: [],
      },
    ),
    false,
    "07.02",
  );
  equal(
    compare(
      {
        a: [],
      },
      {
        a: "",
      },
      { hungryForWhitespace: true },
    ),
    true,
    "07.03",
  );
  equal(
    compare(
      {
        a: "",
      },
      {
        a: [],
      },
      { hungryForWhitespace: true },
    ),
    true,
    "07.04",
  );
});

test("08 - two arrays, matches middle, string within", () => {
  equal(compare(["a", "b", "c", "d", "e"], ["b", "c", "d"]), true, "08.01");
  equal(compare(["b", "c", "d"], ["a", "b", "c", "d", "e"]), false, "08.02");

  equal(compare(["a", "b", "c", "d", "e"], ["b", "c", "e"]), true, "08.03");
  equal(compare(["b", "c", "e"], ["a", "b", "c", "d", "e"]), false, "08.04");

  equal(compare(["a", "b", "c", "d", "e"], ["a", "b", "c"]), true, "08.05");
  equal(compare(["a", "b", "c"], ["a", "b", "c", "d", "e"]), false, "08.06");

  equal(compare(["a", "b", "c", "d", "e"], ["c", "d", "e"]), true, "08.07");
  equal(compare(["c", "d", "e"], ["a", "b", "c", "d", "e"]), false, "08.08");

  equal(compare(["a", "b", "c", "d", "e"], ["e"]), true, "08.09");
  equal(compare(["e"], ["a", "b", "c", "d", "e"]), false, "08.10");
});

test("09 - two arrays, matches middle, objects within", () => {
  equal(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ b: "b" }, { c: "c" }, { d: "d" }],
    ),
    true,
    "09.01",
  );
  equal(
    compare(
      [{ b: "b" }, { c: "c" }, { d: "d" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
    ),
    false,
    "09.02",
  );

  equal(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ b: "b" }, { c: "c" }, { e: "e" }],
    ),
    true,
    "09.03",
  );
  equal(
    compare(
      [{ b: "b" }, { c: "c" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
    ),
    false,
    "09.04",
  );

  equal(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }],
    ),
    true,
    "09.05",
  );
  equal(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
    ),
    false,
    "09.06",
  );

  equal(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ c: "c" }, { d: "d" }, { e: "e" }],
    ),
    true,
    "09.07",
  );
  equal(
    compare(
      [{ c: "c" }, { d: "d" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
    ),
    false,
    "09.08",
  );

  equal(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ e: "e" }],
    ),
    true,
    "09.09",
  );
  equal(
    compare(
      [{ e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
    ),
    false,
    "09.10",
  );

  equal(
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
      ],
    ),
    true,
    "09.11",
  );
  equal(
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
      ],
    ),
    true,
    "09.12",
  );
  equal(
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
      ],
    ),
    false,
    "09.13",
  );
  equal(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" },
      ],
      [{ c1: "c1" }, { d2: "d2" }],
    ),
    true,
    "09.14",
  );
  equal(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" },
      ],
      [{ d2: "d2" }, { c1: "c1" }],
    ),
    false,
    "09.15",
  );
});

test("10 - two arrays, one empty, string within", () => {
  equal(compare(["a", "b", "c"], []), false, "10.01");
  not.equal(
    compare(["a", "b", "c"], [], { verboseWhenMismatches: true }),
    true,
    "10.02",
  );
  equal(
    compare(["a", "b", "c"], [], { hungryForWhitespace: true }),
    false,
    "10.03",
  );
});

test("11 - array order defaults to ordered", () => {
  equal(defaults.arrayOrder, "ordered", "11.01");
  equal(compare(["a", "b", "c"], ["c", "a"]), false, "11.02");
  equal(
    compare(["a", "b", "c"], ["c", "a"], { arrayOrder: "ordered" }),
    false,
    "11.03",
  );
  equal(
    compare(["a", "b", "c"], ["c", "a"], { arrayOrder: "any" }),
    true,
    "11.04",
  );
});

test("12 - unordered matching consumes each element once", () => {
  equal(compare(["a", "b"], ["a", "a"], { arrayOrder: "any" }), false, "12.01");
  equal(compare(["a", "a"], ["a", "a"], { arrayOrder: "any" }), true, "12.02");
});

test("13 - unordered matching backtracks across nested wildcards", () => {
  const superset = [
    { metadata: { name: "exact" } },
    { metadata: { name: "other" } },
  ];
  const subset = [{ metadata: { name: "*" } }, { metadata: { name: "exact" } }];

  equal(compare(superset, subset, { useWildcards: true }), false, "13.01");
  equal(
    compare(superset, subset, { arrayOrder: "any", useWildcards: true }),
    true,
    "13.02",
  );
});

test("14 - unordered matching applies to nested arrays", () => {
  const superset = {
    groups: [
      [1, 2],
      [3, 4],
    ],
  };
  const subset = {
    groups: [
      [4, 3],
      [2, 1],
    ],
  };

  equal(compare(superset, subset, { matchStrictly: true }), false, "14.01");
  equal(
    compare(superset, subset, {
      arrayOrder: "any",
      matchStrictly: true,
    }),
    true,
    "14.02",
  );
});

test("15 - unordered matching supports sparse arrays", () => {
  const superset = Array(3);
  superset[2] = "x";
  const reordered = Array(3);
  reordered[0] = "x";

  equal(compare(superset, reordered), false, "15.01");
  equal(compare(superset, reordered, { arrayOrder: "any" }), true, "15.02");
  equal(compare(superset, Array(3), { arrayOrder: "any" }), false, "15.03");
});

test("16 - unordered wildcard matching stays boolean in verbose mode", () => {
  equal(
    compare(
      [{ metadata: { name: "exact" } }, { metadata: { name: "other" } }],
      [{ metadata: { name: "*" } }, { metadata: { name: "exact" } }],
      {
        arrayOrder: "any",
        useWildcards: true,
        verboseWhenMismatches: true,
      },
    ),
    true,
    "16.01",
  );
});

test.run();
