import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no maxlength, error level 0`, () => {
  let str = `<input>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no maxlength, error level 1`, () => {
  let str = `<input>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no maxlength, error level 2`, () => {
  let str = `<input>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy maxlength, zero`, () => {
  let str = `<input maxlength='0'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy maxlength, non-zero`, () => {
  let str = `<input maxlength="3">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<input maxlength=" 0">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  equal(applyFixes(str, messages), `<input maxlength="0">`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-maxlength",
      idxFrom: 18,
      idxTo: 19,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[18, 19]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<input maxlength="0 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  equal(applyFixes(str, messages), `<input maxlength="0">`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-maxlength",
      idxFrom: 19,
      idxTo: 20,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[19, 20]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<input maxlength="  0  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  equal(applyFixes(str, messages), `<input maxlength="0">`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-maxlength",
      idxFrom: 18,
      idxTo: 23,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [18, 20],
          [21, 23],
        ],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<input maxlength="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-maxlength",
      idxFrom: 18,
      idxTo: 21,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - string as value`, () => {
  let str = `<input maxlength="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-maxlength",
      idxFrom: 18,
      idxTo: 19,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - dot as value`, () => {
  let str = `<input maxlength=".">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-maxlength",
      idxFrom: 18,
      idxTo: 19,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - a rational number`, () => {
  let str = `<input maxlength="1.5">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-maxlength",
      idxFrom: 19, // <--- starts at the first non-digit char
      idxTo: 21,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - with units`, () => {
  let str = `<input maxlength="1px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), `<input maxlength="1">`, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-maxlength",
      idxFrom: 19, // <--- starts at the first non-digit char
      idxTo: 21,
      message: `Remove px.`,
      fix: {
        ranges: [[19, 21]],
      },
    },
  ]);
});

// 04. wrong parent tag
// -----------------------------------------------------------------------------

test(`14 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div maxlength="0">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-maxlength",
      idxFrom: 5,
      idxTo: 18,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz maxlength="0" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-maxlength": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-maxlength",
      idxFrom: 5,
      idxTo: 18,
      fix: null,
    },
  ]);
});

test.run();
