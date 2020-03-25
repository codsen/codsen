// rule: bad-character-right-to-left-embedding
// https://www.fileformat.info/info/unicode/char/202b/index.htm
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// -----------------------------------------------------------------------------

// 1. basic tests
t.test(`01.01 - detects two RIGHT-TO-LEFT EMBEDDING characters`, (t) => {
  const str = "\u202Bdlkgjld\u202Bj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-right-to-left-embedding": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-right-to-left-embedding",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - RIGHT-TO-LEFT EMBEDDING.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-right-to-left-embedding",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - RIGHT-TO-LEFT EMBEDDING.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
