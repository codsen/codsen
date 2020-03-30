const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no method, error level 0`,
  (t) => {
    const str = `<form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no method, error level 1`,
  (t) => {
    const str = `<form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no method, error level 2`,
  (t) => {
    const str = `<form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, wildcard`,
  (t) => {
    const str = `<form method='get'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<form method=' get'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<form method='get'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-method",
        idxFrom: 14,
        idxTo: 15,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[14, 15]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<form method='get '>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<form method='get'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-method",
        idxFrom: 17,
        idxTo: 18,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[17, 18]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<form method='  get  \t'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<form method='get'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-method",
        idxFrom: 14,
        idxTo: 22,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [14, 16],
            [19, 22],
          ],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<form method="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-method",
        idxFrom: 14,
        idxTo: 17,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div method="get">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-method",
        idxFrom: 5,
        idxTo: 17,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz method="get">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-method",
        idxFrom: 5,
        idxTo: 17,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 04. wrong value
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out of whack value`,
  (t) => {
    const str = `<form method="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-method",
        idxFrom: 14,
        idxTo: 21,
        message: `Should be "get|post".`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case get`,
  (t) => {
    const str = `<form method="GET">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<form method="get">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-method",
        idxFrom: 14,
        idxTo: 17,
        message: `Should be lowercase.`,
        fix: {
          ranges: [[14, 17, "get"]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case post`,
  (t) => {
    const str = `<form method="POST">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-method": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<form method="post">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-method",
        idxFrom: 14,
        idxTo: 18,
        message: `Should be lowercase.`,
        fix: {
          ranges: [[14, 18, "post"]],
        },
      },
    ]);
    t.end();
  }
);
