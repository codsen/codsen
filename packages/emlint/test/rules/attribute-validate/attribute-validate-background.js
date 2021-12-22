import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";

import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no background, error level 0`, () => {
  let str = `<body class="z"><div id="u">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no background, error level 1`, () => {
  let str = `<body class="z"><div id="u">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no background, error level 2`, () => {
  let str = `<body class="z"><div id="u">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<body background='https://codsen.com/bg.png'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// test(
//   `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
//   t => {
//     const str = `<body class="background" background="bg.png">`;
//     const linter = new Linter();
//     const messages = linter.verify(str, {
//       rules: {
//         "attribute-validate-background": [2, "localOK"]
//       }
//     });
//     equal(applyFixes(str, messages), str);
//     equal(messages, []);
//
//   }
// );

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div background='https://codsen.com/spacer.gif'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-background",
      idxFrom: 5,
      idxTo: 47,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz background="https://codsen.com/spacer.gif" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-background",
      idxFrom: 5,
      idxTo: 47,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${`wrong value`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<body background="zz.">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-background",
      idxFrom: 18,
      idxTo: 21,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`08 - ${`\u001b[${34}m${`wrong value`}\u001b[${39}m`} - still catches whitespace on legit URL`, () => {
  let str = `<body background=" https://codsen.com/spacer.gif">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    `<body background="https://codsen.com/spacer.gif">`
  );
  compare(ok, messages, [
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
});

test(`09 - ${`\u001b[${34}m${`wrong value`}\u001b[${39}m`} - not-a-URL and whitespace`, () => {
  let str = `<body background=" zz. ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": 2,
    },
  });
  equal(applyFixes(str, messages), `<body background="zz.">`, "09.01");
  compare(ok, messages, [
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
});

// 04. opts.localOK - allows local file paths
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${`opts.localOK`}\u001b[${39}m`} - baseline - rule off`, () => {
  let str = `<body background="spacer.gif">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": 0,
    },
  });
  equal(applyFixes(str, messages), str, "10.01");
  equal(messages, [], "10.02");
});

// test(
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
//     equal(applyFixes(str, messages), str);
//     compare(ok, messages, [
//       {
//         ruleId: "attribute-validate-background",
//         idxFrom: 18,
//         idxTo: 28,
//         message: `Should be an URI.`,
//         fix: null
//       }
//     ]);
//
//   }
// );

test(`11 - ${`\u001b[${35}m${`opts.localOK`}\u001b[${39}m`} - opts.localOK`, () => {
  let str = `<body background="spacer.gif">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": [2, "localOK"],
    },
  });
  equal(applyFixes(str, messages), str, "11.01");
  equal(messages, [], "11.02");
});

test(`12 - ${`\u001b[${35}m${`opts.localOK`}\u001b[${39}m`} - opts.localOK, dot missing`, () => {
  let str = `<body background="spacergif.">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-background": [2, "localOK"],
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-background",
      idxFrom: 18,
      idxTo: 28,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test.run();
