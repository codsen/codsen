const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no clear, error level 0`,
  (t) => {
    const str = `<br><form>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-clear": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no clear, error level 1`,
  (t) => {
    const str = `<br><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-clear": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no clear, error level 2`,
  (t) => {
    const str = `<br><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-clear": 2,
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
    const str = `<br clear='left'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-clear": 2,
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
    const str = `<div clear='left'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-clear": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-clear",
        idxFrom: 5,
        idxTo: 17,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz clear="left" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-clear": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-clear",
        idxFrom: 5,
        idxTo: 17,
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
    const str = `<br clear="zzz">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-clear": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-clear",
        idxFrom: 11,
        idxTo: 14,
        message: `Should be: left|all|right|none.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`,
  (t) => {
    const str = `<br clear=" left">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-clear": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<br clear="left">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-clear",
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
  `03.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - wrong case and whitespace`,
  (t) => {
    // notice wrong tag name case:
    const str = `<Br clear=" zzz ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-clear": 2,
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<br clear="zzz">`);
    t.match(messages, [
      {
        ruleId: "tag-name-case",
        idxFrom: 1,
        idxTo: 3,
        message: `Bad tag name case.`,
        fix: {
          ranges: [[1, 3, "br"]],
        },
      },
      {
        ruleId: "attribute-validate-clear",
        idxFrom: 11,
        idxTo: 16,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [11, 12],
            [15, 16],
          ],
        },
      },
      {
        ruleId: "attribute-validate-clear",
        idxFrom: 12,
        idxTo: 15,
        message: `Should be: left|all|right|none.`,
        fix: null,
      },
    ]);
    t.end();
  }
);
