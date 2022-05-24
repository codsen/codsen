import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { split } from "../dist/string-bionic-split.esm.js";

test("01 - the", () => {
  equal(split("the"), 1, "01");
});

test("02 - of", () => {
  equal(split("of"), 1, "02");
});

test("03 - and", () => {
  equal(split("and"), 1, "03");
});

test("04 - a", () => {
  equal(split("a"), 1, "04");
});

test("05 - text", () => {
  equal(split("text"), 2, "05");
});

test("06 - s", () => {
  equal(split("s"), 0, "06");
});

test("07 - km", () => {
  equal(split("km"), 0, "07");
});

test("08 - four", () => {
  equal(split("four"), 2, "08");
});

test("09 - proof", () => {
  equal(split("proof"), 3, "09");
});

test("10 - amazing", () => {
  equal(split("amazing"), 4, "10");
});

test("11 - suites", () => {
  equal(split("suites"), 3, "11");
});

test("12 - trichotillomania", () => {
  equal(split("trichotillomania"), 8, "12");
});

test.run();
