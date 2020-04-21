// rule: bad-character-shift-in
// https://www.fileformat.info/info/unicode/char/000f/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01.01 - detects two SHIFT IN characters`, (t) => {
  const str = "\u000Fdlkgjld\u000Fj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-shift-in": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-shift-in",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - SHIFT IN.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-shift-in",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - SHIFT IN.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
