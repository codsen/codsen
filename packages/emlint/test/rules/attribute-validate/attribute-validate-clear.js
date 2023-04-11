import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no clear, error level 0`, () => {
  let str = "<br><form>"; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-clear": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no clear, error level 1`, () => {
  let str = "<br><form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-clear": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no clear, error level 2`, () => {
  let str = "<br><form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-clear": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = "<br clear='left'>"; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-clear": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = "<div clear='left'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-clear": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-clear",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz clear="left" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-clear": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-clear",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<br clear="zzz">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-clear": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-clear",
      idxFrom: 11,
      idxTo: 14,
      message: "Should be: left|all|right|none.",
      fix: null,
    },
  ]);
});

test(`08 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - still catches whitespace on legit URL`, () => {
  let str = '<br clear=" left">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-clear": 2,
    },
  });
  equal(applyFixes(str, messages), '<br clear="left">', "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-clear",
      idxFrom: 11,
      idxTo: 12,
      message: "Remove whitespace.",
      fix: {
        ranges: [[11, 12]],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - wrong case and whitespace`, () => {
  // notice wrong tag name case:
  let str = '<Br clear=" zzz ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-clear": 2,
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), '<br clear="zzz">', "09.01");
  compare(ok, messages, [
    {
      ruleId: "tag-name-case",
      idxFrom: 1,
      idxTo: 3,
      message: "Bad tag name case.",
      fix: {
        ranges: [[1, 3, "br"]],
      },
    },
    {
      ruleId: "attribute-validate-clear",
      idxFrom: 11,
      idxTo: 16,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [11, 12],
          [15, 16],
        ],
      },
    },
    {
      ruleId: "attribute-validate-clear",
      idxFrom: 12,
      idxTo: 15,
      message: "Should be: left|all|right|none.",
      fix: null,
    },
  ]);
});

test.run();
