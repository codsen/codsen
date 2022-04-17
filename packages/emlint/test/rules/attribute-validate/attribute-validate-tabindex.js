import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no tabindex, error level 0`, () => {
  let str = `<textarea>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no tabindex, error level 1`, () => {
  let str = `<textarea>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no tabindex, error level 2`, () => {
  let str = `<textarea>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy tabindex`, () => {
  let str = `<textarea tabindex='1'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<textarea tabindex=" 1">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  equal(applyFixes(str, messages), `<textarea tabindex="1">`, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 20,
      idxTo: 21,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[20, 21]],
      },
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<textarea tabindex="1 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  equal(applyFixes(str, messages), `<textarea tabindex="1">`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 21,
      idxTo: 22,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[21, 22]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<textarea tabindex="  9  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  equal(applyFixes(str, messages), `<textarea tabindex="9">`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 20,
      idxTo: 25,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [20, 22],
          [23, 25],
        ],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<textarea tabindex="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 20,
      idxTo: 23,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - string as value`, () => {
  let str = `<textarea tabindex="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 20,
      idxTo: 21,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - dot as value`, () => {
  let str = `<textarea tabindex=".">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 20,
      idxTo: 21,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - a rational number`, () => {
  let str = `<textarea tabindex="1.5">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 21, // <--- tabindexs at the first non-digit char
      idxTo: 23,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - with units`, () => {
  let str = `<textarea tabindex="1px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  // Can't fix because opts.customPxMessage is on.
  // A user mistakenly set pixels whereas value is a count number.
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 21, // <--- tabindexs at the first non-digit char
      idxTo: 23,
      message: `Tabbing order number should not be in pixels.`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - zero`, () => {
  let str = `<textarea tabindex="0">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  equal(applyFixes(str, messages), str, "13.01");
  equal(messages, [], "13.02");
});

test(`14 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - padded with zero, textarea`, () => {
  let str = `<textarea tabindex="01">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 20,
      idxTo: 22,
      message: `Number padded with zero.`,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - padded with zero, textarea`, () => {
  let str = `<textarea tabindex="32768">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 20,
      idxTo: 25,
      message: `Maximum, 32767 exceeded.`,
      fix: null,
    },
  ]);
});

// 04. wrong parent tag
// -----------------------------------------------------------------------------

test(`16 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div tabindex="9">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

test(`17 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz tabindex="0" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-tabindex",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

test.run();
