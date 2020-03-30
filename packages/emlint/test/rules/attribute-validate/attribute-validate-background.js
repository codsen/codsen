const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no background, error level 0`,
  (t) => {
    const str = `<body class="z"><div id="u">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no background, error level 1`,
  (t) => {
    const str = `<body class="z"><div id="u">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no background, error level 2`,
  (t) => {
    const str = `<body class="z"><div id="u">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<body background='https://codsen.com/bg.png'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// t.test(
//   `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
//   t => {
//     const str = `<body class="background" background="bg.png">`;
//     const linter = new Linter();
//     const messages = linter.verify(str, {
//       rules: {
//         "attribute-validate-background": [2, "localOK"]
//       }
//     });
//     t.equal(applyFixes(str, messages), str);
//     t.same(messages, []);
//     t.end();
//   }
// );

// 02. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div background='https://codsen.com/spacer.gif'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-background",
        idxFrom: 5,
        idxTo: 47,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz background="https://codsen.com/spacer.gif" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-background",
        idxFrom: 5,
        idxTo: 47,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`wrong value`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<body background="zz.">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-background",
        idxFrom: 18,
        idxTo: 21,
        message: `Should be an URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${34}m${`wrong value`}\u001b[${39}m`} - still catches whitespace on legit URL`,
  (t) => {
    const str = `<body background=" https://codsen.com/spacer.gif">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<body background="https://codsen.com/spacer.gif">`
    );
    t.match(messages, [
      {
        ruleId: "attribute-validate-background",
        idxFrom: 18,
        idxTo: 19,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[18, 19]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${34}m${`wrong value`}\u001b[${39}m`} - not-a-URL and whitespace`,
  (t) => {
    const str = `<body background=" zz. ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<body background="zz.">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-background",
        idxFrom: 18,
        idxTo: 23,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [18, 19],
            [22, 23],
          ],
        },
      },
      {
        ruleId: "attribute-validate-background",
        idxFrom: 19,
        idxTo: 22,
        message: `Should be an URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 04. opts.localOK - allows local file paths
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`opts.localOK`}\u001b[${39}m`} - baseline - rule off`,
  (t) => {
    const str = `<body background="spacer.gif">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, []);
    t.end();
  }
);

// t.test(
//   `04.02 - ${`\u001b[${35}m${`opts.localOK`}\u001b[${39}m`} - baseline - local path will yield and error`,
//   t => {
//     const str = `<body background="spacer.gif">`;
//     const linter = new Linter();
//     const messages = linter.verify(str, {
//       rules: {
//         "attribute-validate-background": 2
//       }
//     });
//     // can't fix:
//     t.equal(applyFixes(str, messages), str);
//     t.match(messages, [
//       {
//         ruleId: "attribute-validate-background",
//         idxFrom: 18,
//         idxTo: 28,
//         message: `Should be an URI.`,
//         fix: null
//       }
//     ]);
//     t.end();
//   }
// );

t.test(
  `04.03 - ${`\u001b[${35}m${`opts.localOK`}\u001b[${39}m`} - opts.localOK`,
  (t) => {
    const str = `<body background="spacer.gif">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": [2, "localOK"],
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, []);
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${35}m${`opts.localOK`}\u001b[${39}m`} - opts.localOK, dot missing`,
  (t) => {
    const str = `<body background="spacergif.">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": [2, "localOK"],
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-background",
        idxFrom: 18,
        idxTo: 28,
        message: `Should be an URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);
