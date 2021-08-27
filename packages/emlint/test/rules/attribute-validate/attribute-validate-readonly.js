import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no readonly, error level 0`,
  (t) => {
    const str = `<input><img>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no readonly, error level 1`,
  (t) => {
    const str = `<input><img>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no readonly, error level 2`,
  (t) => {
    const str = `<input><img>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy, input`,
  (t) => {
    const str = `<input readonly>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy, textarea`,
  (t) => {
    const str = `<textarea readonly>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div readonly>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-readonly",
          idxFrom: 5,
          idxTo: 13,
          fix: null,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz readonly class="yyy">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-readonly",
          idxFrom: 5,
          idxTo: 13,
          fix: null,
        },
      ],
      "07.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<input readonly="true">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<input readonly>`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-readonly",
          idxFrom: 15,
          idxTo: 22,
          message: `Should have no value.`,
          fix: {
            ranges: [[15, 22]],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<input readonly=true>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<input readonly>`, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-readonly",
          idxFrom: 15,
          idxTo: 20,
          message: `Should have no value.`,
          fix: {
            ranges: [[15, 20]],
          },
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<input readonly="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<input readonly>`, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-readonly",
          idxFrom: 15,
          idxTo: 18,
          message: `Should have no value.`,
          fix: {
            ranges: [[15, 18]],
          },
        },
      ],
      "10.02"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`,
  (t) => {
    const str = `<input readonly=>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<input readonly>`, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-readonly",
          idxFrom: 15,
          idxTo: 16,
          message: `Should have no value.`,
          fix: {
            ranges: [[15, 16]],
          },
        },
      ],
      "11.02"
    );
    t.end();
  }
);

// 04. XHTML
// -----------------------------------------------------------------------------

tap.test(
  `12 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy readonly checkbox, as HTML`,
  (t) => {
    const str = `<input readonly>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": [2, "xhtml"],
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<input readonly="readonly">`, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-readonly",
          idxFrom: 7,
          idxTo: 15,
          message: `It's XHTML, add value, ="readonly".`,
          fix: {
            ranges: [[15, 15, `="readonly"`]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`,
  (t) => {
    const str = `<input readonly=/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<input readonly="readonly"/>`, "13");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`,
  (t) => {
    const str = `<input readonly =">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": [2, "xhtml"],
      },
    });
    t.match(messages[0].fix.ranges, [[15, 18, `="readonly"`]], "14.01");
    t.equal(applyFixes(str, messages), `<input readonly="readonly">`, "14.02");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`,
  (t) => {
    const str = `<input readonly=""/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<input readonly="readonly"/>`, "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`,
  (t) => {
    const str = `<input readonly=''/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<input readonly='readonly'/>`, "16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`,
  (t) => {
    const str = `<input readonly='>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<input readonly='readonly'>`, "17");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<input readonly"readonly"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<input readonly="readonly"/>`, "18");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<input readonly'readonly'/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-readonly": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<input readonly='readonly'/>`, "19");
    t.end();
  }
);
