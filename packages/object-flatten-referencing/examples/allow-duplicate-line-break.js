// Insert a break even when the previous line already contains one

import { strict as assert } from "node:assert";

import { flattenArr } from "../dist/object-flatten-referencing.esm.js";

assert.equal(
  flattenArr(
    ["one<br />", "two"],
    { mergeWithoutTrailingBrIfLineContainsBr: false },
    false,
    true,
  ),
  "one<br /><br />two",
);
