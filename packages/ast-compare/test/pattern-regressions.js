import { test } from "uvu";
import { equal } from "uvu/assert";

import { compare } from "../dist/ast-compare.esm.js";

test("01 - equal strings still obey wildcard escaping and negation", () => {
  const patterns = ["!*", "!**", "\\*", "\\a", "\\\\"];
  equal(
    patterns.map((pattern) =>
      compare(pattern, pattern, { useWildcards: true }),
    ),
    patterns.map(() => false),
    "01.01",
  );
  equal(
    patterns.map((pattern) => compare(pattern, pattern)),
    patterns.map(() => true),
    "01.02",
  );
  equal(compare("*", "\\*", { useWildcards: true }), true, "01.03");
  equal(compare("a", "\\a", { useWildcards: true }), true, "01.04");
  equal(compare("\\", "\\\\", { useWildcards: true }), true, "01.05");
  equal(compare("alpha", "!beta", { useWildcards: true }), true, "01.06");
});

test("02 - shared containers still evaluate their nested patterns", () => {
  const array = ["!*", "alpha"];
  const object = { nested: { value: "!*" } };
  equal(compare(array, array, { useWildcards: true }), false, "02.01");
  equal(
    compare(array, array, { arrayOrder: "any", useWildcards: true }),
    false,
    "02.02",
  );
  equal(compare(object, object, { useWildcards: true }), false, "02.03");
  equal(
    compare({ wrapped: object }, { wrapped: object }, { useWildcards: true }),
    false,
    "02.04",
  );
  equal(compare(array, array), true, "02.05");
  equal(compare(object, object), true, "02.06");
});

test("03 - shared cyclic containers evaluate patterns and terminate", () => {
  const object = {};
  object.self = object;
  object.value = "!*";
  const array = [];
  array.push(array, "!*");
  equal(compare(object, object, { useWildcards: true }), false, "03.01");
  equal(compare(array, array, { useWildcards: true }), false, "03.02");
  equal(
    compare(array, array, { arrayOrder: "any", useWildcards: true }),
    false,
    "03.03",
  );

  object.value = "ordinary";
  array[1] = "ordinary";
  equal(compare(object, object, { useWildcards: true }), true, "03.04");
  equal(compare(array, array, { useWildcards: true }), true, "03.05");
  equal(
    compare(array, array, { arrayOrder: "any", useWildcards: true }),
    true,
    "03.06",
  );
});

test("04 - extreme finite progress bounds remain finite and monotonic", () => {
  const first = Array.from({ length: 1000 }, (_, index) => index);
  const second = [...first];
  const ranges = [
    [-Number.MAX_VALUE, Number.MAX_VALUE],
    [-Number.MAX_VALUE, Number.MAX_VALUE / 2],
    [-Number.MAX_VALUE / 2, Number.MAX_VALUE],
    [Number.MAX_VALUE / 2, Number.MAX_VALUE],
    [-Number.MAX_VALUE, -Number.MAX_VALUE / 2],
  ];
  const results = ranges.map(([from, to]) => {
    const progress = [];
    const matched = compare(first, second, {
      reportProgressFunc: (value) => progress.push(value),
      reportProgressFuncFrom: from,
      reportProgressFuncTo: to,
    });
    return {
      matched,
      startsAndEndsCorrectly: progress[0] === from && progress.at(-1) === to,
      reportsIntermediateProgress: progress.length > 2,
      staysWithinRange: progress.every(
        (value) => Number.isFinite(value) && value >= from && value <= to,
      ),
      isMonotonic: progress.every(
        (value, index) => index === 0 || value >= progress[index - 1],
      ),
    };
  });
  equal(
    results,
    ranges.map(() => ({
      matched: true,
      startsAndEndsCorrectly: true,
      reportsIntermediateProgress: true,
      staysWithinRange: true,
      isMonotonic: true,
    })),
    "04.01",
  );
});

test("05 - non-enumerable properties cannot satisfy enumerable patterns", () => {
  const first = { visible: 2 };
  Object.defineProperty(first, "hidden", { value: 1 });
  equal(compare(first, { hidden: 1 }), false, "05.01");
  equal(compare(first, { hidden: 1 }, { matchStrictly: true }), false, "05.02");
  equal(compare(first, { visible: 2 }, { matchStrictly: true }), true, "05.03");

  const wildcardFirst = { alpha: 1 };
  Object.defineProperty(wildcardFirst, "*", { value: 2 });
  equal(
    compare(wildcardFirst, { "*": 1 }, { useWildcards: true }),
    true,
    "05.04",
  );
  equal(
    compare(wildcardFirst, { "*": 2 }, { useWildcards: true }),
    false,
    "05.05",
  );
  equal(
    compare(first, { hidden: 1 }, { verboseWhenMismatches: true }),
    'Mismatch at $["hidden"]: the first object does not have the second object\'s key "hidden". First value is undefined; second pattern is 1.',
    "05.06",
  );
});

test.run();
