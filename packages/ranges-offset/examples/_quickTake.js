// Quick Take

import { strict as assert } from "assert";
import { rOffset } from "../dist/ranges-offset.esm.js";

assert.deepEqual(
  rOffset(
    [
      [3, 5],
      [8, 7],
    ],
    10
  ),
  [
    [13, 15],
    [18, 17],
  ]
);

// ranges are empty, nothing happens:
assert.deepEqual(rOffset(null, 10), null);

// if input does not resemble ranges, nothing happens:
assert.deepEqual(rOffset(true, 10), true);
