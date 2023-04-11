import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no char, error level 0`, () => {
  let str = "<td>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-char": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no char, error level 1`, () => {
  let str = "<td>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-char": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no char, error level 2`, () => {
  let str = "<td>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-char": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = "<td char=':'>"; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-char": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, encoded`, () => {
  let str = '<td char="&#x3A;">'; // colon character, escaped
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-char": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div char="z">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-char": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-char",
      idxFrom: 5,
      idxTo: 13,
      fix: null,
    },
  ]);
});

test(`07 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz char="z" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-char": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-char",
      idxFrom: 5,
      idxTo: 13,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${"a wrong value"}\u001b[${39}m`} - more than 1 char, raw`, () => {
  let str = 'z <td char="abc" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-char": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-char",
      idxFrom: 12,
      idxTo: 15,
      message: "Should be a single character.",
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, encoded`, () => {
  let str = 'z <td char=" &#x3A;">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-char": 2,
    },
  });
  equal(applyFixes(str, messages), 'z <td char="&#x3A;">', "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-char",
      idxFrom: 12,
      idxTo: 13,
      message: "Remove whitespace.",
      fix: {
        ranges: [[12, 13]],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - an empty value`, () => {
  let str = 'z <td char="">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-char": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-char",
      idxFrom: 6,
      idxTo: 13,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

test.run();
