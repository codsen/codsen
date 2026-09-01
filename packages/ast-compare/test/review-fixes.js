import { match as wildcardMatch } from "codsen-utils";
import { test } from "uvu";
import {
  equal,
  match as matchesText,
  ok,
  throws,
  type,
} from "uvu/assert";

import { compare, defaults } from "../dist/ast-compare.esm.js";

test("01 - validates the public boundary", () => {
  throws(() => compare(), /THROW_ID_01/u, "01.01");
  throws(() => compare("a"), /THROW_ID_02/u, "01.02");
  throws(() => compare("a", "a", []), /THROW_ID_03/u, "01.03");
  throws(() => compare("a", "a", { unknown: true }), /THROW_ID_04/u, "01.04");
  throws(
    () => compare("a", "a", { arrayOrder: "Any" }),
    /THROW_ID_05/u,
    "01.05",
  );
  throws(
    () => compare("a", "a", { hungryForWhitespace: "false" }),
    /THROW_ID_06/u,
    "01.06",
  );
  throws(
    () => compare("a", "a", { matchStrictly: 1 }),
    /THROW_ID_07/u,
    "01.07",
  );
  throws(
    () => compare("a", "a", { verboseWhenMismatches: null }),
    /THROW_ID_08/u,
    "01.08",
  );
  throws(
    () => compare("a", "a", { useWildcards: "false" }),
    /THROW_ID_09/u,
    "01.09",
  );
  throws(
    () => compare("a", "a", { reportCompletionFunc: true }),
    /THROW_ID_10/u,
    "01.10",
  );
  throws(
    () => compare("a", "a", { reportProgressFunc: true }),
    /THROW_ID_11/u,
    "01.11",
  );
  throws(
    () => compare("a", "a", { reportProgressFuncFrom: Number.NaN }),
    /THROW_ID_12/u,
    "01.12",
  );
  throws(
    () => compare("a", "a", { reportProgressFuncTo: Number.POSITIVE_INFINITY }),
    /THROW_ID_13/u,
    "01.13",
  );
  throws(
    () =>
      compare("a", "a", {
        reportProgressFuncFrom: 2,
        reportProgressFuncTo: 1,
      }),
    /THROW_ID_14/u,
    "01.14",
  );
  equal(compare(undefined, undefined), true, "01.15");
  equal(compare("a", "a", null), true, "01.16");
});

test("02 - exported defaults are an immutable snapshot", () => {
  equal(Object.isFrozen(defaults), true, "02.01");
  equal(Reflect.set(defaults, "arrayOrder", "any"), false, "02.02");
  equal(compare(["a", "b"], ["b", "a"]), false, "02.03");

  const options = Object.freeze({ useWildcards: true });
  equal(compare("alpha", "a*", options), true, "02.04");
  equal(options, { useWildcards: true }, "02.05");
});

test("03 - whitespace matching never consumes meaningful primitives", () => {
  const meaningful = ["real", 1, true, false, null, undefined, { x: 1 }];
  equal(
    meaningful.map((value) =>
      compare([value], [" "], { hungryForWhitespace: true }),
    ),
    meaningful.map(() => false),
    "03.01",
  );
  equal(
    meaningful.map((value) =>
      compare([value], [" "], {
        hungryForWhitespace: true,
        matchStrictly: true,
      }),
    ),
    meaningful.map(() => false),
    "03.02",
  );
  equal(
    compare(["real"], [" "], {
      arrayOrder: "any",
      hungryForWhitespace: true,
    }),
    false,
    "03.03",
  );
  equal(
    compare({ value: [false] }, { value: [true] }, {
      hungryForWhitespace: true,
    }),
    false,
    "03.04",
  );
  equal(
    compare({ count: 1 }, {}, { hungryForWhitespace: true }),
    false,
    "03.05",
  );
  equal(
    compare(Number.NaN, Number.NaN, { hungryForWhitespace: true }),
    false,
    "03.06",
  );
});

test("04 - empty cross-type semantics are wrapper invariant", () => {
  const options = { hungryForWhitespace: true, matchStrictly: true };
  const pairs = [
    ["", { nested: [" "] }],
    [[], { nested: "\n" }],
    [{ value: [] }, ["\t"]],
  ];

  equal(
    pairs.map(([first, second]) => compare(first, second, options)),
    [true, true, true],
    "04.01",
  );
  equal(
    pairs.map(([first, second]) =>
      compare({ wrapped: first }, { wrapped: second }, options),
    ),
    [true, true, true],
    "04.02",
  );
  equal(compare(null, "", options), false, "04.03");
});

test("05 - sparse entries are meaningful and compare as undefined", () => {
  const sparse = new Array(1);
  equal(
    compare(sparse, [" "], { hungryForWhitespace: true, matchStrictly: true }),
    false,
    "05.01",
  );
  equal(compare(sparse, [undefined], { matchStrictly: true }), true, "05.02");
  equal(compare(sparse, new Array(1), { matchStrictly: true }), true, "05.03");
  equal(
    compare([], sparse, { hungryForWhitespace: true, matchStrictly: true }),
    false,
    "05.04",
  );
});

test("06 - wildcard object keys consume one key and compare values", () => {
  equal(
    compare(
      { alpha: "x", beta: "y" },
      { "a*": "x", "al*": "x" },
      { matchStrictly: true, useWildcards: true },
    ),
    false,
    "06.01",
  );
  equal(
    compare({ alpha: { value: 1 } }, { "a*": { value: 1 } }, {
      useWildcards: true,
    }),
    true,
    "06.02",
  );
  equal(
    compare({ alpha: { value: 2 } }, { "a*": { value: 1 } }, {
      useWildcards: true,
    }),
    false,
    "06.03",
  );
  equal(
    compare({ "a*": "literal", alpha: "fallback" }, { "a*": "literal" }, {
      useWildcards: true,
    }),
    true,
    "06.04",
  );
  equal(
    compare({ "a*": "wrong", alpha: "literal" }, { "a*": "literal" }, {
      useWildcards: true,
    }),
    false,
    "06.05",
  );
  equal(
    compare({ "*": 1 }, { "\\*": 1 }, { useWildcards: true }),
    true,
    "06.06",
  );
  equal(
    compare({ public: 1 }, { "!secret*": 1 }, { useWildcards: true }),
    true,
    "06.07",
  );
});

test("07 - unordered matching agrees with a brute-force reference", () => {
  const cases = [
    [["alpha", "alpine"], ["a*", "al*"]],
    [["alpha", "beta"], ["*", "a*"]],
    [["alpha"], ["a*", "al*"]],
    [["alpha", "beta"], ["a*", "z*"]],
    [["alpha", "beta", "gamma"], ["*a", "b*", "g*"]],
  ];

  function sequences(values, length, prefix = [], result = []) {
    if (prefix.length === length) {
      result.push(prefix);
      return result;
    }
    for (const value of values) {
      sequences(values, length, [...prefix, value], result);
    }
    return result;
  }

  for (const values of [["a"], ["a", "b"], ["a", "ab", "b"]]) {
    for (let length = 1; length <= values.length; length++) {
      for (const patterns of sequences(["*", "a*", "b*", "a", "b"], length)) {
        cases.push([values, patterns]);
      }
    }
  }

  function bruteForce(values, patterns, used = new Set(), index = 0) {
    if (index === patterns.length) return true;
    for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
      if (
        !used.has(valueIndex) &&
        wildcardMatch(values[valueIndex], patterns[index], {
          caseSensitiveMatch: true,
        })
      ) {
        used.add(valueIndex);
        if (bruteForce(values, patterns, used, index + 1)) return true;
        used.delete(valueIndex);
      }
    }
    return false;
  }

  equal(
    cases.map(([values, patterns]) =>
      compare(values, patterns, {
        arrayOrder: "any",
        useWildcards: true,
      }),
    ),
    cases.map(([values, patterns]) => bruteForce(values, patterns)),
    "07.01",
  );
});

test("08 - deep acyclic values do not use the native call stack", () => {
  let equalFirst = "leaf";
  let equalSecond = "leaf";
  let differentSecond = "different";
  for (let depth = 0; depth < 10_000; depth++) {
    if (depth % 2) {
      equalFirst = [equalFirst];
      equalSecond = [equalSecond];
      differentSecond = [differentSecond];
    } else {
      equalFirst = { child: equalFirst };
      equalSecond = { child: equalSecond };
      differentSecond = { child: differentSecond };
    }
  }

  equal(compare(equalFirst, equalSecond, { matchStrictly: true }), true, "08.01");
  equal(
    compare(equalFirst, differentSecond, { matchStrictly: true }),
    false,
    "08.02",
  );
});

test("09 - cyclic values have deterministic pair semantics", () => {
  const first = { label: "node" };
  const second = { label: "node" };
  first.self = first;
  second.self = second;
  equal(compare(first, second, { matchStrictly: true }), true, "09.01");

  const mismatch = { label: "different" };
  mismatch.self = mismatch;
  equal(compare(first, mismatch, { matchStrictly: true }), false, "09.02");
  equal(
    compare(first, second, {
      hungryForWhitespace: true,
      matchStrictly: true,
    }),
    true,
    "09.03",
  );
});

test("10 - verbose mode explains every mismatch with stable sides", () => {
  const results = [
    compare(1, 2, { verboseWhenMismatches: true }),
    compare("1", 1, { verboseWhenMismatches: true }),
    compare(null, {}, { verboseWhenMismatches: true }),
    compare({ a: 1 }, { a: 2 }, { verboseWhenMismatches: true }),
    compare([1], [2], { verboseWhenMismatches: true }),
    compare([1], [2], {
      arrayOrder: "any",
      verboseWhenMismatches: true,
    }),
    compare({ alpha: 1 }, { "a*": 2 }, {
      useWildcards: true,
      verboseWhenMismatches: true,
    }),
  ];
  equal(results.every((result) => typeof result === "string"), true, "10.01");
  matchesText(results[3], /\$\["a"\].*First value is 1; second pattern is 2/u, "10.02");
});

test("11 - progress and completion are additive observability", () => {
  const originalNow = Date.now;
  let now = 100;
  Date.now = () => {
    const current = now;
    now += 7;
    return current;
  };

  try {
    const first = Array.from({ length: 40 }, (_, index) => `item-${index}`);
    const second = [...first].reverse();
    const progress = [];
    let completion;
    const result = compare(first, second, {
      arrayOrder: "any",
      matchStrictly: true,
      reportCompletionFunc: (stats) => {
        completion = stats;
      },
      reportProgressFunc: (percentage) => progress.push(percentage),
      reportProgressFuncFrom: 10,
      reportProgressFuncTo: 20,
    });

    equal(result, true, "11.01");
    equal(progress[0], 10, "11.02");
    equal(progress.at(-1), 20, "11.03");
    equal(
      progress.every((value, index) => index === 0 || value >= progress[index - 1]),
      true,
      "11.04",
    );
    ok(progress.length > 2, "11.05");
    equal(
      completion,
      {
        candidateComparisons: 1600,
        comparisons: 1601,
        matchingEdges: 40,
        timeTakenInMilliseconds: 7,
      },
      "11.06",
    );
    equal(Object.isFrozen(completion), true, "11.07");
  } finally {
    Date.now = originalNow;
  }

  equal(
    compare([1, 2], [2, 1], {
      arrayOrder: "any",
      reportCompletionFunc: () => {
        throw new Error("completion failure");
      },
      reportProgressFunc: () => {
        throw new Error("progress failure");
      },
    }),
    true,
    "11.08",
  );
});

test("12 - inputs remain unchanged", () => {
  const first = Object.freeze({
    nodes: Object.freeze([
      Object.freeze({ name: "alpha", value: Object.freeze([" "]) }),
      Object.freeze({ name: "beta", value: 2 }),
    ]),
  });
  const second = Object.freeze({
    nodes: Object.freeze([Object.freeze({ name: "a*", value: Object.freeze(["\n"]) })]),
  });

  type(
    compare(first, second, {
      arrayOrder: "any",
      hungryForWhitespace: true,
      useWildcards: true,
    }),
    "boolean",
    "12.01",
  );
  equal(first.nodes[0].name, "alpha", "12.02");
  equal(second.nodes[0].name, "a*", "12.03");
});

test("13 - whitespace caches and an empty unordered graph stay deterministic", () => {
  const blankFirst = { value: " " };
  const blankSecond = { value: "\n" };
  equal(
    compare(
      { a: blankFirst, b: blankFirst, marker: "kept" },
      { a: blankSecond, b: blankSecond, marker: "kept" },
      { hungryForWhitespace: true, matchStrictly: true },
    ),
    true,
    "13.01",
  );

  const meaningfulFirst = { value: 1 };
  const meaningfulSecond = { value: 1 };
  equal(
    compare(
      { a: meaningfulFirst, b: meaningfulFirst },
      { a: meaningfulSecond, b: meaningfulSecond },
      { hungryForWhitespace: true, matchStrictly: true },
    ),
    true,
    "13.02",
  );
  equal(compare([], [], { arrayOrder: "any" }), true, "13.03");

  const sharedFirst = { value: 1 };
  const sharedSecond = { value: 1 };
  equal(
    compare(
      { seed: sharedFirst, container: { child: sharedFirst } },
      { seed: sharedSecond, container: { child: sharedSecond } },
      { hungryForWhitespace: true, matchStrictly: true },
    ),
    true,
    "13.04",
  );

  const firstCycle = {};
  const secondCycle = {};
  firstCycle.self = firstCycle;
  secondCycle.self = secondCycle;
  equal(
    compare(firstCycle, secondCycle, {
      hungryForWhitespace: true,
      matchStrictly: true,
    }),
    true,
    "13.05",
  );
});

test("14 - symbol metadata cannot hide meaningful record values", () => {
  const tagged = { text: "visible" };
  tagged[Symbol.toStringTag] = "Record";
  const iterable = { text: "visible" };
  iterable[Symbol.iterator] = undefined;
  const records = [tagged, iterable];
  const modes = [
    { hungryForWhitespace: true },
    { hungryForWhitespace: true, matchStrictly: true },
  ];

  equal(
    modes.map((options) =>
      records.map((record) => compare(record, {}, options)),
    ),
    [
      [false, false],
      [false, false],
    ],
    "14.01",
  );
  equal(
    modes.map((options) =>
      records.map((record) => compare({}, record, options)),
    ),
    [
      [false, false],
      [false, false],
    ],
    "14.02",
  );
  equal(
    [0, false, null, undefined].map((value) =>
      compare({ value }, {}, { hungryForWhitespace: true }),
    ),
    [false, false, false, false],
    "14.03",
  );
});

test.run();
