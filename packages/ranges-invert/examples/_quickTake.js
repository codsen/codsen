/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import invert from "../dist/ranges-invert.esm.js";

assert.deepEqual(
  invert(
    [
      [3, 5],
      [5, 7],
    ],
    9 // string length needed to set the boundary
  ),
  [
    [0, 3],
    [7, 9],
  ]
);
