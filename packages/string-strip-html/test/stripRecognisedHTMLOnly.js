import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

test("01 - multiple letter tag", () => {
  equal(
    stripHtml("<tr><zz>a</zz></tr>", {
      stripRecognisedHTMLOnly: false,
    }).result,
    "a",
    "01.01"
  );
  equal(
    stripHtml("<tr><zz>a</zz></tr>", {
      stripRecognisedHTMLOnly: true,
    }).result,
    "<zz>a</zz>",
    "01.02"
  );
});

test("02 - single letter tag", () => {
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
    "02.01"
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
    "02.02"
  );
});

test.run();
