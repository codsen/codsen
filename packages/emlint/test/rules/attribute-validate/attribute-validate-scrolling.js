import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no scrolling, error level 0`, () => {
  let str = "<frame>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no scrolling, error level 1`, () => {
  let str = "<frame>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no scrolling, error level 2`, () => {
  let str = "<frame>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, frame`, () => {
  let str = '<frame scrolling="yes">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, iframe`, () => {
  let str = '<iframe scrolling="yes">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space in front`, () => {
  let str = "<frame scrolling=' yes'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 2,
    },
  });
  equal(applyFixes(str, messages), "<frame scrolling='yes'>", "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scrolling",
      idxFrom: 18,
      idxTo: 19,
      message: "Remove whitespace.",
      fix: {
        ranges: [[18, 19]],
      },
    },
  ]);

  is(messages.length, 1, "06.02");
});

test(`07 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space after`, () => {
  let str = "<frame scrolling='yes '>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 2,
    },
  });
  equal(applyFixes(str, messages), "<frame scrolling='yes'>", "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scrolling",
      idxFrom: 21,
      idxTo: 22,
      message: "Remove whitespace.",
      fix: {
        ranges: [[21, 22]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = "<frame scrolling='  yes  \t'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 2,
    },
  });
  equal(applyFixes(str, messages), "<frame scrolling='yes'>", "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scrolling",
      idxFrom: 18,
      idxTo: 26,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [18, 20],
          [23, 26],
        ],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = '<frame scrolling="  \t">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scrolling",
      idxFrom: 18,
      idxTo: 21,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div scrolling="yes">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scrolling",
      idxFrom: 5,
      idxTo: 20,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz scrolling="yes">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scrolling",
      idxFrom: 5,
      idxTo: 20,
      fix: null,
    },
  ]);
});

// 04. wrong value
// -----------------------------------------------------------------------------

test(`12 - ${`\u001b[${35}m${"validation"}\u001b[${39}m`} - out-of-whack value`, () => {
  let str = '<frame scrolling="tralala">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scrolling",
      idxFrom: 18,
      idxTo: 25,
      message: 'Should be "auto|yes|no".',
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${"validation"}\u001b[${39}m`} - wrong case`, () => {
  let str = '<frame scrolling="YES">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scrolling": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), '<frame scrolling="yes">', "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scrolling",
      idxFrom: 18,
      idxTo: 21,
      message: "Should be lowercase.",
      fix: {
        ranges: [[18, 21, "yes"]],
      },
    },
  ]);
});

test.run();
