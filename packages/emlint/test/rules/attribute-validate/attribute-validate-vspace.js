const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - no width`,
  (t) => {
    const str = `<img>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - width in px`,
  (t) => {
    const str = `<img vspace="600px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<img vspace="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 16,
        idxTo: 18,
        message: `Remove px.`,
        fix: {
          ranges: [[16, 18]],
        },
      },
    ]);
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<img vspace=" 600">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<img vspace="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 13,
        idxTo: 14,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[13, 14]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<img vspace="600 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<img vspace="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 16,
        idxTo: 17,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[16, 17]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<img vspace="  600  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<img vspace="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 13,
        idxTo: 20,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [13, 15],
            [18, 20],
          ],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and px`,
  (t) => {
    const str = `<img vspace="50\tpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 15,
        idxTo: 18,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and %`,
  (t) => {
    const str = `<img vspace="50\t%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 15,
        idxTo: 17,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<img vspace="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 13,
        idxTo: 16,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(`02.07 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, (t) => {
  const str = `<img vspace="px">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-vspace": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-vspace",
      idxFrom: 13,
      idxTo: 15,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
  t.end();
});

t.test(`02.08 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, (t) => {
  const str = `<img vspace="%">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-vspace": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-vspace",
      idxFrom: 13,
      idxTo: 14,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
  t.end();
});

t.test(
  `02.09 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  (t) => {
    const str = `<img vspace="6z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 14,
        idxTo: 15,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.11 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  (t) => {
    const str = `<img vspace="6 a z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 14,
        idxTo: 18,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.12 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, legit unit`,
  (t) => {
    const str = `<img vspace="1a0%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 14,
        idxTo: 17,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.13 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, bad unit`,
  (t) => {
    const str = `<img vspace="1a0z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 14,
        idxTo: 17,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.14 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, %`,
  (t) => {
    const str = `<img vspace="100%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 16,
        idxTo: 17,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.15 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, %`,
  (t) => {
    const str = `<img vspace="100%%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 16,
        idxTo: 18,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.16 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, px`,
  (t) => {
    const str = `<img vspace="100pxpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 16,
        idxTo: 20,
        message: `Should be integer, no units.`,
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
    const str = `<br vspace="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 4,
        idxTo: 16,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz vspace="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-vspace": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-vspace",
        idxFrom: 5,
        idxTo: 17,
        fix: null,
      },
    ]);
    t.end();
  }
);
