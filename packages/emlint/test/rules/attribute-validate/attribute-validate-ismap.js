import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no ismap, error level 0`, () => {
  let str = `<div><img>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no ismap, error level 1`, () => {
  let str = `<div><img>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no ismap, error level 2`, () => {
  let str = `<div><img>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy img`, () => {
  let str = `<img ismap>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy input`, () => {
  let str = `<input ismap>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div ismap>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-ismap",
      idxFrom: 5,
      idxTo: 10,
      fix: null,
    },
  ]);
});

test(`07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz ismap class="yyy">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-ismap",
      idxFrom: 5,
      idxTo: 10,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`, () => {
  let str = `<img ismap="true">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<img ismap>`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-ismap",
      idxFrom: 10,
      idxTo: 17,
      message: `Should have no value.`,
      fix: {
        ranges: [[10, 17]],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`, () => {
  let str = `<img ismap=true>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<img ismap>`, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-ismap",
      idxFrom: 10,
      idxTo: 15,
      message: `Should have no value.`,
      fix: {
        ranges: [[10, 15]],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`, () => {
  let str = `<img ismap="">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), `<img ismap>`, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-ismap",
      idxFrom: 10,
      idxTo: 13,
      message: `Should have no value.`,
      fix: {
        ranges: [[10, 13]],
      },
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`, () => {
  let str = `<img ismap=>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), `<img ismap>`, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-ismap",
      idxFrom: 10,
      idxTo: 11,
      message: `Should have no value.`,
      fix: {
        ranges: [[10, 11]],
      },
    },
  ]);
});

// 04. XHTML
// -----------------------------------------------------------------------------

test(`12 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy ismap checkbox, as HTML`, () => {
  let str = `<img ismap>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": [2, "xhtml"],
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<img ismap="ismap">`, "12.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-ismap",
      idxFrom: 5,
      idxTo: 10,
      message: `It's XHTML, add value, ="ismap".`,
      fix: {
        ranges: [[10, 10, `="ismap"`]],
      },
    },
  ]);
});

test(`13 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`, () => {
  let str = `<img ismap=/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<img ismap="ismap"/>`, "13.01");
});

test(`14 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`, () => {
  let str = `<img ismap =">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": [2, "xhtml"],
    },
  });
  equal(messages[0].fix.ranges, [[10, 13, `="ismap"`]], "14.01");
  equal(applyFixes(str, messages), `<img ismap="ismap">`, "14.02");
});

test(`15 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`, () => {
  let str = `<img ismap=""/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<img ismap="ismap"/>`, "15.01");
});

test(`16 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`, () => {
  let str = `<img ismap=''/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<img ismap='ismap'/>`, "16.01");
});

test(`17 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`, () => {
  let str = `<img ismap='>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<img ismap='ismap'>`, "17.01");
});

test(`18 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = `<img ismap"ismap"/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<img ismap="ismap"/>`, "18.01");
});

test(`19 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = `<img ismap'ismap'/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-ismap": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<img ismap='ismap'/>`, "19.01");
});

test.run();
