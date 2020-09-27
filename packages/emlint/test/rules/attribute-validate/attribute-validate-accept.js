import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accept, error level 0`,
  (t) => {
    const str = `<form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accept, error level 1`,
  (t) => {
    const str = `<input>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accept, error level 2`,
  (t) => {
    const str = `<input>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, wildcard`,
  (t) => {
    const str = `<input accept='image/*'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, file extension`,
  (t) => {
    const str = `<input accept=".jpg">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, spelled out type`,
  (t) => {
    const str = `<input accept="text/css">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.strictSame(messages, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - fancy MIME from the list`,
  (t) => {
    const str = `<input accept="application/vnd.openxmlformats-officedocument.presentationml.template.main+xml">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
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
    const str = `<input accept=" .jpg">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<input accept=".jpg">`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accept",
          idxFrom: 15,
          idxTo: 16,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[15, 16]],
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
    const str = `<input accept=".jpg ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<input accept=".jpg">`, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accept",
          idxFrom: 19,
          idxTo: 20,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[19, 20]],
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
    const str = `<input accept="  .jpg \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<input accept=".jpg">`, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accept",
          idxFrom: 15,
          idxTo: 23,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [15, 17],
              [21, 23],
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
    const str = `<input accept="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accept",
          idxFrom: 15,
          idxTo: 18,
          message: `Missing value.`,
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
  `12 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - spaces after comma`,
  (t) => {
    const str = `<input accept=".jpg, .gif, .png">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<input accept=".jpg,.gif,.png">`,
      "12.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accept",
          idxFrom: 20,
          idxTo: 21,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[20, 21]],
          },
        },
        {
          ruleId: "attribute-validate-accept",
          idxFrom: 26,
          idxTo: 27,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[26, 27]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - out of whack value`,
  (t) => {
    const str = `<input accept="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accept",
          idxFrom: 15,
          idxTo: 22,
          message: `Unrecognised value: "tralala".`,
          fix: null,
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - legit string with extras`,
  (t) => {
    const str = `<input accept="..jpg">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accept",
          idxFrom: 15,
          idxTo: 20,
          message: `Unrecognised value: "..jpg".`,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);

// 04. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `15 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div accept=".jpg">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accept",
          idxFrom: 5,
          idxTo: 18,
          fix: null,
        },
      ],
      "15.02"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz accept=".jpg" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accept": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "16.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accept",
          idxFrom: 5,
          idxTo: 18,
          fix: null,
        },
      ],
      "16.02"
    );
    t.end();
  }
);
