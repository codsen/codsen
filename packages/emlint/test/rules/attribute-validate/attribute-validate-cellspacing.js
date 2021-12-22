import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cellspacing, error level 0`, () => {
  let str = `<table>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cellspacing, error level 1`, () => {
  let str = `<table>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cellspacing, error level 2`, () => {
  let str = `<table>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy cellspacing, px without units`, () => {
  let str = `<table cellspacing='0'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy cellspacing, percentages`, () => {
  let str = `<table cellspacing="10%">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<table cellspacing=" 0">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  equal(applyFixes(str, messages), `<table cellspacing="0">`, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-cellspacing",
      idxFrom: 20,
      idxTo: 21,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[20, 21]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<table cellspacing="0 ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  equal(applyFixes(str, messages), `<table cellspacing="0">`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-cellspacing",
      idxFrom: 21,
      idxTo: 22,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[21, 22]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<table cellspacing="  0  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  equal(applyFixes(str, messages), `<table cellspacing="0">`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-cellspacing",
      idxFrom: 20,
      idxTo: 25,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [20, 22],
          [23, 25],
        ],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<table cellspacing="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-cellspacing",
      idxFrom: 20,
      idxTo: 23,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - string as value`, () => {
  let str = `<table cellspacing="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-cellspacing",
      idxFrom: 20,
      idxTo: 21,
      message: `Should be integer, either no units or percentage.`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - dot as value`, () => {
  let str = `<table cellspacing=".">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-cellspacing",
      idxFrom: 20,
      idxTo: 21,
      message: `Should be integer, either no units or percentage.`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - a rational number`, () => {
  let str = `<table cellspacing="1.5">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-cellspacing",
      idxFrom: 21, // <--- starts at the first non-digit char
      idxTo: 23,
      message: `Should be integer, either no units or percentage.`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - with units`, () => {
  let str = `<table cellspacing="1px">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), `<table cellspacing="1">`, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-cellspacing",
      idxFrom: 21, // <--- starts at the first non-digit char
      idxTo: 23,
      message: `Remove px.`,
      fix: {
        ranges: [[21, 23]],
      },
    },
  ]);
});

// 04. wrong parent tag
// -----------------------------------------------------------------------------

test(`14 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div cellspacing="0">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-cellspacing",
      idxFrom: 5,
      idxTo: 20,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz cellspacing="0" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellspacing": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-cellspacing",
      idxFrom: 5,
      idxTo: 20,
      fix: null,
    },
  ]);
});

test.run();
