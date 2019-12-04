// rule: bad-named-html-entity-multiple-encoding
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// 01. double encoding on nbsp
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule`, t => {
  const str = `abc&amp;nbsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-html-entity": 2
    }
  });
  t.equal(applyFixes(str, messages), "abc&nbsp;def");
  t.match(messages, [
    {
      ruleId: "bad-named-html-entity-multiple-encoding",
      severity: 2,
      idxFrom: 3,
      idxTo: 13,
      message: "HTML entity encoding over and over.",
      fix: {
        ranges: [[3, 13, "&nbsp;"]]
      }
    }
  ]);
  t.end();
});

t.test(
  `01.02 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule, severity level 1`,
  t => {
    const str = `abc&amp;nbsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-multiple-encoding": 1
      }
    });
    t.equal(applyFixes(str, messages), "abc&nbsp;def");
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-multiple-encoding",
        severity: 1,
        idxFrom: 3,
        idxTo: 13,
        message: "HTML entity encoding over and over.",
        fix: {
          ranges: [[3, 13, "&nbsp;"]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule, severity level 2`,
  t => {
    const str = `abc&amp;nbsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-multiple-encoding": 2
      }
    });
    t.equal(applyFixes(str, messages), "abc&nbsp;def");
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-multiple-encoding",
        severity: 2,
        idxFrom: 3,
        idxTo: 13,
        message: "HTML entity encoding over and over.",
        fix: {
          ranges: [[3, 13, "&nbsp;"]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - rule by wildcard`,
  t => {
    const str = `abc&amp;nbsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 2
      }
    });
    t.equal(applyFixes(str, messages), "abc&nbsp;def");
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-multiple-encoding",
        severity: 2,
        idxFrom: 3,
        idxTo: 13,
        message: "HTML entity encoding over and over.",
        fix: {
          ranges: [[3, 13, "&nbsp;"]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule - off`,
  t => {
    const str = `abc&amp;nbsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-html-entity": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule, severity level 0 - off`,
  t => {
    const str = `abc&amp;nbsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-multiple-encoding": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.07 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - rule by wildcard - off`,
  t => {
    const str = `abc&amp;nbsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);
