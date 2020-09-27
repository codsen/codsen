import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no size, error level 0`,
  (t) => {
    ["hr", "font", "input", "basefont", "select"].forEach((tagName) => {
      const str = `<${tagName}>`;
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-size": 0,
        },
      });
      t.equal(applyFixes(str, messages), str);
      t.strictSame(messages, []);
    });
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no size, error level 1`,
  (t) => {
    ["hr", "font", "input", "basefont", "select"].forEach((tagName) => {
      const str = `<${tagName}>`;
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-size": 1,
        },
      });
      t.equal(applyFixes(str, messages), str);
      t.strictSame(messages, []);
    });
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no size, error level 2`,
  (t) => {
    ["hr", "font", "input", "basefont", "select"].forEach((tagName) => {
      const str = `<${tagName}>`;
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-size": 2,
        },
      });
      t.equal(applyFixes(str, messages), str);
      t.strictSame(messages, []);
    });
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<hr size=" 1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<hr size="1">`, "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 10,
          idxTo: 11,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[10, 11]],
          },
        },
      ],
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<hr size="7 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<hr size="7">`, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
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
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<hr size="  6  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<hr size="6">`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 10,
          idxTo: 15,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [10, 12],
              [13, 15],
            ],
          },
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<hr size="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 10,
          idxTo: 13,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "07.02"
    );
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div size="1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 5,
          idxTo: 13,
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
    const str = `<zzz size="0" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 5,
          idxTo: 13,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

// 04. hr
// -----------------------------------------------------------------------------

tap.test(
  `10 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - string as value`,
  (t) => {
    const str = `<hr size="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 10,
          idxTo: 11,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - dot as value`,
  (t) => {
    const str = `<hr size=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 10,
          idxTo: 11,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - a rational number`,
  (t) => {
    const str = `<hr size="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 11,
          idxTo: 13,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - with units`,
  (t) => {
    const str = `<hr size="1px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<hr size="1">`, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 11,
          idxTo: 13,
          message: `Remove px.`,
          fix: {
            ranges: [[11, 13]],
          },
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(`14 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - zero`, (t) => {
  const str = `<hr size="0">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "14.01");
  t.match(messages, [], "14.02");
  t.end();
});

tap.test(
  `15 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - value like font's with plus`,
  (t) => {
    const str = `<hr size="+2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 10,
          idxTo: 12,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "15.02"
    );
    t.end();
  }
);

// 05. font
// -----------------------------------------------------------------------------

tap.test(
  `16 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - healthy font`,
  (t) => {
    [
      "1",
      "-1",
      "+1",
      "2",
      "-2",
      "+2",
      "3",
      "-3",
      "+3",
      "4",
      "-4",
      "+4",
      "5",
      "-5",
      "+5",
      "6",
      "-6",
      "+6",
      "7",
      "-7",
      "+7",
    ].forEach((value) => {
      const str = `<font size="${value}">`;
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-size": 2,
        },
      });
      t.equal(applyFixes(str, messages), str);
      t.strictSame(messages, []);
    });
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - string as value`,
  (t) => {
    const str = `<font size="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "17.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 12,
          idxTo: 13,
          message: `Should be integer 1-7, plus/minus are optional.`,
          fix: null,
        },
      ],
      "17.02"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - dot as value`,
  (t) => {
    const str = `<font size=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "18.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 12,
          idxTo: 13,
          message: `Should be integer 1-7, plus/minus are optional.`,
          fix: null,
        },
      ],
      "18.02"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - a rational number`,
  (t) => {
    const str = `<font size="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "19.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 13,
          idxTo: 15,
          message: `Should be integer 1-7, plus/minus are optional.`,
          fix: null,
        },
      ],
      "19.02"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - with units`,
  (t) => {
    const str = `<font size="1px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<font size="1">`, "20.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 13,
          idxTo: 15,
          message: `Remove px.`,
          fix: {
            ranges: [[13, 15]],
          },
        },
      ],
      "20.02"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - zero`,
  (t) => {
    const str = `<font size="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "21.01");
    t.match(messages, [], "21.02");
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - eight`,
  (t) => {
    const str = `<font size="8">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "22.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 12,
          idxTo: 13,
          message: `Should be integer 1-7, plus/minus are optional.`,
          fix: null,
        },
      ],
      "22.02"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - eight`,
  (t) => {
    const str = `<font size="+8">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "23.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 12,
          idxTo: 14,
          message: `Should be integer 1-7, plus/minus are optional.`,
          fix: null,
        },
      ],
      "23.02"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - eight`,
  (t) => {
    const str = `<font size="-8">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "24.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 12,
          idxTo: 14,
          message: `Should be integer 1-7, plus/minus are optional.`,
          fix: null,
        },
      ],
      "24.02"
    );
    t.end();
  }
);

tap.test(`25 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - 99`, (t) => {
  const str = `<font size="99">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "25.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 12,
        idxTo: 14,
        message: `Should be integer 1-7, plus/minus are optional.`,
        fix: null,
      },
    ],
    "25.02"
  );
  t.end();
});

tap.test(
  `26 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - repeated plus`,
  (t) => {
    const str = `<font size="++2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "26.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 12,
          idxTo: 15,
          message: `Repeated plus.`,
          fix: null,
        },
      ],
      "26.02"
    );
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - repeated plus`,
  (t) => {
    const str = `<font size="- --2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "27.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 12,
          idxTo: 17,
          message: `Repeated minus.`,
          fix: null,
        },
      ],
      "27.02"
    );
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - plus-space-legit digit`,
  (t) => {
    const str = `<font size="+\t2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "28.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 12,
          idxTo: 15,
          message: `Should be integer 1-7, plus/minus are optional.`,
          fix: null,
        },
      ],
      "28.02"
    );
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - plus-space-bad digit`,
  (t) => {
    const str = `<font size="+\t99">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "29.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 12,
          idxTo: 16,
          message: `Should be integer 1-7, plus/minus are optional.`,
          fix: null,
        },
      ],
      "29.02"
    );
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - basefont - plus-space-bad digit`,
  (t) => {
    const str = `<basefont size="+\t99">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "30.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 16,
          idxTo: 20,
          message: `Should be integer 1-7, plus/minus are optional.`,
          fix: null,
        },
      ],
      "30.02"
    );
    t.end();
  }
);

// 06. input
// -----------------------------------------------------------------------------

tap.test(
  `31 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - string as value`,
  (t) => {
    const str = `<input size="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "31.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 13,
          idxTo: 14,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "31.02"
    );
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - dot as value`,
  (t) => {
    const str = `<input size=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "32.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 13,
          idxTo: 14,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "32.02"
    );
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - a rational number`,
  (t) => {
    const str = `<input size="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "33.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 14,
          idxTo: 16,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "33.02"
    );
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - with units`,
  (t) => {
    const str = `<input size="1px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<input size="1">`, "34.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 14,
          idxTo: 16,
          message: `Remove px.`,
          fix: {
            ranges: [[14, 16]],
          },
        },
      ],
      "34.02"
    );
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - zero`,
  (t) => {
    const str = `<input size="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "35.01");
    t.match(messages, [], "35.02");
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - value like font's with plus`,
  (t) => {
    const str = `<input size="+2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "36.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 13,
          idxTo: 15,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "36.02"
    );
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - select - string as value`,
  (t) => {
    const str = `<select size="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "37.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 14,
          idxTo: 15,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "37.02"
    );
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - select - with units`,
  (t) => {
    const str = `<select size="1px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<select size="1">`, "38.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-size",
          idxFrom: 15,
          idxTo: 17,
          message: `Remove px.`,
          fix: {
            ranges: [[15, 17]],
          },
        },
      ],
      "38.02"
    );
    t.end();
  }
);
