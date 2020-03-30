const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no scrolling, error level 0`,
  (t) => {
    const str = `<frame>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no scrolling, error level 1`,
  (t) => {
    const str = `<frame>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no scrolling, error level 2`,
  (t) => {
    const str = `<frame>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, frame`,
  (t) => {
    const str = `<frame scrolling="yes">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, iframe`,
  (t) => {
    const str = `<iframe scrolling="yes">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 2,
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
    const str = `<frame scrolling=' yes'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame scrolling='yes'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-scrolling",
        idxFrom: 18,
        idxTo: 19,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[18, 19]],
        },
      },
    ]);
    t.is(messages.length, 1);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<frame scrolling='yes '>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame scrolling='yes'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-scrolling",
        idxFrom: 21,
        idxTo: 22,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[21, 22]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<frame scrolling='  yes  \t'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame scrolling='yes'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-scrolling",
        idxFrom: 18,
        idxTo: 26,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [18, 20],
            [23, 26],
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
    const str = `<frame scrolling="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-scrolling",
        idxFrom: 18,
        idxTo: 21,
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
    const str = `<div scrolling="yes">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-scrolling",
        idxFrom: 5,
        idxTo: 20,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz scrolling="yes">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-scrolling",
        idxFrom: 5,
        idxTo: 20,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 04. wrong value
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out-of-whack value`,
  (t) => {
    const str = `<frame scrolling="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-scrolling",
        idxFrom: 18,
        idxTo: 25,
        message: `Should be "auto|yes|no".`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case`,
  (t) => {
    const str = `<frame scrolling="YES">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-scrolling": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<frame scrolling="yes">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-scrolling",
        idxFrom: 18,
        idxTo: 21,
        message: `Should be lowercase.`,
        fix: {
          ranges: [[18, 21, "yes"]],
        },
      },
    ]);
    t.end();
  }
);
