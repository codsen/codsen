import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no scope, error level 0`, () => {
  let str = `<td>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no scope, error level 1`, () => {
  let str = `<td>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no scope, error level 2`, () => {
  let str = `<td>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, td`, () => {
  let str = `<td scope="row">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, th`, () => {
  let str = `<th scope="row">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<td scope=' row'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 2,
    },
  });
  equal(applyFixes(str, messages), `<td scope='row'>`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scope",
      idxFrom: 11,
      idxTo: 12,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[11, 12]],
      },
    },
  ]);

  is(messages.length, 1, "06.03");
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<td scope='row '>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 2,
    },
  });
  equal(applyFixes(str, messages), `<td scope='row'>`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scope",
      idxFrom: 14,
      idxTo: 15,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[14, 15]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<td scope='  row  \t'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 2,
    },
  });
  equal(applyFixes(str, messages), `<td scope='row'>`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scope",
      idxFrom: 11,
      idxTo: 19,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [11, 13],
          [16, 19],
        ],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<td scope="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scope",
      idxFrom: 11,
      idxTo: 14,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div scope="row">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scope",
      idxFrom: 5,
      idxTo: 16,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz scope="row">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scope",
      idxFrom: 5,
      idxTo: 16,
      fix: null,
    },
  ]);
});

// 04. wrong value
// -----------------------------------------------------------------------------

test(`12 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out-of-whack value`, () => {
  let str = `<td scope="tralala">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scope",
      idxFrom: 11,
      idxTo: 18,
      message: `Should be "row|col|rowgroup|colgroup".`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case`, () => {
  let str = `<td scope="ROW">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-scope": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<td scope="row">`, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-scope",
      idxFrom: 11,
      idxTo: 14,
      message: `Should be lowercase.`,
      fix: {
        ranges: [[11, 14, "row"]],
      },
    },
  ]);
});

test.run();
