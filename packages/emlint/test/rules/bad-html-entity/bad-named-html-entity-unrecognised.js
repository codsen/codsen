// rule: bad-named-html-entity-unrecognised
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// 01. missing letters
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - group rule`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-html-entity": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-unrecognised",
        severity: 1, // <------- unrecognised entities might be false positives so default level is "warning"!
        idxFrom: 3,
        idxTo: 7,
        message: "Unrecognised named entity.",
        fix: {
          ranges: [],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - exact rule, severity level 1`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-unrecognised": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-unrecognised",
        severity: 1,
        idxFrom: 3,
        idxTo: 7,
        message: "Unrecognised named entity.",
        fix: {
          ranges: [], // no fixes
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - exact rule, severity level 2`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-unrecognised": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-unrecognised",
        severity: 2,
        idxFrom: 3,
        idxTo: 7,
        message: "Unrecognised named entity.",
        fix: {
          ranges: [], // no fixes
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - rule by wildcard`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-unrecognised",
        severity: 1, // <---- default is warning
        idxFrom: 3,
        idxTo: 7,
        message: "Unrecognised named entity.",
        fix: {
          ranges: [], // no fixes
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - group rule - off`,
  (t) => {
    const str = `abc&yo;def`;
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
  `01.06 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - exact rule, severity level 0`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-unrecognised": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.07 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - rule by wildcard - off`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);
