// avanotonly

// rule: bad-character-medium-mathematical-space
// https://www.fileformat.info/info/unicode/char/205f/index.htm
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
test(`01.01 - detects two MEDIUM MATHEMATICAL SPACE characters`, t => {
  const str = "\u205Fdlkgjld\u205Fj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-medium-mathematical-space": 2
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "bad-character-medium-mathematical-space",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - MEDIUM MATHEMATICAL SPACE.",
        fix: {
          ranges: [[0, 1, " "]]
        }
      },
      {
        ruleId: "bad-character-medium-mathematical-space",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - MEDIUM MATHEMATICAL SPACE.",
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
