const t = require("tap");
const is = require("../dist/is-html-attribute-closing.cjs");
// const BACKSLASH = "\u005C";

// 00. Weird cases
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - no input`,
  (t) => {
    t.false(is(), "00.01");
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - input is not a string`,
  (t) => {
    t.false(is(2), "00.02");
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - input is empty string`,
  (t) => {
    t.false(is(""), "00.03");
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - 2nd arg is missing`,
  (t) => {
    t.false(is("a"), "00.04");
    t.end();
  }
);

t.test(
  `00.05 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - 2nd arg is not integer`,
  (t) => {
    t.false(is("a", "a"), "00.05");
    t.end();
  }
);

t.test(
  `00.06 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - 3rd arg is missing`,
  (t) => {
    t.false(is("a", 0), "00.06");
    t.end();
  }
);

t.test(
  `00.07 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - 3rd arg is not integer`,
  (t) => {
    t.false(is("a", 0, "a"), "00.07");
    t.end();
  }
);

t.test(
  `00.08 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - no character in string at what's given by 2nd arg`,
  (t) => {
    t.false(is("a", 99, 100), "00.08");
    t.end();
  }
);

t.test(
  `00.09 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - no character in string at what's given by 3rd arg`,
  (t) => {
    t.false(is("a", 0, 100), "00.09");
    t.end();
  }
);

t.test(
  `00.10 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - indexes equal`,
  (t) => {
    t.false(is("abcde", 2, 2), "00.10");
    t.end();
  }
);

t.test(
  `00.11 - ${`\u001b[${32}m${`weird cases`}\u001b[${39}m`} - 3rd > 2nd`,
  (t) => {
    t.false(is("abcde", 2, 1), "00.11");
    t.end();
  }
);

// 01. healthy code
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${32}m${`healthy code`}\u001b[${39}m`} - one tag, one attr, double quotes`,
  (t) => {
    const str = `<a href="zzz">`;
    t.true(is(str, 8, 12), "01.01");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${32}m${`healthy code`}\u001b[${39}m`} - one tag, one attr, single quotes`,
  (t) => {
    const str = `<a href='zzz'>`;
    t.true(is(str, 8, 12), "01.02");
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${32}m${`healthy code`}\u001b[${39}m`} - one tag, few attrs`,
  (t) => {
    const str = `<a href="zzz" target="_blank" style="color: black;">`;
    // 1. starting at the opening of "href":
    t.false(is(str, 8, 8), "01.03.01");
    t.true(is(str, 8, 12), "01.03.02");
    t.false(is(str, 8, 21), "01.03.03");
    t.false(is(str, 8, 28), "01.03.04");
    t.false(is(str, 8, 36), "01.03.05");
    t.false(is(str, 8, 50), "01.03.06");

    // 2. starting at the opening of "target":
    t.false(is(str, 21, 8), "01.03.07");
    t.false(is(str, 21, 12), "01.03.08");
    t.false(is(str, 21, 21), "01.03.09");
    t.true(is(str, 21, 28), "01.03.10");
    t.false(is(str, 21, 36), "01.03.11");
    t.false(is(str, 21, 50), "01.03.12");

    // 3. starting at the opening of "style":
    t.false(is(str, 36, 8), "01.03.13");
    t.false(is(str, 36, 12), "01.03.14");
    t.false(is(str, 36, 21), "01.03.15");
    t.false(is(str, 36, 28), "01.03.16");
    t.false(is(str, 36, 36), "01.03.17");
    t.true(is(str, 36, 50), "01.03.18");

    // fin.
    t.end();
  }
);
