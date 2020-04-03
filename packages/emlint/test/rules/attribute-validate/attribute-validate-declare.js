const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no declare, error level 0`,
  (t) => {
    const str = `<object><div>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no declare, error level 1`,
  (t) => {
    const str = `<object><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no declare, error level 2`,
  (t) => {
    const str = `<object><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy object`,
  (t) => {
    const str = `<object declare>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
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
    const str = `<div declare>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-declare",
        idxFrom: 5,
        idxTo: 12,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz class="z" declare>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-declare",
        idxFrom: 15,
        idxTo: 22,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<object declare="true">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<object declare>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-declare",
        idxFrom: 15,
        idxTo: 22,
        message: `Should have no value.`,
        fix: {
          ranges: [[15, 22]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<object declare=true>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<object declare>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-declare",
        idxFrom: 15,
        idxTo: 20,
        message: `Should have no value.`,
        fix: {
          ranges: [[15, 20]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<object declare="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<object declare>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-declare",
        idxFrom: 15,
        idxTo: 18,
        message: `Should have no value.`,
        fix: {
          ranges: [[15, 18]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`,
  (t) => {
    const str = `<object declare=>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<object declare>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-declare",
        idxFrom: 15,
        idxTo: 16,
        message: `Should have no value.`,
        fix: {
          ranges: [[15, 16]],
        },
      },
    ]);
    t.end();
  }
);

// 04. XHTML
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy declare checkbox, as HTML`,
  (t) => {
    const str = `<object declare>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<object declare="declare">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-declare",
        idxFrom: 8,
        idxTo: 15,
        message: `It's XHTML, add value, ="declare".`,
        fix: {
          ranges: [[15, 15, `="declare"`]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`,
  (t) => {
    const str = `<object declare=/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare="declare"/>`);
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`,
  (t) => {
    const str = `<object declare =">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.match(messages[0].fix.ranges, [[15, 18, `="declare"`]]);
    t.equal(applyFixes(str, messages), `<object declare="declare">`);
    t.end();
  }
);

t.test(
  `04.05 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`,
  (t) => {
    const str = `<object declare=""/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare="declare"/>`);
    t.end();
  }
);

t.test(
  `04.06 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`,
  (t) => {
    const str = `<object declare=''/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare='declare'/>`);
    t.end();
  }
);

t.test(
  `04.07 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`,
  (t) => {
    const str = `<object declare='>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare='declare'>`);
    t.end();
  }
);

t.test(
  `04.08 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<object declare"declare"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare="declare"/>`);
    t.end();
  }
);

t.test(
  `04.09 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<object declare'declare'/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare='declare'/>`);
    t.end();
  }
);
