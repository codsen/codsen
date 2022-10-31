import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no action, error level 0`, () => {
  let str = `<div><form>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-action": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no action, error level 1`, () => {
  let str = `<div><form>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-action": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no action, error level 2`, () => {
  let str = `<div><form>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-action": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<form action='https://codsen.com'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-action": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div action='https://codsen.com'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-action": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-action",
      idxFrom: 5,
      idxTo: 32,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz action="https://codsen.com" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-action": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-action",
      idxFrom: 5,
      idxTo: 32,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<form action="zz.">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-action": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-action",
      idxFrom: 14,
      idxTo: 17,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`08 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`, () => {
  let str = `<form action=" https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-action": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    `<form action="https://codsen.com">`,
    "08.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-action",
      idxFrom: 14,
      idxTo: 15,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[14, 15]],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`, () => {
  let str = `<form action=" zz. ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-action": 2,
    },
  });
  equal(applyFixes(str, messages), `<form action="zz.">`, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-action",
      idxFrom: 14,
      idxTo: 19,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [14, 15],
          [18, 19],
        ],
      },
    },
    {
      ruleId: "attribute-validate-action",
      idxFrom: 15,
      idxTo: 18,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - two URL's, space-separated`, () => {
  let str = `<form action="https://codsen.com https://detergent.io">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-action": 2,
    },
  });
  // can't fix
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-action",
      idxFrom: 14,
      idxTo: 53,
      message: `There should be only one URI.`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - two URL's, comma-separated`, () => {
  let str = `<form action="https://codsen.com,https://detergent.io">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-action": 2,
    },
  });
  // can't fix
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-action",
      idxFrom: 14,
      idxTo: 53,
      message: `There should be only one URI.`,
      fix: null,
    },
  ]);
});

test.run();
