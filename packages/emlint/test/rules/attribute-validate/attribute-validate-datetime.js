import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no datetime, error level 0`, () => {
  let str = `<del><ins>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no datetime, error level 1`, () => {
  let str = `<del><ins>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no datetime, error level 2`, () => {
  let str = `<del><ins>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy ISO date, no milliseconds`, () => {
  let str = `<del datetime="2019-12-30T22:55:03Z">This text has been deleted</del>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy ISO date, no milliseconds`, () => {
  let str = `<ins datetime="2011-10-05T14:48:00.000Z">This text has been inserted</del>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<del datetime=" 2019-12-30T22:33:44Z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    `<del datetime="2019-12-30T22:33:44Z">`,
    "06.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-datetime",
      idxFrom: 15,
      idxTo: 16,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[15, 16]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<del datetime="2019-12-30T22:33:44Z ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    `<del datetime="2019-12-30T22:33:44Z">`,
    "07.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-datetime",
      idxFrom: 35,
      idxTo: 36,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[35, 36]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`, () => {
  let str = `<del datetime="  2019-12-30T22:33:44Z  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    `<del datetime="2019-12-30T22:33:44Z">`,
    "08.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-datetime",
      idxFrom: 15,
      idxTo: 40,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [15, 17],
          [37, 40],
        ],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<del datetime="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-datetime",
      idxFrom: 15,
      idxTo: 18,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - out of whack value`, () => {
  let str = `<del datetime="tralala">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-datetime",
      idxFrom: 15,
      idxTo: 22,
      message: `Unrecognised value: "tralala".`,
      fix: null,
    },
  ]);
});

// 04. wrong parent tag
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div datetime="2019-12-30T22:33:44Z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-datetime",
      idxFrom: 5,
      idxTo: 36,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz datetime="2019-12-30T22:33:44Z" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-datetime": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-datetime",
      idxFrom: 5,
      idxTo: 36,
      fix: null,
    },
  ]);
});

test.run();
