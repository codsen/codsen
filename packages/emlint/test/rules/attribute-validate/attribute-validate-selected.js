import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no selected, error level 0`,
  (t) => {
    const str = `<option><img>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no selected, error level 1`,
  (t) => {
    const str = `<option><img>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no selected, error level 2`,
  (t) => {
    const str = `<option><img>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy`,
  (t) => {
    const str = `<option selected>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div selected>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-selected",
          idxFrom: 5,
          idxTo: 13,
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
    const str = `<zzz selected class="yyy">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-selected",
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

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<option selected="true">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<option selected>`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-selected",
          idxFrom: 16,
          idxTo: 23,
          message: `Should have no value.`,
          fix: {
            ranges: [[16, 23]],
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
    const str = `<option selected=true>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<option selected>`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-selected",
          idxFrom: 16,
          idxTo: 21,
          message: `Should have no value.`,
          fix: {
            ranges: [[16, 21]],
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
    const str = `<option selected="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<option selected>`, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-selected",
          idxFrom: 16,
          idxTo: 19,
          message: `Should have no value.`,
          fix: {
            ranges: [[16, 19]],
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
    const str = `<option selected=>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<option selected>`, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-selected",
          idxFrom: 16,
          idxTo: 17,
          message: `Should have no value.`,
          fix: {
            ranges: [[16, 17]],
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
  `11 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy selected checkbox, as HTML`,
  (t) => {
    const str = `<option selected>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": [2, "xhtml"],
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<option selected="selected">`, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-selected",
          idxFrom: 8,
          idxTo: 16,
          message: `It's XHTML, add value, ="selected".`,
          fix: {
            ranges: [[16, 16, `="selected"`]],
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
    const str = `<option selected=/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<option selected="selected"/>`, "12");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`,
  (t) => {
    const str = `<option selected =">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": [2, "xhtml"],
      },
    });
    t.match(messages[0].fix.ranges, [[16, 19, `="selected"`]], "13.01");
    t.equal(applyFixes(str, messages), `<option selected="selected">`, "13.02");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`,
  (t) => {
    const str = `<option selected=""/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<option selected="selected"/>`, "14");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`,
  (t) => {
    const str = `<option selected=''/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<option selected='selected'/>`, "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`,
  (t) => {
    const str = `<option selected='>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<option selected='selected'>`, "16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<option selected"selected"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<option selected="selected"/>`, "17");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<option selected'selected'/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-selected": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<option selected='selected'/>`, "18");
    t.end();
  }
);
