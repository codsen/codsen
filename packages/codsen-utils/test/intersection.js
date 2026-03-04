// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { intersection } from "../dist/codsen-utils.esm.js";

test("01 - only one argument in", () => {
  equal(intersection(), [], "01.01");
  equal(intersection(undefined), [], "01.02");
  equal(intersection(false), [], "01.03");
  equal(intersection(null), [], "01.04");
  equal(intersection(NaN), [], "01.05");
  equal(intersection(""), [], "01.06");
  equal(intersection([]), [], "01.07");
});

test("02 - two arguments in", () => {
  equal(intersection(undefined, undefined), [], "02.01");
  equal(intersection(false, false), [], "02.02");
  equal(intersection(null, null), [], "02.03");
  equal(intersection(NaN, NaN), [], "02.04");
  equal(intersection("", ""), [], "02.05");
  equal(intersection([], []), [], "02.06");
});

test("03 - normal use", () => {
  equal(intersection(["a", "b", "c"], ["a", "b"]), ["a", "b"], "03.01");
  equal(intersection(["a", "a", "a"], ["a", "a"]), ["a"], "03.02");
  equal(intersection(["a", "a", "a"], []), [], "03.03");
  equal(intersection([], ["a", "a", "a"]), [], "03.04");
  equal(intersection([1, "a"], ["a", 1]), [1, "a"], "03.05");
  equal(intersection([1, 1, "a"], ["a", 1]), [1, "a"], "03.06");
});

test("04 - result order follows the first array", () => {
  equal(intersection(["c", "b", "a", "c"], ["a", "c"]), ["c", "a"], "04.01");
});

test("05 - uses SameValueZero equality", () => {
  equal(intersection([NaN, 1, NaN], [NaN]), [NaN], "05.01");
  equal(intersection([-0, 1], [0]), [0], "05.02");
});

test("06 - objects intersect by identity", () => {
  let shared = { id: 1 };
  let sameShape = { id: 1 };

  let result = intersection([sameShape, shared, shared], [shared, { id: 1 }]);

  equal(result.length, 1, "06.01");
  is(result[0], shared, "06.02");
});

test("07 - larger inputs", () => {
  let a = Array.from({ length: 30 }, (_, index) => index % 15);
  let b = Array.from({ length: 10 }, (_, index) => index * 2);

  equal(intersection(a, b), [0, 2, 4, 6, 8, 10, 12, 14], "07.01");
});

test.run();
