import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

const BACKSLASH = "\u005C";

// API precautions
// -----------------------------------------------------------------------------

tap.test(`01 - no bracket - early exit`, (t) => {
  const str = "</a ";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.strictSame(messages, [], "01");
  t.end();
});

tap.test(`02 - no bracket - early exit`, (t) => {
  const str = "</a <div>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.strictSame(messages, [], "02");
  t.end();
});

// NEVER
// -----------------------------------------------------------------------------

tap.test(`03 - a single tag, no slash`, (t) => {
  const str = "<a >";
  const fixed = "<a>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-before-closing-bracket",
        severity: 2,
        idxFrom: 0,
        idxTo: 4,
        message: "Remove space.",
        fix: {
          ranges: [[2, 3]],
        },
      },
    ],
    "03.01"
  );
  t.equal(messages.length, 1, "03.02");
  t.equal(applyFixes(str, messages), fixed, "03.03");
  t.end();
});

tap.test(`04 - a single tag, with slash`, (t) => {
  const str = "<br />";
  const fixed = "<br/>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-before-closing-bracket",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: "Remove space.",
        fix: {
          ranges: [[3, 4]],
        },
      },
    ],
    "04.01"
  );
  t.equal(messages.length, 1, "04.02");
  t.equal(applyFixes(str, messages), fixed, "04.03");
  t.end();
});

tap.test(`05 - a single closing tag, innter tabs`, (t) => {
  const str = "\n</a\t\t>";
  const fixed = "\n</a>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.equal(messages.length, 1, "05.01");
  t.equal(applyFixes(str, messages), fixed, "05.02");
  t.end();
});

tap.test(`06 - highly unlikely`, (t) => {
  const str = "\n</a\t\t/>";
  const fixed = "\n</a/>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.equal(messages.length, 1, "06.01");
  t.equal(applyFixes(str, messages), fixed, "06.02");
  t.end();
});

tap.test(`07 - closing tag, attribute, innter tabs`, (t) => {
  const str = `\n</a class="z"\t\t>`;
  const fixed = `\n</a class="z">`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.equal(messages.length, 1, "07.01");
  t.equal(applyFixes(str, messages), fixed, "07.02");
  t.end();
});

tap.test(`08 - highly unikely too`, (t) => {
  const str = `\n</a class="z"\t\t/>`;
  const fixed = `\n</a class="z"/>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.equal(messages.length, 1, "08.01");
  t.equal(applyFixes(str, messages), fixed, "08.02");
  t.end();
});

tap.test(`09 - a space, never`, (t) => {
  const str = `<div class="zz yy" >`;
  const fixed = `<div class="zz yy">`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(messages.length, 1, "09.01");
  t.equal(applyFixes(str, messages), fixed, "09.02");
  t.end();
});

tap.test(`10 - a space, never, slash, non-void tag`, (t) => {
  const str = `<div class="zz yy" />`;
  const fixed = `<div class="zz yy"/>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(messages.length, 1, "10.01");
  t.equal(applyFixes(str, messages), fixed, "10.02");
  t.end();
});

tap.test(`11 - a space, never`, (t) => {
  const str = `<br class="zz yy" />`;
  const fixed = `<br class="zz yy"/>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(messages.length, 1, "11.01");
  t.equal(applyFixes(str, messages), fixed, "11.02");
  t.end();
});

tap.test(`12 - void tag, tight, never, no slash`, (t) => {
  const str = `<br>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.strictSame(messages, [], "12");
  t.end();
});

tap.test(`13 - void tag, tight, never, slash`, (t) => {
  const str = `<br/>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.strictSame(messages, [], "13");
  t.end();
});

tap.test(`14 - void tag, space, never, no slash`, (t) => {
  const str = `<br >`;
  const fixed = `<br>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(messages.length, 1, "14.01");
  t.equal(applyFixes(str, messages), fixed, "14.02");
  t.end();
});

tap.test(`15 - void tag, space, never, slash`, (t) => {
  const str = `<br />`;
  const fixed = `<br/>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(messages.length, 1, "15.01");
  t.equal(applyFixes(str, messages), fixed, "15.02");
  t.end();
});

tap.test(`16 - void tag, tab, never, no slash`, (t) => {
  const str = `<br\t>`;
  const fixed = `<br>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(messages.length, 1, "16.01");
  t.equal(applyFixes(str, messages), fixed, "16.02");
  t.end();
});

tap.test(`17 - void tag, tab, never, slash`, (t) => {
  const str = `<br\t/>`;
  const fixed = `<br/>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(messages.length, 1, "17.01");
  t.equal(applyFixes(str, messages), fixed, "17.02");
  t.end();
});

tap.test(`18 - void tag, format-prettier, tight, never, no slash`, (t) => {
  const str = `<br>`;
  const fixed = `<br >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2, // prettier overrides other rules, including one above
    },
  });
  t.equal(applyFixes(str, messages), fixed, "18");
  t.end();
});

tap.test(`19 - void tag, format-prettier, tight, never, slash`, (t) => {
  const str = `<br/>`;
  const fixed = `<br />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2, // prettier overrides other rules, including one above
    },
  });
  t.equal(applyFixes(str, messages), fixed, "19");
  t.end();
});

tap.test(`20 - void tag, format-prettier, space, never, no slash`, (t) => {
  const str = `<br >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  t.strictSame(messages, [], "20");
  t.end();
});

tap.test(`21 - void tag, all rules, space, no slash`, (t) => {
  const str = `<br >`;
  const fixed = `<br />`;
  const messages = verify(t, str, {
    rules: {
      all: 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "21");
  t.end();
});

tap.test(`22 - void tag, format-prettier, space, never, slash`, (t) => {
  const str = `<br />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  t.strictSame(messages, [], "22");
  t.end();
});

tap.test(`23 - void tag, all rules, space, never, slash`, (t) => {
  const str = `<br />`;
  const messages = verify(t, str, {
    rules: {
      all: 2,
    },
  });
  t.strictSame(messages, [], "23");
  t.end();
});

tap.test(`24 - void tag, format-prettier, tab, never, no slash`, (t) => {
  const str = `<br\t>`;
  const fixed = `<br >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  t.equal(messages.length, 1, "24.01");
  t.equal(applyFixes(str, messages), fixed, "24.02");
  t.end();
});

tap.test(`25 - void tag, format-prettier, tab, never, slash`, (t) => {
  const str = `<br\t/>`;
  const fixed = `<br />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  t.equal(messages.length, 1, "25.01");
  t.equal(applyFixes(str, messages), fixed, "25.02");
  t.end();
});

tap.test(`26 - non-void, tight tab, no slash, never`, (t) => {
  const str = `<div class="zz yy"\t>`;
  const fixed = `<div class="zz yy">`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(messages.length, 1, "26.01");
  t.equal(applyFixes(str, messages), fixed, "26.02");
  t.end();
});

tap.test(`27 - non-void, tight tab, slash, never`, (t) => {
  const str = `<div class="zz yy"\t/>`;
  const fixed = `<div class="zz yy"/>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(messages.length, 1, "27.01");
  t.equal(applyFixes(str, messages), fixed, "27.02");
  t.end();
});

// ALWAYS
// -----------------------------------------------------------------------------

tap.test(`28 - non-void, a space, always, no slash`, (t) => {
  const str = `<div class="zz yy" >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.strictSame(messages, [], "28");
  t.end();
});

tap.test(`29 - non-void, a space, always, slash`, (t) => {
  const str = `<div class="zz yy" />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.strictSame(messages, [], "29");
  t.end();
});

tap.test(`30 - non-void, no space, always, no slash`, (t) => {
  const str = `<div class="zz yy">`;
  const fixed = `<div class="zz yy" >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-before-closing-bracket",
        severity: 2,
        idxFrom: 0,
        idxTo: 19,
        message: "Add a space.",
        fix: {
          ranges: [[18, 18, " "]],
        },
      },
    ],
    "30.01"
  );
  t.equal(messages.length, 1, "30.02");
  t.equal(applyFixes(str, messages), fixed, "30.03");
  t.end();
});

tap.test(`31 - non-void, no space, always, slash`, (t) => {
  const str = `<div class="zz yy"/>`;
  const fixed = `<div class="zz yy" />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-before-closing-bracket",
        severity: 2,
        idxFrom: 0,
        idxTo: 20,
        message: "Add a space.",
        fix: {
          ranges: [[18, 18, " "]],
        },
      },
    ],
    "31.01"
  );
  t.equal(messages.length, 1, "31.02");
  t.equal(applyFixes(str, messages), fixed, "31.03");
  t.end();
});

tap.test(`32 - non-void, tab tight, no slash, always`, (t) => {
  const str = `<div class="zz yy"\t>`;
  const fixed = `<div class="zz yy" >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(messages.length, 1, "32.01");
  t.equal(applyFixes(str, messages), fixed, "32.02");
  t.end();
});

tap.test(`33 - non-void, tab tight, slash, always`, (t) => {
  const str = `<div class="zz yy"\t/>`;
  const fixed = `<div class="zz yy" />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(messages.length, 1, "33.01");
  t.equal(applyFixes(str, messages), fixed, "33.02");
  t.end();
});

tap.test(`34 - non-void, space-tab, no slash, always`, (t) => {
  const str = `<div class="zz yy" \t>`;
  const fixed = `<div class="zz yy" >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(messages.length, 1, "34.01");
  t.equal(applyFixes(str, messages), fixed, "34.02");
  t.end();
});

tap.test(`35 - non-void, space-tab, slash, always`, (t) => {
  const str = `<div class="zz yy" \t/>`;
  const fixed = `<div class="zz yy" />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(messages.length, 1, "35.01");
  t.equal(applyFixes(str, messages), fixed, "35.02");
  t.end();
});

tap.test(`36 - non-void, tab-space, no slash, always`, (t) => {
  const str = `<div class="zz yy"\t >`;
  const fixed = `<div class="zz yy" >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(messages.length, 1, "36.01");
  t.equal(applyFixes(str, messages), fixed, "36.02");
  t.end();
});

tap.test(`37 - non-void, tab-space, slash, always`, (t) => {
  const str = `<div class="zz yy"\t />`;
  const fixed = `<div class="zz yy" />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(messages.length, 1, "37.01");
  t.equal(applyFixes(str, messages), fixed, "37.02");
  t.end();
});

//

tap.test(`38 - pair, on a default, prettier`, (t) => {
  const str = `<a >z</a >`;
  const fixed = `<a>z</a>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "38");
  t.end();
});

tap.test(`39 - pair, on a default, prettier`, (t) => {
  const str = `<a >z</a >`;
  const fixed = `<a>z</a>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "39");
  t.end();
});

tap.test(`40 - pair, never, prettier`, (t) => {
  const str = `<a >z</a >`;
  const fixed = `<a>z</a>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "40");
  t.end();
});

tap.test(`41 - pair, never, prettier`, (t) => {
  const str = `<a >z</a >`;
  const fixed = `<a>z</a>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "41");
  t.end();
});

tap.test(`42 - pair, always, prettier`, (t) => {
  const str = `<a >z</a >`;
  const fixed = `<a>z</a>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "42");
  t.end();
});

tap.test(`43 - pair, always, prettier`, (t) => {
  const str = `<a >z</a >`;
  const fixed = `<a>z</a>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "43");
  t.end();
});

//

tap.test(`44 - void tag, tight, always, no slash`, (t) => {
  const str = `<br>`;
  const fixed = `<br >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(messages.length, 1, "44.01");
  t.equal(applyFixes(str, messages), fixed, "44.02");
  t.end();
});

tap.test(`45 - void tag, space, always, no slash`, (t) => {
  const str = `<br >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.strictSame(messages, [], "45");
  t.end();
});

tap.test(`46 - void tag, tab, always, no slash`, (t) => {
  const str = `<br\t>`;
  const fixed = `<br >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(messages.length, 1, "46.01");
  t.equal(applyFixes(str, messages), fixed, "46.02");
  t.end();
});

tap.test(`47 - void tag, format-prettier, tight, always, no slash`, (t) => {
  const str = `<br>`;
  const fixed = `<br >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.equal(messages.length, 1, "47.01");
  t.equal(applyFixes(str, messages), fixed, "47.02");
  t.end();
});

tap.test(`48 - tab, format-prettier, no slash, always`, (t) => {
  const str = `<div class="zz yy"\t>`;
  const fixed = `<div class="zz yy">`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "48");
  t.end();
});

tap.test(`49 - tab, format-prettier, no slash, always`, (t) => {
  const str = `<div class="zz yy" \t>`;
  const fixed = `<div class="zz yy">`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "49");
  t.end();
});

tap.test(`50 - tab, format-prettier, no slash, always`, (t) => {
  const str = `<div class="zz yy"\t >`;
  const fixed = `<div class="zz yy">`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "50");
  t.end();
});

tap.test(`51 - tab, format-prettier, no slash, never`, (t) => {
  const str = `<div class="zz yy"\t>`;
  const fixed = `<div class="zz yy">`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "51");
  t.end();
});

tap.test(`52 - void tag, format-prettier, space, always, no slash`, (t) => {
  const str = `<br >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.strictSame(messages, [], "52");
  t.end();
});

tap.test(`53 - void tag, format-prettier, tab, always, no slash`, (t) => {
  const str = `<br\t>`;
  const fixed = `<br >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "53");
  t.end();
});

tap.test(`54 - void tag, tight, always, slash`, (t) => {
  const str = `<br/>`;
  const fixed = `<br />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "54");
  t.end();
});

tap.test(`55 - void tag, space, always, slash`, (t) => {
  const str = `<br />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.strictSame(messages, [], "55");
  t.end();
});

tap.test(`56 - void tag, tab, always, slash`, (t) => {
  const str = `<br\t/>`;
  const fixed = `<br />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "56");
  t.end();
});

tap.test(`57 - void tag, format-prettier, tight, always, slash`, (t) => {
  const str = `<br/>`;
  const fixed = `<br />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "57");
  t.end();
});

tap.test(`58 - void tag, format-prettier, space, always, slash`, (t) => {
  const str = `<br />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.strictSame(messages, [], "58");
  t.end();
});

tap.test(`59 - void tag, format-prettier, tab, always, slash`, (t) => {
  const str = `<br\t/>`;
  const fixed = `<br />`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "59");
  t.end();
});

// XML
// -----------------------------------------------------------------------------

tap.test(`60 - ${`\u001b[${36}m${`XML tags`}\u001b[${39}m`} - basic`, (t) => {
  const str = `<?xml version="1.0" encoding="UTF-8"?   >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-before-closing-bracket",
        severity: 2,
        idxFrom: 0,
        idxTo: 41,
        message: "Remove space.",
        fix: {
          ranges: [[37, 40]],
        },
      },
    ],
    "60.01"
  );
  t.equal(messages.length, 1, "60.02");
  t.equal(
    applyFixes(str, messages),
    `<?xml version="1.0" encoding="UTF-8"?>`,
    "60.03"
  );
  t.end();
});

tap.test(`61 - prettier overrides setting always`, (t) => {
  const str = `<?xml version="1.0" encoding="UTF-8"?   >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-before-closing-bracket",
        severity: 2,
        idxFrom: 0,
        idxTo: 41,
        message: "Remove space.",
        fix: {
          ranges: [[37, 40]],
        },
      },
    ],
    "61.01"
  );
  t.equal(messages.length, 1, "61.02");
  t.equal(
    applyFixes(str, messages),
    `<?xml version="1.0" encoding="UTF-8"?>`,
    "61.03"
  );
  t.end();
});

// doesn't raise errors
// -----------------------------------------------------------------------------

//

tap.test(`62 - default`, (t) => {
  const str = "<br\t\t/\t\t>";
  const fixed = "<br/\t\t>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "62");
  t.end();
});

tap.test(`63 - never`, (t) => {
  const str = "<br\t\t/\t\t>";
  const fixed = "<br/\t\t>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "63");
  t.end();
});

tap.test(`64 - always`, (t) => {
  const str = "<br\t\t/\t\t>";
  const fixed = "<br /\t\t>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "64");
  t.end();
});

tap.test(`65 - default, prettier`, (t) => {
  const str = "<br\t\t/\t\t>";
  const fixed = "<br /\t\t>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "65");
  t.end();
});

tap.test(`66 - never, prettier`, (t) => {
  const str = "<br\t\t/\t\t>";
  const fixed = "<br /\t\t>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "66");
  t.end();
});

tap.test(`67 - always, prettier`, (t) => {
  const str = "<br\t\t/\t\t>";
  const fixed = "<br /\t\t>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "67");
  t.end();
});

//

tap.test(`68 - default`, (t) => {
  const str = `<br\t\t${BACKSLASH}\t\t>`;
  const fixed = `<br${BACKSLASH}\t\t>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "68");
  t.end();
});

tap.test(`69 - always`, (t) => {
  const str = `<br\t\t${BACKSLASH}\t\t>`;
  const fixed = `<br ${BACKSLASH}\t\t>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "69");
  t.end();
});

tap.test(`70 - never`, (t) => {
  const str = `<br\t\t${BACKSLASH}\t\t>`;
  const fixed = `<br${BACKSLASH}\t\t>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "70");
  t.end();
});

tap.test(`71 - default, prettier`, (t) => {
  const str = `<br\t\t${BACKSLASH}\t\t>`;
  const fixed = `<br ${BACKSLASH}\t\t>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "71");
  t.end();
});

tap.test(`72 - always, prettier`, (t) => {
  const str = `<br\t\t${BACKSLASH}\t\t>`;
  const fixed = `<br ${BACKSLASH}\t\t>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "72");
  t.end();
});

tap.test(`73 - never, prettier`, (t) => {
  const str = `<br\t\t${BACKSLASH}\t\t>`;
  const fixed = `<br ${BACKSLASH}\t\t>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "73");
  t.end();
});

tap.test(`74 - messed up code, fixed on all`, (t) => {
  const str = `<br\t\t${BACKSLASH}\t\t>`;
  const fixed1 = `<br  /  >`;
  const fixed2 = `<br />`;
  const messages1 = verify(t, str, {
    rules: {
      all: 2,
    },
  });
  t.equal(applyFixes(str, messages1), fixed1, "74.01");
  // second round:
  const messages2 = verify(t, fixed1, {
    rules: {
      all: 2,
    },
  });
  t.equal(applyFixes(fixed1, messages2), fixed2, "74.02");
  t.end();
});
