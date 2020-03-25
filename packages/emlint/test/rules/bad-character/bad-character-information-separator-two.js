// rule: bad-character-information-separator-two
// https://www.fileformat.info/info/unicode/char/001e/index.htm
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// -----------------------------------------------------------------------------

// 1. basic tests
t.test(`01.01 - detects two INFORMATION SEPARATOR TWO characters`, (t) => {
  const str = "\u001Edlkgjld\u001Ej";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-information-separator-two": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-information-separator-two",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - INFORMATION SEPARATOR TWO.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-information-separator-two",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - INFORMATION SEPARATOR TWO.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
