// rule: bad-character-paragraph-separator
// https://www.fileformat.info/info/unicode/char/2029/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01.01 - detects two PARAGRAPH SEPARATOR characters`, (t) => {
  const str = "\u2029dlkgjld\u2029j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-paragraph-separator": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-paragraph-separator",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - PARAGRAPH SEPARATOR.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-paragraph-separator",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - PARAGRAPH SEPARATOR.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
