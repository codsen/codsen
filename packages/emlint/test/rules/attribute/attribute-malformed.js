import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util.js";

// false positives
// -----------------------------------------------------------------------------

tap.test(`01 - value-less attributes`, (t) => {
  const str = `<td nowrap >`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "01.01");
  t.strictSame(messages, [], "01.02");
  t.end();
});

tap.test(`02 - value-less attributes`, (t) => {
  const str = `<td nowrap>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "02.01");
  t.strictSame(messages, [], "02.02");
  t.end();
});

tap.test(`03 - value-less attributes`, (t) => {
  const str = `<td nowrap/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "03.01");
  t.strictSame(messages, [], "03.02");
  t.end();
});

tap.test(`04 - value-less attributes`, (t) => {
  const str = `<br nowrap />`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "04.01");
  t.strictSame(messages, [], "04.02");
  t.end();
});

tap.test(`05 - value-less attributes`, (t) => {
  const str = `</td nowrap nowrap>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "05.01");
  t.strictSame(messages, [], "05.02");
  t.end();
});

// no config
// -----------------------------------------------------------------------------

tap.test(`06 - off`, (t) => {
  const str = `<a b"c" d'e'>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "06.01");
  t.strictSame(messages, [], "06.02");
  t.end();
});

tap.test(`07`, (t) => {
  const str = `<a class"b" id'c'>`;
  const fixed = `<a class="b" id="c">`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "07");
  t.end();
});

tap.test(`08 - equal missing`, (t) => {
  const str = `<img alt""/>`;
  const fixed = `<img alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "08");
  t.end();
});

// mis-typed
// -----------------------------------------------------------------------------

tap.test(`09 - err`, (t) => {
  const str = `<td clas="w100p">`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), `<td class="w100p">`, "09.01");
  t.match(
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
  t.end();
});

tap.test(`10 - err`, (t) => {
  const str = `<td zzzz="w100p">`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "10.01");
  t.match(
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
  t.end();
});

// repeated opening quotes
// -----------------------------------------------------------------------------

tap.test(`11 - repeated opening - double`, (t) => {
  const str = `<table width=""100">\n  zzz\n</table>`;
  const fixed = `<table width="100">\n  zzz\n</table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "11.01");
  t.match(
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
  t.end();
});

tap.test(`12 - repeated opening - single`, (t) => {
  const str = `<table width=''100'>\n  zzz\n</table>`;
  const fixed = `<table width="100">\n  zzz\n</table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "12");
  t.end();
});

tap.test(`13 - repeated opening - single quotes instead of equal`, (t) => {
  const str = `<table width''100'>\n  zzz\n</table>`;
  const fixed = `<table width="100">\n  zzz\n</table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "13");
  t.end();
});

tap.test(`14 - repeated opening - double quotes instead of equal`, (t) => {
  const str = `<table width""100">\n  zzz\n</table>`;
  const fixed = `<table width="100">\n  zzz\n</table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "14");
  t.end();
});

tap.test(`15 - repeated closing - double`, (t) => {
  const str = `<table width="100"">\n  zzz\n</table>`;
  const fixed = `<table width="100">\n  zzz\n</table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "15.01");
  t.match(
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
  t.end();
});

// rogue quotes
// -----------------------------------------------------------------------------

tap.test(`16 - repeated opening - rogue single`, (t) => {
  const str = `<table width='"100">zzz</table>`;
  const fixed = `<table width="100">zzz</table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "16");
  t.end();
});

tap.test(`17 - repeated opening - rogue double`, (t) => {
  const str = `<table width="'100'>zzz</table>`;
  const fixed = `<table width="100">zzz</table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "17");
  t.end();
});

// rogue characters
// -----------------------------------------------------------------------------

tap.test(`18 - repeated opening - rogue characters around equal`, (t) => {
  const str = `<span width...=....."100"></span>`;
  const fixed = `<span width="100"></span>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "18");
  t.end();
});

// equal missing
// -----------------------------------------------------------------------------

tap.test(`19 - equal missing - equal is missing, tight`, (t) => {
  const str = `<a class"c" id'e'>`;
  const fixed = `<a class="c" id="e">`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "19");
  t.end();
});

tap.test(
  `20 - equal missing - space instead of equal, recognised attr names followed by quoted value`,
  (t) => {
    const str = `<a class "c" id 'e' href "www">`;
    const fixed = `<a class="c" id="e" href="www">`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "20");
    t.end();
  }
);

tap.test(`21 - equal missing - mismatching quotes - A,B; A,B`, (t) => {
  const str = `<a class"c' id"e'>`;
  const fixed = `<a class="c" id="e">`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "21.01");
  t.equal(messages.length, 4, "21.02");
  t.end();
});

tap.test(`22 - equal missing - mismatching quotes - A,B; B,A`, (t) => {
  const str = `<a class"c' id'e">`;
  const fixed = `<a class="c" id="e">`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "22.01");
  t.equal(messages.length, 4, "22.02");
  t.end();
});

tap.test(`23 - equal missing - mismatching quotes - A,B; B,A`, (t) => {
  const str = `<a class"c' id'e">`;
  const fixed = `<a class="c" id="e">`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
      "format-prettier": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "23.01");
  t.equal(messages.length, 4, "23.02");
  t.end();
});

// mismatching quotes
// -----------------------------------------------------------------------------

tap.test(`24 - no quotes in the value, A-B`, (t) => {
  const str = `<div class="c'>.</div>`;
  const fixed = `<div class="c">.</div>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "24.01");
  t.match(
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
  t.equal(messages.length, 1, "24.03");
  t.end();
});

tap.test(`25 - no quotes in the value, B-A`, (t) => {
  const str = `<div class='c">.</div>`;
  const fixed = `<div class="c">.</div>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "25.01");
  t.equal(messages.length, 1, "25.02");
  t.end();
});

tap.test(`26 - single quotes in the value, A-B`, (t) => {
  const str = `<img alt="Deal is your's!'/>`;
  const fixed = `<img alt="Deal is your's!"/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "26.01");
  t.match(
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
  t.equal(messages.length, 1, "26.03");
  t.end();
});

tap.test(`27 - single quotes in the value, B-A`, (t) => {
  const str = `<img alt='Deal is your's!"/>`;
  const fixed = `<img alt="Deal is your's!"/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "27.01");
  t.match(
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
  t.equal(messages.length, 1, "27.03");
  t.end();
});

// wrong letter case, legit attributes
// -----------------------------------------------------------------------------

tap.test(`28 - all caps attr name`, (t) => {
  const str = `<img SRC="spacer.gif" Alt=""/>`;
  const fixed = `<img src="spacer.gif" alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "28.01");
  t.match(
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
  t.equal(messages.length, 2, "28.03");
  t.end();
});

// unescaped matching quotes within a value
// -----------------------------------------------------------------------------

tap.test(`29 - D-D wrapping - useSingleToEscapeDouble = off`, (t) => {
  const str = `<img alt="so-called "artists"!"/>`;
  const fixed = `<img alt="so-called &quot;artists&quot;!"/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "29.01");
  t.match(
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
  t.equal(messages.length, 2, "29.03");
  t.end();
});

tap.test(`30 - S-S wrapping - useSingleToEscapeDouble = off`, (t) => {
  const str = `<img alt='so-called "artists"!'/>`;
  const fixed = `<img alt="so-called &quot;artists&quot;!"/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "30");
  t.end();
});

tap.test(`31 - D-S wrapping - useSingleToEscapeDouble = off`, (t) => {
  const str = `<img alt="so-called "artists"!'/>`;
  const fixed = `<img alt="so-called &quot;artists&quot;!"/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "31");
  t.end();
});

tap.test(`32 - S-D wrapping - useSingleToEscapeDouble = off`, (t) => {
  const str = `<img alt='so-called "artists"!"/>`;
  const fixed = `<img alt="so-called &quot;artists&quot;!"/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "32");
  t.end();
});

tap.test(`33 - useSingleToEscapeDouble = on`, (t) => {
  const str = `<img alt="so-called "artists"!"/>`;
  const fixed = `<img alt='so-called "artists"!'/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": [2, "useSingleToEscapeDouble"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "33.01");
  t.match(
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
  t.equal(messages.length, 2, "33.03");
  t.end();
});

tap.test(`34 - S-S wrapping - useSingleToEscapeDouble = on`, (t) => {
  const str = `<img alt='so-called "artists"!'/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": [2, "useSingleToEscapeDouble"],
    },
  });
  t.strictSame(messages, [], "34");
  t.end();
});

tap.test(`35 - S-D wrapping - useSingleToEscapeDouble = on`, (t) => {
  const str = `<img alt='so-called "artists"!"/>`;
  const fixed = `<img alt='so-called "artists"!'/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": [2, "useSingleToEscapeDouble"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "35");
  t.end();
});

tap.test(`36 - D-S wrapping - useSingleToEscapeDouble = on`, (t) => {
  const str = `<img alt="so-called "artists"!'/>`;
  const fixed = `<img alt='so-called "artists"!'/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": [2, "useSingleToEscapeDouble"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "36");
  t.end();
});

// various
// -----------------------------------------------------------------------------

tap.test(`37 - curly quotes instead`, (t) => {
  const str = `<div class=“foo”>z</div>`;
  const fixed = `<div class="foo">z</div>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "37");
  t.end();
});

tap.test(`38`, (t) => {
  const str = `<img alt="/>`;
  const fixed = `<img alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "38");
  t.end();
});

tap.test(`39`, (t) => {
  const str = `<img alt='/>`;
  const fixed = `<img alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "39");
  t.end();
});

tap.test(`40`, (t) => {
  const str = `<img alt=">`;
  const fixed = `<img alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "40");
  t.end();
});

tap.test(`41`, (t) => {
  const str = `<img alt='>`;
  const fixed = `<img alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "41");
  t.end();
});

tap.test(`42`, (t) => {
  const str = `<img alt=">`;
  const fixed = `<img alt="" />`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "42");
  t.end();
});

tap.test(`43`, (t) => {
  const str = `<img alt='>`;
  const fixed = `<img alt="" />`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
      "format-prettier": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "43");
  t.end();
});

tap.test(`44`, (t) => {
  const str = `<div class=\nfoo”>z</div>`;
  const fixed = `<div class="foo">z</div>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "44");
  t.end();
});

tap.test(`45`, (t) => {
  const str = `<div class=“foo\n>z</div>`;
  const fixed = `<div class="foo">z</div>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "45");
  t.end();
});

tap.test(`46`, (t) => {
  const str = `<img alt='there's "somethin" here'/>`;
  const fixed = `<img alt="there's &quot;somethin&quot; here"/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "46");
  t.end();
});

// leading whitespace
// -----------------------------------------------------------------------------

tap.test(`47 - leading space present`, (t) => {
  const str = `<span class="x" id="left">.</span>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.strictSame(messages, [], "47");
  t.end();
});

tap.test(`48 - leading space missing`, (t) => {
  const str = `<span class="x"id="left">.</span>`;
  const fixed = `<span class="x" id="left">.</span>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "48");
  t.end();
});

tap.test(`49 - two spaces`, (t) => {
  const str = `<span class="x"  id="left">.</span>`;
  const fixed = `<span class="x" id="left">.</span>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "49");
  t.end();
});

tap.test(`50 - one tab`, (t) => {
  const str = `<span class="x"\tid="left">.</span>`;
  const fixed = `<span class="x" id="left">.</span>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "50");
  t.end();
});

tap.test(`51 - ESP tags present`, (t) => {
  const str = `<span {% if x %}class="x" {% endif %}id="left">.</span>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "51");
  t.end();
});
