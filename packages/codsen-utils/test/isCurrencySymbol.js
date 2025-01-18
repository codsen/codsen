import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isCurrencySymbol } from "../dist/codsen-utils.esm.js";

// ------------------------------------------------------

test("01", () => {
  equal(isCurrencySymbol("a"), false, "01.01");
});

test("02", () => {
  equal(isCurrencySymbol("A"), false, "02.01");
});

test("03", () => {
  equal(isCurrencySymbol("ж"), false, "03.01");
});

test("04", () => {
  equal(isCurrencySymbol("_"), false, "04.01");
});

test("05", () => {
  equal(isCurrencySymbol("9"), false, "05.01");
});

test("06", () => {
  equal(isCurrencySymbol(), false, "06.01");
});

test("07", () => {
  equal(isCurrencySymbol(null), false, "07.01");
});

test("08", () => {
  equal(isCurrencySymbol(NaN), false, "08.01");
});

test("09", () => {
  equal(isCurrencySymbol(undefined), false, "09.01");
});

test("10", () => {
  equal(isCurrencySymbol(false), false, "10.01");
});

test("11", () => {
  equal(isCurrencySymbol(" "), false, "11.01");
});

test("12", () => {
  equal(isCurrencySymbol("\n"), false, "12.01");
  equal(isCurrencySymbol("\r"), false, "12.02");
  equal(isCurrencySymbol("\r\n"), false, "12.03");
});

test("13", () => {
  equal(isCurrencySymbol("$"), true, "13.01");
});

test("14", () => {
  equal(isCurrencySymbol("£"), true, "14.01");
});

test("15", () => {
  equal(isCurrencySymbol("€"), true, "15.01");
});

test("16", () => {
  equal(isCurrencySymbol("P"), true, "16.01");
});

test("17", () => {
  equal(isCurrencySymbol("Lek"), true, "17.01");
});

test("18", () => {
  equal(isCurrencySymbol("лв"), true, "18.01");
});

test.run();
