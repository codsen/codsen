// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// tag pairs vs content
// -----------------------------------------------------------------------------

test("001 - tag pair among defaults", () => {
  equal(
    stripHtml("abc<script>const x = 1;</script>xyz"),
    {
      result: "abc xyz",
      ranges: [[3, 32, " "]],
      allTagLocations: [
        [3, 11],
        [23, 32],
      ],
      filteredTagLocations: [
        [3, 11],
        [23, 32],
      ],
    },
    "001.01",
  );
});

test("002 - tag pair custom-defined", () => {
  equal(
    stripHtml("abc<script>const x = 1;</script>xyz", {
      stripTogetherWithTheirContents: ["script"],
    }),
    {
      result: "abc xyz",
      ranges: [[3, 32, " "]],
      allTagLocations: [
        [3, 11],
        [23, 32],
      ],
      filteredTagLocations: [
        [3, 11],
        [23, 32],
      ],
    },
    "002.01",
  );
});

test("003 - tag pair's contents not deleted upon request", () => {
  equal(
    stripHtml("abc<script>const x = 1;</script>xyz", {
      stripTogetherWithTheirContents: ["div"],
    }),
    {
      result: "abc const x = 1; xyz",
      ranges: [
        [3, 11, " "],
        [23, 32, " "],
      ],
      allTagLocations: [
        [3, 11],
        [23, 32],
      ],
      filteredTagLocations: [
        [3, 11],
        [23, 32],
      ],
    },
    "003.01",
  );
});

test("004 - callback decisions determine filtered locations", () => {
  const input = "<b>x</b>";
  const allTagLocations = [
    [0, 3],
    [4, 8],
  ];

  equal(
    stripHtml(input, { cb: () => {} }),
    {
      result: input,
      ranges: null,
      allTagLocations,
      filteredTagLocations: [],
    },
    "004.01",
  );

  equal(
    stripHtml(input, {
      cb: ({ proposedReturn, rangesArr }) => {
        rangesArr.push(...proposedReturn);
      },
    }),
    {
      result: "x",
      ranges: [
        [0, 3],
        [4, 8],
      ],
      allTagLocations,
      filteredTagLocations: allTagLocations,
    },
    "004.02",
  );

  equal(
    stripHtml(input, {
      ignoreTags: ["b"],
      cb: ({ tag, rangesArr }) => {
        rangesArr.push(tag.start, tag.end);
      },
    }),
    {
      result: "x",
      ranges: [
        [0, 3],
        [4, 8],
      ],
      allTagLocations,
      filteredTagLocations: allTagLocations,
    },
    "004.03",
  );

  equal(
    stripHtml(input, {
      cb: ({ tag, rangesArr }) => {
        rangesArr.push(tag.slashPresent ? tag.start : tag.start + 1, tag.end);
      },
    }),
    {
      result: "<x",
      ranges: [
        [1, 3],
        [4, 8],
      ],
      allTagLocations,
      filteredTagLocations: [[4, 8]],
    },
    "004.04",
  );

  equal(
    stripHtml(input, {
      cb: ({ tag, rangesArr }) => {
        if (!tag.slashPresent) {
          rangesArr.push(tag.start, tag.end, "<i>");
        }
      },
    }),
    {
      result: "<i>x</b>",
      ranges: [[0, 3, "<i>"]],
      allTagLocations,
      filteredTagLocations: [[0, 3]],
    },
    "004.05",
  );

  equal(
    stripHtml("&lt;b&gt;x&lt;/b&gt;", { cb: () => {} }),
    {
      result: input,
      ranges: [
        [0, 4, "<"],
        [5, 9, ">"],
        [10, 14, "<"],
        [16, 20, ">"],
      ],
      allTagLocations: [
        [0, 9],
        [10, 20],
      ],
      filteredTagLocations: [],
    },
    "004.06",
  );
});

test.run();
