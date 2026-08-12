// Skip validation for already sorted ranges

import { strict as assert } from "node:assert";

import { rInvert } from "../dist/ranges-invert.esm.js";

assert.deepEqual(
  rInvert(
    [
      [1, 3],
      [5, 7],
    ],
    8,
    { skipChecks: true },
  ),
  [
    [0, 1],
    [3, 5],
    [7, 8],
  ],
);
