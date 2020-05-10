// rule: bad-character-end-of-text
// https://www.fileformat.info/info/unicode/char/0003/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01 - detects two END OF TEXT characters`, (t) => {
  const str = "\u0003dlkgjld\u0003j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-end-of-text": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "bad-character-end-of-text",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - END OF TEXT.",
        fix: {
          ranges: [[0, 1, "\n"]],
        },
      },
      {
        ruleId: "bad-character-end-of-text",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - END OF TEXT.",
        fix: {
          ranges: [[8, 9, "\n"]],
        },
      },
    ],
    "01.01"
  );
  t.equal(applyFixes(str, messages), "\ndlkgjld\nj", "01.02");
  t.end();
});
