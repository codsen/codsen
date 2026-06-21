// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

// testing the second input argument, the line break limit
// -----------------------------------------------------------------------------

test("001", () => {
  equal(c("zzz", 9), "zzz", "001.01");
});

// erroneous, but behind the scenes it's set to 1
test("002", () => {
  equal(c("zzz", 9.1), "zzz", "002.01");
});

test("003 - CRLF", () => {
  equal(
    c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 9),
    "\r\n\r\n\r\nzzz\r\n\r\n\r\n",
    "003.01",
  );
});

test("004 - LF", () => {
  equal(c("\n\n\nzzz\n\n\n", 9), "\n\n\nzzz\n\n\n", "004.01");
});

test("005 - CR", () => {
  equal(c("\r\r\rzzz\r\r\r", 9), "\r\r\rzzz\r\r\r", "005.01");
});

test("006 - CRLF", () => {
  equal(
    c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 3),
    "\r\n\r\n\r\nzzz\r\n\r\n\r\n",
    "006.01",
  );
});

test("007 - CR", () => {
  equal(c("\r\r\rzzz\r\r\r", 3), "\r\r\rzzz\r\r\r", "007.01");
});

test("008 - LF", () => {
  equal(c("\n\n\nzzz\n\n\n", 3), "\n\n\nzzz\n\n\n", "008.01");
});

test("009 - CRLF", () => {
  equal(c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 2), "\r\n\r\nzzz\r\n\r\n", "009.01");
});

test("010 - CR", () => {
  equal(c("\r\r\rzzz\r\r\r", 2), "\r\rzzz\r\r", "010.01");
});

test("011 - LF", () => {
  equal(c("\n\n\nzzz\n\n\n", 2), "\n\nzzz\n\n", "011.01");
});

test("012 - CRLF", () => {
  equal(c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 1), "\r\nzzz\r\n", "012.01");
});

test("013 - LF", () => {
  equal(c("\n\n\nzzz\n\n\n", 1), "\nzzz\n", "013.01");
});

test("014 - CR", () => {
  equal(c("\r\r\rzzz\r\r\r", 1), "\rzzz\r", "014.01");
});

test("015 - CRLF", () => {
  equal(c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 0), "zzz", "015.01");
});

test("016 - LF", () => {
  equal(c("\n\n\nzzz\n\n\n", 0), "zzz", "016.01");
});

test("017 - CR", () => {
  equal(c("\r\r\rzzz\r\r\r", 0), "zzz", "017.01");
});

test.run();
