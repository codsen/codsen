import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isNumber } from "../dist/codsen-utils.esm.js";

// true
// ------------------------------------------------------

test("01", () => {
  equal(isNumber("0"), true, "01.01");
});

test("02", () => {
  equal(isNumber("9"), true, "02.01");
});

test("03 - first character is checked", () => {
  equal(isNumber("99"), true, "03.01");
});

test("04", () => {
  equal(isNumber(0), true, "04.01");
});

test("05", () => {
  equal(isNumber(9), true, "05.01");
});

test("06 - it's naughty but accepted", () => {
  equal(isNumber(99), true, "06.01");
});

// false
// ------------------------------------------------------

test("07", () => {
  equal(isNumber(9.1), false, "07.01");
});

test("08", () => {
  equal(isNumber(-9), false, "08.01");
});

test("09", () => {
  equal(isNumber(), false, "09.01");
});

test("10", () => {
  equal(isNumber(""), false, "10.01");
});

test("11", () => {
  equal(isNumber(" "), false, "11.01");
});

test("12", () => {
  equal(isNumber(NaN), false, "12.01");
});

test("13", () => {
  equal(isNumber(null), false, "13.01");
});

test("14", () => {
  equal(isNumber("a"), false, "14.01");
});

test.run();
