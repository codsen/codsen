import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isUppercaseLetter } from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(isUppercaseLetter("A"), true, "01.01");
});

test("02 - Slavic uppercase shtch", () => {
  equal(isUppercaseLetter("Щ"), true, "02.01");
});

test("03", () => {
  equal(isUppercaseLetter("a"), false, "03.01");
});

test("04 - Slavic lowercase shtch", () => {
  equal(isUppercaseLetter("щ"), false, "04.01");
});

test("05", () => {
  equal(isUppercaseLetter(), false, "05.01");
});

test("06", () => {
  equal(isUppercaseLetter(null), false, "06.01");
});

test("07", () => {
  equal(isUppercaseLetter(NaN), false, "07.01");
});

test("08", () => {
  equal(isUppercaseLetter(undefined), false, "08.01");
});

test("09", () => {
  equal(isUppercaseLetter(true), false, "09.01");
});

test("10", () => {
  equal(isUppercaseLetter("-"), false, "10.01");
});

test("11", () => {
  equal(isUppercaseLetter(" "), false, "11.01");
});

test("12", () => {
  equal(isUppercaseLetter("\n"), false, "12.01");
  equal(isUppercaseLetter("\r"), false, "12.02");
  equal(isUppercaseLetter("\r\n"), false, "12.03");
});

test.run();
