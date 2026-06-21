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

test.run();
