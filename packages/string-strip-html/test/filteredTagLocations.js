import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// tag pairs vs content
// -----------------------------------------------------------------------------

test("01 - tag pair among defaults", () => {
  equal(
    stripHtml("abc<script>const x = 1;</script>xyz"),
    {
      result: "abc xyz",
      ranges: [[3, 32, " "]],
      allTagLocations: [
        [3, 11],
        [23, 32],
      ],
      filteredTagLocations: [[3, 32]],
    },
    "01.01",
  );
});

test("02 - tag pair custom-defined", () => {
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
      filteredTagLocations: [[3, 32]],
    },
    "02.01",
  );
});

test("03 - tag pair's contents not deleted upon request", () => {
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
    "03.01",
  );
});

test.run();
