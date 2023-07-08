import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

// testing the second input argument, the line break limit
// -----------------------------------------------------------------------------

test("01", () => {
  equal(c("zzz", 9), "zzz", "01.01");
});

// erroneous, but behind the scenes it's set to 1
test("02", () => {
  equal(c("zzz", 9.1), "zzz", "02.01");
});

test("03 - CRLF", () => {
  equal(
    c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 9),
    "\r\n\r\n\r\nzzz\r\n\r\n\r\n",
    "03.01",
  );
});

test("04 - LF", () => {
  equal(c("\n\n\nzzz\n\n\n", 9), "\n\n\nzzz\n\n\n", "04.01");
});

test("05 - CR", () => {
  equal(c("\r\r\rzzz\r\r\r", 9), "\r\r\rzzz\r\r\r", "05.01");
});

test("06 - CRLF", () => {
  equal(
    c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 3),
    "\r\n\r\n\r\nzzz\r\n\r\n\r\n",
    "06.01",
  );
});

test("07 - CR", () => {
  equal(c("\r\r\rzzz\r\r\r", 3), "\r\r\rzzz\r\r\r", "07.01");
});

test("08 - LF", () => {
  equal(c("\n\n\nzzz\n\n\n", 3), "\n\n\nzzz\n\n\n", "08.01");
});

test("09 - CRLF", () => {
  equal(c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 2), "\r\n\r\nzzz\r\n\r\n", "09.01");
});

test("10 - CR", () => {
  equal(c("\r\r\rzzz\r\r\r", 2), "\r\rzzz\r\r", "10.01");
});

test("11 - LF", () => {
  equal(c("\n\n\nzzz\n\n\n", 2), "\n\nzzz\n\n", "11.01");
});

test("12 - CRLF", () => {
  equal(c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 1), "\r\nzzz\r\n", "12.01");
});

test("13 - LF", () => {
  equal(c("\n\n\nzzz\n\n\n", 1), "\nzzz\n", "13.01");
});

test("14 - CR", () => {
  equal(c("\r\r\rzzz\r\r\r", 1), "\rzzz\r", "14.01");
});

test("15 - CRLF", () => {
  equal(c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 0), "zzz", "15.01");
});

test("16 - LF", () => {
  equal(c("\n\n\nzzz\n\n\n", 0), "zzz", "16.01");
});

test("17 - CR", () => {
  equal(c("\r\r\rzzz\r\r\r", 0), "zzz", "17.01");
});

test.run();
