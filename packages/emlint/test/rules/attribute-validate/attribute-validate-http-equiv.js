import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no http-equiv, error level 0`, () => {
  let str = "<meta>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no http-equiv, error level 1`, () => {
  let str = "<meta>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no http-equiv, error level 2`, () => {
  let str = "<meta>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, content-type`, () => {
  let str = "<meta http-equiv='content-type'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, default-style`, () => {
  let str = '<meta http-equiv="default-style">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test(`06 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, refresh`, () => {
  let str = '<meta http-equiv="refresh">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute, content-type, first cap`, () => {
  let str = '<meta http-equiv="Content-Type">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  equal(messages, [], "07.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space in front`, () => {
  let str = "<meta http-equiv=' refresh'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  equal(applyFixes(str, messages), "<meta http-equiv='refresh'>", "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-http-equiv",
      idxFrom: 18,
      idxTo: 19,
      message: "Remove whitespace.",
      fix: {
        ranges: [[18, 19]],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - space after`, () => {
  let str = '<meta http-equiv="refresh ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  equal(applyFixes(str, messages), '<meta http-equiv="refresh">', "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-http-equiv",
      idxFrom: 25,
      idxTo: 26,
      message: "Remove whitespace.",
      fix: {
        ranges: [[25, 26]],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = "<meta http-equiv='  refresh  \t'>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  equal(applyFixes(str, messages), "<meta http-equiv='refresh'>", "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-http-equiv",
      idxFrom: 18,
      idxTo: 30,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [18, 20],
          [27, 30],
        ],
      },
    },
  ]);
});

test(`11 - ${`\u001b[${36}m${"whitespace"}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = '<meta http-equiv="  \t">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-http-equiv",
      idxFrom: 18,
      idxTo: 21,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`12 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div http-equiv="refresh">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-http-equiv",
      idxFrom: 5,
      idxTo: 25,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz http-equiv="refresh">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-http-equiv",
      idxFrom: 5,
      idxTo: 25,
      fix: null,
    },
  ]);
});

// 04. wrong value
// -----------------------------------------------------------------------------

test(`14 - ${`\u001b[${35}m${"validation"}\u001b[${39}m`} - out of whack value`, () => {
  let str = '<meta http-equiv="tralala">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-http-equiv": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-http-equiv",
      idxFrom: 18,
      idxTo: 25,
      message: 'Unrecognised value: "tralala".',
      fix: null,
    },
  ]);
});

test.run();
