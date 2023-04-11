import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no content, error level 0`, () => {
  let str = "<meta>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-content": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no content, error level 1`, () => {
  let str = "<meta>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-content": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no content, error level 2`, () => {
  let str = "<meta>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-content": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str =
    '<meta http-equiv="refresh" content="3;url=https://www.mozilla.org">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-content": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str =
    '<div http-equiv="refresh" content="3;url=https://www.mozilla.org">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-content": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-content",
      idxFrom: 26,
      idxTo: 65,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str =
    '<zzz http-equiv="refresh" content="3;url=https://www.mozilla.org">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-content": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-content",
      idxFrom: 26,
      idxTo: 65,
      fix: null,
    },
  ]);
});

test.run();
