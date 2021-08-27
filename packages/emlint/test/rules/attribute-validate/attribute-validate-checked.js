import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no checked, error level 0`,
  (t) => {
    const str = `<form><input>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no checked, error level 1`,
  (t) => {
    const str = `<form><input>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no checked, error level 2`,
  (t) => {
    const str = `<form><input>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy checked checkbox`,
  (t) => {
    const str = `<input type="checkbox" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy checked radio`,
  (t) => {
    const str = `<input type="radio" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy unchecked checkbox`,
  (t) => {
    const str = `<input type="checkbox">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.strictSame(messages, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy unchecked radio`,
  (t) => {
    const str = `<input type="radio">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "07.01");
    t.strictSame(messages, [], "07.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-checked",
          idxFrom: 5,
          idxTo: 12,
          fix: null,
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz class="z" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-checked",
          idxFrom: 15,
          idxTo: 22,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div type="radio" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-checked",
          idxFrom: 18,
          idxTo: 25,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz type="radio" class="z" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-checked",
          idxFrom: 28,
          idxTo: 35,
          fix: null,
        },
      ],
      "11.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `12 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<input type="radio" checked="true">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<input type="radio" checked>`, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-checked",
          idxFrom: 27,
          idxTo: 34,
          message: `Should have no value.`,
          fix: {
            ranges: [[27, 34]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<input type="radio" checked=true>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<input type="radio" checked>`, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-checked",
          idxFrom: 27,
          idxTo: 32,
          message: `Should have no value.`,
          fix: {
            ranges: [[27, 32]],
          },
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<input type="radio" checked="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<input type="radio" checked>`, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-checked",
          idxFrom: 27,
          idxTo: 30,
          message: `Should have no value.`,
          fix: {
            ranges: [[27, 30]],
          },
        },
      ],
      "14.02"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`,
  (t) => {
    const str = `<input type="radio" checked=>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<input type="radio" checked>`, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-checked",
          idxFrom: 27,
          idxTo: 28,
          message: `Should have no value.`,
          fix: {
            ranges: [[27, 28]],
          },
        },
      ],
      "15.02"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - wrong type`,
  (t) => {
    const str = `<input type="month" checked>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "16.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-checked",
          idxFrom: 13,
          idxTo: 18,
          message: `Only tags with "checkbox" or "radio" attributes can be checked.`,
          fix: null,
        },
      ],
      "16.02"
    );
    t.end();
  }
);

// 04. XHTML
// -----------------------------------------------------------------------------

tap.test(
  `17 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy checked checkbox, as HTML`,
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
      `<input type="checkbox" checked="checked">`,
      "17.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-checked",
          idxFrom: 23,
          idxTo: 30,
          message: `It's XHTML, add value, ="checked".`,
          fix: {
            ranges: [[30, 30, `="checked"`]],
          },
        },
      ],
      "17.02"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy checked radio, as HTML`,
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
      `<input type="radio" checked="checked">`,
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`,
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
      `<input type="radio" checked="checked"/>`,
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`,
  (t) => {
    const str = `<input type="radio" checked =">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-checked": [2, "xhtml"],
      },
    });
    t.match(messages[0].fix.ranges, [[27, 30, `="checked"`]], "20.01");
    t.equal(
      applyFixes(str, messages),
      `<input type="radio" checked="checked">`,
      "20.02"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`,
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
      `<input type="radio" checked="checked"/>`,
      "21"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`,
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
      `<input type="radio" checked='checked'/>`,
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`,
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
      `<input type="radio" checked='checked'>`,
      "23"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
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
      `<input type="radio" checked="checked"/>`,
      "24"
    );
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
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
      `<input type="radio" checked='checked'/>`,
      "25"
    );
    t.end();
  }
);
