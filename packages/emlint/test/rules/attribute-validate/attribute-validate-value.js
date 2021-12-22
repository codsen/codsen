import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no value, error level 0`, () => {
  ["input", "option", "param", "button", "li"].forEach((tagName) => {
    let str = `<${tagName}>`;
    let linter = new Linter();
    let messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 0,
      },
    });
    equal(applyFixes(str, messages), str);
    equal(messages, []);
  });
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no value, error level 1`, () => {
  ["input", "option", "param", "button", "li"].forEach((tagName) => {
    let str = `<${tagName}>`;
    let linter = new Linter();
    let messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 1,
      },
    });
    equal(applyFixes(str, messages), str);
    equal(messages, []);
  });
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no value, error level 2`, () => {
  ["input", "option", "param", "button", "li"].forEach((tagName) => {
    let str = `<${tagName}>`;
    let linter = new Linter();
    let messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    equal(applyFixes(str, messages), str);
    equal(messages, []);
  });
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<input value=" 1">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  equal(applyFixes(str, messages), `<input value="1">`, "04.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-value",
      idxFrom: 14,
      idxTo: 15,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[14, 15]],
      },
    },
  ]);
});

test(`05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<input value="7 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  equal(applyFixes(str, messages), `<input value="7">`, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-value",
      idxFrom: 15,
      idxTo: 16,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[15, 16]],
      },
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<input value="  6  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  equal(applyFixes(str, messages), `<input value="6">`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-value",
      idxFrom: 14,
      idxTo: 19,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [14, 16],
          [17, 19],
        ],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<input value="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-value",
      idxFrom: 14,
      idxTo: 17,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div value="9">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-value",
      idxFrom: 5,
      idxTo: 14,
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz value="9" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-value",
      idxFrom: 5,
      idxTo: 14,
      fix: null,
    },
  ]);
});

// 04. input/option/param/button - CDATA type
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${`value - input/option/param/button`}\u001b[${39}m`} - string as value`, () => {
  let str = `<input value="Submit form">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  equal(messages, [], "10.02");
});

// 05. li
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - string as value`, () => {
  let str = `<li value="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-value",
      idxFrom: 11,
      idxTo: 12,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`value - li`}\u001b[${39}m`} - dot as value`, () => {
  let str = `<li value=".">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-value",
      idxFrom: 11,
      idxTo: 12,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`value - li`}\u001b[${39}m`} - a rational number`, () => {
  let str = `<li value="1.5">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-value",
      idxFrom: 12,
      idxTo: 14,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`value - li`}\u001b[${39}m`} - with units`, () => {
  let str = `<li value="1px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-value",
      idxFrom: 12,
      idxTo: 14,
      message: `Sequence number should not be in pixels.`,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - zero`, () => {
  let str = `<li value="0">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-value": 2,
    },
  });
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-value",
      idxFrom: 11,
      idxTo: 12,
      message: `Zero not allowed.`,
      fix: null,
    },
  ]);
});

test.run();
