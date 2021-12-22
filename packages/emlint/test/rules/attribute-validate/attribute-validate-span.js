import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no span, error level 0`, () => {
  let str = `<col>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no span, error level 1`, () => {
  let str = `<col>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no span, error level 2`, () => {
  let str = `<col>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy span, zero`, () => {
  let str = `<col span='1'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy span, non-zero`, () => {
  let str = `<colgroup span="3">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<col span=" 1">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  equal(applyFixes(str, messages), `<col span="1">`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 11,
      idxTo: 12,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[11, 12]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<col span="1 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  equal(applyFixes(str, messages), `<col span="1">`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 12,
      idxTo: 13,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[12, 13]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<col span="  1  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  equal(applyFixes(str, messages), `<col span="1">`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 11,
      idxTo: 16,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [11, 13],
          [14, 16],
        ],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<col span="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 11,
      idxTo: 14,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - string as value`, () => {
  let str = `<col span="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 11,
      idxTo: 12,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - dot as value`, () => {
  let str = `<col span=".">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 11,
      idxTo: 12,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - a rational number`, () => {
  let str = `<col span="1.5">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 12, // <--- starts at the first non-digit char
      idxTo: 14,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - with units`, () => {
  let str = `<col span="1px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // Can't fix because opts.customPxMessage is on.
  // A user mistakenly set pixels whereas value is a count number.
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 12, // <--- starts at the first non-digit char
      idxTo: 14,
      message: `Columns number is not in pixels.`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - zero`, () => {
  let str = `<col span="0">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 11,
      idxTo: 12,
      message: `Zero not allowed.`,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - padded with zero, col`, () => {
  let str = `<col span="01">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 11,
      idxTo: 13,
      message: `Number padded with zero.`,
      fix: null,
    },
  ]);
});

test(`16 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - padded with zero, colgroup`, () => {
  let str = `<colgroup span="01">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 16,
      idxTo: 18,
      message: `Number padded with zero.`,
      fix: null,
    },
  ]);
});

// 04. wrong parent tag
// -----------------------------------------------------------------------------

test(`17 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div span="0">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 5,
      idxTo: 13,
      fix: null,
    },
  ]);
});

test(`18 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz span="0" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "18.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-span",
      idxFrom: 5,
      idxTo: 13,
      fix: null,
    },
  ]);
});

test.run();
