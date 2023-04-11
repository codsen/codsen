import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no noshade, error level 0`, () => {
  let str = "<hr><img>"; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no noshade, error level 1`, () => {
  let str = "<hr><img>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no noshade, error level 2`, () => {
  let str = "<hr><img>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy`, () => {
  let str = "<hr noshade>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = "<div noshade>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noshade",
      idxFrom: 5,
      idxTo: 12,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz noshade class="yyy">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noshade",
      idxFrom: 5,
      idxTo: 12,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - boolean value`, () => {
  let str = '<hr noshade="true">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), "<hr noshade>", "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noshade",
      idxFrom: 11,
      idxTo: 18,
      message: "Should have no value.",
      fix: {
        ranges: [[11, 18]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - boolean value`, () => {
  let str = "<hr noshade=true>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), "<hr noshade>", "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noshade",
      idxFrom: 11,
      idxTo: 16,
      message: "Should have no value.",
      fix: {
        ranges: [[11, 16]],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - empty value`, () => {
  let str = '<hr noshade="">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), "<hr noshade>", "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noshade",
      idxFrom: 11,
      idxTo: 14,
      message: "Should have no value.",
      fix: {
        ranges: [[11, 14]],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - value missing, equal present`, () => {
  let str = "<hr noshade=>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), "<hr noshade>", "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noshade",
      idxFrom: 11,
      idxTo: 12,
      message: "Should have no value.",
      fix: {
        ranges: [[11, 12]],
      },
    },
  ]);
});

// 04. XHTML
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - healthy noshade checkbox, as HTML`, () => {
  let str = "<hr noshade>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": [2, "xhtml"],
    },
  });
  // can fix:
  equal(applyFixes(str, messages), '<hr noshade="noshade">', "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noshade",
      idxFrom: 4,
      idxTo: 11,
      message: 'It\'s XHTML, add value, ="noshade".',
      fix: {
        ranges: [[11, 11, '="noshade"']],
      },
    },
  ]);
});

test(`12 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - missing after equal, as HTML`, () => {
  let str = "<hr noshade=/>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), '<hr noshade="noshade"/>', "12.01");
});

test(`13 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - closing quote and content missing, as HTML`, () => {
  let str = '<hr noshade =">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": [2, "xhtml"],
    },
  });
  equal(messages[0].fix.ranges, [[11, 14, '="noshade"']], "13.01");
  equal(applyFixes(str, messages), '<hr noshade="noshade">', "13.02");
});

test(`14 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - double quotes, no content, as HTML`, () => {
  let str = '<hr noshade=""/>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), '<hr noshade="noshade"/>', "14.01");
});

test(`15 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - single quotes, no content, as HTML`, () => {
  let str = "<hr noshade=''/>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), "<hr noshade='noshade'/>", "15.01");
});

test(`16 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - quotes with content missing, as HTML`, () => {
  let str = "<hr noshade='>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), "<hr noshade='noshade'>", "16.01");
});

test(`17 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = '<hr noshade"noshade"/>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), '<hr noshade="noshade"/>', "17.01");
});

test(`18 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = "<hr noshade'noshade'/>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noshade": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), "<hr noshade='noshade'/>", "18.01");
});

test.run();
