import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";
// const BACKSLASH = "\u005C";

// cheeky cases
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

test(`01 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt="="/>`;

  // src opening at 9
  not.ok(isCl(str, 9, 9), "01.01");
  ok(isCl(str, 9, 13), "01.01"); // <--
  not.ok(isCl(str, 9, 19), "01.03");
  not.ok(isCl(str, 9, 21), "01.04");

  // alt opening at 19
  not.ok(isCl(str, 19, 9), "01.05");
  not.ok(isCl(str, 19, 13), "01.06");
  not.ok(isCl(str, 19, 19), "01.07");
  ok(isCl(str, 19, 21), "01.02"); // <--

  // fin.
});

test(`02 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt='='/>`;

  // src opening at 9
  not.ok(isCl(str, 9, 9), "02.01");
  ok(isCl(str, 9, 13), "02.01"); // <--
  not.ok(isCl(str, 9, 19), "02.03");
  not.ok(isCl(str, 9, 21), "02.04");

  // alt opening at 19
  not.ok(isCl(str, 19, 9), "02.05");
  not.ok(isCl(str, 19, 13), "02.06");
  not.ok(isCl(str, 19, 19), "02.07");
  ok(isCl(str, 19, 21), "02.02"); // <--

  // fin.
});

test(`03 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt="='/>`;

  // src opening at 9
  not.ok(isCl(str, 9, 9), "03.01");
  ok(isCl(str, 9, 13), "03.01"); // <--
  not.ok(isCl(str, 9, 19), "03.03");
  not.ok(isCl(str, 9, 21), "03.04");

  // alt opening at 19
  not.ok(isCl(str, 19, 9), "03.05");
  not.ok(isCl(str, 19, 13), "03.06");
  not.ok(isCl(str, 19, 19), "03.07");
  ok(isCl(str, 19, 21), "03.02"); // <--

  // fin.
});

test(`04 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt='="/>`;

  // src opening at 9
  not.ok(isCl(str, 9, 9), "04.01");
  ok(isCl(str, 9, 13), "04.01"); // <--
  not.ok(isCl(str, 9, 19), "04.03");
  not.ok(isCl(str, 9, 21), "04.04");

  // alt opening at 19
  not.ok(isCl(str, 19, 9), "04.05");
  not.ok(isCl(str, 19, 13), "04.06");
  not.ok(isCl(str, 19, 19), "04.07");
  ok(isCl(str, 19, 21), "04.02"); // <--

  // fin.
});

//
//                               three attributes
//

test(`05 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt="=" class="klm"/>`;

  // src opening at 9
  not.ok(isCl(str, 9, 9), "05.01");
  ok(isCl(str, 9, 13), "05.01"); // <--
  not.ok(isCl(str, 9, 19), "05.03");
  not.ok(isCl(str, 9, 21), "05.04");
  not.ok(isCl(str, 9, 29), "05.05");
  not.ok(isCl(str, 9, 33), "05.06");

  // alt opening at 19
  not.ok(isCl(str, 19, 9), "05.07");
  not.ok(isCl(str, 19, 13), "05.08");
  not.ok(isCl(str, 19, 19), "05.09");
  ok(isCl(str, 19, 21), "05.02"); // <--
  not.ok(isCl(str, 19, 29), "05.11");
  not.ok(isCl(str, 19, 33), "05.12");

  // class opening at 29
  not.ok(isCl(str, 29, 9), "05.13");
  not.ok(isCl(str, 29, 13), "05.14");
  not.ok(isCl(str, 29, 19), "05.15");
  not.ok(isCl(str, 29, 21), "05.16");
  not.ok(isCl(str, 29, 29), "05.17");
  ok(isCl(str, 29, 33), "05.03"); // <--

  // fin.
});

test(`06 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt='=' class="klm'/>`;

  // src opening at 9
  not.ok(isCl(str, 9, 9), "06.01");
  ok(isCl(str, 9, 13), "06.01"); // <--
  not.ok(isCl(str, 9, 19), "06.03");
  not.ok(isCl(str, 9, 21), "06.04");
  not.ok(isCl(str, 9, 29), "06.05");
  not.ok(isCl(str, 9, 33), "06.06");

  // alt opening at 19
  not.ok(isCl(str, 19, 9), "06.07");
  not.ok(isCl(str, 19, 13), "06.08");
  not.ok(isCl(str, 19, 19), "06.09");
  ok(isCl(str, 19, 21), "06.02"); // <--
  not.ok(isCl(str, 19, 29), "06.11");
  not.ok(isCl(str, 19, 33), "06.12");

  // class opening at 29
  not.ok(isCl(str, 29, 9), "06.13");
  not.ok(isCl(str, 29, 13), "06.14");
  not.ok(isCl(str, 29, 19), "06.15");
  not.ok(isCl(str, 29, 21), "06.16");
  not.ok(isCl(str, 29, 29), "06.17");
  ok(isCl(str, 29, 33), "06.03"); // <--

  // fin.
});

test(`07 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt='=' class='klm"/>`;

  // src opening at 9
  not.ok(isCl(str, 9, 9), "07.01");
  ok(isCl(str, 9, 13), "07.01"); // <--
  not.ok(isCl(str, 9, 19), "07.03");
  not.ok(isCl(str, 9, 21), "07.04");
  not.ok(isCl(str, 9, 29), "07.05");
  not.ok(isCl(str, 9, 33), "07.06");

  // alt opening at 19
  not.ok(isCl(str, 19, 9), "07.07");
  not.ok(isCl(str, 19, 13), "07.08");
  not.ok(isCl(str, 19, 19), "07.09");
  ok(isCl(str, 19, 21), "07.02"); // <--
  not.ok(isCl(str, 19, 29), "07.11");
  not.ok(isCl(str, 19, 33), "07.12");

  // class opening at 29
  not.ok(isCl(str, 29, 9), "07.13");
  not.ok(isCl(str, 29, 13), "07.14");
  not.ok(isCl(str, 29, 19), "07.15");
  not.ok(isCl(str, 29, 21), "07.16");
  not.ok(isCl(str, 29, 29), "07.17");
  ok(isCl(str, 29, 33), "07.03"); // <--

  // fin.
});

test(`08 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt='=" class="klm"/>`;

  // src opening at 9
  not.ok(isCl(str, 9, 9), "08.01");
  ok(isCl(str, 9, 13), "08.01"); // <--
  not.ok(isCl(str, 9, 19), "08.03");
  not.ok(isCl(str, 9, 21), "08.04");
  not.ok(isCl(str, 9, 29), "08.05");
  not.ok(isCl(str, 9, 33), "08.06");

  // alt opening at 19
  not.ok(isCl(str, 19, 9), "08.07");
  not.ok(isCl(str, 19, 13), "08.08");
  not.ok(isCl(str, 19, 19), "08.09");
  ok(isCl(str, 19, 21), "08.02"); // <--
  not.ok(isCl(str, 19, 29), "08.11");
  not.ok(isCl(str, 19, 33), "08.12");

  // class opening at 29
  not.ok(isCl(str, 29, 9), "08.13");
  not.ok(isCl(str, 29, 13), "08.14");
  not.ok(isCl(str, 29, 19), "08.15");
  not.ok(isCl(str, 29, 21), "08.16");
  not.ok(isCl(str, 29, 29), "08.17");
  ok(isCl(str, 29, 33), "08.03"); // <--

  // fin.
});

test(`09 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt='=" class="klm'/>`;

  // src opening at 9
  not.ok(isCl(str, 9, 9), "09.01");
  ok(isCl(str, 9, 13), "09.01"); // <--
  not.ok(isCl(str, 9, 19), "09.03");
  not.ok(isCl(str, 9, 21), "09.04");
  not.ok(isCl(str, 9, 29), "09.05");
  not.ok(isCl(str, 9, 33), "09.06");

  // alt opening at 19
  not.ok(isCl(str, 19, 9), "09.07");
  not.ok(isCl(str, 19, 13), "09.08");
  not.ok(isCl(str, 19, 19), "09.09");
  ok(isCl(str, 19, 21), "09.02"); // <--
  not.ok(isCl(str, 19, 29), "09.11");
  not.ok(isCl(str, 19, 33), "09.12");

  // class opening at 29
  not.ok(isCl(str, 29, 9), "09.13");
  not.ok(isCl(str, 29, 13), "09.14");
  not.ok(isCl(str, 29, 19), "09.15");
  not.ok(isCl(str, 29, 21), "09.16");
  not.ok(isCl(str, 29, 29), "09.17");
  ok(isCl(str, 29, 33), "09.03"); // <--

  // fin.
});

test(`10 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt='=" class='klm"/>`;

  // src opening at 9
  not.ok(isCl(str, 9, 9), "10.01");
  ok(isCl(str, 9, 13), "10.01"); // <--
  not.ok(isCl(str, 9, 19), "10.03");
  not.ok(isCl(str, 9, 21), "10.04");
  not.ok(isCl(str, 9, 29), "10.05");
  not.ok(isCl(str, 9, 33), "10.06");

  // alt opening at 19
  not.ok(isCl(str, 19, 9), "10.07");
  not.ok(isCl(str, 19, 13), "10.08");
  not.ok(isCl(str, 19, 19), "10.09");
  ok(isCl(str, 19, 21), "10.02"); // <--
  not.ok(isCl(str, 19, 29), "10.11");
  not.ok(isCl(str, 19, 33), "10.12");

  // class opening at 29
  not.ok(isCl(str, 29, 9), "10.13");
  not.ok(isCl(str, 29, 13), "10.14");
  not.ok(isCl(str, 29, 19), "10.15");
  not.ok(isCl(str, 29, 21), "10.16");
  not.ok(isCl(str, 29, 29), "10.17");
  ok(isCl(str, 29, 33), "10.03"); // <--

  // fin.
});

test(`11 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<img src="xyz" alt='=" class='klm'/>`;

  // src opening at 9
  not.ok(isCl(str, 9, 9), "11.01");
  ok(isCl(str, 9, 13), "11.01"); // <--
  not.ok(isCl(str, 9, 19), "11.03");
  not.ok(isCl(str, 9, 21), "11.04");
  not.ok(isCl(str, 9, 29), "11.05");
  not.ok(isCl(str, 9, 33), "11.06");

  // alt opening at 19
  not.ok(isCl(str, 19, 9), "11.07");
  not.ok(isCl(str, 19, 13), "11.08");
  not.ok(isCl(str, 19, 19), "11.09");
  ok(isCl(str, 19, 21), "11.02"); // <--
  not.ok(isCl(str, 19, 29), "11.11");
  not.ok(isCl(str, 19, 33), "11.12");

  // class opening at 29
  not.ok(isCl(str, 29, 9), "11.13");
  not.ok(isCl(str, 29, 13), "11.14");
  not.ok(isCl(str, 29, 19), "11.15");
  not.ok(isCl(str, 29, 21), "11.16");
  not.ok(isCl(str, 29, 29), "11.17");
  ok(isCl(str, 29, 33), "11.03"); // <--

  // fin.
});

test(`12 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - repeated and dodgy`, () => {
  ok(isCl(`<a class="" class= class"">`, 9, 10), "12.01");
});

test(`13 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - repeated and dodgy`, () => {
  not.ok(isCl(`<a class="" class= class"">`, 9, 24), "13.01");
});

test(`14 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - repeated and dodgy`, () => {
  not.ok(isCl(`<a class="" class= class"">`, 9, 25), "14.01");
});

test(`15 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - repeated and dodgy`, () => {
  ok(isCl(`<a class="" class= class"">`, 24, 25), "15.01");
});

test.run();
