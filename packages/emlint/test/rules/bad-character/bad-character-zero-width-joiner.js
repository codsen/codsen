// rule: bad-character-zero-width-joiner
// https://www.fileformat.info/info/unicode/char/200d/index.htm
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// -----------------------------------------------------------------------------

// 1. basic tests
t.test(`01.01 - detects two ZERO WIDTH JOINER characters`, (t) => {
  const str = "\u200Ddlkgjld\u200Dj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-zero-width-joiner": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-zero-width-joiner",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - ZERO WIDTH JOINER.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-zero-width-joiner",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - ZERO WIDTH JOINER.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
