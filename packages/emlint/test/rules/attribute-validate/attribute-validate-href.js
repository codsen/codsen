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
      "attribute-validate-href": 0,
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
      "attribute-validate-href": 1,
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
      "attribute-validate-href": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<a href="https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-href": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<area href="https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-href": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test(`06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<link href="https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-href": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<base href='https://codsen.com'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-href": 2,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  equal(messages, [], "07.02");
});

test(`08 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy tel`, () => {
  let str = `<a href="tel:1-408-555-5555">Call me</a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-href": 2,
    },
  });
  equal(applyFixes(str, messages), str, "08.01");
  equal(messages, [], "08.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div href="https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-href": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-href",
      idxFrom: 5,
      idxTo: 30,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz href="https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-href": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-href",
      idxFrom: 5,
      idxTo: 30,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<a href="zzz??">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-href": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-href",
      idxFrom: 9,
      idxTo: 14,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`, () => {
  let str = `<a href=" https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-href": 2,
    },
  });
  equal(applyFixes(str, messages), `<a href="https://codsen.com">`, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-href",
      idxFrom: 9,
      idxTo: 10,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[9, 10]],
      },
    },
  ]);
});

test(`13 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`, () => {
  // notice wrong tag name case:
  let str = `<A href=" zzz?? ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-href": 2,
    },
  });
  equal(applyFixes(str, messages), `<A href="zzz??">`, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-href",
      idxFrom: 9,
      idxTo: 16,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [9, 10],
          [15, 16],
        ],
      },
    },
    {
      ruleId: "attribute-validate-href",
      idxFrom: 10,
      idxTo: 15,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - whitespace within a legit URL`, () => {
  let str = `<a href="https://  codsen .com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-href": 2,
    },
  });
  equal(applyFixes(str, messages), `<a href="https://codsen.com">`, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-href",
      idxFrom: 9,
      idxTo: 30,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [17, 19],
          [25, 26],
        ],
      },
    },
  ]);
});

test.run();
