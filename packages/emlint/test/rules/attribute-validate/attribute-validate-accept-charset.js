import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no accept-charset, error level 0`, () => {
  let str = "<div><form>"; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept-charset": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no accept-charset, error level 1`, () => {
  let str = "<div><form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept-charset": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no accept-charset, error level 2`, () => {
  let str = "<div><form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept-charset": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = "<form accept-charset='utf-8'>"; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept-charset": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - two attrs`, () => {
  let str = '<form accept-charset="utf-7,utf-8">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept-charset": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = "<div accept-charset='utf-8'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept-charset": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept-charset",
      idxFrom: 5,
      idxTo: 27,
      fix: null,
    },
  ]);
});

test(`07 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz accept-charset="utf-8" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept-charset": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept-charset",
      idxFrom: 5,
      idxTo: 27,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<form accept-charset="utf-z">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept-charset": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept-charset",
      idxFrom: 22,
      idxTo: 27,
      message: 'Unrecognised value: "utf-z".',
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - space after comma`, () => {
  let str = '<form accept-charset="utf-7, utf-8">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept-charset": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    '<form accept-charset="utf-7,utf-8">',
    "09.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept-charset",
      idxFrom: 28,
      idxTo: 29,
      message: "Remove whitespace.",
      fix: {
        ranges: [[28, 29]],
      },
    },
  ]);
});

test.run();
