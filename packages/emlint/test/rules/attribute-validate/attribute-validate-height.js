const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - no width`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - no width`,
  (t) => {
    const str = `<th height="10">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - width in px`,
  (t) => {
    const str = `<object height="10px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<object height="10">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 18,
        idxTo: 20,
        message: `Remove px.`,
        fix: {
          ranges: [[18, 20]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - width in rem`,
  (t) => {
    const str = `<iframe height="10rem">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 18,
        idxTo: 21,
        message: `Should be "pixels|%".`,
        fix: null,
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
    const str = `<td height=" 600">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<td height="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 12,
        idxTo: 13,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[12, 13]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<td height="600 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<td height="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 15,
        idxTo: 16,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[15, 16]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<td height="  600  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<td height="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 12,
        idxTo: 20,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [12, 14],
            [17, 20],
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
    const str = `<td height="50\tpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 14,
        idxTo: 17,
        message: `Should be "pixels|%".`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and %`,
  (t) => {
    const str = `<td height="50\t%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 14,
        idxTo: 16,
        message: `Rogue whitespace.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<td height="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 12,
        idxTo: 15,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(`02.07 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, (t) => {
  const str = `<td height="%">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 12,
      idxTo: 13,
      message: `Should be "pixels|%"`,
      fix: null,
    },
  ]);
  t.end();
});

t.test(`02.08 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, (t) => {
  const str = `<td height="px">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 12,
      idxTo: 14,
      message: `Should be "pixels|%"`,
      fix: null,
    },
  ]);
  t.end();
});

t.test(
  `02.09 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  (t) => {
    const str = `<td height="6z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 13,
        idxTo: 14,
        message: `Should be "pixels|%"`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.10 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  (t) => {
    const str = `<td height="6 a z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 13,
        idxTo: 17,
        message: `Should be "pixels|%"`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.11 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, legit unit`,
  (t) => {
    const str = `<td height="1a0%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 13,
        idxTo: 16,
        message: `Should be "pixels|%"`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.12 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, bad unit`,
  (t) => {
    const str = `<td height="1a0z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 13,
        idxTo: 16,
        message: `Should be "pixels|%"`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.13 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, %`,
  (t) => {
    const str = `<td height="100%%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 15,
        idxTo: 17,
        message: `Should be "pixels|%"`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.14 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, px`,
  (t) => {
    const str = `<td height="100pxpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 15,
        idxTo: 19,
        message: `Should be "pixels|%"`,
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
    const str = `<div height="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
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
    const str = `<zzz height="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-height": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-height",
        idxFrom: 5,
        idxTo: 17,
        fix: null,
      },
    ]);
    t.end();
  }
);
