import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no shape, error level 0`, () => {
  let str = `<a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no shape, error level 1`, () => {
  let str = `<a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no shape, error level 2`, () => {
  let str = `<a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, a`, () => {
  let str = `<a shape="rect">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, area`, () => {
  let str = `<area shape="rect">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<a shape=' rect'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 2,
    },
  });
  equal(applyFixes(str, messages), `<a shape='rect'>`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-shape",
      idxFrom: 10,
      idxTo: 11,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[10, 11]],
      },
    },
  ]);

  is(messages.length, 1, "06.02");
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<a shape='rect '>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 2,
    },
  });
  equal(applyFixes(str, messages), `<a shape='rect'>`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-shape",
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
  let str = `<a shape='  rect  \t'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 2,
    },
  });
  equal(applyFixes(str, messages), `<a shape='rect'>`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-shape",
      idxFrom: 10,
      idxTo: 19,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [10, 12],
          [16, 19],
        ],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<a shape="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-shape",
      idxFrom: 10,
      idxTo: 13,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div shape="rect">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-shape",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz shape="rect">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-shape",
      idxFrom: 5,
      idxTo: 17,
      fix: null,
    },
  ]);
});

// 04. wrong value
// -----------------------------------------------------------------------------

test(`12 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out-of-whack value`, () => {
  let str = `<a shape="tralala">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-shape",
      idxFrom: 10,
      idxTo: 17,
      message: `Should be "default|rect|circle|poly".`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case`, () => {
  let str = `<a shape="RECT">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-shape": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<a shape="rect">`, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-shape",
      idxFrom: 10,
      idxTo: 14,
      message: `Should be lowercase.`,
      fix: {
        ranges: [[10, 14, "rect"]],
      },
    },
  ]);
});

test.run();
