// avaonly

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// 01. no config
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off`, t => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": 0
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

test(`01.02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warn`, t => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": 1
    }
  });
  t.is(applyFixes(str, messages), "<strong>z</strong>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 1,
        idxFrom: 0,
        idxTo: 6,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[1, 5, "strong"]]
        }
      },
      {
        ruleId: "tag-bold",
        severity: 1,
        idxFrom: 7,
        idxTo: 14,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[9, 13, "strong"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, t => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": 2
    }
  });
  t.is(applyFixes(str, messages), "<strong>z</strong>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[1, 5, "strong"]]
        }
      },
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 7,
        idxTo: 14,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[9, 13, "strong"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// 02. config
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - config is arr`, t => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": [2]
    }
  });
  t.is(applyFixes(str, messages), "<strong>z</strong>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[1, 5, "strong"]]
        }
      },
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 7,
        idxTo: 14,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[9, 13, "strong"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.02 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - strong is suggested`, t => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": [2, "strong"]
    }
  });
  t.is(applyFixes(str, messages), "<strong>z</strong>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[1, 5, "strong"]]
        }
      },
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 7,
        idxTo: 14,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[9, 13, "strong"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.03 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - b is suggested`, t => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": [2, "b"]
    }
  });
  t.is(applyFixes(str, messages), "<b>z</b>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[1, 5, "b"]]
        }
      },
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 7,
        idxTo: 14,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[9, 13, "b"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});
