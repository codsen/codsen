import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no method, error level 0`, () => {
  let str = "<form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no method, error level 1`, () => {
  let str = "<form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no method, error level 2`, () => {
  let str = "<form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, wildcard`, () => {
  let str = "<form method='get'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space in front`, () => {
  let str = "<form method=' get'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 2,
    },
  });
  equal(applyFixes(str, messages), "<form method='get'>", "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-method",
      idxFrom: 14,
      idxTo: 15,
      message: "Remove whitespace.",
      fix: {
        ranges: [[14, 15]],
      },
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space after`, () => {
  let str = "<form method='get '>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 2,
    },
  });
  equal(applyFixes(str, messages), "<form method='get'>", "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-method",
      idxFrom: 17,
      idxTo: 18,
      message: "Remove whitespace.",
      fix: {
        ranges: [[17, 18]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = "<form method='  get  \t'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 2,
    },
  });
  equal(applyFixes(str, messages), "<form method='get'>", "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-method",
      idxFrom: 14,
      idxTo: 22,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [14, 16],
          [19, 22],
        ],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = '<form method="  \t">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-method",
      idxFrom: 14,
      idxTo: 17,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div method="get">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-method",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz method="get">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-method",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

// 04. wrong value
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${"validation"}\u001b[${39}m`} - out of whack value`, () => {
  let str = '<form method="tralala">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-method",
      idxFrom: 14,
      idxTo: 21,
      message: 'Should be "get|post".',
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${"validation"}\u001b[${39}m`} - wrong case get`, () => {
  let str = '<form method="GET">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), '<form method="get">', "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-method",
      idxFrom: 14,
      idxTo: 17,
      message: "Should be lowercase.",
      fix: {
        ranges: [[14, 17, "get"]],
      },
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${"validation"}\u001b[${39}m`} - wrong case post`, () => {
  let str = '<form method="POST">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-method": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), '<form method="post">', "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-method",
      idxFrom: 14,
      idxTo: 18,
      message: "Should be lowercase.",
      fix: {
        ranges: [[14, 18, "post"]],
      },
    },
  ]);
});

test.run();
