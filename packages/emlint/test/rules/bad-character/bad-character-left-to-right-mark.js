// rule: bad-character-left-to-right-mark
// https://www.fileformat.info/info/unicode/char/200e/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01 - detects two LEFT-TO-RIGHT MARK characters`, (t) => {
  const str = "\u200Edlkgjld\u200Ej";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-left-to-right-mark": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "bad-character-left-to-right-mark",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - LEFT-TO-RIGHT MARK.",
        fix: {
          ranges: [[0, 1]],
        },
      },
      {
        ruleId: "bad-character-left-to-right-mark",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - LEFT-TO-RIGHT MARK.",
        fix: {
          ranges: [[8, 9]],
        },
      },
    ],
    "01.01"
  );
  t.equal(applyFixes(str, messages), "dlkgjldj", "01.02");
  t.end();
});
