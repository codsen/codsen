import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no ismap, error level 0`,
  (t) => {
    const str = `<div><img>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no ismap, error level 1`,
  (t) => {
    const str = `<div><img>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no ismap, error level 2`,
  (t) => {
    const str = `<div><img>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy img`,
  (t) => {
    const str = `<img ismap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy input`,
  (t) => {
    const str = `<input ismap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.same(messages, [], "05.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div ismap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-ismap",
          idxFrom: 5,
          idxTo: 10,
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
    const str = `<zzz ismap class="yyy">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-ismap",
          idxFrom: 5,
          idxTo: 10,
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
    const str = `<img ismap="true">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<img ismap>`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-ismap",
          idxFrom: 10,
          idxTo: 17,
          message: `Should have no value.`,
          fix: {
            ranges: [[10, 17]],
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
    const str = `<img ismap=true>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<img ismap>`, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-ismap",
          idxFrom: 10,
          idxTo: 15,
          message: `Should have no value.`,
          fix: {
            ranges: [[10, 15]],
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
    const str = `<img ismap="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<img ismap>`, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-ismap",
          idxFrom: 10,
          idxTo: 13,
          message: `Should have no value.`,
          fix: {
            ranges: [[10, 13]],
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
    const str = `<img ismap=>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), `<img ismap>`, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-ismap",
          idxFrom: 10,
          idxTo: 11,
          message: `Should have no value.`,
          fix: {
            ranges: [[10, 11]],
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
  `12 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy ismap checkbox, as HTML`,
  (t) => {
    const str = `<img ismap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": [2, "xhtml"],
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<img ismap="ismap">`, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-ismap",
          idxFrom: 5,
          idxTo: 10,
          message: `It's XHTML, add value, ="ismap".`,
          fix: {
            ranges: [[10, 10, `="ismap"`]],
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
    const str = `<img ismap=/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<img ismap="ismap"/>`, "13");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`,
  (t) => {
    const str = `<img ismap =">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": [2, "xhtml"],
      },
    });
    t.match(messages[0].fix.ranges, [[10, 13, `="ismap"`]], "14.01");
    t.equal(applyFixes(str, messages), `<img ismap="ismap">`, "14.02");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`,
  (t) => {
    const str = `<img ismap=""/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<img ismap="ismap"/>`, "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`,
  (t) => {
    const str = `<img ismap=''/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<img ismap='ismap'/>`, "16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`,
  (t) => {
    const str = `<img ismap='>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<img ismap='ismap'>`, "17");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<img ismap"ismap"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<img ismap="ismap"/>`, "18");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`,
  (t) => {
    const str = `<img ismap'ismap'/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-ismap": [2, "xhtml"],
      },
    });
    t.equal(applyFixes(str, messages), `<img ismap='ismap'/>`, "19");
    t.end();
  }
);
