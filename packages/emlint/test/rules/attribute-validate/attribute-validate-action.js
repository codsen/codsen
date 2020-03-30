const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no action, error level 0`,
  (t) => {
    const str = `<div><form>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-action": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no action, error level 1`,
  (t) => {
    const str = `<div><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-action": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no action, error level 2`,
  (t) => {
    const str = `<div><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-action": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<form action='https://codsen.com'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-action": 2,
      },
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
  (t) => {
    const str = `<div action='https://codsen.com'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-action": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-action",
        idxFrom: 5,
        idxTo: 32,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz action="https://codsen.com" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-action": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-action",
        idxFrom: 5,
        idxTo: 32,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<form action="zz.">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-action": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-action",
        idxFrom: 14,
        idxTo: 17,
        message: `Should be an URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`,
  (t) => {
    const str = `<form action=" https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-action": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<form action="https://codsen.com">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-action",
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
  `03.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`,
  (t) => {
    const str = `<form action=" zz. ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-action": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<form action="zz.">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-action",
        idxFrom: 14,
        idxTo: 19,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [14, 15],
            [18, 19],
          ],
        },
      },
      {
        ruleId: "attribute-validate-action",
        idxFrom: 15,
        idxTo: 18,
        message: `Should be an URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - two URL's, space-separated`,
  (t) => {
    const str = `<form action="https://codsen.com https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-action": 2,
      },
    });
    // can't fix
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-action",
        idxFrom: 14,
        idxTo: 53,
        message: `There should be only one URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - two URL's, comma-separated`,
  (t) => {
    const str = `<form action="https://codsen.com,https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-action": 2,
      },
    });
    // can't fix
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-action",
        idxFrom: 14,
        idxTo: 53,
        message: `There should be only one URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);
