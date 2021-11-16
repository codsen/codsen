import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// punctuation
// -----------------------------------------------------------------------------

tap.test("01 - punctuation after tag - simplified, question mark", (t) => {
  t.hasStrict(
    stripHtml("a<b>?</b> c"),
    {
      result: "a? c",
      ranges: [
        [1, 4],
        [5, 10, " "],
      ],
    },
    "01"
  );
  t.end();
});

tap.test("02 - punctuation after tag - simplified, question mark", (t) => {
  t.hasStrict(
    stripHtml("a<b>?</b> c", { trimOnlySpaces: true }),
    { result: "a? c" },
    "02"
  );
  t.end();
});

tap.test("03 - punctuation after tag - simplified, question mark", (t) => {
  t.hasStrict(
    stripHtml("a<b>?</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    { result: "a? c" },
    "03"
  );
  t.end();
});

tap.test("04 - punctuation after tag - simplified, question mark", (t) => {
  t.hasStrict(
    stripHtml("a<b>?</b> c", { stripTogetherWithTheirContents: false }),
    { result: "a? c" },
    "04"
  );
  t.end();
});

tap.test("05 - punctuation after tag - simplified, question mark", (t) => {
  t.hasStrict(
    stripHtml("a<b>?</b> c", { ignoreTags: ["zzz"] }),
    { result: "a? c" },
    "05"
  );
  t.end();
});

tap.test("06 - punctuation after tag - simplified, question mark", (t) => {
  t.hasStrict(
    stripHtml("a<b>?</b> c", { ignoreTags: null }),
    { result: "a? c" },
    "06"
  );
  t.end();
});

tap.test("07 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.hasStrict(
    stripHtml("a<b>!</b> c"),
    {
      result: "a! c",
      ranges: [
        [1, 4],
        [5, 10, " "],
      ],
    },
    "07"
  );
  t.end();
});

tap.test("08 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.hasStrict(
    stripHtml("a<b>!</b> c", { trimOnlySpaces: true }),
    {
      result: "a! c",
      ranges: [
        [1, 4],
        [5, 10, " "],
      ],
    },
    "08"
  );
  t.end();
});

tap.test("09 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.hasStrict(
    stripHtml(" \t a<b>!</b> c \t ", { trimOnlySpaces: true }),
    {
      result: "\t a! c \t",
      ranges: [
        [0, 1],
        [4, 7],
        [8, 13, " "],
        [16, 17],
      ],
    },
    "09"
  );
  t.end();
});

tap.test("10 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.hasStrict(
    stripHtml("a<b>!</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    { result: "a! c" },
    "10"
  );
  t.end();
});

tap.test("11 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.hasStrict(
    stripHtml("a<b>!</b> c", { stripTogetherWithTheirContents: false }),
    { result: "a! c" },
    "11"
  );
  t.end();
});

tap.test("12 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.hasStrict(
    stripHtml("a<b>!</b> c", { ignoreTags: ["zzz"] }),
    {
      result: "a! c",
      ranges: [
        [1, 4],
        [5, 10, " "],
      ],
    },
    "12"
  );
  t.end();
});

tap.test("13 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.hasStrict(stripHtml("a<b>!</b>c"), { result: "a! c" }, "13");
  t.end();
});

tap.test("14 - punctuation after tag - simplified, ellipsis", (t) => {
  t.hasStrict(
    stripHtml("a<b>...</b> c"),
    {
      result: "a... c",
      ranges: [
        [1, 4],
        [7, 12, " "],
      ],
    },
    "14"
  );
  t.end();
});

tap.test("15 - punctuation after tag - simplified, ellipsis", (t) => {
  t.hasStrict(
    stripHtml("a<b>...</b> c", { trimOnlySpaces: true }),
    {
      result: "a... c",
      ranges: [
        [1, 4],
        [7, 12, " "],
      ],
    },
    "15"
  );
  t.end();
});

tap.test("16 - punctuation after tag - simplified, ellipsis", (t) => {
  t.hasStrict(
    stripHtml("a<b>...</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    {
      result: "a... c",
      ranges: [
        [1, 4],
        [7, 12, " "],
      ],
    },
    "16"
  );
  t.end();
});

tap.test("17 - punctuation after tag - simplified, ellipsis", (t) => {
  t.hasStrict(
    stripHtml("a<b>...</b> c", { stripTogetherWithTheirContents: false }),
    {
      result: "a... c",
      ranges: [
        [1, 4],
        [7, 12, " "],
      ],
    },
    "17"
  );
  t.end();
});

tap.test("18 - punctuation after tag - simplified, ellipsis", (t) => {
  t.hasStrict(
    stripHtml("a<b>...</b> c", { ignoreTags: ["zzz"] }),
    {
      result: "a... c",
      ranges: [
        [1, 4],
        [7, 12, " "],
      ],
    },
    "18"
  );
  t.end();
});

tap.test("19 - punctuation after tag - real-life", (t) => {
  // control
  t.hasStrict(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      '
    ),
    { result: "Hi! Would you like to shop now?" },
    "19"
  );
  t.end();
});

tap.test("20 - punctuation after tag - real-life", (t) => {
  t.hasStrict(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      "
    ),
    { result: "Hi! Please shop now!" },
    "20"
  );
  t.end();
});

tap.test("21 - punctuation after tag - real-life", (t) => {
  // opts.trimOnlySpaces
  t.hasStrict(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      ',
      {
        trimOnlySpaces: true,
      }
    ),
    { result: "\u00A0     Hi! Would you like to shop now?      \u00A0" },
    "21"
  );
  t.end();
});

tap.test("22 - punctuation after tag - real-life", (t) => {
  t.hasStrict(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      ",
      { trimOnlySpaces: true }
    ),
    { result: "\u00A0     Hi! Please shop now!      \u00A0" },
    "22"
  );
  t.end();
});
