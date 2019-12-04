const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");
const astDeepContains = require("ast-deep-contains");
const BACKSLASH = "\u005C";

// 1. basic tests
t.test(`01.01 - a single tag`, t => {
  const str = "< a>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2
    }
  });
  t.match(messages, [
    {
      ruleId: "tag-space-after-opening-bracket",
      severity: 2,
      idxFrom: 1,
      idxTo: 2,
      message: "Bad whitespace.",
      fix: {
        ranges: [[1, 2]]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), "<a>");
  t.end();
});

t.test(`01.02 - a single closing tag, space before slash`, t => {
  const str = "\n<\t\t/a>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2
    }
  });
  t.match(messages, [
    {
      ruleId: "tag-space-after-opening-bracket",
      severity: 2,
      idxFrom: 2,
      idxTo: 4,
      message: "Bad whitespace.",
      fix: {
        ranges: [[2, 4]]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), "\n</a>");
  t.end();
});

t.test(`01.03 - a single closing tag, space after slash`, t => {
  const str = "\n</\t\ta>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2
    }
  });
  t.match(messages, [
    {
      ruleId: "tag-space-after-opening-bracket",
      severity: 2,
      idxFrom: 3,
      idxTo: 5,
      message: "Bad whitespace.",
      fix: {
        ranges: [[3, 5]]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), "\n</a>");
  t.end();
});

t.test(`01.04 - a single closing tag, space before and after slash`, t => {
  const str = "\n<\t/\ta>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2
    }
  });
  t.match(messages, [
    {
      ruleId: "tag-space-after-opening-bracket",
      severity: 2,
      idxFrom: 2,
      idxTo: 5,
      message: "Bad whitespace.",
      fix: {
        ranges: [
          [2, 3],
          [4, 5]
        ]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), "\n</a>");
  t.end();
});

t.test(`01.05 - in front of repeated slash`, t => {
  const str = "< // a>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2
    }
  });
  t.match(messages, [
    {
      ruleId: "tag-space-after-opening-bracket",
      severity: 2,
      idxFrom: 1,
      idxTo: 5,
      message: "Bad whitespace.",
      fix: {
        ranges: [
          [1, 2],
          [4, 5]
        ]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), "<//a>");
  t.end();
});

t.test(`01.06 - in front of backslash`, t => {
  const str = `< ${BACKSLASH} a>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      tag: 2
    }
  });
  astDeepContains(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 1,
        idxTo: 4,
        message: "Bad whitespace.",
        fix: {
          ranges: [
            [1, 2],
            [3, 4]
          ]
        }
      },
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 2,
        idxTo: 3,
        message: "Wrong slash - backslash.",
        fix: {
          ranges: [[2, 3]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.equal(applyFixes(str, messages), `<a>`);
  t.end();
});

// 02. XML
// -----------------------------------------------------------------------------

t.test(`02.01 - ${`\u001b[${36}m${`XML tags`}\u001b[${39}m`} - basic`, t => {
  const str = `< ?xml version="1.0" encoding="UTF-8"?>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2
    }
  });
  t.match(messages, [
    {
      ruleId: "tag-space-after-opening-bracket",
      severity: 2,
      idxFrom: 1,
      idxTo: 2,
      message: "Bad whitespace.",
      fix: {
        ranges: [[1, 2]]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), `<?xml version="1.0" encoding="UTF-8"?>`);
  t.end();
});
