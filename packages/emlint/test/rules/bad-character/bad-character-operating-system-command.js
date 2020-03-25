// rule: bad-character-operating-system-command
// https://www.fileformat.info/info/unicode/char/009d/index.htm
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// -----------------------------------------------------------------------------

// 1. basic tests
t.test(`01.01 - detects two OPERATING SYSTEM COMMAND characters`, (t) => {
  const str = "\u009Ddlkgjld\u009Dj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-operating-system-command": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-operating-system-command",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - OPERATING SYSTEM COMMAND.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-operating-system-command",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - OPERATING SYSTEM COMMAND.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
