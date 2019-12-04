// rule: bad-character-break-permitted-here
// https://www.fileformat.info/info/unicode/char/0082/index.htm
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// -----------------------------------------------------------------------------

// 1. basic tests
t.test(`01.01 - detects two BREAK PERMITTED HERE characters`, t => {
  const str = "\u0082dlkgjld\u0082j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-break-permitted-here": 2
    }
  });
  t.match(messages, [
    {
      ruleId: "bad-character-break-permitted-here",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - BREAK PERMITTED HERE.",
      fix: {
        ranges: [[0, 1]]
      }
    },
    {
      ruleId: "bad-character-break-permitted-here",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - BREAK PERMITTED HERE.",
      fix: {
        ranges: [[8, 9]]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
