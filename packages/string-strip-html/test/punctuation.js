import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// punctuation
// -----------------------------------------------------------------------------

tap.test("01 - punctuation after tag - simplified, question mark", (t) => {
  t.same(stripHtml("a<b>?</b> c"), "a? c", "01");
  t.end();
});

tap.test("02 - punctuation after tag - simplified, question mark", (t) => {
  t.same(stripHtml("a<b>?</b> c", { trimOnlySpaces: true }), "a? c", "02");
  t.end();
});

tap.test("03 - punctuation after tag - simplified, question mark", (t) => {
  t.same(
    stripHtml("a<b>?</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a? c",
    "03"
  );
  t.end();
});

tap.test("04 - punctuation after tag - simplified, question mark", (t) => {
  t.same(
    stripHtml("a<b>?</b> c", { stripTogetherWithTheirContents: false }),
    "a? c",
    "04"
  );
  t.end();
});

tap.test("05 - punctuation after tag - simplified, question mark", (t) => {
  t.same(stripHtml("a<b>?</b> c", { ignoreTags: ["zzz"] }), "a? c", "05");
  t.end();
});

tap.test("06 - punctuation after tag - simplified, question mark", (t) => {
  t.same(
    stripHtml("a<b>?</b> c", { returnRangesOnly: true }),
    [
      [1, 4],
      [5, 10, " "],
    ],
    "06"
  );
  t.end();
});

tap.test("07 - punctuation after tag - simplified, question mark", (t) => {
  t.same(stripHtml("a<b>?</b> c", { ignoreTags: null }), "a? c", "07");
  t.end();
});

tap.test("08 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(stripHtml("a<b>!</b> c"), "a! c", "08");
  t.end();
});

tap.test("09 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(stripHtml("a<b>!</b> c", { trimOnlySpaces: true }), "a! c", "09");
  t.end();
});

tap.test("10 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(
    stripHtml(" \t a<b>!</b> c \t ", { trimOnlySpaces: true }),
    "\t a! c \t",
    "10"
  );
  t.end();
});

tap.test("11 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(
    stripHtml("a<b>!</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a! c",
    "11"
  );
  t.end();
});

tap.test("12 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(
    stripHtml("a<b>!</b> c", { stripTogetherWithTheirContents: false }),
    "a! c",
    "12"
  );
  t.end();
});

tap.test("13 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(stripHtml("a<b>!</b> c", { ignoreTags: ["zzz"] }), "a! c", "13");
  t.end();
});

tap.test("14 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(
    stripHtml("a<b>!</b> c", { returnRangesOnly: true }),
    [
      [1, 4],
      [5, 10, " "],
    ],
    "14"
  );
  t.end();
});

tap.test("15 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(stripHtml("a<b>!</b>c"), "a! c", "15");
  t.end();
});

tap.test("16 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(stripHtml("a<b>...</b> c"), "a... c", "16");
  t.end();
});

tap.test("17 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(stripHtml("a<b>...</b> c", { trimOnlySpaces: true }), "a... c", "17");
  t.end();
});

tap.test("18 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(
    stripHtml("a<b>...</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a... c",
    "18"
  );
  t.end();
});

tap.test("19 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(
    stripHtml("a<b>...</b> c", { stripTogetherWithTheirContents: false }),
    "a... c",
    "19"
  );
  t.end();
});

tap.test("20 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(stripHtml("a<b>...</b> c", { ignoreTags: ["zzz"] }), "a... c", "20");
  t.end();
});

tap.test("21 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(
    stripHtml("a<b>...</b> c", { returnRangesOnly: true }),
    [
      [1, 4],
      [7, 12, " "],
    ],
    "21"
  );
  t.end();
});

tap.test("22 - punctuation after tag - real-life", (t) => {
  // control
  t.same(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      '
    ),
    "Hi! Would you like to shop now?",
    "22"
  );
  t.end();
});

tap.test("23 - punctuation after tag - real-life", (t) => {
  t.same(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      "
    ),
    "Hi! Please shop now!",
    "23"
  );
  t.end();
});

tap.test("24 - punctuation after tag - real-life", (t) => {
  // opts.trimOnlySpaces
  t.same(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      ',
      { trimOnlySpaces: true }
    ),
    "\u00A0     Hi! Would you like to shop now?      \u00A0",
    "24"
  );
  t.end();
});

tap.test("25 - punctuation after tag - real-life", (t) => {
  t.same(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      ",
      { trimOnlySpaces: true }
    ),
    "\u00A0     Hi! Please shop now!      \u00A0",
    "25"
  );
  t.end();
});
