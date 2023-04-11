import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no accesskey, error level 0`, () => {
  let str = "<a>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accesskey": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no accesskey, error level 1`, () => {
  let str = "<a>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accesskey": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no accesskey, error level 2`, () => {
  let str = "<a>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accesskey": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = "<a accesskey='z'>"; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accesskey": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, encoded`, () => {
  let str = '<a accesskey="&pound;">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accesskey": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div accesskey="z">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accesskey": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accesskey",
      idxFrom: 5,
      idxTo: 18,
      fix: null,
    },
  ]);
});

test(`07 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz accesskey="z" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accesskey": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accesskey",
      idxFrom: 5,
      idxTo: 18,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${"a wrong value"}\u001b[${39}m`} - more than 1 char, raw`, () => {
  let str = 'z <a accesskey="abc" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accesskey": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accesskey",
      idxFrom: 16,
      idxTo: 19,
      message: "Should be a single character (escaped or not).",
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, encoded`, () => {
  let str = 'z <a accesskey=" &pound;">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accesskey": 2,
    },
  });
  equal(applyFixes(str, messages), 'z <a accesskey="&pound;">', "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accesskey",
      idxFrom: 16,
      idxTo: 17,
      message: "Remove whitespace.",
      fix: {
        ranges: [[16, 17]],
      },
    },
  ]);
});

test.run();
