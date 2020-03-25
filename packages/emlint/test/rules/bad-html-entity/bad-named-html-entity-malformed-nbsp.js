// rule: bad-named-html-entity-malformed-nbsp
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// 01. missing letters
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule`, (t) => {
  const str = `abc&nsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-html-entity": 2,
    },
  });
  t.equal(applyFixes(str, messages), "abc&nbsp;def");
  t.match(messages, [
    {
      ruleId: "bad-named-html-entity-malformed-nbsp",
      severity: 2,
      idxFrom: 3,
      idxTo: 8,
      message: "Malformed NBSP entity.",
      fix: {
        ranges: [[3, 8, "&nbsp;"]],
      },
    },
  ]);
  t.end();
});

t.test(`01.02 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule`, (t) => {
  const str = `abc&nsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-named-html-entity-malformed-nbsp": 2,
    },
  });
  t.equal(applyFixes(str, messages), "abc&nbsp;def");
  t.match(messages, [
    {
      ruleId: "bad-named-html-entity-malformed-nbsp",
      severity: 2,
      idxFrom: 3,
      idxTo: 8,
      message: "Malformed NBSP entity.",
      fix: {
        ranges: [[3, 8, "&nbsp;"]],
      },
    },
  ]);
  t.end();
});

t.test(
  `01.03 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - rule by wildcard`,
  (t) => {
    const str = `abc&nsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 2,
      },
    });
    t.equal(applyFixes(str, messages), "abc&nbsp;def");
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-malformed-nbsp",
        severity: 2,
        idxFrom: 3,
        idxTo: 8,
        message: "Malformed NBSP entity.",
        fix: {
          ranges: [[3, 8, "&nbsp;"]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule - off`,
  (t) => {
    const str = `abc&nsp;def`;
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
  `01.05 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule - off`,
  (t) => {
    const str = `abc&nsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-malformed-nbsp": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - rule by wildcard - off`,
  (t) => {
    const str = `abc&nsp;def`;
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

// 02. other malformed entities
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by wildcard`,
  (t) => {
    const str = `&pond;1000`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 2,
      },
    });
    t.equal(applyFixes(str, messages), "&pound;1000");
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-malformed-pound",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: "Malformed pound entity.",
        fix: {
          ranges: [[0, 6, "&pound;"]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by group rule`,
  (t) => {
    const str = `&pond;1000`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-html-entity": 2,
      },
    });
    t.equal(applyFixes(str, messages), "&pound;1000");
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-malformed-pound",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: "Malformed pound entity.",
        fix: {
          ranges: [[0, 6, "&pound;"]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by exact rule`,
  (t) => {
    const str = `&pond;1000`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-malformed-pound": 2,
      },
    });
    t.equal(applyFixes(str, messages), "&pound;1000");
    t.match(messages, [
      {
        ruleId: "bad-named-html-entity-malformed-pound",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: "Malformed pound entity.",
        fix: {
          ranges: [[0, 6, "&pound;"]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by wildcard - off`,
  (t) => {
    const str = `&pond;1000`;
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

t.test(
  `02.05 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by group rule - off`,
  (t) => {
    const str = `&pond;1000`;
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
  `02.06 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by exact rule - off`,
  (t) => {
    const str = `&pond;1000`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-malformed-pound": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);
