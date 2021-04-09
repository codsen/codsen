// rule: bad-character-replacement-character
// https://www.fileformat.info/info/unicode/char/fffd/index.htm
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";
const CHAR = `\uFFFD`;

// -----------------------------------------------------------------------------

tap.test(`01 - detects two REPLACEMENT CHARACTERS`, (t) => {
  const str = `${CHAR}dlkgjld${CHAR}j`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-replacement-character": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "bad-character-replacement-character",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - REPLACEMENT CHARACTER.",
        fix: {
          ranges: [[0, 1]],
        },
      },
      {
        ruleId: "bad-character-replacement-character",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - REPLACEMENT CHARACTER.",
        fix: {
          ranges: [[8, 9]],
        },
      },
    ],
    "01.01"
  );
  t.equal(messages.length, 2, "01.02");
  t.equal(applyFixes(str, messages), "dlkgjldj", "01.03");
  t.end();
});
