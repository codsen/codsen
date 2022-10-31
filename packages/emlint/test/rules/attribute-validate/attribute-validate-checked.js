import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no checked, error level 0`, () => {
  let str = `<form><input>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no checked, error level 1`, () => {
  let str = `<form><input>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no checked, error level 2`, () => {
  let str = `<form><input>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy checked checkbox`, () => {
  let str = `<input type="checkbox" checked>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy checked radio`, () => {
  let str = `<input type="radio" checked>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test(`06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy unchecked checkbox`, () => {
  let str = `<input type="checkbox">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy unchecked radio`, () => {
  let str = `<input type="radio">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  equal(messages, [], "07.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div checked>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-checked",
      idxFrom: 5,
      idxTo: 12,
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz class="z" checked>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-checked",
      idxFrom: 15,
      idxTo: 22,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div type="radio" checked>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-checked",
      idxFrom: 18,
      idxTo: 25,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz type="radio" class="z" checked>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-checked",
      idxFrom: 28,
      idxTo: 35,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`12 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`, () => {
  let str = `<input type="radio" checked="true">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<input type="radio" checked>`, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-checked",
      idxFrom: 27,
      idxTo: 34,
      message: `Should have no value.`,
      fix: {
        ranges: [[27, 34]],
      },
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`, () => {
  let str = `<input type="radio" checked=true>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<input type="radio" checked>`, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-checked",
      idxFrom: 27,
      idxTo: 32,
      message: `Should have no value.`,
      fix: {
        ranges: [[27, 32]],
      },
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`, () => {
  let str = `<input type="radio" checked="">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), `<input type="radio" checked>`, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-checked",
      idxFrom: 27,
      idxTo: 30,
      message: `Should have no value.`,
      fix: {
        ranges: [[27, 30]],
      },
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`, () => {
  let str = `<input type="radio" checked=>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), `<input type="radio" checked>`, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-checked",
      idxFrom: 27,
      idxTo: 28,
      message: `Should have no value.`,
      fix: {
        ranges: [[27, 28]],
      },
    },
  ]);
});

test(`16 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - wrong type`, () => {
  let str = `<input type="month" checked>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-checked",
      idxFrom: 13,
      idxTo: 18,
      message: `Only tags with "checkbox" or "radio" attributes can be checked.`,
      fix: null,
    },
  ]);
});

// 04. XHTML
// -----------------------------------------------------------------------------

test(`17 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy checked checkbox, as HTML`, () => {
  let str = `<input type="checkbox" checked>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": [2, "xhtml"],
    },
  });
  // can fix:
  equal(
    applyFixes(str, messages),
    `<input type="checkbox" checked="checked">`,
    "17.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-checked",
      idxFrom: 23,
      idxTo: 30,
      message: `It's XHTML, add value, ="checked".`,
      fix: {
        ranges: [[30, 30, `="checked"`]],
      },
    },
  ]);
});

test(`18 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy checked radio, as HTML`, () => {
  let str = `<input type="radio" checked>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": [2, "xhtml"],
    },
  });
  equal(
    applyFixes(str, messages),
    `<input type="radio" checked="checked">`,
    "18.01"
  );
});

test(`19 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`, () => {
  let str = `<input type="radio" checked=/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": [2, "xhtml"],
    },
  });
  equal(
    applyFixes(str, messages),
    `<input type="radio" checked="checked"/>`,
    "19.01"
  );
});

test(`20 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`, () => {
  let str = `<input type="radio" checked =">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": [2, "xhtml"],
    },
  });
  equal(messages[0].fix.ranges, [[27, 30, `="checked"`]], "20.01");
  equal(
    applyFixes(str, messages),
    `<input type="radio" checked="checked">`,
    "20.02"
  );
});

test(`21 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`, () => {
  let str = `<input type="radio" checked=""/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": [2, "xhtml"],
    },
  });
  equal(
    applyFixes(str, messages),
    `<input type="radio" checked="checked"/>`,
    "21.01"
  );
});

test(`22 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`, () => {
  let str = `<input type="radio" checked=''/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": [2, "xhtml"],
    },
  });
  equal(
    applyFixes(str, messages),
    `<input type="radio" checked='checked'/>`,
    "22.01"
  );
});

test(`23 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`, () => {
  let str = `<input type="radio" checked='>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": [2, "xhtml"],
    },
  });
  equal(
    applyFixes(str, messages),
    `<input type="radio" checked='checked'>`,
    "23.01"
  );
});

test(`24 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = `<input type="radio" checked"checked"/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": [2, "xhtml"],
    },
  });
  equal(
    applyFixes(str, messages),
    `<input type="radio" checked="checked"/>`,
    "24.01"
  );
});

test(`25 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = `<input type="radio" checked'checked'/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-checked": [2, "xhtml"],
    },
  });
  equal(
    applyFixes(str, messages),
    `<input type="radio" checked='checked'/>`,
    "25.01"
  );
});

test.run();
