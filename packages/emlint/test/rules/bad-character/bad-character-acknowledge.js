// rule: bad-character-acknowledge
// https://www.fileformat.info/info/unicode/char/0006/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01.01 - detects two ACKNOWLEDGE characters`, (t) => {
  const str = "\u0006dlkgjld\u0006j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-acknowledge": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-acknowledge",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - ACKNOWLEDGE.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-acknowledge",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - ACKNOWLEDGE.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
