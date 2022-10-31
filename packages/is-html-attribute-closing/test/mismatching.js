import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";
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

test(`01 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap`, () => {
  // healthy tag being:
  // <img alt='so-called "artists"!' class='yo'/>

  let str = `<img alt="so-called "artists"!' class='yo'/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 20), "01.01");
  not.ok(isCl(str, 9, 28), "01.02");
  ok(isCl(str, 9, 30), "01.03"); // <--

  // fin.
});

test(`02 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - similar but opposite`, () => {
  // healthy tag being:
  // <img class="so-called" alt="!" border='10'/>

  let str = `<img class="so-called "alt"!' border='10'/>`;

  // class opening at 11
  ok(isCl(str, 11, 22), "02.01"); // <-- !!!
  not.ok(isCl(str, 11, 26), "02.02");
  not.ok(isCl(str, 11, 28), "02.03");
  not.ok(isCl(str, 11, 37), "02.04");
  not.ok(isCl(str, 11, 40), "02.05");

  // fin.
});

test(`03 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - also similar`, () => {
  // healthy tag being:
  // <img class="so-called" alt="!" border='10'/>

  let str = `<img class="so-called "alt !' border 10'/>`;

  // class opening at 11
  ok(isCl(str, 11, 22), "03.01");
  not.ok(isCl(str, 11, 28), "03.02");
  not.ok(isCl(str, 11, 39), "03.03");

  // fin.
});

test(`04 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - basic, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt="="/>`;
  ok(isCl(str, 19, 21), "04.01"); // <--

  // fin.
});

test(`05 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - two attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<div class="c' id="x'>.</div>`;

  // class opening at 11
  not.ok(isCl(str, 11, 11), "05.01");
  ok(isCl(str, 11, 13), "05.02"); // <--
  not.ok(isCl(str, 11, 18), "05.03");
  not.ok(isCl(str, 11, 20), "05.04");

  // id opening at 18
  not.ok(isCl(str, 18, 11), "05.05");
  not.ok(isCl(str, 18, 13), "05.06");
  not.ok(isCl(str, 18, 18), "05.07");
  ok(isCl(str, 18, 20), "05.08"); // <--

  // fin.
});

test(`06 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - two attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<div class='c" id='x">.</div>`;

  // class opening at 11
  not.ok(isCl(str, 11, 11), "06.01");
  ok(isCl(str, 11, 13), "06.02"); // <--
  not.ok(isCl(str, 11, 18), "06.03");
  not.ok(isCl(str, 11, 20), "06.04");

  // id opening at 18
  not.ok(isCl(str, 18, 11), "06.05");
  not.ok(isCl(str, 18, 13), "06.06");
  not.ok(isCl(str, 18, 18), "06.07");
  ok(isCl(str, 18, 20), "06.08"); // <--

  // fin.
});

test(`07 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - three attr pairs, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<div class="c' id="x' style='c">.</div>`;

  // class opening at 11
  not.ok(isCl(str, 11, 11), "07.01");
  ok(isCl(str, 11, 13), "07.02"); // <--
  not.ok(isCl(str, 11, 18), "07.03");
  not.ok(isCl(str, 11, 20), "07.04");
  not.ok(isCl(str, 11, 28), "07.05");
  not.ok(isCl(str, 11, 30), "07.06");

  // class opening at 18
  not.ok(isCl(str, 18, 11), "07.07");
  not.ok(isCl(str, 18, 13), "07.08");
  not.ok(isCl(str, 18, 18), "07.09");
  ok(isCl(str, 18, 20), "07.10"); // <--
  not.ok(isCl(str, 18, 28), "07.11");
  not.ok(isCl(str, 18, 30), "07.12");

  // style opening at 28
  not.ok(isCl(str, 28, 11), "07.13");
  not.ok(isCl(str, 28, 13), "07.14");
  not.ok(isCl(str, 28, 18), "07.15");
  not.ok(isCl(str, 28, 20), "07.16");
  not.ok(isCl(str, 28, 28), "07.17");
  ok(isCl(str, 28, 30), "07.18"); // <--

  // fin.
});

test(`08 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - three attr pairs, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<div class='c" id='x" style="c'>.</div>`;

  // class opening at 11
  not.ok(isCl(str, 11, 11), "08.01");
  ok(isCl(str, 11, 13), "08.02"); // <--
  not.ok(isCl(str, 11, 18), "08.03");
  not.ok(isCl(str, 11, 20), "08.04");
  not.ok(isCl(str, 11, 28), "08.05");
  not.ok(isCl(str, 11, 30), "08.06");

  // class opening at 18
  not.ok(isCl(str, 18, 11), "08.07");
  not.ok(isCl(str, 18, 13), "08.08");
  not.ok(isCl(str, 18, 18), "08.09");
  ok(isCl(str, 18, 20), "08.10"); // <--
  not.ok(isCl(str, 18, 28), "08.11");
  not.ok(isCl(str, 18, 30), "08.12");

  // style opening at 28
  not.ok(isCl(str, 28, 11), "08.13");
  not.ok(isCl(str, 28, 13), "08.14");
  not.ok(isCl(str, 28, 18), "08.15");
  not.ok(isCl(str, 28, 20), "08.16");
  not.ok(isCl(str, 28, 28), "08.17");
  ok(isCl(str, 28, 30), "08.18"); // <--

  // fin.
});

test(`09 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy singles inside doubles, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<img alt='so-called "artists"!'/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "09.01");
  not.ok(isCl(str, 9, 20), "09.02");
  not.ok(isCl(str, 9, 28), "09.03");
  ok(isCl(str, 9, 30), "09.04"); // <--

  // two pairs of doubles inside a pair of singles - all healthy:
  let str2 = `<img alt='so-called "artists" and "critics"!'/>`;
  not.ok(isCl(str2, 9, 20), "09.05");
  not.ok(isCl(str2, 9, 28), "09.06");
  not.ok(isCl(str2, 9, 34), "09.07");
  not.ok(isCl(str2, 9, 42), "09.08");
  ok(isCl(str2, 9, 44), "09.09"); // <--

  // fin.
});

test(`10 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy singles inside doubles, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<img alt="so-called 'artists'!"/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "10.01");
  not.ok(isCl(str, 9, 20), "10.02");
  not.ok(isCl(str, 9, 28), "10.03");
  ok(isCl(str, 9, 30), "10.04"); // <--

  // fin.
});

// S - D - D - S

test(`11 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`, () => {
  let str = `<img alt='so-called "artists"!' class='yo'/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "11.01");
  not.ok(isCl(str, 9, 20), "11.02");
  not.ok(isCl(str, 9, 28), "11.03");
  ok(isCl(str, 9, 30), "11.04"); // <--
  not.ok(isCl(str, 9, 38), "11.05");
  not.ok(isCl(str, 9, 41), "11.06");

  // fin.
});

test(`12 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`, () => {
  let str = `<img alt='so-called "artists"!' class='yo"/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "12.01");
  not.ok(isCl(str, 9, 20), "12.02");
  not.ok(isCl(str, 9, 28), "12.03");
  ok(isCl(str, 9, 30), "12.04"); // <--
  not.ok(isCl(str, 9, 38), "12.05");
  not.ok(isCl(str, 9, 41), "12.06");

  // fin.
});

test(`13 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`, () => {
  let str = `<img alt='so-called "artists"!' class="yo'/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "13.01");
  not.ok(isCl(str, 9, 20), "13.02");
  not.ok(isCl(str, 9, 28), "13.03");
  ok(isCl(str, 9, 30), "13.04"); // <--
  not.ok(isCl(str, 9, 38), "13.05");
  not.ok(isCl(str, 9, 41), "13.06");

  // fin.
});

test(`14 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`, () => {
  let str = `<img alt='so-called "artists"!' class="yo"/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "14.01");
  not.ok(isCl(str, 9, 20), "14.02");
  not.ok(isCl(str, 9, 28), "14.03");
  ok(isCl(str, 9, 30), "14.04"); // <--
  not.ok(isCl(str, 9, 38), "14.05");
  not.ok(isCl(str, 9, 41), "14.06");

  // fin.
});

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

test(`15 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`, () => {
  let str = `<img alt='so-called "artists"!" class='yo'/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "15.01");
  not.ok(isCl(str, 9, 20), "15.02");
  not.ok(isCl(str, 9, 28), "15.03");
  ok(isCl(str, 9, 30), "15.04"); // <--
  not.ok(isCl(str, 9, 38), "15.05");
  not.ok(isCl(str, 9, 41), "15.06");

  // fin.
});

test(`16 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`, () => {
  let str = `<img alt='so-called "artists"!" class='yo"/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "16.01");
  not.ok(isCl(str, 9, 20), "16.02");
  not.ok(isCl(str, 9, 28), "16.03");
  ok(isCl(str, 9, 30), "16.04"); // <--
  not.ok(isCl(str, 9, 38), "16.05");
  not.ok(isCl(str, 9, 41), "16.06");

  // fin.
});

test(`17 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`, () => {
  let str = `<img alt='so-called "artists"!" class="yo'/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "17.01");
  not.ok(isCl(str, 9, 20), "17.02");
  not.ok(isCl(str, 9, 28), "17.03");
  ok(isCl(str, 9, 30), "17.04"); // <--
  not.ok(isCl(str, 9, 38), "17.05");
  not.ok(isCl(str, 9, 41), "17.06");

  // fin.
});

test(`18 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`, () => {
  let str = `<img alt='so-called "artists"!" class="yo"/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "18.01");
  not.ok(isCl(str, 9, 20), "18.02");
  not.ok(isCl(str, 9, 28), "18.03");
  ok(isCl(str, 9, 30), "18.04"); // <--
  not.ok(isCl(str, 9, 38), "18.05");
  not.ok(isCl(str, 9, 41), "18.06");

  // fin.
});

// D - D - D - S

test(`19 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`, () => {
  let str = `<img alt="so-called "artists"!' class='yo'/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "19.01");
  not.ok(isCl(str, 9, 20), "19.02");
  not.ok(isCl(str, 9, 28), "19.03");
  ok(isCl(str, 9, 30), "19.04"); // <--
  not.ok(isCl(str, 9, 38), "19.05");
  not.ok(isCl(str, 9, 41), "19.06");

  // fin.
});

test(`20 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - false positive of 02.19.*`, () => {
  let str = `<img alt="so-called "artists"class='yo'/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "20.01");
  not.ok(isCl(str, 9, 20), "20.02");
  ok(isCl(str, 9, 28), "20.03"); // <--
  not.ok(isCl(str, 9, 35), "20.04");
  not.ok(isCl(str, 9, 38), "20.05");

  // fin.
});

test(`21 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`, () => {
  let str = `<img alt="so-called "artists"!' class='yo"/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "21.01");
  not.ok(isCl(str, 9, 20), "21.02");
  not.ok(isCl(str, 9, 28), "21.03");
  ok(isCl(str, 9, 30), "21.04"); // <--
  not.ok(isCl(str, 9, 38), "21.05");
  not.ok(isCl(str, 9, 41), "21.06");

  // fin.
});

test(`22 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m follows`, () => {
  let str = `<img alt="so-called "artists"!' class="yo'/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "22.01");
  not.ok(isCl(str, 9, 20), "22.02");
  not.ok(isCl(str, 9, 28), "22.03");
  ok(isCl(str, 9, 30), "22.04"); // <--
  not.ok(isCl(str, 9, 38), "22.05");
  not.ok(isCl(str, 9, 41), "22.06");

  // fin.
});

test(`23 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - healthy \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m, \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m follows`, () => {
  let str = `<img alt="so-called "artists"!' class="yo"/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "23.01");
  not.ok(isCl(str, 9, 20), "23.02");
  not.ok(isCl(str, 9, 28), "23.03");
  ok(isCl(str, 9, 30), "23.04"); // <--
  not.ok(isCl(str, 9, 38), "23.05");
  not.ok(isCl(str, 9, 41), "23.06");

  // fin.
});

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

test(`24 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<img alt="Deal is your's!'/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "24.01");
  not.ok(isCl(str, 9, 22), "24.02");
  ok(isCl(str, 9, 25), "24.03"); // <--

  // fin.
});

test(`25 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<img alt='Deal is your's!"/>`;

  // alt opening at 9
  not.ok(isCl(str, 9, 9), "25.01");
  not.ok(isCl(str, 9, 22), "25.02");
  ok(isCl(str, 9, 25), "25.03"); // <--

  // more tags follow
  let str2 = `<img alt='Deal is your's!"/><span class="h'>zzz</span>`;

  // alt opening at 9
  not.ok(isCl(str2, 9, 9), "25.04");
  not.ok(isCl(str2, 9, 22), "25.05");
  ok(isCl(str2, 9, 25), "25.06"); // <--
  not.ok(isCl(str2, 9, 40), "25.07");
  not.ok(isCl(str2, 9, 42), "25.08");

  let str3 = `<img alt='Deal is your's"/>`;
  ok(isCl(str3, 9, 24), "25.09");

  // anti-pattern
  let str4 = `<img alt='Deal is your'class""/>`;
  ok(isCl(str4, 9, 22), "25.10");
  not.ok(isCl(str4, 9, 28), "25.11");
  not.ok(isCl(str4, 9, 29), "25.12");

  // anti-pattern
  let str5 = `<img alt='Deal is your'class="/>`;
  ok(isCl(str5, 9, 22), "25.13");
  not.ok(isCl(str5, 9, 29), "25.14");

  // fin.
});

test(`26 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m - more follows`, () => {
  // D-D follows
  let str1 = `<img alt="Deal is your's!' class="tralala"/>`;

  // alt opening at 9
  not.ok(isCl(str1, 9, 9), "26.01");
  not.ok(isCl(str1, 9, 22), "26.02");
  ok(isCl(str1, 9, 25), "26.03"); // <--
  not.ok(isCl(str1, 9, 33), "26.04");
  not.ok(isCl(str1, 9, 41), "26.05");

  // D-S follows
  let str2 = `<img alt="Deal is your's!' class="tralala'/>`;

  // alt opening at 9
  not.ok(isCl(str2, 9, 9), "26.06");
  not.ok(isCl(str2, 9, 22), "26.07");
  ok(isCl(str2, 9, 25), "26.08"); // <--
  not.ok(isCl(str2, 9, 33), "26.09");
  not.ok(isCl(str2, 9, 41), "26.10");

  // S-D follows
  let str3 = `<img alt="Deal is your's!' class='tralala"/>`;

  // alt opening at 9
  not.ok(isCl(str3, 9, 9), "26.11");
  not.ok(isCl(str3, 9, 22), "26.12");
  ok(isCl(str3, 9, 25), "26.13"); // <--
  not.ok(isCl(str3, 9, 33), "26.14");
  not.ok(isCl(str3, 9, 41), "26.15");

  // S-S follows
  let str4 = `<img alt="Deal is your's!' class='tralala'/>`;

  // alt opening at 9
  not.ok(isCl(str4, 9, 9), "26.16");
  not.ok(isCl(str4, 9, 22), "26.17");
  ok(isCl(str4, 9, 25), "26.18"); // <--
  not.ok(isCl(str4, 9, 33), "26.19");
  not.ok(isCl(str4, 9, 41), "26.20");

  // fin.
});

test(`27 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - one inside \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m - more follows`, () => {
  // D-D follows
  let str1 = `<img alt='Deal is your's!" class="tralala"/>`;

  // alt opening at 9
  not.ok(isCl(str1, 9, 9), "27.01");
  not.ok(isCl(str1, 9, 22), "27.02");
  ok(isCl(str1, 9, 25), "27.03"); // <--
  not.ok(isCl(str1, 9, 33), "27.04");
  not.ok(isCl(str1, 9, 41), "27.05");

  // D-S follows
  let str2 = `<img alt='Deal is your's!" class="tralala'/>`;

  // alt opening at 9
  not.ok(isCl(str2, 9, 9), "27.06");
  not.ok(isCl(str2, 9, 22), "27.07");
  ok(isCl(str2, 9, 25), "27.08"); // <--
  not.ok(isCl(str2, 9, 33), "27.09");
  not.ok(isCl(str2, 9, 41), "27.10");

  // S-D follows
  let str3 = `<img alt='Deal is your's!" class='tralala"/>`;

  // alt opening at 9
  not.ok(isCl(str3, 9, 9), "27.11");
  not.ok(isCl(str3, 9, 22), "27.12");
  ok(isCl(str3, 9, 25), "27.13"); // <--
  not.ok(isCl(str3, 9, 33), "27.14");
  not.ok(isCl(str3, 9, 41), "27.15");

  // S-S follows
  let str4 = `<img alt='Deal is your's!" class='tralala'/>`;

  // alt opening at 9
  not.ok(isCl(str4, 9, 9), "27.16");
  not.ok(isCl(str4, 9, 22), "27.17");
  ok(isCl(str4, 9, 25), "27.18"); // <--
  not.ok(isCl(str4, 9, 33), "27.19");
  not.ok(isCl(str4, 9, 41), "27.20");

  // fin.
});

test(`28 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap`, () => {
  // D-D-D-D
  let str1 = `<img alt="so-called "artists"!"/>`;

  // alt opening at 9
  not.ok(isCl(str1, 9, 20), "28.01");
  not.ok(isCl(str1, 9, 28), "28.02");
  ok(isCl(str1, 9, 30), "28.03"); // <--

  // S-D-D-D
  let str2 = `<img alt='so-called "artists"!"/>`;

  // alt opening at 9
  not.ok(isCl(str2, 9, 20), "28.04");
  not.ok(isCl(str2, 9, 28), "28.05");
  ok(isCl(str2, 9, 30), "28.06"); // <--

  // D-D-D-S
  let str3 = `<img alt="so-called "artists"!'/>`;

  // alt opening at 9
  not.ok(isCl(str3, 9, 20), "28.07");
  not.ok(isCl(str3, 9, 28), "28.08");
  ok(isCl(str3, 9, 30), "28.09"); // <--

  // S-D-D-S
  let str4 = `<img alt='so-called "artists"!'/>`;

  // alt opening at 9
  not.ok(isCl(str4, 9, 20), "28.10");
  not.ok(isCl(str4, 9, 28), "28.11");
  ok(isCl(str4, 9, 30), "28.12"); // <--

  // fin.
});

test(`29 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, D-D`, () => {
  // D-D-D-D
  let str1 = `<img alt="so-called "artists"!" id="yo"/>`;

  // alt opening at 9
  not.ok(isCl(str1, 9, 20), "29.01");
  not.ok(isCl(str1, 9, 28), "29.02");
  ok(isCl(str1, 9, 30), "29.03"); // <--
  not.ok(isCl(str1, 9, 35), "29.04");
  not.ok(isCl(str1, 9, 38), "29.05");

  // S-D-D-D
  let str2 = `<img alt='so-called "artists"!" id="yo"/>`;

  // alt opening at 9
  not.ok(isCl(str2, 9, 20), "29.06");
  not.ok(isCl(str2, 9, 28), "29.07");
  ok(isCl(str2, 9, 30), "29.08"); // <--
  not.ok(isCl(str1, 9, 35), "29.09");
  not.ok(isCl(str1, 9, 38), "29.10");

  // D-D-D-S
  let str3 = `<img alt="so-called "artists"!' id="yo"/>`;

  // alt opening at 9
  not.ok(isCl(str3, 9, 20), "29.11");
  not.ok(isCl(str3, 9, 28), "29.12");
  ok(isCl(str3, 9, 30), "29.13"); // <--
  not.ok(isCl(str1, 9, 35), "29.14");
  not.ok(isCl(str1, 9, 38), "29.15");

  // S-D-D-S
  let str4 = `<img alt='so-called "artists"!' id="yo"/>`;

  // alt opening at 9
  not.ok(isCl(str4, 9, 20), "29.16");
  not.ok(isCl(str4, 9, 28), "29.17");
  ok(isCl(str4, 9, 30), "29.18"); // <--
  not.ok(isCl(str1, 9, 35), "29.19");
  not.ok(isCl(str1, 9, 38), "29.20");

  // fin.
});

test(`30 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, D-S`, () => {
  // D-D-D-D
  let str1 = `<img alt="so-called "artists"!" id="yo'/>`;

  // alt opening at 9
  not.ok(isCl(str1, 9, 20), "30.01");
  not.ok(isCl(str1, 9, 28), "30.02");
  ok(isCl(str1, 9, 30), "30.03"); // <--
  not.ok(isCl(str1, 9, 35), "30.04");
  not.ok(isCl(str1, 9, 38), "30.05");

  // S-D-D-D
  let str2 = `<img alt='so-called "artists"!" id="yo'/>`;

  // alt opening at 9
  not.ok(isCl(str2, 9, 20), "30.06");
  not.ok(isCl(str2, 9, 28), "30.07");
  ok(isCl(str2, 9, 30), "30.08"); // <--
  not.ok(isCl(str1, 9, 35), "30.09");
  not.ok(isCl(str1, 9, 38), "30.10");

  // D-D-D-S
  let str3 = `<img alt="so-called "artists"!' id="yo'/>`;

  // alt opening at 9
  not.ok(isCl(str3, 9, 20), "30.11");
  not.ok(isCl(str3, 9, 28), "30.12");
  ok(isCl(str3, 9, 30), "30.13"); // <--
  not.ok(isCl(str1, 9, 35), "30.14");
  not.ok(isCl(str1, 9, 38), "30.15");

  // S-D-D-S
  let str4 = `<img alt='so-called "artists"!' id="yo'/>`;

  // alt opening at 9
  not.ok(isCl(str4, 9, 20), "30.16");
  not.ok(isCl(str4, 9, 28), "30.17");
  ok(isCl(str4, 9, 30), "30.18"); // <--
  not.ok(isCl(str1, 9, 35), "30.19");
  not.ok(isCl(str1, 9, 38), "30.20");

  // fin.
});

test(`31 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, S-D`, () => {
  // D-D-D-D
  let str1 = `<img alt="so-called "artists"!" id='yo"/>`;

  // alt opening at 9
  not.ok(isCl(str1, 9, 20), "31.01");
  not.ok(isCl(str1, 9, 28), "31.02");
  ok(isCl(str1, 9, 30), "31.03"); // <--
  not.ok(isCl(str1, 9, 35), "31.04");
  not.ok(isCl(str1, 9, 38), "31.05");

  // S-D-D-D
  let str2 = `<img alt='so-called "artists"!" id='yo"/>`;

  // alt opening at 9
  not.ok(isCl(str2, 9, 20), "31.06");
  not.ok(isCl(str2, 9, 28), "31.07");
  ok(isCl(str2, 9, 30), "31.08"); // <--
  not.ok(isCl(str1, 9, 35), "31.09");
  not.ok(isCl(str1, 9, 38), "31.10");

  // D-D-D-S
  let str3 = `<img alt="so-called "artists"!' id='yo"/>`;

  // alt opening at 9
  not.ok(isCl(str3, 9, 20), "31.11");
  not.ok(isCl(str3, 9, 28), "31.12");
  ok(isCl(str3, 9, 30), "31.13"); // <--
  not.ok(isCl(str1, 9, 35), "31.14");
  not.ok(isCl(str1, 9, 38), "31.15");

  // S-D-D-S
  let str4 = `<img alt='so-called "artists"!' id='yo"/>`;

  // alt opening at 9
  not.ok(isCl(str4, 9, 20), "31.16");
  not.ok(isCl(str4, 9, 28), "31.17");
  ok(isCl(str4, 9, 30), "31.18"); // <--
  not.ok(isCl(str1, 9, 35), "31.19");
  not.ok(isCl(str1, 9, 38), "31.20");

  // fin.
});

test(`32 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - a trap, second attr, S-S`, () => {
  // D-D-D-D
  let str1 = `<img alt="so-called "artists"!" id='yo'/>`;

  // alt opening at 9
  not.ok(isCl(str1, 9, 20), "32.01");
  not.ok(isCl(str1, 9, 28), "32.02");
  ok(isCl(str1, 9, 30), "32.03"); // <--
  not.ok(isCl(str1, 9, 35), "32.04");
  not.ok(isCl(str1, 9, 38), "32.05");

  // S-D-D-D
  let str2 = `<img alt='so-called "artists"!" id='yo'/>`;

  // alt opening at 9
  not.ok(isCl(str2, 9, 20), "32.06");
  not.ok(isCl(str2, 9, 28), "32.07");
  ok(isCl(str2, 9, 30), "32.08"); // <--
  not.ok(isCl(str1, 9, 35), "32.09");
  not.ok(isCl(str1, 9, 38), "32.10");

  // D-D-D-S
  let str3 = `<img alt="so-called "artists"!' id='yo'/>`;

  // alt opening at 9
  not.ok(isCl(str3, 9, 20), "32.11");
  not.ok(isCl(str3, 9, 28), "32.12");
  ok(isCl(str3, 9, 30), "32.13"); // <--
  not.ok(isCl(str1, 9, 35), "32.14");
  not.ok(isCl(str1, 9, 38), "32.15");

  // S-D-D-S
  let str4 = `<img alt='so-called "artists"!' id='yo'/>`;

  // alt opening at 9
  not.ok(isCl(str4, 9, 20), "32.16");
  not.ok(isCl(str4, 9, 28), "32.17");
  ok(isCl(str4, 9, 30), "32.18"); // <--
  not.ok(isCl(str1, 9, 35), "32.19");
  not.ok(isCl(str1, 9, 38), "32.20");

  // fin.
});

test.run();
