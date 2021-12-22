import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no longdesc, error level 0`, () => {
  let str = `<img class="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-longdesc": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no longdesc, error level 1`, () => {
  let str = `<img class="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-longdesc": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no longdesc, error level 2`, () => {
  let str = `<img class="z">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-longdesc": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<frame longdesc='#w3htmlExplained'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-longdesc": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<iframe longdesc='#w3htmlExplained'>`; // <-- notice single quotes
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-longdesc": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test(`06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`, () => {
  let str = `<img src="w3html.gif" alt="W3S" width="100" height="132" longdesc="data:text/html;charset=utf-8;,%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3Ctitle%3EDescription%20of%20the%20Logo%3C/title%3E%3C/head%3E%3Cbody%3E%3Cp%3ESome%20description%20goes%20here%3C/body%3E%3C/html%3E">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-longdesc": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div longdesc="#something">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-longdesc": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-longdesc",
      idxFrom: 5,
      idxTo: 26,
      fix: null,
    },
  ]);
});

test(`08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz longdesc="#something" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-longdesc": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-longdesc",
      idxFrom: 5,
      idxTo: 26,
      fix: null,
    },
  ]);
});

// 03. whitespace
// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`, () => {
  let str = `<img longdesc="">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-longdesc": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-longdesc",
      idxFrom: 5,
      idxTo: 16,
      message: `Missing value.`,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - surrounding whitespace`, () => {
  let str = `<img longdesc=" #something ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-longdesc": 2,
    },
  });
  equal(applyFixes(str, messages), `<img longdesc="#something">`, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-longdesc",
      idxFrom: 15,
      idxTo: 27,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [15, 16],
          [26, 27],
        ],
      },
    },
  ]);
});

test.run();
