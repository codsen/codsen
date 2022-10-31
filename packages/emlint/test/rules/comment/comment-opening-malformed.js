import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. type="simple"
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - excl. mark is missing, letter inside`, () => {
  let str = `<--z-->`;
  let fixed = `<!--z-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "01.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 3,
        message: `Malformed opening comment tag.`,
        fix: {
          ranges: [[0, 3, "<!--"]],
        },
      },
    ],
    "01.02"
  );
  is(messages.length, 1, "01.02");
});

test(`02 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - excl. mark is missing, tag inside`, () => {
  let str = `<--<img class="z"/>-->`;
  let fixed = `<!--<img class="z"/>-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 1,
    },
  });
  equal(applyFixes(str, messages), fixed, "02.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 1,
        idxFrom: 0,
        idxTo: 3,
        message: `Malformed opening comment tag.`,
        fix: {
          ranges: [[0, 3, "<!--"]],
        },
      },
    ],
    "02.02"
  );
  is(messages.length, 1, "02.02");
});

test(`03 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 1st char, letter inside`, () => {
  let str = `.< !--z-->`;
  let fixed = `.<!--z-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "03.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 1,
        idxTo: 6,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[2, 3]],
        },
      },
    ],
    "03.02"
  );
  is(messages.length, 1, "03.02");
});

test(`04 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 1st char, tag inside`, () => {
  let str = `< !--<img class="z"/>-->`;
  let fixed = `<!--<img class="z"/>-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "04.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 5,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[1, 2]],
        },
      },
    ],
    "04.02"
  );
  is(messages.length, 1, "04.02");
});

test(`05 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 2nd char, letter inside`, () => {
  let str = `<! --z-->`;
  let fixed = `<!--z-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "05.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 5,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[2, 3]],
        },
      },
    ],
    "05.02"
  );
  is(messages.length, 1, "05.02");
});

test(`06 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 2nd char, tag inside`, () => {
  let str = `<! --<img class="z"/>-->`;
  let fixed = `<!--<img class="z"/>-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "06.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 5,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[2, 3]],
        },
      },
    ],
    "06.02"
  );
  is(messages.length, 1, "06.02");
});

test(`07 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 3rd char, letter inside`, () => {
  let str = `<!- -z-->`;
  let fixed = `<!--z-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "07.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 5,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[3, 4]],
        },
      },
    ],
    "07.02"
  );
  is(messages.length, 1, "07.02");
});

test(`08 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 3rd char, tag inside`, () => {
  let str = `<!- -<img class="z"/>-->`;
  let fixed = `<!--<img class="z"/>-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "08.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 5,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[3, 4]],
        },
      },
    ],
    "08.02"
  );
  is(messages.length, 1, "08.02");
});

// 02. type="only"
// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - missing dash`, () => {
  let str = `<!-[if mso]>
  <img src="z"/>
<![endif]-->`;
  let fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "09.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 12,
        message: `Malformed opening comment tag.`,
        fix: {
          ranges: [[0, 4, "<!--["]],
        },
      },
    ],
    "09.02"
  );
  is(messages.length, 1, "09.02");
});

test(`10 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - opening bracket missing`, () => {
  let str = `<!--if mso]>
  <img src="z"/>
<![endif]-->`;
  let fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "10.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 12,
        message: `Malformed opening comment tag.`,
        fix: {
          ranges: [[0, 4, "<!--["]],
        },
      },
    ],
    "10.02"
  );
  is(messages.length, 1, "10.02");
});

test(`11 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - missing closing bracket`, () => {
  let str = `<!--[if mso>
  <img src="z"/>
<![endif]-->`;
  let fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "11.01");
  is(messages.length, 1, "11.02");
});

test(`12 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - messed up ending - swapped characters > and ]`, () => {
  let str = `<!--[if mso>]
  <img src="z"/>
<![endif]-->`;
  let fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "12.01");
  is(messages.length, 1, "12.02");
});

test(`13 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - rounded brackets`, () => {
  let str = `<!--(if mso)>
  <img src="z"/>
<![endif]-->`;
  let fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "13.01");
});

test(`14 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - curly brackets`, () => {
  let str = `<!--{if mso}>
  <img src="z"/>
<![endif]-->`;
  let fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "14.01");
});

// 03. type="not"
// -----------------------------------------------------------------------------

test(`15 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - missing square closing bracket`, () => {
  let str = `<!--[if !mso><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "15.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 18,
        message: `Malformed opening comment tag.`,
        fix: {
          ranges: [[12, 18, "]><!-->"]],
        },
      },
    ],
    "15.02"
  );
  is(messages.length, 1, "15.02");
});

test(`16 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - excessive whitespace`, () => {
  let str = `<!--  [if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "16.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 21,
        message: `Malformed opening comment tag.`,
        fix: {
          ranges: [[0, 7, "<!--["]],
        },
      },
    ],
    "16.02"
  );
  is(messages.length, 1, "16.02");
});

test(`17 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - missing dash on the first part`, () => {
  let str = `<!-[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "17.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 18,
        message: `Malformed opening comment tag.`,
        fix: {
          ranges: [[0, 4, "<!--["]],
        },
      },
    ],
    "17.02"
  );
  is(messages.length, 1, "17.02");
});

test(`18 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - missing dash on the second part`, () => {
  let str = `<!--[if !mso]><!->
  <img src="gif"/>
<!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "18.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-opening-malformed",
        severity: 2,
        idxFrom: 0,
        idxTo: 18,
        message: `Malformed opening comment tag.`,
        fix: {
          ranges: [[12, 18, "]><!-->"]],
        },
      },
    ],
    "18.02"
  );
  is(messages.length, 1, "18.02");
});

test(`19 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - rogue character in the second part`, () => {
  let str = `<!--[if !mso]><!--z>
  <img src="gif"/>
<!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "19.01");
  is(messages.length, 1, "19.02");
});

test(`20 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - whitespace between parts`, () => {
  let str = `<!--[if !mso]>\n\n<!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "20.01");
  is(messages.length, 1, "20.02");
});

test(`21 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - empty healthy outlook conditional`, () => {
  let str = `<!--[if !mso]><!-->
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), str, "21.01");
  equal(messages, [], "21.02");
});

test(`22 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - rounded brackets`, () => {
  let str = `<!--(if !mso)><!-->
      <img src="gif"/>
      <!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
      <img src="gif"/>
      <!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "22.01");
});

test(`23 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - curly brackets`, () => {
  let str = `<!--{if !mso}><!-->
      <img src="gif"/>
      <!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
      <img src="gif"/>
      <!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "23.01");
});

test(`24 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - second part is missing excl mark`, () => {
  let str = `<!--[if !mso]><-->
  <img src="gif"/>
<!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "24.01");
  is(messages.length, 1, "24.02");
});

test(`25 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - no brackets`, () => {
  let str = `<!--if !mso><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "25.01");
});

// 04. various cases
// -----------------------------------------------------------------------------

test(`26 - ${`\u001b[${34}m${`various`}\u001b[${39}m`} - another comment follows, letter`, () => {
  let str = `<!--[if !mso><!--><!--z-->
  <img src="gif"/>
<!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!--><!--z-->
  <img src="gif"/>
<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "comment-opening-malformed": 2,
      "comment-conditional-nested": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "26.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        idxFrom: 0,
        idxTo: 18,
        message: "Malformed opening comment tag.",
        fix: {
          ranges: [[12, 18, "]><!-->"]],
        },
        ruleId: "comment-opening-malformed",
      },
      {
        severity: 2,
        ruleId: "comment-conditional-nested",
        message: "Don't nest comments.",
        idxFrom: 18,
        idxTo: 22,
        fix: null,
      },
      {
        severity: 2,
        ruleId: "comment-conditional-nested",
        message: "Don't nest comments.",
        idxFrom: 23,
        idxTo: 26,
        fix: null,
      },
    ],
    "30.02"
  );
});

test.run();
