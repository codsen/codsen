import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no id, error level 0`, () => {
  let str = "<table>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no id, error level 1`, () => {
  let str = "<table>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no id, error level 2`, () => {
  let str = "<table>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy id`, () => {
  let str = "<table id='abc def'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space in front`, () => {
  let str = '<table id=" w100p">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  equal(applyFixes(str, messages), '<table id="w100p">', "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-id",
      idxFrom: 11,
      idxTo: 12,
      message: "Remove whitespace.",
      fix: {
        ranges: [[11, 12]],
      },
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space after`, () => {
  let str = '<table id="w100p ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  equal(applyFixes(str, messages), '<table id="w100p">', "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-id",
      idxFrom: 16,
      idxTo: 17,
      message: "Remove whitespace.",
      fix: {
        ranges: [[16, 17]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - one id, copious whitespace around`, () => {
  let str = '<table id="  w100p  ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  equal(applyFixes(str, messages), '<table id="w100p">', "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-id",
      idxFrom: 11,
      idxTo: 20,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [11, 13],
          [18, 20],
        ],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - many ides, copious whitespace around`, () => {
  let str = '<table id="  w100p  ha \t fl  \n  ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  equal(applyFixes(str, messages), '<table id="w100p ha fl">', "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-id",
      idxFrom: 11,
      idxTo: 32,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [11, 13],
          [27, 32],
        ],
      },
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 18, // report whole whitespace gap
      idxTo: 20,
      message: "Should be a single space.",
      fix: {
        ranges: [[19, 20]], // delete only minimal amount, without insertion if possible
      },
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 22,
      idxTo: 25,
      message: "Should be a single space.",
      fix: {
        ranges: [[23, 25]], // delete only minimal amount, without insertion if possible
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = '<table id="  \t">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-id",
      idxFrom: 11,
      idxTo: 14,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - empty value`, () => {
  let str = '<table id="">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-id",
      idxFrom: 7,
      idxTo: 12,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

// 03. id name checks
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${"id name checks"}\u001b[${39}m`} - healthy`, () => {
  let str = "<table id='ab cd ef' id='yy aa'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  equal(applyFixes(str, messages), str, "11.01");
  equal(messages, [], "11.02");
});

test(`12 - ${`\u001b[${35}m${"id name checks"}\u001b[${39}m`} - mix 1`, () => {
  let str = '<a id="b c\td\ne\t f \tg\t\th">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), '<a id="b c d e f g h">', "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-id",
      idxFrom: 10, // whole whitespace gap is reported but deletion is mininal
      idxTo: 11,
      message: "Should be a single space.",
      fix: {
        ranges: [[10, 11, " "]], // replacement with space - notice 3rd arg
      },
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 12,
      idxTo: 13,
      message: "Should be a single space.",
      fix: {
        ranges: [[12, 13, " "]], // replacement with space - notice 3rd arg
      },
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 14,
      idxTo: 16,
      message: "Should be a single space.",
      fix: {
        ranges: [[14, 15]],
      },
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 17,
      idxTo: 19,
      message: "Should be a single space.",
      fix: {
        ranges: [[18, 19]],
      },
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 20,
      idxTo: 22,
      message: "Should be a single space.",
      fix: {
        ranges: [[20, 22, " "]],
      },
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${"id name checks"}\u001b[${39}m`} - mix 1`, () => {
  let str = "<table id='ab \t3a e.f' id='yy aa'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  // can fix:
  equal(
    applyFixes(str, messages),
    "<table id='ab 3a e.f' id='yy aa'>",
    "13.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-id",
      idxFrom: 13,
      idxTo: 15,
      message: "Should be a single space.",
      fix: {
        ranges: [[14, 15]],
      },
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 15,
      idxTo: 17,
      message: "Wrong id name.",
      fix: null,
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 18,
      idxTo: 21,
      message: "Wrong id name.",
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${"id name checks"}\u001b[${39}m`} - starts with dot`, () => {
  let str = '<table id=".abc">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-id",
      idxFrom: 11,
      idxTo: 15,
      message: "Wrong id name.",
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${"id name checks"}\u001b[${39}m`} - only dot`, () => {
  let str = '<table id=".">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-id",
      idxFrom: 11,
      idxTo: 12,
      message: "Wrong id name.",
      fix: null,
    },
  ]);
});

test(`16 - ${`\u001b[${35}m${"id name checks"}\u001b[${39}m`} - only dot`, () => {
  let str = `
<table id="aa bb cc dd">
<table id="aa bb aa bb cc aa dd \taa">
<table id="aa bb cc dd">
`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-id": 2,
    },
  });
  // can fix:
  equal(
    applyFixes(str, messages),
    `
<table id="aa bb cc dd">
<table id="aa bb cc dd">
<table id="aa bb cc dd">
`,
    "16.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-id",
      idxFrom: 43,
      idxTo: 45,
      message: 'Duplicate id "aa".',
      fix: {
        ranges: [[43, 46]],
      },
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 46,
      idxTo: 48,
      message: 'Duplicate id "bb".',
      fix: {
        ranges: [[46, 49]],
      },
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 52,
      idxTo: 54,
      message: 'Duplicate id "aa".',
      fix: {
        ranges: [[52, 55]],
      },
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 57,
      idxTo: 59,
      message: "Should be a single space.",
      fix: {
        ranges: [[58, 59]],
      },
    },
    {
      ruleId: "attribute-validate-id",
      idxFrom: 59,
      idxTo: 61,
      message: 'Duplicate id "aa".',
      fix: {
        ranges: [[57, 61]],
      },
    },
  ]);
});

test.run();
