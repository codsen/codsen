import tap from "tap";
import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm";

// testing the second input argument, the line break limit
// -----------------------------------------------------------------------------

tap.test("01", (t) => {
  t.equal(c("zzz", 9), "zzz", "01");
  t.end();
});

// erroneous, but behind the scenes it's set to 1
tap.test("02", (t) => {
  t.equal(c("zzz", 9.1), "zzz", "02");
  t.end();
});

tap.test("03 - CRLF", (t) => {
  t.equal(
    c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 9),
    "\r\n\r\n\r\nzzz\r\n\r\n\r\n",
    "03"
  );
  t.end();
});

tap.test("04 - LF", (t) => {
  t.equal(c("\n\n\nzzz\n\n\n", 9), "\n\n\nzzz\n\n\n", "04");
  t.end();
});

tap.test("05 - CR", (t) => {
  t.equal(c("\r\r\rzzz\r\r\r", 9), "\r\r\rzzz\r\r\r", "05");
  t.end();
});

tap.test("06 - CRLF", (t) => {
  t.equal(
    c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 3),
    "\r\n\r\n\r\nzzz\r\n\r\n\r\n",
    "06"
  );
  t.end();
});

tap.test("07 - CR", (t) => {
  t.equal(c("\r\r\rzzz\r\r\r", 3), "\r\r\rzzz\r\r\r", "07");
  t.end();
});

tap.test("08 - LF", (t) => {
  t.equal(c("\n\n\nzzz\n\n\n", 3), "\n\n\nzzz\n\n\n", "08");
  t.end();
});

tap.test("09 - CRLF", (t) => {
  t.equal(c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 2), "\r\n\r\nzzz\r\n\r\n", "09");
  t.end();
});

tap.test("10 - CR", (t) => {
  t.equal(c("\r\r\rzzz\r\r\r", 2), "\r\rzzz\r\r", "10");
  t.end();
});

tap.test("11 - LF", (t) => {
  t.equal(c("\n\n\nzzz\n\n\n", 2), "\n\nzzz\n\n", "11");
  t.end();
});

tap.test("12 - CRLF", (t) => {
  t.equal(c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 1), "\r\nzzz\r\n", "12");
  t.end();
});

tap.test("13 - LF", (t) => {
  t.equal(c("\n\n\nzzz\n\n\n", 1), "\nzzz\n", "13");
  t.end();
});

tap.test("14 - CR", (t) => {
  t.equal(c("\r\r\rzzz\r\r\r", 1), "\rzzz\r", "14");
  t.end();
});

tap.test("15 - CRLF", (t) => {
  t.equal(c("\r\n\r\n\r\nzzz\r\n\r\n\r\n", 0), "zzz", "15");
  t.end();
});

tap.test("16 - LF", (t) => {
  t.equal(c("\n\n\nzzz\n\n\n", 0), "zzz", "16");
  t.end();
});

tap.test("17 - CR", (t) => {
  t.equal(c("\r\r\rzzz\r\r\r", 0), "zzz", "17");
  t.end();
});
