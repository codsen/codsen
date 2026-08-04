// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// tag locations
// -----------------------------------------------------------------------------

test("001 - tag locations - anchor wrapping text", () => {
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
    "001.01",
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
    "001.02",
  );
});

test("002 - tag locations - no tags were present at all", () => {
  equal(
    stripHtml("abc def"),
    {
      result: "abc def",
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "002.01",
  );
});

test("003 - tag locations - opts.ignoreTags", () => {
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
    "003.01",
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
    "003.02",
  );
});

test("004 - tag locations - opts.ignoreTags", () => {
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
    "004.01",
  );
});

test("005 - tag locations - opts.onlyStripTags", () => {
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
    "005.01",
  );
});

test("006 - tag locations - opts.onlyStripTags", () => {
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
    "006.01",
  );
});

test("007 - tag locations - closing bracket missing", () => {
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
    "007.01",
  );
});

test("008 - tag locations - closing bracket missing", () => {
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
    "008.01",
  );
});

test("009 - tag locations - closing bracket missing on ignored tag", () => {
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
    "009.01",
  );
});

test.run();
