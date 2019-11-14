// avanotonly

// rule: bad-character-right-to-left-isolate
// https://www.fileformat.info/info/unicode/char/2067/index.htm
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
test(`01.01 - detects two RIGHT-TO-LEFT ISOLATE characters`, t => {
  const str = "\u2067dlkgjld\u2067j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-right-to-left-isolate": 2
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "bad-character-right-to-left-isolate",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - RIGHT-TO-LEFT ISOLATE.",
        fix: {
          ranges: [[0, 1]]
        }
      },
      {
        ruleId: "bad-character-right-to-left-isolate",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - RIGHT-TO-LEFT ISOLATE.",
        fix: {
          ranges: [[8, 9]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "dlkgjldj");
});
