import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. type="only"
// -----------------------------------------------------------------------------

// For your reference:

// <!--[if mso]>
//     <img src="fallback"/>
// <![endif]-->

test(`01 - ${`\u001b[${33}m${"type: only"}\u001b[${39}m`} - simple comment nested, tight`, () => {
  let str = "<!--[if mso]><!--tralala--><![endif]-->";
  let messages = verify(not, str, {
    rules: {
      "comment-conditional-nested": 2,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 13,
        idxTo: 17,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 24,
        idxTo: 27,
        message: "Don't nest comments.",
        fix: null,
      },
    ],
    "01.02"
  );
  equal(messages.length, 2, "01.02");
});

test(`02 - ${`\u001b[${33}m${"type: only"}\u001b[${39}m`} - simple comment nested, mixed`, () => {
  let str = `<!--[if mso]>
    z <!--tralala--> y
<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-conditional-nested": 2,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 20,
        idxTo: 24,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 31,
        idxTo: 34,
        message: "Don't nest comments.",
        fix: null,
      },
    ],
    "02.02"
  );
  equal(messages.length, 2, "02.02");
});

test(`03 - ${`\u001b[${33}m${"type: only"}\u001b[${39}m`} - two simple comments nested`, () => {
  let str = `<!--[if mso]>
    x <!--tralala--> z <!--tralala--> y
<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-conditional-nested": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 20,
        idxTo: 24,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 31,
        idxTo: 34,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 37,
        idxTo: 41,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 48,
        idxTo: 51,
        message: "Don't nest comments.",
        fix: null,
      },
    ],
    "03.02"
  );
  equal(messages.length, 4, "03.02");
});

test(`04 - ${`\u001b[${33}m${"type: only"}\u001b[${39}m`} - two "only"-kind comments nested`, () => {
  let str = `<!--[if mso]>
    <img src="fallback"/>

<!--[if mso]>z<![endif]-->

<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-conditional-nested": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 41,
        idxTo: 54,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 55,
        idxTo: 67,
        message: "Don't nest comments.",
        fix: null,
      },
    ],
    "04.02"
  );
  equal(messages.length, 2, "04.02");
});

// 02. type="not"
// -----------------------------------------------------------------------------

// For your reference:

// <!--[if !mso]><!-->
//     <img src="gif"/>
// <!--<![endif]-->

test(`05 - ${`\u001b[${36}m${"type: not"}\u001b[${39}m`} - simple comment nested, tight`, () => {
  let str = "<!--[if mso]><!--><!--tralala--><!--<![endif]-->";
  let messages = verify(not, str, {
    rules: {
      "comment-conditional-nested": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 18,
        idxTo: 22,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 29,
        idxTo: 32,
        message: "Don't nest comments.",
        fix: null,
      },
    ],
    "05.02"
  );
  equal(messages.length, 2, "05.02");
});

test(`06 - ${`\u001b[${36}m${"type: not"}\u001b[${39}m`} - simple comment nested, mixed`, () => {
  let str = `<!--[if mso]><!-->
    z <!--tralala--> y
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-conditional-nested": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 25,
        idxTo: 29,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 36,
        idxTo: 39,
        message: "Don't nest comments.",
        fix: null,
      },
    ],
    "06.02"
  );
  equal(messages.length, 2, "06.02");
});

test(`07 - ${`\u001b[${36}m${"type: not"}\u001b[${39}m`} - two simple comments nested`, () => {
  let str = `<!--[if mso]><!-->
    x <!--tralala--> z <!--tralala--> y
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-conditional-nested": 2,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 25,
        idxTo: 29,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 36,
        idxTo: 39,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 42,
        idxTo: 46,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 53,
        idxTo: 56,
        message: "Don't nest comments.",
        fix: null,
      },
    ],
    "07.02"
  );
  equal(messages.length, 4, "07.02");
});

test(`08 - ${`\u001b[${36}m${"type: not"}\u001b[${39}m`} - two "only"-kind comments nested`, () => {
  let str = `<!--[if mso]><!-->
    <img src="fallback"/>

<!--[if mso]>z<![endif]-->

<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-conditional-nested": 2,
    },
  });
  equal(applyFixes(str, messages), str, "08.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 46,
        idxTo: 59,
        message: "Don't nest comments.",
        fix: null,
      },
      {
        ruleId: "comment-conditional-nested",
        severity: 2,
        idxFrom: 60,
        idxTo: 72,
        message: "Don't nest comments.",
        fix: null,
      },
    ],
    "08.02"
  );
  equal(messages.length, 2, "08.02");
});

test.run();
