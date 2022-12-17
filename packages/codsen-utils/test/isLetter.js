import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isLetter } from "../dist/codsen-utils.esm.js";

// true
// ------------------------------------------------------

test("01", () => {
  equal(isLetter("a"), true, "01.01");
});

test("02", () => {
  equal(isLetter("A"), true, "02.01");
});

test("03", () => {
  equal(isLetter("ж"), true, "03.01");
});

// false
// ------------------------------------------------------

test("04", () => {
  equal(isLetter(), false, "04.01");
});

test("05", () => {
  equal(isLetter(null), false, "05.01");
});

test("06", () => {
  equal(isLetter(NaN), false, "06.01");
});

test("07", () => {
  equal(isLetter(undefined), false, "07.01");
});

test("08", () => {
  equal(isLetter(true), false, "08.01");
});

test("09", () => {
  equal(isLetter("-"), false, "09.01");
});

test("10", () => {
  equal(isLetter(" "), false, "10.01");
});

test("11", () => {
  equal(isLetter("\n"), false, "11.01");
  equal(isLetter("\r"), false, "11.02");
  equal(isLetter("\r\n"), false, "11.03");
});

test.run();
