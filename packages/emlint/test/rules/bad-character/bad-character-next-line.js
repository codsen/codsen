// rule: bad-character-next-line
// https://www.fileformat.info/info/unicode/char/0085/index.htm
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// -----------------------------------------------------------------------------

// 1. basic tests
t.test(`01.01 - detects two NEXT LINE characters`, (t) => {
  const str = "\u0085dlkgjld\u0085j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-next-line": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-next-line",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - NEXT LINE.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-next-line",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - NEXT LINE.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
