import tap from "tap";
import { isAttrClosing as is } from "../dist/is-html-attribute-closing.esm";
// const BACKSLASH = "\u005C";

// equals is replaced with whitespace
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `01 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - one tag, three attrs`,
  (t) => {
    const str = `<a class "c" id 'e' href "www">`;

    // class opening at 9
    t.false(is(str, 9, 9), "01.01");
    t.true(is(str, 9, 11), "01.02"); // <--
    t.false(is(str, 9, 16), "01.03");
    t.false(is(str, 9, 18), "01.04");
    t.false(is(str, 9, 25), "01.05");
    t.false(is(str, 9, 29), "01.06");

    // id opening at 16
    t.false(is(str, 16, 9), "01.07");
    t.false(is(str, 16, 11), "01.08");
    t.false(is(str, 16, 16), "01.09");
    t.true(is(str, 16, 18), "01.10"); // <--
    t.false(is(str, 16, 25), "01.11");
    t.false(is(str, 16, 29), "01.12");

    // href opening at 25
    t.false(is(str, 25, 9), "01.13");
    t.false(is(str, 25, 11), "01.14");
    t.false(is(str, 25, 16), "01.15");
    t.false(is(str, 25, 18), "01.16");
    t.false(is(str, 25, 25), "01.17");
    t.true(is(str, 25, 29), "01.18"); // <--

    // fin.
    t.end();
  }
);

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

tap.test(
  `02 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd'e'>.<z fff"g">`;

    // bbb opening at 6
    t.false(is(str, 6, 6), "02.01");
    t.true(is(str, 6, 8), "02.02"); // <--
    t.false(is(str, 6, 13), "02.03");
    t.false(is(str, 6, 15), "02.04");
    t.false(is(str, 6, 24), "02.05");
    t.false(is(str, 6, 26), "02.06");

    // ddd opening at 13
    t.false(is(str, 13, 6), "02.07");
    t.false(is(str, 13, 8), "02.08");
    t.false(is(str, 13, 13), "02.09");
    t.true(is(str, 13, 15), "02.10"); // <--
    t.false(is(str, 13, 24), "02.11");
    t.false(is(str, 13, 26), "02.12");

    // fin.
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id'e'>`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "03.01");
    t.true(is(str, 8, 10), "03.02"); // <--
    t.false(is(str, 8, 14), "03.03");
    t.false(is(str, 8, 16), "03.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "03.05");
    t.false(is(str, 14, 10), "03.06");
    t.false(is(str, 14, 14), "03.07");
    t.true(is(str, 14, 16), "03.08"); // <--

    // fin.
    t.end();
  }
);

// S-D follows

tap.test(
  `04 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd'e">`;

    // 1. the bracket that follows is the last non-whitespace character in string:

    // bbb opening at 6
    t.false(is(str, 6, 6), "04.01");
    t.true(is(str, 6, 8), "04.02"); // <--
    t.false(is(str, 6, 13), "04.03");
    t.false(is(str, 6, 15), "04.04");

    // ddd opening at 13
    t.false(is(str, 13, 6), "04.05");
    t.false(is(str, 13, 8), "04.06");
    t.false(is(str, 13, 13), "04.07");
    t.true(is(str, 13, 15), "04.08"); // <--

    // 2. even if more tags follow, result's the same:

    const str2 = `<z bbb"c" ddd'e">something's here<z id='x'>`;
    t.true(is(str2, 13, 15), "04.09"); // <--
    t.false(is(str2, 13, 26), "04.10");
    t.false(is(str2, 13, 39), "04.11");
    t.false(is(str2, 13, 41), "04.12");

    // fin.
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id'e">`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "05.01");
    t.true(is(str, 8, 10), "05.02"); // <--
    t.false(is(str, 8, 14), "05.03");
    t.false(is(str, 8, 16), "05.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "05.05");
    t.false(is(str, 14, 10), "05.06");
    t.false(is(str, 14, 14), "05.07");
    t.true(is(str, 14, 16), "05.08"); // <--

    // fin.
    t.end();
  }
);

// D-S follows

tap.test(
  `06 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd"e'>`;

    // bbb opening at 6
    t.false(is(str, 6, 6), "06.01");
    t.true(is(str, 6, 8), "06.02"); // <--
    t.false(is(str, 6, 13), "06.03");
    t.false(is(str, 6, 15), "06.04");

    // ddd opening at 13
    t.false(is(str, 13, 6), "06.05");
    t.false(is(str, 13, 8), "06.06");
    t.false(is(str, 13, 13), "06.07");
    t.true(is(str, 13, 15), "06.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id"e'>`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "07.01");
    t.true(is(str, 8, 10), "07.02"); // <--
    t.false(is(str, 8, 14), "07.03");
    t.false(is(str, 8, 16), "07.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "07.05");
    t.false(is(str, 14, 10), "07.06");
    t.false(is(str, 14, 14), "07.07");
    t.true(is(str, 14, 16), "07.08"); // <--

    // fin.
    t.end();
  }
);

// D-D follows

tap.test(
  `08 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd"e">`;

    // bbb opening at 6
    t.false(is(str, 6, 6), "08.01");
    t.true(is(str, 6, 8), "08.02"); // <--
    t.false(is(str, 6, 13), "08.03");
    t.true(is(str, 6, 15), "08.04"); // <-- ! also here

    // ddd opening at 13
    t.false(is(str, 13, 6), "08.05");
    t.false(is(str, 13, 8), "08.06");
    t.false(is(str, 13, 13), "08.07");
    t.true(is(str, 13, 15), "08.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id"e">`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "09.01");
    t.true(is(str, 8, 10), "09.02"); // <--
    t.false(is(str, 8, 14), "09.03");
    t.false(is(str, 8, 16), "09.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "09.05");
    t.false(is(str, 14, 10), "09.06");
    t.false(is(str, 14, 14), "09.07");
    t.true(is(str, 14, 16), "09.08"); // <--

    // fin.
    t.end();
  }
);

// counter-cases, false positives

tap.test(
  `10 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str1 = `<z bbb"c" ddd'e>`;

    // algorithm picks the 13 because it is matching and 13 is unmatched

    // bbb opening at 6
    t.true(is(str1, 6, 8), "10.01"); // <--
    t.false(is(str1, 6, 13), "10.02");

    // also,

    const str2 = `<z bbb"c" ddd'e'>`;

    // bbb opening at 6
    t.true(is(str2, 6, 8), "10.03"); // <--
    t.false(is(str2, 6, 13), "10.04");
    t.false(is(str2, 6, 15), "10.05");

    // also, even though href is suspicious, it's wrapped with a matching
    // quote pair so we take it as value, not attribute name

    const str3 = `<z alt"href" www'/>`;

    // bbb opening at 6
    t.true(is(str3, 6, 11), "10.06"); // <--
    t.false(is(str3, 6, 16), "10.07");

    // but it's enough to mismatch the pair and it becomes...

    const str4 = `<z alt"href=' www'/>`;
    // Algorithm sees this as:
    // <z alt="" href=' ddd'/>

    // bbb opening at 6
    t.false(is(str4, 6, 12), "10.08"); // <--
    // even though it's mismatching:
    t.false(is(str4, 6, 17), "10.09");

    // but doubles in front:
    const str5 = `<z alt""href' www'/>`;
    t.true(is(str5, 6, 7), "10.10"); // <--
    t.false(is(str5, 6, 12), "10.11");
    t.false(is(str5, 6, 17), "10.12");

    // even doubles can follow,

    const str6 = `<z alt"href' www' id=z"/>`;
    // Algorithm sees this as:
    // <z alt="" href=' ddd'/>

    // bbb opening at 6
    t.false(is(str6, 6, 11), "10.13"); // <--
    // even though it's mismatching:
    t.false(is(str6, 6, 16), "10.14");
    t.false(is(str6, 6, 22), "10.15");

    // fin.
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' ddd"e>`;

    // but if 13 is mismatching, it will jump to 13 because count of doubles is
    // an even number

    // basically, "outermost quotes count being even number" takes priority
    // over any character or character chunk qualities (like recognised attr name)

    // bbb opening at 6
    t.false(is(str, 6, 8), "11.01");
    t.true(is(str, 6, 13), "11.02"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' href"e>`;

    // but if 13 is mismatching, it will jump to 13 because count of doubles is
    // an even number

    // basically, "outermost quotes count being even number" takes priority
    // over any character or character chunk qualities (like recognised attr name)

    // bbb opening at 6
    t.true(is(str, 6, 8), "12.01"); // <--
    t.false(is(str, 6, 14), "12.02");

    // fin.
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' z href"e>`;

    // z ruins everything, if it's not a known void attribute name

    // bbb opening at 6
    t.false(is(str, 6, 8), "13.01");
    t.true(is(str, 6, 16), "13.02"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' nowrap href"e>`;

    // nowrap is recognised void attribute

    // bbb opening at 6
    t.true(is(str, 6, 8), "14.01"); // <--
    t.false(is(str, 6, 21), "14.02");

    // fin.
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z href"href' href href"href>`;

    // program perceives it as:
    // <z href"href' href href" href>
    // as in
    // <img alt="somethin' fishy going on" class>

    // bbb opening at 7
    t.true(is(str, 7, 12), "15.01"); // <--
    t.false(is(str, 7, 23), "15.02");

    // fin.
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // no closing slash on img
    const str1 = `<img alt="somethin' fishy going on' class=">z<a class="y">`;

    // alt opening at 9
    t.false(is(str1, 9, 18), "16.01");
    t.true(is(str1, 9, 34), "16.02"); // <--
    t.false(is(str1, 9, 42), "16.03");
    t.false(is(str1, 9, 54), "16.04");
    t.false(is(str1, 9, 56), "16.05");

    // closing slash on img present
    const str2 = `<img alt="somethin' fishy going on' class="/>z<a class="y">`;

    // alt opening at 9
    t.false(is(str2, 9, 18), "16.06");
    t.true(is(str2, 9, 34), "16.07"); // <--
    t.false(is(str2, 9, 42), "16.08");
    t.false(is(str2, 9, 55), "16.09");
    t.false(is(str2, 9, 57), "16.10");

    // fin.
    t.end();
  }
);
