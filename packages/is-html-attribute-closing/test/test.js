import tap from "tap";
import is from "../dist/is-html-attribute-closing.esm";
// const BACKSLASH = "\u005C";

// 00. Weird cases
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - no input`,
  (t) => {
    t.false(is(), "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - input is not a string`,
  (t) => {
    t.false(is(2), "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - input is empty string`,
  (t) => {
    t.false(is(""), "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 2nd arg is missing`,
  (t) => {
    t.false(is("a"), "04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 2nd arg is not integer`,
  (t) => {
    t.false(is("a", "a"), "05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 3rd arg is missing`,
  (t) => {
    t.false(is("a", 0), "06");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 3rd arg is not integer`,
  (t) => {
    t.false(is("a", 0, "a"), "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - no character in string at what's given by 2nd arg`,
  (t) => {
    t.false(is("a", 99, 100), "08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - no character in string at what's given by 3rd arg`,
  (t) => {
    t.false(is("a", 0, 100), "09");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - indexes equal`,
  (t) => {
    t.false(is("abcde", 2, 2), "10");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 3rd > 2nd`,
  (t) => {
    t.false(is("abcde", 2, 1), "11");
    t.end();
  }
);

// 01. healthy code
// -----------------------------------------------------------------------------

tap.test(
  `12 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, one attr, double quotes`,
  (t) => {
    const str = `<a href="zzz">`;
    t.true(is(str, 8, 12), "12");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, one attr, single quotes`,
  (t) => {
    const str = `<a href='zzz'>`;
    t.true(is(str, 8, 12), "13");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, few attrs, double quotes`,
  (t) => {
    const str = `<a href="zzz" target="_blank" style="color: black;">`;
    // 1. starting at the opening of "href":
    t.false(is(str, 8, 8), "14.01");
    t.true(is(str, 8, 12), "14.02"); // <--
    t.false(is(str, 8, 21), "14.03");
    t.false(is(str, 8, 28), "14.04");
    t.false(is(str, 8, 36), "14.05");
    t.false(is(str, 8, 50), "14.06");

    // 2. starting at the opening of "target":
    t.false(is(str, 21, 8), "14.07");
    t.false(is(str, 21, 12), "14.08");
    t.false(is(str, 21, 21), "14.09");
    t.true(is(str, 21, 28), "14.10"); // <--
    t.false(is(str, 21, 36), "14.11");
    t.false(is(str, 21, 50), "14.12");

    // 3. starting at the opening of "style":
    t.false(is(str, 36, 8), "14.13");
    t.false(is(str, 36, 12), "14.14");
    t.false(is(str, 36, 21), "14.15");
    t.false(is(str, 36, 28), "14.16");
    t.false(is(str, 36, 36), "14.17");
    t.true(is(str, 36, 50), "14.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, few attrs, single quotes`,
  (t) => {
    const str = `<a href='zzz' target='_blank' style='color: black;'>`;
    // 1. starting at the opening of "href":
    t.false(is(str, 8, 8), "15.01");
    t.true(is(str, 8, 12), "15.02"); // <--
    t.false(is(str, 8, 21), "15.03");
    t.false(is(str, 8, 28), "15.04");
    t.false(is(str, 8, 36), "15.05");
    t.false(is(str, 8, 50), "15.06");

    // 2. starting at the opening of "target":
    t.false(is(str, 21, 8), "15.07");
    t.false(is(str, 21, 12), "15.08");
    t.false(is(str, 21, 21), "15.09");
    t.true(is(str, 21, 28), "15.10"); // <--
    t.false(is(str, 21, 36), "15.11");
    t.false(is(str, 21, 50), "15.12");

    // 3. starting at the opening of "style":
    t.false(is(str, 36, 8), "15.13");
    t.false(is(str, 36, 12), "15.14");
    t.false(is(str, 36, 21), "15.15");
    t.false(is(str, 36, 28), "15.16");
    t.false(is(str, 36, 36), "15.17");
    t.true(is(str, 36, 50), "15.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - repeated singles inside doubles`,
  (t) => {
    const str = `<img src="spacer.gif" alt="'''''" width="1" height="1" border="0" style="display:block;"/>`;
    // 0. warmup
    t.true(is(str, 9, 20), "16.01");

    // 1. the bizness
    t.false(is(str, 26, 9), "16.02");
    t.false(is(str, 26, 20), "16.03");
    t.false(is(str, 26, 26), "16.04");
    t.false(is(str, 26, 27), "16.05");
    t.false(is(str, 26, 28), "16.06");
    t.false(is(str, 26, 29), "16.07");
    t.false(is(str, 26, 30), "16.08");
    t.false(is(str, 26, 31), "16.09");
    t.true(is(str, 26, 32), "16.10"); // <--
    t.false(is(str, 26, 40), "16.11");

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

tap.test(
  `17 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap`,
  (t) => {
    // healthy tag being:
    // <img alt='so-called "artists"!' class='yo'/>

    const str = `<img alt="so-called "artists"!' class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 20), "17.01");
    t.false(is(str, 9, 28), "17.02");
    t.true(is(str, 9, 30), "17.03"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - similar but opposite`,
  (t) => {
    // healthy tag being:
    // <img class="so-called" alt="!" border='10'/>

    const str = `<img class="so-called "alt"!' border='10'/>`;

    // class opening at 11
    t.true(is(str, 11, 22), "18.01"); // <-- !!!
    t.false(is(str, 11, 26), "18.02");
    t.false(is(str, 11, 28), "18.03");
    t.false(is(str, 11, 37), "18.04");
    t.false(is(str, 11, 40), "18.05");

    // fin.
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - also similar`,
  (t) => {
    // healthy tag being:
    // <img class="so-called" alt="!" border='10'/>

    const str = `<img class="so-called "alt !' border 10'/>`;

    // class opening at 11
    t.true(is(str, 11, 22), "19.01");
    t.false(is(str, 11, 28), "19.02");
    t.false(is(str, 11, 39), "19.03");

    // fin.
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - basic, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="="/>`;
    t.true(is(str, 19, 21), "20"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - two attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<div class="c' id="x'>.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "21.01");
    t.true(is(str, 11, 13), "21.02"); // <--
    t.false(is(str, 11, 18), "21.03");
    t.false(is(str, 11, 20), "21.04");

    // id opening at 18
    t.false(is(str, 18, 11), "21.05");
    t.false(is(str, 18, 13), "21.06");
    t.false(is(str, 18, 18), "21.07");
    t.true(is(str, 18, 20), "21.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - two attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<div class='c" id='x">.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "22.01");
    t.true(is(str, 11, 13), "22.02"); // <--
    t.false(is(str, 11, 18), "22.03");
    t.false(is(str, 11, 20), "22.04");

    // id opening at 18
    t.false(is(str, 18, 11), "22.05");
    t.false(is(str, 18, 13), "22.06");
    t.false(is(str, 18, 18), "22.07");
    t.true(is(str, 18, 20), "22.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - three attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<div class="c' id="x' style='c">.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "23.01");
    t.true(is(str, 11, 13), "23.02"); // <--
    t.false(is(str, 11, 18), "23.03");
    t.false(is(str, 11, 20), "23.04");
    t.false(is(str, 11, 28), "23.05");
    t.false(is(str, 11, 30), "23.06");

    // class opening at 18
    t.false(is(str, 18, 11), "23.07");
    t.false(is(str, 18, 13), "23.08");
    t.false(is(str, 18, 18), "23.09");
    t.true(is(str, 18, 20), "23.10"); // <--
    t.false(is(str, 18, 28), "23.11");
    t.false(is(str, 18, 30), "23.12");

    // style opening at 28
    t.false(is(str, 28, 11), "23.13");
    t.false(is(str, 28, 13), "23.14");
    t.false(is(str, 28, 18), "23.15");
    t.false(is(str, 28, 20), "23.16");
    t.false(is(str, 28, 28), "23.17");
    t.true(is(str, 28, 30), "23.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - three attr pairs, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<div class='c" id='x" style="c'>.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "24.01");
    t.true(is(str, 11, 13), "24.02"); // <--
    t.false(is(str, 11, 18), "24.03");
    t.false(is(str, 11, 20), "24.04");
    t.false(is(str, 11, 28), "24.05");
    t.false(is(str, 11, 30), "24.06");

    // class opening at 18
    t.false(is(str, 18, 11), "24.07");
    t.false(is(str, 18, 13), "24.08");
    t.false(is(str, 18, 18), "24.09");
    t.true(is(str, 18, 20), "24.10"); // <--
    t.false(is(str, 18, 28), "24.11");
    t.false(is(str, 18, 30), "24.12");

    // style opening at 28
    t.false(is(str, 28, 11), "24.13");
    t.false(is(str, 28, 13), "24.14");
    t.false(is(str, 28, 18), "24.15");
    t.false(is(str, 28, 20), "24.16");
    t.false(is(str, 28, 28), "24.17");
    t.true(is(str, 28, 30), "24.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy singles inside doubles, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt='so-called "artists"!'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "25.01");
    t.false(is(str, 9, 20), "25.02");
    t.false(is(str, 9, 28), "25.03");
    t.true(is(str, 9, 30), "25.04"); // <--

    // two pairs of doubles inside a pair of singles - all healthy:
    const str2 = `<img alt='so-called "artists" and "critics"!'/>`;
    t.false(is(str2, 9, 20), "25.05");
    t.false(is(str2, 9, 28), "25.06");
    t.false(is(str2, 9, 34), "25.07");
    t.false(is(str2, 9, 42), "25.08");
    t.true(is(str2, 9, 44), "25.09"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy singles inside doubles, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt="so-called 'artists'!"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "26.01");
    t.false(is(str, 9, 20), "26.02");
    t.false(is(str, 9, 28), "26.03");
    t.true(is(str, 9, 30), "26.04"); // <--

    // fin.
    t.end();
  }
);

// S - D - D - S

tap.test(
  `27 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "27.01");
    t.false(is(str, 9, 20), "27.02");
    t.false(is(str, 9, 28), "27.03");
    t.true(is(str, 9, 30), "27.04"); // <--
    t.false(is(str, 9, 38), "27.05");
    t.false(is(str, 9, 41), "27.06");

    // fin.
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class='yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "28.01");
    t.false(is(str, 9, 20), "28.02");
    t.false(is(str, 9, 28), "28.03");
    t.true(is(str, 9, 30), "28.04"); // <--
    t.false(is(str, 9, 38), "28.05");
    t.false(is(str, 9, 41), "28.06");

    // fin.
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class="yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "29.01");
    t.false(is(str, 9, 20), "29.02");
    t.false(is(str, 9, 28), "29.03");
    t.true(is(str, 9, 30), "29.04"); // <--
    t.false(is(str, 9, 38), "29.05");
    t.false(is(str, 9, 41), "29.06");

    // fin.
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class="yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "30.01");
    t.false(is(str, 9, 20), "30.02");
    t.false(is(str, 9, 28), "30.03");
    t.true(is(str, 9, 30), "30.04"); // <--
    t.false(is(str, 9, 38), "30.05");
    t.false(is(str, 9, 41), "30.06");

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

tap.test(
  `31 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "31.01");
    t.false(is(str, 9, 20), "31.02");
    t.false(is(str, 9, 28), "31.03");
    t.true(is(str, 9, 30), "31.04"); // <--
    t.false(is(str, 9, 38), "31.05");
    t.false(is(str, 9, 41), "31.06");

    // fin.
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class='yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "32.01");
    t.false(is(str, 9, 20), "32.02");
    t.false(is(str, 9, 28), "32.03");
    t.true(is(str, 9, 30), "32.04"); // <--
    t.false(is(str, 9, 38), "32.05");
    t.false(is(str, 9, 41), "32.06");

    // fin.
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class="yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "33.01");
    t.false(is(str, 9, 20), "33.02");
    t.false(is(str, 9, 28), "33.03");
    t.true(is(str, 9, 30), "33.04"); // <--
    t.false(is(str, 9, 38), "33.05");
    t.false(is(str, 9, 41), "33.06");

    // fin.
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class="yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "34.01");
    t.false(is(str, 9, 20), "34.02");
    t.false(is(str, 9, 28), "34.03");
    t.true(is(str, 9, 30), "34.04"); // <--
    t.false(is(str, 9, 38), "34.05");
    t.false(is(str, 9, 41), "34.06");

    // fin.
    t.end();
  }
);

// D - D - D - S

tap.test(
  `35 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "35.01");
    t.false(is(str, 9, 20), "35.02");
    t.false(is(str, 9, 28), "35.03");
    t.true(is(str, 9, 30), "35.04"); // <--
    t.false(is(str, 9, 38), "35.05");
    t.false(is(str, 9, 41), "35.06");

    // fin.
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - false positive of 02.19.*`,
  (t) => {
    const str = `<img alt="so-called "artists"class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "36.01");
    t.false(is(str, 9, 20), "36.02");
    t.true(is(str, 9, 28), "36.03"); // <--
    t.false(is(str, 9, 35), "36.04");
    t.false(is(str, 9, 38), "36.05");

    // fin.
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class='yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "37.01");
    t.false(is(str, 9, 20), "37.02");
    t.false(is(str, 9, 28), "37.03");
    t.true(is(str, 9, 30), "37.04"); // <--
    t.false(is(str, 9, 38), "37.05");
    t.false(is(str, 9, 41), "37.06");

    // fin.
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class="yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "38.01");
    t.false(is(str, 9, 20), "38.02");
    t.false(is(str, 9, 28), "38.03");
    t.true(is(str, 9, 30), "38.04"); // <--
    t.false(is(str, 9, 38), "38.05");
    t.false(is(str, 9, 41), "38.06");

    // fin.
    t.end();
  }
);

tap.test(
  `39 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class="yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "39.01");
    t.false(is(str, 9, 20), "39.02");
    t.false(is(str, 9, 28), "39.03");
    t.true(is(str, 9, 30), "39.04"); // <--
    t.false(is(str, 9, 38), "39.05");
    t.false(is(str, 9, 41), "39.06");

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

tap.test(
  `40 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt="Deal is your's!'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "40.01");
    t.false(is(str, 9, 22), "40.02");
    t.true(is(str, 9, 25), "40.03"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt='Deal is your's!"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "41.01");
    t.false(is(str, 9, 22), "41.02");
    t.true(is(str, 9, 25), "41.03"); // <--

    // more tags follow
    const str2 = `<img alt='Deal is your's!"/><span class="h'>zzz</span>`;

    // alt opening at 9
    t.false(is(str2, 9, 9), "41.04");
    t.false(is(str2, 9, 22), "41.05");
    t.true(is(str2, 9, 25), "41.06"); // <--
    t.false(is(str2, 9, 40), "41.07");
    t.false(is(str2, 9, 42), "41.08");

    const str3 = `<img alt='Deal is your's"/>`;
    t.true(is(str3, 9, 24), "41.09");

    // anti-pattern
    const str4 = `<img alt='Deal is your'class""/>`;
    t.true(is(str4, 9, 22), "41.10");
    t.false(is(str4, 9, 28), "41.11");
    t.false(is(str4, 9, 29), "41.12");

    // anti-pattern
    const str5 = `<img alt='Deal is your'class="/>`;
    t.true(is(str5, 9, 22), "41.13");
    t.false(is(str5, 9, 29), "41.14");

    // fin.
    t.end();
  }
);

tap.test(
  `42 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m - more follows`,
  (t) => {
    // D-D follows
    const str1 = `<img alt="Deal is your's!' class="tralala"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 9), "42.01");
    t.false(is(str1, 9, 22), "42.02");
    t.true(is(str1, 9, 25), "42.03"); // <--
    t.false(is(str1, 9, 33), "42.04");
    t.false(is(str1, 9, 41), "42.05");

    // D-S follows
    const str2 = `<img alt="Deal is your's!' class="tralala'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 9), "42.06");
    t.false(is(str2, 9, 22), "42.07");
    t.true(is(str2, 9, 25), "42.08"); // <--
    t.false(is(str2, 9, 33), "42.09");
    t.false(is(str2, 9, 41), "42.10");

    // S-D follows
    const str3 = `<img alt="Deal is your's!' class='tralala"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 9), "42.11");
    t.false(is(str3, 9, 22), "42.12");
    t.true(is(str3, 9, 25), "42.13"); // <--
    t.false(is(str3, 9, 33), "42.14");
    t.false(is(str3, 9, 41), "42.15");

    // S-S follows
    const str4 = `<img alt="Deal is your's!' class='tralala'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 9), "42.16");
    t.false(is(str4, 9, 22), "42.17");
    t.true(is(str4, 9, 25), "42.18"); // <--
    t.false(is(str4, 9, 33), "42.19");
    t.false(is(str4, 9, 41), "42.20");

    // fin.
    t.end();
  }
);

tap.test(
  `43 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m - more follows`,
  (t) => {
    // D-D follows
    const str1 = `<img alt='Deal is your's!" class="tralala"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 9), "43.01");
    t.false(is(str1, 9, 22), "43.02");
    t.true(is(str1, 9, 25), "43.03"); // <--
    t.false(is(str1, 9, 33), "43.04");
    t.false(is(str1, 9, 41), "43.05");

    // D-S follows
    const str2 = `<img alt='Deal is your's!" class="tralala'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 9), "43.06");
    t.false(is(str2, 9, 22), "43.07");
    t.true(is(str2, 9, 25), "43.08"); // <--
    t.false(is(str2, 9, 33), "43.09");
    t.false(is(str2, 9, 41), "43.10");

    // S-D follows
    const str3 = `<img alt='Deal is your's!" class='tralala"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 9), "43.11");
    t.false(is(str3, 9, 22), "43.12");
    t.true(is(str3, 9, 25), "43.13"); // <--
    t.false(is(str3, 9, 33), "43.14");
    t.false(is(str3, 9, 41), "43.15");

    // S-S follows
    const str4 = `<img alt='Deal is your's!" class='tralala'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 9), "43.16");
    t.false(is(str4, 9, 22), "43.17");
    t.true(is(str4, 9, 25), "43.18"); // <--
    t.false(is(str4, 9, 33), "43.19");
    t.false(is(str4, 9, 41), "43.20");

    // fin.
    t.end();
  }
);

tap.test(
  `44 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "44.01");
    t.false(is(str1, 9, 28), "44.02");
    t.true(is(str1, 9, 30), "44.03"); // <--

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!"/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "44.04");
    t.false(is(str2, 9, 28), "44.05");
    t.true(is(str2, 9, 30), "44.06"); // <--

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!'/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "44.07");
    t.false(is(str3, 9, 28), "44.08");
    t.true(is(str3, 9, 30), "44.09"); // <--

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "44.10");
    t.false(is(str4, 9, 28), "44.11");
    t.true(is(str4, 9, 30), "44.12"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `45 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, D-D`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id="yo"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "45.01");
    t.false(is(str1, 9, 28), "45.02");
    t.true(is(str1, 9, 30), "45.03"); // <--
    t.false(is(str1, 9, 35), "45.04");
    t.false(is(str1, 9, 38), "45.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id="yo"/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "45.06");
    t.false(is(str2, 9, 28), "45.07");
    t.true(is(str2, 9, 30), "45.08"); // <--
    t.false(is(str1, 9, 35), "45.09");
    t.false(is(str1, 9, 38), "45.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id="yo"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "45.11");
    t.false(is(str3, 9, 28), "45.12");
    t.true(is(str3, 9, 30), "45.13"); // <--
    t.false(is(str1, 9, 35), "45.14");
    t.false(is(str1, 9, 38), "45.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id="yo"/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "45.16");
    t.false(is(str4, 9, 28), "45.17");
    t.true(is(str4, 9, 30), "45.18"); // <--
    t.false(is(str1, 9, 35), "45.19");
    t.false(is(str1, 9, 38), "45.20");

    // fin.
    t.end();
  }
);

tap.test(
  `46 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, D-S`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id="yo'/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "46.01");
    t.false(is(str1, 9, 28), "46.02");
    t.true(is(str1, 9, 30), "46.03"); // <--
    t.false(is(str1, 9, 35), "46.04");
    t.false(is(str1, 9, 38), "46.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id="yo'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "46.06");
    t.false(is(str2, 9, 28), "46.07");
    t.true(is(str2, 9, 30), "46.08"); // <--
    t.false(is(str1, 9, 35), "46.09");
    t.false(is(str1, 9, 38), "46.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id="yo'/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "46.11");
    t.false(is(str3, 9, 28), "46.12");
    t.true(is(str3, 9, 30), "46.13"); // <--
    t.false(is(str1, 9, 35), "46.14");
    t.false(is(str1, 9, 38), "46.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id="yo'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "46.16");
    t.false(is(str4, 9, 28), "46.17");
    t.true(is(str4, 9, 30), "46.18"); // <--
    t.false(is(str1, 9, 35), "46.19");
    t.false(is(str1, 9, 38), "46.20");

    // fin.
    t.end();
  }
);

tap.test(
  `47 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, S-D`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id='yo"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "47.01");
    t.false(is(str1, 9, 28), "47.02");
    t.true(is(str1, 9, 30), "47.03"); // <--
    t.false(is(str1, 9, 35), "47.04");
    t.false(is(str1, 9, 38), "47.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id='yo"/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "47.06");
    t.false(is(str2, 9, 28), "47.07");
    t.true(is(str2, 9, 30), "47.08"); // <--
    t.false(is(str1, 9, 35), "47.09");
    t.false(is(str1, 9, 38), "47.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id='yo"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "47.11");
    t.false(is(str3, 9, 28), "47.12");
    t.true(is(str3, 9, 30), "47.13"); // <--
    t.false(is(str1, 9, 35), "47.14");
    t.false(is(str1, 9, 38), "47.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id='yo"/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "47.16");
    t.false(is(str4, 9, 28), "47.17");
    t.true(is(str4, 9, 30), "47.18"); // <--
    t.false(is(str1, 9, 35), "47.19");
    t.false(is(str1, 9, 38), "47.20");

    // fin.
    t.end();
  }
);

tap.test(
  `48 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, S-S`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id='yo'/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "48.01");
    t.false(is(str1, 9, 28), "48.02");
    t.true(is(str1, 9, 30), "48.03"); // <--
    t.false(is(str1, 9, 35), "48.04");
    t.false(is(str1, 9, 38), "48.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id='yo'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "48.06");
    t.false(is(str2, 9, 28), "48.07");
    t.true(is(str2, 9, 30), "48.08"); // <--
    t.false(is(str1, 9, 35), "48.09");
    t.false(is(str1, 9, 38), "48.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id='yo'/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "48.11");
    t.false(is(str3, 9, 28), "48.12");
    t.true(is(str3, 9, 30), "48.13"); // <--
    t.false(is(str1, 9, 35), "48.14");
    t.false(is(str1, 9, 38), "48.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id='yo'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "48.16");
    t.false(is(str4, 9, 28), "48.17");
    t.true(is(str4, 9, 30), "48.18"); // <--
    t.false(is(str1, 9, 35), "48.19");
    t.false(is(str1, 9, 38), "48.20");

    // fin.
    t.end();
  }
);

// 03. cheeky cases
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `49 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="="/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "49.01");
    t.true(is(str, 9, 13), "49.02"); // <--
    t.false(is(str, 9, 19), "49.03");
    t.false(is(str, 9, 21), "49.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "49.05");
    t.false(is(str, 19, 13), "49.06");
    t.false(is(str, 19, 19), "49.07");
    t.true(is(str, 19, 21), "49.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `50 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='='/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "50.01");
    t.true(is(str, 9, 13), "50.02"); // <--
    t.false(is(str, 9, 19), "50.03");
    t.false(is(str, 9, 21), "50.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "50.05");
    t.false(is(str, 19, 13), "50.06");
    t.false(is(str, 19, 19), "50.07");
    t.true(is(str, 19, 21), "50.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `51 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="='/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "51.01");
    t.true(is(str, 9, 13), "51.02"); // <--
    t.false(is(str, 9, 19), "51.03");
    t.false(is(str, 9, 21), "51.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "51.05");
    t.false(is(str, 19, 13), "51.06");
    t.false(is(str, 19, 19), "51.07");
    t.true(is(str, 19, 21), "51.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `52 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='="/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "52.01");
    t.true(is(str, 9, 13), "52.02"); // <--
    t.false(is(str, 9, 19), "52.03");
    t.false(is(str, 9, 21), "52.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "52.05");
    t.false(is(str, 19, 13), "52.06");
    t.false(is(str, 19, 19), "52.07");
    t.true(is(str, 19, 21), "52.08"); // <--

    // fin.
    t.end();
  }
);

//
//                               three attributes
//

tap.test(
  `53 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="=" class="klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "53.01");
    t.true(is(str, 9, 13), "53.02"); // <--
    t.false(is(str, 9, 19), "53.03");
    t.false(is(str, 9, 21), "53.04");
    t.false(is(str, 9, 29), "53.05");
    t.false(is(str, 9, 33), "53.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "53.07");
    t.false(is(str, 19, 13), "53.08");
    t.false(is(str, 19, 19), "53.09");
    t.true(is(str, 19, 21), "53.10"); // <--
    t.false(is(str, 19, 29), "53.11");
    t.false(is(str, 19, 33), "53.12");

    // class opening at 29
    t.false(is(str, 29, 9), "53.13");
    t.false(is(str, 29, 13), "53.14");
    t.false(is(str, 29, 19), "53.15");
    t.false(is(str, 29, 21), "53.16");
    t.false(is(str, 29, 29), "53.17");
    t.true(is(str, 29, 33), "53.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `54 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=' class="klm'/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "54.01");
    t.true(is(str, 9, 13), "54.02"); // <--
    t.false(is(str, 9, 19), "54.03");
    t.false(is(str, 9, 21), "54.04");
    t.false(is(str, 9, 29), "54.05");
    t.false(is(str, 9, 33), "54.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "54.07");
    t.false(is(str, 19, 13), "54.08");
    t.false(is(str, 19, 19), "54.09");
    t.true(is(str, 19, 21), "54.10"); // <--
    t.false(is(str, 19, 29), "54.11");
    t.false(is(str, 19, 33), "54.12");

    // class opening at 29
    t.false(is(str, 29, 9), "54.13");
    t.false(is(str, 29, 13), "54.14");
    t.false(is(str, 29, 19), "54.15");
    t.false(is(str, 29, 21), "54.16");
    t.false(is(str, 29, 29), "54.17");
    t.true(is(str, 29, 33), "54.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `55 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=' class='klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "55.01");
    t.true(is(str, 9, 13), "55.02"); // <--
    t.false(is(str, 9, 19), "55.03");
    t.false(is(str, 9, 21), "55.04");
    t.false(is(str, 9, 29), "55.05");
    t.false(is(str, 9, 33), "55.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "55.07");
    t.false(is(str, 19, 13), "55.08");
    t.false(is(str, 19, 19), "55.09");
    t.true(is(str, 19, 21), "55.10"); // <--
    t.false(is(str, 19, 29), "55.11");
    t.false(is(str, 19, 33), "55.12");

    // class opening at 29
    t.false(is(str, 29, 9), "55.13");
    t.false(is(str, 29, 13), "55.14");
    t.false(is(str, 29, 19), "55.15");
    t.false(is(str, 29, 21), "55.16");
    t.false(is(str, 29, 29), "55.17");
    t.true(is(str, 29, 33), "55.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `56 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class="klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "56.01");
    t.true(is(str, 9, 13), "56.02"); // <--
    t.false(is(str, 9, 19), "56.03");
    t.false(is(str, 9, 21), "56.04");
    t.false(is(str, 9, 29), "56.05");
    t.false(is(str, 9, 33), "56.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "56.07");
    t.false(is(str, 19, 13), "56.08");
    t.false(is(str, 19, 19), "56.09");
    t.true(is(str, 19, 21), "56.10"); // <--
    t.false(is(str, 19, 29), "56.11");
    t.false(is(str, 19, 33), "56.12");

    // class opening at 29
    t.false(is(str, 29, 9), "56.13");
    t.false(is(str, 29, 13), "56.14");
    t.false(is(str, 29, 19), "56.15");
    t.false(is(str, 29, 21), "56.16");
    t.false(is(str, 29, 29), "56.17");
    t.true(is(str, 29, 33), "56.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `57 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class="klm'/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "57.01");
    t.true(is(str, 9, 13), "57.02"); // <--
    t.false(is(str, 9, 19), "57.03");
    t.false(is(str, 9, 21), "57.04");
    t.false(is(str, 9, 29), "57.05");
    t.false(is(str, 9, 33), "57.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "57.07");
    t.false(is(str, 19, 13), "57.08");
    t.false(is(str, 19, 19), "57.09");
    t.true(is(str, 19, 21), "57.10"); // <--
    t.false(is(str, 19, 29), "57.11");
    t.false(is(str, 19, 33), "57.12");

    // class opening at 29
    t.false(is(str, 29, 9), "57.13");
    t.false(is(str, 29, 13), "57.14");
    t.false(is(str, 29, 19), "57.15");
    t.false(is(str, 29, 21), "57.16");
    t.false(is(str, 29, 29), "57.17");
    t.true(is(str, 29, 33), "57.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `58 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class='klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "58.01");
    t.true(is(str, 9, 13), "58.02"); // <--
    t.false(is(str, 9, 19), "58.03");
    t.false(is(str, 9, 21), "58.04");
    t.false(is(str, 9, 29), "58.05");
    t.false(is(str, 9, 33), "58.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "58.07");
    t.false(is(str, 19, 13), "58.08");
    t.false(is(str, 19, 19), "58.09");
    t.true(is(str, 19, 21), "58.10"); // <--
    t.false(is(str, 19, 29), "58.11");
    t.false(is(str, 19, 33), "58.12");

    // class opening at 29
    t.false(is(str, 29, 9), "58.13");
    t.false(is(str, 29, 13), "58.14");
    t.false(is(str, 29, 19), "58.15");
    t.false(is(str, 29, 21), "58.16");
    t.false(is(str, 29, 29), "58.17");
    t.true(is(str, 29, 33), "58.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `59 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class='klm'/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "59.01");
    t.true(is(str, 9, 13), "59.02"); // <--
    t.false(is(str, 9, 19), "59.03");
    t.false(is(str, 9, 21), "59.04");
    t.false(is(str, 9, 29), "59.05");
    t.false(is(str, 9, 33), "59.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "59.07");
    t.false(is(str, 19, 13), "59.08");
    t.false(is(str, 19, 19), "59.09");
    t.true(is(str, 19, 21), "59.10"); // <--
    t.false(is(str, 19, 29), "59.11");
    t.false(is(str, 19, 33), "59.12");

    // class opening at 29
    t.false(is(str, 29, 9), "59.13");
    t.false(is(str, 29, 13), "59.14");
    t.false(is(str, 29, 19), "59.15");
    t.false(is(str, 29, 21), "59.16");
    t.false(is(str, 29, 29), "59.17");
    t.true(is(str, 29, 33), "59.18"); // <--

    // fin.
    t.end();
  }
);

// 04. unclosed tags
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `60 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z" click here</a>`;
    t.true(is(str, 8, 10), "60");

    // fin.
    t.end();
  }
);

tap.test(
  `61 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z' click here</a>`;
    t.true(is(str, 8, 10), "61");

    // fin.
    t.end();
  }
);

tap.test(
  `62 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z" click here</a>`;
    t.true(is(str, 8, 10), "62");

    // fin.
    t.end();
  }
);

tap.test(
  `63 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z' click here</a>`;
    t.true(is(str, 8, 10), "63");

    // fin.
    t.end();
  }
);

// -----------------------------------------------------------------------------

tap.test(
  `64 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href="z" class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "64.01");
    t.false(is(str1, 8, 18), "64.02");
    t.false(is(str1, 8, 21), "64.03");

    // D-S follows
    const str2 = `<a href="z" class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "64.04");
    t.false(is(str2, 8, 18), "64.05");
    t.false(is(str2, 8, 21), "64.06");

    // S-D follows
    const str3 = `<a href="z" class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "64.07");
    t.false(is(str3, 8, 18), "64.08");
    t.false(is(str3, 8, 21), "64.09");

    // S-S follows
    const str4 = `<a href="z" class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "64.10");
    t.false(is(str4, 8, 18), "64.11");
    t.false(is(str4, 8, 21), "64.12");

    // fin.
    t.end();
  }
);

tap.test(
  `65 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href="z' class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "65.01");
    t.false(is(str1, 8, 18), "65.02");
    t.false(is(str1, 8, 21), "65.03");

    // D-S follows
    const str2 = `<a href="z' class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "65.04");
    t.false(is(str2, 8, 18), "65.05");
    t.false(is(str2, 8, 21), "65.06");

    // S-D follows
    const str3 = `<a href="z' class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "65.07");
    t.false(is(str3, 8, 18), "65.08");
    t.false(is(str3, 8, 21), "65.09");

    // S-S follows
    const str4 = `<a href="z' class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "65.10");
    t.false(is(str4, 8, 18), "65.11");
    t.false(is(str4, 8, 21), "65.12");

    // fin.
    t.end();
  }
);

tap.test(
  `66 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href='z" class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "66.01");
    t.false(is(str1, 8, 18), "66.02");
    t.false(is(str1, 8, 21), "66.03");

    // D-S follows
    const str2 = `<a href='z" class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "66.04");
    t.false(is(str2, 8, 18), "66.05");
    t.false(is(str2, 8, 21), "66.06");

    // S-D follows
    const str3 = `<a href='z" class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "66.07");
    t.false(is(str3, 8, 18), "66.08");
    t.false(is(str3, 8, 21), "66.09");

    // S-S follows
    const str4 = `<a href='z" class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "66.10");
    t.false(is(str4, 8, 18), "66.11");
    t.false(is(str4, 8, 21), "66.12");

    // fin.
    t.end();
  }
);

tap.test(
  `67 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href='z' class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "67.01");
    t.false(is(str1, 8, 18), "67.02");
    t.false(is(str1, 8, 21), "67.03");

    // D-S follows
    const str2 = `<a href='z' class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "67.04");
    t.false(is(str2, 8, 18), "67.05");
    t.false(is(str2, 8, 21), "67.06");

    // S-D follows
    const str3 = `<a href='z' class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "67.07");
    t.false(is(str3, 8, 18), "67.08");
    t.false(is(str3, 8, 21), "67.09");

    // S-S follows
    const str4 = `<a href='z' class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "67.10");
    t.false(is(str4, 8, 18), "67.11");
    t.false(is(str4, 8, 21), "67.12");

    // fin.
    t.end();
  }
);

// -----------------------------------------------------------------------------

tap.test(
  `68 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z"</a>`;
    t.true(is(str, 8, 10), "68");

    // fin.
    t.end();
  }
);

tap.test(
  `69 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z'</a>`;
    t.true(is(str, 8, 10), "69");

    // fin.
    t.end();
  }
);

tap.test(
  `70 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z"</a>`;
    t.true(is(str, 8, 10), "70");

    // fin.
    t.end();
  }
);

tap.test(
  `71 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z'</a>`;
    t.true(is(str, 8, 10), "71");

    // fin.
    t.end();
  }
);

// 05. attribute starts without a quote
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `72 - ${`\u001b[${35}m${`opening missing`}\u001b[${39}m`} - one tag pair, one attr`,
  (t) => {
    const str = `<a href=z">click here</a>`;

    t.true(is(str, 8, 9), "72");

    // fin.
    t.end();
  }
);

tap.test(
  `73 - ${`\u001b[${35}m${`opening missing`}\u001b[${39}m`} - one tag pair, another attr follows`,
  (t) => {
    // D-D follows
    const str1 = `<a href=z" class="yo">click here</a>`;

    t.true(is(str1, 8, 9), "73.01");
    t.false(is(str1, 8, 17), "73.02");
    t.false(is(str1, 8, 20), "73.03");

    // D-S follows
    const str2 = `<a href=z" class="yo'>click here</a>`;

    t.true(is(str2, 8, 9), "73.04");
    t.false(is(str2, 8, 17), "73.05");
    t.false(is(str2, 8, 20), "73.06");

    //          off-tangent a little bit...
    const str21 = `<a href=z" class="yo' id='ey">click here</a>`;

    t.true(is(str21, 8, 9), "73.07");
    t.false(is(str21, 8, 17), "73.08");
    t.false(is(str21, 8, 20), "73.09");
    t.false(is(str21, 8, 25), "73.10");
    t.false(is(str21, 8, 28), "73.11");

    const str22 = `<a href=z" class="yo' id='ey>click here</a>`;

    t.true(is(str22, 8, 9), "73.12");
    t.false(is(str22, 8, 17), "73.13");
    t.false(is(str22, 8, 20), "73.14");
    t.false(is(str22, 8, 25), "73.15");

    // S-D follows
    const str3 = `<a href=z" class='yo">click here</a>`;

    t.true(is(str3, 8, 9), "73.16");
    t.false(is(str3, 8, 17), "73.17");
    t.false(is(str3, 8, 20), "73.18");

    const str31 = `<a href=z" class='yo" id="ey'>click here</a>`;

    t.true(is(str31, 8, 9), "73.19");
    t.false(is(str31, 8, 17), "73.20");
    t.false(is(str31, 8, 20), "73.21");
    t.false(is(str31, 8, 25), "73.22");
    t.false(is(str31, 8, 28), "73.23");

    // S-S follows
    const str4 = `<a href=z" class='yo'>click here</a>`;

    t.true(is(str4, 8, 9), "73.24");
    t.false(is(str4, 8, 17), "73.25");
    t.false(is(str4, 8, 20), "73.26");

    //                a provocation...
    const str41 = `<a href=z" class='yo' id='ey">click here</a>`;

    t.true(is(str41, 8, 9), "73.27");
    t.false(is(str41, 8, 17), "73.28");
    t.false(is(str41, 8, 20), "73.29");
    t.false(is(str41, 8, 25), "73.30");
    t.false(is(str41, 8, 28), "73.31");

    // fin.
    t.end();
  }
);

// 06. repeated equals
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `74 - ${`\u001b[${90}m${`repeated equal`}\u001b[${39}m`} - one tag, one attr`,
  (t) => {
    const str = `<a b=="c" d=='e'>`;

    // b opening at 6
    t.false(is(str, 6, 6), "74.01");
    t.true(is(str, 6, 8), "74.02"); // <--
    t.false(is(str, 6, 13), "74.03");
    t.false(is(str, 6, 15), "74.04");

    // d opening at 13
    t.false(is(str, 13, 6), "74.05");
    t.false(is(str, 13, 8), "74.06");
    t.false(is(str, 13, 13), "74.07");
    t.true(is(str, 13, 15), "74.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `75 - ${`\u001b[${90}m${`repeated equal`}\u001b[${39}m`} - one tag, one attr, three equals`,
  (t) => {
    const str = `<a b==="c" d==='e'>`;

    // b opening at 7
    t.false(is(str, 7, 7), "75.01");
    t.true(is(str, 7, 9), "75.02"); // <--
    t.false(is(str, 7, 15), "75.03");
    t.false(is(str, 7, 17), "75.04");

    // d opening at 15
    t.false(is(str, 15, 7), "75.05");
    t.false(is(str, 15, 9), "75.06");
    t.false(is(str, 15, 15), "75.07");
    t.true(is(str, 15, 17), "75.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `76 - ${`\u001b[${90}m${`repeated equal`}\u001b[${39}m`} - one tag, one attr, three spaced equals`,
  (t) => {
    const str = `<a b = = = "c" d = = = 'e'>`;

    // b opening at 11
    t.false(is(str, 11, 11), "76.01");
    t.true(is(str, 11, 13), "76.02"); // <--
    t.false(is(str, 11, 23), "76.03");
    t.false(is(str, 11, 25), "76.04");

    // d opening at 23
    t.false(is(str, 23, 11), "76.05");
    t.false(is(str, 23, 13), "76.06");
    t.false(is(str, 23, 23), "76.07");
    t.true(is(str, 23, 25), "76.08"); // <--

    // fin.
    t.end();
  }
);

// 07. equals is replaced with whitespace
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `77 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - one tag, three attrs`,
  (t) => {
    const str = `<a class "c" id 'e' href "www">`;

    // class opening at 9
    t.false(is(str, 9, 9), "77.01");
    t.true(is(str, 9, 11), "77.02"); // <--
    t.false(is(str, 9, 16), "77.03");
    t.false(is(str, 9, 18), "77.04");
    t.false(is(str, 9, 25), "77.05");
    t.false(is(str, 9, 29), "77.06");

    // id opening at 16
    t.false(is(str, 16, 9), "77.07");
    t.false(is(str, 16, 11), "77.08");
    t.false(is(str, 16, 16), "77.09");
    t.true(is(str, 16, 18), "77.10"); // <--
    t.false(is(str, 16, 25), "77.11");
    t.false(is(str, 16, 29), "77.12");

    // href opening at 25
    t.false(is(str, 25, 9), "77.13");
    t.false(is(str, 25, 11), "77.14");
    t.false(is(str, 25, 16), "77.15");
    t.false(is(str, 25, 18), "77.16");
    t.false(is(str, 25, 25), "77.17");
    t.true(is(str, 25, 29), "77.18"); // <--

    // fin.
    t.end();
  }
);

// 08. missing equal, tight
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

// S-S follows

tap.test(
  `78 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd'e'>.<z fff"g">`;

    // bbb opening at 6
    t.false(is(str, 6, 6), "78.01");
    t.true(is(str, 6, 8), "78.02"); // <--
    t.false(is(str, 6, 13), "78.03");
    t.false(is(str, 6, 15), "78.04");
    t.false(is(str, 6, 24), "78.05");
    t.false(is(str, 6, 26), "78.06");

    // ddd opening at 13
    t.false(is(str, 13, 6), "78.07");
    t.false(is(str, 13, 8), "78.08");
    t.false(is(str, 13, 13), "78.09");
    t.true(is(str, 13, 15), "78.10"); // <--
    t.false(is(str, 13, 24), "78.11");
    t.false(is(str, 13, 26), "78.12");

    // fin.
    t.end();
  }
);

tap.test(
  `79 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id'e'>`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "79.01");
    t.true(is(str, 8, 10), "79.02"); // <--
    t.false(is(str, 8, 14), "79.03");
    t.false(is(str, 8, 16), "79.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "79.05");
    t.false(is(str, 14, 10), "79.06");
    t.false(is(str, 14, 14), "79.07");
    t.true(is(str, 14, 16), "79.08"); // <--

    // fin.
    t.end();
  }
);

// S-D follows

tap.test(
  `80 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd'e">`;

    // 1. the bracket that follows is the last non-whitespace character in string:

    // bbb opening at 6
    t.false(is(str, 6, 6), "80.01");
    t.true(is(str, 6, 8), "80.02"); // <--
    t.false(is(str, 6, 13), "80.03");
    t.false(is(str, 6, 15), "80.04");

    // ddd opening at 13
    t.false(is(str, 13, 6), "80.05");
    t.false(is(str, 13, 8), "80.06");
    t.false(is(str, 13, 13), "80.07");
    t.true(is(str, 13, 15), "80.08"); // <--

    // 2. even if more tags follow, result's the same:

    const str2 = `<z bbb"c" ddd'e">something's here<z id='x'>`;
    t.true(is(str2, 13, 15), "80.09"); // <--
    t.false(is(str2, 13, 26), "80.10");
    t.false(is(str2, 13, 39), "80.11");
    t.false(is(str2, 13, 41), "80.12");

    // fin.
    t.end();
  }
);

tap.test(
  `81 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id'e">`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "81.01");
    t.true(is(str, 8, 10), "81.02"); // <--
    t.false(is(str, 8, 14), "81.03");
    t.false(is(str, 8, 16), "81.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "81.05");
    t.false(is(str, 14, 10), "81.06");
    t.false(is(str, 14, 14), "81.07");
    t.true(is(str, 14, 16), "81.08"); // <--

    // fin.
    t.end();
  }
);

// D-S follows

tap.test(
  `82 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd"e'>`;

    // bbb opening at 6
    t.false(is(str, 6, 6), "82.01");
    t.true(is(str, 6, 8), "82.02"); // <--
    t.false(is(str, 6, 13), "82.03");
    t.false(is(str, 6, 15), "82.04");

    // ddd opening at 13
    t.false(is(str, 13, 6), "82.05");
    t.false(is(str, 13, 8), "82.06");
    t.false(is(str, 13, 13), "82.07");
    t.true(is(str, 13, 15), "82.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `83 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id"e'>`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "83.01");
    t.true(is(str, 8, 10), "83.02"); // <--
    t.false(is(str, 8, 14), "83.03");
    t.false(is(str, 8, 16), "83.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "83.05");
    t.false(is(str, 14, 10), "83.06");
    t.false(is(str, 14, 14), "83.07");
    t.true(is(str, 14, 16), "83.08"); // <--

    // fin.
    t.end();
  }
);

// D-D follows

tap.test(
  `84 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - unrecognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c" ddd"e">`;

    // bbb opening at 6
    t.false(is(str, 6, 6), "84.01");
    t.true(is(str, 6, 8), "84.02"); // <--
    t.false(is(str, 6, 13), "84.03");
    t.true(is(str, 6, 15), "84.04"); // <-- ! also here

    // ddd opening at 13
    t.false(is(str, 13, 6), "84.05");
    t.false(is(str, 13, 8), "84.06");
    t.false(is(str, 13, 13), "84.07");
    t.true(is(str, 13, 15), "84.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `85 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - recognised everything - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a class"c" id"e">`;

    // bbb opening at 8
    t.false(is(str, 8, 8), "85.01");
    t.true(is(str, 8, 10), "85.02"); // <--
    t.false(is(str, 8, 14), "85.03");
    t.false(is(str, 8, 16), "85.04");

    // ddd opening at 14
    t.false(is(str, 14, 8), "85.05");
    t.false(is(str, 14, 10), "85.06");
    t.false(is(str, 14, 14), "85.07");
    t.true(is(str, 14, 16), "85.08"); // <--

    // fin.
    t.end();
  }
);

// counter-cases, false positives

tap.test(
  `86 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str1 = `<z bbb"c" ddd'e>`;

    // algorithm picks the 13 because it is matching and 13 is unmatched

    // bbb opening at 6
    t.true(is(str1, 6, 8), "86.01"); // <--
    t.false(is(str1, 6, 13), "86.02");

    // also,

    const str2 = `<z bbb"c" ddd'e'>`;

    // bbb opening at 6
    t.true(is(str2, 6, 8), "86.03"); // <--
    t.false(is(str2, 6, 13), "86.04");
    t.false(is(str2, 6, 15), "86.05");

    // also, even though href is suspicious, it's wrapped with a matching
    // quote pair so we take it as value, not attribute name

    const str3 = `<z alt"href" www'/>`;

    // bbb opening at 6
    t.true(is(str3, 6, 11), "86.06"); // <--
    t.false(is(str3, 6, 16), "86.07");

    // but it's enough to mismatch the pair and it becomes...

    const str4 = `<z alt"href=' www'/>`;
    // Algorithm sees this as:
    // <z alt="" href=' ddd'/>

    // bbb opening at 6
    t.false(is(str4, 6, 12), "86.08"); // <--
    // even though it's mismatching:
    t.false(is(str4, 6, 17), "86.09");

    // but doubles in front:
    const str5 = `<z alt""href' www'/>`;
    t.true(is(str5, 6, 7), "86.10"); // <--
    t.false(is(str5, 6, 12), "86.11");
    t.false(is(str5, 6, 17), "86.12");

    // even doubles can follow,

    const str6 = `<z alt"href' www' id=z"/>`;
    // Algorithm sees this as:
    // <z alt="" href=' ddd'/>

    // bbb opening at 6
    t.false(is(str6, 6, 11), "86.13"); // <--
    // even though it's mismatching:
    t.false(is(str6, 6, 16), "86.14");
    t.false(is(str6, 6, 22), "86.15");

    // fin.
    t.end();
  }
);

tap.test(
  `87 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' ddd"e>`;

    // but if 13 is mismatching, it will jump to 13 because count of doubles is
    // an even number

    // basically, "outermost quotes count being even number" takes priority
    // over any character or character chunk qualities (like recognised attr name)

    // bbb opening at 6
    t.false(is(str, 6, 8), "87.01");
    t.true(is(str, 6, 13), "87.02"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `88 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' href"e>`;

    // but if 13 is mismatching, it will jump to 13 because count of doubles is
    // an even number

    // basically, "outermost quotes count being even number" takes priority
    // over any character or character chunk qualities (like recognised attr name)

    // bbb opening at 6
    t.true(is(str, 6, 8), "88.01"); // <--
    t.false(is(str, 6, 14), "88.02");

    // fin.
    t.end();
  }
);

tap.test(
  `89 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' z href"e>`;

    // z ruins everything, if it's not a known void attribute name

    // bbb opening at 6
    t.false(is(str, 6, 8), "89.01");
    t.true(is(str, 6, 16), "89.02"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `90 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z bbb"c' nowrap href"e>`;

    // nowrap is recognised void attribute

    // bbb opening at 6
    t.true(is(str, 6, 8), "90.01"); // <--
    t.false(is(str, 6, 21), "90.02");

    // fin.
    t.end();
  }
);

tap.test(
  `91 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<z href"href' href href"href>`;

    // program perceives it as:
    // <z href"href' href href" href>
    // as in
    // <img alt="somethin' fishy going on" class>

    // bbb opening at 7
    t.true(is(str, 7, 12), "91.01"); // <--
    t.false(is(str, 7, 23), "91.02");

    // fin.
    t.end();
  }
);

tap.test(
  `92 - ${`\u001b[${34}m${`space instead of equal`}\u001b[${39}m`} - counter-case - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // no closing slash on img
    const str1 = `<img alt="somethin' fishy going on' class=">z<a class="y">`;

    // alt opening at 9
    t.false(is(str1, 9, 18), "92.01");
    t.true(is(str1, 9, 34), "92.02"); // <--
    t.false(is(str1, 9, 42), "92.03");
    t.false(is(str1, 9, 54), "92.04");
    t.false(is(str1, 9, 56), "92.05");

    // closing slash on img present
    const str2 = `<img alt="somethin' fishy going on' class="/>z<a class="y">`;

    // alt opening at 9
    t.false(is(str2, 9, 18), "92.06");
    t.true(is(str2, 9, 34), "92.07"); // <--
    t.false(is(str2, 9, 42), "92.08");
    t.false(is(str2, 9, 55), "92.09");
    t.false(is(str2, 9, 57), "92.10");

    // fin.
    t.end();
  }
);

// 09. starting index is not on a quote
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `93 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - control`,
  (t) => {
    const str = `<a href="www" class=e'>`;

    // href opening at 8
    t.true(is(str, 8, 12), "93.01"); // <--
    t.false(is(str, 8, 21), "93.02");

    // class opening at 20
    t.false(is(str, 20, 12), "93.03");
    t.true(is(str, 20, 21), "93.04"); // <--

    // fin.
    t.end();
  }
);

//              finally, the bizness

tap.test(
  `94 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, two attrs`,
  (t) => {
    // D-D
    const str1 = `<a href=www" class=e">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "94.01"); // <--
    t.false(is(str1, 8, 20), "94.02");

    // class opening at 19
    t.false(is(str1, 19, 11), "94.03");
    t.true(is(str1, 19, 20), "94.04"); // <--

    // D-S
    const str2 = `<a href=www" class=e'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "94.05"); // <--
    t.false(is(str2, 8, 20), "94.06");

    // class opening at 19
    t.false(is(str2, 19, 11), "94.07");
    t.true(is(str2, 19, 20), "94.08"); // <--

    // S-D
    const str3 = `<a href=www' class=e">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "94.09"); // <--
    t.false(is(str3, 8, 20), "94.10");

    // class opening at 19
    t.false(is(str3, 19, 11), "94.11");
    t.true(is(str3, 19, 20), "94.12"); // <--

    // S-S
    const str4 = `<a href=www' class=e'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "94.13"); // <--
    t.false(is(str4, 8, 20), "94.14");

    // class opening at 19
    t.false(is(str4, 19, 11), "94.15");
    t.true(is(str4, 19, 20), "94.16"); // <--

    // fin.
    t.end();
  }
);

// "X" meaning absent
tap.test(
  `95 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // X-D + X-D + D-D
    const str1 = `<a href=www" class=e" id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "95.01"); // <--
    t.false(is(str1, 8, 20), "95.02");
    t.false(is(str1, 8, 25), "95.03");
    t.false(is(str1, 8, 27), "95.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "95.05");
    t.true(is(str1, 19, 20), "95.06"); // <--
    t.false(is(str1, 19, 25), "95.07");
    t.false(is(str1, 19, 27), "95.08");

    // X-D + X-D + D-S
    const str2 = `<a href=www" class=e" id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "95.09"); // <--
    t.false(is(str2, 8, 20), "95.10");
    t.false(is(str2, 8, 25), "95.11");
    t.false(is(str2, 8, 27), "95.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "95.13");
    t.true(is(str2, 19, 20), "95.14"); // <--
    t.false(is(str2, 19, 25), "95.15");
    t.false(is(str2, 19, 27), "95.16");

    // X-D + X-D + S-D
    const str3 = `<a href=www" class=e" id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "95.17"); // <--
    t.false(is(str3, 8, 20), "95.18");
    t.false(is(str3, 8, 25), "95.19");
    t.false(is(str3, 8, 27), "95.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "95.21");
    t.true(is(str3, 19, 20), "95.22"); // <--
    t.false(is(str3, 19, 25), "95.23");
    t.false(is(str3, 19, 27), "95.24");

    // X-D + X-D + S-S
    const str4 = `<a href=www" class=e" id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "95.25"); // <--
    t.false(is(str4, 8, 20), "95.26");
    t.false(is(str4, 8, 25), "95.27");
    t.false(is(str4, 8, 27), "95.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "95.29");
    t.true(is(str4, 19, 20), "95.30"); // <--
    t.false(is(str4, 19, 25), "95.31");
    t.false(is(str4, 19, 27), "95.32");

    // X-D + X-D + S-X
    const str5 = `<a href=www" class=e" id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "95.33"); // <--
    t.false(is(str5, 8, 20), "95.34");
    t.false(is(str5, 8, 25), "95.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "95.36");
    t.true(is(str5, 19, 20), "95.37"); // <--
    t.false(is(str5, 19, 25), "95.38");

    // X-D + X-D + D-X
    const str6 = `<a href=www" class=e" id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "95.39"); // <--
    t.false(is(str6, 8, 20), "95.40");
    t.false(is(str6, 8, 25), "95.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "95.42");
    t.true(is(str6, 19, 20), "95.43"); // <--
    t.false(is(str6, 19, 25), "95.44");

    // X-D + X-D + X-S
    const str7 = `<a href=www" class=e" id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "95.45"); // <--
    t.false(is(str7, 8, 20), "95.46");
    t.false(is(str7, 8, 26), "95.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "95.48");
    t.true(is(str7, 19, 20), "95.49"); // <--
    t.false(is(str7, 19, 26), "95.50");

    // X-D + X-D + X-D
    const str8 = `<a href=www" class=e" id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "95.51"); // <--
    t.false(is(str8, 8, 20), "95.52");
    t.false(is(str8, 8, 26), "95.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "95.54");
    t.true(is(str8, 19, 20), "95.55"); // <--
    t.false(is(str8, 19, 26), "95.56");

    // fin.
    t.end();
  }
);

tap.test(
  `96 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // X-D + X-S + D-D
    const str1 = `<a href=www" class=e' id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "96.01"); // <--
    t.false(is(str1, 8, 20), "96.02");
    t.false(is(str1, 8, 25), "96.03");
    t.false(is(str1, 8, 27), "96.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "96.05");
    t.true(is(str1, 19, 20), "96.06"); // <--
    t.false(is(str1, 19, 25), "96.07");
    t.false(is(str1, 19, 27), "96.08");

    // X-D + X-S + D-S
    const str2 = `<a href=www" class=e' id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "96.09"); // <--
    t.false(is(str2, 8, 20), "96.10");
    t.false(is(str2, 8, 25), "96.11");
    t.false(is(str2, 8, 27), "96.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "96.13");
    t.true(is(str2, 19, 20), "96.14"); // <--
    t.false(is(str2, 19, 25), "96.15");
    t.false(is(str2, 19, 27), "96.16");

    // X-D + X-S + S-D
    const str3 = `<a href=www" class=e' id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "96.17"); // <--
    t.false(is(str3, 8, 20), "96.18");
    t.false(is(str3, 8, 25), "96.19");
    t.false(is(str3, 8, 27), "96.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "96.21");
    t.true(is(str3, 19, 20), "96.22"); // <--
    t.false(is(str3, 19, 25), "96.23");
    t.false(is(str3, 19, 27), "96.24");

    // X-D + X-S + S-S
    const str4 = `<a href=www" class=e' id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "96.25"); // <--
    t.false(is(str4, 8, 20), "96.26");
    t.false(is(str4, 8, 25), "96.27");
    t.false(is(str4, 8, 27), "96.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "96.29");
    t.true(is(str4, 19, 20), "96.30"); // <--
    t.false(is(str4, 19, 25), "96.31");
    t.false(is(str4, 19, 27), "96.32");

    // X-D + X-S + S-X
    const str5 = `<a href=www" class=e' id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "96.33"); // <--
    t.false(is(str5, 8, 20), "96.34");
    t.false(is(str5, 8, 25), "96.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "96.36");
    t.true(is(str5, 19, 20), "96.37"); // <--
    t.false(is(str5, 19, 25), "96.38");

    // X-D + X-S + D-X
    const str6 = `<a href=www" class=e' id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "96.39"); // <--
    t.false(is(str6, 8, 20), "96.40");
    t.false(is(str6, 8, 25), "96.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "96.42");
    t.true(is(str6, 19, 20), "96.43"); // <--
    t.false(is(str6, 19, 25), "96.44");

    // X-D + X-S + X-S
    const str7 = `<a href=www" class=e' id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "96.45"); // <--
    t.false(is(str7, 8, 20), "96.46");
    t.false(is(str7, 8, 26), "96.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "96.48");
    t.true(is(str7, 19, 20), "96.49"); // <--
    t.false(is(str7, 19, 26), "96.50");

    // X-D + X-S + X-D
    const str8 = `<a href=www" class=e' id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "96.51"); // <--
    t.false(is(str8, 8, 20), "96.52");
    t.false(is(str8, 8, 26), "96.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "96.54");
    t.true(is(str8, 19, 20), "96.55"); // <--
    t.false(is(str8, 19, 26), "96.56");

    // fin.
    t.end();
  }
);

tap.test(
  `97 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // X-S + X-D + D-D
    const str1 = `<a href=www' class=e" id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "97.01"); // <--
    t.false(is(str1, 8, 20), "97.02");
    t.false(is(str1, 8, 25), "97.03");
    t.false(is(str1, 8, 27), "97.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "97.05");
    t.true(is(str1, 19, 20), "97.06"); // <--
    t.false(is(str1, 19, 25), "97.07");
    t.false(is(str1, 19, 27), "97.08");

    // X-S + X-D + D-S
    const str2 = `<a href=www' class=e" id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "97.09"); // <--
    t.false(is(str2, 8, 20), "97.10");
    t.false(is(str2, 8, 25), "97.11");
    t.false(is(str2, 8, 27), "97.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "97.13");
    t.true(is(str2, 19, 20), "97.14"); // <--
    t.false(is(str2, 19, 25), "97.15");
    t.false(is(str2, 19, 27), "97.16");

    // X-S + X-D + S-D
    const str3 = `<a href=www' class=e" id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "97.17"); // <--
    t.false(is(str3, 8, 20), "97.18");
    t.false(is(str3, 8, 25), "97.19");
    t.false(is(str3, 8, 27), "97.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "97.21");
    t.true(is(str3, 19, 20), "97.22"); // <--
    t.false(is(str3, 19, 25), "97.23");
    t.false(is(str3, 19, 27), "97.24");

    // X-S + X-D + S-S
    const str4 = `<a href=www' class=e" id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "97.25"); // <--
    t.false(is(str4, 8, 20), "97.26");
    t.false(is(str4, 8, 25), "97.27");
    t.false(is(str4, 8, 27), "97.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "97.29");
    t.true(is(str4, 19, 20), "97.30"); // <--
    t.false(is(str4, 19, 25), "97.31");
    t.false(is(str4, 19, 27), "97.32");

    // X-S + X-D + S-X
    const str5 = `<a href=www' class=e" id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "97.33"); // <--
    t.false(is(str5, 8, 20), "97.34");
    t.false(is(str5, 8, 25), "97.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "97.36");
    t.true(is(str5, 19, 20), "97.37"); // <--
    t.false(is(str5, 19, 25), "97.38");

    // X-S + X-D + D-X
    const str6 = `<a href=www' class=e" id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "97.39"); // <--
    t.false(is(str6, 8, 20), "97.40");
    t.false(is(str6, 8, 25), "97.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "97.42");
    t.true(is(str6, 19, 20), "97.43"); // <--
    t.false(is(str6, 19, 25), "97.44");

    // X-S + X-D + X-S
    const str7 = `<a href=www' class=e" id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "97.45"); // <--
    t.false(is(str7, 8, 20), "97.46");
    t.false(is(str7, 8, 26), "97.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "97.48");
    t.true(is(str7, 19, 20), "97.49"); // <--
    t.false(is(str7, 19, 26), "97.50");

    // X-S + X-D + X-D
    const str8 = `<a href=www' class=e" id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "97.51"); // <--
    t.false(is(str8, 8, 20), "97.52");
    t.false(is(str8, 8, 26), "97.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "97.54");
    t.true(is(str8, 19, 20), "97.55"); // <--
    t.false(is(str8, 19, 26), "97.56");

    // fin.
    t.end();
  }
);

tap.test(
  `98 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // X-S + X-S + D-D
    const str1 = `<a href=www' class=e' id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "98.01"); // <--
    t.false(is(str1, 8, 20), "98.02");
    t.false(is(str1, 8, 25), "98.03");
    t.false(is(str1, 8, 27), "98.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "98.05");
    t.true(is(str1, 19, 20), "98.06"); // <--
    t.false(is(str1, 19, 25), "98.07");
    t.false(is(str1, 19, 27), "98.08");

    // X-S + X-S + D-S
    const str2 = `<a href=www' class=e' id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "98.09"); // <--
    t.false(is(str2, 8, 20), "98.10");
    t.false(is(str2, 8, 25), "98.11");
    t.false(is(str2, 8, 27), "98.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "98.13");
    t.true(is(str2, 19, 20), "98.14"); // <--
    t.false(is(str2, 19, 25), "98.15");
    t.false(is(str2, 19, 27), "98.16");

    // X-S + X-S + S-D
    const str3 = `<a href=www' class=e' id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "98.17"); // <--
    t.false(is(str3, 8, 20), "98.18");
    t.false(is(str3, 8, 25), "98.19");
    t.false(is(str3, 8, 27), "98.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "98.21");
    t.true(is(str3, 19, 20), "98.22"); // <--
    t.false(is(str3, 19, 25), "98.23");
    t.false(is(str3, 19, 27), "98.24");

    // X-S + X-S + S-S
    const str4 = `<a href=www' class=e' id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "98.25"); // <--
    t.false(is(str4, 8, 20), "98.26");
    t.false(is(str4, 8, 25), "98.27");
    t.false(is(str4, 8, 27), "98.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "98.29");
    t.true(is(str4, 19, 20), "98.30"); // <--
    t.false(is(str4, 19, 25), "98.31");
    t.false(is(str4, 19, 27), "98.32");

    // X-S + X-S + S-X
    const str5 = `<a href=www' class=e' id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "98.33"); // <--
    t.false(is(str5, 8, 20), "98.34");
    t.false(is(str5, 8, 25), "98.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "98.36");
    t.true(is(str5, 19, 20), "98.37"); // <--
    t.false(is(str5, 19, 25), "98.38");

    // X-S + X-S + D-X
    const str6 = `<a href=www' class=e' id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "98.39"); // <--
    t.false(is(str6, 8, 20), "98.40");
    t.false(is(str6, 8, 25), "98.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "98.42");
    t.true(is(str6, 19, 20), "98.43"); // <--
    t.false(is(str6, 19, 25), "98.44");

    // X-S + X-S + X-S
    const str7 = `<a href=www' class=e' id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "98.45"); // <--
    t.false(is(str7, 8, 20), "98.46");
    t.false(is(str7, 8, 26), "98.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "98.48");
    t.true(is(str7, 19, 20), "98.49"); // <--
    t.false(is(str7, 19, 26), "98.50");

    // X-S + X-S + X-D
    const str8 = `<a href=www' class=e' id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "98.51"); // <--
    t.false(is(str8, 8, 20), "98.52");
    t.false(is(str8, 8, 26), "98.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "98.54");
    t.true(is(str8, 19, 20), "98.55"); // <--
    t.false(is(str8, 19, 26), "98.56");
    // fin.
    t.end();
  }
);
