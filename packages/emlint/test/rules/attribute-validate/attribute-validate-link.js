import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no link, error level 0`,
  (t) => {
    const str = `<body>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no link, error level 1`,
  (t) => {
    const str = `<body>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no link, error level 2`,
  (t) => {
    const str = `<body>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy link`,
  (t) => {
    const str = `<body class='zz' link='#CCCCCC' id='yy aa'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
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
    const str = `<body link=" #CCCCCC">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<body link="#CCCCCC">`, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-link",
          idxFrom: 12,
          idxTo: 13,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[12, 13]],
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
    const str = `<body link="#CCCCCC ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<body link="#CCCCCC">`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-link",
          idxFrom: 19,
          idxTo: 20,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[19, 20]],
          },
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around - 6 digit hex`,
  (t) => {
    const str = `<body link="  #CCCCCC  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<body link="#CCCCCC">`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-link",
          idxFrom: 12,
          idxTo: 23,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [12, 14],
              [21, 23],
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
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around - named`,
  (t) => {
    const str = `<body link="  PeachPuff  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<body link="PeachPuff">`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-link",
          idxFrom: 12,
          idxTo: 25,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [12, 14],
              [23, 25],
            ],
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
    const str = `<body link="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-link",
          idxFrom: 12,
          idxTo: 15,
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
    const str = `<body link="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-link",
          idxFrom: 6,
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

// 03. named colors
// -----------------------------------------------------------------------------

tap.test(`11 - ${`\u001b[${35}m${`named`}\u001b[${39}m`} - healthy`, (t) => {
  const str = `<body class='zz' link='blue' id='yy aa'>`; // <-- notice single quotes
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "11.01");
  t.strictSame(messages, [], "11.02");
  t.end();
});

tap.test(
  `12 - ${`\u001b[${35}m${`named`}\u001b[${39}m`} - unrecognised`,
  (t) => {
    const str = `<body link="nearlyRed">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-link",
          idxFrom: 12,
          idxTo: 21,
          message: `Unrecognised color value.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);

// 04. hex colors
// -----------------------------------------------------------------------------

tap.test(`13 - ${`\u001b[${35}m${`hex`}\u001b[${39}m`} - unrecognised`, (t) => {
  const str = `<body link="#gg0000">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "13.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 12,
        idxTo: 19,
        message: `Unrecognised hex code.`,
        fix: null,
      },
    ],
    "13.02"
  );
  t.end();
});

tap.test(`14 - ${`\u001b[${35}m${`hex`}\u001b[${39}m`} - bad hex`, (t) => {
  const str = `<body link="#ccc">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "14.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 12,
        idxTo: 16,
        message: `Hex color code should be 6 digits-long.`,
        fix: null,
      },
    ],
    "14.02"
  );
  t.end();
});

tap.test(`15 - ${`\u001b[${35}m${`hex`}\u001b[${39}m`} - bad hex`, (t) => {
  const str = `<body link="#aaaa">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "15.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 12,
        idxTo: 17,
        message: `Hex color code should be 6 digits-long.`,
        fix: null,
      },
    ],
    "15.02"
  );
  t.end();
});

// 05. hex colors
// -----------------------------------------------------------------------------

tap.test(`16 - ${`\u001b[${35}m${`rgba`}\u001b[${39}m`} - healthy`, (t) => {
  const str = `<body link="rgb(255, 0, 153)">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "16.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 12,
        idxTo: 28,
        message: `rgb() is not allowed.`,
        fix: null,
      },
    ],
    "16.02"
  );
  t.end();
});

tap.test(`17 - ${`\u001b[${35}m${`rgba`}\u001b[${39}m`} - broken`, (t) => {
  const str = `<body link="rgb(255)">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "17.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 12,
        idxTo: 20,
        message: `rgb() is not allowed.`,
        fix: null,
      },
    ],
    "17.02"
  );
  t.end();
});

tap.test(`18 - ${`\u001b[${35}m${`rgba`}\u001b[${39}m`} - broken`, (t) => {
  const str = `<body link="rgb()">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "18.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 12,
        idxTo: 17,
        message: `rgb() is not allowed.`,
        fix: null,
      },
    ],
    "18.02"
  );
  t.end();
});
