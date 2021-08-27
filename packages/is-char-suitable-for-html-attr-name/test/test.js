import tap from "tap";
import { isAttrNameChar as is } from "../dist/is-char-suitable-for-html-attr-name.esm.js";

const BACKSLASH = "\u005C";

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
  `03 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - empty string`,
  (t) => {
    t.false(is(""), "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - more than 1 long - first char is picked`,
  (t) => {
    t.true(is("aa"), "04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - more than 1 long - first char is picked`,
  (t) => {
    t.false(is(" a"), "05");
    t.end();
  }
);

// 01. B.A.U.
// -----------------------------------------------------------------------------

tap.test(`06 - true`, (t) => {
  t.true(is("a"), "06.01");
  t.true(is("A"), "06.02");
  t.true(is("1"), "06.03");
  t.true(is("-"), "06.04");
  t.true(is(":"), "06.05");
  t.end();
});

tap.test(`07 - false`, (t) => {
  t.false(is("_"), "07.01");
  t.false(is("!"), "07.02");
  t.false(is("@"), "07.03");
  t.false(is("£"), "07.04");
  t.false(is("$"), "07.05");
  t.false(is("%"), "07.06");
  t.false(is("^"), "07.07");
  t.false(is("&"), "07.08");
  t.false(is("*"), "07.09");
  t.false(is("("), "07.10");
  t.false(is(")"), "07.11");
  t.false(is("["), "07.12");
  t.false(is("]"), "07.13");
  t.false(is(`'`), "07.14");
  t.false(is(`"`), "07.15");
  t.false(is("`"), "07.16");
  t.false(is(" "), "07.17");
  t.false(is("/"), "07.18");
  t.false(is(BACKSLASH), "07.19");
  t.false(is("\t"), "07.20");
  t.false(is("\n"), "07.21");
  t.false(is("\r"), "07.22");
  t.end();
});
