import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no declare, error level 0`,
  (t) => {
    const str = `<object><div>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no declare, error level 1`,
  (t) => {
    const str = `<object><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no declare, error level 2`,
  (t) => {
    const str = `<object><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy object`,
  (t) => {
    const str = `<object declare>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div declare>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-declare",
          idxFrom: 5,
          idxTo: 12,
          fix: null,
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz class="z" declare>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-declare",
          idxFrom: 15,
          idxTo: 22,
          fix: null,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<object declare="true">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<object declare>`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-declare",
          idxFrom: 15,
          idxTo: 22,
          message: `Should have no value.`,
          fix: {
            ranges: [[15, 22]],
          },
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<object declare=true>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<object declare>`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-declare",
          idxFrom: 15,
          idxTo: 20,
          message: `Should have no value.`,
          fix: {
            ranges: [[15, 20]],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<object declare="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<object declare>`, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-declare",
          idxFrom: 15,
          idxTo: 18,
          message: `Should have no value.`,
          fix: {
            ranges: [[15, 18]],
          },
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`,
  (t) => {
    const str = `<object declare=>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<object declare>`, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-declare",
          idxFrom: 15,
          idxTo: 16,
          message: `Should have no value.`,
          fix: {
            ranges: [[15, 16]],
          },
        },
      ],
      "10.02"
    );
    t.end();
  }
);

// 04. XHTML
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy declare checkbox, as HTML`,
  (t) => {
    const str = `<object declare>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<object declare="declare">`, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-declare",
          idxFrom: 8,
          idxTo: 15,
          message: `It's XHTML, add value, ="declare".`,
          fix: {
            ranges: [[15, 15, `="declare"`]],
          },
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`,
  (t) => {
    const str = `<object declare=/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare="declare"/>`, "12");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`,
  (t) => {
    const str = `<object declare =">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.match(messages[0].fix.ranges, [[15, 18, `="declare"`]], "13.01");
    t.equal(applyFixes(str, messages), `<object declare="declare">`, "13.02");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`,
  (t) => {
    const str = `<object declare=""/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare="declare"/>`, "14");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`,
  (t) => {
    const str = `<object declare=''/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare='declare'/>`, "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`,
  (t) => {
    const str = `<object declare='>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare='declare'>`, "16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<object declare"declare"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare="declare"/>`, "17");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<object declare'declare'/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-declare": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<object declare='declare'/>`, "18");
    t.end();
  }
);
