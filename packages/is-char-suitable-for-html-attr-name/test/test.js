import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, ok, throws, type, not, match } from "uvu/assert";

import { isAttrNameChar as is } from "../dist/is-char-suitable-for-html-attr-name.esm.js";

const BACKSLASH = "\u005C";

// 00. Weird cases
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - no input`, () => {
  equal(is(), false, "01");
});

test(`02 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - input is not a string`, () => {
  equal(is(2), false, "02");
});

test(`03 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - empty string`, () => {
  equal(is(""), false, "03");
});

test(`04 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - more than 1 long - first char is picked`, () => {
  equal(is("aa"), true, "04");
});

test(`05 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - more than 1 long - first char is picked`, () => {
  equal(is(" a"), false, "05");
});

// 01. B.A.U.
// -----------------------------------------------------------------------------

test(`06 - true`, () => {
  equal(is("a"), true, "06.01");
  equal(is("A"), true, "06.02");
  equal(is("1"), true, "06.03");
  equal(is("-"), true, "06.04");
  equal(is(":"), true, "06.05");
});

test(`07 - false`, () => {
  equal(is("_"), false, "07.01");
  equal(is("!"), false, "07.02");
  equal(is("@"), false, "07.03");
  equal(is("£"), false, "07.04");
  equal(is("$"), false, "07.05");
  equal(is("%"), false, "07.06");
  equal(is("^"), false, "07.07");
  equal(is("&"), false, "07.08");
  equal(is("*"), false, "07.09");
  equal(is("("), false, "07.10");
  equal(is(")"), false, "07.11");
  equal(is("["), false, "07.12");
  equal(is("]"), false, "07.13");
  equal(is(`'`), false, "07.14");
  equal(is(`"`), false, "07.15");
  equal(is("`"), false, "07.16");
  equal(is(" "), false, "07.17");
  equal(is("/"), false, "07.18");
  equal(is(BACKSLASH), false, "07.19");
  equal(is("\t"), false, "07.20");
  equal(is("\n"), false, "07.21");
  equal(is("\r"), false, "07.22");
});

test.run();
