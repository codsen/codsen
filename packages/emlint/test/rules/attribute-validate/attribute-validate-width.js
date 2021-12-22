import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - no width`, () => {
  let str = `<table>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - width in px`, () => {
  let str = `<table width="600px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  equal(applyFixes(str, messages), `<table width="600">`, "02.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 17,
      idxTo: 19,
      message: `Remove px.`,
      fix: {
        ranges: [[17, 19]],
      },
    },
  ]);
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`03 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space in front`, () => {
  let str = `<table width=" 600">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  equal(applyFixes(str, messages), `<table width="600">`, "03.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 14,
      idxTo: 15,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[14, 15]],
      },
    },
  ]);
});

test(`04 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space after`, () => {
  let str = `<table width="600 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  equal(applyFixes(str, messages), `<table width="600">`, "04.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 17,
      idxTo: 18,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[17, 18]],
      },
    },
  ]);
});

test(`05 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<table width="  600  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  equal(applyFixes(str, messages), `<table width="600">`, "05.01");
  compare(ok, messages, [
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
  ]);
});

test(`06 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and px`, () => {
  let str = `<table width="50\tpx">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 16,
      idxTo: 19,
      message: `Rogue whitespace.`,
      fix: null,
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and %`, () => {
  let str = `<table width="50\t%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 16,
      idxTo: 18,
      message: `Rogue whitespace.`,
      fix: null,
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<table width="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 14,
      idxTo: 17,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, () => {
  let str = `<table width="px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 14,
      idxTo: 16,
      message: `Digits missing.`,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, () => {
  let str = `<table width="%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 14,
      idxTo: 15,
      message: `Digits missing.`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, () => {
  let str = `<table width="px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 14,
      idxTo: 16,
      message: `Digits missing.`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`, () => {
  let str = `<table width="6z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 15,
      idxTo: 16,
      message: `Unrecognised unit.`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`, () => {
  let str = `<table width="6 a z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 15,
      idxTo: 19,
      message: `Unrecognised unit.`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, legit unit`, () => {
  let str = `<table width="1a0%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 15,
      idxTo: 18,
      message: `Messy value.`,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, bad unit`, () => {
  let str = `<table width="1a0z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 15,
      idxTo: 18,
      message: `Messy value.`,
      fix: null,
    },
  ]);
});

test(`16 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, %`, () => {
  let str = `<table width="100%%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 17,
      idxTo: 19,
      message: `Unrecognised unit.`,
      fix: null,
    },
  ]);
});

test(`17 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, px`, () => {
  let str = `<table width="100pxpx">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 17,
      idxTo: 21,
      message: `Unrecognised unit.`,
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`18 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<br width="100">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "18.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 4,
      idxTo: 15,
      fix: null,
    },
  ]);
});

test(`19 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz width="100">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "19.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 5,
      idxTo: 16,
      fix: null,
    },
  ]);
});

// 04. values
// -----------------------------------------------------------------------------

test(`20 - ${`\u001b[${35}m${`values`}\u001b[${39}m`} - hr in ems`, () => {
  let str = `<hr width="2em">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  equal(applyFixes(str, messages), str, "20.01");
  equal(messages, [], "20.02");
});

test(`21 - ${`\u001b[${35}m${`values`}\u001b[${39}m`} - hr in relative unit`, () => {
  let str = `<hr width="1*">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  equal(applyFixes(str, messages), str, "21.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 12,
      idxTo: 13,
      message: `Unrecognised unit.`,
      fix: null,
    },
  ]);
});

test(`22 - ${`\u001b[${35}m${`values`}\u001b[${39}m`} - col in ems`, () => {
  let str = `<col width="2em">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  equal(applyFixes(str, messages), str, "22.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-validate-width",
        idxFrom: 13,
        idxTo: 15,
        message: `Bad unit.`,
        fix: null,
      },
    ],
    "22.02"
  );
});

test(`23 - ${`\u001b[${35}m${`values`}\u001b[${39}m`} - col in relative unit`, () => {
  let str = `<col width="1*">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  equal(applyFixes(str, messages), str, "23.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-validate-width",
        idxFrom: 13,
        idxTo: 14,
        message: `Unrecognised unit.`,
        fix: null,
      },
    ],
    "23.02"
  );
});

test(`24 - ${`\u001b[${35}m${`values`}\u001b[${39}m`} - pre in percentages`, () => {
  let str = `<pre width="50%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-width": 2,
    },
  });
  equal(applyFixes(str, messages), str, "24.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-width",
      idxFrom: 14,
      idxTo: 15,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test.run();
