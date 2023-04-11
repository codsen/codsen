import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. "only" opening, "not" closing
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${35}m${'"only" opening, "not" closing'}\u001b[${39}m`} - off, missing dash`, () => {
  let str = `<!--[if mso]>
  <img src="fallback">
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-mismatching-pair": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${35}m${'"only" opening, "not" closing'}\u001b[${39}m`} - both tags are healthy`, () => {
  let str = `<!--[if mso]>
  <span class="foo">z</span>
<!--<![endif]-->`;
  let fixed = `<!--[if mso]>
  <span class="foo">z</span>
<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-mismatching-pair": 1,
    },
  });
  // turns tails comment tag into "only"-kind
  equal(applyFixes(str, messages), fixed, "02.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 1,
        ruleId: "comment-mismatching-pair",
        idxFrom: 43,
        idxTo: 59,
        message: 'Remove "<!--".',
        fix: {
          ranges: [[43, 59]],
        },
      },
    ],
    "02.02"
  );
  is(messages.length, 1, "02.02");
});

test(`03 - ${`\u001b[${35}m${'"only" opening, "not" closing'}\u001b[${39}m`} - heads tag is also dirty`, () => {
  let str = `<!-- [if mso]>
  <span class="foo">z</span>
<!--<![endif]-->`;
  let fixed = `<!--[if mso]>
  <span class="foo">z</span>
<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      // all: 1,
      "comment-opening-malformed": 1,
      "comment-mismatching-pair": 1,
    },
  });
  // turns tails comment tag into "only"-kind
  compare(
    ok,
    messages,
    [
      {
        severity: 1,
        idxFrom: 0,
        idxTo: 14,
        message: "Malformed opening comment tag.",
        fix: {
          ranges: [[0, 6, "<!--["]],
        },
        ruleId: "comment-opening-malformed",
      },
      {
        severity: 1,
        ruleId: "comment-mismatching-pair",
        message: 'Remove "<!--".',
        idxFrom: 44,
        idxTo: 60,
        keepSeparateWhenFixing: true,
        fix: {
          ranges: [[44, 60, "<![endif]-->"]],
        },
      },
    ],
    "03.01"
  );
  equal(applyFixes(str, messages), fixed, "03.01");
});

test(`04 - ${`\u001b[${35}m${'"only" opening, "not" closing'}\u001b[${39}m`} - tails tag is also dirty`, () => {
  let str = `<!--[if mso]>
  <span class="foo">z</span>
<!--<[endif]-->`;
  let fixed = `<!--[if mso]>
  <span class="foo">z</span>
<![endif]-->`;

  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        idxFrom: 43,
        idxTo: 58,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[43, 58, "<!--<![endif]-->"]],
        },
        ruleId: "comment-closing-malformed",
      },
    ],
    "04.01"
  );
  equal(
    applyFixes(str, messages),
    `<!--[if mso]>
  <span class="foo">z</span>
<!--<![endif]-->`,
    "04.01"
  );

  let secondRoundMessages = verify(
    not,
    `<!--[if mso]>
  <span class="foo">z</span>
<!--<![endif]-->`,
    {
      rules: {
        all: 2,
      },
    }
  );
  compare(
    ok,
    secondRoundMessages,
    [
      {
        severity: 2,
        idxFrom: 43,
        idxTo: 59,
        message: 'Remove "<!--".',
        fix: {
          ranges: [[43, 59, "<![endif]-->"]],
        },
        ruleId: "comment-mismatching-pair",
      },
    ],
    "04.03"
  );
  equal(applyFixes(str, secondRoundMessages), fixed, "04.02");

  // turns tails comment tag into "only"-kind
  equal(
    applyFixes(applyFixes(str, messages), secondRoundMessages),
    fixed,
    "04.03"
  );
});

test(`05 - ${`\u001b[${35}m${'"only" opening, "not" closing'}\u001b[${39}m`} - both tags are also dirty`, () => {
  let str = `<!-[if mso]>
  <span class="foo">z</span>
<!--<[endif]-->`;
  let fixed = `<!--[if mso]>
  <span class="foo">z</span>
<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  let secondRoundMessages = verify(not, applyFixes(str, messages), {
    rules: {
      all: 2,
    },
  });
  // turns tails comment tag into "only"-kind
  equal(
    applyFixes(applyFixes(str, messages), secondRoundMessages),
    fixed,
    "05.01"
  );
});

// 02. "not" opening, "only" closing
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${36}m${'"not" opening, "only" closing'}\u001b[${39}m`} - both tags are healthy`, () => {
  let str = `<!--[if !mso]><!-->
  <span class="foo">z</span>
<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
  <span class="foo">z</span>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-mismatching-pair": 2,
    },
  });
  // turns tails comment tag into "not"-kind
  equal(applyFixes(str, messages), fixed, "06.01");
  equal(
    messages,
    [
      {
        line: 3,
        column: 1,
        severity: 2,
        ruleId: "comment-mismatching-pair",
        message: 'Add "<!--".',
        idxFrom: 49,
        idxTo: 61,
        fix: {
          ranges: [[49, 49, "<!--"]],
        },
        keepSeparateWhenFixing: true,
      },
    ],
    "06.02"
  );
});

test(`07 - ${`\u001b[${36}m${'"not" opening, "only" closing'}\u001b[${39}m`} - heads tag is also dirty`, () => {
  let str = `<!-[if !mso]><!-->
  <span class="foo">z</span>
<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
  <span class="foo">z</span>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  // turns tails comment tag into "not"-kind
  equal(applyFixes(str, messages), fixed, "07.01");
  compare(
    ok,
    messages,
    [
      {
        line: 1,
        severity: 2,
        idxFrom: 0,
        idxTo: 18,
        message: "Malformed opening comment tag.",
        fix: {
          ranges: [[0, 4, "<!--["]],
        },
        ruleId: "comment-opening-malformed",
      },
      {
        line: 3,
        severity: 2,
        ruleId: "comment-mismatching-pair",
        message: 'Add "<!--".',
        idxFrom: 48,
        idxTo: 60,
        fix: {
          ranges: [[48, 48, "<!--"]],
        },
      },
    ],
    "07.02"
  );
  is(messages.length, 2, "07.02");
});

test(`08 - ${`\u001b[${36}m${'"not" opening, "only" closing'}\u001b[${39}m`} - tails tag is also dirty`, () => {
  let str = `<!--[if mso]><!-->
  <span class="foo">z</span>
<[endif]-->`;
  let fixed = `<!--[if mso]><!-->
  <span class="foo">z</span>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  let secondRoundMessages = verify(not, applyFixes(str, messages), {
    rules: {
      all: 2,
    },
  });
  // turns tails comment tag into "only"-kind
  equal(
    applyFixes(applyFixes(str, messages), secondRoundMessages),
    fixed,
    "08.01"
  );
});

test(`09 - ${`\u001b[${36}m${'"not" opening, "only" closing'}\u001b[${39}m`} - both tags are also dirty`, () => {
  let str = `<!-[if mso]><!-->
  <span class="foo">z</span>
<[endif]-->`;
  let fixed = `<!--[if mso]><!-->
  <span class="foo">z</span>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  let secondRoundMessages = verify(not, applyFixes(str, messages), {
    rules: {
      all: 2,
    },
  });
  // turns tails comment tag into "only"-kind
  equal(
    applyFixes(applyFixes(str, messages), secondRoundMessages),
    fixed,
    "09.01"
  );
});

// -----------------------------------------------------------------------------

// For a reference:
// ===============

// a<!--b-->c

// abc<!--[if gte mso 9]><xml>
// <o:OfficeDocumentSettings>
// <o:AllowPNG/>
// <o:PixelsPerInch>96</o:PixelsPerInch>
// </o:OfficeDocumentSettings>
// </xml><![endif]-->def

// <!--[if mso]>
//     <img src="fallback">
// <![endif]-->

// <!--[if !mso]><!-->
//     <img src="gif">
// <!--<![endif]-->

test.run();
