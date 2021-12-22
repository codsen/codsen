import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no type, error level 0`, () => {
  let str = `<a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no type, error level 1`, () => {
  let str = `<a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no type, error level 2`, () => {
  let str = `<a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, a`, () => {
  let str = `<a type='application/json'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - fancy MIME from the list`, () => {
  let str = `<a type="application/vnd.openxmlformats-officedocument.presentationml.template.main+xml">`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test(`06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, input`, () => {
  let str = `<input type="password">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, li`, () => {
  let str = `<li type="disc">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  equal(messages, [], "07.02");
});

test(`08 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, ol`, () => {
  let str = `<ol type="1">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  equal(applyFixes(str, messages), str, "08.01");
  equal(messages, [], "08.02");
});

test(`09 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, ul`, () => {
  let str = `<ul type="square">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  equal(applyFixes(str, messages), str, "09.01");
  equal(messages, [], "09.02");
});

test(`10 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, button`, () => {
  let str = `<button type="reset">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  equal(applyFixes(str, messages), str, "10.01");
  equal(messages, [], "10.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<a type=" application/json">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  equal(applyFixes(str, messages), `<a type="application/json">`, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 9,
      idxTo: 10,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[9, 10]],
      },
    },
  ]);
});

test(`12 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<a type="application/json ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  equal(applyFixes(str, messages), `<a type="application/json">`, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 25,
      idxTo: 26,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[25, 26]],
      },
    },
  ]);
});

test(`13 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<a type="  application/json \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  equal(applyFixes(str, messages), `<a type="application/json">`, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 9,
      idxTo: 29,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [9, 11],
          [27, 29],
        ],
      },
    },
  ]);
});

test(`14 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<a type="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 9,
      idxTo: 12,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`15 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, a`, () => {
  let str = `<a type="tralala">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 9,
      idxTo: 16,
      message: `Unrecognised value: "tralala".`,
      fix: null,
    },
  ]);
});

test(`16 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, input`, () => {
  let str = `<input type="circle">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 13,
      idxTo: 19,
      message: `Unrecognised value: "circle".`,
      fix: null,
    },
  ]);
});

test(`17 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, li`, () => {
  let str = `<li type="text">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 10,
      idxTo: 14,
      message: `Unrecognised value: "text".`,
      fix: null,
    },
  ]);
});

test(`18 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, ol`, () => {
  let str = `<ol type="text">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "18.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 10,
      idxTo: 14,
      message: `Should be "1|a|A|i|I".`,
      fix: null,
    },
  ]);
});

test(`19 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, ul`, () => {
  let str = `<ul type="text">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "19.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 10,
      idxTo: 14,
      message: `Should be "disc|square|circle".`,
      fix: null,
    },
  ]);
});

test(`20 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - an out-of-whack value, button`, () => {
  let str = `<button type="circle">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "20.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 14,
      idxTo: 20,
      message: `Should be "button|submit|reset".`,
      fix: null,
    },
  ]);
});

// 04. wrong parent tag
// -----------------------------------------------------------------------------

test(`21 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div type="application/json">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "21.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 5,
      idxTo: 28,
      fix: null,
    },
  ]);
});

test(`22 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz type="application/json" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-type": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "22.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-type",
      idxFrom: 5,
      idxTo: 28,
      fix: null,
    },
  ]);
});

test.run();
