// rule: bad-character-function-application
// https://www.fileformat.info/info/unicode/char/2061/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01.01 - detects two FUNCTION APPLICATION characters`, (t) => {
  const str = "\u2061dlkgjld\u2061j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-function-application": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-function-application",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - FUNCTION APPLICATION.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-function-application",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - FUNCTION APPLICATION.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
