// rule: bad-character-four-per-em-space
// https://www.fileformat.info/info/unicode/char/2005/index.htm
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// -----------------------------------------------------------------------------

// 1. basic tests
t.test(`01.01 - detects two FOUR-PER-EM SPACE characters`, (t) => {
  const str = "\u2005dlkgjld\u2005j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-four-per-em-space": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-four-per-em-space",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - FOUR-PER-EM SPACE.",
      fix: {
        ranges: [[0, 1, " "]],
      },
    },
    {
      ruleId: "bad-character-four-per-em-space",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - FOUR-PER-EM SPACE.",
      fix: {
        ranges: [[8, 9, " "]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), " dlkgjld j");
  t.end();
});
