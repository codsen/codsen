import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// false positives
// -----------------------------------------------------------------------------

test(`01 - value-less attributes`, () => {
  let str = `<td nowrap >`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - value-less attributes`, () => {
  let str = `<td nowrap>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - value-less attributes`, () => {
  let str = `<td nowrap/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - value-less attributes`, () => {
  let str = `<br nowrap />`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - value-less attributes`, () => {
  let str = `</td nowrap nowrap>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// no config
// -----------------------------------------------------------------------------

test(`06 - off`, () => {
  let str = `<a b"c" d'e'>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07`, () => {
  let str = `<a class"b" id'c'>`;
  let fixed = `<a class="b" id="c">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  equal(applyFixes(str, messages), fixed, "07");
});

test(`08 - equal missing`, () => {
  let str = `<img alt""/>`;
  let fixed = `<img alt=""/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "08");
});

// mis-typed
// -----------------------------------------------------------------------------

test(`09 - err`, () => {
  let str = `<td clas="w100p">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), `<td class="w100p">`, "09.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-malformed",
        idxFrom: 4,
        idxTo: 8,
        message: `Probably meant "class".`,
        fix: {
          ranges: [[4, 8, "class"]],
        },
      },
    ],
    "09.02"
  );
});

test(`10 - err`, () => {
  let str = `<td zzzz="w100p">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "10.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-malformed",
        idxFrom: 4,
        idxTo: 8,
        message: `Unrecognised attribute "zzzz".`,
        fix: null,
      },
    ],
    "10.02"
  );
});

// repeated opening quotes
// -----------------------------------------------------------------------------

test(`11 - repeated opening - double`, () => {
  let str = `<table width=""100">\n  zzz\n</table>`;
  let fixed = `<table width="100">\n  zzz\n</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "11.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-malformed",
        idxFrom: 7,
        idxTo: 19,
        message: `Delete repeated opening quotes.`,
        fix: {
          ranges: [[14, 15]],
        },
      },
    ],
    "11.02"
  );
});

test(`12 - repeated opening - single`, () => {
  let str = `<table width=''100'>\n  zzz\n</table>`;
  let fixed = `<table width="100">\n  zzz\n</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  equal(applyFixes(str, messages), fixed, "12");
});

test(`13 - repeated opening - single quotes instead of equal`, () => {
  let str = `<table width''100'>\n  zzz\n</table>`;
  let fixed = `<table width="100">\n  zzz\n</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "13");
});

test(`14 - repeated opening - double quotes instead of equal`, () => {
  let str = `<table width""100">\n  zzz\n</table>`;
  let fixed = `<table width="100">\n  zzz\n</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "14");
});

test(`15 - repeated closing - double`, () => {
  let str = `<table width="100"">\n  zzz\n</table>`;
  let fixed = `<table width="100">\n  zzz\n</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  equal(applyFixes(str, messages), fixed, "15.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-malformed",
        idxFrom: 7,
        idxTo: 19,
        message: `Delete repeated closing quotes.`,
        fix: {
          ranges: [[17, 18]],
        },
      },
    ],
    "15.02"
  );
});

// rogue quotes
// -----------------------------------------------------------------------------

test(`16 - repeated opening - rogue single`, () => {
  let str = `<table width='"100">zzz</table>`;
  let fixed = `<table width="100">zzz</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "16");
});

test(`17 - repeated opening - rogue double`, () => {
  let str = `<table width="'100'>zzz</table>`;
  let fixed = `<table width="100">zzz</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "17");
});

// rogue characters
// -----------------------------------------------------------------------------

test(`18 - repeated opening - rogue characters around equal`, () => {
  let str = `<span width...=....."100"></span>`;
  let fixed = `<span width="100"></span>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "18");
});

// equal missing
// -----------------------------------------------------------------------------

test(`19 - equal missing - equal is missing, tight`, () => {
  let str = `<a class"c" id'e'>`;
  let fixed = `<a class="c" id="e">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "19");
});

test(`20 - equal missing - space instead of equal, recognised attr names followed by quoted value`, () => {
  let str = `<a class "c" id 'e' href "www">`;
  let fixed = `<a class="c" id="e" href="www">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "20");
});

test(`21 - equal missing - mismatching quotes - A,B; A,B`, () => {
  let str = `<a class"c' id"e'>`;
  let fixed = `<a class="c" id="e">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "21.01");
  equal(messages.length, 4, "21.02");
});

test(`22 - equal missing - mismatching quotes - A,B; B,A`, () => {
  let str = `<a class"c' id'e">`;
  let fixed = `<a class="c" id="e">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "22.01");
  equal(messages.length, 4, "22.02");
});

test(`23 - equal missing - mismatching quotes - A,B; B,A`, () => {
  let str = `<a class"c' id'e">`;
  let fixed = `<a class="c" id="e">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
      "format-prettier": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "23.01");
  equal(messages.length, 4, "23.02");
});

// mismatching quotes
// -----------------------------------------------------------------------------

test(`24 - no quotes in the value, A-B`, () => {
  let str = `<div class="c'>.</div>`;
  let fixed = `<div class="c">.</div>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "24.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 5,
        idxTo: 14,
        message: `Wrong closing quote.`,
        fix: {
          ranges: [[13, 14, `"`]],
        },
      },
    ],
    "24.02"
  );
  equal(messages.length, 1, "24.03");
});

test(`25 - no quotes in the value, B-A`, () => {
  let str = `<div class='c">.</div>`;
  let fixed = `<div class="c">.</div>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "25.01");
  equal(messages.length, 1, "25.02");
});

test(`26 - single quotes in the value, A-B`, () => {
  let str = `<img alt="Deal is your's!'/>`;
  let fixed = `<img alt="Deal is your's!"/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "26.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 5,
        idxTo: 26,
        message: `Wrong closing quote.`,
        fix: {
          ranges: [[25, 26, `"`]],
        },
      },
    ],
    "26.02"
  );
  equal(messages.length, 1, "26.03");
});

test(`27 - single quotes in the value, B-A`, () => {
  let str = `<img alt='Deal is your's!"/>`;
  let fixed = `<img alt="Deal is your's!"/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "27.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 5,
        idxTo: 26,
        message: `Wrong opening quote.`,
        fix: {
          ranges: [[9, 10, `"`]],
        },
      },
    ],
    "27.02"
  );
  equal(messages.length, 1, "27.03");
});

// wrong letter case, legit attributes
// -----------------------------------------------------------------------------

test(`28 - all caps attr name`, () => {
  let str = `<img SRC="spacer.gif" Alt=""/>`;
  let fixed = `<img src="spacer.gif" alt=""/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "28.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 5,
        idxTo: 8,
        message: `Should be lowercase.`,
        fix: {
          ranges: [[5, 8, `src`]],
        },
      },
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 22,
        idxTo: 25,
        message: `Should be lowercase.`,
        fix: {
          ranges: [[22, 25, `alt`]],
        },
      },
    ],
    "28.02"
  );
  equal(messages.length, 2, "28.03");
});

// unescaped matching quotes within a value
// -----------------------------------------------------------------------------

test(`29 - D-D wrapping - useSingleToEscapeDouble = off`, () => {
  let str = `<img alt="so-called "artists"!"/>`;
  let fixed = `<img alt="so-called &quot;artists&quot;!"/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "29.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 10,
        idxTo: 30,
        message: `Unencoded quote.`,
        fix: {
          ranges: [[20, 21, `&quot;`]],
        },
      },
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 10,
        idxTo: 30,
        message: `Unencoded quote.`,
        fix: {
          ranges: [[28, 29, `&quot;`]],
        },
      },
    ],
    "29.02"
  );
  equal(messages.length, 2, "29.03");
});

test(`30 - S-S wrapping - useSingleToEscapeDouble = off`, () => {
  let str = `<img alt='so-called "artists"!'/>`;
  let fixed = `<img alt="so-called &quot;artists&quot;!"/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "30");
});

test(`31 - D-S wrapping - useSingleToEscapeDouble = off`, () => {
  let str = `<img alt="so-called "artists"!'/>`;
  let fixed = `<img alt="so-called &quot;artists&quot;!"/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "31");
});

test(`32 - S-D wrapping - useSingleToEscapeDouble = off`, () => {
  let str = `<img alt='so-called "artists"!"/>`;
  let fixed = `<img alt="so-called &quot;artists&quot;!"/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "32");
});

test(`33 - useSingleToEscapeDouble = on`, () => {
  let str = `<img alt="so-called "artists"!"/>`;
  let fixed = `<img alt='so-called "artists"!'/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": [2, "useSingleToEscapeDouble"],
    },
  });
  equal(applyFixes(str, messages), fixed, "33.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 5,
        idxTo: 31,
        message: `Wrong opening quote.`,
        fix: {
          ranges: [[9, 10, `'`]],
        },
      },
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 5,
        idxTo: 31,
        message: `Wrong closing quote.`,
        fix: {
          ranges: [[30, 31, `'`]],
        },
      },
    ],
    "33.02"
  );
  equal(messages.length, 2, "33.03");
});

test(`34 - S-S wrapping - useSingleToEscapeDouble = on`, () => {
  let str = `<img alt='so-called "artists"!'/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": [2, "useSingleToEscapeDouble"],
    },
  });
  equal(messages, [], "34");
});

test(`35 - S-D wrapping - useSingleToEscapeDouble = on`, () => {
  let str = `<img alt='so-called "artists"!"/>`;
  let fixed = `<img alt='so-called "artists"!'/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": [2, "useSingleToEscapeDouble"],
    },
  });
  equal(applyFixes(str, messages), fixed, "35");
});

test(`36 - D-S wrapping - useSingleToEscapeDouble = on`, () => {
  let str = `<img alt="so-called "artists"!'/>`;
  let fixed = `<img alt='so-called "artists"!'/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": [2, "useSingleToEscapeDouble"],
    },
  });
  equal(applyFixes(str, messages), fixed, "36");
});

// various
// -----------------------------------------------------------------------------

test(`37 - curly quotes instead`, () => {
  let str = `<div class=“foo”>z</div>`;
  let fixed = `<div class="foo">z</div>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "37");
});

test(`38`, () => {
  let str = `<img alt="/>`;
  let fixed = `<img alt=""/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "38");
});

test(`39`, () => {
  let str = `<img alt='/>`;
  let fixed = `<img alt=""/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "39");
});

test(`40`, () => {
  let str = `<img alt=">`;
  let fixed = `<img alt=""/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "40");
});

test(`41`, () => {
  let str = `<img alt='>`;
  let fixed = `<img alt=""/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "41");
});

test(`42`, () => {
  let str = `<img alt=">`;
  let fixed = `<img alt="" />`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "42");
});

test(`43`, () => {
  let str = `<img alt='>`;
  let fixed = `<img alt="" />`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
      "format-prettier": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "43");
});

test(`44`, () => {
  let str = `<div class=\nfoo”>z</div>`;
  let fixed = `<div class="foo">z</div>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "44");
});

test(`45`, () => {
  let str = `<div class=“foo\n>z</div>`;
  let fixed = `<div class="foo">z</div>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "45");
});

test(`46`, () => {
  let str = `<img alt='there's "somethin" here'/>`;
  let fixed = `<img alt="there's &quot;somethin&quot; here"/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "46");
});

// leading whitespace
// -----------------------------------------------------------------------------

test(`47 - leading space present`, () => {
  let str = `<span class="x" id="left">.</span>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(messages, [], "47");
});

test(`48 - leading space missing`, () => {
  let str = `<span class="x"id="left">.</span>`;
  let fixed = `<span class="x" id="left">.</span>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "48");
});

test(`49 - two spaces`, () => {
  let str = `<span class="x"  id="left">.</span>`;
  let fixed = `<span class="x" id="left">.</span>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "49");
});

test(`50 - one tab`, () => {
  let str = `<span class="x"\tid="left">.</span>`;
  let fixed = `<span class="x" id="left">.</span>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "50");
});

test(`51 - ESP tags present`, () => {
  let str = `<span {% if x %}class="x" {% endif %}id="left">.</span>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), str, "51");
});

test.run();
