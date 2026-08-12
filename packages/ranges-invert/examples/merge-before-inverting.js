// Merge overlapping ranges before inverting

import { strict as assert } from "node:assert";

import { rInvert } from "../dist/ranges-invert.esm.js";

assert.deepEqual(
  rInvert(
    [
      [4, 8],
      [1, 5],
    ],
    10,
  ),
  [
    [0, 1],
    [8, 10],
  ],
);
