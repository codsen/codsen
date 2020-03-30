const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no checked, error level 0`,
  (t) => {
    const str = `<form><input>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no checked, error level 1`,
  (t) => {
    const str = `<form><input>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no checked, error level 2`,
  (t) => {
    const str = `<form><input>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy checked checkbox`,
  (t) => {
    const str = `<input type="checkbox" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy checked radio`,
  (t) => {
    const str = `<input type="radio" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy unchecked checkbox`,
  (t) => {
    const str = `<input type="checkbox">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy unchecked radio`,
  (t) => {
    const str = `<input type="radio">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
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
    const str = `<div checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-checked",
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
    const str = `<zzz class="z" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-checked",
        idxFrom: 15,
        idxTo: 22,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div type="radio" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-checked",
        idxFrom: 18,
        idxTo: 25,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz type="radio" class="z" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-checked",
        idxFrom: 28,
        idxTo: 35,
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
    const str = `<input type="radio" checked="true">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<input type="radio" checked>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-checked",
        idxFrom: 27,
        idxTo: 34,
        message: `Should have no value.`,
        fix: {
          ranges: [[27, 34]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<input type="radio" checked=true>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<input type="radio" checked>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-checked",
        idxFrom: 27,
        idxTo: 32,
        message: `Should have no value.`,
        fix: {
          ranges: [[27, 32]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<input type="radio" checked="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<input type="radio" checked>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-checked",
        idxFrom: 27,
        idxTo: 30,
        message: `Should have no value.`,
        fix: {
          ranges: [[27, 30]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`,
  (t) => {
    const str = `<input type="radio" checked=>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<input type="radio" checked>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-checked",
        idxFrom: 27,
        idxTo: 28,
        message: `Should have no value.`,
        fix: {
          ranges: [[27, 28]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - wrong type`,
  (t) => {
    const str = `<input type="month" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-checked",
        idxFrom: 13,
        idxTo: 18,
        message: `Only tags with "checkbox" or "radio" attributes can be checked.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 04. XHTML
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy checked checkbox, as HTML`,
  (t) => {
    const str = `<input type="checkbox" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": [2, "xhtml"],
      },
    });
    // can fix:
    t.equal(
      applyFixes(str, messages),
      `<input type="checkbox" checked="checked">`
    );
    t.match(messages, [
      {
        ruleId: "attribute-validate-checked",
        idxFrom: 23,
        idxTo: 30,
        message: `It's XHTML, add value, ="checked".`,
        fix: {
          ranges: [[30, 30, `="checked"`]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy checked radio, as HTML`,
  (t) => {
    const str = `<input type="radio" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": [2, "xhtml"],
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<input type="radio" checked="checked">`
    );
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`,
  (t) => {
    const str = `<input type="radio" checked=/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": [2, "xhtml"],
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<input type="radio" checked="checked"/>`
    );
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`,
  (t) => {
    const str = `<input type="radio" checked =">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": [2, "xhtml"],
      },
    });
    t.match(messages[0].fix.ranges, [[27, 30, `="checked"`]]);
    t.equal(
      applyFixes(str, messages),
      `<input type="radio" checked="checked">`
    );
    t.end();
  }
);

t.test(
  `04.05 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`,
  (t) => {
    const str = `<input type="radio" checked=""/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": [2, "xhtml"],
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<input type="radio" checked="checked"/>`
    );
    t.end();
  }
);

t.test(
  `04.06 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`,
  (t) => {
    const str = `<input type="radio" checked=''/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": [2, "xhtml"],
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<input type="radio" checked='checked'/>`
    );
    t.end();
  }
);

t.test(
  `04.07 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`,
  (t) => {
    const str = `<input type="radio" checked='>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": [2, "xhtml"],
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<input type="radio" checked='checked'>`
    );
    t.end();
  }
);

t.test(
  `04.08 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<input type="radio" checked"checked"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": [2, "xhtml"],
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<input type="radio" checked="checked"/>`
    );
    t.end();
  }
);

t.test(
  `04.09 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<input type="radio" checked'checked'/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": [2, "xhtml"],
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<input type="radio" checked='checked'/>`
    );
    t.end();
  }
);
