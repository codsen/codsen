// Return the matched range instead of true

import { strict as assert } from "node:assert";

import { isIndexWithin } from "../dist/ranges-is-index-within.esm.js";

assert.deepEqual(
  isIndexWithin(
    8,
    [
      [1, 3],
      [5, 10],
    ],
    { returnMatchedRangeInsteadOfTrue: true },
  ),
  [5, 10],
);
