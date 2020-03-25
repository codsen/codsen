const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no defer, error level 0`,
  (t) => {
    const str = `<script><div>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no defer, error level 1`,
  (t) => {
    const str = `<script><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no defer, error level 2`,
  (t) => {
    const str = `<script><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.only(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy script`,
  (t) => {
    const str = `<script defer>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": 2,
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
    const str = `<div defer>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-defer",
        idxFrom: 5,
        idxTo: 10,
        message: `Tag "div" can't have this attribute.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz defer class="yyy">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-defer",
        idxFrom: 5,
        idxTo: 10,
        message: `Tag "zzz" can't have this attribute.`,
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
    const str = `<script defer="true">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<script defer>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-defer",
        idxFrom: 13,
        idxTo: 20,
        message: `Should have no value.`,
        fix: {
          ranges: [[13, 20]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<script defer=true>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<script defer>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-defer",
        idxFrom: 13,
        idxTo: 18,
        message: `Should have no value.`,
        fix: {
          ranges: [[13, 18]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<script defer="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<script defer>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-defer",
        idxFrom: 13,
        idxTo: 16,
        message: `Should have no value.`,
        fix: {
          ranges: [[13, 16]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`,
  (t) => {
    const str = `<script defer=>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<script defer>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-defer",
        idxFrom: 13,
        idxTo: 14,
        message: `Should have no value.`,
        fix: {
          ranges: [[13, 14]],
        },
      },
    ]);
    t.end();
  }
);

// 04. XHTML
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy defer checkbox, as HTML`,
  (t) => {
    const str = `<script defer>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": [2, "xhtml"],
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<script defer="defer">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-defer",
        idxFrom: 8,
        idxTo: 13,
        message: `It's XHTML, add value, ="defer".`,
        fix: {
          ranges: [[13, 13, `="defer"`]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`,
  (t) => {
    const str = `<script defer=/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<script defer="defer"/>`);
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`,
  (t) => {
    const str = `<script defer =">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": [2, "xhtml"],
      },
    });
    t.match(messages[0].fix.ranges, [[13, 16, `="defer"`]]);
    t.equal(applyFixes(str, messages), `<script defer="defer">`);
    t.end();
  }
);

t.test(
  `04.05 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`,
  (t) => {
    const str = `<script defer=""/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<script defer="defer"/>`);
    t.end();
  }
);

t.test(
  `04.06 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`,
  (t) => {
    const str = `<script defer=''/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<script defer='defer'/>`);
    t.end();
  }
);

t.test(
  `04.07 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`,
  (t) => {
    const str = `<script defer='>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<script defer='defer'>`);
    t.end();
  }
);

t.test(
  `04.08 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<script defer"defer"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<script defer="defer"/>`);
    t.end();
  }
);

t.test(
  `04.09 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<script defer'defer'/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-defer": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<script defer='defer'/>`);
    t.end();
  }
);
