import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// tag locations
// -----------------------------------------------------------------------------

tap.test("01 - tag locations - anchor wrapping text", (t) => {
  t.hasStrict(
    stripHtml("abc<a>click me</a>def"),
    {
      result: "abc click me def",
      ranges: [
        [3, 6, " "],
        [14, 18, " "],
      ],
      allTagLocations: [
        [3, 6],
        [14, 18],
      ],
      filteredTagLocations: [
        [3, 6],
        [14, 18],
      ],
    },
    "01"
  );
  t.end();
});

tap.test("02 - tag locations - no tags were present at all", (t) => {
  t.hasStrict(
    stripHtml("abc def"),
    {
      result: "abc def",
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "02"
  );
  t.end();
});

tap.test("03 - tag locations - opts.ignoreTags", (t) => {
  t.hasStrict(
    stripHtml("<a><span>z</span></a>", {
      ignoreTags: ["a"],
    }),
    {
      result: "<a> z </a>",
      ranges: [
        [3, 9, " "],
        [10, 17, " "],
      ],
      allTagLocations: [
        [0, 3],
        [3, 9],
        [10, 17],
        [17, 21],
      ],
      filteredTagLocations: [
        [3, 9],
        [10, 17],
      ],
    },
    "03"
  );
  t.end();
});

tap.test("04 - tag locations - opts.ignoreTags", (t) => {
  const input = "<a><span>z</span></a>";
  t.hasStrict(
    stripHtml(input, {
      ignoreTags: ["a", "span"],
    }),
    {
      result: input,
      ranges: null,
      allTagLocations: [
        [0, 3],
        [3, 9],
        [10, 17],
        [17, 21],
      ],
      filteredTagLocations: [],
    },
    "04"
  );
  t.end();
});

tap.test("05 - tag locations - opts.onlyStripTags", (t) => {
  const input = "<a><span>z</span></a>";
  t.hasStrict(
    stripHtml(input, {
      onlyStripTags: ["span"],
    }),
    {
      result: "<a> z </a>",
      ranges: [
        [3, 9, " "],
        [10, 17, " "],
      ],
      allTagLocations: [
        [0, 3],
        [3, 9],
        [10, 17],
        [17, 21],
      ],
      filteredTagLocations: [
        [3, 9],
        [10, 17],
      ],
    },
    "05"
  );
  t.end();
});

tap.test("06 - tag locations - opts.onlyStripTags", (t) => {
  const input = "<a><span>z</span></a>";
  t.hasStrict(
    stripHtml(input, {
      onlyStripTags: ["a", "span"],
    }),
    {
      result: "z",
      ranges: [
        [0, 9],
        [10, 21],
      ],
      allTagLocations: [
        [0, 3],
        [3, 9],
        [10, 17],
        [17, 21],
      ],
      filteredTagLocations: [
        [0, 3],
        [3, 9],
        [10, 17],
        [17, 21],
      ],
    },
    "06"
  );
  t.end();
});

tap.test("07 - tag locations - closing bracket missing", (t) => {
  const input = `<div class="container" <div class="inner"`;
  t.hasStrict(
    stripHtml(input),
    {
      result: "",
      ranges: [[0, 41]],
      allTagLocations: [
        [0, 23],
        [23, 41],
      ],
      filteredTagLocations: [
        [0, 23],
        [23, 41],
      ],
    },
    "07"
  );
  t.end();
});

tap.test("08 - tag locations - closing bracket missing", (t) => {
  const input = `<div class="container" <div class="inner"`;
  t.hasStrict(
    stripHtml(input, {
      stripTogetherWithTheirContents: "div",
    }),
    {
      result: "",
      ranges: [[0, 41]],
      allTagLocations: [
        [0, 23],
        [23, 41],
      ],
      filteredTagLocations: [[0, 41]],
    },
    "08"
  );
  t.end();
});

tap.test("09 - tag locations - closing bracket missing on ignored tag", (t) => {
  const input = `<div class="container" <div class="inner"`;
  t.hasStrict(
    stripHtml(input, {
      ignoreTags: `div`,
    }),
    {
      result: input,
      ranges: null,
      allTagLocations: [
        [0, 23],
        [23, 41],
      ],
      filteredTagLocations: [],
    },
    "09"
  );
  t.end();
});
