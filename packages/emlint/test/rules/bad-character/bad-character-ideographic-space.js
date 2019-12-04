// rule: bad-character-ideographic-space
// https://www.fileformat.info/info/unicode/char/3000/index.htm
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// -----------------------------------------------------------------------------

// 1. basic tests
t.test(`01.01 - detects two IDEOGRAPHIC SPACE characters`, t => {
  const str = "\u3000dlkgjld\u3000j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-ideographic-space": 2
    }
  });
  t.match(messages, [
    {
      ruleId: "bad-character-ideographic-space",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - IDEOGRAPHIC SPACE.",
      fix: {
        ranges: [[0, 1, " "]]
      }
    },
    {
      ruleId: "bad-character-ideographic-space",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - IDEOGRAPHIC SPACE.",
      fix: {
        ranges: [[8, 9, " "]]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), " dlkgjld j");
  t.end();
});
