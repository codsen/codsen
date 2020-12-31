import tap from "tap";
import { isAttrClosing as is } from "../dist/is-html-attribute-closing.esm";
// const BACKSLASH = "\u005C";

// mismatching quotes, rest healthy
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
  `01 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap`,
  (t) => {
    // healthy tag being:
    // <img alt='so-called "artists"!' class='yo'/>

    const str = `<img alt="so-called "artists"!' class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 20), "01.01");
    t.false(is(str, 9, 28), "01.02");
    t.true(is(str, 9, 30), "01.03"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - similar but opposite`,
  (t) => {
    // healthy tag being:
    // <img class="so-called" alt="!" border='10'/>

    const str = `<img class="so-called "alt"!' border='10'/>`;

    // class opening at 11
    t.true(is(str, 11, 22), "02.01"); // <-- !!!
    t.false(is(str, 11, 26), "02.02");
    t.false(is(str, 11, 28), "02.03");
    t.false(is(str, 11, 37), "02.04");
    t.false(is(str, 11, 40), "02.05");

    // fin.
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - also similar`,
  (t) => {
    // healthy tag being:
    // <img class="so-called" alt="!" border='10'/>

    const str = `<img class="so-called "alt !' border 10'/>`;

    // class opening at 11
    t.true(is(str, 11, 22), "03.01");
    t.false(is(str, 11, 28), "03.02");
    t.false(is(str, 11, 39), "03.03");

    // fin.
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - basic, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="="/>`;
    t.true(is(str, 19, 21), "04"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - two attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<div class="c' id="x'>.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "05.01");
    t.true(is(str, 11, 13), "05.02"); // <--
    t.false(is(str, 11, 18), "05.03");
    t.false(is(str, 11, 20), "05.04");

    // id opening at 18
    t.false(is(str, 18, 11), "05.05");
    t.false(is(str, 18, 13), "05.06");
    t.false(is(str, 18, 18), "05.07");
    t.true(is(str, 18, 20), "05.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - two attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<div class='c" id='x">.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "06.01");
    t.true(is(str, 11, 13), "06.02"); // <--
    t.false(is(str, 11, 18), "06.03");
    t.false(is(str, 11, 20), "06.04");

    // id opening at 18
    t.false(is(str, 18, 11), "06.05");
    t.false(is(str, 18, 13), "06.06");
    t.false(is(str, 18, 18), "06.07");
    t.true(is(str, 18, 20), "06.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - three attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<div class="c' id="x' style='c">.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "07.01");
    t.true(is(str, 11, 13), "07.02"); // <--
    t.false(is(str, 11, 18), "07.03");
    t.false(is(str, 11, 20), "07.04");
    t.false(is(str, 11, 28), "07.05");
    t.false(is(str, 11, 30), "07.06");

    // class opening at 18
    t.false(is(str, 18, 11), "07.07");
    t.false(is(str, 18, 13), "07.08");
    t.false(is(str, 18, 18), "07.09");
    t.true(is(str, 18, 20), "07.10"); // <--
    t.false(is(str, 18, 28), "07.11");
    t.false(is(str, 18, 30), "07.12");

    // style opening at 28
    t.false(is(str, 28, 11), "07.13");
    t.false(is(str, 28, 13), "07.14");
    t.false(is(str, 28, 18), "07.15");
    t.false(is(str, 28, 20), "07.16");
    t.false(is(str, 28, 28), "07.17");
    t.true(is(str, 28, 30), "07.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - three attr pairs, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<div class='c" id='x" style="c'>.</div>`;

    // class opening at 11
    t.false(is(str, 11, 11), "08.01");
    t.true(is(str, 11, 13), "08.02"); // <--
    t.false(is(str, 11, 18), "08.03");
    t.false(is(str, 11, 20), "08.04");
    t.false(is(str, 11, 28), "08.05");
    t.false(is(str, 11, 30), "08.06");

    // class opening at 18
    t.false(is(str, 18, 11), "08.07");
    t.false(is(str, 18, 13), "08.08");
    t.false(is(str, 18, 18), "08.09");
    t.true(is(str, 18, 20), "08.10"); // <--
    t.false(is(str, 18, 28), "08.11");
    t.false(is(str, 18, 30), "08.12");

    // style opening at 28
    t.false(is(str, 28, 11), "08.13");
    t.false(is(str, 28, 13), "08.14");
    t.false(is(str, 28, 18), "08.15");
    t.false(is(str, 28, 20), "08.16");
    t.false(is(str, 28, 28), "08.17");
    t.true(is(str, 28, 30), "08.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy singles inside doubles, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt='so-called "artists"!'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "09.01");
    t.false(is(str, 9, 20), "09.02");
    t.false(is(str, 9, 28), "09.03");
    t.true(is(str, 9, 30), "09.04"); // <--

    // two pairs of doubles inside a pair of singles - all healthy:
    const str2 = `<img alt='so-called "artists" and "critics"!'/>`;
    t.false(is(str2, 9, 20), "09.05");
    t.false(is(str2, 9, 28), "09.06");
    t.false(is(str2, 9, 34), "09.07");
    t.false(is(str2, 9, 42), "09.08");
    t.true(is(str2, 9, 44), "09.09"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy singles inside doubles, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt="so-called 'artists'!"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "10.01");
    t.false(is(str, 9, 20), "10.02");
    t.false(is(str, 9, 28), "10.03");
    t.true(is(str, 9, 30), "10.04"); // <--

    // fin.
    t.end();
  }
);

// S - D - D - S

tap.test(
  `11 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "11.01");
    t.false(is(str, 9, 20), "11.02");
    t.false(is(str, 9, 28), "11.03");
    t.true(is(str, 9, 30), "11.04"); // <--
    t.false(is(str, 9, 38), "11.05");
    t.false(is(str, 9, 41), "11.06");

    // fin.
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class='yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "12.01");
    t.false(is(str, 9, 20), "12.02");
    t.false(is(str, 9, 28), "12.03");
    t.true(is(str, 9, 30), "12.04"); // <--
    t.false(is(str, 9, 38), "12.05");
    t.false(is(str, 9, 41), "12.06");

    // fin.
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class="yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "13.01");
    t.false(is(str, 9, 20), "13.02");
    t.false(is(str, 9, 28), "13.03");
    t.true(is(str, 9, 30), "13.04"); // <--
    t.false(is(str, 9, 38), "13.05");
    t.false(is(str, 9, 41), "13.06");

    // fin.
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!' class="yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "14.01");
    t.false(is(str, 9, 20), "14.02");
    t.false(is(str, 9, 28), "14.03");
    t.true(is(str, 9, 30), "14.04"); // <--
    t.false(is(str, 9, 38), "14.05");
    t.false(is(str, 9, 41), "14.06");

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
  `15 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "15.01");
    t.false(is(str, 9, 20), "15.02");
    t.false(is(str, 9, 28), "15.03");
    t.true(is(str, 9, 30), "15.04"); // <--
    t.false(is(str, 9, 38), "15.05");
    t.false(is(str, 9, 41), "15.06");

    // fin.
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class='yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "16.01");
    t.false(is(str, 9, 20), "16.02");
    t.false(is(str, 9, 28), "16.03");
    t.true(is(str, 9, 30), "16.04"); // <--
    t.false(is(str, 9, 38), "16.05");
    t.false(is(str, 9, 41), "16.06");

    // fin.
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class="yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "17.01");
    t.false(is(str, 9, 20), "17.02");
    t.false(is(str, 9, 28), "17.03");
    t.true(is(str, 9, 30), "17.04"); // <--
    t.false(is(str, 9, 38), "17.05");
    t.false(is(str, 9, 41), "17.06");

    // fin.
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt='so-called "artists"!" class="yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "18.01");
    t.false(is(str, 9, 20), "18.02");
    t.false(is(str, 9, 28), "18.03");
    t.true(is(str, 9, 30), "18.04"); // <--
    t.false(is(str, 9, 38), "18.05");
    t.false(is(str, 9, 41), "18.06");

    // fin.
    t.end();
  }
);

// D - D - D - S

tap.test(
  `19 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "19.01");
    t.false(is(str, 9, 20), "19.02");
    t.false(is(str, 9, 28), "19.03");
    t.true(is(str, 9, 30), "19.04"); // <--
    t.false(is(str, 9, 38), "19.05");
    t.false(is(str, 9, 41), "19.06");

    // fin.
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - false positive of 02.19.*`,
  (t) => {
    const str = `<img alt="so-called "artists"class='yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "20.01");
    t.false(is(str, 9, 20), "20.02");
    t.true(is(str, 9, 28), "20.03"); // <--
    t.false(is(str, 9, 35), "20.04");
    t.false(is(str, 9, 38), "20.05");

    // fin.
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class='yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "21.01");
    t.false(is(str, 9, 20), "21.02");
    t.false(is(str, 9, 28), "21.03");
    t.true(is(str, 9, 30), "21.04"); // <--
    t.false(is(str, 9, 38), "21.05");
    t.false(is(str, 9, 41), "21.06");

    // fin.
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class="yo'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "22.01");
    t.false(is(str, 9, 20), "22.02");
    t.false(is(str, 9, 28), "22.03");
    t.true(is(str, 9, 30), "22.04"); // <--
    t.false(is(str, 9, 38), "22.05");
    t.false(is(str, 9, 41), "22.06");

    // fin.
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`,
  (t) => {
    const str = `<img alt="so-called "artists"!' class="yo"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "23.01");
    t.false(is(str, 9, 20), "23.02");
    t.false(is(str, 9, 28), "23.03");
    t.true(is(str, 9, 30), "23.04"); // <--
    t.false(is(str, 9, 38), "23.05");
    t.false(is(str, 9, 41), "23.06");

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
  `24 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt="Deal is your's!'/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "24.01");
    t.false(is(str, 9, 22), "24.02");
    t.true(is(str, 9, 25), "24.03"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img alt='Deal is your's!"/>`;

    // alt opening at 9
    t.false(is(str, 9, 9), "25.01");
    t.false(is(str, 9, 22), "25.02");
    t.true(is(str, 9, 25), "25.03"); // <--

    // more tags follow
    const str2 = `<img alt='Deal is your's!"/><span class="h'>zzz</span>`;

    // alt opening at 9
    t.false(is(str2, 9, 9), "25.04");
    t.false(is(str2, 9, 22), "25.05");
    t.true(is(str2, 9, 25), "25.06"); // <--
    t.false(is(str2, 9, 40), "25.07");
    t.false(is(str2, 9, 42), "25.08");

    const str3 = `<img alt='Deal is your's"/>`;
    t.true(is(str3, 9, 24), "25.09");

    // anti-pattern
    const str4 = `<img alt='Deal is your'class""/>`;
    t.true(is(str4, 9, 22), "25.10");
    t.false(is(str4, 9, 28), "25.11");
    t.false(is(str4, 9, 29), "25.12");

    // anti-pattern
    const str5 = `<img alt='Deal is your'class="/>`;
    t.true(is(str5, 9, 22), "25.13");
    t.false(is(str5, 9, 29), "25.14");

    // fin.
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m - more follows`,
  (t) => {
    // D-D follows
    const str1 = `<img alt="Deal is your's!' class="tralala"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 9), "26.01");
    t.false(is(str1, 9, 22), "26.02");
    t.true(is(str1, 9, 25), "26.03"); // <--
    t.false(is(str1, 9, 33), "26.04");
    t.false(is(str1, 9, 41), "26.05");

    // D-S follows
    const str2 = `<img alt="Deal is your's!' class="tralala'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 9), "26.06");
    t.false(is(str2, 9, 22), "26.07");
    t.true(is(str2, 9, 25), "26.08"); // <--
    t.false(is(str2, 9, 33), "26.09");
    t.false(is(str2, 9, 41), "26.10");

    // S-D follows
    const str3 = `<img alt="Deal is your's!' class='tralala"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 9), "26.11");
    t.false(is(str3, 9, 22), "26.12");
    t.true(is(str3, 9, 25), "26.13"); // <--
    t.false(is(str3, 9, 33), "26.14");
    t.false(is(str3, 9, 41), "26.15");

    // S-S follows
    const str4 = `<img alt="Deal is your's!' class='tralala'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 9), "26.16");
    t.false(is(str4, 9, 22), "26.17");
    t.true(is(str4, 9, 25), "26.18"); // <--
    t.false(is(str4, 9, 33), "26.19");
    t.false(is(str4, 9, 41), "26.20");

    // fin.
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m - more follows`,
  (t) => {
    // D-D follows
    const str1 = `<img alt='Deal is your's!" class="tralala"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 9), "27.01");
    t.false(is(str1, 9, 22), "27.02");
    t.true(is(str1, 9, 25), "27.03"); // <--
    t.false(is(str1, 9, 33), "27.04");
    t.false(is(str1, 9, 41), "27.05");

    // D-S follows
    const str2 = `<img alt='Deal is your's!" class="tralala'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 9), "27.06");
    t.false(is(str2, 9, 22), "27.07");
    t.true(is(str2, 9, 25), "27.08"); // <--
    t.false(is(str2, 9, 33), "27.09");
    t.false(is(str2, 9, 41), "27.10");

    // S-D follows
    const str3 = `<img alt='Deal is your's!" class='tralala"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 9), "27.11");
    t.false(is(str3, 9, 22), "27.12");
    t.true(is(str3, 9, 25), "27.13"); // <--
    t.false(is(str3, 9, 33), "27.14");
    t.false(is(str3, 9, 41), "27.15");

    // S-S follows
    const str4 = `<img alt='Deal is your's!" class='tralala'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 9), "27.16");
    t.false(is(str4, 9, 22), "27.17");
    t.true(is(str4, 9, 25), "27.18"); // <--
    t.false(is(str4, 9, 33), "27.19");
    t.false(is(str4, 9, 41), "27.20");

    // fin.
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "28.01");
    t.false(is(str1, 9, 28), "28.02");
    t.true(is(str1, 9, 30), "28.03"); // <--

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!"/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "28.04");
    t.false(is(str2, 9, 28), "28.05");
    t.true(is(str2, 9, 30), "28.06"); // <--

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!'/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "28.07");
    t.false(is(str3, 9, 28), "28.08");
    t.true(is(str3, 9, 30), "28.09"); // <--

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "28.10");
    t.false(is(str4, 9, 28), "28.11");
    t.true(is(str4, 9, 30), "28.12"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, D-D`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id="yo"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "29.01");
    t.false(is(str1, 9, 28), "29.02");
    t.true(is(str1, 9, 30), "29.03"); // <--
    t.false(is(str1, 9, 35), "29.04");
    t.false(is(str1, 9, 38), "29.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id="yo"/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "29.06");
    t.false(is(str2, 9, 28), "29.07");
    t.true(is(str2, 9, 30), "29.08"); // <--
    t.false(is(str1, 9, 35), "29.09");
    t.false(is(str1, 9, 38), "29.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id="yo"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "29.11");
    t.false(is(str3, 9, 28), "29.12");
    t.true(is(str3, 9, 30), "29.13"); // <--
    t.false(is(str1, 9, 35), "29.14");
    t.false(is(str1, 9, 38), "29.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id="yo"/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "29.16");
    t.false(is(str4, 9, 28), "29.17");
    t.true(is(str4, 9, 30), "29.18"); // <--
    t.false(is(str1, 9, 35), "29.19");
    t.false(is(str1, 9, 38), "29.20");

    // fin.
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, D-S`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id="yo'/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "30.01");
    t.false(is(str1, 9, 28), "30.02");
    t.true(is(str1, 9, 30), "30.03"); // <--
    t.false(is(str1, 9, 35), "30.04");
    t.false(is(str1, 9, 38), "30.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id="yo'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "30.06");
    t.false(is(str2, 9, 28), "30.07");
    t.true(is(str2, 9, 30), "30.08"); // <--
    t.false(is(str1, 9, 35), "30.09");
    t.false(is(str1, 9, 38), "30.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id="yo'/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "30.11");
    t.false(is(str3, 9, 28), "30.12");
    t.true(is(str3, 9, 30), "30.13"); // <--
    t.false(is(str1, 9, 35), "30.14");
    t.false(is(str1, 9, 38), "30.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id="yo'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "30.16");
    t.false(is(str4, 9, 28), "30.17");
    t.true(is(str4, 9, 30), "30.18"); // <--
    t.false(is(str1, 9, 35), "30.19");
    t.false(is(str1, 9, 38), "30.20");

    // fin.
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, S-D`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id='yo"/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "31.01");
    t.false(is(str1, 9, 28), "31.02");
    t.true(is(str1, 9, 30), "31.03"); // <--
    t.false(is(str1, 9, 35), "31.04");
    t.false(is(str1, 9, 38), "31.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id='yo"/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "31.06");
    t.false(is(str2, 9, 28), "31.07");
    t.true(is(str2, 9, 30), "31.08"); // <--
    t.false(is(str1, 9, 35), "31.09");
    t.false(is(str1, 9, 38), "31.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id='yo"/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "31.11");
    t.false(is(str3, 9, 28), "31.12");
    t.true(is(str3, 9, 30), "31.13"); // <--
    t.false(is(str1, 9, 35), "31.14");
    t.false(is(str1, 9, 38), "31.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id='yo"/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "31.16");
    t.false(is(str4, 9, 28), "31.17");
    t.true(is(str4, 9, 30), "31.18"); // <--
    t.false(is(str1, 9, 35), "31.19");
    t.false(is(str1, 9, 38), "31.20");

    // fin.
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, S-S`,
  (t) => {
    // D-D-D-D
    const str1 = `<img alt="so-called "artists"!" id='yo'/>`;

    // alt opening at 9
    t.false(is(str1, 9, 20), "32.01");
    t.false(is(str1, 9, 28), "32.02");
    t.true(is(str1, 9, 30), "32.03"); // <--
    t.false(is(str1, 9, 35), "32.04");
    t.false(is(str1, 9, 38), "32.05");

    // S-D-D-D
    const str2 = `<img alt='so-called "artists"!" id='yo'/>`;

    // alt opening at 9
    t.false(is(str2, 9, 20), "32.06");
    t.false(is(str2, 9, 28), "32.07");
    t.true(is(str2, 9, 30), "32.08"); // <--
    t.false(is(str1, 9, 35), "32.09");
    t.false(is(str1, 9, 38), "32.10");

    // D-D-D-S
    const str3 = `<img alt="so-called "artists"!' id='yo'/>`;

    // alt opening at 9
    t.false(is(str3, 9, 20), "32.11");
    t.false(is(str3, 9, 28), "32.12");
    t.true(is(str3, 9, 30), "32.13"); // <--
    t.false(is(str1, 9, 35), "32.14");
    t.false(is(str1, 9, 38), "32.15");

    // S-D-D-S
    const str4 = `<img alt='so-called "artists"!' id='yo'/>`;

    // alt opening at 9
    t.false(is(str4, 9, 20), "32.16");
    t.false(is(str4, 9, 28), "32.17");
    t.true(is(str4, 9, 30), "32.18"); // <--
    t.false(is(str1, 9, 35), "32.19");
    t.false(is(str1, 9, 38), "32.20");

    // fin.
    t.end();
  }
);
