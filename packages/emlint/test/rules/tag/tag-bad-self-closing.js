import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";
// import { deepContains } from "ast-deep-contains");

// 1. basics
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - rule is off`, () => {
  let str = `<table/>`;
  let messages = verify(not, str, {
    rules: {
      "tag-bad-self-closing": 0,
    },
  });
  equal(messages, [], "01.01");
  equal(applyFixes(str, messages), str, "01.02");
});

test(`02 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - severity: warn`, () => {
  let str = `<table/>`;
  let fixed = `<table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-bad-self-closing": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-bad-self-closing",
        severity: 2,
        idxFrom: 6,
        idxTo: 7,
        message: "Remove the slash.",
        fix: {
          ranges: [[6, 7]],
        },
      },
    ],
    "02.01"
  );
  equal(applyFixes(str, messages), fixed, "02.01");
  equal(messages.length, 1, "02.02");
});

test(`03 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - with attributes`, () => {
  let str = `<table width="1" border="0" cellpadding="0" cellspacing="0"/>
  <tr/>
    <td/>
      x<br/>y
    </td/>
  </tr/>
</table/>`;
  let fixed = `<table width="1" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x<br/>y
    </td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-bad-self-closing": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "tag-bad-self-closing",
        message: "Remove the slash.",
        idxFrom: 59,
        idxTo: 60,
        fix: {
          ranges: [[59, 60]],
        },
      },
      {
        severity: 2,
        ruleId: "tag-bad-self-closing",
        message: "Remove the slash.",
        idxFrom: 67,
        idxTo: 68,
        fix: {
          ranges: [[67, 68]],
        },
      },
      {
        severity: 2,
        ruleId: "tag-bad-self-closing",
        message: "Remove the slash.",
        idxFrom: 77,
        idxTo: 78,
        fix: {
          ranges: [[77, 78]],
        },
      },
      {
        severity: 2,
        ruleId: "tag-bad-self-closing",
        message: "Remove the slash.",
        idxFrom: 102,
        idxTo: 103,
        fix: {
          ranges: [[102, 103]],
        },
      },
      {
        severity: 2,
        ruleId: "tag-bad-self-closing",
        message: "Remove the slash.",
        idxFrom: 111,
        idxTo: 112,
        fix: {
          ranges: [[111, 112]],
        },
      },
      {
        severity: 2,
        ruleId: "tag-bad-self-closing",
        message: "Remove the slash.",
        idxFrom: 121,
        idxTo: 122,
        fix: {
          ranges: [[121, 122]],
        },
      },
    ],
    "03.01"
  );
  equal(applyFixes(str, messages), fixed, "03.01");
  equal(messages.length, 6, "03.02");
});

test(`04 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - excessive whitespace in front`, () => {
  let str = `<div  />`;
  let fixed = `<div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-bad-self-closing": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "04.01");
  equal(messages.length, 1, "04.02");
});

test(`05 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - excessive whitespace in between`, () => {
  let str = `<div/    >`;
  let fixed = `<div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-bad-self-closing": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "05.01");
  equal(messages.length, 1, "05.02");
});

test(`06 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - excessive whitespace everywhere`, () => {
  let str = `<div   /    >`;
  let fixed = `<div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-bad-self-closing": 1,
    },
  });
  equal(applyFixes(str, messages), fixed, "06.01");
  equal(messages.length, 1, "06.02");
});

test(`07 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - really excessive whitespace everywhere`, () => {
  let str = `<div\t\t\t\n\n\n\r\r\r\t\t\t/\t\t\t\r\r\r\r\r\r\r\r\t\t\t\t\t>`;
  let fixed = `<div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-bad-self-closing": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "07.01");
  equal(messages.length, 1, "07.02");
});

test(`08 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - group rule "tag" should be sensible`, () => {
  let str = `<div   /    >`;
  let fixed = `<div>`;
  let messages = verify(not, str, {
    rules: {
      tag: 2, // <---------- all "tag-*" rules
    },
  });
  equal(applyFixes(str, messages), fixed, "08.01");
});

test(`09 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - "all rules" setting should be sensible`, () => {
  let str = `<div   /    >`;
  let fixed = `<div>`;
  let messages = verify(not, str, {
    rules: {
      all: 2, // <---------- all rules
    },
  });
  equal(applyFixes(str, messages), fixed, "09.01");
});

test.run();
