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
  let str = `<td>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - no width`, () => {
  let str = `<th height="10">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - width in px`, () => {
  let str = `<object height="10px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<object height="10">`, "03.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 18,
      idxTo: 20,
      message: `Remove px.`,
      fix: {
        ranges: [[18, 20]],
      },
    },
  ]);
});

test(`04 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - width in rem`, () => {
  let str = `<iframe height="10rem">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "04.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 18,
      idxTo: 21,
      message: `Should be "pixels|%".`,
      fix: null,
    },
  ]);
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space in front`, () => {
  let str = `<td height=" 600">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  equal(applyFixes(str, messages), `<td height="600">`, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 12,
      idxTo: 13,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[12, 13]],
      },
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space after`, () => {
  let str = `<td height="600 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  equal(applyFixes(str, messages), `<td height="600">`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 15,
      idxTo: 16,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[15, 16]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<td height="  600  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  equal(applyFixes(str, messages), `<td height="600">`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 12,
      idxTo: 20,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [12, 14],
          [17, 20],
        ],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and px`, () => {
  let str = `<td height="50\tpx">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 14,
      idxTo: 17,
      message: `Should be "pixels|%".`,
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and %`, () => {
  let str = `<td height="50\t%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 14,
      idxTo: 16,
      message: `Rogue whitespace.`,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<td height="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 12,
      idxTo: 15,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, () => {
  let str = `<td height="%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 12,
      idxTo: 13,
      message: `Should be "pixels|%".`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, () => {
  let str = `<td height="px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 12,
      idxTo: 14,
      message: `Should be "pixels|%".`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`, () => {
  let str = `<td height="6z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 13,
      idxTo: 14,
      message: `Should be "pixels|%".`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`, () => {
  let str = `<td height="6 a z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 13,
      idxTo: 17,
      message: `Should be "pixels|%".`,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, legit unit`, () => {
  let str = `<td height="1a0%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 13,
      idxTo: 16,
      message: `Should be "pixels|%".`,
      fix: null,
    },
  ]);
});

test(`16 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, bad unit`, () => {
  let str = `<td height="1a0z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 13,
      idxTo: 16,
      message: `Should be "pixels|%".`,
      fix: null,
    },
  ]);
});

test(`17 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, %`, () => {
  let str = `<td height="100%%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 15,
      idxTo: 17,
      message: `Should be "pixels|%".`,
      fix: null,
    },
  ]);
});

test(`18 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, px`, () => {
  let str = `<td height="100pxpx">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "18.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 15,
      idxTo: 19,
      message: `Should be "pixels|%".`,
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`19 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div height="100">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "19.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

test(`20 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz height="100">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-height": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "20.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-height",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

test.run();
