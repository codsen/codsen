const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no colspan, error level 0`,
  t => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no colspan, error level 1`,
  t => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 1
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no colspan, error level 2`,
  t => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy colspan, zero`,
  t => {
    const str = `<td colspan='0'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy colspan, non-zero`,
  t => {
    const str = `<td colspan="3">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
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
  t => {
    const str = `<td colspan=" 0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
    });
    t.equal(applyFixes(str, messages), `<td colspan="0">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-colspan",
        idxFrom: 13,
        idxTo: 14,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[13, 14]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  t => {
    const str = `<td colspan="0 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
    });
    t.equal(applyFixes(str, messages), `<td colspan="0">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-colspan",
        idxFrom: 14,
        idxTo: 15,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[14, 15]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  t => {
    const str = `<td colspan="  0  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
    });
    t.equal(applyFixes(str, messages), `<td colspan="0">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-colspan",
        idxFrom: 13,
        idxTo: 18,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [13, 15],
            [16, 18]
          ]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  t => {
    const str = `<td colspan="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-colspan",
        idxFrom: 13,
        idxTo: 16,
        message: `Missing value.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - string as value`,
  t => {
    const str = `<td colspan="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-colspan",
        idxFrom: 13,
        idxTo: 14,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - dot as value`,
  t => {
    const str = `<td colspan=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-colspan",
        idxFrom: 13,
        idxTo: 14,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - a rational number`,
  t => {
    const str = `<td colspan="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-colspan",
        idxFrom: 14, // <--- starts at the first non-digit char
        idxTo: 16,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(`03.04 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - with units`, t => {
  const str = `<td colspan="1px">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-colspan": 2
    }
  });
  // will fix:
  t.equal(applyFixes(str, messages), `<td colspan="1">`);
  t.match(messages, [
    {
      ruleId: "attribute-validate-colspan",
      idxFrom: 14, // <--- starts at the first non-digit char
      idxTo: 16,
      message: `Remove px.`,
      fix: {
        ranges: [[14, 16]]
      }
    }
  ]);
  t.end();
});

// 04. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  t => {
    const str = `<div colspan="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-colspan",
        idxFrom: 5,
        idxTo: 16,
        message: `Tag "div" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  t => {
    const str = `<zzz colspan="0" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-colspan": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-colspan",
        idxFrom: 5,
        idxTo: 16,
        message: `Tag "zzz" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);
