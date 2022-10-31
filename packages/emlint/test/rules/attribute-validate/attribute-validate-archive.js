import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no archive, error level 0`, () => {
  [`<applet>`, `<object>`].forEach((tag) => {
    let linter = new Linter();
    let messages = linter.verify(tag, {
      rules: {
        "attribute-validate-archive": 0,
      },
    });
    equal(applyFixes(tag, messages), tag);
    equal(messages, []);
  });
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no archive, error level 1`, () => {
  [`<applet>`, `<object>`].forEach((tag) => {
    let linter = new Linter();
    let messages = linter.verify(tag, {
      rules: {
        "attribute-validate-archive": 1,
      },
    });
    equal(applyFixes(tag, messages), tag);
    equal(messages, []);
  });
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no archive, error level 2`, () => {
  [`<applet>`, `<object>`].forEach((tag) => {
    let linter = new Linter();
    let messages = linter.verify(tag, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    equal(applyFixes(tag, messages), tag);
    equal(messages, []);
  });
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy archive, applet`, () => {
  let str = `<applet class='zz' archive='https://codsen.com,https://detergent.io' id='yy aa'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy archive, object`, () => {
  let str = `<object class='zz' archive='https://codsen.com https://detergent.io' id='yy aa'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`, () => {
  let str = `<applet archive=" https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    `<applet archive="https://codsen.com">`,
    "06.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 17,
      idxTo: 18,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[17, 18]],
      },
    },
  ]);
});

test(`07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`, () => {
  let str = `<applet archive="https://codsen.com ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    `<applet archive="https://codsen.com">`,
    "07.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 35,
      idxTo: 36,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[35, 36]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around - 6 digit object`, () => {
  let str = `<applet archive="  https://codsen.com  ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    `<applet archive="https://codsen.com">`,
    "08.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 17,
      idxTo: 39,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [17, 19],
          [37, 39],
        ],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = `<applet archive="  \t">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 17,
      idxTo: 20,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - empty value`, () => {
  let str = `<applet archive="">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 8,
      idxTo: 18,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

// 03. applet tag
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - healthy`, () => {
  let str = `<applet class='zz' archive='http://codsen.com,https://detergent.io' id='yy aa'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  equal(applyFixes(str, messages), str, "11.01");
  equal(messages, [], "11.02");
});

test(`12 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - one unrecognised`, () => {
  let str = `<applet archive="http://codsen.com,trala..">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 35,
      idxTo: 42,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - one unrecognised`, () => {
  let str = `<applet archive="abc.,def.">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 17,
      idxTo: 21,
      message: `Should be an URI.`,
      fix: null,
    },
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 22,
      idxTo: 26,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - legit URI's but space-separated`, () => {
  let str = `<applet archive="https://codsen.com https://detergent.io">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 35,
      idxTo: 36,
      message: `Bad whitespace.`,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - typos`, () => {
  let str = `<applet archive=",http://codsen.com, tralal. , ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  // can fix:
  equal(
    applyFixes(str, messages),
    `<applet archive="http://codsen.com,tralal.">`,
    "15.01"
  );
  compare(ok, messages, [
    {
      idxFrom: 46,
      idxTo: 47,
      message: "Remove whitespace.",
      fix: {
        ranges: [[46, 47]],
      },
      ruleId: "attribute-validate-archive",
    },
    {
      idxFrom: 17,
      idxTo: 18,
      message: "Remove separator.",
      fix: {
        ranges: [[17, 18]],
      },
      ruleId: "attribute-validate-archive",
    },
    {
      idxFrom: 36,
      idxTo: 37,
      message: "Remove whitespace.",
      fix: {
        ranges: [[36, 37]],
      },
      ruleId: "attribute-validate-archive",
    },
    {
      idxFrom: 37,
      idxTo: 44,
      message: "Should be an URI.",
      fix: null,
      ruleId: "attribute-validate-archive",
    },
    {
      idxFrom: 44,
      idxTo: 45,
      message: "Remove whitespace.",
      fix: {
        ranges: [[44, 45]],
      },
      ruleId: "attribute-validate-archive",
    },
    {
      idxFrom: 45,
      idxTo: 46,
      message: "Remove separator.",
      fix: {
        ranges: [[45, 46]],
      },
      ruleId: "attribute-validate-archive",
    },
  ]);
});

// 04. object tag
// -----------------------------------------------------------------------------

test(`16 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - healthy`, () => {
  let str = `<object class='zz' archive='http://codsen.com https://detergent.io' id='yy aa'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  equal(applyFixes(str, messages), str, "16.01");
  equal(messages, [], "16.02");
});

test(`17 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - unrecognised URI`, () => {
  let str = `<object archive="tralala.">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 17,
      idxTo: 25,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`18 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - legit URI but comma-separated`, () => {
  let str = `<object archive="https://codsen.com,https://detergent.io">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "18.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 17,
      idxTo: 56,
      message: `URI's should be separated with a single space.`,
      fix: null,
    },
  ]);
});

test(`19 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - legit URI but comma-separated`, () => {
  let str = `<object archive="https://codsen.com, https://detergent.io">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "19.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-archive",
      idxFrom: 35,
      idxTo: 36,
      message: `No commas.`,
      fix: null,
    },
  ]);
});

test.run();
