// rule: bad-named-html-entity-not-email-friendly
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. one entity of the list
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule`, (t) => {
  const str = `abc&Intersection;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-html-entity": 2,
    },
  });
  t.equal(applyFixes(str, messages), "abc&#x22C2;def");
  t.match(messages, [
    {
      ruleId: "bad-named-html-entity-not-email-friendly",
      severity: 2,
      idxFrom: 3,
      idxTo: 17,
      message: "Email-unfriendly named HTML entity.",
      fix: {
        ranges: [[3, 17, "&#x22C2;"]],
      },
    },
  ]);
  t.end();
});

t.test(`01.02 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule`, (t) => {
  const str = `abc&Intersection;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-named-html-entity-not-email-friendly": 1,
    },
  });
  t.equal(applyFixes(str, messages), "abc&#x22C2;def");
  t.match(messages, [
    {
      ruleId: "bad-named-html-entity-not-email-friendly",
      severity: 1,
      idxFrom: 3,
      idxTo: 17,
      message: "Email-unfriendly named HTML entity.",
      fix: {
        ranges: [[3, 17, "&#x22C2;"]],
      },
    },
  ]);
  t.end();
});

t.test(
  `01.03 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - through wildcard`,
  (t) => {
    const str = `abc&Intersection;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-not-email-*": 1,
      },
    });
    t.equal(applyFixes(str, messages), "abc&#x22C2;def");
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-not-email-friendly",
        severity: 1,
        idxFrom: 3,
        idxTo: 17,
        message: "Email-unfriendly named HTML entity.",
        fix: {
          ranges: [[3, 17, "&#x22C2;"]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - through wildcard`,
  (t) => {
    const str = `abc&Intersection;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad*": 1,
      },
    });
    t.equal(applyFixes(str, messages), "abc&#x22C2;def");
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-not-email-friendly",
        severity: 1,
        idxFrom: 3,
        idxTo: 17,
        message: "Email-unfriendly named HTML entity.",
        fix: {
          ranges: [[3, 17, "&#x22C2;"]],
        },
      },
    ]);
    t.end();
  }
);
