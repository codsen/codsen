import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no for, error level 0`, () => {
  let str = "<label>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no for, error level 1`, () => {
  let str = "<label>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no for, error level 2`, () => {
  let str = "<label>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy for`, () => {
  let str = "<label for='abc'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space in front`, () => {
  let str = '<label for=" abcde">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 2,
    },
  });
  equal(applyFixes(str, messages), '<label for="abcde">', "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-for",
      idxFrom: 12,
      idxTo: 13,
      message: "Remove whitespace.",
      fix: {
        ranges: [[12, 13]],
      },
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space after`, () => {
  let str = '<label for="abcde ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 2,
    },
  });
  equal(applyFixes(str, messages), '<label for="abcde">', "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-for",
      idxFrom: 17,
      idxTo: 18,
      message: "Remove whitespace.",
      fix: {
        ranges: [[17, 18]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - one for, copious whitespace around`, () => {
  let str = '<label for="  abcde  \t">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 2,
    },
  });
  equal(applyFixes(str, messages), '<label for="abcde">', "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-for",
      idxFrom: 12,
      idxTo: 22,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [12, 14],
          [19, 22],
        ],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = '<label for="  \t">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-for",
      idxFrom: 12,
      idxTo: 15,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - empty value`, () => {
  let str = '<label for="">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-for",
      idxFrom: 7,
      idxTo: 13,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - two values, space-separated`, () => {
  let str = '<label for="abc def">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-for",
      idxFrom: 12,
      idxTo: 19,
      message: "Should be one value, no spaces.",
      fix: null,
    },
  ]);
});

// 03. name checks
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${"value checks"}\u001b[${39}m`} - value starts with hash`, () => {
  let str = '<label for="#abc">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), '<label for="abc">', "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-for",
      idxFrom: 12,
      idxTo: 13,
      message: "Remove hash.",
      fix: {
        ranges: [[12, 13]],
      },
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${"value checks"}\u001b[${39}m`} - value starts with hash`, () => {
  let str = '<label for=".abc">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-for",
      idxFrom: 12,
      idxTo: 16,
      message: "Wrong id name.",
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${"value checks"}\u001b[${39}m`} - only dot`, () => {
  let str = '<label for=".">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-for": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-for",
      idxFrom: 12,
      idxTo: 13,
      message: "Wrong id name.",
      fix: null,
    },
  ]);
});

test.run();
