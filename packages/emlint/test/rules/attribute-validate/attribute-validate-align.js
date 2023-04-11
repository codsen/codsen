import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no align, error level 0`, () => {
  let str = "<table>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no align, error level 1`, () => {
  let str = "<table>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no align, error level 2`, () => {
  let str = "<table>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, wildcard`, () => {
  let str = "<table align='left'>"; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space in front`, () => {
  let str = '<table align=" left">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  equal(applyFixes(str, messages), '<table align="left">', "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 14,
      idxTo: 15,
      message: "Remove whitespace.",
      fix: {
        ranges: [[14, 15]],
      },
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space after`, () => {
  let str = '<table align="left ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  equal(applyFixes(str, messages), '<table align="left">', "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 18,
      idxTo: 19,
      message: "Remove whitespace.",
      fix: {
        ranges: [[18, 19]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = '<table align="   left  \t ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  equal(applyFixes(str, messages), '<table align="left">', "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 14,
      idxTo: 25,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [14, 17],
          [21, 25],
        ],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = '<table align="  \t">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 14,
      idxTo: 17,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<span align=".jpg">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 6,
      idxTo: 18,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz align=".jpg" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

// 04. wrong value - legend/caption
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${"legend/caption"}\u001b[${39}m`} - out of whack value`, () => {
  let str = '<legend align="tralala">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 15,
      idxTo: 22,
      message: 'Should be "top|bottom|left|right".',
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${"legend/caption"}\u001b[${39}m`} - legit string with extras`, () => {
  let str = '<caption align="top,">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 16,
      idxTo: 20,
      message: 'Should be "top|bottom|left|right".',
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${"legend/caption"}\u001b[${39}m`} - wrong value, middle`, () => {
  let str = '<legend align="middle">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 15,
      idxTo: 21,
      message: 'Should be "top|bottom|left|right".',
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${"legend/caption"}\u001b[${39}m`} - good value`, () => {
  let str = '<table class="zz" id="yy" align=\'left\' valign="xx">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  equal(applyFixes(str, messages), str, "14.01");
  equal(messages, [], "14.02");
});

// 05. wrong value - img
// -----------------------------------------------------------------------------

test(`15 - ${`\u001b[${35}m${"img"}\u001b[${39}m`} - out of whack value`, () => {
  let str = '<img align="tralala">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 12,
      idxTo: 19,
      message: 'Should be "top|middle|bottom|left|right".',
      fix: null,
    },
  ]);
});

test(`16 - ${`\u001b[${35}m${"img"}\u001b[${39}m`} - legit string with extras`, () => {
  let str = '<img align="top,">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 12,
      idxTo: 16,
      message: 'Should be "top|middle|bottom|left|right".',
      fix: null,
    },
  ]);
});

test(`17 - ${`\u001b[${35}m${"img"}\u001b[${39}m`} - wrong value, justify`, () => {
  let str = '<img align="justify">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 12,
      idxTo: 19,
      message: 'Should be "top|middle|bottom|left|right".',
      fix: null,
    },
  ]);
});

test(`18 - ${`\u001b[${35}m${"img"}\u001b[${39}m`} - good value`, () => {
  let str = '<img id="yy" align=\'bottom\' class="zz">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  equal(applyFixes(str, messages), str, "18.01");
  equal(messages, [], "18.02");
});

// 06. wrong value - table
// -----------------------------------------------------------------------------

test(`19 - ${`\u001b[${35}m${"table"}\u001b[${39}m`} - out of whack value`, () => {
  let str = '<table align="tralala">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "19.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 14,
      idxTo: 21,
      message: 'Should be "left|center|right".',
      fix: null,
    },
  ]);
});

test(`20 - ${`\u001b[${35}m${"table"}\u001b[${39}m`} - legit string with extras`, () => {
  let str = '<table align="left,">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "20.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 14,
      idxTo: 19,
      message: 'Should be "left|center|right".',
      fix: null,
    },
  ]);
});

test(`21 - ${`\u001b[${35}m${"table"}\u001b[${39}m`} - wrong value, top`, () => {
  let str = '<table align="top">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "21.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 14,
      idxTo: 17,
      message: 'Should be "left|center|right".',
      fix: null,
    },
  ]);
});

test(`22 - ${`\u001b[${35}m${"table"}\u001b[${39}m`} - good value`, () => {
  let str = "<table id='yy' align='left' class='zz'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  equal(applyFixes(str, messages), str, "22.01");
  equal(messages, [], "22.02");
});

// 07. wrong value - div
// -----------------------------------------------------------------------------

test(`23 - ${`\u001b[${35}m${"div"}\u001b[${39}m`} - out of whack value`, () => {
  let str = '<div align="tralala">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "23.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 12,
      idxTo: 19,
      message: 'Should be "left|center|right|justify".',
      fix: null,
    },
  ]);
});

test(`24 - ${`\u001b[${35}m${"div"}\u001b[${39}m`} - legit string with extras`, () => {
  let str = '<div align="left,">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "24.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 12,
      idxTo: 17,
      message: 'Should be "left|center|right|justify".',
      fix: null,
    },
  ]);
});

test(`25 - ${`\u001b[${35}m${"div"}\u001b[${39}m`} - wrong value, top`, () => {
  let str = '<div align="top">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "25.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 12,
      idxTo: 15,
      message: 'Should be "left|center|right|justify".',
      fix: null,
    },
  ]);
});

test(`26 - ${`\u001b[${35}m${"div"}\u001b[${39}m`} - good value`, () => {
  let str = "<div id='yy' align='left' class='zz'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  equal(applyFixes(str, messages), str, "26.01");
  equal(messages, [], "26.02");
});

// 08. wrong value - td
// -----------------------------------------------------------------------------

test(`27 - ${`\u001b[${35}m${"td"}\u001b[${39}m`} - out of whack value`, () => {
  let str = '<td align="tralala">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "27.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 11,
      idxTo: 18,
      message: 'Should be "left|center|right|justify|char".',
      fix: null,
    },
  ]);
});

test(`28 - ${`\u001b[${35}m${"td"}\u001b[${39}m`} - legit string with extras`, () => {
  let str = '<td class="zz" align="left," id=\'yy\'>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "28.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 22,
      idxTo: 27,
      message: 'Should be "left|center|right|justify|char".',
      fix: null,
    },
  ]);
});

test(`29 - ${`\u001b[${35}m${"td"}\u001b[${39}m`} - wrong value, top`, () => {
  let str = '<td align="top">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "29.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-align",
      idxFrom: 11,
      idxTo: 14,
      message: 'Should be "left|center|right|justify|char".',
      fix: null,
    },
  ]);
});

test(`30 - ${`\u001b[${35}m${"td"}\u001b[${39}m`} - good value`, () => {
  let str = "<td id='yy' align='left' class='zz'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2,
    },
  });
  equal(applyFixes(str, messages), str, "30.01");
  equal(messages, [], "30.02");
});

test.run();
