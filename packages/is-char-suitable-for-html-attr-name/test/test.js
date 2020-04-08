const t = require("tap");
const is = require("../dist/is-char-suitable-for-html-attr-name.cjs");
const BACKSLASH = "\u005C";

// 00. Weird cases
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - no input`,
  (t) => {
    t.false(is(), "00.01");
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - input is not a string`,
  (t) => {
    t.false(is(2), "00.02");
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - empty string`,
  (t) => {
    t.false(is(""), "00.03");
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - more than 1 long - first char is picked`,
  (t) => {
    t.true(is("aa"), "00.04");
    t.end();
  }
);

t.test(
  `00.05 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - more than 1 long - first char is picked`,
  (t) => {
    t.false(is(" a"), "00.05");
    t.end();
  }
);

// 01. B.A.U.
// -----------------------------------------------------------------------------

t.test(`01.01 - true`, (t) => {
  t.true(is("a"), "01.01.01");
  t.true(is("A"), "01.01.02");
  t.true(is("1"), "01.01.03");
  t.true(is("-"), "01.01.04");
  t.true(is(":"), "01.01.05");
  t.end();
});

t.test(`01.02 - false`, (t) => {
  t.false(is("_"), "01.02.01");
  t.false(is("!"), "01.02.02");
  t.false(is("@"), "01.02.03");
  t.false(is("£"), "01.02.04");
  t.false(is("$"), "01.02.05");
  t.false(is("%"), "01.02.06");
  t.false(is("^"), "01.02.07");
  t.false(is("&"), "01.02.08");
  t.false(is("*"), "01.02.09");
  t.false(is("("), "01.02.10");
  t.false(is(")"), "01.02.11");
  t.false(is("["), "01.02.12");
  t.false(is("]"), "01.02.13");
  t.false(is(`'`), "01.02.14");
  t.false(is(`"`), "01.02.15");
  t.false(is("`"), "01.02.16");
  t.false(is(" "), "01.02.17");
  t.false(is("/"), "01.02.18");
  t.false(is(BACKSLASH), "01.02.19");
  t.false(is("\t"), "01.02.20");
  t.false(is("\n"), "01.02.21");
  t.false(is("\r"), "01.02.22");
  t.end();
});
