// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

test("001 - multiple letter tag", () => {
  equal(
    stripHtml("<tr><zz>a</zz></tr>", {
      stripRecognisedHTMLOnly: false,
    }).result,
    "a",
    "001.01",
  );
  equal(
    stripHtml("<tr><zz>a</zz></tr>", {
      stripRecognisedHTMLOnly: true,
    }).result,
    "<zz>a</zz>",
    "001.02",
  );
});

test("002 - single letter tag", () => {
  equal(
    stripHtml("<a>z</y>", {
      stripRecognisedHTMLOnly: true,
    }),
    {
      result: "z</y>",
      ranges: [[0, 3]],
      allTagLocations: [
        [0, 3],
        [4, 8],
      ],
      filteredTagLocations: [[0, 3]],
    },
    "002.01",
  );
  equal(
    stripHtml("<a>z</y>", {
      stripRecognisedHTMLOnly: false,
    }),
    {
      result: "z",
      ranges: [
        [0, 3],
        [4, 8],
      ],
      allTagLocations: [
        [0, 3],
        [4, 8],
      ],
      filteredTagLocations: [
        [0, 3],
        [4, 8],
      ],
    },
    "002.02",
  );
});

test.run();
