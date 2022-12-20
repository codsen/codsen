import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isLatinLetter } from "../dist/codsen-utils.esm.js";

// ------------------------------------------------------

test("01", () => {
  equal(isLatinLetter("a"), true, "01.01");
});

test("02", () => {
  equal(isLatinLetter("A"), true, "02.01");
});

test("03", () => {
  equal(isLatinLetter("ж"), false, "03.01");
});

test("04", () => {
  equal(isLatinLetter("_"), false, "04.01");
});

test("05", () => {
  equal(isLatinLetter("9"), false, "05.01");
});

test("06", () => {
  equal(isLatinLetter(), false, "06.01");
});

test("07", () => {
  equal(isLatinLetter(null), false, "07.01");
});

test("08", () => {
  equal(isLatinLetter(NaN), false, "08.01");
});

test("09", () => {
  equal(isLatinLetter(undefined), false, "09.01");
});

test("10", () => {
  equal(isLatinLetter(true), false, "10.01");
});

test("11", () => {
  equal(isLatinLetter(" "), false, "11.01");
});

test("12", () => {
  equal(isLatinLetter("\n"), false, "12.01");
  equal(isLatinLetter("\r"), false, "12.02");
  equal(isLatinLetter("\r\n"), false, "12.03");
});

test.run();
