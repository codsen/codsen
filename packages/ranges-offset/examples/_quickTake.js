/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import offset from "../dist/ranges-offset.esm.js";

assert.deepEqual(
  offset(
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
assert.deepEqual(offset(null, 10), null);

// if input does not resemble ranges, nothing happens:
assert.deepEqual(offset(true, 10), true);
