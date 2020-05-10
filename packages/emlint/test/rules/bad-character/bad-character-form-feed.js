// rule: bad-character-form-feed
// https://www.fileformat.info/info/unicode/char/000c/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01 - detects two FORM FEED characters`, (t) => {
  const str = "\u000Cdlkgjld\u000Cj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-form-feed": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "bad-character-form-feed",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - FORM FEED.",
        fix: {
          ranges: [[0, 1]],
        },
      },
      {
        ruleId: "bad-character-form-feed",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - FORM FEED.",
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
