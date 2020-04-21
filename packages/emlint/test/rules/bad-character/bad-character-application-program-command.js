// rule: bad-character-application-program-command
// https://www.fileformat.info/info/unicode/char/009f/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01.01 - detects two APPLICATION PROGRAM COMMAND characters`, (t) => {
  const str = "\u009Fdlkgjld\u009Fj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-application-program-command": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-application-program-command",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - APPLICATION PROGRAM COMMAND.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-application-program-command",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - APPLICATION PROGRAM COMMAND.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
