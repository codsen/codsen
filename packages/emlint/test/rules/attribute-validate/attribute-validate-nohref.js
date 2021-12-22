import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";

import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no nohref, error level 0`, () => {
  let str = `<area><img>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no nohref, error level 1`, () => {
  let str = `<area><img>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no nohref, error level 2`, () => {
  let str = `<area><img>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy img`, () => {
  let str = `<area nohref>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div nohref>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-nohref",
      idxFrom: 5,
      idxTo: 11,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz nohref class="yyy">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-nohref",
      idxFrom: 5,
      idxTo: 11,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`, () => {
  let str = `<area nohref="true">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<area nohref>`, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-nohref",
      idxFrom: 12,
      idxTo: 19,
      message: `Should have no value.`,
      fix: {
        ranges: [[12, 19]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - boolean value`, () => {
  let str = `<area nohref=true>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<area nohref>`, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-nohref",
      idxFrom: 12,
      idxTo: 17,
      message: `Should have no value.`,
      fix: {
        ranges: [[12, 17]],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`, () => {
  let str = `<area nohref="">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), `<area nohref>`, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-nohref",
      idxFrom: 12,
      idxTo: 15,
      message: `Should have no value.`,
      fix: {
        ranges: [[12, 15]],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - value missing, equal present`, () => {
  let str = `<area nohref=>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), `<area nohref>`, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-nohref",
      idxFrom: 12,
      idxTo: 13,
      message: `Should have no value.`,
      fix: {
        ranges: [[12, 13]],
      },
    },
  ]);
});

// 04. XHTML
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - healthy nohref checkbox, as HTML`, () => {
  let str = `<area nohref>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": [2, "xhtml"],
    },
  });
  // can fix:
  equal(applyFixes(str, messages), `<area nohref="nohref">`, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-nohref",
      idxFrom: 6,
      idxTo: 12,
      message: `It's XHTML, add value, ="nohref".`,
      fix: {
        ranges: [[12, 12, `="nohref"`]],
      },
    },
  ]);
});

test(`12 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - missing after equal, as HTML`, () => {
  let str = `<area nohref=/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<area nohref="nohref"/>`, "12");
});

test(`13 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - closing quote and content missing, as HTML`, () => {
  let str = `<area nohref =">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": [2, "xhtml"],
    },
  });
  equal(messages[0].fix.ranges, [[12, 15, `="nohref"`]], "13.01");
  equal(applyFixes(str, messages), `<area nohref="nohref">`, "13.02");
});

test(`14 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - double quotes, no content, as HTML`, () => {
  let str = `<area nohref=""/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<area nohref="nohref"/>`, "14");
});

test(`15 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - single quotes, no content, as HTML`, () => {
  let str = `<area nohref=''/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<area nohref='nohref'/>`, "15");
});

test(`16 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - quotes with content missing, as HTML`, () => {
  let str = `<area nohref='>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<area nohref='nohref'>`, "16");
});

test(`17 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = `<area nohref"nohref"/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<area nohref="nohref"/>`, "17");
});

test(`18 - ${`\u001b[${34}m${`XHTML`}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = `<area nohref'nohref'/>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-nohref": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), `<area nohref='nohref'/>`, "18");
});

test.run();
