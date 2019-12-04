const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");
// const astDeepContains = require("ast-deep-contains");

// 01. no config
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off`, t => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": 0
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

t.test(`01.02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warn`, t => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": 1
    }
  });
  t.equal(applyFixes(str, messages), "<strong>z</strong>");
  t.match(messages, [
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
  ]);
  t.end();
});

t.test(`01.03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, t => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": 2
    }
  });
  t.equal(applyFixes(str, messages), "<strong>z</strong>");
  t.match(messages, [
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
  ]);
  t.end();
});

// 02. config
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - config is arr`,
  t => {
    const str = "<bold>z</bold>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-bold": [2]
      }
    });
    t.equal(applyFixes(str, messages), "<strong>z</strong>");
    t.match(messages, [
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
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - strong is suggested`,
  t => {
    const str = "<bold>z</bold>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-bold": [2, "strong"]
      }
    });
    t.equal(applyFixes(str, messages), "<strong>z</strong>");
    t.match(messages, [
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
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - b is suggested`,
  t => {
    const str = "<bold>z</bold>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-bold": [2, "b"]
      }
    });
    t.equal(applyFixes(str, messages), "<b>z</b>");
    t.match(messages, [
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
    ]);
    t.end();
  }
);
