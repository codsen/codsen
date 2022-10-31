import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

test("01 - empty input", () => {
  equal(c(""), "", "01.01");
});

test("02 - all whitespace", () => {
  equal(c("    "), " ", "02.01");
});

test("03 - all whitespace", () => {
  equal(c("\t"), " ", "03.01");
});

test("04 - all whitespace", () => {
  equal(c("    ", 1), " ", "04.01");
});

test("05 - all whitespace", () => {
  equal(c("\t", 1), " ", "05.01");
});

test("06 - all whitespace", () => {
  equal(c("    ", 2), " ", "06.01");
});

test("07 - all whitespace", () => {
  equal(c("\t", 2), " ", "07.01");
});

test("08 - all whitespace", () => {
  equal(c("  \n\n  "), "\n", "08.01");
});

test("09 - all whitespace", () => {
  equal(c("  \n\n  ", 1), "\n", "09.01");
});

test("10 - all whitespace", () => {
  equal(c("  \n\n  ", 2), "\n\n", "10.01");
});

test("11 - all whitespace", () => {
  equal(c("  \n\n  ", 9), "\n\n", "11.01");
});

test("12 - all whitespace", () => {
  equal(c("\n"), "\n", "12.01");
});

test("13 - all whitespace", () => {
  equal(c("\n", 1), "\n", "13.01");
});

test("14 - all whitespace", () => {
  equal(c("\n", 2), "\n", "14.01");
});

test("15 - all whitespace", () => {
  equal(c("\n\n", 2), "\n\n", "15.01");
});

test("16 - all whitespace", () => {
  equal(c("\n\n", 3), "\n\n", "16.01");
});

test("17 - all whitespace", () => {
  equal(c("\n \n\n\n", 5), "\n\n\n\n", "17.01");
});

test.run();
