import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no charset, error level 0`, () => {
  let str = "<a><form>"; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charset": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no charset, error level 1`, () => {
  let str = "<a><form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charset": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no charset, error level 2`, () => {
  let str = "<a><form>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charset": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = "<a charset='utf-8'>"; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charset": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = "<div charset='utf-8'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charset": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charset",
      idxFrom: 5,
      idxTo: 20,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz charset="utf-8" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charset": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charset",
      idxFrom: 5,
      idxTo: 20,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<link charset="utf-z">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charset": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charset",
      idxFrom: 15,
      idxTo: 20,
      message: 'Unrecognised value: "utf-z".',
      fix: null,
    },
  ]);
});

test(`08 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - multiple, with space`, () => {
  let str = '<a charset="utf-7, utf-8">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charset": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charset",
      idxFrom: 12,
      idxTo: 24,
      message: 'Unrecognised value: "utf-7, utf-8".',
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - multiple, without space`, () => {
  let str = '<a charset="utf-7,utf-8">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charset": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charset",
      idxFrom: 12,
      idxTo: 23,
      message: 'Unrecognised value: "utf-7,utf-8".',
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - empty`, () => {
  let str = '<script charset="">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-charset": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-charset",
      idxFrom: 8,
      idxTo: 18,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

test.run();
