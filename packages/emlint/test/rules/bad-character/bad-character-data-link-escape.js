// rule: bad-character-data-link-escape
// https://www.fileformat.info/info/unicode/char/0010/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01.01 - detects two DATA LINK ESCAPE characters`, (t) => {
  const str = "\u0010dlkgjld\u0010j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-data-link-escape": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-data-link-escape",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - DATA LINK ESCAPE.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-data-link-escape",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - DATA LINK ESCAPE.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
