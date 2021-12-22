import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";

import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no size, error level 0`, () => {
  ["hr", "font", "input", "basefont", "select"].forEach((tagName) => {
    let str = `<${tagName}>`;
    let linter = new Linter();
    let messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 0,
      },
    });
    equal(applyFixes(str, messages), str);
    equal(messages, []);
  });
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no size, error level 1`, () => {
  ["hr", "font", "input", "basefont", "select"].forEach((tagName) => {
    let str = `<${tagName}>`;
    let linter = new Linter();
    let messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 1,
      },
    });
    equal(applyFixes(str, messages), str);
    equal(messages, []);
  });
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no size, error level 2`, () => {
  ["hr", "font", "input", "basefont", "select"].forEach((tagName) => {
    let str = `<${tagName}>`;
    let linter = new Linter();
    let messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    equal(applyFixes(str, messages), str);
    equal(messages, []);
  });
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<hr size=" 1">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), `<hr size="1">`, "04.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 10,
      idxTo: 11,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[10, 11]],
      },
    },
  ]);
});

test(`05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<hr size="7 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), `<hr size="7">`, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 11,
      idxTo: 12,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[11, 12]],
      },
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<hr size="  6  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), `<hr size="6">`, "06.01");
  compare(ok, messages, [
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
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<hr size="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 10,
      idxTo: 13,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div size="1">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 5,
      idxTo: 13,
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz size="0" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 5,
      idxTo: 13,
      fix: null,
    },
  ]);
});

// 04. hr
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - string as value`, () => {
  let str = `<hr size="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 10,
      idxTo: 11,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - dot as value`, () => {
  let str = `<hr size=".">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 10,
      idxTo: 11,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - a rational number`, () => {
  let str = `<hr size="1.5">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 11,
      idxTo: 13,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - with units`, () => {
  let str = `<hr size="1px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), `<hr size="1">`, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 11,
      idxTo: 13,
      message: `Remove px.`,
      fix: {
        ranges: [[11, 13]],
      },
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - zero`, () => {
  let str = `<hr size="0">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), str, "14.01");
  equal(messages, [], "14.02");
});

test(`15 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - value like font's with plus`, () => {
  let str = `<hr size="+2">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 10,
      idxTo: 12,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

// 05. font
// -----------------------------------------------------------------------------

test(`16 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - healthy font`, () => {
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
    let str = `<font size="${value}">`;
    let linter = new Linter();
    let messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2,
      },
    });
    equal(applyFixes(str, messages), str);
    equal(messages, []);
  });
});

test(`17 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - string as value`, () => {
  let str = `<font size="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 12,
      idxTo: 13,
      message: `Should be integer 1-7, plus/minus are optional.`,
      fix: null,
    },
  ]);
});

test(`18 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - dot as value`, () => {
  let str = `<font size=".">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "18.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 12,
      idxTo: 13,
      message: `Should be integer 1-7, plus/minus are optional.`,
      fix: null,
    },
  ]);
});

test(`19 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - a rational number`, () => {
  let str = `<font size="1.5">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "19.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 13,
      idxTo: 15,
      message: `Should be integer 1-7, plus/minus are optional.`,
      fix: null,
    },
  ]);
});

test(`20 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - with units`, () => {
  let str = `<font size="1px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), `<font size="1">`, "20.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 13,
      idxTo: 15,
      message: `Remove px.`,
      fix: {
        ranges: [[13, 15]],
      },
    },
  ]);
});

test(`21 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - zero`, () => {
  let str = `<font size="0">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), str, "21.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 12,
        idxTo: 13,
        message: "Should be integer 1-7, plus/minus are optional.",
      },
    ],
    "21.02"
  );
});

test(`22 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - eight`, () => {
  let str = `<font size="8">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "22.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 12,
      idxTo: 13,
      message: `Should be integer 1-7, plus/minus are optional.`,
      fix: null,
    },
  ]);
});

test(`23 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - eight`, () => {
  let str = `<font size="+8">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "23.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 12,
      idxTo: 14,
      message: `Should be integer 1-7, plus/minus are optional.`,
      fix: null,
    },
  ]);
});

test(`24 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - eight`, () => {
  let str = `<font size="-8">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "24.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 12,
      idxTo: 14,
      message: `Should be integer 1-7, plus/minus are optional.`,
      fix: null,
    },
  ]);
});

test(`25 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - 99`, () => {
  let str = `<font size="99">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "25.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 12,
      idxTo: 14,
      message: `Should be integer 1-7, plus/minus are optional.`,
      fix: null,
    },
  ]);
});

test(`26 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - repeated plus`, () => {
  let str = `<font size="++2">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "26.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 12,
      idxTo: 15,
      message: `Repeated plus.`,
      fix: null,
    },
  ]);
});

test(`27 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - repeated plus`, () => {
  let str = `<font size="- --2">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "27.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 12,
      idxTo: 17,
      message: `Repeated minus.`,
      fix: null,
    },
  ]);
});

test(`28 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - plus-space-legit digit`, () => {
  let str = `<font size="+\t2">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "28.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 12,
      idxTo: 15,
      message: `Should be integer 1-7, plus/minus are optional.`,
      fix: null,
    },
  ]);
});

test(`29 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - plus-space-bad digit`, () => {
  let str = `<font size="+\t99">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "29.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 12,
      idxTo: 16,
      message: `Should be integer 1-7, plus/minus are optional.`,
      fix: null,
    },
  ]);
});

test(`30 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - basefont - plus-space-bad digit`, () => {
  let str = `<basefont size="+\t99">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "30.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 16,
      idxTo: 20,
      message: `Should be integer 1-7, plus/minus are optional.`,
      fix: null,
    },
  ]);
});

// 06. input
// -----------------------------------------------------------------------------

test(`31 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - string as value`, () => {
  let str = `<input size="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "31.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 13,
      idxTo: 14,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`32 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - dot as value`, () => {
  let str = `<input size=".">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "32.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 13,
      idxTo: 14,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`33 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - a rational number`, () => {
  let str = `<input size="1.5">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "33.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 14,
      idxTo: 16,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`34 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - with units`, () => {
  let str = `<input size="1px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), `<input size="1">`, "34.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 14,
      idxTo: 16,
      message: `Remove px.`,
      fix: {
        ranges: [[14, 16]],
      },
    },
  ]);
});

test(`35 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - zero`, () => {
  let str = `<input size="0">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), str, "35.01");
  equal(messages, [], "35.02");
});

test(`36 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - value like font's with plus`, () => {
  let str = `<input size="+2">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), str, "36.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 13,
      idxTo: 15,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`37 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - select - string as value`, () => {
  let str = `<select size="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "37.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 14,
      idxTo: 15,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`38 - ${`\u001b[${35}m${`value - input`}\u001b[${39}m`} - select - with units`, () => {
  let str = `<select size="1px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2,
    },
  });
  equal(applyFixes(str, messages), `<select size="1">`, "38.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 15,
      idxTo: 17,
      message: `Remove px.`,
      fix: {
        ranges: [[15, 17]],
      },
    },
  ]);
});

test.run();
