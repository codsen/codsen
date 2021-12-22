import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no valign, error level 0`, () => {
  let str = `<td>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no valign, error level 1`, () => {
  let str = `<td>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no valign, error level 2`, () => {
  let str = `<td>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, td`, () => {
  let str = `<td valign="top">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<td valign=' top'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 2,
    },
  });
  equal(applyFixes(str, messages), `<td valign='top'>`, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valign",
      idxFrom: 12,
      idxTo: 13,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[12, 13]],
      },
    },
  ]);

  is(messages.length, 1, "05.03");
});

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<td valign='top '>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 2,
    },
  });
  equal(applyFixes(str, messages), `<td valign='top'>`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valign",
      idxFrom: 15,
      idxTo: 16,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[15, 16]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<td valign='  top  \t'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 2,
    },
  });
  equal(applyFixes(str, messages), `<td valign='top'>`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valign",
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

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<td valign="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valign",
      idxFrom: 12,
      idxTo: 15,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div valign="top">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valign",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz valign="top">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valign",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

// 04. wrong value
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out-of-whack value`, () => {
  let str = `<td valign="tralala">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valign",
      idxFrom: 12,
      idxTo: 19,
      message: `Should be "top|middle|bottom|baseline".`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case`, () => {
  let str = `<td valign="BASELINE">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valign": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<td valign="baseline">`, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valign",
      idxFrom: 12,
      idxTo: 20,
      message: `Should be lowercase.`,
      fix: {
        ranges: [[12, 20, "baseline"]],
      },
    },
  ]);
});

test.run();
