import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { findAllIdx } from "../dist/codsen-utils.esm.js";

// ------------------------------------------------------

test("01 - wrong types", () => {
  equal(findAllIdx(null), [], "01.01");
  equal(findAllIdx(true), [], "01.02");
  equal(findAllIdx(false), [], "01.03");
  equal(findAllIdx(0), [], "01.04");
  equal(findAllIdx(1), [], "01.05");
  equal(findAllIdx(1n), [], "01.06");
  equal(
    findAllIdx(() => {}),
    [],
    "01.07",
  );
  equal(findAllIdx({ foo: "bar" }), [], "01.08");
  equal(findAllIdx([1]), [], "01.09");
  equal(findAllIdx(null), [], "01.10");
  equal(findAllIdx(NaN), [], "01.11");

  equal(findAllIdx(Symbol("foo")), [], "01.12");
});

test("02", () => {
  equal(findAllIdx(""), [], "02.01");
  equal(findAllIdx("a"), [], "02.02");
});

test("03", () => {
  equal(findAllIdx("abc def", "a"), [0], "03.01");
  equal(findAllIdx("abc def aaa", "a"), [0, 8, 9, 10], "03.02");
});
