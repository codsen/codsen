// rule: bad-character-start-of-string
// https://www.fileformat.info/info/unicode/char/0098/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01 - detects two START OF STRING characters`, (t) => {
  const str = "\u0098dlkgjld\u0098j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-start-of-string": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "bad-character-start-of-string",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - START OF STRING.",
        fix: {
          ranges: [[0, 1]],
        },
      },
      {
        ruleId: "bad-character-start-of-string",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - START OF STRING.",
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
