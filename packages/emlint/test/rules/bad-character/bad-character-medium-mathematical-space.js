// rule: bad-character-medium-mathematical-space
// https://www.fileformat.info/info/unicode/char/205f/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01.01 - detects two MEDIUM MATHEMATICAL SPACE characters`, (t) => {
  const str = "\u205Fdlkgjld\u205Fj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-medium-mathematical-space": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-medium-mathematical-space",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - MEDIUM MATHEMATICAL SPACE.",
      fix: {
        ranges: [[0, 1, " "]],
      },
    },
    {
      ruleId: "bad-character-medium-mathematical-space",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - MEDIUM MATHEMATICAL SPACE.",
      fix: {
        ranges: [[8, 9, " "]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), " dlkgjld j");
  t.end();
});
