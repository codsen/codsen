// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { collWhitespace as c } from "../dist/string-collapse-leading-whitespace.esm.js";

test("001 - does nothing to trimmed strings", () => {
  equal(c("zzz"), "zzz", "001.01");
});

test("002 - does nothing to trimmed strings", () => {
  equal(c("zzz", 1), "zzz", "002.01");
});

test("003 - does nothing to trimmed strings", () => {
  equal(c("zzz", 2), "zzz", "003.01");
});

test("004 - whitespace in front", () => {
  equal(c(" zzz"), " zzz", "004.01");
});

test("005 - whitespace in front", () => {
  equal(c("  zzz"), " zzz", "005.01");
});

test("006 - whitespace in front", () => {
  equal(c("\tzzz"), " zzz", "006.01");
});

test("007 - whitespace in front", () => {
  equal(c(" zzz", 1), " zzz", "007.01");
});

test("008 - whitespace in front", () => {
  equal(c("  zzz", 1), " zzz", "008.01");
});

test("009 - whitespace in front", () => {
  equal(c("\tzzz", 1), " zzz", "009.01");
});

test("010 - whitespace in front", () => {
  equal(c(" zzz", 2), " zzz", "010.01");
});

test("011 - whitespace in front", () => {
  equal(c("  zzz", 2), " zzz", "011.01");
});

test("012 - whitespace in front", () => {
  equal(c("\tzzz", 2), " zzz", "012.01");
});

test("013 - whitespace in the end", () => {
  equal(c("zzz "), "zzz ", "013.01");
});

test("014 - whitespace in the end", () => {
  equal(c("zzz  "), "zzz ", "014.01");
});

test("015 - whitespace in the end", () => {
  equal(c("z  zz  "), "z  zz ", "015.01");
});

test("016 - whitespace in the end", () => {
  equal(c("zzz  \t"), "zzz ", "016.01");
});

test("017 - whitespace in the end", () => {
  equal(c("z zz\t"), "z zz ", "017.01");
});

test("018 - whitespace in the end", () => {
  equal(c("zzz ", 1), "zzz ", "018.01");
});

test("019 - whitespace in the end", () => {
  equal(c("zzz  ", 1), "zzz ", "019.01");
});

test("020 - whitespace in the end", () => {
  equal(c("z  zz  ", 1), "z  zz ", "020.01");
});

test("021 - whitespace in the end", () => {
  equal(c("zzz  \t", 1), "zzz ", "021.01");
});

test("022 - whitespace in the end", () => {
  equal(c("z zz\t", 1), "z zz ", "022.01");
});

test("023 - whitespace in the end", () => {
  equal(c("zzz ", 2), "zzz ", "023.01");
});

test("024 - whitespace in the end", () => {
  equal(c("zzz  ", 2), "zzz ", "024.01");
});

test("025 - whitespace in the end", () => {
  equal(c("z  zz  ", 2), "z  zz ", "025.01");
});

test("026 - whitespace in the end", () => {
  equal(c("zzz  \t", 2), "zzz ", "026.01");
});

test("027 - whitespace in the end", () => {
  equal(c("z zz\t", 2), "z zz ", "027.01");
});

test("028 - whitespace on both ends", () => {
  equal(c(" zzz "), " zzz ", "028.01");
});

test("029 - whitespace on both ends", () => {
  equal(c("  zzz  "), " zzz ", "029.01");
});

test("030 - whitespace on both ends", () => {
  equal(c("  zzz zzz  "), " zzz zzz ", "030.01");
});

test("031 - whitespace on both ends", () => {
  equal(c("\tzzz zzz  "), " zzz zzz ", "031.01");
});

test("032 - whitespace on both ends", () => {
  equal(c("\tzzz zzz\t"), " zzz zzz ", "032.01");
});

test("033 - whitespace on both ends", () => {
  equal(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t"), " zzz zzz ", "033.01");
});

test("034 - whitespace on both ends", () => {
  equal(c(" zzz ", 1), " zzz ", "034.01");
});

test("035 - whitespace on both ends", () => {
  equal(c("  zzz  ", 1), " zzz ", "035.01");
});

test("036 - whitespace on both ends", () => {
  equal(c("  zzz zzz  ", 1), " zzz zzz ", "036.01");
});

test("037 - whitespace on both ends", () => {
  equal(c("\tzzz zzz  ", 1), " zzz zzz ", "037.01");
});

test("038 - whitespace on both ends", () => {
  equal(c("\tzzz zzz\t", 1), " zzz zzz ", "038.01");
});

test("039 - whitespace on both ends", () => {
  equal(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t", 1), " zzz zzz ", "039.01");
});

test("040 - whitespace on both ends", () => {
  equal(c(" zzz ", 2), " zzz ", "040.01");
});

test("041 - whitespace on both ends", () => {
  equal(c("  zzz  ", 2), " zzz ", "041.01");
});

test("042 - whitespace on both ends", () => {
  equal(c("  zzz zzz  ", 2), " zzz zzz ", "042.01");
});

test("043 - whitespace on both ends", () => {
  equal(c("\tzzz zzz  ", 2), " zzz zzz ", "043.01");
});

test("044 - whitespace on both ends", () => {
  equal(c("\tzzz zzz\t", 2), " zzz zzz ", "044.01");
});

test("045 - whitespace on both ends", () => {
  equal(c("\t\t\t\t\t     zzz zzz\t      \t\t\t\t", 2), " zzz zzz ", "045.01");
});

test("046 - whitespace with single line breaks in front, LF", () => {
  equal(c("\nzzz"), "\nzzz", "046.01");
});

test("047 - whitespace with single line breaks in front, CRLF", () => {
  equal(c("\r\nzzz"), "\r\nzzz", "047.01");
});

test("048 - whitespace with single line breaks in front, LF", () => {
  // plain object will get discarded and default value of 1 will be used
  equal(c(" \n zzz", { a: "z" }), "\nzzz", "048.01");
});

test("049 - whitespace with single line breaks in front, CR", () => {
  equal(c(" \r\n zzz"), "\r\nzzz", "049.01");
});

test("050 - whitespace with single line breaks in front, LF", () => {
  equal(c("\t\nzzz"), "\nzzz", "050.01");
});

test("051 - whitespace with single line breaks in front, CR", () => {
  equal(c("\t\r\nzzz"), "\r\nzzz", "051.01");
});

test("052 - whitespace with single line breaks in front, LF", () => {
  equal(c("\nzzz", 0), "zzz", "052.01");
});

test("053 - whitespace with single line breaks in front, CR", () => {
  equal(c("\r\nzzz", 0), "zzz", "053.01");
});

test("054 - whitespace with single line breaks in front, LF", () => {
  equal(c(" \n zzz", 0), "zzz", "054.01");
});

test("055 - whitespace with single line breaks in front, CR", () => {
  equal(c(" \r\n zzz", 0), "zzz", "055.01");
});

test("056 - whitespace with single line breaks in front, LF", () => {
  equal(c("\t\nzzz", 0), "zzz", "056.01");
});

test("057 - whitespace with single line breaks in front, CR", () => {
  equal(c("\t\r\nzzz", 0), "zzz", "057.01");
});

test("058 - whitespace with single line breaks in front, LF", () => {
  equal(c("\nzzz", 1), "\nzzz", "058.01");
});

test("059 - whitespace with single line breaks in front, CR", () => {
  equal(c("\r\nzzz", 1), "\r\nzzz", "059.01");
});

test("060 - whitespace with single line breaks in front, LF", () => {
  equal(c(" \n zzz", 1), "\nzzz", "060.01");
});

test("061 - whitespace with single line breaks in front, CR", () => {
  equal(c(" \r\n zzz", 1), "\r\nzzz", "061.01");
});

test("062 - whitespace with single line breaks in front, LF", () => {
  equal(c("\t\nzzz", 1), "\nzzz", "062.01");
});

test("063 - whitespace with single line breaks in front, CR", () => {
  equal(c("\t\r\nzzz", 1), "\r\nzzz", "063.01");
});

test("064 - whitespace with single line breaks in front", () => {
  equal(c("\nzzz", 2), "\nzzz", "064.01");
});

test("065 - whitespace with single line breaks in front", () => {
  equal(c(" \n zzz", 2), "\nzzz", "065.01");
});

test("066 - whitespace with single line breaks in front", () => {
  equal(c("\t\nzzz", 2), "\nzzz", "066.01");
});

test("067 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\n"), "zzz\n", "067.01");
});

test("068 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\n\n"), "zzz\n", "068.01");
});

test("069 - whitespace with single line breaks in the end", () => {
  equal(c("zzz \n "), "zzz\n", "069.01");
});

test("070 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\t\n"), "zzz\n", "070.01");
});

test("071 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\n", 0), "zzz", "071.01");
});

test("072 - whitespace with single line breaks in the end", () => {
  equal(c("zzz \n ", 0), "zzz", "072.01");
});

test("073 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\t\n", 0), "zzz", "073.01");
});

test("074 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\n", 1), "zzz\n", "074.01");
});

test("075 - whitespace with single line breaks in the end", () => {
  equal(c("zzz \n ", 1), "zzz\n", "075.01");
});

test("076 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\t\n", 1), "zzz\n", "076.01");
});

test("077 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\n", 2), "zzz\n", "077.01");
});

test("078 - whitespace with single line breaks in the end", () => {
  equal(c("zzz \n ", 2), "zzz\n", "078.01");
});

test("079 - whitespace with single line breaks in the end", () => {
  equal(c("zzz\t\n", 2), "zzz\n", "079.01");
});

test("080 - whitespace with single line breaks in the end", () => {
  equal(c("\n\nzzz\n\n"), "\nzzz\n", "080.01");
});

test("081 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n zzz \n \n "), "\nzzz\n", "081.01");
});

test("082 - whitespace with single line breaks in the end", () => {
  equal(c("\n \n \n zzz \n \n \n"), "\nzzz\n", "082.01");
});

test("083 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n \n zzz \n \n \n "), "\nzzz\n", "083.01");
});

test("084 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t"), "\nzzz\n", "084.01");
});

test("085 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t "), "\nzzz\n", "085.01");
});

test("086 - whitespace with single line breaks in the end", () => {
  equal(c("\n\nzzz\n\n", 1), "\nzzz\n", "086.01");
});

test("087 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n zzz \n \n ", 1), "\nzzz\n", "087.01");
});

test("088 - whitespace with single line breaks in the end", () => {
  equal(c("\n \n \n zzz \n \n \n", 1), "\nzzz\n", "088.01");
});

test("089 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n \n zzz \n \n \n ", 1), "\nzzz\n", "089.01");
});

test("090 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t", 1), "\nzzz\n", "090.01");
});

test("091 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t ", 1), "\nzzz\n", "091.01");
});

test("092 - whitespace with single line breaks in the end", () => {
  equal(c("\n\nzzz\n\n", 2), "\n\nzzz\n\n", "092.01");
});

test("093 - whitespace with single line breaks in the end", () => {
  equal(c("\n\nzzz\n", 2), "\n\nzzz\n", "093.01");
});

test("094 - whitespace with single line breaks in the end", () => {
  equal(c("\n\n\nzzz\n", 2), "\n\nzzz\n", "094.01");
});

test("095 - whitespace with single line breaks in the end", () => {
  equal(c("\n \n \n zzz \n \n \n", 2), "\n\nzzz\n\n", "095.01");
});

test("096 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n \n zzz \n \n \n ", 2), "\n\nzzz\n\n", "096.01");
});

test("097 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t", 2), "\n\nzzz\n\n", "097.01");
});

test("098 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \t\n \n zzz \n \n \n \t ", 2), "\n\nzzz\n\n", "098.01");
});

test("099 - whitespace with single line breaks in the end", () => {
  equal(c(" \n \n zzz \n \n ", 2), "\n\nzzz\n\n", "099.01");
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
