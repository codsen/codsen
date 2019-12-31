const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no dir, error level 0`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-dir": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no dir, error level 1`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-dir": 1
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no dir, error level 2`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-dir": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, wildcard`,
  t => {
    const str = `<td dir='rtl'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-dir": 2
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
    const str = `<td dir=' rtl'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-dir": 2
      }
    });
    t.equal(applyFixes(str, messages), `<td dir='rtl'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-dir",
        idxFrom: 9,
        idxTo: 10,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[9, 10]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  t => {
    const str = `<td dir='rtl '>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-dir": 2
      }
    });
    t.equal(applyFixes(str, messages), `<td dir='rtl'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-dir",
        idxFrom: 12,
        idxTo: 13,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[12, 13]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  t => {
    const str = `<td dir='  rtl  \t'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-dir": 2
      }
    });
    t.equal(applyFixes(str, messages), `<td dir='rtl'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-dir",
        idxFrom: 9,
        idxTo: 17,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [9, 11],
            [14, 17]
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
    const str = `<td dir="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-dir": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-dir",
        idxFrom: 9,
        idxTo: 12,
        message: `Missing value.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  t => {
    const str = `<script dir="ltr">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-dir": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-dir",
        idxFrom: 8,
        idxTo: 17,
        message: `Tag "script" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 04. wrong value
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out of whack value`,
  t => {
    const str = `<td dir="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-dir": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-dir",
        idxFrom: 9,
        idxTo: 16,
        message: `Should be "ltr|rtl".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case`,
  t => {
    const str = `<div dir="LTR">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-dir": 2
      }
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<div dir="ltr">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-dir",
        idxFrom: 10,
        idxTo: 13,
        message: `Should be lowercase.`,
        fix: {
          ranges: [[10, 13, "ltr"]]
        }
      }
    ]);
    t.end();
  }
);
