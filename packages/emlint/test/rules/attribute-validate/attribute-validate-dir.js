import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no dir, error level 0`, () => {
  let str = `<table>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-dir": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no dir, error level 1`, () => {
  let str = `<table>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-dir": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no dir, error level 2`, () => {
  let str = `<table>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-dir": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, wildcard`, () => {
  let str = `<td dir='rtl'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-dir": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<td dir=' rtl'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-dir": 2,
    },
  });
  equal(applyFixes(str, messages), `<td dir='rtl'>`, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-dir",
      idxFrom: 9,
      idxTo: 10,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[9, 10]],
      },
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<td dir='rtl '>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-dir": 2,
    },
  });
  equal(applyFixes(str, messages), `<td dir='rtl'>`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-dir",
      idxFrom: 12,
      idxTo: 13,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[12, 13]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<td dir='  rtl  \t'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-dir": 2,
    },
  });
  equal(applyFixes(str, messages), `<td dir='rtl'>`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-dir",
      idxFrom: 9,
      idxTo: 17,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [9, 11],
          [14, 17],
        ],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<td dir="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-dir": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-dir",
      idxFrom: 9,
      idxTo: 12,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<script dir="ltr">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-dir": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-dir",
      idxFrom: 8,
      idxTo: 17,
      fix: null,
    },
  ]);
});

// 04. wrong value
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out of whack value`, () => {
  let str = `<td dir="tralala">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-dir": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-dir",
      idxFrom: 9,
      idxTo: 16,
      message: `Should be "ltr|rtl".`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case`, () => {
  let str = `<div dir="LTR">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-dir": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<div dir="ltr">`, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-dir",
      idxFrom: 10,
      idxTo: 13,
      message: `Should be lowercase.`,
      fix: {
        ranges: [[10, 13, "ltr"]],
      },
    },
  ]);
});

test.run();
