import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no lang, error level 0`, () => {
  let str = `<html><p>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-lang": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no lang, error level 1`, () => {
  let str = `<html><p>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-lang": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no lang, error level 2`, () => {
  let str = `<html><p>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-lang": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let healthyValues = [
    "fr-Brai",
    "ja-Kana",
    "es-013",
    "es-ES",
    "ru-Cyrl-BY",
    "en-GB",
    "FR",
    "am-et",
    "x-default",
    "pt-pt",
    "fr-fr",
  ];
  let linter = new Linter();
  healthyValues.forEach((healthyValue) => {
    let str = `<span lang="${healthyValue}">`;
    let messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2,
      },
    });
    equal(applyFixes(str, messages), str);
    equal(messages, []);
  });
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

// <applet lang="de">
test(`05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let badParentTags = [
    "applet",
    "base",
    // "basefont",
    // "br",
    // "frame",
    // "frameset",
    // "iframe",
    // "param",
    // "script",
  ];
  let linter = new Linter();
  badParentTags.forEach((badParentTag) => {
    let str = `<${badParentTag} lang="de">`;
    let messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2,
      },
    });
    // can't fix:
    equal(applyFixes(str, messages), str);
    compare(
      ok,
      messages,
      [
        {
          ruleId: "attribute-validate-lang",
          idxFrom: badParentTag.length + 2,
          idxTo: badParentTag.length + 2 + 9,
          fix: null,
        },
      ],
      badParentTag
    );

    equal(messages.length, 1);
  });
});

test(`06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - another recognised tag`, () => {
  let str = `<script lang="de">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-lang": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-lang",
      idxFrom: 8,
      idxTo: 17,
      fix: null,
    },
  ]);

  equal(messages.length, 1, "06.02");
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${34}m${`value`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div lang="a-DE">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-lang": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-lang",
      idxFrom: 11,
      idxTo: 15,
      message: `Starts with singleton, "a".`,
      fix: null,
    },
  ]);

  equal(messages.length, 1, "07.02");
});

test(`08 - ${`\u001b[${34}m${`value`}\u001b[${39}m`} - still catches whitespace on legit`, () => {
  let str = `<a lang=" de">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-lang": 2,
    },
  });
  equal(applyFixes(str, messages), `<a lang="de">`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-lang",
      idxFrom: 9,
      idxTo: 10,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[9, 10]],
      },
    },
  ]);

  equal(messages.length, 1, "08.02");
});

test(`09 - ${`\u001b[${34}m${`value`}\u001b[${39}m`} - invalid language tag and whitespace`, () => {
  // notice wrong tag name case - it won't get reported because
  // that's different rule and we didn't ask for it
  let str = `<A lang=" 123 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-lang": 2,
    },
  });
  equal(applyFixes(str, messages), `<A lang="123">`, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-lang",
      idxFrom: 9,
      idxTo: 14,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [9, 10],
          [13, 14],
        ],
      },
    },
    {
      ruleId: "attribute-validate-lang",
      idxFrom: 10,
      idxTo: 13,
      message: `Unrecognised language subtag, "123".`,
      fix: null,
    },
  ]);

  equal(messages.length, 2, "09.02");
});

test(`10 - ${`\u001b[${34}m${`value`}\u001b[${39}m`} - invalid language tag and whitespace + tag name case`, () => {
  let str = `<A lang=" 123 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-lang": 2,
      "tag-name-case": 2, // <--------------- !
    },
  });
  equal(applyFixes(str, messages), `<a lang="123">`, "10.01");
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
      ruleId: "attribute-validate-lang",
      idxFrom: 9,
      idxTo: 14,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [9, 10],
          [13, 14],
        ],
      },
    },
    {
      ruleId: "attribute-validate-lang",
      idxFrom: 10,
      idxTo: 13,
      message: `Unrecognised language subtag, "123".`,
      fix: null,
    },
  ]);

  equal(messages.length, 3, "10.02");
});

test.run();
