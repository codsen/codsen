import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - no width`,
  (t) => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - width in px`,
  (t) => {
    const str = `<table width="600px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table width="600">`, "02.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 17,
          idxTo: 19,
          message: `Remove px.`,
          fix: {
            ranges: [[17, 19]],
          },
        },
      ],
      "02.02"
    );
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `03 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<table width=" 600">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table width="600">`, "03.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 14,
          idxTo: 15,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[14, 15]],
          },
        },
      ],
      "03.02"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<table width="600 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table width="600">`, "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 17,
          idxTo: 18,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[17, 18]],
          },
        },
      ],
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<table width="  600  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table width="600">`, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 14,
          idxTo: 21,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [14, 16],
              [19, 21],
            ],
          },
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and px`,
  (t) => {
    const str = `<table width="50\tpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 16,
          idxTo: 19,
          message: `Rogue whitespace.`,
          fix: null,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and %`,
  (t) => {
    const str = `<table width="50\t%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 16,
          idxTo: 18,
          message: `Rogue whitespace.`,
          fix: null,
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<table width="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 14,
          idxTo: 17,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(`09 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, (t) => {
  const str = `<table width="px">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "09.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-width",
        idxFrom: 14,
        idxTo: 16,
        message: `Digits missing.`,
        fix: null,
      },
    ],
    "09.02"
  );
  t.end();
});

tap.test(`10 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, (t) => {
  const str = `<table width="%">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "10.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-width",
        idxFrom: 14,
        idxTo: 15,
        message: `Digits missing.`,
        fix: null,
      },
    ],
    "10.02"
  );
  t.end();
});

tap.test(`11 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, (t) => {
  const str = `<table width="px">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "11.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-width",
        idxFrom: 14,
        idxTo: 16,
        message: `Digits missing.`,
        fix: null,
      },
    ],
    "11.02"
  );
  t.end();
});

tap.test(
  `12 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  (t) => {
    const str = `<table width="6z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 15,
          idxTo: 16,
          message: `Unrecognised unit.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  (t) => {
    const str = `<table width="6 a z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 15,
          idxTo: 19,
          message: `Unrecognised unit.`,
          fix: null,
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, legit unit`,
  (t) => {
    const str = `<table width="1a0%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 15,
          idxTo: 18,
          message: `Messy value.`,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, bad unit`,
  (t) => {
    const str = `<table width="1a0z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 15,
          idxTo: 18,
          message: `Messy value.`,
          fix: null,
        },
      ],
      "15.02"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, %`,
  (t) => {
    const str = `<table width="100%%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "16.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 17,
          idxTo: 19,
          message: `Unrecognised unit.`,
          fix: null,
        },
      ],
      "16.02"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, px`,
  (t) => {
    const str = `<table width="100pxpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "17.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 17,
          idxTo: 21,
          message: `Unrecognised unit.`,
          fix: null,
        },
      ],
      "17.02"
    );
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `18 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<br width="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "18.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 4,
          idxTo: 15,
          fix: null,
        },
      ],
      "18.02"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz width="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "19.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 5,
          idxTo: 16,
          fix: null,
        },
      ],
      "19.02"
    );
    t.end();
  }
);

// 04. values
// -----------------------------------------------------------------------------

tap.test(`20 - ${`\u001b[${35}m${`values`}\u001b[${39}m`} - hr in ems`, (t) => {
  const str = `<hr width="2em">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "20.01");
  t.match(messages, [], "20.02");
  t.end();
});

tap.test(
  `21 - ${`\u001b[${35}m${`values`}\u001b[${39}m`} - hr in relative unit`,
  (t) => {
    const str = `<hr width="1*">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "21.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 12,
          idxTo: 13,
          message: `Unrecognised unit.`,
          fix: null,
        },
      ],
      "21.02"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${35}m${`values`}\u001b[${39}m`} - col in ems`,
  (t) => {
    const str = `<col width="2em">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "22.01");
    t.match(messages, [], "22.02");
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${35}m${`values`}\u001b[${39}m`} - col in relative unit`,
  (t) => {
    const str = `<col width="1*">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "23.01");
    t.match(messages, [], "23.02");
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${35}m${`values`}\u001b[${39}m`} - pre in percentages`,
  (t) => {
    const str = `<pre width="50%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-width": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "24.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-width",
          idxFrom: 14,
          idxTo: 15,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "24.02"
    );
    t.end();
  }
);
