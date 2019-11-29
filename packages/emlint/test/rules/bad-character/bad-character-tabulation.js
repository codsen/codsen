// avanotonly

// rule: bad-character-tabulation
// catches TAB character:
// https://www.fileformat.info/info/unicode/char/0009/index.htm
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// 1. no config
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off, integer`, t => {
  const str = "\tdlkgjld\tj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": 0 // means every TAB will be flagged up
    }
  });
  t.deepEqual(messages, []);
  t.is(applyFixes(str, messages), str);
});

test(`01.02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off, array, no config`, t => {
  const str = "\tdlkgjld\tj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": [0] // means every TAB will be flagged up
    }
  });
  t.deepEqual(messages, []);
  t.is(applyFixes(str, messages), str);
});

test(`01.03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warning, detects two TABULATION characters`, t => {
  const str = "\tdlkgjld\tj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": 1 // means every TAB will be flagged up
    }
  });
  deepContains(
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
          ranges: [[0, 1, " "]]
        }
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
          ranges: [[8, 9, " "]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), " dlkgjld j");
});

test(`01.04 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - error, detects two TABULATION characters`, t => {
  const str = "\tdlkgjld\tj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": 2 // means every TAB will be flagged up
    }
  });
  deepContains(
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
          ranges: [[0, 1, " "]]
        }
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
          ranges: [[8, 9, " "]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), " dlkgjld j");
});

// 02. with config
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - config with hardcoded defaults`, t => {
  const str = "\tdlkgjld\tj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": [1, "never"] // means every TAB will be flagged up
    }
  });
  deepContains(
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
          ranges: [[0, 1, " "]]
        }
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
          ranges: [[8, 9, " "]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), " dlkgjld j");
});

test(`02.02 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - indentation tab is now deemed to be fine`, t => {
  const str = "\t\t\tdlkgjld\tj";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-character-tabulation": [2, "indentationIsFine"] // btw, setting is not case sensitive
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "bad-character-tabulation",
        severity: 2,
        idxFrom: 10,
        idxTo: 11,
        message: "Bad character - TABULATION.",
        fix: {
          ranges: [[10, 11, " "]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "\t\t\tdlkgjld j");
});
