import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// RULE IS TRIGGERED DIRECTLY FROM PARSER!
// IT'S SOURCE IS IN CODSEN-PARSER, NOT IN src/rules/tag/tag-missing-closing.js

// REMEMBER TO UPDATE src/util/nonFileBasedTagRules.json WHEN YOU ADD SIMILAR RULES

// 01. basic
// -----------------------------------------------------------------------------

test(`01 - off`, () => {
  let str = "z <div>";
  let messages = verify(not, str, {
    rules: {
      "tag-missing-closing": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - warn`, () => {
  let str = "z <div>";
  let messages = verify(not, str, {
    rules: {
      "tag-missing-closing": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-missing-closing",
        severity: 1,
        idxFrom: 2,
        idxTo: 7,
        message: `Closing tag is missing.`,
        fix: null,
      },
    ],
    "02.02"
  );
});

test(`03 - err`, () => {
  let str = "z <div>";
  let messages = verify(not, str, {
    rules: {
      "tag-missing-closing": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-missing-closing",
        severity: 2,
        idxFrom: 2,
        idxTo: 7,
        message: `Closing tag is missing.`,
        fix: null,
      },
    ],
    "03.02"
  );
});

test(`04 - via blanket rule, severity 1`, () => {
  let str = "z <div>";
  let messages = verify(not, str, {
    rules: {
      tag: 1,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-missing-closing",
        severity: 1,
        idxFrom: 2,
        idxTo: 7,
        message: `Closing tag is missing.`,
        fix: null,
      },
    ],
    "04.02"
  );
});

test(`05 - via blanket rule, severity 2`, () => {
  let str = "z <div>";
  let messages = verify(not, str, {
    rules: {
      tag: 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-missing-closing",
        severity: 2,
        idxFrom: 2,
        idxTo: 7,
        message: `Closing tag is missing.`,
        fix: null,
      },
    ],
    "05.02"
  );
});

test(`06 - no issue here`, () => {
  let str = "<style>\n\n</style>";
  let messages = verify(not, str, {
    rules: {
      "tag-missing-closing": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - TD missing`, () => {
  let str = `<table>
  <tr>
    <td>
      z
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-missing-closing": 2,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  compare(
    ok,
    messages,
    [
      {
        message: "Closing tag is missing.",
        ruleId: "tag-missing-closing",
        idxFrom: 19,
        idxTo: 23,
        fix: null,
        keepSeparateWhenFixing: false,
        line: 3,
        column: 5,
        severity: 2,
        tokenObj: {
          type: "tag",
          start: 19,
          end: 23,
          value: "<td>",
        },
      },
    ],
    "07.02"
  );
  equal(messages.length, 1, "07.02");
});

test(`08 - TR missing`, () => {
  let str = `<table width="1" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      z
    </td>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-missing-closing": 2,
    },
  });
  equal(applyFixes(str, messages), str, "08.01");
  compare(
    ok,
    messages,
    [
      {
        fix: null,
        keepSeparateWhenFixing: false,
        line: 2,
        column: 3,
        severity: 2,
        message: "Closing tag is missing.",
        ruleId: "tag-missing-closing",
        idxFrom: 63,
        idxTo: 67,
        tokenObj: {
          type: "tag",
          start: 63,
          end: 67,
          value: "<tr>",
        },
      },
    ],
    "08.02"
  );
  equal(messages.length, 1, "08.02");
});

test(`09 - TABLE missing`, () => {
  let str = `<table width="1" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      z
    </td>
  </tr>`;
  let messages = verify(not, str, {
    rules: {
      "tag-missing-closing": 2,
    },
  });
  equal(applyFixes(str, messages), str, "09.01");
  compare(
    ok,
    messages,
    [
      {
        fix: null,
        keepSeparateWhenFixing: false,
        line: 1,
        column: 1,
        severity: 2,
        message: "Closing tag is missing.",
        ruleId: "tag-missing-closing",
        idxFrom: 0,
        idxTo: 60,
        tokenObj: {
          type: "tag",
          start: 0,
          end: 60,
          value: '<table width="1" border="0" cellpadding="0" cellspacing="0">',
        },
      },
    ],
    "09.02"
  );
  equal(messages.length, 1, "09.02");
});

// 02. various
// -----------------------------------------------------------------------------

test(`10 - opening and closing void tag`, () => {
  let str = `<br><br>zzz</br></br>`;
  let fixed = `<br /><br />zzz<br /><br />`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "10.01");
});

test(`11 - false positive - unclosed void`, () => {
  let str = `<br><br>zzz<br>`;
  let fixed = `<br /><br />zzz<br />`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "11.01");
});

test.run();
