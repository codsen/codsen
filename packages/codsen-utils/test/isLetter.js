import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isLetter } from "../dist/codsen-utils.esm.js";

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

test("04", () => {
  equal(isLetter("_"), false, "04.01");
});

test("05", () => {
  equal(isLetter("9"), false, "05.01");
});

test("06", () => {
  equal(isLetter(), false, "06.01");
});

test("07", () => {
  equal(isLetter(null), false, "07.01");
});

test("08", () => {
  equal(isLetter(NaN), false, "08.01");
  equal(isLetter(0 / 0), false, "08.02");
  equal(isLetter(1 / 0), false, "08.03");
  equal(isLetter(-1 / 0), false, "08.04");
});

test("09", () => {
  equal(isLetter(undefined), false, "09.01");
});

test("10", () => {
  equal(isLetter(true), false, "10.01");
});

test("11", () => {
  equal(isLetter(" "), false, "11.01");
});

test("12", () => {
  equal(isLetter("\n"), false, "12.01");
  equal(isLetter("\r"), false, "12.02");
  equal(isLetter("\r\n"), false, "12.03");
});

test.run();
