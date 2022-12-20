import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isNumberChar } from "../dist/codsen-utils.esm.js";

// ------------------------------------------------------

test("01", () => {
  equal(isNumberChar("0"), true, "01.01");
});

test("02", () => {
  equal(isNumberChar("9"), true, "02.01");
});

test("03 - first character is checked", () => {
  equal(isNumberChar("99"), true, "03.01");
});

test("04", () => {
  equal(isNumberChar(0), false, "04.01");
  equal(isNumberChar(9), false, "04.02");
  equal(isNumberChar(99), false, "04.03");
});

test("05", () => {
  equal(isNumberChar(9.1), false, "05.01");
});

test("06", () => {
  equal(isNumberChar(-9), false, "06.01");
});

test("07", () => {
  equal(isNumberChar(), false, "07.01");
});

test("08", () => {
  equal(isNumberChar(""), false, "08.01");
});

test("09", () => {
  equal(isNumberChar(" "), false, "09.01");
});

test("10", () => {
  equal(isNumberChar(NaN), false, "10.01");
});

test("11", () => {
  equal(isNumberChar(null), false, "11.01");
});

test("12", () => {
  equal(isNumberChar("a"), false, "12.01");
});

test.run();
