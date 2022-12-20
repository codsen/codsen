import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isQuote } from "../dist/codsen-utils.esm.js";

// ------------------------------------------------------

test("01", () => {
  equal(isQuote("'"), true, "01.01");
});

test("02", () => {
  equal(isQuote('"'), true, "02.01");
});

test("03 - left single quote", () => {
  equal(isQuote("\u2018"), true, "03.01");
});

test("04 - right single quote", () => {
  equal(isQuote("\u2019"), true, "04.01");
});

test("05 - left double quote", () => {
  equal(isQuote("\u201C"), true, "05.01");
});

test("06 - right double quote", () => {
  equal(isQuote("\u201D"), true, "06.01");
});

test("07", () => {
  equal(isQuote(), false, "07.01");
});

test("08", () => {
  equal(isQuote(null), false, "08.01");
});

test("09", () => {
  equal(isQuote(NaN), false, "09.01");
});

test("10", () => {
  equal(isQuote(undefined), false, "10.01");
});

test("11", () => {
  equal(isQuote(true), false, "11.01");
});

test("12", () => {
  equal(isQuote("-"), false, "12.01");
});

test("13", () => {
  equal(isQuote(" "), false, "13.01");
});

test("14", () => {
  equal(isQuote("\n"), false, "14.01");
  equal(isQuote("\r"), false, "14.02");
  equal(isQuote("\r\n"), false, "14.03");
});

test("15", () => {
  equal(isQuote("a"), false, "15.01");
});

test.run();
