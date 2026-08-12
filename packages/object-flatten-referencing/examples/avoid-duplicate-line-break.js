// Avoid adding a break after a line that already ends with one

import { strict as assert } from "node:assert";

import { flattenArr } from "../dist/object-flatten-referencing.esm.js";

assert.equal(
  flattenArr(
    ["one<br />", "two"],
    { mergeWithoutTrailingBrIfLineContainsBr: true },
    false,
    true,
  ),
  "one<br />two",
);
