// avanotonly

// rule: bad-character-end-of-text
// https://www.fileformat.info/info/unicode/char/0003/index.htm
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
test(`01.01 - detects two END OF TEXT characters`, t => {
  const str = "\u0003dlkgjld\u0003j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-end-of-text": 2
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "bad-character-end-of-text",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - END OF TEXT.",
        fix: {
          ranges: [[0, 1, "\n"]]
        }
      },
      {
        ruleId: "bad-character-end-of-text",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - END OF TEXT.",
        fix: {
          ranges: [[8, 9, "\n"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "\ndlkgjld\nj");
});
