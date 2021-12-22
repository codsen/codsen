import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 0`, () => {
  let str = `<a><div>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-hreflang": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 1`, () => {
  let str = `<a><div>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-hreflang": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 2`, () => {
  let str = `<a><div>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-hreflang": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<a href="https://codsen.com" hreflang="de">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-hreflang": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<link href="https://codsen.com" hreflang="hy-Latn-IT-arevela">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-hreflang": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div hreflang="de">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-hreflang": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-hreflang",
      idxFrom: 5,
      idxTo: 18,
      fix: null,
    },
  ]);
});

test(`07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz hreflang="de">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-hreflang": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-hreflang",
      idxFrom: 5,
      idxTo: 18,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<a hreflang="a-DE">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-hreflang": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-hreflang",
      idxFrom: 13,
      idxTo: 17,
      message: `Starts with singleton, "a".`,
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`, () => {
  let str = `<a hreflang=" de">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-hreflang": 2,
    },
  });
  equal(applyFixes(str, messages), `<a hreflang="de">`, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-hreflang",
      idxFrom: 13,
      idxTo: 14,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[13, 14]],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`, () => {
  // notice wrong tag name case - it won't get reported because
  // that's different rule and we didn't ask for it
  let str = `<A hreflang=" 123 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-hreflang": 2,
    },
  });
  equal(applyFixes(str, messages), `<A hreflang="123">`, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-hreflang",
      idxFrom: 13,
      idxTo: 18,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [13, 14],
          [17, 18],
        ],
      },
    },
    {
      ruleId: "attribute-validate-hreflang",
      idxFrom: 14,
      idxTo: 17,
      message: `Unrecognised language subtag, "123".`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`, () => {
  let str = `<A hreflang=" 123 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-hreflang": 2,
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), `<a hreflang="123">`, "11.01");
  compare(ok, messages, [
    {
      ruleId: "tag-name-case",
      idxFrom: 1,
      idxTo: 2,
      message: "Bad tag name case.",
      fix: {
        ranges: [[1, 2, "a"]],
      },
    },
    {
      ruleId: "attribute-validate-hreflang",
      idxFrom: 13,
      idxTo: 18,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [13, 14],
          [17, 18],
        ],
      },
    },
    {
      ruleId: "attribute-validate-hreflang",
      idxFrom: 14,
      idxTo: 17,
      message: `Unrecognised language subtag, "123".`,
      fix: null,
    },
  ]);
});

test.run();
