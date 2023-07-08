import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

test("01 - does nothing to trimmed strings", () => {
  equal(c("zzz"), "zzz", "01.01");
});

test("02 - does nothing to trimmed strings", () => {
  equal(c("zzz", 1), "zzz", "02.01");
});

test("03 - does nothing to trimmed strings", () => {
  equal(c("zzz", 2), "zzz", "03.01");
});

test("04 - whitespace in front", () => {
  equal(c(" zzz"), " zzz", "04.01");
});

test("05 - whitespace in front", () => {
  equal(c("  zzz"), " zzz", "05.01");
});

test("06 - whitespace in front", () => {
  equal(c("\tzzz"), " zzz", "06.01");
});

test("07 - whitespace in front", () => {
  equal(c(" zzz", 1), " zzz", "07.01");
});

test("08 - whitespace in front", () => {
  equal(c("  zzz", 1), " zzz", "08.01");
});

test("09 - whitespace in front", () => {
  equal(c("\tzzz", 1), " zzz", "09.01");
});

test("10 - whitespace in front", () => {
  equal(c(" zzz", 2), " zzz", "10.01");
});

test("11 - whitespace in front", () => {
  equal(c("  zzz", 2), " zzz", "11.01");
});

test("12 - whitespace in front", () => {
  equal(c("\tzzz", 2), " zzz", "12.01");
});

test("13 - whitespace in the end", () => {
  equal(c("zzz "), "zzz ", "13.01");
});

test("14 - whitespace in the end", () => {
  equal(c("zzz  "), "zzz ", "14.01");
});

test("15 - whitespace in the end", () => {
  equal(c("z  zz  "), "z  zz ", "15.01");
});

test("16 - whitespace in the end", () => {
  equal(c("zzz  \t"), "zzz ", "16.01");
});

test("17 - whitespace in the end", () => {
  equal(c("z zz\t"), "z zz ", "17.01");
});

test("18 - whitespace in the end", () => {
  equal(c("zzz ", 1), "zzz ", "18.01");
});

test("19 - whitespace in the end", () => {
  equal(c("zzz  ", 1), "zzz ", "19.01");
});

test("20 - whitespace in the end", () => {
  equal(c("z  zz  ", 1), "z  zz ", "20.01");
});

test("21 - whitespace in the end", () => {
  equal(c("zzz  \t", 1), "zzz ", "21.01");
});

test("22 - whitespace in the end", () => {
  equal(c("z zz\t", 1), "z zz ", "22.01");
});

test("23 - whitespace in the end", () => {
  equal(c("zzz ", 2), "zzz ", "23.01");
});

test("24 - whitespace in the end", () => {
  equal(c("zzz  ", 2), "zzz ", "24.01");
});

test("25 - whitespace in the end", () => {
  equal(c("z  zz  ", 2), "z  zz ", "25.01");
});

test("26 - whitespace in the end", () => {
  equal(c("zzz  \t", 2), "zzz ", "26.01");
});

test("27 - whitespace in the end", () => {
  equal(c("z zz\t", 2), "z zz ", "27.01");
});

test("28 - whitespace on both ends", () => {
  equal(c(" zzz "), " zzz ", "28.01");
});

test("29 - whitespace on both ends", () => {
  equal(c("  zzz  "), " zzz ", "29.01");
});

test("30 - whitespace on both ends", () => {
  equal(c("  zzz zzz  "), " zzz zzz ", "30.01");
});

test("31 - whitespace on both ends", () => {
  equal(c("\tzzz zzz  "), " zzz zzz ", "31.01");
});

test("32 - whitespace on both ends", () => {
  equal(c("\tzzz zzz\t"), " zzz zzz ", "32.01");
});

test("33 - whitespace on both ends", () => {
  equal(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t"), " zzz zzz ", "33.01");
});

test("34 - whitespace on both ends", () => {
  equal(c(" zzz ", 1), " zzz ", "34.01");
});

test("35 - whitespace on both ends", () => {
  equal(c("  zzz  ", 1), " zzz ", "35.01");
});

test("36 - whitespace on both ends", () => {
  equal(c("  zzz zzz  ", 1), " zzz zzz ", "36.01");
});

test("37 - whitespace on both ends", () => {
  equal(c("\tzzz zzz  ", 1), " zzz zzz ", "37.01");
});

test("38 - whitespace on both ends", () => {
  equal(c("\tzzz zzz\t", 1), " zzz zzz ", "38.01");
});

test("39 - whitespace on both ends", () => {
  equal(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t", 1), " zzz zzz ", "39.01");
});

test("40 - whitespace on both ends", () => {
  equal(c(" zzz ", 2), " zzz ", "40.01");
});

test("41 - whitespace on both ends", () => {
  equal(c("  zzz  ", 2), " zzz ", "41.01");
});

test("42 - whitespace on both ends", () => {
  equal(c("  zzz zzz  ", 2), " zzz zzz ", "42.01");
});

test("43 - whitespace on both ends", () => {
  equal(c("\tzzz zzz  ", 2), " zzz zzz ", "43.01");
});

test("44 - whitespace on both ends", () => {
  equal(c("\tzzz zzz\t", 2), " zzz zzz ", "44.01");
});

test("45 - whitespace on both ends", () => {
  equal(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t", 2), " zzz zzz ", "45.01");
});

test("46 - whitespace with single line breaks in front, LF", () => {
  equal(c("\nzzz"), "\nzzz", "46.01");
});

test("47 - whitespace with single line breaks in front, CRLF", () => {
  equal(c("\r\nzzz"), "\r\nzzz", "47.01");
});

test("48 - whitespace with single line breaks in front, LF", () => {
  // plain object will get discarded and default value of 1 will be used
  equal(c(" \n zzz", { a: "z" }), "\nzzz", "48.01");
});

test("49 - whitespace with single line breaks in front, CR", () => {
  equal(c(" \r\n zzz"), "\r\nzzz", "49.01");
});

test("50 - whitespace with single line breaks in front, LF", () => {
  equal(c("\t\nzzz"), "\nzzz", "50.01");
});

test("51 - whitespace with single line breaks in front, CR", () => {
  equal(c("\t\r\nzzz"), "\r\nzzz", "51.01");
});

test("52 - whitespace with single line breaks in front, LF", () => {
  equal(c("\nzzz", 0), "zzz", "52.01");
});

test("53 - whitespace with single line breaks in front, CR", () => {
  equal(c("\r\nzzz", 0), "zzz", "53.01");
});

test("54 - whitespace with single line breaks in front, LF", () => {
  equal(c(" \n zzz", 0), "zzz", "54.01");
});

test("55 - whitespace with single line breaks in front, CR", () => {
  equal(c(" \r\n zzz", 0), "zzz", "55.01");
});

test("56 - whitespace with single line breaks in front, LF", () => {
  equal(c("\t\nzzz", 0), "zzz", "56.01");
});

test("57 - whitespace with single line breaks in front, CR", () => {
  equal(c("\t\r\nzzz", 0), "zzz", "57.01");
});

test("58 - whitespace with single line breaks in front, LF", () => {
  equal(c("\nzzz", 1), "\nzzz", "58.01");
});

test("59 - whitespace with single line breaks in front, CR", () => {
  equal(c("\r\nzzz", 1), "\r\nzzz", "59.01");
});

test("60 - whitespace with single line breaks in front, LF", () => {
  equal(c(" \n zzz", 1), "\nzzz", "60.01");
});

test("61 - whitespace with single line breaks in front, CR", () => {
  equal(c(" \r\n zzz", 1), "\r\nzzz", "61.01");
});

test("62 - whitespace with single line breaks in front, LF", () => {
  equal(c("\t\nzzz", 1), "\nzzz", "62.01");
});

test("63 - whitespace with single line breaks in front, CR", () => {
  equal(c("\t\r\nzzz", 1), "\r\nzzz", "63.01");
});

test("64 - whitespace with single line breaks in front", () => {
  equal(c("\nzzz", 2), "\nzzz", "64.01");
});

test("65 - whitespace with single line breaks in front", () => {
  equal(c(" \n zzz", 2), "\nzzz", "65.01");
});

test("66 - whitespace with single line breaks in front", () => {
  equal(c("\t\nzzz", 2), "\nzzz", "66.01");
});

test("67 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\n"), "zzz\n", "67.01");
});

test("68 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\n\n"), "zzz\n", "68.01");
});

test("69 - whitespace with single line breaks in the end", () => {
  equal(c("zzz \n "), "zzz\n", "69.01");
});

test("70 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\t\n"), "zzz\n", "70.01");
});

test("71 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\n", 0), "zzz", "71.01");
});

test("72 - whitespace with single line breaks in the end", () => {
  equal(c("zzz \n ", 0), "zzz", "72.01");
});

test("73 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\t\n", 0), "zzz", "73.01");
});

test("74 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\n", 1), "zzz\n", "74.01");
});

test("75 - whitespace with single line breaks in the end", () => {
  equal(c("zzz \n ", 1), "zzz\n", "75.01");
});

test("76 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\t\n", 1), "zzz\n", "76.01");
});

test("77 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\n", 2), "zzz\n", "77.01");
});

test("78 - whitespace with single line breaks in the end", () => {
  equal(c("zzz \n ", 2), "zzz\n", "78.01");
});

test("79 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\t\n", 2), "zzz\n", "79.01");
});

test("80 - whitespace with single line breaks in the end", () => {
  equal(c("\n\nzzz\n\n"), "\nzzz\n", "80.01");
});

test("81 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n zzz \n \n "), "\nzzz\n", "81.01");
});

test("82 - whitespace with single line breaks in the end", () => {
  equal(c("\n \n \n zzz \n \n \n"), "\nzzz\n", "82.01");
});

test("83 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n \n zzz \n \n \n "), "\nzzz\n", "83.01");
});

test("84 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t"), "\nzzz\n", "84.01");
});

test("85 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t "), "\nzzz\n", "85.01");
});

test("86 - whitespace with single line breaks in the end", () => {
  equal(c("\n\nzzz\n\n", 1), "\nzzz\n", "86.01");
});

test("87 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n zzz \n \n ", 1), "\nzzz\n", "87.01");
});

test("88 - whitespace with single line breaks in the end", () => {
  equal(c("\n \n \n zzz \n \n \n", 1), "\nzzz\n", "88.01");
});

test("89 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n \n zzz \n \n \n ", 1), "\nzzz\n", "89.01");
});

test("90 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t", 1), "\nzzz\n", "90.01");
});

test("91 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t ", 1), "\nzzz\n", "91.01");
});

test("92 - whitespace with single line breaks in the end", () => {
  equal(c("\n\nzzz\n\n", 2), "\n\nzzz\n\n", "92.01");
});

test("93 - whitespace with single line breaks in the end", () => {
  equal(c("\n\nzzz\n", 2), "\n\nzzz\n", "93.01");
});

test("94 - whitespace with single line breaks in the end", () => {
  equal(c("\n\n\nzzz\n", 2), "\n\nzzz\n", "94.01");
});

test("95 - whitespace with single line breaks in the end", () => {
  equal(c("\n \n \n zzz \n \n \n", 2), "\n\nzzz\n\n", "95.01");
});

test("96 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n \n zzz \n \n \n ", 2), "\n\nzzz\n\n", "96.01");
});

test("97 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t", 2), "\n\nzzz\n\n", "97.01");
});

test("98 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t ", 2), "\n\nzzz\n\n", "98.01");
});

test("99 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n zzz \n \n ", 2), "\n\nzzz\n\n", "99.01");
});

test("100 - whitespace with single line breaks in the end", () => {
  equal(c("\n\nzzz\n\n", 3), "\n\nzzz\n\n", "100.01");
});

test("101 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n zzz \n \n ", 3), "\n\nzzz\n\n", "101.01");
});

test("102 - whitespace with single line breaks in the end", () => {
  equal(c("\n \n \n zzz \n \n \n", 3), "\n\n\nzzz\n\n\n", "102.01");
});

test("103 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n \n zzz \n \n \n ", 3), "\n\n\nzzz\n\n\n", "103.01");
});

test("104 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t", 3), "\n\n\nzzz\n\n\n", "104.01");
});

test("105 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t ", 3), "\n\n\nzzz\n\n\n", "105.01");
});

test("106 - whitespace with single line breaks in the end", () => {
  equal(c("\n\nzzz\n\n", 9), "\n\nzzz\n\n", "106.01");
});

test("107 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n zzz \n \n ", 9), "\n\nzzz\n\n", "107.01");
});

test("108 - whitespace with single line breaks in the end", () => {
  equal(c("\n \n \n zzz \n \n \n", 9), "\n\n\nzzz\n\n\n", "108.01");
});

test("109 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n \n zzz \n \n \n ", 9), "\n\n\nzzz\n\n\n", "109.01");
});

test("110 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t", 9), "\n\n\nzzz\n\n\n", "110.01");
});

test("111 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t ", 9), "\n\n\nzzz\n\n\n", "111.01");
});

test("112 - tight tabs", () => {
  equal(c("\n\t\t\t   \t\t\t", 9), "\n", "112.01");
});

test("113 - tight tabs", () => {
  equal(c("\t\t\t   \t\t\t\n", 9), "\n", "113.01");
});

test("114", () => {
  equal(c("\n   \t    ", 9), "\n", "114.01");
});

test("115", () => {
  equal(c("   \t   \n", 9), "\n", "115.01");
});

test("116 - mixed EOL's", () => {
  equal(
    c("\r\n\r\n\n\n zzz \n \n \n \t ", 9),
    "\r\n\r\n\n\nzzz\n\n\n",
    "116.01",
  );
});

test.run();
