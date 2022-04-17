import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no compact, error level 0`, () => {
  let str = `<dir><ul>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no compact, error level 1`, () => {
  let str = `<dir><ul>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no compact, error level 2`, () => {
  let str = `<dir><ul>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy dir`, () => {
  let str = `<dir compact>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy dl`, () => {
  let str = `<dl compact>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test(`06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy menu`, () => {
  let str = `<menu compact>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy ol`, () => {
  let str = `<ol compact>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  equal(messages, [], "07.02");
});

test(`08 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy ul`, () => {
  let str = `<ul compact>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  equal(applyFixes(str, messages), str, "08.01");
  equal(messages, [], "08.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div compact>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-compact",
      idxFrom: 5,
      idxTo: 12,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz class="z" compact>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-compact",
      idxFrom: 15,
      idxTo: 22,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`, () => {
  let str = `<ul compact="true">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<ul compact>`, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-compact",
      idxFrom: 11,
      idxTo: 18,
      message: `Should have no value.`,
      fix: {
        ranges: [[11, 18]],
      },
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`, () => {
  let str = `<ul compact=true>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<ul compact>`, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-compact",
      idxFrom: 11,
      idxTo: 16,
      message: `Should have no value.`,
      fix: {
        ranges: [[11, 16]],
      },
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`, () => {
  let str = `<ul compact="">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), `<ul compact>`, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-compact",
      idxFrom: 11,
      idxTo: 14,
      message: `Should have no value.`,
      fix: {
        ranges: [[11, 14]],
      },
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`, () => {
  let str = `<ul compact=>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), `<ul compact>`, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-compact",
      idxFrom: 11,
      idxTo: 12,
      message: `Should have no value.`,
      fix: {
        ranges: [[11, 12]],
      },
    },
  ]);
});

// 04. XHTML
// -----------------------------------------------------------------------------

test(`15 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy compact checkbox, as HTML`, () => {
  let str = `<ul compact>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": [2, "xhtml"],
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<ul compact="compact">`, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-compact",
      idxFrom: 4,
      idxTo: 11,
      message: `It's XHTML, add value, ="compact".`,
      fix: {
        ranges: [[11, 11, `="compact"`]],
      },
    },
  ]);
});

test(`16 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`, () => {
  let str = `<ul compact=/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<ul compact="compact"/>`, "16");
});

test(`17 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`, () => {
  let str = `<ul compact =">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": [2, "xhtml"],
    },
  });
  equal(messages[0].fix.ranges, [[11, 14, `="compact"`]], "17.01");
  equal(applyFixes(str, messages), `<ul compact="compact">`, "17.02");
});

test(`18 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`, () => {
  let str = `<ul compact=""/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<ul compact="compact"/>`, "18");
});

test(`19 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`, () => {
  let str = `<ul compact=''/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<ul compact='compact'/>`, "19");
});

test(`20 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`, () => {
  let str = `<ul compact='>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<ul compact='compact'>`, "20");
});

test(`21 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = `<ul compact"compact"/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<ul compact="compact"/>`, "21");
});

test(`22 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = `<ul compact'compact'/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-compact": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<ul compact='compact'/>`, "22");
});

test.run();
