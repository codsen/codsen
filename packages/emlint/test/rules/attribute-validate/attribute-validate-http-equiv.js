import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no http-equiv, error level 0`,
  (t) => {
    const str = `<meta>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no http-equiv, error level 1`,
  (t) => {
    const str = `<meta>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no http-equiv, error level 2`,
  (t) => {
    const str = `<meta>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, content-type`,
  (t) => {
    const str = `<meta http-equiv='content-type'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, default-style`,
  (t) => {
    const str = `<meta http-equiv="default-style">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, refresh`,
  (t) => {
    const str = `<meta http-equiv="refresh">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.strictSame(messages, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, content-type, first cap`,
  (t) => {
    const str = `<meta http-equiv="Content-Type">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "07.01");
    t.strictSame(messages, [], "07.02");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<meta http-equiv=' refresh'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<meta http-equiv='refresh'>`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-http-equiv",
          idxFrom: 18,
          idxTo: 19,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[18, 19]],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<meta http-equiv="refresh ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<meta http-equiv="refresh">`, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-http-equiv",
          idxFrom: 25,
          idxTo: 26,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[25, 26]],
          },
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<meta http-equiv='  refresh  \t'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<meta http-equiv='refresh'>`, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-http-equiv",
          idxFrom: 18,
          idxTo: 30,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [18, 20],
              [27, 30],
            ],
          },
        },
      ],
      "10.02"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<meta http-equiv="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-http-equiv",
          idxFrom: 18,
          idxTo: 21,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "11.02"
    );
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `12 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div http-equiv="refresh">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-http-equiv",
          idxFrom: 5,
          idxTo: 25,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz http-equiv="refresh">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-http-equiv",
          idxFrom: 5,
          idxTo: 25,
          fix: null,
        },
      ],
      "13.02"
    );
    t.end();
  }
);

// 04. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `14 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out of whack value`,
  (t) => {
    const str = `<meta http-equiv="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-http-equiv": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-http-equiv",
          idxFrom: 18,
          idxTo: 25,
          message: `Unrecognised value: "tralala".`,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);
