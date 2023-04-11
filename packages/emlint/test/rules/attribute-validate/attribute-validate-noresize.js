import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no noresize, error level 0`, () => {
  let str = "<frame><img>"; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no noresize, error level 1`, () => {
  let str = "<frame><img>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no noresize, error level 2`, () => {
  let str = "<frame><img>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy`, () => {
  let str = "<frame noresize>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = "<div noresize>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noresize",
      idxFrom: 5,
      idxTo: 13,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz noresize class="yyy">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noresize",
      idxFrom: 5,
      idxTo: 13,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - boolean value`, () => {
  let str = '<frame noresize="true">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), "<frame noresize>", "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noresize",
      idxFrom: 15,
      idxTo: 22,
      message: "Should have no value.",
      fix: {
        ranges: [[15, 22]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - boolean value`, () => {
  let str = "<frame noresize=true>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": 2,
    },
  });
  // can fix:
  equal(applyFixes(str, messages), "<frame noresize>", "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noresize",
      idxFrom: 15,
      idxTo: 20,
      message: "Should have no value.",
      fix: {
        ranges: [[15, 20]],
      },
    },
  ]);
});

test(`09 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - empty value`, () => {
  let str = '<frame noresize="">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), "<frame noresize>", "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noresize",
      idxFrom: 15,
      idxTo: 18,
      message: "Should have no value.",
      fix: {
        ranges: [[15, 18]],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - value missing, equal present`, () => {
  let str = "<frame noresize=>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), "<frame noresize>", "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noresize",
      idxFrom: 15,
      idxTo: 16,
      message: "Should have no value.",
      fix: {
        ranges: [[15, 16]],
      },
    },
  ]);
});

// 04. XHTML
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - healthy noresize checkbox, as HTML`, () => {
  let str = "<frame noresize>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": [2, "xhtml"],
    },
  });
  // can fix:
  equal(applyFixes(str, messages), '<frame noresize="noresize">', "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-noresize",
      idxFrom: 7,
      idxTo: 15,
      message: 'It\'s XHTML, add value, ="noresize".',
      fix: {
        ranges: [[15, 15, '="noresize"']],
      },
    },
  ]);
});

test(`12 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - missing after equal, as HTML`, () => {
  let str = "<frame noresize=/>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), '<frame noresize="noresize"/>', "12.01");
});

test(`13 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - closing quote and content missing, as HTML`, () => {
  let str = '<frame noresize =">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": [2, "xhtml"],
    },
  });
  equal(messages[0].fix.ranges, [[15, 18, '="noresize"']], "13.01");
  equal(applyFixes(str, messages), '<frame noresize="noresize">', "13.02");
});

test(`14 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - double quotes, no content, as HTML`, () => {
  let str = '<frame noresize=""/>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), '<frame noresize="noresize"/>', "14.01");
});

test(`15 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - single quotes, no content, as HTML`, () => {
  let str = "<frame noresize=''/>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), "<frame noresize='noresize'/>", "15.01");
});

test(`16 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - quotes with content missing, as HTML`, () => {
  let str = "<frame noresize='>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), "<frame noresize='noresize'>", "16.01");
});

test(`17 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = '<frame noresize"noresize"/>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), '<frame noresize="noresize"/>', "17.01");
});

test(`18 - ${`\u001b[${34}m${"XHTML"}\u001b[${39}m`} - equal missing, otherwise healthy HTML`, () => {
  let str = "<frame noresize'noresize'/>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-noresize": [2, "xhtml"],
    },
  });
  equal(applyFixes(str, messages), "<frame noresize='noresize'/>", "18.01");
});

test.run();
