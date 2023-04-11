/* eslint @typescript-eslint/prefer-optional-chain:0 */
import { test } from "uvu";

// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no style, error level 0`, () => {
  let str = "<td>";
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no style, error level 1`, () => {
  let str = "<td>";
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no style, error level 2`, () => {
  let str = "<td>";
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy style, zero`, () => {
  let str = "<td style='font-size: 10px;'>";
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no value`, () => {
  let str = '<td style="">';
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-style",
      idxFrom: 4,
      idxTo: 12,
      message: "Missing value.",
      fix: null,
    },
  ]);

  equal(messages.length, 1, "05.02");
});

test(`06 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - only trimmable whitespace as a value`, () => {
  let str = '<td style="  \t">';
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-style",
      idxFrom: 4,
      idxTo: 15,
      message: "Missing value.",
      fix: null,
    },
  ]);

  equal(messages.length, 1, "06.02");
});

// 02. rogue whitespace
// -----------------------------------------------------------------------------

test("07 - space in front", () => {
  let str = '<td style=" font-size: 10px;">';
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(applyFixes(str, messages), '<td style="font-size: 10px;">', "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-style",
      idxFrom: 11,
      idxTo: 12,
      message: "Remove whitespace.",
      fix: {
        ranges: [[11, 12]],
      },
    },
  ]);

  equal(messages.length, 1, "07.02");
});

test("08 - space after", () => {
  let str = '<td style="font-size: 10px; ">';
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(applyFixes(str, messages), '<td style="font-size: 10px;">', "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-style",
      idxFrom: 27,
      idxTo: 28,
      message: "Remove whitespace.",
      fix: {
        ranges: [[27, 28]],
      },
    },
  ]);

  equal(messages.length, 1, "08.02");
});

test("09 - copious whitespace around", () => {
  let str = '<td style="  font-size: 10px;  ">';
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(applyFixes(str, messages), '<td style="font-size: 10px;">', "09.01");
});

test("10 - whitespace inbetween", () => {
  let str = '<td style="font-size:  10px;"></td>';
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    '<td style="font-size: 10px;"></td>',
    "10.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-style",
      idxFrom: 11,
      idxTo: 28,
      message: "Remove whitespace.",
      fix: {
        ranges: [[22, 23]],
      },
    },
  ]);

  equal(messages.length, 1, "10.02");
});

test("11 - tab inbetween", () => {
  let str = '<td style="font-size:\t10px;"></td>';
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    '<td style="font-size: 10px;"></td>',
    "11.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-style",
      idxFrom: 21,
      idxTo: 22,
      message: "Replace whitespace.",
      fix: {
        ranges: [[21, 22, " "]],
      },
    },
  ]);

  equal(messages.length, 1, "11.02");
});

test("12 - tab inbetween", () => {
  let str = '<td style="font-size:\t 10px;"></td>';
  let fixed = '<td style="font-size: 10px;"></td>';
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "12.01");
});

test("13 - tab inbetween", () => {
  let str = '<td style="font-size: \t10px;"></td>';
  let fixed = '<td style="font-size: 10px;"></td>';
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "13.01");
});

// wrong parent tag
// -----------------------------------------------------------------------------

test(`14 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - wrong parent tag`, () => {
  let str = '<html style="font-size: 10px;">';
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-style",
      idxFrom: 6,
      idxTo: 30,
      fix: null,
    },
  ]);

  equal(messages.length, 1, "14.02");
});

// rogue semi
// -----------------------------------------------------------------------------

test("15 - two semis, tight", () => {
  let str = '<div style="float: left;;"></div>';
  let fixed = '<div style="float: left;"></div>';
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "15.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-style",
      idxFrom: 24,
      idxTo: 25,
      message: "Rogue semicolon.",
      fix: { ranges: [[24, 25]] },
    },
  ]);

  equal(messages.length, 1, "15.02");
});

// ESP tokens
// -----------------------------------------------------------------------------

test("16 - don't add semi after ESP tokens", () => {
  let str = `<td style="color: red;
    {% if so %}text-align: left;{% endif %}
float: left;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  equal(applyFixes(str, messages), str, "16.01");
});

test.run();
