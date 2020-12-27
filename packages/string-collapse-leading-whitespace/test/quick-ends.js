import tap from "tap";
import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm";

tap.test("01 - empty input", (t) => {
  t.equal(c(""), "", "01");
  t.end();
});

tap.test("02 - all whitespace", (t) => {
  t.equal(c("    "), " ", "02");
  t.end();
});

tap.test("03 - all whitespace", (t) => {
  t.equal(c("\t"), " ", "03");
  t.end();
});

tap.test("04 - all whitespace", (t) => {
  t.equal(c("    ", 1), " ", "04");
  t.end();
});

tap.test("05 - all whitespace", (t) => {
  t.equal(c("\t", 1), " ", "05");
  t.end();
});

tap.test("06 - all whitespace", (t) => {
  t.equal(c("    ", 2), " ", "06");
  t.end();
});

tap.test("07 - all whitespace", (t) => {
  t.equal(c("\t", 2), " ", "07");
  t.end();
});

tap.test("08 - all whitespace", (t) => {
  t.equal(c("  \n\n  "), "\n", "08");
  t.end();
});

tap.test("09 - all whitespace", (t) => {
  t.equal(c("  \n\n  ", 1), "\n", "09");
  t.end();
});

tap.test("10 - all whitespace", (t) => {
  t.equal(c("  \n\n  ", 2), "\n\n", "10");
  t.end();
});

tap.test("11 - all whitespace", (t) => {
  t.equal(c("  \n\n  ", 9), "\n\n", "11");
  t.end();
});

tap.test("12 - all whitespace", (t) => {
  t.equal(c("\n"), "\n", "12");
  t.end();
});

tap.test("13 - all whitespace", (t) => {
  t.equal(c("\n", 1), "\n", "13");
  t.end();
});

tap.test("14 - all whitespace", (t) => {
  t.equal(c("\n", 2), "\n", "14");
  t.end();
});

tap.test("15 - all whitespace", (t) => {
  t.equal(c("\n\n", 2), "\n\n", "15");
  t.end();
});

tap.test("16 - all whitespace", (t) => {
  t.equal(c("\n\n", 3), "\n\n", "16");
  t.end();
});

tap.test("17 - all whitespace", (t) => {
  t.equal(c("\n \n\n\n", 5), "\n\n\n\n", "17");
  t.end();
});
