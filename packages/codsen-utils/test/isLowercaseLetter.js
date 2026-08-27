// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { isLowercaseLetter } from "../dist/codsen-utils.esm.js";

// ------------------------------------------------------

test("01", () => {
  equal(isLowercaseLetter("a"), true, "01.01");
});

test("02 - Slavic lowercase shtch", () => {
  equal(isLowercaseLetter("щ"), true, "02.01");
});

test("03", () => {
  equal(isLowercaseLetter("A"), false, "03.01");
});

test("04 - Slavic uppercase shtch", () => {
  equal(isLowercaseLetter("Щ"), false, "04.01");
});

test("05", () => {
  equal(isLowercaseLetter(), false, "05.01");
});

test("06", () => {
  equal(isLowercaseLetter(null), false, "06.01");
});

test("07", () => {
  equal(isLowercaseLetter(NaN), false, "07.01");
});

test("08", () => {
  equal(isLowercaseLetter(undefined), false, "08.01");
});

test("09", () => {
  equal(isLowercaseLetter(true), false, "09.01");
});

test("10", () => {
  equal(isLowercaseLetter("-"), false, "10.01");
});

test("11", () => {
  equal(isLowercaseLetter(" "), false, "11.01");
});

test("12", () => {
  equal(isLowercaseLetter("\n"), false, "12.01");
  equal(isLowercaseLetter("\r"), false, "12.02");
  equal(isLowercaseLetter("\r\n"), false, "12.03");
});

test("13 - Unicode and multi-character strings", () => {
  equal(isLowercaseLetter("ß"), true, "13.01");
  equal(isLowercaseLetter("aa"), false, "13.02");
});

test("14 - astral, uncased, and malformed code points", () => {
  equal(isLowercaseLetter("𐐨"), true, "14.01");
  equal(isLowercaseLetter("𐐀"), false, "14.02");
  equal(isLowercaseLetter("東"), false, "14.03");
  equal(isLowercaseLetter("\u0301"), false, "14.04");
  equal(isLowercaseLetter("\ud801"), false, "14.05");
  equal(isLowercaseLetter("\udc00"), false, "14.06");
  equal(isLowercaseLetter("\udc00\ud801"), false, "14.07");
});

test.run();
