// rule: bad-character-start-of-selected-area
// https://www.fileformat.info/info/unicode/char/0086/index.htm
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// -----------------------------------------------------------------------------

// 1. basic tests
t.test(`01.01 - detects two START OF SELECTED AREA characters`, (t) => {
  const str = "\u0086dlkgjld\u0086j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-start-of-selected-area": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-start-of-selected-area",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - START OF SELECTED AREA.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-start-of-selected-area",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - START OF SELECTED AREA.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
