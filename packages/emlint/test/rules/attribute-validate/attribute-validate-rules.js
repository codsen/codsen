const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rules, error level 0`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rules, error level 1`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 1
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rules, error level 2`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 2
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
    const str = `<table rules="cols">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 2
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
    const str = `<table rules=' rows'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 2
      }
    });
    t.equal(applyFixes(str, messages), `<table rules='rows'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-rules",
        idxFrom: 14,
        idxTo: 15,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[14, 15]]
        }
      }
    ]);
    t.is(messages.length, 1);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  t => {
    const str = `<table rules='rows '>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 2
      }
    });
    t.equal(applyFixes(str, messages), `<table rules='rows'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-rules",
        idxFrom: 18,
        idxTo: 19,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[18, 19]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  t => {
    const str = `<table rules='  rows  \t'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 2
      }
    });
    t.equal(applyFixes(str, messages), `<table rules='rows'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-rules",
        idxFrom: 14,
        idxTo: 23,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [14, 16],
            [20, 23]
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
    const str = `<table rules="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-rules",
        idxFrom: 14,
        idxTo: 17,
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
    const str = `<div rules="void">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-rules",
        idxFrom: 5,
        idxTo: 17,
        message: `Tag "div" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  t => {
    const str = `<zzz rules="void">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-rules",
        idxFrom: 5,
        idxTo: 17,
        message: `Tag "zzz" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 04. wrong value
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out-of-whack value`,
  t => {
    const str = `<table rules="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-rules",
        idxFrom: 14,
        idxTo: 21,
        message: `Should be "none|groups|rows|cols|all".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case`,
  t => {
    const str = `<table rules="GROUPS">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rules": 2
      }
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<table rules="groups">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-rules",
        idxFrom: 14,
        idxTo: 20,
        message: `Should be lowercase.`,
        fix: {
          ranges: [[14, 20, "groups"]]
        }
      }
    ]);
    t.end();
  }
);
