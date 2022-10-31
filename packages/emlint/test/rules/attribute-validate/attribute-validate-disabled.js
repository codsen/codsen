import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no disabled, error level 0`, () => {
  let str = `<button><div>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no disabled, error level 1`, () => {
  let str = `<button><div>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no disabled, error level 2`, () => {
  let str = `<button><div>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy button`, () => {
  let str = `<button disabled>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div disabled>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-disabled",
      idxFrom: 5,
      idxTo: 13,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz disabled class="yyy">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-disabled",
      idxFrom: 5,
      idxTo: 13,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`, () => {
  let str = `<button disabled="true">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<button disabled>`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-disabled",
      idxFrom: 16,
      idxTo: 23,
      message: `Should have no value.`,
      fix: {
        ranges: [[16, 23]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`, () => {
  let str = `<button disabled=true>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<button disabled>`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-disabled",
      idxFrom: 16,
      idxTo: 21,
      message: `Should have no value.`,
      fix: {
        ranges: [[16, 21]],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`, () => {
  let str = `<button disabled="">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), `<button disabled>`, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-disabled",
      idxFrom: 16,
      idxTo: 19,
      message: `Should have no value.`,
      fix: {
        ranges: [[16, 19]],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`, () => {
  let str = `<button disabled=>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), `<button disabled>`, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-disabled",
      idxFrom: 16,
      idxTo: 17,
      message: `Should have no value.`,
      fix: {
        ranges: [[16, 17]],
      },
    },
  ]);
});

// 04. XHTML
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy disabled checkbox, as HTML`, () => {
  let str = `<button disabled>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": [2, "xhtml"],
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<button disabled="disabled">`, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-disabled",
      idxFrom: 8,
      idxTo: 16,
      message: `It's XHTML, add value, ="disabled".`,
      fix: {
        ranges: [[16, 16, `="disabled"`]],
      },
    },
  ]);
});

test(`12 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`, () => {
  let str = `<button disabled=/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<button disabled="disabled"/>`, "12.01");
});

test(`13 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`, () => {
  let str = `<button disabled =">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": [2, "xhtml"],
    },
  });
  equal(messages[0].fix.ranges, [[16, 19, `="disabled"`]], "13.01");
  equal(applyFixes(str, messages), `<button disabled="disabled">`, "13.02");
});

test(`14 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`, () => {
  let str = `<button disabled=""/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<button disabled="disabled"/>`, "14.01");
});

test(`15 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`, () => {
  let str = `<button disabled=''/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<button disabled='disabled'/>`, "15.01");
});

test(`16 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`, () => {
  let str = `<button disabled='>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<button disabled='disabled'>`, "16.01");
});

test(`17 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = `<button disabled"disabled"/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<button disabled="disabled"/>`, "17.01");
});

test(`18 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = `<button disabled'disabled'/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-disabled": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<button disabled='disabled'/>`, "18.01");
});

test.run();
