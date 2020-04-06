const t = require("tap");
const is = require("../dist/is-html-attribute-closing.cjs");
// const BACKSLASH = "\u005C";

// 00. Weird cases
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - no input`,
  (t) => {
    t.false(is(), "00.01");
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - input is not a string`,
  (t) => {
    t.false(is(2), "00.02");
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - input is empty string`,
  (t) => {
    t.false(is(""), "00.03");
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - 2nd arg is missing`,
  (t) => {
    t.false(is("a"), "00.04");
    t.end();
  }
);

t.test(
  `00.05 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - 2nd arg is not integer`,
  (t) => {
    t.false(is("a", "a"), "00.05");
    t.end();
  }
);

t.test(
  `00.06 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - 3rd arg is missing`,
  (t) => {
    t.false(is("a", 0), "00.06");
    t.end();
  }
);

t.test(
  `00.07 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - 3rd arg is not integer`,
  (t) => {
    t.false(is("a", 0, "a"), "00.07");
    t.end();
  }
);

t.test(
  `00.08 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - no character in string at what's given by 2nd arg`,
  (t) => {
    t.false(is("a", 99, 100), "00.08");
    t.end();
  }
);

t.test(
  `00.09 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - no character in string at what's given by 3rd arg`,
  (t) => {
    t.false(is("a", 0, 100), "00.09");
    t.end();
  }
);

t.test(
  `00.10 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - indexes equal`,
  (t) => {
    t.false(is("abcde", 2, 2), "00.10");
    t.end();
  }
);

t.test(
  `00.11 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - 3rd > 2nd`,
  (t) => {
    t.false(is("abcde", 2, 1), "00.11");
    t.end();
  }
);

// 01. healthy code
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${32}m${`healthy code`}\u001b[${39}m`} - one tag, one attr, double quotes`,
  (t) => {
    const str = `<a href="zzz">`;
    t.true(is(str, 8, 12), "01.01");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${32}m${`healthy code`}\u001b[${39}m`} - one tag, one attr, single quotes`,
  (t) => {
    const str = `<a href='zzz'>`;
    t.true(is(str, 8, 12), "01.02");
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${32}m${`healthy code`}\u001b[${39}m`} - one tag, few attrs, double quotes`,
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
  `01.04 - ${`\u001b[${32}m${`healthy code`}\u001b[${39}m`} - one tag, few attrs, single quotes`,
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
  `01.05 - ${`\u001b[${32}m${`healthy code`}\u001b[${39}m`} - repeated singles inside doubles`,
  (t) => {
    const str = `<img src="spacer.gif" alt="'''''" width="1" height="1" border="0" style="display:block;"/>`;
    // 0. warmup
    t.false(is(str, 9, 20), "01.05.00");

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
//   LEGEND: S means single, D means double
//
//   For example S-D means single - double (meaning in that order)
//
//
//
//

t.test(
  `02.01 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - basic, D-S`,
  (t) => {
    const str = `<div class="c'>.</div>`;
    t.true(is(str, 11, 13), "02.01.01");

    // fin.
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - basic, S-D`,
  (t) => {
    const str = `<div class='c">.</div>`;
    t.true(is(str, 11, 13), "02.02.01");

    // fin.
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - two attr pairs, D-S D-S`,
  (t) => {
    const str = `<div class="c' id="x'>.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "02.03.01");
    t.true(is(str, 11, 13), "02.03.02"); // <--
    t.false(is(str, 11, 18), "02.03.03");
    t.false(is(str, 11, 20), "02.03.04");

    // id opening at 18
    t.false(is(str, 18, 11), "02.03.05");
    t.false(is(str, 18, 13), "02.03.06");
    t.false(is(str, 18, 18), "02.03.07");
    t.true(is(str, 18, 20), "02.03.08"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - two attr pairs, D-S D-S`,
  (t) => {
    const str = `<div class='c" id='x">.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "02.04.01");
    t.true(is(str, 11, 13), "02.04.02"); // <--
    t.false(is(str, 11, 18), "02.04.03");
    t.false(is(str, 11, 20), "02.04.04");

    // id opening at 18
    t.false(is(str, 18, 11), "02.04.05");
    t.false(is(str, 18, 13), "02.04.06");
    t.false(is(str, 18, 18), "02.04.07");
    t.true(is(str, 18, 20), "02.04.08"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - three attr pairs, D-S D-S S-D`,
  (t) => {
    const str = `<div class="c' id="x' style='c">.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "02.05.01");
    t.true(is(str, 11, 13), "02.05.02"); // <--
    t.false(is(str, 11, 18), "02.05.03");
    t.false(is(str, 11, 20), "02.05.04");
    t.false(is(str, 11, 28), "02.05.05");
    t.false(is(str, 11, 30), "02.05.06");

    // class opening at 18
    t.false(is(str, 18, 11), "02.05.07");
    t.false(is(str, 18, 13), "02.05.08");
    t.false(is(str, 18, 18), "02.05.09");
    t.true(is(str, 18, 20), "02.05.10"); // <--
    t.false(is(str, 18, 28), "02.05.11");
    t.false(is(str, 18, 30), "02.05.12");

    // style opening at 28
    t.false(is(str, 28, 11), "02.05.07");
    t.false(is(str, 28, 13), "02.05.08");
    t.false(is(str, 28, 18), "02.05.09");
    t.false(is(str, 28, 20), "02.05.10");
    t.false(is(str, 28, 28), "02.05.11");
    t.true(is(str, 28, 30), "02.05.12"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - three attr pairs, S-D S-D D-S`,
  (t) => {
    const str = `<div class='c" id='x" style="c'>.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "02.06.01");
    t.true(is(str, 11, 13), "02.06.02"); // <--
    t.false(is(str, 11, 18), "02.06.03");
    t.false(is(str, 11, 20), "02.06.04");
    t.false(is(str, 11, 28), "02.06.05");
    t.false(is(str, 11, 30), "02.06.06");

    // class opening at 18
    t.false(is(str, 18, 11), "02.06.07");
    t.false(is(str, 18, 13), "02.06.08");
    t.false(is(str, 18, 18), "02.06.09");
    t.true(is(str, 18, 20), "02.06.10"); // <--
    t.false(is(str, 18, 28), "02.06.11");
    t.false(is(str, 18, 30), "02.06.12");

    // style opening at 28
    t.false(is(str, 28, 11), "02.06.07");
    t.false(is(str, 28, 13), "02.06.08");
    t.false(is(str, 28, 18), "02.06.09");
    t.false(is(str, 28, 20), "02.06.10");
    t.false(is(str, 28, 28), "02.06.11");
    t.true(is(str, 28, 30), "02.06.12"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy singles inside doubles, S-D-D-S`,
  (t) => {
    const str = `<img alt='so-called "artists"!'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.06.01");
    t.false(is(str, 9, 20), "02.06.02");
    t.false(is(str, 9, 28), "02.06.03");
    t.true(is(str, 9, 30), "02.06.04"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.07 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy singles inside doubles, S-D-D-S`,
  (t) => {
    const str = `<img alt="so-called 'artists'!"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.07.01");
    t.false(is(str, 9, 20), "02.07.02");
    t.false(is(str, 9, 28), "02.07.03");
    t.true(is(str, 9, 30), "02.07.04"); // <--

    // fin.
    t.end();
  }
);

// S - D - D - S

t.test(
  `02.08 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy S-D-D-S, S-S follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.08.01");
    t.false(is(str, 9, 20), "02.08.02");
    t.false(is(str, 9, 28), "02.08.03");
    t.true(is(str, 9, 30), "02.08.04"); // <--
    t.false(is(str, 9, 38), "02.08.05");
    t.false(is(str, 9, 41), "02.08.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.09 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy S-D-D-S, S-D follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class='yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.09.01");
    t.false(is(str, 9, 20), "02.09.02");
    t.false(is(str, 9, 28), "02.09.03");
    t.true(is(str, 9, 30), "02.09.04"); // <--
    t.false(is(str, 9, 38), "02.09.05");
    t.false(is(str, 9, 41), "02.09.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.10 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy S-D-D-S, D-S follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class="yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.10.01");
    t.false(is(str, 9, 20), "02.10.02");
    t.false(is(str, 9, 28), "02.10.03");
    t.true(is(str, 9, 30), "02.10.04"); // <--
    t.false(is(str, 9, 38), "02.10.05");
    t.false(is(str, 9, 41), "02.10.06");

    // fin.
    t.end();
  }
);

t.test(
  `02.11 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy S-D-D-S, D-D follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class="yo"/>`;

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
  `02.12 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy S-D-D-D, S-S follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class='yo'/>`;

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
  `02.13 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy S-D-D-D, S-D follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class='yo"/>`;

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
  `02.14 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy S-D-D-D, D-S follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class="yo'/>`;

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

t.test(
  `02.15 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy S-D-D-D, D-D follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class="yo"/>`;

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

// D - D - D - S

t.test(
  `02.16 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy D-D-D-S, S-S follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class='yo'/>`;

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
  `02.17 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy D-D-D-S, S-D follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class='yo"/>`;

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
  `02.18 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy D-D-D-S, D-S follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class="yo'/>`;

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

t.test(
  `02.19 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy D-D-D-S, D-D follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class="yo"/>`;

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
  `02.20 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside D-S-S`,
  (t) => {
    const str = `<img alt="Deal is your's!'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.20.01");
    t.false(is(str, 9, 22), "02.20.02");
    t.true(is(str, 9, 25), "02.20.03"); // <--

    // fin.
    t.end();
  }
);

t.test(
  `02.21 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside D-S-S`,
  (t) => {
    const str = `<img alt='Deal is your's!"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "02.21.01");
    t.false(is(str, 9, 22), "02.21.02");
    t.true(is(str, 9, 25), "02.21.03"); // <--

    // fin.
    t.end();
  }
);

// -----------------------------------------------------------------------------
