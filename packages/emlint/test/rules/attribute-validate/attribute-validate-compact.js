import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no compact, error level 0`,
  (t) => {
    const str = `<dir><ul>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no compact, error level 1`,
  (t) => {
    const str = `<dir><ul>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no compact, error level 2`,
  (t) => {
    const str = `<dir><ul>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy dir`,
  (t) => {
    const str = `<dir compact>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy dl`,
  (t) => {
    const str = `<dl compact>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy menu`,
  (t) => {
    const str = `<menu compact>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.strictSame(messages, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy ol`,
  (t) => {
    const str = `<ol compact>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "07.01");
    t.strictSame(messages, [], "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy ul`,
  (t) => {
    const str = `<ul compact>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "08.01");
    t.strictSame(messages, [], "08.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div compact>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-compact",
          idxFrom: 5,
          idxTo: 12,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz class="z" compact>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-compact",
          idxFrom: 15,
          idxTo: 22,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<ul compact="true">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<ul compact>`, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-compact",
          idxFrom: 11,
          idxTo: 18,
          message: `Should have no value.`,
          fix: {
            ranges: [[11, 18]],
          },
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`,
  (t) => {
    const str = `<ul compact=true>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<ul compact>`, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-compact",
          idxFrom: 11,
          idxTo: 16,
          message: `Should have no value.`,
          fix: {
            ranges: [[11, 16]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<ul compact="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<ul compact>`, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-compact",
          idxFrom: 11,
          idxTo: 14,
          message: `Should have no value.`,
          fix: {
            ranges: [[11, 14]],
          },
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`,
  (t) => {
    const str = `<ul compact=>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<ul compact>`, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-compact",
          idxFrom: 11,
          idxTo: 12,
          message: `Should have no value.`,
          fix: {
            ranges: [[11, 12]],
          },
        },
      ],
      "14.02"
    );
    t.end();
  }
);

// 04. XHTML
// -----------------------------------------------------------------------------

tap.test(
  `15 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy compact checkbox, as HTML`,
  (t) => {
    const str = `<ul compact>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": [2, "xhtml"],
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<ul compact="compact">`, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-compact",
          idxFrom: 4,
          idxTo: 11,
          message: `It's XHTML, add value, ="compact".`,
          fix: {
            ranges: [[11, 11, `="compact"`]],
          },
        },
      ],
      "15.02"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`,
  (t) => {
    const str = `<ul compact=/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<ul compact="compact"/>`, "16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`,
  (t) => {
    const str = `<ul compact =">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": [2, "xhtml"],
      },
    });
    t.match(messages[0].fix.ranges, [[11, 14, `="compact"`]], "17.01");
    t.equal(applyFixes(str, messages), `<ul compact="compact">`, "17.02");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`,
  (t) => {
    const str = `<ul compact=""/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<ul compact="compact"/>`, "18");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`,
  (t) => {
    const str = `<ul compact=''/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<ul compact='compact'/>`, "19");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`,
  (t) => {
    const str = `<ul compact='>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<ul compact='compact'>`, "20");
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<ul compact"compact"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<ul compact="compact"/>`, "21");
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<ul compact'compact'/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-compact": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<ul compact='compact'/>`, "22");
    t.end();
  }
);
