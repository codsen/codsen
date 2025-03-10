import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// tag locations
// -----------------------------------------------------------------------------

test("01 - tag locations - anchor wrapping text", () => {
  equal(
    stripHtml("abc<a>click me</a>def"),
    {
      result: "abcclick medef",
      ranges: [
        [3, 6],
        [14, 18],
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
    "01.01",
  );
  equal(
    stripHtml("abc<div>click me</div>def"),
    {
      result: "abc click me def",
      ranges: [
        [3, 8, " "],
        [16, 22, " "],
      ],
      allTagLocations: [
        [3, 8],
        [16, 22],
      ],
      filteredTagLocations: [
        [3, 8],
        [16, 22],
      ],
    },
    "01.02",
  );
});

test("02 - tag locations - no tags were present at all", () => {
  equal(
    stripHtml("abc def"),
    {
      result: "abc def",
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "02.01",
  );
});

test("03 - tag locations - opts.ignoreTags", () => {
  equal(
    stripHtml("<a><span>z</span></a>", {
      ignoreTags: ["a"],
    }),
    {
      result: "<a>z</a>",
      ranges: [
        [3, 9],
        [10, 17],
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
    "03.01",
  );
  equal(
    stripHtml("<div><span>z</span></div>", {
      ignoreTags: ["div"],
    }),
    {
      result: "<div>z</div>",
      ranges: [
        [5, 11],
        [12, 19],
      ],
      allTagLocations: [
        [0, 5],
        [5, 11],
        [12, 19],
        [19, 25],
      ],
      filteredTagLocations: [
        [5, 11],
        [12, 19],
      ],
    },
    "03.02",
  );
});

test("04 - tag locations - opts.ignoreTags", () => {
  let input = "<a><span>z</span></a>";
  equal(
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
    "04.01",
  );
});

test("05 - tag locations - opts.onlyStripTags", () => {
  let input = "<a><span>z</span></a>";
  equal(
    stripHtml(input, {
      onlyStripTags: ["span"],
    }),
    {
      result: "<a>z</a>",
      ranges: [
        [3, 9],
        [10, 17],
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
    "05.01",
  );
});

test("06 - tag locations - opts.onlyStripTags", () => {
  let input = "<a><span>z</span></a>";
  equal(
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
    "06.01",
  );
});

test("07 - tag locations - closing bracket missing", () => {
  let input = '<div class="container" <div class="inner"';
  equal(
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
    "07.01",
  );
});

test("08 - tag locations - closing bracket missing", () => {
  let input = '<div class="container" <div class="inner"';
  equal(
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
    "08.01",
  );
});

test("09 - tag locations - closing bracket missing on ignored tag", () => {
  let input = '<div class="container" <div class="inner"';
  equal(
    stripHtml(input, {
      ignoreTags: "div",
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
    "09.01",
  );
});

test.run();
