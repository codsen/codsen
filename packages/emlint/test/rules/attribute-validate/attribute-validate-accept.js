import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accept, error level 0`, () => {
  let str = `<form>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accept, error level 1`, () => {
  let str = `<input>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accept, error level 2`, () => {
  let str = `<input>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, wildcard`, () => {
  let str = `<input accept='image/*'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, file extension`, () => {
  let str = `<input accept=".jpg">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test(`06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, spelled out type`, () => {
  let str = `<input accept="text/css">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - fancy MIME from the list`, () => {
  let str = `<input accept="application/vnd.openxmlformats-officedocument.presentationml.template.main+xml">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  equal(messages, [], "07.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<input accept=" .jpg">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  equal(applyFixes(str, messages), `<input accept=".jpg">`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept",
      idxFrom: 15,
      idxTo: 16,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[15, 16]],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<input accept=".jpg ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  equal(applyFixes(str, messages), `<input accept=".jpg">`, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept",
      idxFrom: 19,
      idxTo: 20,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[19, 20]],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<input accept="  .jpg \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  equal(applyFixes(str, messages), `<input accept=".jpg">`, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept",
      idxFrom: 15,
      idxTo: 23,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [15, 17],
          [21, 23],
        ],
      },
    },
  ]);
});

test(`11 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<input accept="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept",
      idxFrom: 15,
      idxTo: 18,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`12 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - spaces after comma`, () => {
  let str = `<input accept=".jpg, .gif, .png">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  equal(applyFixes(str, messages), `<input accept=".jpg,.gif,.png">`, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept",
      idxFrom: 20,
      idxTo: 21,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[20, 21]],
      },
    },
    {
      ruleId: "attribute-validate-accept",
      idxFrom: 26,
      idxTo: 27,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[26, 27]],
      },
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - out of whack value`, () => {
  let str = `<input accept="tralala">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept",
      idxFrom: 15,
      idxTo: 22,
      message: `Unrecognised value: "tralala".`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - legit string with extras`, () => {
  let str = `<input accept="..jpg">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept",
      idxFrom: 15,
      idxTo: 20,
      message: `Unrecognised value: "..jpg".`,
      fix: null,
    },
  ]);
});

// 04. wrong parent tag
// -----------------------------------------------------------------------------

test(`15 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div accept=".jpg">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept",
      idxFrom: 5,
      idxTo: 18,
      fix: null,
    },
  ]);
});

test(`16 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz accept=".jpg" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-accept": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-accept",
      idxFrom: 5,
      idxTo: 18,
      fix: null,
    },
  ]);
});

test.run();
