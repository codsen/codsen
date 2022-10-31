import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// minimal
// -----------------------------------------------------------------------------

// tight

test("01 - minimal - inline opening - tight", () => {
  equal(stripHtml("a<b>c").result, "ac", "01.01");
});

test("02 - minimal - block opening - tight", () => {
  equal(stripHtml("a<div>b").result, "a b", "02.01");
});

test("03 - minimal - inline closing - tight", () => {
  equal(stripHtml("a</b>c").result, "ac", "03.01");
});

test("04 - minimal - block closing - tight", () => {
  equal(stripHtml("a</div>b").result, "a b", "04.01");
});

// one space in front

test("05 - minimal - inline opening - one space in front", () => {
  equal(stripHtml("a <b>c").result, "a c", "05.01");
});

test("06 - minimal - block opening - one space in front", () => {
  equal(stripHtml("a <div>b").result, "a b", "06.01");
});

test("07 - minimal - inline closing - one space in front", () => {
  equal(stripHtml("a </b>c").result, "a c", "07.01");
});

test("08 - minimal - block closing - one space in front", () => {
  equal(stripHtml("a </div>b").result, "a b", "08.01");
});

// one space in after

test("09 - minimal - inline opening - one space in after", () => {
  equal(stripHtml("a<b> c").result, "a c", "09.01");
});

test("10 - minimal - block opening - one space in after", () => {
  equal(stripHtml("a<div> b").result, "a b", "10.01");
});

test("11 - minimal - inline closing - one space in after", () => {
  equal(stripHtml("a</b> c").result, "a c", "11.01");
});

test("12 - minimal - block closing - one space in after", () => {
  equal(stripHtml("a</div> b").result, "a b", "12.01");
});

// spaced

test("13 - minimal - inline opening - spaced", () => {
  equal(stripHtml("a <b> c").result, "a c", "13.01");
});

test("14 - minimal - block opening - spaced", () => {
  equal(stripHtml("a <div> b").result, "a b", "14.01");
});

test("15 - minimal - inline closing - spaced", () => {
  equal(stripHtml("a </b> c").result, "a c", "15.01");
});

test("16 - minimal - block closing - spaced", () => {
  equal(stripHtml("a </div> b").result, "a b", "16.01");
});

// two spaces in front

test("17 - minimal - inline opening - two spaces in front", () => {
  equal(stripHtml("a  <b>c").result, "a c", "17.01");
});

test("18 - minimal - block opening - two spaces in front", () => {
  equal(stripHtml("a  <div>b").result, "a b", "18.01");
});

test("19 - minimal - inline closing - two spaces in front", () => {
  equal(stripHtml("a  </b>c").result, "a c", "19.01");
});

test("20 - minimal - block closing - two spaces in front", () => {
  equal(stripHtml("a  </div>b").result, "a b", "20.01");
});

// two spaces in after

test("21 - minimal - inline opening - one space in after", () => {
  equal(stripHtml("a<b>  c").result, "a c", "21.01");
});

test("22 - minimal - block opening - one space in after", () => {
  equal(stripHtml("a<div>  b").result, "a b", "22.01");
});

test("23 - minimal - inline closing - one space in after", () => {
  equal(stripHtml("a</b>  c").result, "a c", "23.01");
});

test("24 - minimal - block closing - one space in after", () => {
  equal(stripHtml("a</div>  b").result, "a b", "24.01");
});

// copiously spaced

test("25 - minimal - inline opening - spaced", () => {
  equal(stripHtml("a  <b>  c").result, "a c", "25.01");
});

test("26 - minimal - block opening - spaced", () => {
  equal(stripHtml("a  <div>  b").result, "a b", "26.01");
});

test("27 - minimal - inline closing - spaced", () => {
  equal(stripHtml("a  </b>  c").result, "a c", "27.01");
});

test("28 - minimal - block closing - spaced", () => {
  equal(stripHtml("a  </div>  b").result, "a b", "28.01");
});

// foo + bold bar
// -----------------------------------------------------------------------------

test("29 - block - inline - tight", () => {
  equal(stripHtml("<div>foo<b>bar</b></div>").result, "foobar", "29.01");
});

test("30 - block - inline - space in front", () => {
  equal(stripHtml("<div>foo <b>bar</b></div>").result, "foo bar", "30.01");
});

test("31 - block - inline - space in front", () => {
  equal(stripHtml("<div>foo\n<b>bar</b></div>").result, "foo\nbar", "31.01");
});

test("32 - block - inline - space after", () => {
  equal(stripHtml("<div>foo<b>bar</b> </div>").result, "foobar", "32.01");
});

test("33 - block - inline - space after", () => {
  equal(stripHtml("<div>foo<b>bar</b>\n</div>").result, "foobar", "33.01");
});

test("34 - block - inline - spaced all around - mini", () => {
  equal(stripHtml("<div>foo <b>bar</b> </div>").result, "foo bar", "34.01");
});

test("35 - block - inline - spaced all around - mini", () => {
  equal(stripHtml("<div>foo\n<b>bar</b>\n</div>").result, "foo\nbar", "35.01");
});

test("36 - block - inline - spaced all around - more realistic", () => {
  equal(
    stripHtml(
      '\n\n<div class="xy yx zy" style="color:red!important;">\n\n\n  foo\n  <b class="xy">\n\n    bar\n  </b>\n\n\n</div>\n\n'
    ).result,
    "foo\n\nbar",
    "36.01"
  );
});

// bold foo + bar
// -----------------------------------------------------------------------------

test("37 - block - inline - tight", () => {
  equal(stripHtml("<div><b>foo</b>bar</div>").result, "foobar", "37.01");
});

test("38 - block - inline - space in front", () => {
  equal(stripHtml("<div> <b>foo</b>bar</div>").result, "foobar", "38.01");
});

test("39 - block - inline - space in front", () => {
  equal(stripHtml("<div>\n<b>foo</b>bar</div>").result, "foobar", "39.01");
});

test("40 - block - inline - space after", () => {
  equal(stripHtml("<div><b>foo</b> bar</div>").result, "foo bar", "40.01");
});

test("41 - block - inline - space after", () => {
  equal(stripHtml("<div><b>foo</b>\nbar</div>").result, "foo\nbar", "41.01");
});

test("42 - block - inline - spaced all around - mini", () => {
  equal(stripHtml("<div> <b>foo</b> bar</div>").result, "foo bar", "42.01");
});

test("43 - block - inline - spaced all around - mini", () => {
  equal(stripHtml("<div>\n<b>foo</b>\nbar</div>").result, "foo\nbar", "43.01");
});

test("44 - block - inline - spaced all around - more realistic", () => {
  equal(
    stripHtml(
      '\n  <div class="xy yx zy" style="color:red!important;">\n\n   <b class="xy">    \n\n       foo\n\n   </b>\n   bar\n    </div>\n\n\n'
    ).result,
    "foo\n\nbar",
    "44.01"
  );
});

// -----------------------------------------------------------------------------

test("45 - space in front of inline tag, front-of string", () => {
  equal(stripHtml(" <b>foo—<b>bar</b></b>").result, "foo—bar", "45.01");
});

test("46 - LF in front of inline tag, front-of string", () => {
  equal(stripHtml("\n<b>foo—<b>bar</b></b>").result, "foo—bar", "46.01");
});

test("47 - space in front, mixed", () => {
  equal(stripHtml(" <b>foo—<div>bar</div></b>").result, "foo— bar", "47.01");
});

test("48 - LF in front, mixed", () => {
  equal(stripHtml("\n<b>foo—<div>bar</div></b>").result, "foo— bar", "48.01");
});

test("49 - space in front of block tag, front-of string", () => {
  equal(
    stripHtml(" <div>foo—<div>bar</div></div>").result,
    "foo— bar",
    "49.01"
  );
});

test("50 - LF in front of block tag, front-of string", () => {
  equal(
    stripHtml("\n<div>foo—<div>bar</div></div>").result,
    "foo— bar",
    "50.01"
  );
});

// -----------------------------------------------------------------------------

test("51 - two inline closing only - tight", () => {
  equal(stripHtml("a</b></b>b").result, "ab", "51.01");
});

test("52 - two block closing only - tight", () => {
  equal(stripHtml("a</div></div>b").result, "a b", "52.01");
});

test("53 - inline+block closings only - tight", () => {
  equal(stripHtml("a</b></div>b").result, "a b", "53.01");
});

test("54 - block+inline closings only - tight", () => {
  equal(stripHtml("a</div></b>b").result, "a b", "54.01");
});

//

test("55 - two inline closing only - space position 1", () => {
  equal(stripHtml("a </b></b>b").result, "a b", "55.01");
});

test("56 - two block closing only - space position 1", () => {
  equal(stripHtml("a </div></div>b").result, "a b", "56.01");
});

test("57 - inline+block closings only - space position 1", () => {
  equal(stripHtml("a </b></div>b").result, "a b", "57.01");
});

test("58 - block+inline closings only - space position 1", () => {
  equal(stripHtml("a </div></b>b").result, "a b", "58.01");
});

//

test("59 - two inline closing only - LF position 1", () => {
  equal(stripHtml("a\n</b></b>b").result, "a\nb", "59.01");
});

test("60 - two block closing only - LF position 1", () => {
  equal(stripHtml("a\n</div></div>b").result, "a\nb", "60.01");
});

test("61 - inline+block closings only - LF position 1", () => {
  equal(stripHtml("a\n</b></div>b").result, "a\nb", "61.01");
});

test("62 - block+inline closings only - LF position 1", () => {
  equal(stripHtml("a\n</div></b>b").result, "a\nb", "62.01");
});

//

test("63 - two inline closing only - space position 2", () => {
  equal(stripHtml("a</b> </b>b").result, "a b", "63.01");
});

test("64 - two block closing only - space position 2", () => {
  equal(stripHtml("a</div> </div>b").result, "a b", "64.01");
});

test("65 - inline+block closings only - space position 2", () => {
  equal(stripHtml("a</b> </div>b").result, "a b", "65.01");
});

test("66 - block+inline closings only - space position 2", () => {
  equal(stripHtml("a</div> </b>b").result, "a b", "66.01");
});

//

test("67 - two inline closing only - LF position 2", () => {
  equal(stripHtml("a</b>\n</b>b").result, "a\nb", "67.01");
});

test("68 - two block closing only - LF position 2", () => {
  equal(stripHtml("a</div>\n</div>b").result, "a\nb", "68.01");
});

test("69 - inline+block closings only - LF position 2", () => {
  equal(stripHtml("a</b>\n</div>b").result, "a\nb", "69.01");
});

test("70 - block+inline closings only - LF position 2", () => {
  equal(stripHtml("a</div>\n</b>b").result, "a\nb", "70.01");
});

//

test("71 - two inline closing only - space position 3", () => {
  equal(stripHtml("a</b></b> b").result, "a b", "71.01");
});

test("72 - two block closing only - space position 3", () => {
  equal(stripHtml("a</div></div> b").result, "a b", "72.01");
});

test("73 - inline+block closings only - space position 3", () => {
  equal(stripHtml("a</b></div> b").result, "a b", "73.01");
});

test("74 - block+inline closings only - space position 3", () => {
  equal(stripHtml("a</div></b> b").result, "a b", "74.01");
});

//

test("75 - two inline closing only - LF position 3", () => {
  equal(stripHtml("a</b></b>\nb").result, "a\nb", "75.01");
});

test("76 - two block closing only - LF position 3", () => {
  equal(stripHtml("a</div></div>\nb").result, "a\nb", "76.01");
});

test("77 - inline+block closings only - LF position 3", () => {
  equal(stripHtml("a</b></div>\nb").result, "a\nb", "77.01");
});

test("78 - block+inline closings only - LF position 3", () => {
  equal(stripHtml("a</div></b>\nb").result, "a\nb", "78.01");
});

//

test("79 - two inline closing only - spaces at positions 1 & 2", () => {
  equal(stripHtml("a </b> </b>b").result, "a b", "79.01");
});

test("80 - two block closing only - spaces at positions 1 & 2", () => {
  equal(stripHtml("a </div> </div>b").result, "a b", "80.01");
});

test("81 - inline+block closings only - spaces at positions 1 & 2", () => {
  equal(stripHtml("a </b> </div>b").result, "a b", "81.01");
});

test("82 - block+inline closings only - spaces at positions 1 & 2", () => {
  equal(stripHtml("a </div> </b>b").result, "a b", "82.01");
});

//

test("83 - two inline closing only - LFs at positions 1 & 2", () => {
  equal(stripHtml("a\n</b>\n</b>b").result, "a\n\nb", "83.01");
});

test("84 - two block closing only - LFs at positions 1 & 2", () => {
  equal(stripHtml("a\n</div>\n</div>b").result, "a\n\nb", "84.01");
});

test("85 - inline+block closings only - LFs at positions 1 & 2", () => {
  equal(stripHtml("a\n</b>\n</div>b").result, "a\n\nb", "85.01");
});

test("86 - block+inline closings only - LFs at positions 1 & 2", () => {
  equal(stripHtml("a\n</div>\n</b>b").result, "a\n\nb", "86.01");
});

//

test("87 - two inline closing only - spaces at positions 2 & 3", () => {
  equal(stripHtml("a</b> </b> b").result, "a b", "87.01");
});

test("88 - two block closing only - spaces at positions 2 & 3", () => {
  equal(stripHtml("a</div> </div> b").result, "a b", "88.01");
});

test("89 - inline+block closings only - spaces at positions 2 & 3", () => {
  equal(stripHtml("a</b> </div> b").result, "a b", "89.01");
});

test("90 - block+inline closings only - spaces at positions 2 & 3", () => {
  equal(stripHtml("a</div> </b> b").result, "a b", "90.01");
});

//

test("91 - two inline closing only - LFs at positions 2 & 3", () => {
  equal(stripHtml("a</b>\n</b>\nb").result, "a\n\nb", "91.01");
});

test("92 - two block closing only - LFs at positions 2 & 3", () => {
  equal(stripHtml("a</div>\n</div>\nb").result, "a\n\nb", "92.01");
});

test("93 - inline+block closings only - LFs at positions 2 & 3", () => {
  equal(stripHtml("a</b>\n</div>\nb").result, "a\n\nb", "93.01");
});

test("94 - block+inline closings only - LFs at positions 2 & 3", () => {
  equal(stripHtml("a</div>\n</b>\nb").result, "a\n\nb", "94.01");
});

//

test("95 - two inline closing only - spaces at positions 1 & 3", () => {
  equal(stripHtml("a </b></b> b").result, "a b", "95.01");
});

test("96 - two block closing only - spaces at positions 1 & 3", () => {
  equal(stripHtml("a </div></div> b").result, "a b", "96.01");
});

test("97 - inline+block closings only - spaces at positions 1 & 3", () => {
  equal(stripHtml("a </b></div> b").result, "a b", "97.01");
});

test("98 - block+inline closings only - spaces at positions 1 & 3", () => {
  equal(stripHtml("a </div></b> b").result, "a b", "98.01");
});

//

test("99 - two inline closing only - LFs at positions 1 & 3", () => {
  equal(stripHtml("a\n</b></b>\nb").result, "a\n\nb", "99.01");
});

test("100 - two block closing only - LFs at positions 1 & 3", () => {
  equal(stripHtml("a\n</div></div>\nb").result, "a\n\nb", "100.01");
});

test("101 - inline+block closings only - LFs at positions 1 & 3", () => {
  equal(stripHtml("a\n</b></div>\nb").result, "a\n\nb", "101.01");
});

test("102 - block+inline closings only - LFs at positions 1 & 3", () => {
  equal(stripHtml("a\n</div></b>\nb").result, "a\n\nb", "102.01");
});

// -----------------------------------------------------------------------------

test("103 - wrapped, empty - block-inline", () => {
  equal(stripHtml("a<div><b></b></div>c").result, "a c", "103.01");
});

test("104 - wrapped, empty - inline-inline", () => {
  equal(stripHtml("a<b><b></b></b>c").result, "ac", "104.01");
});

test("105 - wrapped, empty - inline-block", () => {
  equal(stripHtml("a<b><div></div></b>c").result, "a c", "105.01");
});

test("106 - wrapped, empty - block-block", () => {
  equal(stripHtml("a<div><div></div></div>c").result, "a c", "106.01");
});

test.run();
