import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no headers, error level 0`, () => {
  let str = `<td>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no headers, error level 1`, () => {
  let str = `<td>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no headers, error level 2`, () => {
  let str = `<td>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy headers`, () => {
  let str = `<td headers='abc def'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<td headers=" abc">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  equal(applyFixes(str, messages), `<td headers="abc">`, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 13,
      idxTo: 14,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[13, 14]],
      },
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<td headers="abc ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  equal(applyFixes(str, messages), `<td headers="abc">`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 16,
      idxTo: 17,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[16, 17]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - one id, copious whitespace around`, () => {
  let str = `<td headers="  abc  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  equal(applyFixes(str, messages), `<td headers="abc">`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 13,
      idxTo: 20,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [13, 15],
          [18, 20],
        ],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - many ides, copious whitespace around`, () => {
  let str = `<td headers="  abc  ha \t fl  \n  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  equal(applyFixes(str, messages), `<td headers="abc ha fl">`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 13,
      idxTo: 32,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [13, 15],
          [27, 32],
        ],
      },
    },
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 18, // report whole whitespace gap
      idxTo: 20,
      message: `Should be a single space.`,
      fix: {
        ranges: [[19, 20]], // delete only minimal amount, without insertion if possible
      },
    },
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 22,
      idxTo: 25,
      message: `Should be a single space.`,
      fix: {
        ranges: [[23, 25]], // delete only minimal amount, without insertion if possible
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<td headers="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 13,
      idxTo: 16,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - empty value`, () => {
  let str = `<td headers="">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 4,
      idxTo: 14,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. id name checks
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${`id name checks`}\u001b[${39}m`} - healthy`, () => {
  let str = `<td headers="ab cd ef">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  equal(applyFixes(str, messages), str, "11.01");
  equal(messages, [], "11.02");
});

test(`12 - ${`\u001b[${35}m${`id name checks`}\u001b[${39}m`} - mix 1`, () => {
  let str = `<td headers="ab \t3a e.f">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  // can fix much:
  equal(applyFixes(str, messages), `<td headers="ab 3a e.f">`, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 15,
      idxTo: 17,
      message: `Should be a single space.`,
      fix: {
        ranges: [[16, 17]],
      },
    },
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 17,
      idxTo: 19,
      message: `Wrong id name.`,
      fix: null,
    },
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 20,
      idxTo: 23,
      message: `Wrong id name.`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`id name checks`}\u001b[${39}m`} - starts with dot`, () => {
  let str = `<td headers=".abc">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 13,
      idxTo: 17,
      message: `Wrong id name.`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`id name checks`}\u001b[${39}m`} - only dot`, () => {
  let str = `<td headers=".">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 13,
      idxTo: 14,
      message: `Wrong id name.`,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${`id name checks`}\u001b[${39}m`} - only dot`, () => {
  let str = `
<td headers="aa bb cc dd">
<td headers="aa bb aa bb cc aa dd \taa">
<td headers="aa bb cc dd">
`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-headers": 2,
    },
  });
  // can fix:
  equal(
    applyFixes(str, messages),
    `
<td headers="aa bb cc dd">
<td headers="aa bb cc dd">
<td headers="aa bb cc dd">
`,
    "15.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 47,
      idxTo: 49,
      message: `Duplicate id "aa".`,
      fix: {
        ranges: [[47, 50]],
      },
    },
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 50,
      idxTo: 52,
      message: `Duplicate id "bb".`,
      fix: {
        ranges: [[50, 53]],
      },
    },
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 56,
      idxTo: 58,
      message: `Duplicate id "aa".`,
      fix: {
        ranges: [[56, 59]],
      },
    },
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 61,
      idxTo: 63,
      message: `Should be a single space.`,
      fix: {
        ranges: [[62, 63]],
      },
    },
    {
      ruleId: "attribute-validate-headers",
      idxFrom: 63,
      idxTo: 65,
      message: `Duplicate id "aa".`,
      fix: {
        ranges: [[61, 65]],
      },
    },
  ]);
});

test.run();
