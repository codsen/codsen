import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. type="simple"
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${35}m${"type: simple"}\u001b[${39}m`} - off, missing dash`, () => {
  let str = "<!--z->";
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${35}m${"type: simple"}\u001b[${39}m`} - error, missing dash, text inside`, () => {
  let str = "<!--z->";
  let fixed = "<!--z-->";
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "02.01");
  equal(
    messages,
    [
      {
        ruleId: "comment-closing-malformed",
        line: 1,
        column: 6,
        severity: 2,
        idxFrom: 5,
        idxTo: 7,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[5, 7, "-->"]],
        },
        keepSeparateWhenFixing: true,
      },
    ],
    "02.02"
  );
});

test(`03 - ${`\u001b[${35}m${"type: simple"}\u001b[${39}m`} - error, missing dash, tag inside`, () => {
  let str = '<!--<img class="z"/>->';
  let fixed = '<!--<img class="z"/>-->';
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "03.01");
  equal(
    messages,
    [
      {
        line: 1,
        column: 21,
        severity: 2,
        ruleId: "comment-closing-malformed",
        idxFrom: 20,
        idxTo: 22,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[20, 22, "-->"]],
        },
        keepSeparateWhenFixing: true,
      },
    ],
    "03.02"
  );
});

test(`04 - ${`\u001b[${35}m${"type: simple"}\u001b[${39}m`} - rogue space`, () => {
  let str = '<!--<img class="z"/>-- >';
  let fixed = '<!--<img class="z"/>-->';
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "04.01");
  equal(
    messages,
    [
      {
        line: 1,
        column: 21,
        severity: 2,
        ruleId: "comment-closing-malformed",
        idxFrom: 20,
        idxTo: 24,
        message: "Remove whitespace.",
        fix: {
          ranges: [[22, 23]],
        },
        keepSeparateWhenFixing: true,
      },
    ],
    "04.02"
  );
});

test(`05 - ${`\u001b[${35}m${"type: simple"}\u001b[${39}m`} - rogue excl mark`, () => {
  let str = '<!--<img class="z"/>--!>';
  let fixed = '<!--<img class="z"/>-->';
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "05.01");
  equal(
    messages,
    [
      {
        line: 1,
        column: 21,
        severity: 2,
        ruleId: "comment-closing-malformed",
        idxFrom: 20,
        idxTo: 24,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[20, 24, "-->"]],
        },
        keepSeparateWhenFixing: true,
      },
    ],
    "05.02"
  );
});

test(`06 - ${`\u001b[${35}m${"type: simple"}\u001b[${39}m`} - rogue single character, z`, () => {
  let str = '<!--<img class="z"/>--z>';
  let fixed = '<!--<img class="z"/>-->';
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "06.01");
  equal(
    messages,
    [
      {
        line: 1,
        column: 21,
        severity: 2,
        ruleId: "comment-closing-malformed",
        idxFrom: 20,
        idxTo: 24,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[20, 24, "-->"]],
        },
        keepSeparateWhenFixing: true,
      },
    ],
    "06.02"
  );
});

// 02. type="only"
// -----------------------------------------------------------------------------

// For your reference:

// <!--[if mso]>
//     <img src="fallback">
// <![endif]-->

test(`07 - ${`\u001b[${33}m${"type: only"}\u001b[${39}m`} - off, excl mark missing`, () => {
  let str = "<!--[if mso]>x<[endif]-->";
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 0,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  equal(messages, [], "07.02");
});

test(`08 - ${`\u001b[${33}m${"type: only"}\u001b[${39}m`} - error level, excl mark missing`, () => {
  let str = "<!--[if mso]>x<[endif]-->";
  let fixed = "<!--[if mso]>x<![endif]-->";
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "08.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-closing-malformed",
        severity: 2,
        idxFrom: 14,
        idxTo: 25,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[14, 25, "<![endif]-->"]],
        },
      },
    ],
    "08.02"
  );
  is(messages.length, 1, "08.02");
});

test(`09 - ${`\u001b[${33}m${"type: only"}\u001b[${39}m`} - 1 instead of !`, () => {
  let str = "<!--[if mso]>x<1[endif]-->";
  let fixed = "<!--[if mso]>x<![endif]-->";
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "09.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-closing-malformed",
        severity: 2,
        idxFrom: 14,
        idxTo: 26,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[14, 26, "<![endif]-->"]],
        },
      },
    ],
    "09.02"
  );
  is(messages.length, 1, "09.02");
});

test(`10 - ${`\u001b[${33}m${"type: only"}\u001b[${39}m`} - 1 instead of !`, () => {
  let str = "<!--[if mso]>x<![ndif]-->";
  let fixed = "<!--[if mso]>x<![endif]-->";
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "10.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-closing-malformed",
        severity: 2,
        idxFrom: 14,
        idxTo: 25,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[14, 25, "<![endif]-->"]],
        },
      },
    ],
    "10.02"
  );
  is(messages.length, 1, "10.02");
});

test(`11 - ${`\u001b[${33}m${"type: only"}\u001b[${39}m`} - closing bracket missing, tag follows, tight`, () => {
  let str = "<!--[if mso]>x<![endif]--<a>";
  let fixed = "<!--[if mso]>x<![endif]--><a>";
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "11.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        idxFrom: 14,
        idxTo: 25,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[14, 25, "<![endif]-->"]],
        },
        ruleId: "comment-closing-malformed",
      },
    ],
    "11.02"
  );
  is(messages.length, 1, "11.02");
});

test(`12 - ${`\u001b[${33}m${"type: only"}\u001b[${39}m`} - closing bracket missing, tag follows, spaced`, () => {
  let str = "<!--[if mso]>x<![endif]--\n\n<a>";
  let fixed = "<!--[if mso]>x<![endif]-->\n\n<a>";
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "12.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        idxFrom: 14,
        idxTo: 25,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[14, 25, "<![endif]-->"]],
        },
        ruleId: "comment-closing-malformed",
      },
    ],
    "12.02"
  );
  is(messages.length, 1, "12.02");
});

// 03. type="not"
// -----------------------------------------------------------------------------

// For your reference:

// <!--[if !mso]><!-->
//     <img src="gif"/>
// <!--<![endif]-->

test(`13 - ${`\u001b[${31}m${"type: not"}\u001b[${39}m`} - bracket missing`, () => {
  let str = '<!--[if !mso]><!--><img src="gif"/>!--<![endif]-->';
  let fixed = '<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->';
  let messages = verify(not, str, {
    rules: {
      "character-unspaced-punctuation": 2,
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "13.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-closing-malformed",
        severity: 2,
        idxFrom: 35,
        idxTo: 50,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[35, 50, "<!--<![endif]-->"]],
        },
      },
    ],
    "13.02"
  );
  is(messages.length, 1, "13.02");
});

test(`14 - ${`\u001b[${31}m${"type: not"}\u001b[${39}m`} - excml mark missing`, () => {
  let str = '<!--[if !mso]><!--><img src="gif"/><--<![endif]-->';
  let fixed = '<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->';
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "14.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-closing-malformed",
        severity: 2,
        idxFrom: 35,
        idxTo: 50,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[35, 50, "<!--<![endif]-->"]],
        },
      },
    ],
    "14.02"
  );
  is(messages.length, 1, "14.02");
});

test(`15 - ${`\u001b[${31}m${"type: not"}\u001b[${39}m`} - dash missing`, () => {
  let str = '<!--[if !mso]><!--><img src="gif"/><!-<![endif]-->';
  let fixed = '<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->';
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "15.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-closing-malformed",
        severity: 2,
        idxFrom: 35,
        idxTo: 50,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[35, 50, "<!--<![endif]-->"]],
        },
      },
    ],
    "15.02"
  );
  is(messages.length, 1, "15.02");
});

test(`16 - ${`\u001b[${31}m${"type: not"}\u001b[${39}m`} - rogue space`, () => {
  let str = '<!--[if !mso]><!--><img src="gif"/><!- -<![endif]-->';
  let fixed = '<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->';
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 1,
    },
  });
  equal(applyFixes(str, messages), fixed, "16.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 1,
        ruleId: "comment-closing-malformed",
        idxFrom: 35,
        idxTo: 52,
        message: "Remove whitespace.",
        fix: {
          ranges: [[38, 39]],
        },
      },
    ],
    "16.02"
  );
  is(messages.length, 1, "16.02");
});

test(`17 - ${`\u001b[${31}m${"type: not"}\u001b[${39}m`} - rogue linebreak`, () => {
  let str = '<!--[if !mso]><!--><img src="gif"/><!--\n<![endif]-->';
  let fixed = '<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->';
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "17.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "comment-closing-malformed",
        idxFrom: 35,
        idxTo: 52,
        message: "Remove whitespace.",
        fix: {
          ranges: [[39, 40]],
        },
      },
    ],
    "17.02"
  );
  is(messages.length, 1, "17.02");
});

test(`18 - ${`\u001b[${31}m${"type: not"}\u001b[${39}m`} - really messed up closing tag`, () => {
  let str = "<!--[if !mso]><!--><br /><!--<[endif]-->";
  let fixed = "<!--[if !mso]><!--><br /><!--<![endif]-->";
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "18.01");
});

test(`19 - ${`\u001b[${31}m${"type: not"}\u001b[${39}m`} - opening bracket missing`, () => {
  let str = "<!--[if !mso]><!--><br /><!--<!endif]-->";
  let fixed = "<!--[if !mso]><!--><br /><!--<![endif]-->";
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "19.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        idxFrom: 25,
        idxTo: 40,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[25, 40, "<!--<![endif]-->"]],
        },
        ruleId: "comment-closing-malformed",
      },
    ],
    "19.02"
  );
  is(messages.length, 1, "19.02");
});

test(`20 - ${`\u001b[${31}m${"type: not"}\u001b[${39}m`} - misspelled endif`, () => {
  let str = '<!--[if !mso]><!--><img src="gif"/><!--<![ndif]-->';
  let fixed = '<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->';
  let messages = verify(not, str, {
    rules: {
      "comment-closing-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "20.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        idxFrom: 35,
        idxTo: 50,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[35, 50, "<!--<![endif]-->"]],
        },
        ruleId: "comment-closing-malformed",
      },
    ],
    "20.02"
  );
  is(messages.length, 1, "20.02");
});

test.run();
