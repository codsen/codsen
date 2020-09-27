/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import combinations from "../dist/object-boolean-combinations.esm.js";

assert.deepEqual(
  combinations({
    a: true, // values don't matter as long as they're boolean
    b: false,
    c: true,
  }),
  [
    { a: 0, b: 0, c: 0 },
    { a: 1, b: 0, c: 0 },
    { a: 0, b: 1, c: 0 },
    { a: 1, b: 1, c: 0 },
    { a: 0, b: 0, c: 1 },
    { a: 1, b: 0, c: 1 },
    { a: 0, b: 1, c: 1 },
    { a: 1, b: 1, c: 1 },
  ]
);
// you get 2^n plain objects in an array
