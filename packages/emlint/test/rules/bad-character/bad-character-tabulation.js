// rule: bad-character-tabulation
// catches TAB character:
// https://www.fileformat.info/info/unicode/char/0009/index.htm
// -----------------------------------------------------------------------------

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 1. no config
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off, integer`, () => {
  let str = "\tdlkgjld\tj";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": 0, // means every TAB will be flagged up
    },
  });
  equal(messages, [], "01.01");
  equal(applyFixes(str, messages), str, "01.02");
});

test(`02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off, array, no config`, () => {
  let str = "\tdlkgjld\tj";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": [0], // means every TAB will be flagged up
    },
  });
  equal(messages, [], "02.01");
  equal(applyFixes(str, messages), str, "02.02");
});

test(`03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warning, detects two TABULATION characters`, () => {
  let str = "\tdlkgjld\tj";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": 1, // means every TAB will be flagged up
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-character-tabulation",
        severity: 1,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - TABULATION.",
        fix: {
          ranges: [[0, 1, " "]],
        },
      },
      {
        ruleId: "bad-character-tabulation",
        severity: 1,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - TABULATION.",
        fix: {
          ranges: [[8, 9, " "]],
        },
      },
    ],
    "03.01"
  );
  equal(applyFixes(str, messages), " dlkgjld j", "03.01");
});

test(`04 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - error, detects two TABULATION characters`, () => {
  let str = "\tdlkgjld\tj";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": 2, // means every TAB will be flagged up
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-character-tabulation",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - TABULATION.",
        fix: {
          ranges: [[0, 1, " "]],
        },
      },
      {
        ruleId: "bad-character-tabulation",
        severity: 2,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - TABULATION.",
        fix: {
          ranges: [[8, 9, " "]],
        },
      },
    ],
    "04.01"
  );
  equal(applyFixes(str, messages), " dlkgjld j", "04.01");
});

// 02. with config
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - config with hardcoded defaults`, () => {
  let str = "\tdlkgjld\tj";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": [1, "never"], // means every TAB will be flagged up
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-character-tabulation",
        severity: 1,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        column: 1, // remember columns numbers start from 1, not zero
        message: "Bad character - TABULATION.",
        fix: {
          ranges: [[0, 1, " "]],
        },
      },
      {
        ruleId: "bad-character-tabulation",
        severity: 1,
        idxFrom: 8,
        idxTo: 9,
        line: 1,
        column: 9, // remember columns numbers start from 1, not zero
        message: "Bad character - TABULATION.",
        fix: {
          ranges: [[8, 9, " "]],
        },
      },
    ],
    "05.01"
  );
  equal(applyFixes(str, messages), " dlkgjld j", "05.01");
});

test(`06 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - indentation tab is now deemed to be fine`, () => {
  let str = "\t\t\tdlkgjld\tj";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": [2, "indentationIsFine"], // btw, setting is not case sensitive
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-character-tabulation",
        severity: 2,
        idxFrom: 10,
        idxTo: 11,
        message: "Bad character - TABULATION.",
        fix: {
          ranges: [[10, 11, " "]],
        },
      },
    ],
    "06.01"
  );
  equal(applyFixes(str, messages), "\t\t\tdlkgjld j", "06.01");
});

test.run();
