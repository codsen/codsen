import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no label, error level 0`, () => {
  let str = '<option class="z">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-label": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no label, error level 1`, () => {
  let str = '<option class="z">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-label": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no label, error level 2`, () => {
  let str = '<option class="z">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-label": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, option`, () => {
  let str = "<option label='something'>"; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-label": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, optgroup`, () => {
  let str = '<optgroup label="something">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-label": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div label="something">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-label": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-label",
      idxFrom: 5,
      idxTo: 22,
      fix: null,
    },
  ]);
});

test(`07 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz label="something" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-label": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-label",
      idxFrom: 5,
      idxTo: 22,
      fix: null,
    },
  ]);
});

// 03. whitespace
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - empty value`, () => {
  let str = '<option label="">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-label": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-label",
      idxFrom: 8,
      idxTo: 16,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - surrounding whitespace`, () => {
  let str = '<option label=" something ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-label": 2,
    },
  });
  equal(applyFixes(str, messages), '<option label="something">', "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-label",
      idxFrom: 15,
      idxTo: 26,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [15, 16],
          [25, 26],
        ],
      },
    },
  ]);
});

test.run();
