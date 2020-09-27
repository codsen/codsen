import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no type, error level 0`,
  (t) => {
    const str = `<a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no type, error level 1`,
  (t) => {
    const str = `<a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no type, error level 2`,
  (t) => {
    const str = `<a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, a`,
  (t) => {
    const str = `<a type='application/json'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - fancy MIME from the list`,
  (t) => {
    const str = `<a type="application/vnd.openxmlformats-officedocument.presentationml.template.main+xml">`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, input`,
  (t) => {
    const str = `<input type="password">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.strictSame(messages, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, li`,
  (t) => {
    const str = `<li type="disc">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "07.01");
    t.strictSame(messages, [], "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, ol`,
  (t) => {
    const str = `<ol type="1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "08.01");
    t.strictSame(messages, [], "08.02");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, ul`,
  (t) => {
    const str = `<ul type="square">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "09.01");
    t.strictSame(messages, [], "09.02");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, button`,
  (t) => {
    const str = `<button type="reset">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "10.01");
    t.strictSame(messages, [], "10.02");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<a type=" application/json">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a type="application/json">`, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 9,
          idxTo: 10,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[9, 10]],
          },
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<a type="application/json ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a type="application/json">`, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 25,
          idxTo: 26,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[25, 26]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<a type="  application/json \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a type="application/json">`, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 9,
          idxTo: 29,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [9, 11],
              [27, 29],
            ],
          },
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<a type="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 9,
          idxTo: 12,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `15 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, a`,
  (t) => {
    const str = `<a type="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 9,
          idxTo: 16,
          message: `Unrecognised value: "tralala".`,
          fix: null,
        },
      ],
      "15.02"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, input`,
  (t) => {
    const str = `<input type="circle">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "16.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 13,
          idxTo: 19,
          message: `Unrecognised value: "circle".`,
          fix: null,
        },
      ],
      "16.02"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, li`,
  (t) => {
    const str = `<li type="text">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "17.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 10,
          idxTo: 14,
          message: `Unrecognised value: "text".`,
          fix: null,
        },
      ],
      "17.02"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, ol`,
  (t) => {
    const str = `<ol type="text">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "18.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 10,
          idxTo: 14,
          message: `Should be "1|a|A|i|I".`,
          fix: null,
        },
      ],
      "18.02"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, ul`,
  (t) => {
    const str = `<ul type="text">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "19.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 10,
          idxTo: 14,
          message: `Should be "disc|square|circle".`,
          fix: null,
        },
      ],
      "19.02"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, button`,
  (t) => {
    const str = `<button type="circle">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "20.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 14,
          idxTo: 20,
          message: `Should be "button|submit|reset".`,
          fix: null,
        },
      ],
      "20.02"
    );
    t.end();
  }
);

// 04. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `21 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div type="application/json">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "21.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 5,
          idxTo: 28,
          fix: null,
        },
      ],
      "21.02"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz type="application/json" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-type": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "22.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-type",
          idxFrom: 5,
          idxTo: 28,
          fix: null,
        },
      ],
      "22.02"
    );
    t.end();
  }
);
