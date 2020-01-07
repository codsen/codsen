const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no onsubmit, error level 0`,
  t => {
    const str = `<form class="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onsubmit": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no onsubmit, error level 1`,
  t => {
    const str = `<form class="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onsubmit": 1
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no onsubmit, error level 2`,
  t => {
    const str = `<form class="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onsubmit": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  t => {
    const str = `<form onsubmit='js'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onsubmit": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  t => {
    const str = `<div onsubmit="something">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onsubmit": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-onsubmit",
        idxFrom: 5,
        idxTo: 25,
        message: `Tag "div" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  t => {
    const str = `<zzz onsubmit="something" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onsubmit": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-onsubmit",
        idxFrom: 5,
        idxTo: 25,
        message: `Tag "zzz" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 03. whitespace
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`,
  t => {
    const str = `<form onsubmit="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onsubmit": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-onsubmit",
        idxFrom: 16,
        idxTo: 16,
        message: `Missing value.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - surrounding whitespace`,
  t => {
    const str = `<form onsubmit=" something ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onsubmit": 2
      }
    });
    t.equal(applyFixes(str, messages), `<form onsubmit="something">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-onsubmit",
        idxFrom: 16,
        idxTo: 27,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [16, 17],
            [26, 27]
          ]
        }
      }
    ]);
    t.end();
  }
);
