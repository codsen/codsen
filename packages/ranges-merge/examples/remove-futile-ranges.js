// Remove the ranges that do nothing

import { strict as assert } from "node:assert";

import { rMerge } from "../dist/ranges-merge.esm.js";

assert.deepEqual(
  rMerge([
    [1, 1],
    [2, 2, "insert"],
    [3, 5],
  ]),
  [
    [2, 2, "insert"],
    [3, 5],
  ],
);
