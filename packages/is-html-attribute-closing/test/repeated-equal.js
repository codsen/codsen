import tap from "tap";
import { isAttrClosing as is } from "../dist/is-html-attribute-closing.esm";
// const BACKSLASH = "\u005C";

// repeated equals
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `01 - ${`\u001b[${90}m${`repeated equal`}\u001b[${39}m`} - one tag, one attr`,
  (t) => {
    const str = `<a b=="c" d=='e'>`;

    // b opening at 6
    t.false(is(str, 6, 6), "01.01");
    t.true(is(str, 6, 8), "01.02"); // <--
    t.false(is(str, 6, 13), "01.03");
    t.false(is(str, 6, 15), "01.04");

    // d opening at 13
    t.false(is(str, 13, 6), "01.05");
    t.false(is(str, 13, 8), "01.06");
    t.false(is(str, 13, 13), "01.07");
    t.true(is(str, 13, 15), "01.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${90}m${`repeated equal`}\u001b[${39}m`} - one tag, one attr, three equals`,
  (t) => {
    const str = `<a b==="c" d==='e'>`;

    // b opening at 7
    t.false(is(str, 7, 7), "02.01");
    t.true(is(str, 7, 9), "02.02"); // <--
    t.false(is(str, 7, 15), "02.03");
    t.false(is(str, 7, 17), "02.04");

    // d opening at 15
    t.false(is(str, 15, 7), "02.05");
    t.false(is(str, 15, 9), "02.06");
    t.false(is(str, 15, 15), "02.07");
    t.true(is(str, 15, 17), "02.08"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${90}m${`repeated equal`}\u001b[${39}m`} - one tag, one attr, three spaced equals`,
  (t) => {
    const str = `<a b = = = "c" d = = = 'e'>`;

    // b opening at 11
    t.false(is(str, 11, 11), "03.01");
    t.true(is(str, 11, 13), "03.02"); // <--
    t.false(is(str, 11, 23), "03.03");
    t.false(is(str, 11, 25), "03.04");

    // d opening at 23
    t.false(is(str, 23, 11), "03.05");
    t.false(is(str, 23, 13), "03.06");
    t.false(is(str, 23, 23), "03.07");
    t.true(is(str, 23, 25), "03.08"); // <--

    // fin.
    t.end();
  }
);
