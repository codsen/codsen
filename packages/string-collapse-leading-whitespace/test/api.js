import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

test("01 - not a string input", () => {
  equal(c(1), 1, "01.01");
});

test("02 - not a string input", () => {
  equal(c(1, 1), 1, "02.01");
});

test("03 - not a string input", () => {
  equal(c(1, 2), 1, "03.01");
});

test("04 - not a string input", () => {
  equal(c(1, "zz"), 1, "04.01");
});

test.run();
