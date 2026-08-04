// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// punctuation
// -----------------------------------------------------------------------------

test("001 - punctuation after tag - simplified, question mark", () => {
  let { result, ranges } = stripHtml("a<b>?</b> c");
  equal(result, "a? c", "001.01");
  equal(
    ranges,
    [
      [1, 4],
      [5, 10, " "],
    ],
    "001.02",
  );
});

test("002 - punctuation after tag - simplified, question mark", () => {
  equal(
    stripHtml("a<b>?</b> c", { trimOnlySpaces: true }).result,
    "a? c",
    "002.01",
  );
});

test("003 - punctuation after tag - simplified, question mark", () => {
  equal(
    stripHtml("a<b>?</b> c", { dumpLinkHrefsNearby: { enabled: true } }).result,
    "a? c",
    "003.01",
  );
});

test("004 - punctuation after tag - simplified, question mark", () => {
  equal(
    stripHtml("a<b>?</b> c", { stripTogetherWithTheirContents: false }).result,
    "a? c",
    "004.01",
  );
});

test("005 - punctuation after tag - simplified, question mark", () => {
  equal(
    stripHtml("a<b>?</b> c", { ignoreTags: ["zzz"] }).result,
    "a? c",
    "005.01",
  );
});

test("006 - punctuation after tag - simplified, question mark", () => {
  equal(
    stripHtml("a<b>?</b> c", { ignoreTags: null }).result,
    "a? c",
    "006.01",
  );
});

test("007 - punctuation after tag - simplified, exclamation mark", () => {
  let { ranges, result } = stripHtml("a<b>!</b> c");
  equal(
    ranges,
    [
      [1, 4],
      [5, 10, " "],
    ],
    "007.01",
  );
  equal(result, "a! c", "007.02");
});

test("008 - punctuation after tag - simplified, exclamation mark", () => {
  let { result, ranges } = stripHtml("a<b>!</b> c", { trimOnlySpaces: true });
  equal(result, "a! c", "008.01");
  equal(
    ranges,
    [
      [1, 4],
      [5, 10, " "],
    ],
    "008.02",
  );
});

test("009 - punctuation after tag - simplified, exclamation mark", () => {
  let { result, ranges } = stripHtml(" \t a<b>!</b> c \t ", {
    trimOnlySpaces: true,
  });
  equal(result, "\t a! c \t", "009.01");
  equal(
    ranges,
    [
      [0, 1],
      [4, 7],
      [8, 13, " "],
      [16, 17],
    ],
    "009.02",
  );
});

test("010 - punctuation after tag - simplified, exclamation mark", () => {
  equal(
    stripHtml("a<b>!</b> c", { dumpLinkHrefsNearby: { enabled: true } }).result,
    "a! c",
    "010.01",
  );
});

test("011 - punctuation after tag - simplified, exclamation mark", () => {
  equal(
    stripHtml("a<b>!</b> c", { stripTogetherWithTheirContents: false }).result,
    "a! c",
    "011.01",
  );
});

test("012 - punctuation after tag - simplified, exclamation mark", () => {
  let { result, ranges } = stripHtml("a<b>!</b> c", { ignoreTags: ["zzz"] });
  equal(result, "a! c", "012.01");
  equal(
    ranges,
    [
      [1, 4],
      [5, 10, " "],
    ],
    "012.02",
  );
});

test("013 - punctuation after tag - simplified, exclamation mark", () => {
  equal(stripHtml("a<div>!</div>c").result, "a! c", "013.01");
  equal(stripHtml("a<b>!</b>c").result, "a!c", "013.02");
});

test("014 - punctuation after tag - simplified, ellipsis", () => {
  let { result, ranges } = stripHtml("a<b>...</b> c");
  equal(result, "a... c", "014.01");
  equal(
    ranges,
    [
      [1, 4],
      [7, 12, " "],
    ],
    "014.02",
  );
});

test("015 - punctuation after tag - simplified, ellipsis", () => {
  let { result, ranges } = stripHtml("a<b>...</b> c", { trimOnlySpaces: true });
  equal(result, "a... c", "015.01");
  equal(
    ranges,
    [
      [1, 4],
      [7, 12, " "],
    ],
    "015.02",
  );
});

test("016 - punctuation after tag - simplified, ellipsis", () => {
  let { result, ranges } = stripHtml("a<b>...</b> c", {
    dumpLinkHrefsNearby: { enabled: true },
  });
  equal(result, "a... c", "016.01");
  equal(
    ranges,
    [
      [1, 4],
      [7, 12, " "],
    ],
    "016.02",
  );
});

test("017 - punctuation after tag - simplified, ellipsis", () => {
  let { result, ranges } = stripHtml("a<b>...</b> c", {
    stripTogetherWithTheirContents: false,
  });
  equal(result, "a... c", "017.01");
  equal(
    ranges,
    [
      [1, 4],
      [7, 12, " "],
    ],
    "017.02",
  );
});

test("018 - punctuation after tag - simplified, ellipsis", () => {
  let { result, ranges } = stripHtml("a<b>...</b> c", { ignoreTags: ["zzz"] });
  equal(result, "a... c", "018.01");
  equal(
    ranges,
    [
      [1, 4],
      [7, 12, " "],
    ],
    "018.02",
  );
});

test("019 - punctuation after tag - real-life", () => {
  // control
  equal(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      ',
    ).result,
    "Hi! Would you like to shop now?",
    "019.01",
  );
});

test("020 - punctuation after tag - real-life", () => {
  equal(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      ",
    ).result,
    "Hi! Please shop now!",
    "020.01",
  );
});

test("021 - punctuation after tag - real-life", () => {
  // opts.trimOnlySpaces
  equal(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      ',
      {
        trimOnlySpaces: true,
      },
    ).result,
    "\u00A0     Hi! Would you like to shop now?      \u00A0",
    "021.01",
  );
});

test("022 - punctuation after tag - real-life", () => {
  equal(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      ",
      { trimOnlySpaces: true },
    ).result,
    "\u00A0     Hi! Please shop now!      \u00A0",
    "022.01",
  );
});

test("023 - quotes - surrounded", () => {
  equal(
    stripHtml('<li>"<a href="/Foo/bar">zzz</a>"</li>').result,
    '"zzz"',
    "023.01",
  );
});

test("024 - quotes - surrounded, tight", () => {
  equal(stripHtml("<li>(<strong>zzz</strong>)</li>").result, "(zzz)", "024.01");
});

test("025 - quotes - surrounded tags in vicinity", () => {
  equal(
    stripHtml("<ul> <li>(<strong>zzz</strong>)</li> </ul>").result,
    "(zzz)",
    "025.01",
  );
});

test("026 - quotes - surrounded tags in vicinity", () => {
  equal(stripHtml('a <a>"<b>z</b>"</a> b').result, 'a "z" b', "026.01");
});

test("027 - examples - c-plus-us", () => {
  equal(
    stripHtml(
      "<code>#include <stdio.h>;</code> and <code>#include &lt;stdio.h&gt;</code>",
    ).result,
    "#include; and #include",
    "027.01",
  );
});

test.run();
