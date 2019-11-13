// avanotonly

// rule: bad-character-thin-space
// https://www.fileformat.info/info/unicode/char/2009/index.htm
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
test(`01.01 - detects two THIN SPACE characters`, t => {
  const str = "\u2009dlkgjld\u2009j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-thin-space": 2
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "bad-character-thin-space",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - THIN SPACE.",
        fix: {
          ranges: [[0, 1, " "]]
        }
      },
      {
        ruleId: "bad-character-thin-space",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - THIN SPACE.",
        fix: {
          ranges: [[8, 9, " "]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), " dlkgjld j");
});
