// rule: bad-character-end-of-transmission-block
// https://www.fileformat.info/info/unicode/char/0017/index.htm
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
test(`01 - detects two END OF TRANSMISSION BLOCK characters`, () => {
  let str = "\u0017dlkgjld\u0017j";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "bad-character-end-of-transmission-block": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-character-end-of-transmission-block",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - END OF TRANSMISSION BLOCK.",
        fix: {
          ranges: [[0, 1]],
        },
      },
      {
        ruleId: "bad-character-end-of-transmission-block",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - END OF TRANSMISSION BLOCK.",
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
