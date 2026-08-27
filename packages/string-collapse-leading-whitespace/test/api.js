// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

test("001 - not a string input", () => {
  equal(c(1), 1, "001.01");
});

test("002 - not a string input", () => {
  equal(c(1, 1), 1, "002.01");
});

test("003 - not a string input", () => {
  equal(c(1, 2), 1, "003.01");
});

test("004 - not a string input", () => {
  equal(c(1, "zz"), 1, "004.01");
});

test("005 - primitive non-string values pass through", () => {
  equal(c(null), null, "005.01");
  equal(c(undefined), undefined, "005.02");
  equal(c(false), false, "005.03");
  equal(c(1n), 1n, "005.04");
  let value = Symbol("value");
  is(c(value), value, "005.05");
});

test("006 - reference values retain identity", () => {
  let object = { untouched: true };
  let array = ["untouched"];
  let callback = () => "untouched";

  is(c(object), object, "006.01");
  is(c(array), array, "006.02");
  is(c(callback), callback, "006.03");
});

test.run();
