import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

const BACKSLASH = "\u005C";

// API precautions
// -----------------------------------------------------------------------------

test(`01 - no bracket - early exit`, () => {
  let str = "</a ";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  equal(messages, [], "01.01");
});

test(`02 - no bracket - early exit`, () => {
  let str = "</a <div>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  equal(messages, [], "02.01");
});

// NEVER
// -----------------------------------------------------------------------------

test(`03 - a single tag, no slash`, () => {
  let str = "<a >";
  let fixed = "<a>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  compare(
    ok,
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
  equal(messages.length, 1, "03.01");
  equal(applyFixes(str, messages), fixed, "03.02");
});

test(`04 - a single tag, with slash`, () => {
  let str = "<br />";
  let fixed = "<br/>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  compare(
    ok,
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
  equal(messages.length, 1, "04.01");
  equal(applyFixes(str, messages), fixed, "04.02");
});

test(`05 - a single closing tag, innter tabs`, () => {
  let str = "\n</a\t\t>";
  let fixed = "\n</a>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  equal(messages.length, 1, "05.01");
  equal(applyFixes(str, messages), fixed, "05.02");
});

test(`06 - highly unlikely`, () => {
  let str = "\n</a\t\t/>";
  let fixed = "\n</a/>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  equal(messages.length, 1, "06.01");
  equal(applyFixes(str, messages), fixed, "06.02");
});

test(`07 - closing tag, attribute, innter tabs`, () => {
  let str = `\n</a class="z"\t\t>`;
  let fixed = `\n</a class="z">`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  equal(messages.length, 1, "07.01");
  equal(applyFixes(str, messages), fixed, "07.02");
});

test(`08 - highly unikely too`, () => {
  let str = `\n</a class="z"\t\t/>`;
  let fixed = `\n</a class="z"/>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  equal(messages.length, 1, "08.01");
  equal(applyFixes(str, messages), fixed, "08.02");
});

test(`09 - a space, never`, () => {
  let str = `<div class="zz yy" >`;
  let fixed = `<div class="zz yy">`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(messages.length, 1, "09.01");
  equal(applyFixes(str, messages), fixed, "09.02");
});

test(`10 - a space, never, slash, non-void tag`, () => {
  let str = `<div class="zz yy" />`;
  let fixed = `<div class="zz yy"/>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(messages.length, 1, "10.01");
  equal(applyFixes(str, messages), fixed, "10.02");
});

test(`11 - a space, never`, () => {
  let str = `<br class="zz yy" />`;
  let fixed = `<br class="zz yy"/>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(messages.length, 1, "11.01");
  equal(applyFixes(str, messages), fixed, "11.02");
});

test(`12 - void tag, tight, never, no slash`, () => {
  let str = `<br>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(messages, [], "12.01");
});

test(`13 - void tag, tight, never, slash`, () => {
  let str = `<br/>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(messages, [], "13.01");
});

test(`14 - void tag, space, never, no slash`, () => {
  let str = `<br >`;
  let fixed = `<br>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(messages.length, 1, "14.01");
  equal(applyFixes(str, messages), fixed, "14.02");
});

test(`15 - void tag, space, never, slash`, () => {
  let str = `<br />`;
  let fixed = `<br/>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(messages.length, 1, "15.01");
  equal(applyFixes(str, messages), fixed, "15.02");
});

test(`16 - void tag, tab, never, no slash`, () => {
  let str = `<br\t>`;
  let fixed = `<br>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(messages.length, 1, "16.01");
  equal(applyFixes(str, messages), fixed, "16.02");
});

test(`17 - void tag, tab, never, slash`, () => {
  let str = `<br\t/>`;
  let fixed = `<br/>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(messages.length, 1, "17.01");
  equal(applyFixes(str, messages), fixed, "17.02");
});

test(`18 - void tag, format-prettier, tight, never, no slash`, () => {
  let str = `<br>`;
  let fixed = `<br >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2, // prettier overrides other rules, including one above
    },
  });
  equal(applyFixes(str, messages), fixed, "18.01");
});

test(`19 - void tag, format-prettier, tight, never, slash`, () => {
  let str = `<br/>`;
  let fixed = `<br />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2, // prettier overrides other rules, including one above
    },
  });
  equal(applyFixes(str, messages), fixed, "19.01");
});

test(`20 - void tag, format-prettier, space, never, no slash`, () => {
  let str = `<br >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  equal(messages, [], "20.01");
});

test(`21 - void tag, all rules, space, no slash`, () => {
  let str = `<br >`;
  let fixed = `<br />`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "21.01");
});

test(`22 - void tag, format-prettier, space, never, slash`, () => {
  let str = `<br />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  equal(messages, [], "22.01");
});

test(`23 - void tag, all rules, space, never, slash`, () => {
  let str = `<br />`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  equal(messages, [], "23.01");
});

test(`24 - void tag, format-prettier, tab, never, no slash`, () => {
  let str = `<br\t>`;
  let fixed = `<br >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  equal(messages.length, 1, "24.01");
  equal(applyFixes(str, messages), fixed, "24.02");
});

test(`25 - void tag, format-prettier, tab, never, slash`, () => {
  let str = `<br\t/>`;
  let fixed = `<br />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  equal(messages.length, 1, "25.01");
  equal(applyFixes(str, messages), fixed, "25.02");
});

test(`26 - non-void, tight tab, no slash, never`, () => {
  let str = `<div class="zz yy"\t>`;
  let fixed = `<div class="zz yy">`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(messages.length, 1, "26.01");
  equal(applyFixes(str, messages), fixed, "26.02");
});

test(`27 - non-void, tight tab, slash, never`, () => {
  let str = `<div class="zz yy"\t/>`;
  let fixed = `<div class="zz yy"/>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(messages.length, 1, "27.01");
  equal(applyFixes(str, messages), fixed, "27.02");
});

// ALWAYS
// -----------------------------------------------------------------------------

test(`28 - non-void, a space, always, no slash`, () => {
  let str = `<div class="zz yy" >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages, [], "28.01");
});

test(`29 - non-void, a space, always, slash`, () => {
  let str = `<div class="zz yy" />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages, [], "29.01");
});

test(`30 - non-void, no space, always, no slash`, () => {
  let str = `<div class="zz yy">`;
  let fixed = `<div class="zz yy" >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  compare(
    ok,
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
  equal(messages.length, 1, "30.01");
  equal(applyFixes(str, messages), fixed, "30.02");
});

test(`31 - non-void, no space, always, slash`, () => {
  let str = `<div class="zz yy"/>`;
  let fixed = `<div class="zz yy" />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  compare(
    ok,
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
  equal(messages.length, 1, "31.01");
  equal(applyFixes(str, messages), fixed, "31.02");
});

test(`32 - non-void, tab tight, no slash, always`, () => {
  let str = `<div class="zz yy"\t>`;
  let fixed = `<div class="zz yy" >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages.length, 1, "32.01");
  equal(applyFixes(str, messages), fixed, "32.02");
});

test(`33 - non-void, tab tight, slash, always`, () => {
  let str = `<div class="zz yy"\t/>`;
  let fixed = `<div class="zz yy" />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages.length, 1, "33.01");
  equal(applyFixes(str, messages), fixed, "33.02");
});

test(`34 - non-void, space-tab, no slash, always`, () => {
  let str = `<div class="zz yy" \t>`;
  let fixed = `<div class="zz yy" >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages.length, 1, "34.01");
  equal(applyFixes(str, messages), fixed, "34.02");
});

test(`35 - non-void, space-tab, slash, always`, () => {
  let str = `<div class="zz yy" \t/>`;
  let fixed = `<div class="zz yy" />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages.length, 1, "35.01");
  equal(applyFixes(str, messages), fixed, "35.02");
});

test(`36 - non-void, tab-space, no slash, always`, () => {
  let str = `<div class="zz yy"\t >`;
  let fixed = `<div class="zz yy" >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages.length, 1, "36.01");
  equal(applyFixes(str, messages), fixed, "36.02");
});

test(`37 - non-void, tab-space, slash, always`, () => {
  let str = `<div class="zz yy"\t />`;
  let fixed = `<div class="zz yy" />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages.length, 1, "37.01");
  equal(applyFixes(str, messages), fixed, "37.02");
});

//

test(`38 - pair, on a default, prettier`, () => {
  let str = `<a >z</a >`;
  let fixed = `<a>z</a>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "38.01");
});

test(`39 - pair, on a default, prettier`, () => {
  let str = `<a >z</a >`;
  let fixed = `<a>z</a>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "39.01");
});

test(`40 - pair, never, prettier`, () => {
  let str = `<a >z</a >`;
  let fixed = `<a>z</a>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(applyFixes(str, messages), fixed, "40.01");
});

test(`41 - pair, never, prettier`, () => {
  let str = `<a >z</a >`;
  let fixed = `<a>z</a>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "41.01");
});

test(`42 - pair, always, prettier`, () => {
  let str = `<a >z</a >`;
  let fixed = `<a>z</a>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "42.01");
});

test(`43 - pair, always, prettier`, () => {
  let str = `<a >z</a >`;
  let fixed = `<a>z</a>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "43.01");
});

//

test(`44 - void tag, tight, always, no slash`, () => {
  let str = `<br>`;
  let fixed = `<br >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages.length, 1, "44.01");
  equal(applyFixes(str, messages), fixed, "44.02");
});

test(`45 - void tag, space, always, no slash`, () => {
  let str = `<br >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages, [], "45.01");
});

test(`46 - void tag, tab, always, no slash`, () => {
  let str = `<br\t>`;
  let fixed = `<br >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages.length, 1, "46.01");
  equal(applyFixes(str, messages), fixed, "46.02");
});

test(`47 - void tag, format-prettier, tight, always, no slash`, () => {
  let str = `<br>`;
  let fixed = `<br >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(messages.length, 1, "47.01");
  equal(applyFixes(str, messages), fixed, "47.02");
});

test(`48 - tab, format-prettier, no slash, always`, () => {
  let str = `<div class="zz yy"\t>`;
  let fixed = `<div class="zz yy">`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "48.01");
});

test(`49 - tab, format-prettier, no slash, always`, () => {
  let str = `<div class="zz yy" \t>`;
  let fixed = `<div class="zz yy">`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "49.01");
});

test(`50 - tab, format-prettier, no slash, always`, () => {
  let str = `<div class="zz yy"\t >`;
  let fixed = `<div class="zz yy">`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "50.01");
});

test(`51 - tab, format-prettier, no slash, never`, () => {
  let str = `<div class="zz yy"\t>`;
  let fixed = `<div class="zz yy">`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "51.01");
});

test(`52 - void tag, format-prettier, space, always, no slash`, () => {
  let str = `<br >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(messages, [], "52.01");
});

test(`53 - void tag, format-prettier, tab, always, no slash`, () => {
  let str = `<br\t>`;
  let fixed = `<br >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "53.01");
});

test(`54 - void tag, tight, always, slash`, () => {
  let str = `<br/>`;
  let fixed = `<br />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "54.01");
});

test(`55 - void tag, space, always, slash`, () => {
  let str = `<br />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(messages, [], "55.01");
});

test(`56 - void tag, tab, always, slash`, () => {
  let str = `<br\t/>`;
  let fixed = `<br />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "56.01");
});

test(`57 - void tag, format-prettier, tight, always, slash`, () => {
  let str = `<br/>`;
  let fixed = `<br />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "57.01");
});

test(`58 - void tag, format-prettier, space, always, slash`, () => {
  let str = `<br />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(messages, [], "58.01");
});

test(`59 - void tag, format-prettier, tab, always, slash`, () => {
  let str = `<br\t/>`;
  let fixed = `<br />`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "59.01");
});

// XML
// -----------------------------------------------------------------------------

test(`60 - ${`\u001b[${36}m${`XML tags`}\u001b[${39}m`} - basic`, () => {
  let str = `<?xml version="1.0" encoding="UTF-8"?   >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  compare(
    ok,
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
  equal(messages.length, 1, "60.01");
  equal(
    applyFixes(str, messages),
    `<?xml version="1.0" encoding="UTF-8"?>`,
    "60.02"
  );
});

test(`61 - prettier overrides setting always`, () => {
  let str = `<?xml version="1.0" encoding="UTF-8"?   >`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  compare(
    ok,
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
  equal(messages.length, 1, "61.01");
  equal(
    applyFixes(str, messages),
    `<?xml version="1.0" encoding="UTF-8"?>`,
    "61.02"
  );
});

// doesn't raise errors
// -----------------------------------------------------------------------------

//

test(`62 - default`, () => {
  let str = "<br\t\t/\t\t>";
  let fixed = "<br/\t\t>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "62.01");
});

test(`63 - never`, () => {
  let str = "<br\t\t/\t\t>";
  let fixed = "<br/\t\t>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(applyFixes(str, messages), fixed, "63.01");
});

test(`64 - always`, () => {
  let str = "<br\t\t/\t\t>";
  let fixed = "<br /\t\t>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "64.01");
});

test(`65 - default, prettier`, () => {
  let str = "<br\t\t/\t\t>";
  let fixed = "<br /\t\t>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "65.01");
});

test(`66 - never, prettier`, () => {
  let str = "<br\t\t/\t\t>";
  let fixed = "<br /\t\t>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "66.01");
});

test(`67 - always, prettier`, () => {
  let str = "<br\t\t/\t\t>";
  let fixed = "<br /\t\t>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "67.01");
});

//

test(`68 - default`, () => {
  let str = `<br\t\t${BACKSLASH}\t\t>`;
  let fixed = `<br${BACKSLASH}\t\t>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "68.01");
});

test(`69 - always`, () => {
  let str = `<br\t\t${BACKSLASH}\t\t>`;
  let fixed = `<br ${BACKSLASH}\t\t>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "69.01");
});

test(`70 - never`, () => {
  let str = `<br\t\t${BACKSLASH}\t\t>`;
  let fixed = `<br${BACKSLASH}\t\t>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(applyFixes(str, messages), fixed, "70.01");
});

test(`71 - default, prettier`, () => {
  let str = `<br\t\t${BACKSLASH}\t\t>`;
  let fixed = `<br ${BACKSLASH}\t\t>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "71.01");
});

test(`72 - always, prettier`, () => {
  let str = `<br\t\t${BACKSLASH}\t\t>`;
  let fixed = `<br ${BACKSLASH}\t\t>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "72.01");
});

test(`73 - never, prettier`, () => {
  let str = `<br\t\t${BACKSLASH}\t\t>`;
  let fixed = `<br ${BACKSLASH}\t\t>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "73.01");
});

test(`74 - messed up code, fixed on all`, () => {
  let str = `<br\t\t${BACKSLASH}\t\t>`;
  let fixed1 = `<br  /  >`;
  let fixed2 = `<br />`;
  let messages1 = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  equal(applyFixes(str, messages1), fixed1, "74.01");
  // second round:
  let messages2 = verify(not, fixed1, {
    rules: {
      all: 2,
    },
  });
  equal(applyFixes(fixed1, messages2), fixed2, "74.02");
});

test.run();
