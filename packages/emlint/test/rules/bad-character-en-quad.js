// avanotonly

// rule: bad-character-en-quad
// https://www.fileformat.info/info/unicode/char/2000/index.htm
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../t-util/util";

// -----------------------------------------------------------------------------

// 1. basic tests
test(`01.01 - detects two EN QUAD characters`, t => {
  const str = "\u2000dlkgjld\u2000j";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-en-quad": 2
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "bad-character-en-quad",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - EN QUAD.",
        fix: {
          ranges: [[0, 1, " "]]
        }
      },
      {
        ruleId: "bad-character-en-quad",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - EN QUAD.",
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
