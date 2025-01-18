import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isCurrencyChar } from "../dist/codsen-utils.esm.js";

// ------------------------------------------------------

test("01", () => {
  equal(isCurrencyChar("a"), false, "01.01");
});

test("02", () => {
  equal(isCurrencyChar("A"), false, "02.01");
});

test("03", () => {
  equal(isCurrencyChar("ж"), false, "03.01");
});

test("04", () => {
  equal(isCurrencyChar("_"), false, "04.01");
});

test("05", () => {
  equal(isCurrencyChar("9"), false, "05.01");
});

test("06", () => {
  equal(isCurrencyChar(), false, "06.01");
});

test("07", () => {
  equal(isCurrencyChar(null), false, "07.01");
});

test("08", () => {
  equal(isCurrencyChar(NaN), false, "08.01");
});

test("09", () => {
  equal(isCurrencyChar(undefined), false, "09.01");
});

test("10", () => {
  equal(isCurrencyChar(false), false, "10.01");
});

test("11", () => {
  equal(isCurrencyChar(" "), false, "11.01");
});

test("12", () => {
  equal(isCurrencyChar("\n"), false, "12.01");
  equal(isCurrencyChar("\r"), false, "12.02");
  equal(isCurrencyChar("\r\n"), false, "12.03");
});

test("13", () => {
  equal(isCurrencyChar("$"), true, "13.01");
});

test("14", () => {
  equal(isCurrencyChar("£"), true, "14.01");
});

test("15", () => {
  equal(isCurrencyChar("€"), true, "15.01");
});

test.run();
