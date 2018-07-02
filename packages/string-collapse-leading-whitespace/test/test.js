import test from "ava";
import c from "../dist/string-collapse-leading-whitespace.esm";

// -----------------------------------------------------------------------------
// 01. normal use
// -----------------------------------------------------------------------------

test("01.01 - does nothing to trimmed strings", t => {
  t.is(c("zzz"), "zzz", "01.01");
  t.is(c("zzz", 1), "zzz", "01.02");
  t.is(c("zzz", 2), "zzz", "01.03");
});

test("01.02 - whitespace in front", t => {
  t.is(c(" zzz"), " zzz", "01.02.01");
  t.is(c("  zzz"), " zzz", "01.02.02");
  t.is(c("\tzzz"), " zzz", "01.02.03");

  t.is(c(" zzz", 1), " zzz", "01.02.04");
  t.is(c("  zzz", 1), " zzz", "01.02.05");
  t.is(c("\tzzz", 1), " zzz", "01.02.06");

  t.is(c(" zzz", 2), " zzz", "01.02.07");
  t.is(c("  zzz", 2), " zzz", "01.02.08");
  t.is(c("\tzzz", 2), " zzz", "01.02.09");
});

test("01.03 - whitespace in the end", t => {
  t.is(c("zzz "), "zzz ", "01.03.01");
  t.is(c("zzz  "), "zzz ", "01.03.02");
  t.is(c("z  zz  "), "z  zz ", "01.03.03");
  t.is(c("zzz  \t"), "zzz ", "01.03.04");
  t.is(c("z zz\t"), "z zz ", "01.03.05");

  t.is(c("zzz ", 1), "zzz ", "01.03.06");
  t.is(c("zzz  ", 1), "zzz ", "01.03.07");
  t.is(c("z  zz  ", 1), "z  zz ", "01.03.08");
  t.is(c("zzz  \t", 1), "zzz ", "01.03.09");
  t.is(c("z zz\t", 1), "z zz ", "01.03.10");

  t.is(c("zzz ", 2), "zzz ", "01.03.11");
  t.is(c("zzz  ", 2), "zzz ", "01.03.12");
  t.is(c("z  zz  ", 2), "z  zz ", "01.03.13");
  t.is(c("zzz  \t", 2), "zzz ", "01.03.14");
  t.is(c("z zz\t", 2), "z zz ", "01.03.15");
});

test("01.04 - whitespace on both ends", t => {
  t.is(c(" zzz "), " zzz ", "01.04.01");
  t.is(c("  zzz  "), " zzz ", "01.04.02");
  t.is(c("  zzz zzz  "), " zzz zzz ", "01.04.03");
  t.is(c("\tzzz zzz  "), " zzz zzz ", "01.04.04");
  t.is(c("\tzzz zzz\t"), " zzz zzz ", "01.04.05");
  t.is(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t"), " zzz zzz ", "01.04.06");

  t.is(c(" zzz ", 1), " zzz ", "01.04.07");
  t.is(c("  zzz  ", 1), " zzz ", "01.04.08");
  t.is(c("  zzz zzz  ", 1), " zzz zzz ", "01.04.09");
  t.is(c("\tzzz zzz  ", 1), " zzz zzz ", "01.04.10");
  t.is(c("\tzzz zzz\t", 1), " zzz zzz ", "01.04.11");
  t.is(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t", 1), " zzz zzz ", "01.04.12");

  t.is(c(" zzz ", 2), " zzz ", "01.04.13");
  t.is(c("  zzz  ", 2), " zzz ", "01.04.14");
  t.is(c("  zzz zzz  ", 2), " zzz zzz ", "01.04.15");
  t.is(c("\tzzz zzz  ", 2), " zzz zzz ", "01.04.16");
  t.is(c("\tzzz zzz\t", 2), " zzz zzz ", "01.04.17");
  t.is(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t", 2), " zzz zzz ", "01.04.18");
});

test("01.05 - whitespace with single line breaks in front", t => {
  t.is(c("\nzzz"), "\nzzz", "01.05.01");
  t.is(c(" \n zzz"), "\nzzz", "01.05.02");
  t.is(c("\t\nzzz"), "\nzzz", "01.05.03");

  t.is(c("\nzzz", 0), "\nzzz", "01.05.04");
  t.is(c(" \n zzz", 0), "\nzzz", "01.05.05");
  t.is(c("\t\nzzz", 0), "\nzzz", "01.05.06");

  t.is(c("\nzzz", 1), "\nzzz", "01.05.07");
  t.is(c(" \n zzz", 1), "\nzzz", "01.05.08");
  t.is(c("\t\nzzz", 1), "\nzzz", "01.05.09");

  t.is(c("\nzzz", 2), "\nzzz", "01.05.10");
  t.is(c(" \n zzz", 2), "\nzzz", "01.05.11");
  t.is(c("\t\nzzz", 2), "\nzzz", "01.05.12");
});

test("01.06 - whitespace with single line breaks in the end", t => {
  t.is(c("zzz\n"), "zzz\n", "01.06.01");
  t.is(c("zzz \n "), "zzz\n", "01.06.02");
  t.is(c("zzz\t\n"), "zzz\n", "01.06.03");

  t.is(c("zzz\n", 0), "zzz\n", "01.06.04");
  t.is(c("zzz \n ", 0), "zzz\n", "01.06.05");
  t.is(c("zzz\t\n", 0), "zzz\n", "01.06.06");

  t.is(c("zzz\n", 1), "zzz\n", "01.06.07");
  t.is(c("zzz \n ", 1), "zzz\n", "01.06.08");
  t.is(c("zzz\t\n", 1), "zzz\n", "01.06.09");

  t.is(c("zzz\n", 2), "zzz\n", "01.06.10");
  t.is(c("zzz \n ", 2), "zzz\n", "01.06.11");
  t.is(c("zzz\t\n", 2), "zzz\n", "01.06.12");
});

test("01.07 - whitespace with single line breaks in the end", t => {
  t.is(c("\n\nzzz\n\n"), "\nzzz\n", "01.06.01");
  t.is(c(" \n \n zzz \n \n "), "\nzzz\n", "01.06.02");
  t.is(c("\n \n \n zzz \n \n \n"), "\nzzz\n", "01.06.03");
  t.is(c(" \n \n \n zzz \n \n \n "), "\nzzz\n", "01.06.04");
  t.is(c(" \n \t\n \n zzz \n \n \n \t"), "\nzzz\n", "01.06.05");
  t.is(c(" \n \t\n \n zzz \n \n \n \t "), "\nzzz\n", "01.06.06");

  t.is(c("\n\nzzz\n\n", 1), "\nzzz\n", "01.06.07");
  t.is(c(" \n \n zzz \n \n ", 1), "\nzzz\n", "01.06.08");
  t.is(c("\n \n \n zzz \n \n \n", 1), "\nzzz\n", "01.06.09");
  t.is(c(" \n \n \n zzz \n \n \n ", 1), "\nzzz\n", "01.06.10");
  t.is(c(" \n \t\n \n zzz \n \n \n \t", 1), "\nzzz\n", "01.06.11");
  t.is(c(" \n \t\n \n zzz \n \n \n \t ", 1), "\nzzz\n", "01.06.12");

  t.is(c("\n\nzzz\n\n", 2), "\n\nzzz\n\n", "01.06.13");
  t.is(c("\n\nzzz\n", 2), "\n\nzzz\n", "01.06.14");
  t.is(c("\n\n\nzzz\n", 2), "\n\nzzz\n", "01.06.14");
  t.is(c("\n \n \n zzz \n \n \n", 2), "\n\nzzz\n\n", "01.06.15");
  t.is(c(" \n \n \n zzz \n \n \n ", 2), "\n\nzzz\n\n", "01.06.16");
  t.is(c(" \n \t\n \n zzz \n \n \n \t", 2), "\n\nzzz\n\n", "01.06.17");
  t.is(c(" \n \t\n \n zzz \n \n \n \t ", 2), "\n\nzzz\n\n", "01.06.18");
  t.is(c(" \n \n zzz \n \n ", 2), "\n\nzzz\n\n", "01.06.19");

  t.is(c("\n\nzzz\n\n", 3), "\n\nzzz\n\n", "01.06.13");
  t.is(c(" \n \n zzz \n \n ", 3), "\n\nzzz\n\n", "01.06.14");
  t.is(c("\n \n \n zzz \n \n \n", 3), "\n\n\nzzz\n\n\n", "01.06.15");
  t.is(c(" \n \n \n zzz \n \n \n ", 3), "\n\n\nzzz\n\n\n", "01.06.16");
  t.is(c(" \n \t\n \n zzz \n \n \n \t", 3), "\n\n\nzzz\n\n\n", "01.06.17");
  t.is(c(" \n \t\n \n zzz \n \n \n \t ", 3), "\n\n\nzzz\n\n\n", "01.06.18");

  t.is(c("\n\nzzz\n\n", 9), "\n\nzzz\n\n", "01.06.19");
  t.is(c(" \n \n zzz \n \n ", 9), "\n\nzzz\n\n", "01.06.20");
  t.is(c("\n \n \n zzz \n \n \n", 9), "\n\n\nzzz\n\n\n", "01.06.21");
  t.is(c(" \n \n \n zzz \n \n \n ", 9), "\n\n\nzzz\n\n\n", "01.06.22");
  t.is(c(" \n \t\n \n zzz \n \n \n \t", 9), "\n\n\nzzz\n\n\n", "01.06.23");
  t.is(c(" \n \t\n \n zzz \n \n \n \t ", 9), "\n\n\nzzz\n\n\n", "01.06.24");
});

// -----------------------------------------------------------------------------
// 02. quick ends
// -----------------------------------------------------------------------------

test("02.01 - empty input", t => {
  t.is(c(""), "", "02.01.01");
});

test("02.02 - all whitespace", t => {
  t.is(c("    "), " ", "02.02.01");
  t.is(c("\t"), " ", "02.02.02");
  t.is(c("    ", 1), " ", "02.02.03");
  t.is(c("\t", 1), " ", "02.02.04");
  t.is(c("    ", 2), " ", "02.02.05");
  t.is(c("\t", 2), " ", "02.02.06");
  t.is(c("  \n\n  "), "\n", "02.02.07");
  t.is(c("  \n\n  ", 1), "\n", "02.02.08");
  t.is(c("  \n\n  ", 2), "\n\n", "02.02.09");
  t.is(c("  \n\n  ", 9), "\n\n", "02.02.10");
  t.is(c("\n"), "\n", "02.02.11");
  t.is(c("\n", 1), "\n", "02.02.12");
  t.is(c("\n", 2), "\n", "02.02.13");
  t.is(c("\n\n", 2), "\n\n", "02.02.14");
  t.is(c("\n\n", 3), "\n\n", "02.02.15");
  t.is(c("\n \n\n\n", 5), "\n\n\n\n", "02.02.16");
});

test("02.03 - not a string input", t => {
  t.is(c(1), 1, "02.03.01");
  t.is(c(1, 1), 1, "02.03.02");
  t.is(c(1, 2), 1, "02.03.03");
  t.is(c(1, "zz"), 1, "02.03.04");
});
