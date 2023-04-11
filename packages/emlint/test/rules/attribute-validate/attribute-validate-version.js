import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no version, error level 0`, () => {
  let str = "<html>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-version": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no version, error level 1`, () => {
  let str = "<html>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-version": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no version, error level 2`, () => {
  let str = "<html>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-version": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = "<html version='zz'>"; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-version": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div version="something">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-version": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-version",
      idxFrom: 5,
      idxTo: 24,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz version="something">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-version": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-version",
      idxFrom: 5,
      idxTo: 24,
      fix: null,
    },
  ]);
});

// 03. whitespace
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - empty value`, () => {
  let str = '<html version="">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-version": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-version",
      idxFrom: 6,
      idxTo: 16,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

test(`08 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - surrounding whitespace`, () => {
  let str = '<html version=" something ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-version": 2,
    },
  });
  equal(applyFixes(str, messages), '<html version="something">', "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-version",
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
