// Quick Take

import { strict as assert } from "assert";
import { rCrop } from "../dist/ranges-crop.esm.js";

assert.deepEqual(
  rCrop(
    [
      [2, 3],
      [9, 10, "bad grey wolf"],
      [1, 2],
    ],
    7
  ),
  [[1, 3]] // sorted, merged and cropped
);
