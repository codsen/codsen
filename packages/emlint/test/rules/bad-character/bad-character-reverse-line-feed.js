// rule: bad-character-reverse-line-feed
// https://www.fileformat.info/info/unicode/char/008d/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01.01 - detects two REVERSE LINE FEED characters`, (t) => {
  const str = "\u008Ddlkgjld\u008Dj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-reverse-line-feed": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-reverse-line-feed",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - REVERSE LINE FEED.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-reverse-line-feed",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - REVERSE LINE FEED.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
