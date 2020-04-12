const t = require("tap");
const is = require("../dist/is-html-attribute-closing.cjs");
// const BACKSLASH = "\u005C";

// 00. Weird cases
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - no input`,
  (t) => {
    t.false(is(), "00.01");
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - input is not a string`,
  (t) => {
    t.false(is(2), "00.02");
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - input is empty string`,
  (t) => {
    t.false(is(""), "00.03");
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 2nd arg is missing`,
  (t) => {
    t.false(is("a"), "00.04");
    t.end();
  }
);

t.test(
  `00.05 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 2nd arg is not integer`,
  (t) => {
    t.false(is("a", "a"), "00.05");
    t.end();
  }
);

t.test(
  `00.06 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 3rd arg is missing`,
  (t) => {
    t.false(is("a", 0), "00.06");
    t.end();
  }
);

t.test(
  `00.07 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 3rd arg is not integer`,
  (t) => {
    t.false(is("a", 0, "a"), "00.07");
    t.end();
  }
);

t.test(
  `00.08 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - no character in string at what's given by 2nd arg`,
  (t) => {
    t.false(is("a", 99, 100), "00.08");
    t.end();
  }
);

t.test(
  `00.09 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - no character in string at what's given by 3rd arg`,
  (t) => {
    t.false(is("a", 0, 100), "00.09");
    t.end();
  }
);

t.test(
  `00.10 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - indexes equal`,
  (t) => {
    t.false(is("abcde", 2, 2), "00.10");
    t.end();
  }
);

t.test(
  `00.11 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 3rd > 2nd`,
  (t) => {
    t.false(is("abcde", 2, 1), "00.11");
    t.end();
  }
);

// 01. healthy code
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, one attr, double quotes`,
  (t) => {
    const str = `<a href="zzz">`;
    t.true(is(str, 8, 12), "01.01");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, one attr, single quotes`,
  (t) => {
    const str = `<a href='zzz'>`;
    t.true(is(str, 8, 12), "01.02");
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, few attrs, double quotes`,
  (t) => {
    const str = `<a href="zzz" target="_blank" style="color: black;">`;
    // 1. starting at the opening of "href":
    t.false(is(str, 8, 8), "01.03.01");
    t.true(is(str, 8, 12), "01.03.02"); // <--
    t.false(is(str, 8, 21), "01.03.03");
    t.false(is(str, 8, 28), "01.03.04");
    t.false(is(str, 8, 36), "01.03.05");
    t.false(is(str, 8, 50), "01.03.06");

    // 2. starting at the opening of "target":
    t.false(is(str, 21, 8), "01.03.07");
    t.false(is(str, 21, 12), "01.03.08");
    t.false(is(str, 21, 21), "01.03.09");
    t.true(is(str, 21, 28), "01.03.10"); // <--
    t.false(is(str, 21, 36), "01.03.11");
    t.false(is(str, 21, 50), "01.03.12");

    // 3. starting at the opening of "style":
    t.false(is(str, 36, 8), "01.03.13");
    t.false(is(str, 36, 12), "01.03.14");
    t.false(is(str, 36, 21), "01.03.15");
    t.false(is(str, 36, 28), "01.03.16");
    t.false(is(str, 36, 36), "01.03.17");
    t.true(is(str, 36, 50), "01.03.18"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, few attrs, single quotes`,
  (t) => {
    const str = `<a href='zzz' target='_blank' style='color: black;'>`;
    // 1. starting at the opening of "href":
    t.false(is(str, 8, 8), "01.04.01");
    t.true(is(str, 8, 12), "01.04.02"); // <--
    t.false(is(str, 8, 21), "01.04.03");
    t.false(is(str, 8, 28), "01.04.04");
    t.false(is(str, 8, 36), "01.04.05");
    t.false(is(str, 8, 50), "01.04.06");

    // 2. starting at the opening of "target":
    t.false(is(str, 21, 8), "01.04.07");
    t.false(is(str, 21, 12), "01.04.08");
    t.false(is(str, 21, 21), "01.04.09");
    t.true(is(str, 21, 28), "01.04.10"); // <--
    t.false(is(str, 21, 36), "01.04.11");
    t.false(is(str, 21, 50), "01.04.12");

    // 3. starting at the opening of "style":
    t.false(is(str, 36, 8), "01.04.13");
    t.false(is(str, 36, 12), "01.04.14");
    t.false(is(str, 36, 21), "01.04.15");
    t.false(is(str, 36, 28), "01.04.16");
    t.false(is(str, 36, 36), "01.04.17");
    t.true(is(str, 36, 50), "01.04.18"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - repeated singles inside doubles`,
  (t) => {
    const str = `<img src="spacer.gif" alt="'''''" width="1" height="1" border="0" style="display:block;"/>`;
    // 0. warmup
    t.true(is(str, 9, 20), "01.05.00");

    // 1. the bizness
    t.false(is(str, 26, 9), "01.05.01");
    t.false(is(str, 26, 20), "01.05.02");
    t.false(is(str, 26, 26), "01.05.03");
    t.false(is(str, 26, 27), "01.05.04");
    t.false(is(str, 26, 28), "01.05.05");
    t.false(is(str, 26, 29), "01.05.06");
    t.false(is(str, 26, 30), "01.05.07");
    t.false(is(str, 26, 31), "01.05.08");
    t.true(is(str, 26, 32), "01.05.09"); // <--
    t.false(is(str, 26, 40), "01.05.10");

    // fin.
    t.end();
  }
);

// 02. mismatching quotes, rest healthy
// -----------------------------------------------------------------------------

//
//
//
//
//
//   LEGEND: S means single, D means double, X means absent
//
//   For example \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m means single - double (meaning in that order)
//
//
//
//

t.test(
  `02.01 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap`,
  (t) => {
    // healthy tag being:
    // <img alt='so-called "artists"!' class='yo'/>

    const str = `<img alt="so-called "artists"!' class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 20), "02.01.01");
    t.false(is(str, 9, 28), "02.01.02");
    t.true(is(str, 9, 30), "02.01.03"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - similar but opposite`,
  (t) => {
    // healthy tag being:
    // <img class="so-called" alt="!" border='10'/>

    const str = `<img class="so-called "alt"!' border='10'/>`;

    // class opening at 11
    t.true(is(str, 11, 22), "02.02.01"); // <-- !!!
    t.false(is(str, 11, 26), "02.02.02");
    t.false(is(str, 11, 28), "02.02.03");
    t.false(is(str, 11, 37), "02.02.04");
    t.false(is(str, 11, 40), "02.02.05");

    // fin.
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - also similar`,
  (t) => {
    // healthy tag being:
    // <img class="so-called" alt="!" border='10'/>

    const str = `<img class="so-called "alt !' border 10'/>`;

    // class opening at 11
    t.true(is(str, 11, 22), "02.03.01");
    t.false(is(str, 11, 28), "02.03.02");
    t.false(is(str, 11, 39), "02.03.03");

    // fin.
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - basic, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="="/>`;
    t.true(is(str, 19, 21), "02.04"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - two attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<div class="c' id="x'>.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "02.05.01");
    t.true(is(str, 11, 13), "02.05.02"); // <--
    t.false(is(str, 11, 18), "02.05.03");
    t.false(is(str, 11, 20), "02.05.04");

    // id opening at 18
    t.false(is(str, 18, 11), "02.05.05");
    t.false(is(str, 18, 13), "02.05.06");
    t.false(is(str, 18, 18), "02.05.07");
    t.true(is(str, 18, 20), "02.05.08"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - two attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<div class='c" id='x">.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "02.06.01");
    t.true(is(str, 11, 13), "02.06.02"); // <--
    t.false(is(str, 11, 18), "02.06.03");
    t.false(is(str, 11, 20), "02.06.04");

    // id opening at 18
    t.false(is(str, 18, 11), "02.06.05");
    t.false(is(str, 18, 13), "02.06.06");
    t.false(is(str, 18, 18), "02.06.07");
    t.true(is(str, 18, 20), "02.06.08"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.07 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - three attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<div class="c' id="x' style='c">.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "02.07.01");
    t.true(is(str, 11, 13), "02.07.02"); // <--
    t.false(is(str, 11, 18), "02.07.03");
    t.false(is(str, 11, 20), "02.07.04");
    t.false(is(str, 11, 28), "02.07.05");
    t.false(is(str, 11, 30), "02.07.06");

    // class opening at 18
    t.false(is(str, 18, 11), "02.07.07");
    t.false(is(str, 18, 13), "02.07.08");
    t.false(is(str, 18, 18), "02.07.09");
    t.true(is(str, 18, 20), "02.07.10"); // <--
    t.false(is(str, 18, 28), "02.07.11");
    t.false(is(str, 18, 30), "02.07.12");

    // style opening at 28
    t.false(is(str, 28, 11), "02.07.07");
    t.false(is(str, 28, 13), "02.07.08");
    t.false(is(str, 28, 18), "02.07.09");
    t.false(is(str, 28, 20), "02.07.10");
    t.false(is(str, 28, 28), "02.07.11");
    t.true(is(str, 28, 30), "02.07.12"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.08 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - three attr pairs, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<div class='c" id='x" style="c'>.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "02.08.01");
    t.true(is(str, 11, 13), "02.08.02"); // <--
    t.false(is(str, 11, 18), "02.08.03");
    t.false(is(str, 11, 20), "02.08.04");
    t.false(is(str, 11, 28), "02.08.05");
    t.false(is(str, 11, 30), "02.08.06");

    // class opening at 18
    t.false(is(str, 18, 11), "02.08.07");
    t.false(is(str, 18, 13), "02.08.08");
    t.false(is(str, 18, 18), "02.08.09");
    t.true(is(str, 18, 20), "02.08.10"); // <--
    t.false(is(str, 18, 28), "02.08.11");
    t.false(is(str, 18, 30), "02.08.12");

    // style opening at 28
    t.false(is(str, 28, 11), "02.08.07");
    t.false(is(str, 28, 13), "02.08.08");
    t.false(is(str, 28, 18), "02.08.09");
    t.false(is(str, 28, 20), "02.08.10");
    t.false(is(str, 28, 28), "02.08.11");
    t.true(is(str, 28, 30), "02.08.12"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.09 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy singles inside doubles, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt='so-called "artists"!'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.09.01");
    t.false(is(str, 9, 20), "02.09.02");
    t.false(is(str, 9, 28), "02.09.03");
    t.true(is(str, 9, 30), "02.09.04"); // <--

    // two pairs of doubles inside a pair of singles - all healthy:
    const str2 = `<img alt='so-called "artists" and "critics"!'/>`;
    t.false(is(str2, 9, 20), "02.09.05");
    t.false(is(str2, 9, 28), "02.09.06");
    t.false(is(str2, 9, 34), "02.09.07");
    t.false(is(str2, 9, 42), "02.09.08");
    t.true(is(str2, 9, 44), "02.09.09"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.10 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy singles inside doubles, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt="so-called 'artists'!"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.10.01");
    t.false(is(str, 9, 20), "02.10.02");
    t.false(is(str, 9, 28), "02.10.03");
    t.true(is(str, 9, 30), "02.10.04"); // <--

    // fin.
    t.end();
  }
);

// S - D - D - S

t.test(
  `02.11 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.11.01");
    t.false(is(str, 9, 20), "02.11.02");
    t.false(is(str, 9, 28), "02.11.03");
    t.true(is(str, 9, 30), "02.11.04"); // <--
    t.false(is(str, 9, 38), "02.11.05");
    t.false(is(str, 9, 41), "02.11.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.12 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class='yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.12.01");
    t.false(is(str, 9, 20), "02.12.02");
    t.false(is(str, 9, 28), "02.12.03");
    t.true(is(str, 9, 30), "02.12.04"); // <--
    t.false(is(str, 9, 38), "02.12.05");
    t.false(is(str, 9, 41), "02.12.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.13 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class="yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.13.01");
    t.false(is(str, 9, 20), "02.13.02");
    t.false(is(str, 9, 28), "02.13.03");
    t.true(is(str, 9, 30), "02.13.04"); // <--
    t.false(is(str, 9, 38), "02.13.05");
    t.false(is(str, 9, 41), "02.13.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.14 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class="yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.14.01");
    t.false(is(str, 9, 20), "02.14.02");
    t.false(is(str, 9, 28), "02.14.03");
    t.true(is(str, 9, 30), "02.14.04"); // <--
    t.false(is(str, 9, 38), "02.14.05");
    t.false(is(str, 9, 41), "02.14.06");

    // fin.
    t.end();
  }
);

//
//
//
//
//
//
//          M   I   S   M   A   T   C   H   I   N   G
//
//
//
//
//
//

// S - D - D - D

t.test(
  `02.15 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.15.01");
    t.false(is(str, 9, 20), "02.15.02");
    t.false(is(str, 9, 28), "02.15.03");
    t.true(is(str, 9, 30), "02.15.04"); // <--
    t.false(is(str, 9, 38), "02.15.05");
    t.false(is(str, 9, 41), "02.15.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.16 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class='yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.16.01");
    t.false(is(str, 9, 20), "02.16.02");
    t.false(is(str, 9, 28), "02.16.03");
    t.true(is(str, 9, 30), "02.16.04"); // <--
    t.false(is(str, 9, 38), "02.16.05");
    t.false(is(str, 9, 41), "02.16.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.17 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class="yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.17.01");
    t.false(is(str, 9, 20), "02.17.02");
    t.false(is(str, 9, 28), "02.17.03");
    t.true(is(str, 9, 30), "02.17.04"); // <--
    t.false(is(str, 9, 38), "02.17.05");
    t.false(is(str, 9, 41), "02.17.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.18 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class="yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.18.01");
    t.false(is(str, 9, 20), "02.18.02");
    t.false(is(str, 9, 28), "02.18.03");
    t.true(is(str, 9, 30), "02.18.04"); // <--
    t.false(is(str, 9, 38), "02.18.05");
    t.false(is(str, 9, 41), "02.18.06");

    // fin.
    t.end();
  }
);

// D - D - D - S

t.test(
  `02.19 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.19.01");
    t.false(is(str, 9, 20), "02.19.02");
    t.false(is(str, 9, 28), "02.19.03");
    t.true(is(str, 9, 30), "02.19.04"); // <--
    t.false(is(str, 9, 38), "02.19.05");
    t.false(is(str, 9, 41), "02.19.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.20 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - false positive of 02.19.*`,
  (t) => {
    const str = `<img alt="so-called "artists"class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.20.01");
    t.false(is(str, 9, 20), "02.20.02");
    t.true(is(str, 9, 28), "02.20.03"); // <--
    t.false(is(str, 9, 35), "02.20.04");
    t.false(is(str, 9, 38), "02.20.05");

    // fin.
    t.end();
  }
);

t.test(
  `02.21 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class='yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.21.01");
    t.false(is(str, 9, 20), "02.21.02");
    t.false(is(str, 9, 28), "02.21.03");
    t.true(is(str, 9, 30), "02.21.04"); // <--
    t.false(is(str, 9, 38), "02.21.05");
    t.false(is(str, 9, 41), "02.21.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.22 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class="yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.22.01");
    t.false(is(str, 9, 20), "02.22.02");
    t.false(is(str, 9, 28), "02.22.03");
    t.true(is(str, 9, 30), "02.22.04"); // <--
    t.false(is(str, 9, 38), "02.22.05");
    t.false(is(str, 9, 41), "02.22.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.23 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class="yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.23.01");
    t.false(is(str, 9, 20), "02.23.02");
    t.false(is(str, 9, 28), "02.23.03");
    t.true(is(str, 9, 30), "02.23.04"); // <--
    t.false(is(str, 9, 38), "02.23.05");
    t.false(is(str, 9, 41), "02.23.06");

    // fin.
    t.end();
  }
);

//
//
//
//
//
//
//
//
//                         ONE QUOTE INSIDE
//
//
//
//
//
//
//
//

t.test(
  `02.24 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt="Deal is your's!'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.24.01");
    t.false(is(str, 9, 22), "02.24.02");
    t.true(is(str, 9, 25), "02.24.03"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.25 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt='Deal is your's!"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.25.01");
    t.false(is(str, 9, 22), "02.25.02");
    t.true(is(str, 9, 25), "02.25.03"); // <--

    // more tags follow
    const str2 = `<img alt='Deal is your's!"/><span class="h'>zzz</span>`;

    // alt opening at 9
    t.false(is(str2, 9, 9), "02.25.04");
    t.false(is(str2, 9, 22), "02.25.05");
    t.true(is(str2, 9, 25), "02.25.06"); // <--
    t.false(is(str2, 9, 40), "02.25.07");
    t.false(is(str2, 9, 42), "02.25.08");

    const str3 = `<img alt='Deal is your's"/>`;
    t.true(is(str3, 9, 24), "02.25.09");

    // anti-pattern
    const str4 = `<img alt='Deal is your'class""/>`;
    t.true(is(str4, 9, 22), "02.25.10");
    t.false(is(str4, 9, 28), "02.25.11");
    t.false(is(str4, 9, 29), "02.25.12");

    // anti-pattern
    const str5 = `<img alt='Deal is your'class="/>`;
    t.true(is(str5, 9, 22), "02.25.10");
    t.false(is(str5, 9, 29), "02.25.11");

    // fin.
    t.end();
  }
);

t.test(
  `02.26 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m - more follows`,
  (t) => {
    // D-D follows
    const str1 = `<img alt="Deal is your's!' class="tralala"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 9), "02.26.01");
    t.false(is(str1, 9, 22), "02.26.02");
    t.true(is(str1, 9, 25), "02.26.03"); // <--
    t.false(is(str1, 9, 33), "02.26.04");
    t.false(is(str1, 9, 41), "02.26.05");

    // D-S follows
    const str2 = `<img alt="Deal is your's!' class="tralala'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 9), "02.26.06");
    t.false(is(str2, 9, 22), "02.26.07");
    t.true(is(str2, 9, 25), "02.26.08"); // <--
    t.false(is(str2, 9, 33), "02.26.09");
    t.false(is(str2, 9, 41), "02.26.10");

    // S-D follows
    const str3 = `<img alt="Deal is your's!' class='tralala"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 9), "02.26.11");
    t.false(is(str3, 9, 22), "02.26.12");
    t.true(is(str3, 9, 25), "02.26.13"); // <--
    t.false(is(str3, 9, 33), "02.26.14");
    t.false(is(str3, 9, 41), "02.26.15");

    // S-S follows
    const str4 = `<img alt="Deal is your's!' class='tralala'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 9), "02.26.16");
    t.false(is(str4, 9, 22), "02.26.17");
    t.true(is(str4, 9, 25), "02.26.18"); // <--
    t.false(is(str4, 9, 33), "02.26.19");
    t.false(is(str4, 9, 41), "02.26.20");

    // fin.
    t.end();
  }
);

t.test(
  `02.27 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m - more follows`,
  (t) => {
    // D-D follows
    const str1 = `<img alt='Deal is your's!" class="tralala"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 9), "02.27.01");
    t.false(is(str1, 9, 22), "02.27.02");
    t.true(is(str1, 9, 25), "02.27.03"); // <--
    t.false(is(str1, 9, 33), "02.27.04");
    t.false(is(str1, 9, 41), "02.27.05");

    // D-S follows
    const str2 = `<img alt='Deal is your's!" class="tralala'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 9), "02.27.06");
    t.false(is(str2, 9, 22), "02.27.07");
    t.true(is(str2, 9, 25), "02.27.08"); // <--
    t.false(is(str2, 9, 33), "02.27.09");
    t.false(is(str2, 9, 41), "02.27.10");

    // S-D follows
    const str3 = `<img alt='Deal is your's!" class='tralala"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 9), "02.27.11");
    t.false(is(str3, 9, 22), "02.27.12");
    t.true(is(str3, 9, 25), "02.27.13"); // <--
    t.false(is(str3, 9, 33), "02.27.14");
    t.false(is(str3, 9, 41), "02.27.15");

    // S-S follows
    const str4 = `<img alt='Deal is your's!" class='tralala'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 9), "02.27.16");
    t.false(is(str4, 9, 22), "02.27.17");
    t.true(is(str4, 9, 25), "02.27.18"); // <--
    t.false(is(str4, 9, 33), "02.27.19");
    t.false(is(str4, 9, 41), "02.27.20");

    // fin.
    t.end();
  }
);

t.test(
  `02.28 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "02.28.01");
    t.false(is(str1, 9, 28), "02.28.02");
    t.true(is(str1, 9, 30), "02.28.03"); // <--

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!"/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "02.28.04");
    t.false(is(str2, 9, 28), "02.28.05");
    t.true(is(str2, 9, 30), "02.28.06"); // <--

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!'/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "02.28.07");
    t.false(is(str3, 9, 28), "02.28.08");
    t.true(is(str3, 9, 30), "02.28.09"); // <--

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "02.28.10");
    t.false(is(str4, 9, 28), "02.28.11");
    t.true(is(str4, 9, 30), "02.28.12"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.29 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, D-D`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id="yo"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "02.29.01");
    t.false(is(str1, 9, 28), "02.29.02");
    t.true(is(str1, 9, 30), "02.29.03"); // <--
    t.false(is(str1, 9, 35), "02.29.04");
    t.false(is(str1, 9, 38), "02.29.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id="yo"/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "02.29.06");
    t.false(is(str2, 9, 28), "02.29.07");
    t.true(is(str2, 9, 30), "02.29.08"); // <--
    t.false(is(str1, 9, 35), "02.29.09");
    t.false(is(str1, 9, 38), "02.29.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id="yo"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "02.29.11");
    t.false(is(str3, 9, 28), "02.29.12");
    t.true(is(str3, 9, 30), "02.29.13"); // <--
    t.false(is(str1, 9, 35), "02.29.14");
    t.false(is(str1, 9, 38), "02.29.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id="yo"/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "02.29.16");
    t.false(is(str4, 9, 28), "02.29.17");
    t.true(is(str4, 9, 30), "02.29.18"); // <--
    t.false(is(str1, 9, 35), "02.29.19");
    t.false(is(str1, 9, 38), "02.29.20");

    // fin.
    t.end();
  }
);

t.test(
  `02.30 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, D-S`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id="yo'/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "02.30.01");
    t.false(is(str1, 9, 28), "02.30.02");
    t.true(is(str1, 9, 30), "02.30.03"); // <--
    t.false(is(str1, 9, 35), "02.30.04");
    t.false(is(str1, 9, 38), "02.30.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id="yo'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "02.30.06");
    t.false(is(str2, 9, 28), "02.30.07");
    t.true(is(str2, 9, 30), "02.30.08"); // <--
    t.false(is(str1, 9, 35), "02.30.09");
    t.false(is(str1, 9, 38), "02.30.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id="yo'/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "02.30.11");
    t.false(is(str3, 9, 28), "02.30.12");
    t.true(is(str3, 9, 30), "02.30.13"); // <--
    t.false(is(str1, 9, 35), "02.30.14");
    t.false(is(str1, 9, 38), "02.30.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id="yo'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "02.30.16");
    t.false(is(str4, 9, 28), "02.30.17");
    t.true(is(str4, 9, 30), "02.30.18"); // <--
    t.false(is(str1, 9, 35), "02.30.19");
    t.false(is(str1, 9, 38), "02.30.20");

    // fin.
    t.end();
  }
);

t.test(
  `02.31 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, S-D`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id='yo"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "02.31.01");
    t.false(is(str1, 9, 28), "02.31.02");
    t.true(is(str1, 9, 30), "02.31.03"); // <--
    t.false(is(str1, 9, 35), "02.31.04");
    t.false(is(str1, 9, 38), "02.31.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id='yo"/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "02.31.06");
    t.false(is(str2, 9, 28), "02.31.07");
    t.true(is(str2, 9, 30), "02.31.08"); // <--
    t.false(is(str1, 9, 35), "02.31.09");
    t.false(is(str1, 9, 38), "02.31.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id='yo"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "02.31.11");
    t.false(is(str3, 9, 28), "02.31.12");
    t.true(is(str3, 9, 30), "02.31.13"); // <--
    t.false(is(str1, 9, 35), "02.31.14");
    t.false(is(str1, 9, 38), "02.31.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id='yo"/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "02.31.16");
    t.false(is(str4, 9, 28), "02.31.17");
    t.true(is(str4, 9, 30), "02.31.18"); // <--
    t.false(is(str1, 9, 35), "02.31.19");
    t.false(is(str1, 9, 38), "02.31.20");

    // fin.
    t.end();
  }
);

t.test(
  `02.32 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, S-S`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id='yo'/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "02.32.01");
    t.false(is(str1, 9, 28), "02.32.02");
    t.true(is(str1, 9, 30), "02.32.03"); // <--
    t.false(is(str1, 9, 35), "02.32.04");
    t.false(is(str1, 9, 38), "02.32.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id='yo'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "02.32.06");
    t.false(is(str2, 9, 28), "02.32.07");
    t.true(is(str2, 9, 30), "02.32.08"); // <--
    t.false(is(str1, 9, 35), "02.32.09");
    t.false(is(str1, 9, 38), "02.32.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id='yo'/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "02.32.11");
    t.false(is(str3, 9, 28), "02.32.12");
    t.true(is(str3, 9, 30), "02.32.13"); // <--
    t.false(is(str1, 9, 35), "02.32.14");
    t.false(is(str1, 9, 38), "02.32.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id='yo'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "02.32.16");
    t.false(is(str4, 9, 28), "02.32.17");
    t.true(is(str4, 9, 30), "02.32.18"); // <--
    t.false(is(str1, 9, 35), "02.32.19");
    t.false(is(str1, 9, 38), "02.32.20");

    // fin.
    t.end();
  }
);

// 03. cheeky cases
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

t.test(
  `03.01 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="="/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.01.01");
    t.true(is(str, 9, 13), "03.01.02"); // <--
    t.false(is(str, 9, 19), "03.01.03");
    t.false(is(str, 9, 21), "03.01.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.01.05");
    t.false(is(str, 19, 13), "03.01.06");
    t.false(is(str, 19, 19), "03.01.07");
    t.true(is(str, 19, 21), "03.01.08"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='='/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.02.01");
    t.true(is(str, 9, 13), "03.02.02"); // <--
    t.false(is(str, 9, 19), "03.02.03");
    t.false(is(str, 9, 21), "03.02.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.02.05");
    t.false(is(str, 19, 13), "03.02.06");
    t.false(is(str, 19, 19), "03.02.07");
    t.true(is(str, 19, 21), "03.02.08"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="='/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.03.01");
    t.true(is(str, 9, 13), "03.03.02"); // <--
    t.false(is(str, 9, 19), "03.03.03");
    t.false(is(str, 9, 21), "03.03.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.03.05");
    t.false(is(str, 19, 13), "03.03.06");
    t.false(is(str, 19, 19), "03.03.07");
    t.true(is(str, 19, 21), "03.03.08"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='="/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.04.01");
    t.true(is(str, 9, 13), "03.04.02"); // <--
    t.false(is(str, 9, 19), "03.04.03");
    t.false(is(str, 9, 21), "03.04.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.04.05");
    t.false(is(str, 19, 13), "03.04.06");
    t.false(is(str, 19, 19), "03.04.07");
    t.true(is(str, 19, 21), "03.04.08"); // <--

    // fin.
    t.end();
  }
);

//
//                               three attributes
//

t.test(
  `03.05 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="=" class="klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.05.01");
    t.true(is(str, 9, 13), "03.05.02"); // <--
    t.false(is(str, 9, 19), "03.05.03");
    t.false(is(str, 9, 21), "03.05.04");
    t.false(is(str, 9, 29), "03.05.05");
    t.false(is(str, 9, 33), "03.05.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.05.05");
    t.false(is(str, 19, 13), "03.05.06");
    t.false(is(str, 19, 19), "03.05.07");
    t.true(is(str, 19, 21), "03.05.08"); // <--
    t.false(is(str, 19, 29), "03.05.05");
    t.false(is(str, 19, 33), "03.05.06");

    // class opening at 29
    t.false(is(str, 29, 9), "03.05.07");
    t.false(is(str, 29, 13), "03.05.08");
    t.false(is(str, 29, 19), "03.05.09");
    t.false(is(str, 29, 21), "03.05.10");
    t.false(is(str, 29, 29), "03.05.11");
    t.true(is(str, 29, 33), "03.05.12"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `03.06 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=' class="klm'/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.06.01");
    t.true(is(str, 9, 13), "03.06.02"); // <--
    t.false(is(str, 9, 19), "03.06.03");
    t.false(is(str, 9, 21), "03.06.04");
    t.false(is(str, 9, 29), "03.06.05");
    t.false(is(str, 9, 33), "03.06.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.06.05");
    t.false(is(str, 19, 13), "03.06.06");
    t.false(is(str, 19, 19), "03.06.07");
    t.true(is(str, 19, 21), "03.06.08"); // <--
    t.false(is(str, 19, 29), "03.06.05");
    t.false(is(str, 19, 33), "03.06.06");

    // class opening at 29
    t.false(is(str, 29, 9), "03.06.07");
    t.false(is(str, 29, 13), "03.06.08");
    t.false(is(str, 29, 19), "03.06.09");
    t.false(is(str, 29, 21), "03.06.10");
    t.false(is(str, 29, 29), "03.06.11");
    t.true(is(str, 29, 33), "03.06.12"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `03.07 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=' class='klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.07.01");
    t.true(is(str, 9, 13), "03.07.02"); // <--
    t.false(is(str, 9, 19), "03.07.03");
    t.false(is(str, 9, 21), "03.07.04");
    t.false(is(str, 9, 29), "03.07.05");
    t.false(is(str, 9, 33), "03.07.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.07.05");
    t.false(is(str, 19, 13), "03.07.06");
    t.false(is(str, 19, 19), "03.07.07");
    t.true(is(str, 19, 21), "03.07.08"); // <--
    t.false(is(str, 19, 29), "03.07.05");
    t.false(is(str, 19, 33), "03.07.06");

    // class opening at 29
    t.false(is(str, 29, 9), "03.07.07");
    t.false(is(str, 29, 13), "03.07.08");
    t.false(is(str, 29, 19), "03.07.09");
    t.false(is(str, 29, 21), "03.07.10");
    t.false(is(str, 29, 29), "03.07.11");
    t.true(is(str, 29, 33), "03.07.12"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `03.08 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class="klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.08.01");
    t.true(is(str, 9, 13), "03.08.02"); // <--
    t.false(is(str, 9, 19), "03.08.03");
    t.false(is(str, 9, 21), "03.08.04");
    t.false(is(str, 9, 29), "03.08.05");
    t.false(is(str, 9, 33), "03.08.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.08.05");
    t.false(is(str, 19, 13), "03.08.06");
    t.false(is(str, 19, 19), "03.08.07");
    t.true(is(str, 19, 21), "03.08.08"); // <--
    t.false(is(str, 19, 29), "03.08.05");
    t.false(is(str, 19, 33), "03.08.06");

    // class opening at 29
    t.false(is(str, 29, 9), "03.08.07");
    t.false(is(str, 29, 13), "03.08.08");
    t.false(is(str, 29, 19), "03.08.09");
    t.false(is(str, 29, 21), "03.08.10");
    t.false(is(str, 29, 29), "03.08.11");
    t.true(is(str, 29, 33), "03.08.12"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `03.09 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class="klm'/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.09.01");
    t.true(is(str, 9, 13), "03.09.02"); // <--
    t.false(is(str, 9, 19), "03.09.03");
    t.false(is(str, 9, 21), "03.09.04");
    t.false(is(str, 9, 29), "03.09.05");
    t.false(is(str, 9, 33), "03.09.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.09.05");
    t.false(is(str, 19, 13), "03.09.06");
    t.false(is(str, 19, 19), "03.09.07");
    t.true(is(str, 19, 21), "03.09.08"); // <--
    t.false(is(str, 19, 29), "03.09.05");
    t.false(is(str, 19, 33), "03.09.06");

    // class opening at 29
    t.false(is(str, 29, 9), "03.09.07");
    t.false(is(str, 29, 13), "03.09.08");
    t.false(is(str, 29, 19), "03.09.09");
    t.false(is(str, 29, 21), "03.09.10");
    t.false(is(str, 29, 29), "03.09.11");
    t.true(is(str, 29, 33), "03.09.12"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `03.10 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class='klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.10.01");
    t.true(is(str, 9, 13), "03.10.02"); // <--
    t.false(is(str, 9, 19), "03.10.03");
    t.false(is(str, 9, 21), "03.10.04");
    t.false(is(str, 9, 29), "03.10.05");
    t.false(is(str, 9, 33), "03.10.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.10.05");
    t.false(is(str, 19, 13), "03.10.06");
    t.false(is(str, 19, 19), "03.10.07");
    t.true(is(str, 19, 21), "03.10.08"); // <--
    t.false(is(str, 19, 29), "03.10.05");
    t.false(is(str, 19, 33), "03.10.06");

    // class opening at 29
    t.false(is(str, 29, 9), "03.10.07");
    t.false(is(str, 29, 13), "03.10.08");
    t.false(is(str, 29, 19), "03.10.09");
    t.false(is(str, 29, 21), "03.10.10");
    t.false(is(str, 29, 29), "03.10.11");
    t.true(is(str, 29, 33), "03.10.12"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `03.11 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class='klm'/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.11.01");
    t.true(is(str, 9, 13), "03.11.02"); // <--
    t.false(is(str, 9, 19), "03.11.03");
    t.false(is(str, 9, 21), "03.11.04");
    t.false(is(str, 9, 29), "03.11.05");
    t.false(is(str, 9, 33), "03.11.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.11.05");
    t.false(is(str, 19, 13), "03.11.06");
    t.false(is(str, 19, 19), "03.11.07");
    t.true(is(str, 19, 21), "03.11.08"); // <--
    t.false(is(str, 19, 29), "03.11.05");
    t.false(is(str, 19, 33), "03.11.06");

    // class opening at 29
    t.false(is(str, 29, 9), "03.11.07");
    t.false(is(str, 29, 13), "03.11.08");
    t.false(is(str, 29, 19), "03.11.09");
    t.false(is(str, 29, 21), "03.11.10");
    t.false(is(str, 29, 29), "03.11.11");
    t.true(is(str, 29, 33), "03.11.12"); // <--

    // fin.
    t.end();
  }
);

// 04. unclosed tags
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

t.test(
  `04.01 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z" click here</a>`;
    t.true(is(str, 8, 10), "04.01");

    // fin.
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z' click here</a>`;
    t.true(is(str, 8, 10), "04.02");

    // fin.
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z" click here</a>`;
    t.true(is(str, 8, 10), "04.03");

    // fin.
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z' click here</a>`;
    t.true(is(str, 8, 10), "04.04");

    // fin.
    t.end();
  }
);

// -----------------------------------------------------------------------------

t.test(
  `04.05 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href="z" class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "04.05.01");
    t.false(is(str1, 8, 18), "04.05.02");
    t.false(is(str1, 8, 21), "04.05.03");

    // D-S follows
    const str2 = `<a href="z" class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "04.05.04");
    t.false(is(str2, 8, 18), "04.05.05");
    t.false(is(str2, 8, 21), "04.05.06");

    // S-D follows
    const str3 = `<a href="z" class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "04.05.07");
    t.false(is(str3, 8, 18), "04.05.08");
    t.false(is(str3, 8, 21), "04.05.09");

    // S-S follows
    const str4 = `<a href="z" class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "04.05.10");
    t.false(is(str4, 8, 18), "04.05.11");
    t.false(is(str4, 8, 21), "04.05.12");

    // fin.
    t.end();
  }
);

t.test(
  `04.06 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href="z' class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "04.06.01");
    t.false(is(str1, 8, 18), "04.06.02");
    t.false(is(str1, 8, 21), "04.06.03");

    // D-S follows
    const str2 = `<a href="z' class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "04.06.04");
    t.false(is(str2, 8, 18), "04.06.05");
    t.false(is(str2, 8, 21), "04.06.06");

    // S-D follows
    const str3 = `<a href="z' class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "04.06.07");
    t.false(is(str3, 8, 18), "04.06.08");
    t.false(is(str3, 8, 21), "04.06.09");

    // S-S follows
    const str4 = `<a href="z' class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "04.06.10");
    t.false(is(str4, 8, 18), "04.06.11");
    t.false(is(str4, 8, 21), "04.06.12");

    // fin.
    t.end();
  }
);

t.test(
  `04.07 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href='z" class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "04.07.01");
    t.false(is(str1, 8, 18), "04.07.02");
    t.false(is(str1, 8, 21), "04.07.03");

    // D-S follows
    const str2 = `<a href='z" class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "04.07.04");
    t.false(is(str2, 8, 18), "04.07.05");
    t.false(is(str2, 8, 21), "04.07.06");

    // S-D follows
    const str3 = `<a href='z" class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "04.07.07");
    t.false(is(str3, 8, 18), "04.07.08");
    t.false(is(str3, 8, 21), "04.07.09");

    // S-S follows
    const str4 = `<a href='z" class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "04.07.10");
    t.false(is(str4, 8, 18), "04.07.11");
    t.false(is(str4, 8, 21), "04.07.12");

    // fin.
    t.end();
  }
);

t.test(
  `04.08 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href='z' class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "04.08.01");
    t.false(is(str1, 8, 18), "04.08.02");
    t.false(is(str1, 8, 21), "04.08.03");

    // D-S follows
    const str2 = `<a href='z' class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "04.08.04");
    t.false(is(str2, 8, 18), "04.08.05");
    t.false(is(str2, 8, 21), "04.08.06");

    // S-D follows
    const str3 = `<a href='z' class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "04.08.07");
    t.false(is(str3, 8, 18), "04.08.08");
    t.false(is(str3, 8, 21), "04.08.09");

    // S-S follows
    const str4 = `<a href='z' class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "04.08.10");
    t.false(is(str4, 8, 18), "04.08.11");
    t.false(is(str4, 8, 21), "04.08.12");

    // fin.
    t.end();
  }
);

// -----------------------------------------------------------------------------

t.test(
  `04.09 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z"</a>`;
    t.true(is(str, 8, 10), "04.09");

    // fin.
    t.end();
  }
);

t.test(
  `04.10 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z'</a>`;
    t.true(is(str, 8, 10), "04.10");

    // fin.
    t.end();
  }
);

t.test(
  `04.11 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z"</a>`;
    t.true(is(str, 8, 10), "04.11");

    // fin.
    t.end();
  }
);

t.test(
  `04.12 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z'</a>`;
    t.true(is(str, 8, 10), "04.12");

    // fin.
    t.end();
  }
);

// 05. attribute starts without a quote
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

t.test(
  `05.01 - ${`\u001b[${35}m${`opening missing`}\u001b[${39}m`} - one tag pair, one attr`,
  (t) => {
    const str = `<a href=z">click here</a>`;

    t.true(is(str, 8, 9), "05.01");

    // fin.
    t.end();
  }
);

t.test(
  `05.02 - ${`\u001b[${35}m${`opening missing`}\u001b[${39}m`} - one tag pair, another attr follows`,
  (t) => {
    // D-D follows
    const str1 = `<a href=z" class="yo">click here</a>`;

    t.true(is(str1, 8, 9), "05.01.01");
    t.false(is(str1, 8, 17), "05.01.02");
    t.false(is(str1, 8, 20), "05.01.03");

    // D-S follows
    const str2 = `<a href=z" class="yo'>click here</a>`;

    t.true(is(str2, 8, 9), "05.01.04");
    t.false(is(str2, 8, 17), "05.01.05");
    t.false(is(str2, 8, 20), "05.01.06");

    //          off-tangent a little bit...
    const str2_1 = `<a href=z" class="yo' id='ey">click here</a>`;

    t.true(is(str2_1, 8, 9), "05.01.07");
    t.false(is(str2_1, 8, 17), "05.01.08");
    t.false(is(str2_1, 8, 20), "05.01.09");
    t.false(is(str2_1, 8, 25), "05.01.10");
    t.false(is(str2_1, 8, 28), "05.01.11");

    const str2_2 = `<a href=z" class="yo' id='ey>click here</a>`;

    t.true(is(str2_2, 8, 9), "05.01.12");
    t.false(is(str2_2, 8, 17), "05.01.13");
    t.false(is(str2_2, 8, 20), "05.01.14");
    t.false(is(str2_2, 8, 25), "05.01.15");

    // S-D follows
    const str3 = `<a href=z" class='yo">click here</a>`;

    t.true(is(str3, 8, 9), "05.01.16");
    t.false(is(str3, 8, 17), "05.01.17");
    t.false(is(str3, 8, 20), "05.01.18");

    const str3_1 = `<a href=z" class='yo" id="ey'>click here</a>`;

    t.true(is(str3_1, 8, 9), "05.01.19");
    t.false(is(str3_1, 8, 17), "05.01.20");
    t.false(is(str3_1, 8, 20), "05.01.21");
    t.false(is(str2_2, 8, 25), "05.01.22");
    t.false(is(str2_2, 8, 28), "05.01.23");

    // S-S follows
    const str4 = `<a href=z" class='yo'>click here</a>`;

    t.true(is(str4, 8, 9), "05.01.24");
    t.false(is(str4, 8, 17), "05.01.25");
    t.false(is(str4, 8, 20), "05.01.26");

    //                a provocation...
    const str4_1 = `<a href=z" class='yo' id='ey">click here</a>`;

    t.true(is(str4_1, 8, 9), "05.01.27");
    t.false(is(str4_1, 8, 17), "05.01.28");
    t.false(is(str4_1, 8, 20), "05.01.29");
    t.false(is(str4_1, 8, 25), "05.01.30");
    t.false(is(str4_1, 8, 28), "05.01.31");

    // fin.
    t.end();
  }
);

// 06. repeated equals
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

t.test(
  `06.01 - ${`\u001b[${90}m${`repeated equal`}\u001b[${39}m`} - one tag, one attr`,
  (t) => {
    const str = `<a b=="c" d=='e'>`;

    // b opening at 6
    t.false(is(str, 6, 6), "06.01.01");
    t.true(is(str, 6, 8), "06.01.02"); // <--
    t.false(is(str, 6, 13), "06.01.03");
    t.false(is(str, 6, 15), "06.01.04");

    // d opening at 13
    t.false(is(str, 13, 6), "06.01.05");
    t.false(is(str, 13, 8), "06.01.06");
    t.false(is(str, 13, 13), "06.01.07");
    t.true(is(str, 13, 15), "06.01.08"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `06.02 - ${`\u001b[${90}m${`repeated equal`}\u001b[${39}m`} - one tag, one attr, three equals`,
  (t) => {
    const str = `<a b==="c" d==='e'>`;

    // b opening at 7
    t.false(is(str, 7, 7), "06.02.01");
    t.true(is(str, 7, 9), "06.02.02"); // <--
    t.false(is(str, 7, 15), "06.02.03");
    t.false(is(str, 7, 17), "06.02.04");

    // d opening at 15
    t.false(is(str, 15, 7), "06.02.05");
    t.false(is(str, 15, 9), "06.02.06");
    t.false(is(str, 15, 15), "06.02.07");
    t.true(is(str, 15, 17), "06.02.08"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `06.03 - ${`\u001b[${90}m${`repeated equal`}\u001b[${39}m`} - one tag, one attr, three spaced equals`,
  (t) => {
    const str = `<a b = = = "c" d = = = 'e'>`;

    // b opening at 11
    t.false(is(str, 11, 11), "06.03.01");
    t.true(is(str, 11, 13), "06.03.02"); // <--
    t.false(is(str, 11, 23), "06.03.03");
    t.false(is(str, 11, 25), "06.03.04");

    // d opening at 23
    t.false(is(str, 23, 11), "06.03.05");
    t.false(is(str, 23, 13), "06.03.06");
    t.false(is(str, 23, 23), "06.03.07");
    t.true(is(str, 23, 25), "06.03.08"); // <--

    // fin.
    t.end();
  }
);

// 07. equals is replaced with whitespace
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

t.test(
  `07.01 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - one tag, three attrs`,
  (t) => {
    const str = `<a class "c" id 'e' href "www">`;

    // class opening at 9
    t.false(is(str, 9, 9), "07.01.01");
    t.true(is(str, 9, 11), "07.01.02"); // <--
    t.false(is(str, 9, 16), "07.01.03");
    t.false(is(str, 9, 18), "07.01.04");
    t.false(is(str, 9, 25), "07.01.05");
    t.false(is(str, 9, 29), "07.01.06");

    // id opening at 16
    t.false(is(str, 16, 9), "07.01.07");
    t.false(is(str, 16, 11), "07.01.08");
    t.false(is(str, 16, 16), "07.01.09");
    t.true(is(str, 16, 18), "07.01.10"); // <--
    t.false(is(str, 16, 25), "07.01.11");
    t.false(is(str, 16, 29), "07.01.12");

    // href opening at 25
    t.false(is(str, 25, 9), "07.01.13");
    t.false(is(str, 25, 11), "07.01.14");
    t.false(is(str, 25, 16), "07.01.15");
    t.false(is(str, 25, 18), "07.01.16");
    t.false(is(str, 25, 25), "07.01.17");
    t.true(is(str, 25, 29), "07.01.18"); // <--

    // fin.
    t.end();
  }
);

// 08. missing equal, tight
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

// S-S follows

t.test(
  `08.01 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd'e'>.<z fff"g">`;

    // bbb opening at 6
    t.false(is(str, 6, 6), "08.01.01");
    t.true(is(str, 6, 8), "08.01.02"); // <--
    t.false(is(str, 6, 13), "08.01.03");
    t.false(is(str, 6, 15), "08.01.04");
    t.false(is(str, 6, 24), "08.01.05");
    t.false(is(str, 6, 26), "08.01.06");

    // ddd opening at 13
    t.false(is(str, 13, 6), "08.01.07");
    t.false(is(str, 13, 8), "08.01.08");
    t.false(is(str, 13, 13), "08.01.09");
    t.true(is(str, 13, 15), "08.01.10"); // <--
    t.false(is(str, 13, 24), "08.01.11");
    t.false(is(str, 13, 26), "08.01.12");

    // fin.
    t.end();
  }
);

t.test(
  `08.02 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id'e'>`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "08.02.01");
    t.true(is(str, 8, 10), "08.02.02"); // <--
    t.false(is(str, 8, 14), "08.02.03");
    t.false(is(str, 8, 16), "08.02.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "08.02.07");
    t.false(is(str, 14, 10), "08.02.08");
    t.false(is(str, 14, 14), "08.02.09");
    t.true(is(str, 14, 16), "08.02.10"); // <--

    // fin.
    t.end();
  }
);

// S-D follows

t.test(
  `08.03 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd'e">`;

    // 1. the bracket that follows is the last non-whitespace character in string:

    // bbb opening at 6
    t.false(is(str, 6, 6), "08.03.01");
    t.true(is(str, 6, 8), "08.03.02"); // <--
    t.false(is(str, 6, 13), "08.03.03");
    t.false(is(str, 6, 15), "08.03.04");

    // ddd opening at 13
    t.false(is(str, 13, 6), "08.03.07");
    t.false(is(str, 13, 8), "08.03.08");
    t.false(is(str, 13, 13), "08.03.09");
    t.true(is(str, 13, 15), "08.03.10"); // <--

    // 2. even if more tags follow, result's the same:

    const str2 = `<z bbb"c" ddd'e">something's here<z id='x'>`;
    t.true(is(str2, 13, 15), "08.03.11"); // <--
    t.false(is(str2, 13, 26), "08.03.12");
    t.false(is(str2, 13, 39), "08.03.13");
    t.false(is(str2, 13, 41), "08.03.14");

    // fin.
    t.end();
  }
);

t.test(
  `08.04 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id'e">`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "08.04.01");
    t.true(is(str, 8, 10), "08.04.02"); // <--
    t.false(is(str, 8, 14), "08.04.03");
    t.false(is(str, 8, 16), "08.04.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "08.04.07");
    t.false(is(str, 14, 10), "08.04.08");
    t.false(is(str, 14, 14), "08.04.09");
    t.true(is(str, 14, 16), "08.04.10"); // <--

    // fin.
    t.end();
  }
);

// D-S follows

t.test(
  `08.05 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd"e'>`;

    // bbb opening at 6
    t.false(is(str, 6, 6), "08.05.01");
    t.true(is(str, 6, 8), "08.05.02"); // <--
    t.false(is(str, 6, 13), "08.05.03");
    t.false(is(str, 6, 15), "08.05.04");

    // ddd opening at 13
    t.false(is(str, 13, 6), "08.05.07");
    t.false(is(str, 13, 8), "08.05.08");
    t.false(is(str, 13, 13), "08.05.09");
    t.true(is(str, 13, 15), "08.05.10"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `08.06 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id"e'>`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "08.06.01");
    t.true(is(str, 8, 10), "08.06.02"); // <--
    t.false(is(str, 8, 14), "08.06.03");
    t.false(is(str, 8, 16), "08.06.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "08.06.07");
    t.false(is(str, 14, 10), "08.06.08");
    t.false(is(str, 14, 14), "08.06.09");
    t.true(is(str, 14, 16), "08.06.10"); // <--

    // fin.
    t.end();
  }
);

// D-D follows

t.test(
  `08.07 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd"e">`;

    // bbb opening at 6
    t.false(is(str, 6, 6), "08.07.01");
    t.true(is(str, 6, 8), "08.07.02"); // <--
    t.false(is(str, 6, 13), "08.07.03");
    t.false(is(str, 6, 15), "08.07.04");

    // ddd opening at 13
    t.false(is(str, 13, 6), "08.07.07");
    t.false(is(str, 13, 8), "08.07.08");
    t.false(is(str, 13, 13), "08.07.09");
    t.true(is(str, 13, 15), "08.07.10"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `08.08 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id"e">`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "08.08.01");
    t.true(is(str, 8, 10), "08.08.02"); // <--
    t.false(is(str, 8, 14), "08.08.03");
    t.false(is(str, 8, 16), "08.08.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "08.08.07");
    t.false(is(str, 14, 10), "08.08.08");
    t.false(is(str, 14, 14), "08.08.09");
    t.true(is(str, 14, 16), "08.08.10"); // <--

    // fin.
    t.end();
  }
);

// counter-cases, false positives

t.test(
  `08.09 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str1 = `<z bbb"c" ddd'e>`;

    // algorithm picks the 13 because it is matching and 13 is unmatched

    // bbb opening at 6
    t.true(is(str1, 6, 8), "08.09.01"); // <--
    t.false(is(str1, 6, 13), "08.09.02");

    // also,

    const str2 = `<z bbb"c" ddd'e'>`;

    // bbb opening at 6
    t.true(is(str2, 6, 8), "08.09.03"); // <--
    t.false(is(str2, 6, 13), "08.09.04");
    t.false(is(str2, 6, 15), "08.09.05");

    // also, even though href is suspicious, it's wrapped with a matching
    // quote pair so we take it as value, not attribute name

    const str3 = `<z alt"href" www'/>`;

    // bbb opening at 6
    t.true(is(str3, 6, 11), "08.09.06"); // <--
    t.false(is(str3, 6, 16), "08.09.07");

    // but it's enough to mismatch the pair and it becomes...

    const str4 = `<z alt"href=' www'/>`;
    // Algorithm sees this as:
    // <z alt="" href=' ddd'/>

    // bbb opening at 6
    t.false(is(str4, 6, 12), "08.09.08"); // <--
    // even though it's mismatching:
    t.false(is(str4, 6, 17), "08.09.09");

    // but doubles in front:
    const str5 = `<z alt""href' www'/>`;
    t.true(is(str5, 6, 7), "08.09.10"); // <--
    t.false(is(str5, 6, 12), "08.09.11");
    t.false(is(str5, 6, 17), "08.09.12");

    // even doubles can follow,

    const str6 = `<z alt"href' www' id=z"/>`;
    // Algorithm sees this as:
    // <z alt="" href=' ddd'/>

    // bbb opening at 6
    t.false(is(str6, 6, 11), "08.09.13"); // <--
    // even though it's mismatching:
    t.false(is(str6, 6, 16), "08.09.14");
    t.false(is(str6, 6, 22), "08.09.15");

    // fin.
    t.end();
  }
);

t.test(
  `08.10 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' ddd"e>`;

    // but if 13 is mismatching, it will jump to 13 because count of doubles is
    // an even number

    // basically, "outermost quotes count being even number" takes priority
    // over any character or character chunk qualities (like recognised attr name)

    // bbb opening at 6
    t.false(is(str, 6, 8), "08.10.01");
    t.true(is(str, 6, 13), "08.10.02"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `08.11 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' href"e>`;

    // but if 13 is mismatching, it will jump to 13 because count of doubles is
    // an even number

    // basically, "outermost quotes count being even number" takes priority
    // over any character or character chunk qualities (like recognised attr name)

    // bbb opening at 6
    t.true(is(str, 6, 8), "08.11.01"); // <--
    t.false(is(str, 6, 14), "08.11.02");

    // fin.
    t.end();
  }
);

t.test(
  `08.12 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' z href"e>`;

    // z ruins everything, if it's not a known void attribute name

    // bbb opening at 6
    t.false(is(str, 6, 8), "08.12.01");
    t.true(is(str, 6, 16), "08.12.02"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `08.13 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' nowrap href"e>`;

    // nowrap is recognised void attribute

    // bbb opening at 6
    t.true(is(str, 6, 8), "08.13.01"); // <--
    t.false(is(str, 6, 21), "08.13.02");

    // fin.
    t.end();
  }
);

t.test(
  `08.14 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z href"href' href href"href>`;

    // program perceives it as:
    // <z href"href' href href" href>
    // as in
    // <img alt="somethin' fishy going on" class>

    // bbb opening at 7
    t.true(is(str, 7, 12), "08.14.01"); // <--
    t.false(is(str, 7, 23), "08.14.02");

    // fin.
    t.end();
  }
);

t.test(
  `08.15 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // no closing slash on img
    const str1 = `<img alt="somethin' fishy going on' class=">z<a class="y">`;

    // alt opening at 9
    t.false(is(str1, 9, 18), "08.15.01");
    t.true(is(str1, 9, 34), "08.15.02"); // <--
    t.false(is(str1, 9, 42), "08.15.03");
    t.false(is(str1, 9, 54), "08.15.04");
    t.false(is(str1, 9, 56), "08.15.05");

    // closing slash on img present
    const str2 = `<img alt="somethin' fishy going on' class="/>z<a class="y">`;

    // alt opening at 9
    t.false(is(str2, 9, 18), "08.15.06");
    t.true(is(str2, 9, 34), "08.15.07"); // <--
    t.false(is(str2, 9, 42), "08.15.08");
    t.false(is(str2, 9, 55), "08.15.09");
    t.false(is(str2, 9, 57), "08.15.10");

    // fin.
    t.end();
  }
);

// 09. starting index is not on a quote
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

t.test(
  `09.01 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - control`,
  (t) => {
    const str = `<a href="www" class=e'>`;

    // href opening at 8
    t.true(is(str, 8, 12), "09.01.01"); // <--
    t.false(is(str, 8, 21), "09.01.02");

    // class opening at 20
    t.false(is(str, 20, 12), "09.01.03");
    t.true(is(str, 20, 21), "09.01.04"); // <--

    // fin.
    t.end();
  }
);

//              finally, the bizness

t.test(
  `09.02 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, two attrs`,
  (t) => {
    // D-D
    const str1 = `<a href=www" class=e">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "09.02.01"); // <--
    t.false(is(str1, 8, 20), "09.02.02");

    // class opening at 19
    t.false(is(str1, 19, 11), "09.02.03");
    t.true(is(str1, 19, 20), "09.02.04"); // <--

    // D-S
    const str2 = `<a href=www" class=e'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "09.02.05"); // <--
    t.false(is(str2, 8, 20), "09.02.06");

    // class opening at 19
    t.false(is(str2, 19, 11), "09.02.07");
    t.true(is(str2, 19, 20), "09.02.08"); // <--

    // S-D
    const str3 = `<a href=www' class=e">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "09.02.09"); // <--
    t.false(is(str3, 8, 20), "09.02.10");

    // class opening at 19
    t.false(is(str3, 19, 11), "09.02.11");
    t.true(is(str3, 19, 20), "09.02.12"); // <--

    // S-S
    const str4 = `<a href=www' class=e'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "09.02.13"); // <--
    t.false(is(str4, 8, 20), "09.02.14");

    // class opening at 19
    t.false(is(str4, 19, 11), "09.02.15");
    t.true(is(str4, 19, 20), "09.02.16"); // <--

    // fin.
    t.end();
  }
);

// "X" meaning absent
t.test(
  `09.03 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // X-D + X-D + D-D
    const str1 = `<a href=www" class=e" id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "09.03.01"); // <--
    t.false(is(str1, 8, 20), "09.03.02");
    t.false(is(str1, 8, 25), "09.03.03");
    t.false(is(str1, 8, 27), "09.03.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "09.03.05");
    t.true(is(str1, 19, 20), "09.03.06"); // <--
    t.false(is(str1, 19, 25), "09.03.07");
    t.false(is(str1, 19, 27), "09.03.08");

    // X-D + X-D + D-S
    const str2 = `<a href=www" class=e" id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "09.03.09"); // <--
    t.false(is(str2, 8, 20), "09.03.10");
    t.false(is(str2, 8, 25), "09.03.11");
    t.false(is(str2, 8, 27), "09.03.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "09.03.13");
    t.true(is(str2, 19, 20), "09.03.14"); // <--
    t.false(is(str2, 19, 25), "09.03.15");
    t.false(is(str2, 19, 27), "09.03.16");

    // X-D + X-D + S-D
    const str3 = `<a href=www" class=e" id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "09.03.17"); // <--
    t.false(is(str3, 8, 20), "09.03.18");
    t.false(is(str3, 8, 25), "09.03.19");
    t.false(is(str3, 8, 27), "09.03.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "09.03.21");
    t.true(is(str3, 19, 20), "09.03.22"); // <--
    t.false(is(str3, 19, 25), "09.03.23");
    t.false(is(str3, 19, 27), "09.03.24");

    // X-D + X-D + S-S
    const str4 = `<a href=www" class=e" id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "09.03.25"); // <--
    t.false(is(str4, 8, 20), "09.03.26");
    t.false(is(str4, 8, 25), "09.03.27");
    t.false(is(str4, 8, 27), "09.03.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "09.03.29");
    t.true(is(str4, 19, 20), "09.03.30"); // <--
    t.false(is(str4, 19, 25), "09.03.31");
    t.false(is(str4, 19, 27), "09.03.32");

    // X-D + X-D + S-X
    const str5 = `<a href=www" class=e" id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "09.03.33"); // <--
    t.false(is(str5, 8, 20), "09.03.34");
    t.false(is(str5, 8, 25), "09.03.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "09.03.36");
    t.true(is(str5, 19, 20), "09.03.37"); // <--
    t.false(is(str5, 19, 25), "09.03.38");

    // X-D + X-D + D-X
    const str6 = `<a href=www" class=e" id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "09.03.39"); // <--
    t.false(is(str6, 8, 20), "09.03.40");
    t.false(is(str6, 8, 25), "09.03.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "09.03.42");
    t.true(is(str6, 19, 20), "09.03.43"); // <--
    t.false(is(str6, 19, 25), "09.03.44");

    // X-D + X-D + X-S
    const str7 = `<a href=www" class=e" id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "09.03.45"); // <--
    t.false(is(str7, 8, 20), "09.03.46");
    t.false(is(str7, 8, 26), "09.03.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "09.03.48");
    t.true(is(str7, 19, 20), "09.03.49"); // <--
    t.false(is(str7, 19, 26), "09.03.50");

    // X-D + X-D + X-D
    const str8 = `<a href=www" class=e" id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "09.03.51"); // <--
    t.false(is(str8, 8, 20), "09.03.52");
    t.false(is(str8, 8, 26), "09.03.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "09.03.54");
    t.true(is(str8, 19, 20), "09.03.55"); // <--
    t.false(is(str8, 19, 26), "09.03.56");

    // fin.
    t.end();
  }
);

t.test(
  `09.04 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // X-D + X-S + D-D
    const str1 = `<a href=www" class=e' id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "09.04.01"); // <--
    t.false(is(str1, 8, 20), "09.04.02");
    t.false(is(str1, 8, 25), "09.04.03");
    t.false(is(str1, 8, 27), "09.04.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "09.04.05");
    t.true(is(str1, 19, 20), "09.04.06"); // <--
    t.false(is(str1, 19, 25), "09.04.07");
    t.false(is(str1, 19, 27), "09.04.08");

    // X-D + X-S + D-S
    const str2 = `<a href=www" class=e' id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "09.04.09"); // <--
    t.false(is(str2, 8, 20), "09.04.10");
    t.false(is(str2, 8, 25), "09.04.11");
    t.false(is(str2, 8, 27), "09.04.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "09.04.13");
    t.true(is(str2, 19, 20), "09.04.14"); // <--
    t.false(is(str2, 19, 25), "09.04.15");
    t.false(is(str2, 19, 27), "09.04.16");

    // X-D + X-S + S-D
    const str3 = `<a href=www" class=e' id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "09.04.17"); // <--
    t.false(is(str3, 8, 20), "09.04.18");
    t.false(is(str3, 8, 25), "09.04.19");
    t.false(is(str3, 8, 27), "09.04.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "09.04.21");
    t.true(is(str3, 19, 20), "09.04.22"); // <--
    t.false(is(str3, 19, 25), "09.04.23");
    t.false(is(str3, 19, 27), "09.04.24");

    // X-D + X-S + S-S
    const str4 = `<a href=www" class=e' id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "09.04.25"); // <--
    t.false(is(str4, 8, 20), "09.04.26");
    t.false(is(str4, 8, 25), "09.04.27");
    t.false(is(str4, 8, 27), "09.04.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "09.04.29");
    t.true(is(str4, 19, 20), "09.04.30"); // <--
    t.false(is(str4, 19, 25), "09.04.31");
    t.false(is(str4, 19, 27), "09.04.32");

    // X-D + X-S + S-X
    const str5 = `<a href=www" class=e' id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "09.04.33"); // <--
    t.false(is(str5, 8, 20), "09.04.34");
    t.false(is(str5, 8, 25), "09.04.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "09.04.36");
    t.true(is(str5, 19, 20), "09.04.37"); // <--
    t.false(is(str5, 19, 25), "09.04.38");

    // X-D + X-S + D-X
    const str6 = `<a href=www" class=e' id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "09.04.39"); // <--
    t.false(is(str6, 8, 20), "09.04.40");
    t.false(is(str6, 8, 25), "09.04.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "09.04.42");
    t.true(is(str6, 19, 20), "09.04.43"); // <--
    t.false(is(str6, 19, 25), "09.04.44");

    // X-D + X-S + X-S
    const str7 = `<a href=www" class=e' id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "09.04.45"); // <--
    t.false(is(str7, 8, 20), "09.04.46");
    t.false(is(str7, 8, 26), "09.04.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "09.04.48");
    t.true(is(str7, 19, 20), "09.04.49"); // <--
    t.false(is(str7, 19, 26), "09.04.50");

    // X-D + X-S + X-D
    const str8 = `<a href=www" class=e' id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "09.04.51"); // <--
    t.false(is(str8, 8, 20), "09.04.52");
    t.false(is(str8, 8, 26), "09.04.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "09.04.54");
    t.true(is(str8, 19, 20), "09.04.55"); // <--
    t.false(is(str8, 19, 26), "09.04.56");

    // fin.
    t.end();
  }
);

t.test(
  `09.05 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // X-S + X-D + D-D
    const str1 = `<a href=www' class=e" id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "09.05.01"); // <--
    t.false(is(str1, 8, 20), "09.05.02");
    t.false(is(str1, 8, 25), "09.05.03");
    t.false(is(str1, 8, 27), "09.05.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "09.05.05");
    t.true(is(str1, 19, 20), "09.05.06"); // <--
    t.false(is(str1, 19, 25), "09.05.07");
    t.false(is(str1, 19, 27), "09.05.08");

    // X-S + X-D + D-S
    const str2 = `<a href=www' class=e" id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "09.05.09"); // <--
    t.false(is(str2, 8, 20), "09.05.10");
    t.false(is(str2, 8, 25), "09.05.11");
    t.false(is(str2, 8, 27), "09.05.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "09.05.13");
    t.true(is(str2, 19, 20), "09.05.14"); // <--
    t.false(is(str2, 19, 25), "09.05.15");
    t.false(is(str2, 19, 27), "09.05.16");

    // X-S + X-D + S-D
    const str3 = `<a href=www' class=e" id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "09.05.17"); // <--
    t.false(is(str3, 8, 20), "09.05.18");
    t.false(is(str3, 8, 25), "09.05.19");
    t.false(is(str3, 8, 27), "09.05.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "09.05.21");
    t.true(is(str3, 19, 20), "09.05.22"); // <--
    t.false(is(str3, 19, 25), "09.05.23");
    t.false(is(str3, 19, 27), "09.05.24");

    // X-S + X-D + S-S
    const str4 = `<a href=www' class=e" id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "09.05.25"); // <--
    t.false(is(str4, 8, 20), "09.05.26");
    t.false(is(str4, 8, 25), "09.05.27");
    t.false(is(str4, 8, 27), "09.05.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "09.05.29");
    t.true(is(str4, 19, 20), "09.05.30"); // <--
    t.false(is(str4, 19, 25), "09.05.31");
    t.false(is(str4, 19, 27), "09.05.32");

    // X-S + X-D + S-X
    const str5 = `<a href=www' class=e" id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "09.05.33"); // <--
    t.false(is(str5, 8, 20), "09.05.34");
    t.false(is(str5, 8, 25), "09.05.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "09.05.36");
    t.true(is(str5, 19, 20), "09.05.37"); // <--
    t.false(is(str5, 19, 25), "09.05.38");

    // X-S + X-D + D-X
    const str6 = `<a href=www' class=e" id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "09.05.39"); // <--
    t.false(is(str6, 8, 20), "09.05.40");
    t.false(is(str6, 8, 25), "09.05.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "09.05.42");
    t.true(is(str6, 19, 20), "09.05.43"); // <--
    t.false(is(str6, 19, 25), "09.05.44");

    // X-S + X-D + X-S
    const str7 = `<a href=www' class=e" id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "09.05.45"); // <--
    t.false(is(str7, 8, 20), "09.05.46");
    t.false(is(str7, 8, 26), "09.05.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "09.05.48");
    t.true(is(str7, 19, 20), "09.05.49"); // <--
    t.false(is(str7, 19, 26), "09.05.50");

    // X-S + X-D + X-D
    const str8 = `<a href=www' class=e" id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "09.05.51"); // <--
    t.false(is(str8, 8, 20), "09.05.52");
    t.false(is(str8, 8, 26), "09.05.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "09.05.54");
    t.true(is(str8, 19, 20), "09.05.55"); // <--
    t.false(is(str8, 19, 26), "09.05.56");

    // fin.
    t.end();
  }
);

t.test(
  `09.06 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // X-S + X-S + D-D
    const str1 = `<a href=www' class=e' id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "09.06.01"); // <--
    t.false(is(str1, 8, 20), "09.06.02");
    t.false(is(str1, 8, 25), "09.06.03");
    t.false(is(str1, 8, 27), "09.06.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "09.06.05");
    t.true(is(str1, 19, 20), "09.06.06"); // <--
    t.false(is(str1, 19, 25), "09.06.07");
    t.false(is(str1, 19, 27), "09.06.08");

    // X-S + X-S + D-S
    const str2 = `<a href=www' class=e' id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "09.06.09"); // <--
    t.false(is(str2, 8, 20), "09.06.10");
    t.false(is(str2, 8, 25), "09.06.11");
    t.false(is(str2, 8, 27), "09.06.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "09.06.13");
    t.true(is(str2, 19, 20), "09.06.14"); // <--
    t.false(is(str2, 19, 25), "09.06.15");
    t.false(is(str2, 19, 27), "09.06.16");

    // X-S + X-S + S-D
    const str3 = `<a href=www' class=e' id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "09.06.17"); // <--
    t.false(is(str3, 8, 20), "09.06.18");
    t.false(is(str3, 8, 25), "09.06.19");
    t.false(is(str3, 8, 27), "09.06.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "09.06.21");
    t.true(is(str3, 19, 20), "09.06.22"); // <--
    t.false(is(str3, 19, 25), "09.06.23");
    t.false(is(str3, 19, 27), "09.06.24");

    // X-S + X-S + S-S
    const str4 = `<a href=www' class=e' id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "09.06.25"); // <--
    t.false(is(str4, 8, 20), "09.06.26");
    t.false(is(str4, 8, 25), "09.06.27");
    t.false(is(str4, 8, 27), "09.06.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "09.06.29");
    t.true(is(str4, 19, 20), "09.06.30"); // <--
    t.false(is(str4, 19, 25), "09.06.31");
    t.false(is(str4, 19, 27), "09.06.32");

    // X-S + X-S + S-X
    const str5 = `<a href=www' class=e' id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "09.06.33"); // <--
    t.false(is(str5, 8, 20), "09.06.34");
    t.false(is(str5, 8, 25), "09.06.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "09.06.36");
    t.true(is(str5, 19, 20), "09.06.37"); // <--
    t.false(is(str5, 19, 25), "09.06.38");

    // X-S + X-S + D-X
    const str6 = `<a href=www' class=e' id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "09.06.39"); // <--
    t.false(is(str6, 8, 20), "09.06.40");
    t.false(is(str6, 8, 25), "09.06.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "09.06.42");
    t.true(is(str6, 19, 20), "09.06.43"); // <--
    t.false(is(str6, 19, 25), "09.06.44");

    // X-S + X-S + X-S
    const str7 = `<a href=www' class=e' id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "09.06.45"); // <--
    t.false(is(str7, 8, 20), "09.06.46");
    t.false(is(str7, 8, 26), "09.06.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "09.06.48");
    t.true(is(str7, 19, 20), "09.06.49"); // <--
    t.false(is(str7, 19, 26), "09.06.50");

    // X-S + X-S + X-D
    const str8 = `<a href=www' class=e' id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "09.06.51"); // <--
    t.false(is(str8, 8, 20), "09.06.52");
    t.false(is(str8, 8, 26), "09.06.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "09.06.54");
    t.true(is(str8, 19, 20), "09.06.55"); // <--
    t.false(is(str8, 19, 26), "09.06.56");

    // fin.
    t.end();
  }
);

t.todo(`deleteme`, (t) => {
  const str = `<z bbb"c" ddd'e'>.<z fff"g">`;
  t.false(is(str, 6, 15), "08.01.04");
  t.end();
});
