import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no valuetype, error level 0`, () => {
  let str = "<param>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no valuetype, error level 1`, () => {
  let str = "<param>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no valuetype, error level 2`, () => {
  let str = "<param>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, param`, () => {
  let str = '<param valuetype="data">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space in front`, () => {
  let str = "<param valuetype=' data'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 2,
    },
  });
  equal(applyFixes(str, messages), "<param valuetype='data'>", "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valuetype",
      idxFrom: 18,
      idxTo: 19,
      message: "Remove whitespace.",
      fix: {
        ranges: [[18, 19]],
      },
    },
  ]);

  is(messages.length, 1, "05.02");
});

test(`06 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space after`, () => {
  let str = "<param valuetype='data '>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 2,
    },
  });
  equal(applyFixes(str, messages), "<param valuetype='data'>", "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valuetype",
      idxFrom: 22,
      idxTo: 23,
      message: "Remove whitespace.",
      fix: {
        ranges: [[22, 23]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = "<param valuetype='  data  \t'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 2,
    },
  });
  equal(applyFixes(str, messages), "<param valuetype='data'>", "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valuetype",
      idxFrom: 18,
      idxTo: 27,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [18, 20],
          [24, 27],
        ],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = '<param valuetype="  \t">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valuetype",
      idxFrom: 18,
      idxTo: 21,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div valuetype="data">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valuetype",
      idxFrom: 5,
      idxTo: 21,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz valuetype="data">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valuetype",
      idxFrom: 5,
      idxTo: 21,
      fix: null,
    },
  ]);
});

// 04. wrong value
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${"validation"}\u001b[${39}m`} - out-of-whack value`, () => {
  let str = '<param valuetype="tralala">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valuetype",
      idxFrom: 18,
      idxTo: 25,
      message: 'Should be "data|ref|object".',
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${"validation"}\u001b[${39}m`} - wrong case`, () => {
  let str = '<param valuetype="DATA">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-valuetype": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), '<param valuetype="data">', "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-valuetype",
      idxFrom: 18,
      idxTo: 22,
      message: "Should be lowercase.",
      fix: {
        ranges: [[18, 22, "data"]],
      },
    },
  ]);
});

test.run();
