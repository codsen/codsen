const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no span, error level 0`,
  (t) => {
    const str = `<col>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no span, error level 1`,
  (t) => {
    const str = `<col>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no span, error level 2`,
  (t) => {
    const str = `<col>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy span, zero`,
  (t) => {
    const str = `<col span='1'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy span, non-zero`,
  (t) => {
    const str = `<colgroup span="3">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
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
    const str = `<col span=" 1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<col span="1">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 11,
        idxTo: 12,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[11, 12]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<col span="1 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<col span="1">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
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
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<col span="  1  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<col span="1">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 11,
        idxTo: 16,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [11, 13],
            [14, 16],
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
    const str = `<col span="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 11,
        idxTo: 14,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - string as value`,
  (t) => {
    const str = `<col span="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 11,
        idxTo: 12,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - dot as value`,
  (t) => {
    const str = `<col span=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 11,
        idxTo: 12,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - a rational number`,
  (t) => {
    const str = `<col span="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 12, // <--- starts at the first non-digit char
        idxTo: 14,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - with units`,
  (t) => {
    const str = `<col span="1px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // Can't fix because opts.customPxMessage is on.
    // A user mistakenly set pixels whereas value is a count number.
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 12, // <--- starts at the first non-digit char
        idxTo: 14,
        message: `Columns number is not in pixels.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(`03.05 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - zero`, (t) => {
  const str = `<col span="0">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 11,
      idxTo: 12,
      message: `Zero not allowed.`,
      fix: null,
    },
  ]);
  t.end();
});

t.test(
  `03.06 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - padded with zero, col`,
  (t) => {
    const str = `<col span="01">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 11,
        idxTo: 13,
        message: `Number padded with zero.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.07 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - padded with zero, colgroup`,
  (t) => {
    const str = `<colgroup span="01">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 16,
        idxTo: 18,
        message: `Number padded with zero.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 04. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div span="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 5,
        idxTo: 13,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz span="0" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 5,
        idxTo: 13,
        fix: null,
      },
    ]);
    t.end();
  }
);
