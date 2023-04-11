// rule: bad-character-invisible-times
// https://www.fileformat.info/info/unicode/char/2062/index.htm
// -----------------------------------------------------------------------------

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// -----------------------------------------------------------------------------

// 1. basic tests
test("01 - detects two INVISIBLE TIMES characters", () => {
  let str = "\u2062dlkgjld\u2062j";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "bad-character-invisible-times": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-character-invisible-times",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - INVISIBLE TIMES.",
        fix: {
          ranges: [[0, 1]],
        },
      },
      {
        ruleId: "bad-character-invisible-times",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - INVISIBLE TIMES.",
        fix: {
          ranges: [[8, 9]],
        },
      },
    ],
    "01.01"
  );
  equal(applyFixes(str, messages), "dlkgjldj", "01.01");
});

test.run();
