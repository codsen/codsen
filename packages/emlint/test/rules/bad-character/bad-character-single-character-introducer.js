// rule: bad-character-single-character-introducer
// https://www.fileformat.info/info/unicode/char/009a/index.htm
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// -----------------------------------------------------------------------------

// 1. basic tests
t.test(`01.01 - detects two SINGLE CHARACTER INTRODUCER characters`, (t) => {
  const str = "\u009Adlkgjld\u009Aj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-single-character-introducer": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-single-character-introducer",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - SINGLE CHARACTER INTRODUCER.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-single-character-introducer",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - SINGLE CHARACTER INTRODUCER.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
