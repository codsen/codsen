import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no bgcolor, error level 0`, () => {
  let str = `<body>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no bgcolor, error level 1`, () => {
  let str = `<body>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no bgcolor, error level 2`, () => {
  let str = `<body>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy bgcolor`, () => {
  let str = `<body class='zz' bgcolor='#CCCCCC' id='yy aa'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<body bgcolor=" #CCCCCC">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  equal(applyFixes(str, messages), `<body bgcolor="#CCCCCC">`, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 15,
      idxTo: 16,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[15, 16]],
      },
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<body bgcolor="#CCCCCC ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  equal(applyFixes(str, messages), `<body bgcolor="#CCCCCC">`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 22,
      idxTo: 23,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[22, 23]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around - 6 digit hex`, () => {
  let str = `<body bgcolor="  #CCCCCC  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  equal(applyFixes(str, messages), `<body bgcolor="#CCCCCC">`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 15,
      idxTo: 26,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [15, 17],
          [24, 26],
        ],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around - named`, () => {
  let str = `<body bgcolor="  PeachPuff  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  equal(applyFixes(str, messages), `<body bgcolor="PeachPuff">`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 15,
      idxTo: 28,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [15, 17],
          [26, 28],
        ],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<body bgcolor="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 15,
      idxTo: 18,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - empty value`, () => {
  let str = `<body bgcolor="">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 6,
      idxTo: 16,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. named colors
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${`named`}\u001b[${39}m`} - healthy`, () => {
  let str = `<body class='zz' bgcolor='blue' id='yy aa'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  equal(applyFixes(str, messages), str, "11.01");
  equal(messages, [], "11.02");
});

test(`12 - ${`\u001b[${35}m${`named`}\u001b[${39}m`} - unrecognised`, () => {
  let str = `<body bgcolor="nearlyRed">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 15,
      idxTo: 24,
      message: `Unrecognised color value.`,
      fix: null,
    },
  ]);
});

// 04. hex colors
// -----------------------------------------------------------------------------

test(`13 - ${`\u001b[${35}m${`hex`}\u001b[${39}m`} - unrecognised`, () => {
  let str = `<body bgcolor="#gg0000">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 15,
      idxTo: 22,
      message: `Unrecognised hex code.`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`hex`}\u001b[${39}m`} - bad hex`, () => {
  let str = `<body bgcolor="#ccc">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 15,
      idxTo: 19,
      message: `Hex color code should be 6 digits-long.`,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${`hex`}\u001b[${39}m`} - bad hex`, () => {
  let str = `<body bgcolor="#aaaa">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 15,
      idxTo: 20,
      message: `Hex color code should be 6 digits-long.`,
      fix: null,
    },
  ]);
});

// 05. hex colors
// -----------------------------------------------------------------------------

test(`16 - ${`\u001b[${35}m${`rgba`}\u001b[${39}m`} - healthy`, () => {
  let str = `<body bgcolor="rgb(255, 0, 153)">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 15,
      idxTo: 31,
      message: `rgb() is not allowed.`,
      fix: null,
    },
  ]);
});

test(`17 - ${`\u001b[${35}m${`rgba`}\u001b[${39}m`} - broken`, () => {
  let str = `<body bgcolor="rgb(255)">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 15,
      idxTo: 23,
      message: `rgb() is not allowed.`,
      fix: null,
    },
  ]);
});

test(`18 - ${`\u001b[${35}m${`rgba`}\u001b[${39}m`} - broken`, () => {
  let str = `<body bgcolor="rgb()">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-bgcolor": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "18.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-bgcolor",
      idxFrom: 15,
      idxTo: 20,
      message: `rgb() is not allowed.`,
      fix: null,
    },
  ]);
});

test.run();
