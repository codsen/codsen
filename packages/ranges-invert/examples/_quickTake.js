// Quick Take

import { strict as assert } from "assert";

import { rInvert } from "../dist/ranges-invert.esm.js";

assert.deepEqual(
  rInvert(
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
