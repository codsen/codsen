// rule: bad-malformed-numeric-character-entity
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// 01. double encoding on nbsp
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`malformed numeric`}\u001b[${39}m`} - numeric entity outside of the range - group rule`,
  (t) => {
    const str = `a&#99999999999999999;z`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-html-entity": 2,
      },
    });
    t.equal(applyFixes(str, messages), "az");
    t.match(messages, [
      {
        ruleId: "bad-malformed-numeric-character-entity",
        severity: 2,
        idxFrom: 1,
        idxTo: 21,
        message: "Malformed numeric entity.",
        fix: {
          ranges: [[1, 21]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`malformed numeric`}\u001b[${39}m`} - numeric entity outside of the range - exact rule, 1`,
  (t) => {
    const str = `a&#99999999999999999;z`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-malformed-numeric-character-entity": 1,
      },
    });
    t.equal(applyFixes(str, messages), "az");
    t.match(messages, [
      {
        ruleId: "bad-malformed-numeric-character-entity",
        severity: 1,
        idxFrom: 1,
        idxTo: 21,
        message: "Malformed numeric entity.",
        fix: {
          ranges: [[1, 21]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`malformed numeric`}\u001b[${39}m`} - numeric entity outside of the range - exact rule, 2`,
  (t) => {
    const str = `a&#99999999999999999;z`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-malformed-numeric-character-entity": 2,
      },
    });
    t.equal(applyFixes(str, messages), "az");
    t.match(messages, [
      {
        ruleId: "bad-malformed-numeric-character-entity",
        severity: 2,
        idxFrom: 1,
        idxTo: 21,
        message: "Malformed numeric entity.",
        fix: {
          ranges: [[1, 21]],
        },
      },
    ]);
    t.end();
  }
);

// 02. dollar instead of a hash
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${32}m${`malformed numeric`}\u001b[${39}m`} - dollar instead of hash - rule by wildcard`,
  (t) => {
    const str = `_&$65;_`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-malformed-*": 2,
      },
    });
    t.equal(applyFixes(str, messages), "__");
    t.match(messages, [
      {
        ruleId: "bad-malformed-numeric-character-entity",
        severity: 2,
        idxFrom: 1,
        idxTo: 6,
        message: "Malformed numeric entity.",
        fix: {
          ranges: [[1, 6]],
        },
      },
    ]);
    t.end();
  }
);

// 03. disabled rule
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${33}m${`disabled rule`}\u001b[${39}m`} - numeric entity outside of the range - group rule`,
  (t) => {
    const str = `a&#99999999999999999;z`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-html-entity": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${33}m${`disabled rule`}\u001b[${39}m`} - numeric entity outside of the range - exact rule, 0`,
  (t) => {
    const str = `a&#99999999999999999;z`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-malformed-numeric-character-entity": [0],
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${33}m${`disabled rule`}\u001b[${39}m`} - numeric entity outside of the range - exact rule, with other rules`,
  (t) => {
    const str = `a&#99999999999999999;z<br>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-malformed-numeric-character-entity": [0],
        "tag-void-slash": [1],
      },
    });
    t.equal(applyFixes(str, messages), "a&#99999999999999999;z<br/>");
    t.match(messages, [
      {
        ruleId: "tag-void-slash",
        severity: 1,
        idxFrom: 25,
        idxTo: 25,
        message: "Missing slash.",
        fix: {
          ranges: [[25, 25, "/"]],
        },
      },
    ]);
    t.end();
  }
);
