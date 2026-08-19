// Merge and sort the ranges before cropping

import { strict as assert } from "node:assert";

import { rCrop } from "../dist/ranges-crop.esm.js";

assert.deepEqual(
  rCrop(
    [
      [5, 10],
      [1, 3],
      [2, 6],
    ],
    8,
  ),
  [[1, 8]],
);
