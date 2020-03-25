const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no link, error level 0`,
  (t) => {
    const str = `<body>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no link, error level 1`,
  (t) => {
    const str = `<body>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no link, error level 2`,
  (t) => {
    const str = `<body>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy link`,
  (t) => {
    const str = `<body class='zz' link='#CCCCCC' id='yy aa'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<body link=" #CCCCCC">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<body link="#CCCCCC">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 12,
        idxTo: 13,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[12, 13]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<body link="#CCCCCC ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<body link="#CCCCCC">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 19,
        idxTo: 20,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[19, 20]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around - 6 digit hex`,
  (t) => {
    const str = `<body link="  #CCCCCC  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<body link="#CCCCCC">`);
    t.match(messages, [
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
    ]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around - named`,
  (t) => {
    const str = `<body link="  PeachPuff  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<body link="PeachPuff">`);
    t.match(messages, [
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
    ]);
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<body link="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 12,
        idxTo: 15,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<body link="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 12,
        idxTo: 12,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. named colors
// -----------------------------------------------------------------------------

t.test(`03.01 - ${`\u001b[${35}m${`named`}\u001b[${39}m`} - healthy`, (t) => {
  const str = `<body class='zz' link='blue' id='yy aa'>`; // <-- notice single quotes
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

t.test(
  `03.02 - ${`\u001b[${35}m${`named`}\u001b[${39}m`} - unrecognised`,
  (t) => {
    const str = `<body link="nearlyRed">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 12,
        idxTo: 21,
        message: `Unrecognised color value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 04. hex colors
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`hex`}\u001b[${39}m`} - unrecognised`,
  (t) => {
    const str = `<body link="#gg0000">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-link": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-link",
        idxFrom: 12,
        idxTo: 19,
        message: `Unrecognised hex code.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(`04.02 - ${`\u001b[${35}m${`hex`}\u001b[${39}m`} - bad hex`, (t) => {
  const str = `<body link="#ccc">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-link",
      idxFrom: 12,
      idxTo: 16,
      message: `Hex color code should be 6 digits-long.`,
      fix: null,
    },
  ]);
  t.end();
});

t.test(`04.03 - ${`\u001b[${35}m${`hex`}\u001b[${39}m`} - bad hex`, (t) => {
  const str = `<body link="#aaaa">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-link",
      idxFrom: 12,
      idxTo: 17,
      message: `Hex color code should be 6 digits-long.`,
      fix: null,
    },
  ]);
  t.end();
});

// 05. hex colors
// -----------------------------------------------------------------------------

t.test(`05.01 - ${`\u001b[${35}m${`rgba`}\u001b[${39}m`} - healthy`, (t) => {
  const str = `<body link="rgb(255, 0, 153)">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-link",
      idxFrom: 12,
      idxTo: 28,
      message: `rgb() is not allowed.`,
      fix: null,
    },
  ]);
  t.end();
});

t.test(`05.02 - ${`\u001b[${35}m${`rgba`}\u001b[${39}m`} - broken`, (t) => {
  const str = `<body link="rgb(255)">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-link",
      idxFrom: 12,
      idxTo: 20,
      message: `rgb() is not allowed.`,
      fix: null,
    },
  ]);
  t.end();
});

t.test(`05.03 - ${`\u001b[${35}m${`rgba`}\u001b[${39}m`} - broken`, (t) => {
  const str = `<body link="rgb()">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-link": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-link",
      idxFrom: 12,
      idxTo: 17,
      message: `rgb() is not allowed.`,
      fix: null,
    },
  ]);
  t.end();
});
