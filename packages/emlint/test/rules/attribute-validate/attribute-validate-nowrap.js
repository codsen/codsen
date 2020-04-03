const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no nowrap, error level 0`,
  (t) => {
    const str = `<td><img>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no nowrap, error level 1`,
  (t) => {
    const str = `<td><img>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no nowrap, error level 2`,
  (t) => {
    const str = `<td><img>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy`,
  (t) => {
    const str = `<td nowrap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": 2,
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
    const str = `<div nowrap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-nowrap",
        idxFrom: 5,
        idxTo: 11,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz nowrap class="yyy">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-nowrap",
        idxFrom: 5,
        idxTo: 11,
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
    const str = `<td nowrap="true">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<td nowrap>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-nowrap",
        idxFrom: 10,
        idxTo: 17,
        message: `Should have no value.`,
        fix: {
          ranges: [[10, 17]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<td nowrap=true>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<td nowrap>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-nowrap",
        idxFrom: 10,
        idxTo: 15,
        message: `Should have no value.`,
        fix: {
          ranges: [[10, 15]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<td nowrap="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<td nowrap>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-nowrap",
        idxFrom: 10,
        idxTo: 13,
        message: `Should have no value.`,
        fix: {
          ranges: [[10, 13]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`,
  (t) => {
    const str = `<td nowrap=>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<td nowrap>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-nowrap",
        idxFrom: 10,
        idxTo: 11,
        message: `Should have no value.`,
        fix: {
          ranges: [[10, 11]],
        },
      },
    ]);
    t.end();
  }
);

// 04. XHTML
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy nowrap checkbox, as HTML`,
  (t) => {
    const str = `<td nowrap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": [2, "xhtml"],
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<td nowrap="nowrap">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-nowrap",
        idxFrom: 4,
        idxTo: 10,
        message: `It's XHTML, add value, ="nowrap".`,
        fix: {
          ranges: [[10, 10, `="nowrap"`]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`,
  (t) => {
    const str = `<td nowrap=/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<td nowrap="nowrap"/>`);
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`,
  (t) => {
    const str = `<td nowrap =">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": [2, "xhtml"],
      },
    });
    t.match(messages[0].fix.ranges, [[10, 13, `="nowrap"`]]);
    t.equal(applyFixes(str, messages), `<td nowrap="nowrap">`);
    t.end();
  }
);

t.test(
  `04.05 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`,
  (t) => {
    const str = `<td nowrap=""/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<td nowrap="nowrap"/>`);
    t.end();
  }
);

t.test(
  `04.06 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`,
  (t) => {
    const str = `<td nowrap=''/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<td nowrap='nowrap'/>`);
    t.end();
  }
);

t.test(
  `04.07 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`,
  (t) => {
    const str = `<td nowrap='>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<td nowrap='nowrap'>`);
    t.end();
  }
);

t.test(
  `04.08 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<td nowrap"nowrap"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<td nowrap="nowrap"/>`);
    t.end();
  }
);

t.test(
  `04.09 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<td nowrap'nowrap'/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-nowrap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<td nowrap='nowrap'/>`);
    t.end();
  }
);
