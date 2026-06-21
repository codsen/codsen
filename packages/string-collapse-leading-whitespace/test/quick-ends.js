// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

test("001 - empty input", () => {
  equal(c(""), "", "001.01");
});

test("002 - all whitespace", () => {
  equal(c("    "), " ", "002.01");
});

test("003 - all whitespace", () => {
  equal(c("\t"), " ", "003.01");
});

test("004 - all whitespace", () => {
  equal(c("    ", 1), " ", "004.01");
});

test("005 - all whitespace", () => {
  equal(c("\t", 1), " ", "005.01");
});

test("006 - all whitespace", () => {
  equal(c("    ", 2), " ", "006.01");
});

test("007 - all whitespace", () => {
  equal(c("\t", 2), " ", "007.01");
});

test("008 - all whitespace", () => {
  equal(c("  \n\n  "), "\n", "008.01");
});

test("009 - all whitespace", () => {
  equal(c("  \n\n  ", 1), "\n", "009.01");
});

test("010 - all whitespace", () => {
  equal(c("  \n\n  ", 2), "\n\n", "010.01");
});

test("011 - all whitespace", () => {
  equal(c("  \n\n  ", 9), "\n\n", "011.01");
});

test("012 - all whitespace", () => {
  equal(c("\n"), "\n", "012.01");
});

test("013 - all whitespace", () => {
  equal(c("\n", 1), "\n", "013.01");
});

test("014 - all whitespace", () => {
  equal(c("\n", 2), "\n", "014.01");
});

test("015 - all whitespace", () => {
  equal(c("\n\n", 2), "\n\n", "015.01");
});

test("016 - all whitespace", () => {
  equal(c("\n\n", 3), "\n\n", "016.01");
});

test("017 - all whitespace", () => {
  equal(c("\n \n\n\n", 5), "\n\n\n\n", "017.01");
});

test.run();
