// rule: bad-character-control-0080
// https://www.fileformat.info/info/unicode/char/0080/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
tap.test(`01.01 - detects two CONTROL characters`, (t) => {
  const str = "\u0080dlkgjld\u0080j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-control-0080": 2,
    },
  });
  t.match(messages, [
    {
      ruleId: "bad-character-control-0080",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      column: 1, // remember columns numbers start from 1, not zero
      message: "Bad character - CONTROL.",
      fix: {
        ranges: [[0, 1]],
      },
    },
    {
      ruleId: "bad-character-control-0080",
      severity: 2,
      idxFrom: 8,
      idxTo: 9,
      line: 1,
      column: 9, // remember columns numbers start from 1, not zero
      message: "Bad character - CONTROL.",
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
  t.equal(applyFixes(str, messages), "dlkgjldj");
  t.end();
});
