// rule: bad-character-enquiry
// https://www.fileformat.info/info/unicode/char/0005/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01.01 - detects two ENQUIRY characters`, (t) => {
  const str = "\u0005dlkgjld\u0005j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-enquiry": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-enquiry",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - ENQUIRY.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-enquiry",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - ENQUIRY.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
