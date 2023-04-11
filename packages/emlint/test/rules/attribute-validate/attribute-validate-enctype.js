import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no enctype, error level 0`, () => {
  let str = "<form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no enctype, error level 1`, () => {
  let str = "<form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no enctype, error level 2`, () => {
  let str = "<form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, common`, () => {
  let str = "<form enctype='text/plain'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, rare MIME type`, () => {
  let str = '<form enctype="application/dssc+xml">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space in front`, () => {
  let str = "<form enctype=' text/plain'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 2,
    },
  });
  equal(applyFixes(str, messages), "<form enctype='text/plain'>", "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-enctype",
      idxFrom: 15,
      idxTo: 16,
      message: "Remove whitespace.",
      fix: {
        ranges: [[15, 16]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space after`, () => {
  let str = "<form enctype='text/plain '>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 2,
    },
  });
  equal(applyFixes(str, messages), "<form enctype='text/plain'>", "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-enctype",
      idxFrom: 25,
      idxTo: 26,
      message: "Remove whitespace.",
      fix: {
        ranges: [[25, 26]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = "<form enctype='  text/plain  \t'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 2,
    },
  });
  equal(applyFixes(str, messages), "<form enctype='text/plain'>", "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-enctype",
      idxFrom: 15,
      idxTo: 30,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [15, 17],
          [27, 30],
        ],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = '<form enctype="  \t">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-enctype",
      idxFrom: 15,
      idxTo: 18,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div enctype="text/plain">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-enctype",
      idxFrom: 5,
      idxTo: 25,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz enctype="text/plain">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-enctype",
      idxFrom: 5,
      idxTo: 25,
      fix: null,
    },
  ]);
});

// 04. wrong value
// -----------------------------------------------------------------------------

test(`12 - ${`\u001b[${35}m${"validation"}\u001b[${39}m`} - out of whack value`, () => {
  let str = '<form enctype="tralala">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-enctype": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-enctype",
      idxFrom: 15,
      idxTo: 22,
      message: 'Unrecognised value: "tralala".',
      fix: null,
    },
  ]);
});

test.run();
