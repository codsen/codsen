import tap from "tap";
import c from "../dist/string-collapse-leading-whitespace.esm";

const rawNbsp = "\u00A0";

// -----------------------------------------------------------------------------
// 01. normal use
// -----------------------------------------------------------------------------

tap.test("01 - does nothing to trimmed strings", (t) => {
  t.equal(c("zzz"), "zzz", "01");
  t.end();
});

tap.test("02 - does nothing to trimmed strings", (t) => {
  t.equal(c("zzz", 1), "zzz", "02");
  t.end();
});

tap.test("03 - does nothing to trimmed strings", (t) => {
  t.equal(c("zzz", 2), "zzz", "03");
  t.end();
});

tap.test("04 - whitespace in front", (t) => {
  t.equal(c(" zzz"), " zzz", "04");
  t.end();
});

tap.test("05 - whitespace in front", (t) => {
  t.equal(c("  zzz"), " zzz", "05");
  t.end();
});

tap.test("06 - whitespace in front", (t) => {
  t.equal(c("\tzzz"), " zzz", "06");
  t.end();
});

tap.test("07 - whitespace in front", (t) => {
  t.equal(c(" zzz", 1), " zzz", "07");
  t.end();
});

tap.test("08 - whitespace in front", (t) => {
  t.equal(c("  zzz", 1), " zzz", "08");
  t.end();
});

tap.test("09 - whitespace in front", (t) => {
  t.equal(c("\tzzz", 1), " zzz", "09");
  t.end();
});

tap.test("10 - whitespace in front", (t) => {
  t.equal(c(" zzz", 2), " zzz", "10");
  t.end();
});

tap.test("11 - whitespace in front", (t) => {
  t.equal(c("  zzz", 2), " zzz", "11");
  t.end();
});

tap.test("12 - whitespace in front", (t) => {
  t.equal(c("\tzzz", 2), " zzz", "12");
  t.end();
});

tap.test("13 - whitespace in the end", (t) => {
  t.equal(c("zzz "), "zzz ", "13");
  t.end();
});

tap.test("14 - whitespace in the end", (t) => {
  t.equal(c("zzz  "), "zzz ", "14");
  t.end();
});

tap.test("15 - whitespace in the end", (t) => {
  t.equal(c("z  zz  "), "z  zz ", "15");
  t.end();
});

tap.test("16 - whitespace in the end", (t) => {
  t.equal(c("zzz  \t"), "zzz ", "16");
  t.end();
});

tap.test("17 - whitespace in the end", (t) => {
  t.equal(c("z zz\t"), "z zz ", "17");
  t.end();
});

tap.test("18 - whitespace in the end", (t) => {
  t.equal(c("zzz ", 1), "zzz ", "18");
  t.end();
});

tap.test("19 - whitespace in the end", (t) => {
  t.equal(c("zzz  ", 1), "zzz ", "19");
  t.end();
});

tap.test("20 - whitespace in the end", (t) => {
  t.equal(c("z  zz  ", 1), "z  zz ", "20");
  t.end();
});

tap.test("21 - whitespace in the end", (t) => {
  t.equal(c("zzz  \t", 1), "zzz ", "21");
  t.end();
});

tap.test("22 - whitespace in the end", (t) => {
  t.equal(c("z zz\t", 1), "z zz ", "22");
  t.end();
});

tap.test("23 - whitespace in the end", (t) => {
  t.equal(c("zzz ", 2), "zzz ", "23");
  t.end();
});

tap.test("24 - whitespace in the end", (t) => {
  t.equal(c("zzz  ", 2), "zzz ", "24");
  t.end();
});

tap.test("25 - whitespace in the end", (t) => {
  t.equal(c("z  zz  ", 2), "z  zz ", "25");
  t.end();
});

tap.test("26 - whitespace in the end", (t) => {
  t.equal(c("zzz  \t", 2), "zzz ", "26");
  t.end();
});

tap.test("27 - whitespace in the end", (t) => {
  t.equal(c("z zz\t", 2), "z zz ", "27");
  t.end();
});

tap.test("28 - whitespace on both ends", (t) => {
  t.equal(c(" zzz "), " zzz ", "28");
  t.end();
});

tap.test("29 - whitespace on both ends", (t) => {
  t.equal(c("  zzz  "), " zzz ", "29");
  t.end();
});

tap.test("30 - whitespace on both ends", (t) => {
  t.equal(c("  zzz zzz  "), " zzz zzz ", "30");
  t.end();
});

tap.test("31 - whitespace on both ends", (t) => {
  t.equal(c("\tzzz zzz  "), " zzz zzz ", "31");
  t.end();
});

tap.test("32 - whitespace on both ends", (t) => {
  t.equal(c("\tzzz zzz\t"), " zzz zzz ", "32");
  t.end();
});

tap.test("33 - whitespace on both ends", (t) => {
  t.equal(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t"), " zzz zzz ", "33");
  t.end();
});

tap.test("34 - whitespace on both ends", (t) => {
  t.equal(c(" zzz ", 1), " zzz ", "34");
  t.end();
});

tap.test("35 - whitespace on both ends", (t) => {
  t.equal(c("  zzz  ", 1), " zzz ", "35");
  t.end();
});

tap.test("36 - whitespace on both ends", (t) => {
  t.equal(c("  zzz zzz  ", 1), " zzz zzz ", "36");
  t.end();
});

tap.test("37 - whitespace on both ends", (t) => {
  t.equal(c("\tzzz zzz  ", 1), " zzz zzz ", "37");
  t.end();
});

tap.test("38 - whitespace on both ends", (t) => {
  t.equal(c("\tzzz zzz\t", 1), " zzz zzz ", "38");
  t.end();
});

tap.test("39 - whitespace on both ends", (t) => {
  t.equal(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t", 1), " zzz zzz ", "39");
  t.end();
});

tap.test("40 - whitespace on both ends", (t) => {
  t.equal(c(" zzz ", 2), " zzz ", "40");
  t.end();
});

tap.test("41 - whitespace on both ends", (t) => {
  t.equal(c("  zzz  ", 2), " zzz ", "41");
  t.end();
});

tap.test("42 - whitespace on both ends", (t) => {
  t.equal(c("  zzz zzz  ", 2), " zzz zzz ", "42");
  t.end();
});

tap.test("43 - whitespace on both ends", (t) => {
  t.equal(c("\tzzz zzz  ", 2), " zzz zzz ", "43");
  t.end();
});

tap.test("44 - whitespace on both ends", (t) => {
  t.equal(c("\tzzz zzz\t", 2), " zzz zzz ", "44");
  t.end();
});

tap.test("45 - whitespace on both ends", (t) => {
  t.equal(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t", 2), " zzz zzz ", "45");
  t.end();
});

tap.test("46 - whitespace with single line breaks in front", (t) => {
  t.equal(c("\nzzz"), "\nzzz", "46");
  t.end();
});

tap.test("47 - whitespace with single line breaks in front", (t) => {
  t.equal(c(" \n zzz"), "\nzzz", "47");
  t.end();
});

tap.test("48 - whitespace with single line breaks in front", (t) => {
  t.equal(c("\t\nzzz"), "\nzzz", "48");
  t.end();
});

tap.test("49 - whitespace with single line breaks in front", (t) => {
  t.equal(c("\nzzz", 0), "\nzzz", "49");
  t.end();
});

tap.test("50 - whitespace with single line breaks in front", (t) => {
  t.equal(c(" \n zzz", 0), "\nzzz", "50");
  t.end();
});

tap.test("51 - whitespace with single line breaks in front", (t) => {
  t.equal(c("\t\nzzz", 0), "\nzzz", "51");
  t.end();
});

tap.test("52 - whitespace with single line breaks in front", (t) => {
  t.equal(c("\nzzz", 1), "\nzzz", "52");
  t.end();
});

tap.test("53 - whitespace with single line breaks in front", (t) => {
  t.equal(c(" \n zzz", 1), "\nzzz", "53");
  t.end();
});

tap.test("54 - whitespace with single line breaks in front", (t) => {
  t.equal(c("\t\nzzz", 1), "\nzzz", "54");
  t.end();
});

tap.test("55 - whitespace with single line breaks in front", (t) => {
  t.equal(c("\nzzz", 2), "\nzzz", "55");
  t.end();
});

tap.test("56 - whitespace with single line breaks in front", (t) => {
  t.equal(c(" \n zzz", 2), "\nzzz", "56");
  t.end();
});

tap.test("57 - whitespace with single line breaks in front", (t) => {
  t.equal(c("\t\nzzz", 2), "\nzzz", "57");
  t.end();
});

tap.test("58 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz\n"), "zzz\n", "58");
  t.end();
});

tap.test("59 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz \n "), "zzz\n", "59");
  t.end();
});

tap.test("60 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz\t\n"), "zzz\n", "60");
  t.end();
});

tap.test("61 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz\n", 0), "zzz\n", "61");
  t.end();
});

tap.test("62 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz \n ", 0), "zzz\n", "62");
  t.end();
});

tap.test("63 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz\t\n", 0), "zzz\n", "63");
  t.end();
});

tap.test("64 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz\n", 1), "zzz\n", "64");
  t.end();
});

tap.test("65 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz \n ", 1), "zzz\n", "65");
  t.end();
});

tap.test("66 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz\t\n", 1), "zzz\n", "66");
  t.end();
});

tap.test("67 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz\n", 2), "zzz\n", "67");
  t.end();
});

tap.test("68 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz \n ", 2), "zzz\n", "68");
  t.end();
});

tap.test("69 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("zzz\t\n", 2), "zzz\n", "69");
  t.end();
});

tap.test("70 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n\nzzz\n\n"), "\nzzz\n", "70");
  t.end();
});

tap.test("71 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \n zzz \n \n "), "\nzzz\n", "71");
  t.end();
});

tap.test("72 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n \n \n zzz \n \n \n"), "\nzzz\n", "72");
  t.end();
});

tap.test("73 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \n \n zzz \n \n \n "), "\nzzz\n", "73");
  t.end();
});

tap.test("74 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \t\n \n zzz \n \n \n \t"), "\nzzz\n", "74");
  t.end();
});

tap.test("75 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \t\n \n zzz \n \n \n \t "), "\nzzz\n", "75");
  t.end();
});

tap.test("76 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n\nzzz\n\n", 1), "\nzzz\n", "76");
  t.end();
});

tap.test("77 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \n zzz \n \n ", 1), "\nzzz\n", "77");
  t.end();
});

tap.test("78 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n \n \n zzz \n \n \n", 1), "\nzzz\n", "78");
  t.end();
});

tap.test("79 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \n \n zzz \n \n \n ", 1), "\nzzz\n", "79");
  t.end();
});

tap.test("80 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \t\n \n zzz \n \n \n \t", 1), "\nzzz\n", "80");
  t.end();
});

tap.test("81 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \t\n \n zzz \n \n \n \t ", 1), "\nzzz\n", "81");
  t.end();
});

tap.test("82 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n\nzzz\n\n", 2), "\n\nzzz\n\n", "82");
  t.end();
});

tap.test("83 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n\nzzz\n", 2), "\n\nzzz\n", "83");
  t.end();
});

tap.test("84 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n\n\nzzz\n", 2), "\n\nzzz\n", "84");
  t.end();
});

tap.test("85 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n \n \n zzz \n \n \n", 2), "\n\nzzz\n\n", "85");
  t.end();
});

tap.test("86 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \n \n zzz \n \n \n ", 2), "\n\nzzz\n\n", "86");
  t.end();
});

tap.test("87 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \t\n \n zzz \n \n \n \t", 2), "\n\nzzz\n\n", "87");
  t.end();
});

tap.test("88 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \t\n \n zzz \n \n \n \t ", 2), "\n\nzzz\n\n", "88");
  t.end();
});

tap.test("89 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \n zzz \n \n ", 2), "\n\nzzz\n\n", "89");
  t.end();
});

tap.test("90 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n\nzzz\n\n", 3), "\n\nzzz\n\n", "90");
  t.end();
});

tap.test("91 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \n zzz \n \n ", 3), "\n\nzzz\n\n", "91");
  t.end();
});

tap.test("92 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n \n \n zzz \n \n \n", 3), "\n\n\nzzz\n\n\n", "92");
  t.end();
});

tap.test("93 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \n \n zzz \n \n \n ", 3), "\n\n\nzzz\n\n\n", "93");
  t.end();
});

tap.test("94 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \t\n \n zzz \n \n \n \t", 3), "\n\n\nzzz\n\n\n", "94");
  t.end();
});

tap.test("95 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \t\n \n zzz \n \n \n \t ", 3), "\n\n\nzzz\n\n\n", "95");
  t.end();
});

tap.test("96 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n\nzzz\n\n", 9), "\n\nzzz\n\n", "96");
  t.end();
});

tap.test("97 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \n zzz \n \n ", 9), "\n\nzzz\n\n", "97");
  t.end();
});

tap.test("98 - whitespace with single line breaks in the end", (t) => {
  t.equal(c("\n \n \n zzz \n \n \n", 9), "\n\n\nzzz\n\n\n", "98");
  t.end();
});

tap.test("99 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \n \n zzz \n \n \n ", 9), "\n\n\nzzz\n\n\n", "99");
  t.end();
});

tap.test("100 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \t\n \n zzz \n \n \n \t", 9), "\n\n\nzzz\n\n\n", "100");
  t.end();
});

tap.test("101 - whitespace with single line breaks in the end", (t) => {
  t.equal(c(" \n \t\n \n zzz \n \n \n \t ", 9), "\n\n\nzzz\n\n\n", "101");
  t.end();
});

// -----------------------------------------------------------------------------
// 02. quick ends
// -----------------------------------------------------------------------------

tap.test("102 - empty input", (t) => {
  t.equal(c(""), "", "102");
  t.end();
});

tap.test("103 - all whitespace", (t) => {
  t.equal(c("    "), " ", "103");
  t.end();
});

tap.test("104 - all whitespace", (t) => {
  t.equal(c("\t"), " ", "104");
  t.end();
});

tap.test("105 - all whitespace", (t) => {
  t.equal(c("    ", 1), " ", "105");
  t.end();
});

tap.test("106 - all whitespace", (t) => {
  t.equal(c("\t", 1), " ", "106");
  t.end();
});

tap.test("107 - all whitespace", (t) => {
  t.equal(c("    ", 2), " ", "107");
  t.end();
});

tap.test("108 - all whitespace", (t) => {
  t.equal(c("\t", 2), " ", "108");
  t.end();
});

tap.test("109 - all whitespace", (t) => {
  t.equal(c("  \n\n  "), "\n", "109");
  t.end();
});

tap.test("110 - all whitespace", (t) => {
  t.equal(c("  \n\n  ", 1), "\n", "110");
  t.end();
});

tap.test("111 - all whitespace", (t) => {
  t.equal(c("  \n\n  ", 2), "\n\n", "111");
  t.end();
});

tap.test("112 - all whitespace", (t) => {
  t.equal(c("  \n\n  ", 9), "\n\n", "112");
  t.end();
});

tap.test("113 - all whitespace", (t) => {
  t.equal(c("\n"), "\n", "113");
  t.end();
});

tap.test("114 - all whitespace", (t) => {
  t.equal(c("\n", 1), "\n", "114");
  t.end();
});

tap.test("115 - all whitespace", (t) => {
  t.equal(c("\n", 2), "\n", "115");
  t.end();
});

tap.test("116 - all whitespace", (t) => {
  t.equal(c("\n\n", 2), "\n\n", "116");
  t.end();
});

tap.test("117 - all whitespace", (t) => {
  t.equal(c("\n\n", 3), "\n\n", "117");
  t.end();
});

tap.test("118 - all whitespace", (t) => {
  t.equal(c("\n \n\n\n", 5), "\n\n\n\n", "118");
  t.end();
});

tap.test("119 - not a string input", (t) => {
  t.equal(c(1), 1, "119");
  t.end();
});

tap.test("120 - not a string input", (t) => {
  t.equal(c(1, 1), 1, "120");
  t.end();
});

tap.test("121 - not a string input", (t) => {
  t.equal(c(1, 2), 1, "121");
  t.end();
});

tap.test("122 - not a string input", (t) => {
  t.equal(c(1, "zz"), 1, "122");
  t.end();
});

// -----------------------------------------------------------------------------
// 03. nbsp
// -----------------------------------------------------------------------------

tap.test("123 - nbsp - left side - blank", (t) => {
  t.equal(c(`${rawNbsp}zzz`), `${rawNbsp}zzz`, "123");
  t.end();
});

tap.test("124 - nbsp - left side - space + nbsp", (t) => {
  t.equal(c(` ${rawNbsp}zzz`), `${rawNbsp}zzz`, "124");
  t.end();
});

tap.test("125 - nbsp - left side - two spaces", (t) => {
  t.equal(c(`  ${rawNbsp}zzz`), `${rawNbsp}zzz`, "125");
  t.end();
});

tap.test("126 - nbsp - left side - nbsp + space", (t) => {
  t.equal(c(`${rawNbsp} zzz`), `${rawNbsp} zzz`, "126");
  t.end();
});

tap.test("127 - nbsp - left side - nbsp + two spaces", (t) => {
  t.equal(c(`${rawNbsp}  zzz`), `${rawNbsp} zzz`, "127");
  t.end();
});

tap.test("128 - nbsp - left side - eol + nbsp", (t) => {
  t.equal(c(`\n${rawNbsp}zzz`), `\n${rawNbsp}zzz`, "128");
  t.end();
});

tap.test("129 - nbsp - left side - nbsp + eol", (t) => {
  t.equal(c(`${rawNbsp}\nzzz`), `${rawNbsp}\nzzz`, "129");
  t.end();
});

tap.test("130 - nbsp - left side - multiple eols", (t) => {
  t.equal(c(`\n\n${rawNbsp}\nzzz`, 3), `\n\n${rawNbsp}\nzzz`, "130");
  t.end();
});

tap.test("131 - nbsp - left side - multiple spaced eols", (t) => {
  t.equal(c(`  \n \n   ${rawNbsp}\nzzz`, 3), `\n\n${rawNbsp}\nzzz`, "131");
  t.end();
});

tap.test("132 - nbsp - right side - blank", (t) => {
  t.equal(c(`zzz${rawNbsp}`), `zzz${rawNbsp}`, "132");
  t.end();
});

tap.test("133 - nbsp - right side - nbsp + space", (t) => {
  t.equal(c(`zzz${rawNbsp} `), `zzz${rawNbsp}`, "133");
  t.end();
});

tap.test("134 - nbsp - right side - nbsp + two spaces", (t) => {
  t.equal(c(`zzz${rawNbsp}  `), `zzz${rawNbsp}`, "134");
  t.end();
});

tap.test("135 - nbsp - right side - space + nbsp", (t) => {
  t.equal(c(`zzz ${rawNbsp}`), `zzz ${rawNbsp}`, "135");
  t.end();
});

tap.test("136 - nbsp - right side - two spaces + nbsp", (t) => {
  t.equal(c(`zzz  ${rawNbsp}`), `zzz ${rawNbsp}`, "136");
  t.end();
});

tap.test("137 - nbsp - right side - nbsp + eol", (t) => {
  t.equal(c(`zzz${rawNbsp}\n`), `zzz${rawNbsp}\n`, "137");
  t.end();
});

tap.test("138 - nbsp - right side - eol + nbsp", (t) => {
  t.equal(c(`zzz\n${rawNbsp}`), `zzz\n${rawNbsp}`, "138");
  t.end();
});

tap.test("139 - nbsp - right side - mulitple eols", (t) => {
  t.equal(c(`zzz\n${rawNbsp}\n\n`, 3), `zzz\n${rawNbsp}\n\n`, "139");
  t.end();
});

tap.test("140 - nbsp - right side - multiple spaced eols", (t) => {
  t.equal(c(`zzz\n${rawNbsp}  \n \n   `, 3), `zzz\n${rawNbsp}\n\n`, "140");
  t.end();
});
