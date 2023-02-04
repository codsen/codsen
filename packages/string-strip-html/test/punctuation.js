import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// punctuation
// -----------------------------------------------------------------------------

test("01 - punctuation after tag - simplified, question mark", () => {
  let { result, ranges } = stripHtml("a<b>?</b> c");
  equal(result, "a? c", "01.01");
  equal(
    ranges,
    [
      [1, 4],
      [5, 10, " "],
    ],
    "01.02"
  );
});

test("02 - punctuation after tag - simplified, question mark", () => {
  equal(
    stripHtml("a<b>?</b> c", { trimOnlySpaces: true }).result,
    "a? c",
    "02.01"
  );
});

test("03 - punctuation after tag - simplified, question mark", () => {
  equal(
    stripHtml("a<b>?</b> c", { dumpLinkHrefsNearby: { enabled: true } }).result,
    "a? c",
    "03.01"
  );
});

test("04 - punctuation after tag - simplified, question mark", () => {
  equal(
    stripHtml("a<b>?</b> c", { stripTogetherWithTheirContents: false }).result,
    "a? c",
    "04.01"
  );
});

test("05 - punctuation after tag - simplified, question mark", () => {
  equal(
    stripHtml("a<b>?</b> c", { ignoreTags: ["zzz"] }).result,
    "a? c",
    "05.01"
  );
});

test("06 - punctuation after tag - simplified, question mark", () => {
  equal(stripHtml("a<b>?</b> c", { ignoreTags: null }).result, "a? c", "06.01");
});

test("07 - punctuation after tag - simplified, exclamation mark", () => {
  let { ranges, result } = stripHtml("a<b>!</b> c");
  equal(
    ranges,
    [
      [1, 4],
      [5, 10, " "],
    ],
    "07.01"
  );
  equal(result, "a! c", "07.02");
});

test("08 - punctuation after tag - simplified, exclamation mark", () => {
  let { result, ranges } = stripHtml("a<b>!</b> c", { trimOnlySpaces: true });
  equal(result, "a! c", "08.01");
  equal(
    ranges,
    [
      [1, 4],
      [5, 10, " "],
    ],
    "08.02"
  );
});

test("09 - punctuation after tag - simplified, exclamation mark", () => {
  let { result, ranges } = stripHtml(" \t a<b>!</b> c \t ", {
    trimOnlySpaces: true,
  });
  equal(result, "\t a! c \t", "09.01");
  equal(
    ranges,
    [
      [0, 1],
      [4, 7],
      [8, 13, " "],
      [16, 17],
    ],
    "09.02"
  );
});

test("10 - punctuation after tag - simplified, exclamation mark", () => {
  equal(
    stripHtml("a<b>!</b> c", { dumpLinkHrefsNearby: { enabled: true } }).result,
    "a! c",
    "10.01"
  );
});

test("11 - punctuation after tag - simplified, exclamation mark", () => {
  equal(
    stripHtml("a<b>!</b> c", { stripTogetherWithTheirContents: false }).result,
    "a! c",
    "11.01"
  );
});

test("12 - punctuation after tag - simplified, exclamation mark", () => {
  let { result, ranges } = stripHtml("a<b>!</b> c", { ignoreTags: ["zzz"] });
  equal(result, "a! c", "12.01");
  equal(
    ranges,
    [
      [1, 4],
      [5, 10, " "],
    ],
    "12.02"
  );
});

test("13 - punctuation after tag - simplified, exclamation mark", () => {
  equal(stripHtml("a<div>!</div>c").result, "a! c", "13.01");
  equal(stripHtml("a<b>!</b>c").result, "a!c", "13.02");
});

test("14 - punctuation after tag - simplified, ellipsis", () => {
  let { result, ranges } = stripHtml("a<b>...</b> c");
  equal(result, "a... c", "14.01");
  equal(
    ranges,
    [
      [1, 4],
      [7, 12, " "],
    ],
    "14.02"
  );
});

test("15 - punctuation after tag - simplified, ellipsis", () => {
  let { result, ranges } = stripHtml("a<b>...</b> c", { trimOnlySpaces: true });
  equal(result, "a... c", "15.01");
  equal(
    ranges,
    [
      [1, 4],
      [7, 12, " "],
    ],
    "15.02"
  );
});

test("16 - punctuation after tag - simplified, ellipsis", () => {
  let { result, ranges } = stripHtml("a<b>...</b> c", {
    dumpLinkHrefsNearby: { enabled: true },
  });
  equal(result, "a... c", "16.01");
  equal(
    ranges,
    [
      [1, 4],
      [7, 12, " "],
    ],
    "16.02"
  );
});

test("17 - punctuation after tag - simplified, ellipsis", () => {
  let { result, ranges } = stripHtml("a<b>...</b> c", {
    stripTogetherWithTheirContents: false,
  });
  equal(result, "a... c", "17.01");
  equal(
    ranges,
    [
      [1, 4],
      [7, 12, " "],
    ],
    "17.02"
  );
});

test("18 - punctuation after tag - simplified, ellipsis", () => {
  let { result, ranges } = stripHtml("a<b>...</b> c", { ignoreTags: ["zzz"] });
  equal(result, "a... c", "18.01");
  equal(
    ranges,
    [
      [1, 4],
      [7, 12, " "],
    ],
    "18.02"
  );
});

test("19 - punctuation after tag - real-life", () => {
  // control
  equal(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      '
    ).result,
    "Hi! Would you like to shop now?",
    "19.01"
  );
});

test("20 - punctuation after tag - real-life", () => {
  equal(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      "
    ).result,
    "Hi! Please shop now!",
    "20.01"
  );
});

test("21 - punctuation after tag - real-life", () => {
  // opts.trimOnlySpaces
  equal(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      ',
      {
        trimOnlySpaces: true,
      }
    ).result,
    "\u00A0     Hi! Would you like to shop now?      \u00A0",
    "21.01"
  );
});

test("22 - punctuation after tag - real-life", () => {
  equal(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      ",
      { trimOnlySpaces: true }
    ).result,
    "\u00A0     Hi! Please shop now!      \u00A0",
    "22.01"
  );
});

test("23 - quotes - surrounded", () => {
  equal(
    stripHtml(`<li>"<a href="/Foo/bar">zzz</a>"</li>`).result,
    `"zzz"`,
    "23.01"
  );
});

test("24 - quotes - surrounded, tight", () => {
  equal(stripHtml(`<li>(<strong>zzz</strong>)</li>`).result, `(zzz)`, "24.01");
});

test("25 - quotes - surrounded tags in vicinity", () => {
  equal(
    stripHtml(`<ul> <li>(<strong>zzz</strong>)</li> </ul>`).result,
    `(zzz)`,
    "25.01"
  );
});

test("26 - quotes - surrounded tags in vicinity", () => {
  equal(stripHtml(`a <a>"<b>z</b>"</a> b`).result, `a "z" b`, "26.01");
});

test("27 - examples - c-plus-us", () => {
  equal(
    stripHtml(
      `<code>#include <stdio.h>;</code> and <code>#include &lt;stdio.h&gt;</code>`
    ).result,
    `#include; and #include`,
    "27.01"
  );
});

test.run();
