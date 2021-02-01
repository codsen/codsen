import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no style, error level 0`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no style, error level 1`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no style, error level 2`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy style, zero`,
  (t) => {
    const str = `<td style='font-size: 10px;'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<td style=" font-size: 10px;">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;">`,
      "05.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 11,
          idxTo: 12,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[11, 12]],
          },
        },
      ],
      "05.02"
    );
    t.equal(messages.length, 1, "05.03");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<td style="font-size: 10px; ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;">`,
      "06.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 27,
          idxTo: 28,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[27, 28]],
          },
        },
      ],
      "06.02"
    );
    t.equal(messages.length, 1, "06.03");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<td style="  font-size: 10px;  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;">`,
      "07.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 11,
          idxTo: 31,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [11, 13],
              [29, 31],
            ],
          },
        },
      ],
      "07.02"
    );
    t.equal(messages.length, 1, "07.03");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - whitespace inbetween`,
  (t) => {
    const str = `<td style="font-size:  10px;"></td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;"></td>`,
      "08.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 22,
          idxTo: 23,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[22, 23]],
          },
        },
      ],
      "08.02"
    );
    t.equal(messages.length, 1, "08.03");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - tab inbetween`,
  (t) => {
    const str = `<td style="font-size:\t10px;"></td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;"></td>`,
      "09.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 21,
          idxTo: 22,
          message: `Replace whitespace.`,
          fix: {
            ranges: [[21, 22, " "]],
          },
        },
      ],
      "09.02"
    );
    t.equal(messages.length, 1, "09.03");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - tab inbetween`,
  (t) => {
    const str = `<td style="font-size:\t 10px;"></td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;"></td>`,
      "10.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 21,
          idxTo: 22,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[21, 22]],
          },
        },
      ],
      "10.02"
    );
    t.equal(messages.length, 1, "10.03");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - tab inbetween`,
  (t) => {
    const str = `<td style="font-size: \t10px;"></td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;"></td>`,
      "11.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 22,
          idxTo: 23,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[22, 23]],
          },
        },
      ],
      "11.02"
    );
    t.equal(messages.length, 1, "11.03");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<td style="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 11,
          idxTo: 14,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.equal(messages.length, 1, "12.03");
    t.end();
  }
);

// wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `13 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - wrong parent tag`,
  (t) => {
    const str = `<html style="font-size: 10px;">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 6,
          idxTo: 30,
          fix: null,
        },
      ],
      "13.02"
    );
    t.equal(messages.length, 1, "13.03");
    t.end();
  }
);

// trailing semi option
// -----------------------------------------------------------------------------

tap.test(
  `14 - ${`\u001b[${32}m${`trailing semi`}\u001b[${39}m`} - one decl - semi present`,
  (t) => {
    const str = `<td style="font-size: 10px;"></td>`;
    const linter = new Linter();

    // 1. trailing semi is bad

    const messages1 = linter.verify(str, {
      rules: {
        "attribute-validate-style": [2, "noTrailingSemi"],
      },
    });
    t.equal(
      applyFixes(str, messages1),
      `<td style="font-size: 10px"></td>`,
      "14.01"
    );
    t.match(
      messages1,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 26,
          idxTo: 27,
          message: `Delete the trailing semicolon.`,
          fix: { ranges: [[26, 27]] },
        },
      ],
      "14.02"
    );
    t.equal(messages1.length, 1, "14.03");

    // 2. trailing semi is good

    const messages2 = linter.verify(str, {
      rules: {
        "attribute-validate-style": [2],
      },
    });
    t.equal(applyFixes(str, messages2), str, "14.04");
    t.strictSame(messages2, [], "14.05");

    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${32}m${`trailing semi`}\u001b[${39}m`} - one decl - semi absent`,
  (t) => {
    const str = `<td style="font-size: 10px"></td>`;
    const linter = new Linter();

    // 1. trailing semi is bad

    const messages1 = linter.verify(str, {
      rules: {
        "attribute-validate-style": [2, "noTrailingSemi"],
      },
    });
    t.equal(applyFixes(str, messages1), str, "15.01");
    t.strictSame(messages1, [], "15.02");

    // 2. trailing semi is good

    const messages2 = linter.verify(str, {
      rules: {
        "attribute-validate-style": [2],
      },
    });
    t.equal(
      applyFixes(str, messages2),
      `<td style="font-size: 10px;"></td>`,
      "15.03"
    );
    t.match(
      messages2,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 26,
          idxTo: 26,
          message: `Add the trailing semicolon.`,
          fix: { ranges: [[26, 26, ";"]] },
        },
      ],
      "15.04"
    );
    t.equal(messages2.length, 1, "15.05");

    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${32}m${`trailing semi`}\u001b[${39}m`} - two decl - semi present`,
  (t) => {
    const str = `<td style="font-size: 10px; color: red;"></td>`;
    const linter = new Linter();

    // 1. trailing semi is bad

    const messages1 = linter.verify(str, {
      rules: {
        "attribute-validate-style": [2, "noTrailingSemi"],
      },
    });
    t.equal(
      applyFixes(str, messages1),
      `<td style="font-size: 10px; color: red"></td>`,
      "16.01"
    );
    t.match(
      messages1,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 38,
          idxTo: 39,
          message: `Delete the trailing semicolon.`,
          fix: { ranges: [[38, 39]] },
        },
      ],
      "16.02"
    );
    t.equal(messages1.length, 1, "16.03");

    // 2. trailing semi is good

    const messages2 = linter.verify(str, {
      rules: {
        "attribute-validate-style": [2],
      },
    });
    t.equal(applyFixes(str, messages2), str, "16.04");
    t.strictSame(messages2, [], "16.05");

    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${32}m${`trailing semi`}\u001b[${39}m`} - two decl - semi absent`,
  (t) => {
    const str = `<td style="font-size: 10px; color: red"></td>`;
    const linter = new Linter();

    // 1. trailing semi is bad

    const messages1 = linter.verify(str, {
      rules: {
        "attribute-validate-style": [2, "noTrailingSemi"],
      },
    });
    t.equal(applyFixes(str, messages1), str, "17.01");
    t.strictSame(messages1, [], "17.02");

    // 2. trailing semi is good

    const messages2 = linter.verify(str, {
      rules: {
        "attribute-validate-style": [2],
      },
    });
    t.equal(
      applyFixes(str, messages2),
      `<td style="font-size: 10px; color: red;"></td>`,
      "17.03"
    );
    t.match(
      messages2,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 38,
          idxTo: 38,
          message: `Add the trailing semicolon.`,
          fix: { ranges: [[38, 38, ";"]] },
        },
      ],
      "17.04"
    );
    t.equal(messages2.length, 1, "17.05");

    t.end();
  }
);

// space after colon
// -----------------------------------------------------------------------------

tap.test(
  `18 - ${`\u001b[${35}m${`space after colon`}\u001b[${39}m`} - one tag`,
  (t) => {
    const str = `<td style="font-size:10px;"></td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;"></td>`,
      "18.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 21,
          idxTo: 21,
          message: `Add a space.`,
          fix: { ranges: [[21, 21, " "]] },
        },
      ],
      "18.02"
    );
    t.equal(messages.length, 1, "18.03");
    t.end();
  }
);
