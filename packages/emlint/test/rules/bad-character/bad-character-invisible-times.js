// rule: bad-character-invisible-times
// https://www.fileformat.info/info/unicode/char/2062/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";

import { applyFixes } from "../../../t-util/util.js";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01 - detects two INVISIBLE TIMES characters`, (t) => {
  const str = "\u2062dlkgjld\u2062j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-invisible-times": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "bad-character-invisible-times",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - INVISIBLE TIMES.",
        fix: {
          ranges: [[0, 1]],
        },
      },
      {
        ruleId: "bad-character-invisible-times",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - INVISIBLE TIMES.",
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
