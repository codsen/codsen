// rule: bad-character-private-use-1
// https://www.fileformat.info/info/unicode/char/0091/index.htm
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
test("01 - detects two PRIVATE USE ONE characters", () => {
  let str = "\u0091dlkgjld\u0091j";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "bad-character-private-use-1": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-character-private-use-1",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - PRIVATE USE ONE.",
        fix: {
          ranges: [[0, 1]],
        },
      },
      {
        ruleId: "bad-character-private-use-1",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - PRIVATE USE ONE.",
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
