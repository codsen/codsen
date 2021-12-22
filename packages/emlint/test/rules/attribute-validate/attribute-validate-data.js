import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no data, error level 0`, () => {
  let str = `<object><form>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-data": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no data, error level 1`, () => {
  let str = `<object><form>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-data": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no data, error level 2`, () => {
  let str = `<object><form>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-data": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<object data='https://codsen.com'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-data": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div data='https://codsen.com'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-data": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-data",
      idxFrom: 5,
      idxTo: 30,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz data="https://codsen.com" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-data": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-data",
      idxFrom: 5,
      idxTo: 30,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<object data="zzz??">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-data": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-data",
      idxFrom: 14,
      idxTo: 19,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`08 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`, () => {
  let str = `<object data=" https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-data": 2,
    },
  });
  equal(applyFixes(str, messages), `<object data="https://codsen.com">`);
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-data",
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
  // notice wrong tag name case:
  let str = `<OBJecT data=" z?? ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-data": 2,
    },
  });
  equal(applyFixes(str, messages), `<OBJecT data="z??">`, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-data",
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
      ruleId: "attribute-validate-data",
      idxFrom: 15,
      idxTo: 18,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test.run();
