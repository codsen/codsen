import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no background, error level 0`,
  (t) => {
    const str = `<body class="z"><div id="u">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no background, error level 1`,
  (t) => {
    const str = `<body class="z"><div id="u">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no background, error level 2`,
  (t) => {
    const str = `<body class="z"><div id="u">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<body background='https://codsen.com/bg.png'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

// tap.test(
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

tap.test(
  `05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div background='https://codsen.com/spacer.gif'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-background",
          idxFrom: 5,
          idxTo: 47,
          fix: null,
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz background="https://codsen.com/spacer.gif" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-background",
          idxFrom: 5,
          idxTo: 47,
          fix: null,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${35}m${`wrong value`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<body background="zz.">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-background",
          idxFrom: 18,
          idxTo: 21,
          message: `Should be an URI.`,
          fix: null,
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`wrong value`}\u001b[${39}m`} - still catches whitespace on legit URL`,
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
      `<body background="https://codsen.com/spacer.gif">`,
      "08.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-background",
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
  `09 - ${`\u001b[${34}m${`wrong value`}\u001b[${39}m`} - not-a-URL and whitespace`,
  (t) => {
    const str = `<body background=" zz. ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<body background="zz.">`, "09.01");
    t.match(
      messages,
      [
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
      ],
      "09.02"
    );
    t.end();
  }
);

// 04. opts.localOK - allows local file paths
// -----------------------------------------------------------------------------

tap.test(
  `10 - ${`\u001b[${35}m${`opts.localOK`}\u001b[${39}m`} - baseline - rule off`,
  (t) => {
    const str = `<body background="spacer.gif">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(messages, [], "10.02");
    t.end();
  }
);

// tap.test(
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

tap.test(
  `11 - ${`\u001b[${35}m${`opts.localOK`}\u001b[${39}m`} - opts.localOK`,
  (t) => {
    const str = `<body background="spacer.gif">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": [2, "localOK"],
      },
    });
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(messages, [], "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`opts.localOK`}\u001b[${39}m`} - opts.localOK, dot missing`,
  (t) => {
    const str = `<body background="spacergif.">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-background": [2, "localOK"],
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-background",
          idxFrom: 18,
          idxTo: 28,
          message: `Should be an URI.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);
