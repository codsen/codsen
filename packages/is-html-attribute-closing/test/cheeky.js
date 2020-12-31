import tap from "tap";
import { isAttrClosing as is } from "../dist/is-html-attribute-closing.esm";
// const BACKSLASH = "\u005C";

// cheeky cases
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `01 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="="/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "01.01");
    t.true(is(str, 9, 13), "01.02"); // <--
    t.false(is(str, 9, 19), "01.03");
    t.false(is(str, 9, 21), "01.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "01.05");
    t.false(is(str, 19, 13), "01.06");
    t.false(is(str, 19, 19), "01.07");
    t.true(is(str, 19, 21), "01.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='='/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "02.01");
    t.true(is(str, 9, 13), "02.02"); // <--
    t.false(is(str, 9, 19), "02.03");
    t.false(is(str, 9, 21), "02.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "02.05");
    t.false(is(str, 19, 13), "02.06");
    t.false(is(str, 19, 19), "02.07");
    t.true(is(str, 19, 21), "02.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="='/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "03.01");
    t.true(is(str, 9, 13), "03.02"); // <--
    t.false(is(str, 9, 19), "03.03");
    t.false(is(str, 9, 21), "03.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "03.05");
    t.false(is(str, 19, 13), "03.06");
    t.false(is(str, 19, 19), "03.07");
    t.true(is(str, 19, 21), "03.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='="/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "04.01");
    t.true(is(str, 9, 13), "04.02"); // <--
    t.false(is(str, 9, 19), "04.03");
    t.false(is(str, 9, 21), "04.04");

    // alt opening at 19
    t.false(is(str, 19, 9), "04.05");
    t.false(is(str, 19, 13), "04.06");
    t.false(is(str, 19, 19), "04.07");
    t.true(is(str, 19, 21), "04.08"); // <--

    // fin.
    t.end();
  }
);

//
//                               three attributes
//

tap.test(
  `05 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt="=" class="klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "05.01");
    t.true(is(str, 9, 13), "05.02"); // <--
    t.false(is(str, 9, 19), "05.03");
    t.false(is(str, 9, 21), "05.04");
    t.false(is(str, 9, 29), "05.05");
    t.false(is(str, 9, 33), "05.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "05.07");
    t.false(is(str, 19, 13), "05.08");
    t.false(is(str, 19, 19), "05.09");
    t.true(is(str, 19, 21), "05.10"); // <--
    t.false(is(str, 19, 29), "05.11");
    t.false(is(str, 19, 33), "05.12");

    // class opening at 29
    t.false(is(str, 29, 9), "05.13");
    t.false(is(str, 29, 13), "05.14");
    t.false(is(str, 29, 19), "05.15");
    t.false(is(str, 29, 21), "05.16");
    t.false(is(str, 29, 29), "05.17");
    t.true(is(str, 29, 33), "05.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=' class="klm'/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "06.01");
    t.true(is(str, 9, 13), "06.02"); // <--
    t.false(is(str, 9, 19), "06.03");
    t.false(is(str, 9, 21), "06.04");
    t.false(is(str, 9, 29), "06.05");
    t.false(is(str, 9, 33), "06.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "06.07");
    t.false(is(str, 19, 13), "06.08");
    t.false(is(str, 19, 19), "06.09");
    t.true(is(str, 19, 21), "06.10"); // <--
    t.false(is(str, 19, 29), "06.11");
    t.false(is(str, 19, 33), "06.12");

    // class opening at 29
    t.false(is(str, 29, 9), "06.13");
    t.false(is(str, 29, 13), "06.14");
    t.false(is(str, 29, 19), "06.15");
    t.false(is(str, 29, 21), "06.16");
    t.false(is(str, 29, 29), "06.17");
    t.true(is(str, 29, 33), "06.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=' class='klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "07.01");
    t.true(is(str, 9, 13), "07.02"); // <--
    t.false(is(str, 9, 19), "07.03");
    t.false(is(str, 9, 21), "07.04");
    t.false(is(str, 9, 29), "07.05");
    t.false(is(str, 9, 33), "07.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "07.07");
    t.false(is(str, 19, 13), "07.08");
    t.false(is(str, 19, 19), "07.09");
    t.true(is(str, 19, 21), "07.10"); // <--
    t.false(is(str, 19, 29), "07.11");
    t.false(is(str, 19, 33), "07.12");

    // class opening at 29
    t.false(is(str, 29, 9), "07.13");
    t.false(is(str, 29, 13), "07.14");
    t.false(is(str, 29, 19), "07.15");
    t.false(is(str, 29, 21), "07.16");
    t.false(is(str, 29, 29), "07.17");
    t.true(is(str, 29, 33), "07.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class="klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "08.01");
    t.true(is(str, 9, 13), "08.02"); // <--
    t.false(is(str, 9, 19), "08.03");
    t.false(is(str, 9, 21), "08.04");
    t.false(is(str, 9, 29), "08.05");
    t.false(is(str, 9, 33), "08.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "08.07");
    t.false(is(str, 19, 13), "08.08");
    t.false(is(str, 19, 19), "08.09");
    t.true(is(str, 19, 21), "08.10"); // <--
    t.false(is(str, 19, 29), "08.11");
    t.false(is(str, 19, 33), "08.12");

    // class opening at 29
    t.false(is(str, 29, 9), "08.13");
    t.false(is(str, 29, 13), "08.14");
    t.false(is(str, 29, 19), "08.15");
    t.false(is(str, 29, 21), "08.16");
    t.false(is(str, 29, 29), "08.17");
    t.true(is(str, 29, 33), "08.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class="klm'/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "09.01");
    t.true(is(str, 9, 13), "09.02"); // <--
    t.false(is(str, 9, 19), "09.03");
    t.false(is(str, 9, 21), "09.04");
    t.false(is(str, 9, 29), "09.05");
    t.false(is(str, 9, 33), "09.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "09.07");
    t.false(is(str, 19, 13), "09.08");
    t.false(is(str, 19, 19), "09.09");
    t.true(is(str, 19, 21), "09.10"); // <--
    t.false(is(str, 19, 29), "09.11");
    t.false(is(str, 19, 33), "09.12");

    // class opening at 29
    t.false(is(str, 29, 9), "09.13");
    t.false(is(str, 29, 13), "09.14");
    t.false(is(str, 29, 19), "09.15");
    t.false(is(str, 29, 21), "09.16");
    t.false(is(str, 29, 29), "09.17");
    t.true(is(str, 29, 33), "09.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class='klm"/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "10.01");
    t.true(is(str, 9, 13), "10.02"); // <--
    t.false(is(str, 9, 19), "10.03");
    t.false(is(str, 9, 21), "10.04");
    t.false(is(str, 9, 29), "10.05");
    t.false(is(str, 9, 33), "10.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "10.07");
    t.false(is(str, 19, 13), "10.08");
    t.false(is(str, 19, 19), "10.09");
    t.true(is(str, 19, 21), "10.10"); // <--
    t.false(is(str, 19, 29), "10.11");
    t.false(is(str, 19, 33), "10.12");

    // class opening at 29
    t.false(is(str, 29, 9), "10.13");
    t.false(is(str, 29, 13), "10.14");
    t.false(is(str, 29, 19), "10.15");
    t.false(is(str, 29, 21), "10.16");
    t.false(is(str, 29, 29), "10.17");
    t.true(is(str, 29, 33), "10.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - the last character in the attr value is "equal", \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<img src="xyz" alt='=" class='klm'/>`;

    // src opening at 9
    t.false(is(str, 9, 9), "11.01");
    t.true(is(str, 9, 13), "11.02"); // <--
    t.false(is(str, 9, 19), "11.03");
    t.false(is(str, 9, 21), "11.04");
    t.false(is(str, 9, 29), "11.05");
    t.false(is(str, 9, 33), "11.06");

    // alt opening at 19
    t.false(is(str, 19, 9), "11.07");
    t.false(is(str, 19, 13), "11.08");
    t.false(is(str, 19, 19), "11.09");
    t.true(is(str, 19, 21), "11.10"); // <--
    t.false(is(str, 19, 29), "11.11");
    t.false(is(str, 19, 33), "11.12");

    // class opening at 29
    t.false(is(str, 29, 9), "11.13");
    t.false(is(str, 29, 13), "11.14");
    t.false(is(str, 29, 19), "11.15");
    t.false(is(str, 29, 21), "11.16");
    t.false(is(str, 29, 29), "11.17");
    t.true(is(str, 29, 33), "11.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - repeated and dodgy`,
  (t) => {
    t.true(is(`<a class="" class= class"">`, 9, 10), "12");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - repeated and dodgy`,
  (t) => {
    t.false(is(`<a class="" class= class"">`, 9, 24), "13");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - repeated and dodgy`,
  (t) => {
    t.false(is(`<a class="" class= class"">`, 9, 25), "14");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`cheeky cases`}\u001b[${39}m`} - repeated and dodgy`,
  (t) => {
    t.true(is(`<a class="" class= class"">`, 24, 25), "15");
    t.end();
  }
);
