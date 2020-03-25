const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no http-equiv, error level 0`,
  (t) => {
    const str = `<meta>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no http-equiv, error level 1`,
  (t) => {
    const str = `<meta>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no http-equiv, error level 2`,
  (t) => {
    const str = `<meta>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, content-type`,
  (t) => {
    const str = `<meta http-equiv='content-type'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, default-style`,
  (t) => {
    const str = `<meta http-equiv="default-style">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, refresh`,
  (t) => {
    const str = `<meta http-equiv="refresh">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
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
    const str = `<meta http-equiv=' refresh'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<meta http-equiv='refresh'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-http-equiv",
        idxFrom: 18,
        idxTo: 19,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[18, 19]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<meta http-equiv="refresh ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<meta http-equiv="refresh">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-http-equiv",
        idxFrom: 25,
        idxTo: 26,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[25, 26]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<meta http-equiv='  refresh  \t'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<meta http-equiv='refresh'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-http-equiv",
        idxFrom: 18,
        idxTo: 30,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [18, 20],
            [27, 30],
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
    const str = `<meta http-equiv="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-http-equiv",
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
    const str = `<div http-equiv="refresh">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-http-equiv",
        idxFrom: 5,
        idxTo: 25,
        message: `Tag "div" can't have this attribute.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz http-equiv="refresh">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-http-equiv",
        idxFrom: 5,
        idxTo: 25,
        message: `Tag "zzz" can't have this attribute.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 04. wrong value
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out of whack value`,
  (t) => {
    const str = `<meta http-equiv="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-http-equiv",
        idxFrom: 18,
        idxTo: 25,
        message: `Should be "content-type|default-style|refresh".`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case`,
  (t) => {
    const str = `<meta http-equiv="REFRESH">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), `<meta http-equiv="refresh">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-http-equiv",
        idxFrom: 18,
        idxTo: 25,
        message: `Should be lowercase.`,
        fix: {
          ranges: [[18, 25, "refresh"]],
        },
      },
    ]);
    t.end();
  }
);
