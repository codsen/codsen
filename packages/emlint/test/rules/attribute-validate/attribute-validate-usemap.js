import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no usemap, error level 0`, () => {
  let str = `<img><div>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-usemap": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no usemap, error level 1`, () => {
  let str = `<img><div>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-usemap": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no usemap, error level 2`, () => {
  let str = `<img><div>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-usemap": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<img usemap="https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-usemap": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div usemap="https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-usemap": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-usemap",
      idxFrom: 5,
      idxTo: 32,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz usemap="https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-usemap": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-usemap",
      idxFrom: 5,
      idxTo: 32,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<img usemap="zzz??">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-usemap": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-usemap",
      idxFrom: 13,
      idxTo: 18,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`08 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`, () => {
  let str = `<img usemap=" https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-usemap": 2,
    },
  });
  equal(applyFixes(str, messages), `<img usemap="https://codsen.com">`);
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-usemap",
      idxFrom: 13,
      idxTo: 14,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[13, 14]],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`, () => {
  // notice wrong tag name case:
  let str = `<INPUT usemap=" zzz?? ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-usemap": 2,
    },
  });
  equal(applyFixes(str, messages), `<INPUT usemap="zzz??">`, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-usemap",
      idxFrom: 15,
      idxTo: 22,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [15, 16],
          [21, 22],
        ],
      },
    },
    {
      ruleId: "attribute-validate-usemap",
      idxFrom: 16,
      idxTo: 21,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test.run();
