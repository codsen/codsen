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
      "attribute-validate-charoff": 0,
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
      "attribute-validate-charoff": 1,
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
      "attribute-validate-charoff": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = '<td align="char" char="." charoff="2">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = '<td align="char" char="," charoff="-2">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test(`06 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = '<td align="char" char="," charoff="-99">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = '<td align="char" char="," charoff="99">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  equal(messages, [], "07.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div char="." charoff="2">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charoff",
      idxFrom: 14,
      idxTo: 25,
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz char="." charoff="2" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charoff",
      idxFrom: 14,
      idxTo: 25,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${"a wrong value"}\u001b[${39}m`} - not integer but str`, () => {
  let str = 'z <td char="." charoff="abc" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charoff",
      idxFrom: 24,
      idxTo: 27,
      message: "Should be integer, no units.",
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, encoded`, () => {
  let str = 'z <td char="." charoff=" &#x3A;">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  equal(applyFixes(str, messages), 'z <td char="." charoff="&#x3A;">', "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charoff",
      idxFrom: 24,
      idxTo: 25,
      message: "Remove whitespace.",
      fix: {
        ranges: [[24, 25]],
      },
    },
  ]);
});

test(`12 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - an empty value`, () => {
  let str = 'z <td char="." charoff="">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charoff",
      idxFrom: 15,
      idxTo: 25,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - a rational number`, () => {
  let str = 'z <td char="." charoff="2.1">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charoff",
      idxFrom: 25,
      idxTo: 27,
      message: "Should be integer, no units.",
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - dot`, () => {
  let str = 'z <td char="." charoff=".">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charoff",
      idxFrom: 24,
      idxTo: 25,
      message: "Should be integer, no units.",
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - double minus`, () => {
  let str = '<td align="char" char="," charoff="--2">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charoff",
      idxFrom: 36,
      idxTo: 38,
      message: "Repeated minus.",
      fix: null,
    },
  ]);
});

// 04. parent tag must have "char" attribute
// -----------------------------------------------------------------------------

test(`16 - ${`\u001b[${34}m${"char on parent"}\u001b[${39}m`} - sibling attr char is missing`, () => {
  let str = '<td align="char" charoff="2">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charoff": 2,
    },
  });
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charoff",
      idxFrom: 0,
      idxTo: 29,
      message: 'Attribute "char" missing.',
      fix: null,
    },
  ]);
});

test.run();
