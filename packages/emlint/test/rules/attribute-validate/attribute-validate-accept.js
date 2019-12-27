const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accept, error level 0`,
  t => {
    const str = `<form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accept, error level 1`,
  t => {
    const str = `<input>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 1
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accept, error level 2`,
  t => {
    const str = `<input>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
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
    const str = `<input accept='image/*'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, file extension`,
  t => {
    const str = `<input accept=".jpg">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, spelled out type`,
  t => {
    const str = `<input accept="text/css">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - fancy MIME from the list`,
  t => {
    const str = `<input accept="application/vnd.openxmlformats-officedocument.presentationml.template.main+xml">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
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
    const str = `<input accept=" .jpg">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    t.equal(applyFixes(str, messages), `<input accept=".jpg">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-accept",
        idxFrom: 15,
        idxTo: 16,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[15, 16]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  t => {
    const str = `<input accept=".jpg ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    t.equal(applyFixes(str, messages), `<input accept=".jpg">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-accept",
        idxFrom: 19,
        idxTo: 20,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[19, 20]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  t => {
    const str = `<input accept="  .jpg \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    t.equal(applyFixes(str, messages), `<input accept=".jpg">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-accept",
        idxFrom: 15,
        idxTo: 23,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [15, 17],
            [21, 23]
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
    const str = `<input accept="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-accept",
        idxFrom: 15,
        idxTo: 18,
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
  `03.01 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - spaces after comma`,
  t => {
    const str = `<input accept=".jpg, .gif, .png">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    t.equal(applyFixes(str, messages), `<input accept=".jpg,.gif,.png">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-accept",
        idxFrom: 20,
        idxTo: 21,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[20, 21]]
        }
      },
      {
        ruleId: "attribute-validate-accept",
        idxFrom: 26,
        idxTo: 27,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[26, 27]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - out of whack value`,
  t => {
    const str = `<input accept="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-accept",
        idxFrom: 15,
        idxTo: 22,
        message: `Unrecognised value: "tralala".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - legit string with extras`,
  t => {
    const str = `<input accept="..jpg">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-accept",
        idxFrom: 15,
        idxTo: 20,
        message: `Unrecognised value: "..jpg".`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 04. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  t => {
    const str = `<div accept=".jpg">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-accept",
        idxFrom: 5,
        idxTo: 18,
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
    const str = `<zzz accept=".jpg" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-accept",
        idxFrom: 5,
        idxTo: 18,
        message: `Tag "zzz" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);
