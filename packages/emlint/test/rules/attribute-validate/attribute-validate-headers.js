import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no headers, error level 0`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no headers, error level 1`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no headers, error level 2`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy headers`,
  (t) => {
    const str = `<td headers='abc def'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<td headers=" abc">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<td headers="abc">`, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 13,
          idxTo: 14,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[13, 14]],
          },
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<td headers="abc ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<td headers="abc">`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 16,
          idxTo: 17,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[16, 17]],
          },
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - one id, copious whitespace around`,
  (t) => {
    const str = `<td headers="  abc  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<td headers="abc">`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 13,
          idxTo: 20,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [13, 15],
              [18, 20],
            ],
          },
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - many ides, copious whitespace around`,
  (t) => {
    const str = `<td headers="  abc  ha \t fl  \n  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<td headers="abc ha fl">`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 13,
          idxTo: 32,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [13, 15],
              [27, 32],
            ],
          },
        },
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 18, // report whole whitespace gap
          idxTo: 20,
          message: `Should be a single space.`,
          fix: {
            ranges: [[19, 20]], // delete only minimal amount, without insertion if possible
          },
        },
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 22,
          idxTo: 25,
          message: `Should be a single space.`,
          fix: {
            ranges: [[23, 25]], // delete only minimal amount, without insertion if possible
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<td headers="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 13,
          idxTo: 16,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<td headers="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 13,
          idxTo: 13,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

// 03. id name checks
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${35}m${`id name checks`}\u001b[${39}m`} - healthy`,
  (t) => {
    const str = `<td headers="ab cd ef">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "11.01");
    t.same(messages, [], "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`id name checks`}\u001b[${39}m`} - mix 1`,
  (t) => {
    const str = `<td headers="ab \t3a e.f">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    // can fix much:
    t.equal(applyFixes(str, messages), `<td headers="ab 3a e.f">`, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 15,
          idxTo: 17,
          message: `Should be a single space.`,
          fix: {
            ranges: [[16, 17]],
          },
        },
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 17,
          idxTo: 19,
          message: `Wrong id name.`,
          fix: null,
        },
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 20,
          idxTo: 23,
          message: `Wrong id name.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`id name checks`}\u001b[${39}m`} - starts with dot`,
  (t) => {
    const str = `<td headers=".abc">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 13,
          idxTo: 17,
          message: `Wrong id name.`,
          fix: null,
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`id name checks`}\u001b[${39}m`} - only dot`,
  (t) => {
    const str = `<td headers=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 13,
          idxTo: 14,
          message: `Wrong id name.`,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`id name checks`}\u001b[${39}m`} - only dot`,
  (t) => {
    const str = `
<td headers="aa bb cc dd">
<td headers="aa bb aa bb cc aa dd \taa">
<td headers="aa bb cc dd">
`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-headers": 2,
      },
    });
    // can fix:
    t.equal(
      applyFixes(str, messages),
      `
<td headers="aa bb cc dd">
<td headers="aa bb cc dd">
<td headers="aa bb cc dd">
`,
      "15.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 47,
          idxTo: 49,
          message: `Duplicate id "aa".`,
          fix: {
            ranges: [[47, 50]],
          },
        },
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 50,
          idxTo: 52,
          message: `Duplicate id "bb".`,
          fix: {
            ranges: [[50, 53]],
          },
        },
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 56,
          idxTo: 58,
          message: `Duplicate id "aa".`,
          fix: {
            ranges: [[56, 59]],
          },
        },
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 61,
          idxTo: 63,
          message: `Should be a single space.`,
          fix: {
            ranges: [[62, 63]],
          },
        },
        {
          ruleId: "attribute-validate-headers",
          idxFrom: 63,
          idxTo: 65,
          message: `Duplicate id "aa".`,
          fix: {
            ranges: [[61, 65]],
          },
        },
      ],
      "15.02"
    );
    t.end();
  }
);
