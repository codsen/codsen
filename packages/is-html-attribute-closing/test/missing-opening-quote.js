import tap from "tap";
import is from "../dist/is-html-attribute-closing.esm";
// const BACKSLASH = "\u005C";

// attribute starts without a quote
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `01 - ${`\u001b[${35}m${`opening missing`}\u001b[${39}m`} - one tag pair, one attr`,
  (t) => {
    const str = `<a href=z">click here</a>`;

    t.true(is(str, 8, 9), "01");

    // fin.
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${`opening missing`}\u001b[${39}m`} - one tag pair, another attr follows`,
  (t) => {
    // D-D follows
    const str1 = `<a href=z" class="yo">click here</a>`;

    t.true(is(str1, 8, 9), "02.01");
    t.false(is(str1, 8, 17), "02.02");
    t.false(is(str1, 8, 20), "02.03");

    // D-S follows
    const str2 = `<a href=z" class="yo'>click here</a>`;

    t.true(is(str2, 8, 9), "02.04");
    t.false(is(str2, 8, 17), "02.05");
    t.false(is(str2, 8, 20), "02.06");

    //          off-tangent a little bit...
    const str21 = `<a href=z" class="yo' id='ey">click here</a>`;

    t.true(is(str21, 8, 9), "02.07");
    t.false(is(str21, 8, 17), "02.08");
    t.false(is(str21, 8, 20), "02.09");
    t.false(is(str21, 8, 25), "02.10");
    t.false(is(str21, 8, 28), "02.11");

    const str22 = `<a href=z" class="yo' id='ey>click here</a>`;

    t.true(is(str22, 8, 9), "02.12");
    t.false(is(str22, 8, 17), "02.13");
    t.false(is(str22, 8, 20), "02.14");
    t.false(is(str22, 8, 25), "02.15");

    // S-D follows
    const str3 = `<a href=z" class='yo">click here</a>`;

    t.true(is(str3, 8, 9), "02.16");
    t.false(is(str3, 8, 17), "02.17");
    t.false(is(str3, 8, 20), "02.18");

    const str31 = `<a href=z" class='yo" id="ey'>click here</a>`;

    t.true(is(str31, 8, 9), "02.19");
    t.false(is(str31, 8, 17), "02.20");
    t.false(is(str31, 8, 20), "02.21");
    t.false(is(str31, 8, 25), "02.22");
    t.false(is(str31, 8, 28), "02.23");

    // S-S follows
    const str4 = `<a href=z" class='yo'>click here</a>`;

    t.true(is(str4, 8, 9), "02.24");
    t.false(is(str4, 8, 17), "02.25");
    t.false(is(str4, 8, 20), "02.26");

    //                a provocation...
    const str41 = `<a href=z" class='yo' id='ey">click here</a>`;

    t.true(is(str41, 8, 9), "02.27");
    t.false(is(str41, 8, 17), "02.28");
    t.false(is(str41, 8, 20), "02.29");
    t.false(is(str41, 8, 25), "02.30");
    t.false(is(str41, 8, 28), "02.31");

    // fin.
    t.end();
  }
);
