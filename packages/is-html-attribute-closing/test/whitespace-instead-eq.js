import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";
// const BACKSLASH = "\u005C";

// equals is replaced with whitespace
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

test(`01 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - one tag, three attrs`, () => {
  let str = '<a class "c" id \'e\' href "www">';

  // class opening at 9
  not.ok(isCl(str, 9, 9), "01.01");
  ok(isCl(str, 9, 11), "01.01"); // <--
  not.ok(isCl(str, 9, 16), "01.03");
  not.ok(isCl(str, 9, 18), "01.04");
  not.ok(isCl(str, 9, 25), "01.05");
  not.ok(isCl(str, 9, 29), "01.06");

  // id opening at 16
  not.ok(isCl(str, 16, 9), "01.07");
  not.ok(isCl(str, 16, 11), "01.08");
  not.ok(isCl(str, 16, 16), "01.09");
  ok(isCl(str, 16, 18), "01.02"); // <--
  not.ok(isCl(str, 16, 25), "01.11");
  not.ok(isCl(str, 16, 29), "01.12");

  // href opening at 25
  not.ok(isCl(str, 25, 9), "01.13");
  not.ok(isCl(str, 25, 11), "01.14");
  not.ok(isCl(str, 25, 16), "01.15");
  not.ok(isCl(str, 25, 18), "01.16");
  not.ok(isCl(str, 25, 25), "01.17");
  ok(isCl(str, 25, 29), "01.03"); // <--

  // fin.
});

//
//
//
//
//
//        MORE CASES...
//
//
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

// S-S follows

test(`02 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m`, () => {
  let str = '<z bbb"c" ddd\'e\'>.<z fff"g">';

  // bbb opening at 6
  not.ok(isCl(str, 6, 6), "02.01");
  ok(isCl(str, 6, 8), "02.01"); // <--
  not.ok(isCl(str, 6, 13), "02.03");
  not.ok(isCl(str, 6, 15), "02.04");
  not.ok(isCl(str, 6, 24), "02.05");
  not.ok(isCl(str, 6, 26), "02.06");

  // ddd opening at 13
  not.ok(isCl(str, 13, 6), "02.07");
  not.ok(isCl(str, 13, 8), "02.08");
  not.ok(isCl(str, 13, 13), "02.09");
  ok(isCl(str, 13, 15), "02.02"); // <--
  not.ok(isCl(str, 13, 24), "02.11");
  not.ok(isCl(str, 13, 26), "02.12");

  // fin.
});

test(`03 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - recognised everything - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m`, () => {
  let str = "<a class\"c\" id'e'>";

  // bbb opening at 8
  not.ok(isCl(str, 8, 8), "03.01");
  ok(isCl(str, 8, 10), "03.01"); // <--
  not.ok(isCl(str, 8, 14), "03.03");
  not.ok(isCl(str, 8, 16), "03.04");

  // ddd opening at 14
  not.ok(isCl(str, 14, 8), "03.05");
  not.ok(isCl(str, 14, 10), "03.06");
  not.ok(isCl(str, 14, 14), "03.07");
  ok(isCl(str, 14, 16), "03.02"); // <--

  // fin.
});

// S-D follows

test(`04 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m`, () => {
  let str = '<z bbb"c" ddd\'e">';

  // 1. the bracket that follows is the last non-whitespace character in string:

  // bbb opening at 6
  not.ok(isCl(str, 6, 6), "04.01");
  ok(isCl(str, 6, 8), "04.01"); // <--
  not.ok(isCl(str, 6, 13), "04.03");
  not.ok(isCl(str, 6, 15), "04.04");

  // ddd opening at 13
  not.ok(isCl(str, 13, 6), "04.05");
  not.ok(isCl(str, 13, 8), "04.06");
  not.ok(isCl(str, 13, 13), "04.07");
  ok(isCl(str, 13, 15), "04.02"); // <--

  // 2. even if more tags follow, result's the same:

  let str2 = "<z bbb\"c\" ddd'e\">something's here<z id='x'>";
  ok(isCl(str2, 13, 15), "04.03"); // <--
  not.ok(isCl(str2, 13, 26), "04.10");
  not.ok(isCl(str2, 13, 39), "04.11");
  not.ok(isCl(str2, 13, 41), "04.12");

  // fin.
});

test(`05 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - recognised everything - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m`, () => {
  let str = '<a class"c" id\'e">';

  // bbb opening at 8
  not.ok(isCl(str, 8, 8), "05.01");
  ok(isCl(str, 8, 10), "05.01"); // <--
  not.ok(isCl(str, 8, 14), "05.03");
  not.ok(isCl(str, 8, 16), "05.04");

  // ddd opening at 14
  not.ok(isCl(str, 14, 8), "05.05");
  not.ok(isCl(str, 14, 10), "05.06");
  not.ok(isCl(str, 14, 14), "05.07");
  ok(isCl(str, 14, 16), "05.02"); // <--

  // fin.
});

// D-S follows

test(`06 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m`, () => {
  let str = '<z bbb"c" ddd"e\'>';

  // bbb opening at 6
  not.ok(isCl(str, 6, 6), "06.01");
  ok(isCl(str, 6, 8), "06.01"); // <--
  not.ok(isCl(str, 6, 13), "06.03");
  not.ok(isCl(str, 6, 15), "06.04");

  // ddd opening at 13
  not.ok(isCl(str, 13, 6), "06.05");
  not.ok(isCl(str, 13, 8), "06.06");
  not.ok(isCl(str, 13, 13), "06.07");
  ok(isCl(str, 13, 15), "06.02"); // <--

  // fin.
});

test(`07 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - recognised everything - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m`, () => {
  let str = '<a class"c" id"e\'>';

  // bbb opening at 8
  not.ok(isCl(str, 8, 8), "07.01");
  ok(isCl(str, 8, 10), "07.01"); // <--
  not.ok(isCl(str, 8, 14), "07.03");
  not.ok(isCl(str, 8, 16), "07.04");

  // ddd opening at 14
  not.ok(isCl(str, 14, 8), "07.05");
  not.ok(isCl(str, 14, 10), "07.06");
  not.ok(isCl(str, 14, 14), "07.07");
  ok(isCl(str, 14, 16), "07.02"); // <--

  // fin.
});

// D-D follows

test(`08 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m`, () => {
  let str = '<z bbb"c" ddd"e">';

  // bbb opening at 6
  not.ok(isCl(str, 6, 6), "08.01");
  ok(isCl(str, 6, 8), "08.01"); // <--
  not.ok(isCl(str, 6, 13), "08.03");
  ok(isCl(str, 6, 15), "08.02"); // <-- ! also here

  // ddd opening at 13
  not.ok(isCl(str, 13, 6), "08.05");
  not.ok(isCl(str, 13, 8), "08.06");
  not.ok(isCl(str, 13, 13), "08.07");
  ok(isCl(str, 13, 15), "08.03"); // <--

  // fin.
});

test(`09 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - recognised everything - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m`, () => {
  let str = '<a class"c" id"e">';

  // bbb opening at 8
  not.ok(isCl(str, 8, 8), "09.01");
  ok(isCl(str, 8, 10), "09.01"); // <--
  not.ok(isCl(str, 8, 14), "09.03");
  not.ok(isCl(str, 8, 16), "09.04");

  // ddd opening at 14
  not.ok(isCl(str, 14, 8), "09.05");
  not.ok(isCl(str, 14, 10), "09.06");
  not.ok(isCl(str, 14, 14), "09.07");
  ok(isCl(str, 14, 16), "09.02"); // <--

  // fin.
});

// counter-cases, false positives

test(`10 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - counter-case - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m`, () => {
  let str1 = '<z bbb"c" ddd\'e>';

  // algorithm picks the 13 because it is matching and 13 is unmatched

  // bbb opening at 6
  ok(isCl(str1, 6, 8), "10.01"); // <--
  not.ok(isCl(str1, 6, 13), "10.02");

  // also,

  let str2 = "<z bbb\"c\" ddd'e'>";

  // bbb opening at 6
  ok(isCl(str2, 6, 8), "10.02"); // <--
  not.ok(isCl(str2, 6, 13), "10.04");
  not.ok(isCl(str2, 6, 15), "10.05");

  // also, even though href is suspicious, it's wrapped with a matching
  // quote pair so we take it as value, not attribute name

  let str3 = '<z alt"href" www\'/>';

  // bbb opening at 6
  ok(isCl(str3, 6, 11), "10.03"); // <--
  not.ok(isCl(str3, 6, 16), "10.07");

  // but it's enough to mismatch the pair and it becomes...

  let str4 = "<z alt\"href=' www'/>";
  // Algorithm sees this as:
  // <z alt="" href=' ddd'/>

  // bbb opening at 6
  not.ok(isCl(str4, 6, 12), "10.08"); // <--
  // even though it's mismatching:
  not.ok(isCl(str4, 6, 17), "10.09");

  // but doubles in front:
  let str5 = "<z alt\"\"href' www'/>";
  ok(isCl(str5, 6, 7), "10.04"); // <--
  not.ok(isCl(str5, 6, 12), "10.11");
  not.ok(isCl(str5, 6, 17), "10.12");

  // even doubles can follow,

  let str6 = "<z alt\"href' www' id=z\"/>";
  // Algorithm sees this as:
  // <z alt="" href=' ddd'/>

  // bbb opening at 6
  not.ok(isCl(str6, 6, 11), "10.13"); // <--
  // even though it's mismatching:
  not.ok(isCl(str6, 6, 16), "10.14");
  not.ok(isCl(str6, 6, 22), "10.15");

  // fin.
});

test(`11 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - counter-case - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m`, () => {
  let str = '<z bbb"c\' ddd"e>';

  // but if 13 is mismatching, it will jump to 13 because count of doubles is
  // an even number

  // basically, "outermost quotes count being even number" takes priority
  // over any character or character chunk qualities (like recognised attr name)

  // bbb opening at 6
  not.ok(isCl(str, 6, 8), "11.01");
  ok(isCl(str, 6, 13), "11.01"); // <--

  // fin.
});

test(`12 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - counter-case - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m`, () => {
  let str = '<z bbb"c\' href"e>';

  // but if 13 is mismatching, it will jump to 13 because count of doubles is
  // an even number

  // basically, "outermost quotes count being even number" takes priority
  // over any character or character chunk qualities (like recognised attr name)

  // bbb opening at 6
  ok(isCl(str, 6, 8), "12.01"); // <--
  not.ok(isCl(str, 6, 14), "12.02");

  // fin.
});

test(`13 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - counter-case - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m`, () => {
  let str = '<z bbb"c\' z href"e>';

  // z ruins everything, if it's not a known void attribute name

  // bbb opening at 6
  not.ok(isCl(str, 6, 8), "13.01");
  ok(isCl(str, 6, 16), "13.01"); // <--

  // fin.
});

test(`14 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - counter-case - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m`, () => {
  let str = '<z bbb"c\' nowrap href"e>';

  // nowrap is recognised void attribute

  // bbb opening at 6
  ok(isCl(str, 6, 8), "14.01"); // <--
  not.ok(isCl(str, 6, 21), "14.02");

  // fin.
});

test(`15 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - counter-case - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m`, () => {
  let str = '<z href"href\' href href"href>';

  // program perceives it as:
  // <z href"href' href href" href>
  // as in
  // <img alt="somethin' fishy going on" class>

  // bbb opening at 7
  ok(isCl(str, 7, 12), "15.01"); // <--
  not.ok(isCl(str, 7, 23), "15.02");

  // fin.
});

test(`16 - ${`\u001b[${34}m${"space instead of equal"}\u001b[${39}m`} - counter-case - \u001b[${31}m${"D"}\u001b[${39}m-\u001b[${33}m${"S"}\u001b[${39}m-\u001b[${31}m${"D"}\u001b[${39}m`, () => {
  // no closing slash on img
  let str1 = '<img alt="somethin\' fishy going on\' class=">z<a class="y">';

  // alt opening at 9
  not.ok(isCl(str1, 9, 18), "16.01");
  ok(isCl(str1, 9, 34), "16.01"); // <--
  not.ok(isCl(str1, 9, 42), "16.03");
  not.ok(isCl(str1, 9, 54), "16.04");
  not.ok(isCl(str1, 9, 56), "16.05");

  // closing slash on img present
  let str2 = '<img alt="somethin\' fishy going on\' class="/>z<a class="y">';

  // alt opening at 9
  not.ok(isCl(str2, 9, 18), "16.06");
  ok(isCl(str2, 9, 34), "16.02"); // <--
  not.ok(isCl(str2, 9, 42), "16.08");
  not.ok(isCl(str2, 9, 55), "16.09");
  not.ok(isCl(str2, 9, 57), "16.10");

  // fin.
});

test.run();
