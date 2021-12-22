import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - no marginwidth`, () => {
  let str = `<frame>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - width in px`, () => {
  let str = `<frame marginwidth="600px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  equal(applyFixes(str, messages), `<frame marginwidth="600">`, "02.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      message: `Remove px.`,
    },
  ]);
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`03 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space in front`, () => {
  let str = `<frame marginwidth=" 600">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  equal(applyFixes(str, messages), `<frame marginwidth="600">`, "03.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      message: `Remove whitespace.`,
    },
  ]);
});

test(`04 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space after`, () => {
  let str = `<frame marginwidth="600 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  equal(applyFixes(str, messages), `<frame marginwidth="600">`, "04.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      message: `Remove whitespace.`,
    },
  ]);
});

test(`05 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<frame marginwidth="  600  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  equal(applyFixes(str, messages), `<frame marginwidth="600">`, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      message: `Remove whitespace.`,
    },
  ]);
});

test(`06 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and px`, () => {
  let str = `<frame marginwidth="50\tpx">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 22,
      idxTo: 25,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and %`, () => {
  let str = `<frame marginwidth="50\t%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 22,
      idxTo: 24,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<frame marginwidth="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 20,
      idxTo: 23,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, () => {
  let str = `<frame marginwidth="px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 20,
      idxTo: 22,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, () => {
  let str = `<frame marginwidth="%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 20,
      idxTo: 21,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`, () => {
  let str = `<frame marginwidth="6z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 21,
      idxTo: 22,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`, () => {
  let str = `<frame marginwidth="6 a z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 21,
      idxTo: 25,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, legit unit`, () => {
  let str = `<frame marginwidth="1a0%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 21,
      idxTo: 24,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, bad unit`, () => {
  let str = `<frame marginwidth="1a0z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 21,
      idxTo: 24,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, %`, () => {
  let str = `<frame marginwidth="100%%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 23,
      idxTo: 25,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`16 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, px`, () => {
  let str = `<frame marginwidth="100pxpx">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 23,
      idxTo: 27,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

// 03. wrong parent tag
// -----------------------------------------------------------------------------

test(`17 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<br marginwidth="100">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 4,
      idxTo: 21,
      fix: null,
    },
  ]);
});

test(`18 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz marginwidth="100">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "18.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 5,
      idxTo: 22,
      fix: null,
    },
  ]);
});

test.run();
