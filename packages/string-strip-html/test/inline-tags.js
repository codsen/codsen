// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// minimal
// -----------------------------------------------------------------------------

// tight

test("001 - minimal - inline opening - tight", () => {
  equal(stripHtml("a<b>c").result, "ac", "001.01");
});

test("002 - minimal - block opening - tight", () => {
  equal(stripHtml("a<div>b").result, "a b", "002.01");
});

test("003 - minimal - inline closing - tight", () => {
  equal(stripHtml("a</b>c").result, "ac", "003.01");
});

test("004 - minimal - block closing - tight", () => {
  equal(stripHtml("a</div>b").result, "a b", "004.01");
});

// one space in front

test("005 - minimal - inline opening - one space in front", () => {
  equal(stripHtml("a <b>c").result, "a c", "005.01");
});

test("006 - minimal - block opening - one space in front", () => {
  equal(stripHtml("a <div>b").result, "a b", "006.01");
});

test("007 - minimal - inline closing - one space in front", () => {
  equal(stripHtml("a </b>c").result, "a c", "007.01");
});

test("008 - minimal - block closing - one space in front", () => {
  equal(stripHtml("a </div>b").result, "a b", "008.01");
});

// one space in after

test("009 - minimal - inline opening - one space in after", () => {
  equal(stripHtml("a<b> c").result, "a c", "009.01");
});

test("010 - minimal - block opening - one space in after", () => {
  equal(stripHtml("a<div> b").result, "a b", "010.01");
});

test("011 - minimal - inline closing - one space in after", () => {
  equal(stripHtml("a</b> c").result, "a c", "011.01");
});

test("012 - minimal - block closing - one space in after", () => {
  equal(stripHtml("a</div> b").result, "a b", "012.01");
});

// spaced

test("013 - minimal - inline opening - spaced", () => {
  equal(stripHtml("a <b> c").result, "a c", "013.01");
});

test("014 - minimal - block opening - spaced", () => {
  equal(stripHtml("a <div> b").result, "a b", "014.01");
});

test("015 - minimal - inline closing - spaced", () => {
  equal(stripHtml("a </b> c").result, "a c", "015.01");
});

test("016 - minimal - block closing - spaced", () => {
  equal(stripHtml("a </div> b").result, "a b", "016.01");
});

// two spaces in front

test("017 - minimal - inline opening - two spaces in front", () => {
  equal(stripHtml("a  <b>c").result, "a c", "017.01");
});

test("018 - minimal - block opening - two spaces in front", () => {
  equal(stripHtml("a  <div>b").result, "a b", "018.01");
});

test("019 - minimal - inline closing - two spaces in front", () => {
  equal(stripHtml("a  </b>c").result, "a c", "019.01");
});

test("020 - minimal - block closing - two spaces in front", () => {
  equal(stripHtml("a  </div>b").result, "a b", "020.01");
});

// two spaces in after

test("021 - minimal - inline opening - one space in after", () => {
  equal(stripHtml("a<b>  c").result, "a c", "021.01");
});

test("022 - minimal - block opening - one space in after", () => {
  equal(stripHtml("a<div>  b").result, "a b", "022.01");
});

test("023 - minimal - inline closing - one space in after", () => {
  equal(stripHtml("a</b>  c").result, "a c", "023.01");
});

test("024 - minimal - block closing - one space in after", () => {
  equal(stripHtml("a</div>  b").result, "a b", "024.01");
});

// copiously spaced

test("025 - minimal - inline opening - spaced", () => {
  equal(stripHtml("a  <b>  c").result, "a c", "025.01");
});

test("026 - minimal - block opening - spaced", () => {
  equal(stripHtml("a  <div>  b").result, "a b", "026.01");
});

test("027 - minimal - inline closing - spaced", () => {
  equal(stripHtml("a  </b>  c").result, "a c", "027.01");
});

test("028 - minimal - block closing - spaced", () => {
  equal(stripHtml("a  </div>  b").result, "a b", "028.01");
});

// foo + bold bar
// -----------------------------------------------------------------------------

test("029 - block - inline - tight", () => {
  equal(stripHtml("<div>foo<b>bar</b></div>").result, "foobar", "029.01");
});

test("030 - block - inline - space in front", () => {
  equal(stripHtml("<div>foo <b>bar</b></div>").result, "foo bar", "030.01");
});

test("031 - block - inline - space in front", () => {
  equal(stripHtml("<div>foo\n<b>bar</b></div>").result, "foo\nbar", "031.01");
});

test("032 - block - inline - space after", () => {
  equal(stripHtml("<div>foo<b>bar</b> </div>").result, "foobar", "032.01");
});

test("033 - block - inline - space after", () => {
  equal(stripHtml("<div>foo<b>bar</b>\n</div>").result, "foobar", "033.01");
});

test("034 - block - inline - spaced all around - mini", () => {
  equal(stripHtml("<div>foo <b>bar</b> </div>").result, "foo bar", "034.01");
});

test("035 - block - inline - spaced all around - mini", () => {
  equal(stripHtml("<div>foo\n<b>bar</b>\n</div>").result, "foo\nbar", "035.01");
});

test("036 - block - inline - spaced all around - more realistic", () => {
  equal(
    stripHtml(
      '\n\n<div class="xy yx zy" style="color:red!important;">\n\n\n  foo\n  <b class="xy">\n\n    bar\n  </b>\n\n\n</div>\n\n',
    ).result,
    "foo\n\nbar",
    "036.01",
  );
});

// bold foo + bar
// -----------------------------------------------------------------------------

test("037 - block - inline - tight", () => {
  equal(stripHtml("<div><b>foo</b>bar</div>").result, "foobar", "037.01");
});

test("038 - block - inline - space in front", () => {
  equal(stripHtml("<div> <b>foo</b>bar</div>").result, "foobar", "038.01");
});

test("039 - block - inline - space in front", () => {
  equal(stripHtml("<div>\n<b>foo</b>bar</div>").result, "foobar", "039.01");
});

test("040 - block - inline - space after", () => {
  equal(stripHtml("<div><b>foo</b> bar</div>").result, "foo bar", "040.01");
});

test("041 - block - inline - space after", () => {
  equal(stripHtml("<div><b>foo</b>\nbar</div>").result, "foo\nbar", "041.01");
});

test("042 - block - inline - spaced all around - mini", () => {
  equal(stripHtml("<div> <b>foo</b> bar</div>").result, "foo bar", "042.01");
});

test("043 - block - inline - spaced all around - mini", () => {
  equal(stripHtml("<div>\n<b>foo</b>\nbar</div>").result, "foo\nbar", "043.01");
});

test("044 - block - inline - spaced all around - more realistic", () => {
  equal(
    stripHtml(
      '\n  <div class="xy yx zy" style="color:red!important;">\n\n   <b class="xy">    \n\n       foo\n\n   </b>\n   bar\n    </div>\n\n\n',
    ).result,
    "foo\n\nbar",
    "044.01",
  );
});

// -----------------------------------------------------------------------------

test("045 - space in front of inline tag, front-of string", () => {
  equal(stripHtml(" <b>foo—<b>bar</b></b>").result, "foo—bar", "045.01");
});

test("046 - LF in front of inline tag, front-of string", () => {
  equal(stripHtml("\n<b>foo—<b>bar</b></b>").result, "foo—bar", "046.01");
});

test("047 - space in front, mixed", () => {
  equal(stripHtml(" <b>foo—<div>bar</div></b>").result, "foo— bar", "047.01");
});

test("048 - LF in front, mixed", () => {
  equal(stripHtml("\n<b>foo—<div>bar</div></b>").result, "foo— bar", "048.01");
});

test("049 - space in front of block tag, front-of string", () => {
  equal(
    stripHtml(" <div>foo—<div>bar</div></div>").result,
    "foo— bar",
    "049.01",
  );
});

test("050 - LF in front of block tag, front-of string", () => {
  equal(
    stripHtml("\n<div>foo—<div>bar</div></div>").result,
    "foo— bar",
    "050.01",
  );
});

// -----------------------------------------------------------------------------

test("051 - two inline closing only - tight", () => {
  equal(stripHtml("a</b></b>b").result, "ab", "051.01");
});

test("052 - two block closing only - tight", () => {
  equal(stripHtml("a</div></div>b").result, "a b", "052.01");
});

test("053 - inline+block closings only - tight", () => {
  equal(stripHtml("a</b></div>b").result, "a b", "053.01");
});

test("054 - block+inline closings only - tight", () => {
  equal(stripHtml("a</div></b>b").result, "a b", "054.01");
});

//

test("055 - two inline closing only - space position 1", () => {
  equal(stripHtml("a </b></b>b").result, "a b", "055.01");
});

test("056 - two block closing only - space position 1", () => {
  equal(stripHtml("a </div></div>b").result, "a b", "056.01");
});

test("057 - inline+block closings only - space position 1", () => {
  equal(stripHtml("a </b></div>b").result, "a b", "057.01");
});

test("058 - block+inline closings only - space position 1", () => {
  equal(stripHtml("a </div></b>b").result, "a b", "058.01");
});

//

test("059 - two inline closing only - LF position 1", () => {
  equal(stripHtml("a\n</b></b>b").result, "a\nb", "059.01");
});

test("060 - two block closing only - LF position 1", () => {
  equal(stripHtml("a\n</div></div>b").result, "a\nb", "060.01");
});

test("061 - inline+block closings only - LF position 1", () => {
  equal(stripHtml("a\n</b></div>b").result, "a\nb", "061.01");
});

test("062 - block+inline closings only - LF position 1", () => {
  equal(stripHtml("a\n</div></b>b").result, "a\nb", "062.01");
});

//

test("063 - two inline closing only - space position 2", () => {
  equal(stripHtml("a</b> </b>b").result, "a b", "063.01");
});

test("064 - two block closing only - space position 2", () => {
  equal(stripHtml("a</div> </div>b").result, "a b", "064.01");
});

test("065 - inline+block closings only - space position 2", () => {
  equal(stripHtml("a</b> </div>b").result, "a b", "065.01");
});

test("066 - block+inline closings only - space position 2", () => {
  equal(stripHtml("a</div> </b>b").result, "a b", "066.01");
});

//

test("067 - two inline closing only - LF position 2", () => {
  equal(stripHtml("a</b>\n</b>b").result, "a\nb", "067.01");
});

test("068 - two block closing only - LF position 2", () => {
  equal(stripHtml("a</div>\n</div>b").result, "a\nb", "068.01");
});

test("069 - inline+block closings only - LF position 2", () => {
  equal(stripHtml("a</b>\n</div>b").result, "a\nb", "069.01");
});

test("070 - block+inline closings only - LF position 2", () => {
  equal(stripHtml("a</div>\n</b>b").result, "a\nb", "070.01");
});

//

test("071 - two inline closing only - space position 3", () => {
  equal(stripHtml("a</b></b> b").result, "a b", "071.01");
});

test("072 - two block closing only - space position 3", () => {
  equal(stripHtml("a</div></div> b").result, "a b", "072.01");
});

test("073 - inline+block closings only - space position 3", () => {
  equal(stripHtml("a</b></div> b").result, "a b", "073.01");
});

test("074 - block+inline closings only - space position 3", () => {
  equal(stripHtml("a</div></b> b").result, "a b", "074.01");
});

//

test("075 - two inline closing only - LF position 3", () => {
  equal(stripHtml("a</b></b>\nb").result, "a\nb", "075.01");
});

test("076 - two block closing only - LF position 3", () => {
  equal(stripHtml("a</div></div>\nb").result, "a\nb", "076.01");
});

test("077 - inline+block closings only - LF position 3", () => {
  equal(stripHtml("a</b></div>\nb").result, "a\nb", "077.01");
});

test("078 - block+inline closings only - LF position 3", () => {
  equal(stripHtml("a</div></b>\nb").result, "a\nb", "078.01");
});

//

test("079 - two inline closing only - spaces at positions 1 & 2", () => {
  equal(stripHtml("a </b> </b>b").result, "a b", "079.01");
});

test("080 - two block closing only - spaces at positions 1 & 2", () => {
  equal(stripHtml("a </div> </div>b").result, "a b", "080.01");
});

test("081 - inline+block closings only - spaces at positions 1 & 2", () => {
  equal(stripHtml("a </b> </div>b").result, "a b", "081.01");
});

test("082 - block+inline closings only - spaces at positions 1 & 2", () => {
  equal(stripHtml("a </div> </b>b").result, "a b", "082.01");
});

//

test("083 - two inline closing only - LFs at positions 1 & 2", () => {
  equal(stripHtml("a\n</b>\n</b>b").result, "a\n\nb", "083.01");
});

test("084 - two block closing only - LFs at positions 1 & 2", () => {
  equal(stripHtml("a\n</div>\n</div>b").result, "a\n\nb", "084.01");
});

test("085 - inline+block closings only - LFs at positions 1 & 2", () => {
  equal(stripHtml("a\n</b>\n</div>b").result, "a\n\nb", "085.01");
});

test("086 - block+inline closings only - LFs at positions 1 & 2", () => {
  equal(stripHtml("a\n</div>\n</b>b").result, "a\n\nb", "086.01");
});

//

test("087 - two inline closing only - spaces at positions 2 & 3", () => {
  equal(stripHtml("a</b> </b> b").result, "a b", "087.01");
});

test("088 - two block closing only - spaces at positions 2 & 3", () => {
  equal(stripHtml("a</div> </div> b").result, "a b", "088.01");
});

test("089 - inline+block closings only - spaces at positions 2 & 3", () => {
  equal(stripHtml("a</b> </div> b").result, "a b", "089.01");
});

test("090 - block+inline closings only - spaces at positions 2 & 3", () => {
  equal(stripHtml("a</div> </b> b").result, "a b", "090.01");
});

//

test("091 - two inline closing only - LFs at positions 2 & 3", () => {
  equal(stripHtml("a</b>\n</b>\nb").result, "a\n\nb", "091.01");
});

test("092 - two block closing only - LFs at positions 2 & 3", () => {
  equal(stripHtml("a</div>\n</div>\nb").result, "a\n\nb", "092.01");
});

test("093 - inline+block closings only - LFs at positions 2 & 3", () => {
  equal(stripHtml("a</b>\n</div>\nb").result, "a\n\nb", "093.01");
});

test("094 - block+inline closings only - LFs at positions 2 & 3", () => {
  equal(stripHtml("a</div>\n</b>\nb").result, "a\n\nb", "094.01");
});

//

test("095 - two inline closing only - spaces at positions 1 & 3", () => {
  equal(stripHtml("a </b></b> b").result, "a b", "095.01");
});

test("096 - two block closing only - spaces at positions 1 & 3", () => {
  equal(stripHtml("a </div></div> b").result, "a b", "096.01");
});

test("097 - inline+block closings only - spaces at positions 1 & 3", () => {
  equal(stripHtml("a </b></div> b").result, "a b", "097.01");
});

test("098 - block+inline closings only - spaces at positions 1 & 3", () => {
  equal(stripHtml("a </div></b> b").result, "a b", "098.01");
});

//

test("099 - two inline closing only - LFs at positions 1 & 3", () => {
  equal(stripHtml("a\n</b></b>\nb").result, "a\n\nb", "099.01");
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
