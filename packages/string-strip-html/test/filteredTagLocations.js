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
      filteredTagLocations: [[3, 32]],
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
      filteredTagLocations: [[3, 32]],
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

test.run();
