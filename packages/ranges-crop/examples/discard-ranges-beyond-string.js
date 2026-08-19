// Discard the ranges beyond the string's end

import { strict as assert } from "node:assert";

import { rCrop } from "../dist/ranges-crop.esm.js";

assert.deepEqual(
  rCrop(
    [
      [1, 3],
      [7, 9],
    ],
    5,
  ),
  [[1, 3]],
);
