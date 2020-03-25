// rule: tag-space-before-closing-slash
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");
// const astDeepContains = require("ast-deep-contains");

// 1. no opts
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - defaults, no opts, space present, warning`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": 1,
      },
    });
    t.match(messages, [
      {
        ruleId: "tag-space-before-closing-slash",
        severity: 1,
        idxFrom: 3,
        idxTo: 4,
        line: 1,
        column: 4,
        message: "Bad whitespace.",
        fix: {
          ranges: [[3, 4]],
        },
      },
    ]);
    t.equal(applyFixes(str, messages), "<br/>");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - defaults, no opts, space present, error`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": 2,
      },
    });
    t.match(messages, [
      {
        ruleId: "tag-space-before-closing-slash",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        line: 1,
        column: 4,
        message: "Bad whitespace.",
        fix: {
          ranges: [[3, 4]],
        },
      },
    ]);
    t.equal(applyFixes(str, messages), "<br/>");
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - defaults, no opts, space missing, warning`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": 1,
      },
    });
    t.same(messages, []);
    t.equal(applyFixes(str, messages), str);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - defaults, no opts, space missing, error`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": 2,
      },
    });
    t.same(messages, []);
    t.equal(applyFixes(str, messages), str);
    t.end();
  }
);

// 02. space present
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${32}m${`with opts, space present`}\u001b[${39}m`} - space present, opts=never, warning`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [1, "never"],
      },
    });
    t.match(messages, [
      {
        ruleId: "tag-space-before-closing-slash",
        severity: 1,
        idxFrom: 3,
        idxTo: 4,
        line: 1,
        column: 4,
        message: "Bad whitespace.",
        fix: {
          ranges: [[3, 4]],
        },
      },
    ]);
    t.equal(applyFixes(str, messages), "<br/>");
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${32}m${`with opts, space present`}\u001b[${39}m`} - space present, opts=never, error`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "never", "tralala"],
      },
    });
    t.match(messages, [
      {
        ruleId: "tag-space-before-closing-slash",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        line: 1,
        column: 4,
        message: "Bad whitespace.",
        fix: {
          ranges: [[3, 4]],
        },
      },
    ]);
    t.equal(applyFixes(str, messages), "<br/>");
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${32}m${`with opts, space present`}\u001b[${39}m`} - space present, opts=always, warning`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [1, "always"],
      },
    });
    t.same(messages, []);
    t.equal(applyFixes(str, messages), str);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${32}m${`with opts, space present`}\u001b[${39}m`} - space present, opts=always, error`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.same(messages, []);
    t.equal(applyFixes(str, messages), str);
    t.end();
  }
);

// 03. space missing
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${36}m${`with opts, space missing`}\u001b[${39}m`} - opts=always, warning`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [1, "always"],
      },
    });
    t.match(messages, [
      {
        ruleId: "tag-space-before-closing-slash",
        severity: 1,
        idxFrom: 3,
        idxTo: 3,
        line: 1,
        column: 4,
        message: "Missing space.",
        fix: {
          ranges: [[3, 3, " "]],
        },
      },
    ]);
    t.equal(applyFixes(str, messages), "<br />");
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${36}m${`with opts, space missing`}\u001b[${39}m`} - opts=always, error`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.match(messages, [
      {
        ruleId: "tag-space-before-closing-slash",
        severity: 2,
        idxFrom: 3,
        idxTo: 3,
        line: 1,
        column: 4,
        message: "Missing space.",
        fix: {
          ranges: [[3, 3, " "]],
        },
      },
    ]);
    t.equal(applyFixes(str, messages), "<br />");
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${36}m${`with opts, space missing`}\u001b[${39}m`} - opts=never, warning`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [1, "never"],
      },
    });
    t.same(messages, []);
    t.equal(applyFixes(str, messages), str);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${36}m${`with opts, space missing`}\u001b[${39}m`} - opts=never, error`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "never"],
      },
    });
    t.same(messages, []);
    t.equal(applyFixes(str, messages), str);
    t.end();
  }
);

// 04. many tags with different situation
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`mixed`}\u001b[${39}m`} - opts=always`,
  (t) => {
    const str = "<br/><hr/><hr /><br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.equal(messages.length, 3);
    t.match(messages, [
      {
        ruleId: "tag-space-before-closing-slash",
        severity: 2,
        idxFrom: 3,
        idxTo: 3,
        line: 1,
        column: 4,
        message: "Missing space.",
        fix: {
          ranges: [[3, 3, " "]],
        },
      },
      {
        ruleId: "tag-space-before-closing-slash",
        severity: 2,
        idxFrom: 8,
        idxTo: 8,
        line: 1,
        column: 9,
        message: "Missing space.",
        fix: {
          ranges: [[8, 8, " "]],
        },
      },
      {
        ruleId: "tag-space-before-closing-slash",
        severity: 2,
        idxFrom: 19,
        idxTo: 19,
        line: 1,
        column: 20,
        message: "Missing space.",
        fix: {
          ranges: [[19, 19, " "]],
        },
      },
    ]);
    t.equal(applyFixes(str, messages), "<br /><hr /><hr /><br />");
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${`mixed`}\u001b[${39}m`} - opts=never, deletes a space`,
  (t) => {
    const str = "<br/><hr/><hr  /><br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "never"],
      },
    });
    t.equal(messages.length, 1);
    t.match(messages, [
      {
        ruleId: "tag-space-before-closing-slash",
        severity: 2,
        idxFrom: 13,
        idxTo: 15,
        line: 1,
        column: 14,
        message: "Bad whitespace.",
        fix: {
          ranges: [[13, 15]],
        },
      },
    ]);
    t.equal(applyFixes(str, messages), "<br/><hr/><hr/><br/>");
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${35}m${`mixed`}\u001b[${39}m`} - opts=never, deletes a tab`,
  (t) => {
    const str = "<br/><hr/><hr\t/><br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "never"],
      },
    });
    t.equal(messages.length, 1);
    t.match(messages, [
      {
        ruleId: "tag-space-before-closing-slash",
        severity: 2,
        idxFrom: 13,
        idxTo: 14,
        line: 1,
        column: 14,
        message: "Bad whitespace.",
        fix: {
          ranges: [[13, 14]],
        },
      },
    ]);
    t.equal(applyFixes(str, messages), "<br/><hr/><hr/><br/>");
    t.end();
  }
);
