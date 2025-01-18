import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

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

test.run();
