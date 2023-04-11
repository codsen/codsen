import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no onmousemove, error level 0`, () => {
  let str = '<input class="z">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-onmousemove": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no onmousemove, error level 1`, () => {
  let str = '<input class="z">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-onmousemove": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no onmousemove, error level 2`, () => {
  let str = '<input class="z">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-onmousemove": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let str = "<input onmousemove='js'>"; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-onmousemove": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<html onmousemove="something">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-onmousemove": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-onmousemove",
      idxFrom: 6,
      idxTo: 29,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz onmousemove="something" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-onmousemove": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

// 03. whitespace
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - empty value`, () => {
  let str = '<input onmousemove="">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-onmousemove": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-onmousemove",
      idxFrom: 7,
      idxTo: 21,
      message: "Missing value.",
      fix: null,
    },
  ]);
});

test(`08 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - surrounding whitespace`, () => {
  let str = '<input onmousemove=" something ">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-onmousemove": 2,
    },
  });
  equal(applyFixes(str, messages), '<input onmousemove="something">', "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-onmousemove",
      idxFrom: 20,
      idxTo: 31,
      message: "Remove whitespace.",
      fix: {
        ranges: [
          [20, 21],
          [30, 31],
        ],
      },
    },
  ]);
});

test.run();
