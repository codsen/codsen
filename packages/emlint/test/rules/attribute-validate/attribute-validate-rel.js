import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rel, error level 0`, () => {
  let str = `<a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rel, error level 1`, () => {
  let str = `<a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rel, error level 2`, () => {
  let str = `<a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, a`, () => {
  let str = `<a rel='nofollow'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, link`, () => {
  let str = `<link rel='nofollow'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test(`06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, link`, () => {
  let str = `<link rel="icon" href="https://www.codsen.com/favicon.ico" type="image/x-icon"/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<a rel=' nofollow'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  equal(applyFixes(str, messages), `<a rel='nofollow'>`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rel",
      idxFrom: 8,
      idxTo: 9,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[8, 9]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<a rel='nofollow '>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  equal(applyFixes(str, messages), `<a rel='nofollow'>`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rel",
      idxFrom: 16,
      idxTo: 17,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[16, 17]],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<a rel='  nofollow  \t'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  equal(applyFixes(str, messages), `<a rel='nofollow'>`, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rel",
      idxFrom: 8,
      idxTo: 21,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [8, 10],
          [18, 21],
        ],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<a rel="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rel",
      idxFrom: 8,
      idxTo: 11,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div rel="nofollow">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rel",
      idxFrom: 5,
      idxTo: 19,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz rel="nofollow">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rel",
      idxFrom: 5,
      idxTo: 19,
      fix: null,
    },
  ]);
});

// 04. wrong value
// -----------------------------------------------------------------------------

test(`13 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out of whack value`, () => {
  let str = `<a rel="tralala">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rel",
      idxFrom: 8,
      idxTo: 15,
      message: `Unrecognised value: "tralala".`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case nofollow`, () => {
  let str = `<a rel="NOFOLLOW">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": 2,
    },
  });
  // all fine
  equal(applyFixes(str, messages), str, "14.01");
  equal(messages, [], "14.02");
});

test(`15 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case nofollow`, () => {
  let str = `<a rel="NOFOLLOW">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-rel": [2, "enforceLowercase"],
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<a rel="nofollow">`, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-rel",
      idxFrom: 8,
      idxTo: 16,
      message: `Should be lowercase.`,
      fix: {
        ranges: [[8, 16, "nofollow"]],
      },
    },
  ]);
});

test.run();
