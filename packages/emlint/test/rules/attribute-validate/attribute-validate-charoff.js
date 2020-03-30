const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no char, error level 0`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no char, error level 1`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no char, error level 2`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
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
    const str = `<td align="char" char="." charoff="2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<td align="char" char="," charoff="-2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<td align="char" char="," charoff="-99">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<td align="char" char="," charoff="99">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
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
    const str = `<div char="." charoff="2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charoff",
        idxFrom: 14,
        idxTo: 25,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz char="." charoff="2" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charoff",
        idxFrom: 14,
        idxTo: 25,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`a wrong value`}\u001b[${39}m`} - not integer but str`,
  (t) => {
    const str = `z <td char="." charoff="abc" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charoff",
        idxFrom: 24,
        idxTo: 27,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, encoded`,
  (t) => {
    const str = `z <td char="." charoff=" &#x3A;">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
      },
    });
    t.equal(applyFixes(str, messages), `z <td char="." charoff="&#x3A;">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charoff",
        idxFrom: 24,
        idxTo: 25,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[24, 25]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - an empty value`,
  (t) => {
    const str = `z <td char="." charoff="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charoff",
        idxFrom: 24,
        idxTo: 24,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - a rational number`,
  (t) => {
    const str = `z <td char="." charoff="2.1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charoff",
        idxFrom: 25,
        idxTo: 27,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(`03.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - dot`, (t) => {
  const str = `z <td char="." charoff=".">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-charoff",
      idxFrom: 24,
      idxTo: 25,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
  t.end();
});

t.test(
  `03.06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - double minus`,
  (t) => {
    const str = `<td align="char" char="," charoff="--2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charoff",
        idxFrom: 36,
        idxTo: 38,
        message: `Repeated minus.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 04. parent tag must have "char" attribute
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${34}m${`char on parent`}\u001b[${39}m`} - sibling attr char is missing`,
  (t) => {
    const str = `<td align="char" charoff="2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charoff": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charoff",
        idxFrom: 0,
        idxTo: 29,
        message: `Attribute "char" missing.`,
        fix: null,
      },
    ]);
    t.end();
  }
);
