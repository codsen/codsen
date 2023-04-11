import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no rows, error level 0`, () => {
  let str = "<frameset><textarea><div>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no rows, error level 1`, () => {
  let str = "<frameset><textarea><div>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no rows, error level 2`, () => {
  let str = "<frameset><textarea><div>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = '<frameset rows="23%,*,45%">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = '<textarea rows="4" rows="50">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div rows="50">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 5,
      idxTo: 14,
      fix: null,
    },
  ]);
});

test(`07 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz rows="50" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 5,
      idxTo: 14,
      fix: null,
    },
  ]);
});

// 03. frameset
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - right value, single px value, no units`, () => {
  let str = '<frameset rows="100">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "08.01");
  equal(messages, [], "08.02");
});

test(`09 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - right value, single px value, with units`, () => {
  let str = '<frameset rows="100px">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), '<frameset rows="100">', "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 19,
      idxTo: 21,
      message: "Remove px.",
      fix: {
        ranges: [[19, 21]],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - right value, perc, one`, () => {
  let str = '<frameset rows="100%">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "10.01");
  equal(messages, [], "10.02");
});

test(`11 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - right value, perc, two`, () => {
  let str = '<frameset rows="50.5%,49.5%">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "11.01");
  equal(messages, [], "11.02");
});

test(`12 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - right value, perc, two`, () => {
  let str = '<frameset rows="50%, 50%">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), '<frameset rows="50%,50%">', "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 20,
      idxTo: 21,
      message: "Remove whitespace.",
      fix: {
        ranges: [[20, 21]],
      },
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - asterisk`, () => {
  let str = '<frameset rows="*">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "13.01");
  equal(messages, [], "13.02");
});

test(`14 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - value and asterisk`, () => {
  let str = '<frameset rows="30%,*,20%">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "14.01");
  equal(messages, [], "14.02");
});

test(`15 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - mixed`, () => {
  let str = '<frameset rows="30,*,20%">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "15.01");
  equal(messages, [], "15.02");
});

test(`16 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - one wrong value`, () => {
  let str = '<frameset rows="zzz">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 16,
      idxTo: 19,
      message: "Should be: pixels|%|*.",
      fix: null,
    },
  ]);
});

test(`17 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - one wrong value`, () => {
  let str = '<frameset rows="*,zzz">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 18,
      idxTo: 21,
      message: "Should be: pixels|%|*.",
      fix: null,
    },
  ]);
});

test(`18 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - one wrong value`, () => {
  let str = '<frameset rows="*,zzz,100">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "18.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 18,
      idxTo: 21,
      message: "Should be: pixels|%|*.",
      fix: null,
    },
  ]);
});

test(`19 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - two wrong values, with whitespace`, () => {
  let str = '<frameset rows=" *, zzz ,100,  ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  // can't fix all but will fix some:
  equal(applyFixes(str, messages), '<frameset rows="*,zzz,100">', "19.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 16,
      idxTo: 31,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [16, 17],
          [29, 31],
        ],
      },
    },
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 19,
      idxTo: 20,
      message: "Remove whitespace.",
      fix: {
        ranges: [[19, 20]],
      },
    },
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 20,
      idxTo: 23,
      message: "Should be: pixels|%|*.",
      fix: null,
    },
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 23,
      idxTo: 24,
      message: "Remove whitespace.",
      fix: {
        ranges: [[23, 24]],
      },
    },
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 28,
      idxTo: 29,
      message: "Remove separator.",
      fix: {
        ranges: [[28, 29]],
      },
    },
  ]);
});

test(`20 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - one wrong value`, () => {
  let str = '<frameset rows="9rem">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "20.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 17,
      idxTo: 20,
      message: "Should be: pixels|%|*.",
      fix: null,
    },
  ]);
});

test(`21 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - two asterisks`, () => {
  let str = '<frameset rows="**">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "21.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 16,
      idxTo: 18,
      message: "Should be: pixels|%|*.",
      fix: null,
    },
  ]);
});

test(`22 - ${`\u001b[${35}m${"frameset"}\u001b[${39}m`} - two asterisks`, () => {
  let str = '<frameset rows="******">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "22.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 16,
      idxTo: 22,
      message: "Should be: pixels|%|*.",
      fix: null,
    },
  ]);
});

// 04. textarea
// -----------------------------------------------------------------------------

test("23 - right value", () => {
  let str = '<textarea rows="0">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "23.01");
  equal(messages, [], "23.02");
});

test("24 - right value", () => {
  let str = '<textarea rows="10">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "24.01");
  equal(messages, [], "24.02");
});

test("25 - right value, whitespace", () => {
  let str = '<textarea rows=" 10 ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), '<textarea rows="10">', "25.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 16,
      idxTo: 20,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [16, 17],
          [19, 20],
        ],
      },
    },
  ]);
});

test("26 - units", () => {
  let str = '<textarea rows="100%">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "26.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 19,
      idxTo: 20,
      message: "Should be integer, no units.",
      fix: null,
    },
  ]);
});

test("27 - units", () => {
  let str = '<textarea rows="z">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "27.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 16,
      idxTo: 17,
      message: "Should be integer, no units.",
      fix: null,
    },
  ]);
});

test("28 - missing value", () => {
  let str = '<textarea rows="">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "28.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 10,
      idxTo: 17,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

test("29 - rational number", () => {
  let str = '<textarea rows="1.5">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "29.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 17,
      idxTo: 19,
      message: "Should be integer, no units.",
      fix: null,
    },
  ]);
});

test("30 - rational number", () => {
  let str = '<textarea rows="1rem">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "30.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 17,
      idxTo: 20,
      message: "Should be integer, no units.",
      fix: null,
    },
  ]);
});

test("31 - negative number", () => {
  let str = '<textarea rows="-1">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  equal(applyFixes(str, messages), str, "31.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rows",
      idxFrom: 16,
      idxTo: 18,
      message: "Should be integer, no units.",
      fix: null,
    },
  ]);
});

test.run();
