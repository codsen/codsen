// rule: bad-character-activate-symmetric-swapping
// https://www.fileformat.info/info/unicode/char/206b/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01 - detects two INHIBIT SYMMETRIC SWAPPING characters`, (t) => {
  const str = "\u206Bdlkgjld\u206Bj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-activate-symmetric-swapping": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "bad-character-activate-symmetric-swapping",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - INHIBIT SYMMETRIC SWAPPING.",
        fix: {
          ranges: [[0, 1]],
        },
      },
      {
        ruleId: "bad-character-activate-symmetric-swapping",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - INHIBIT SYMMETRIC SWAPPING.",
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
