// Quick Take

import { strict as assert } from "node:assert";

import { rMerge } from "../dist/ranges-merge.esm.js";

// joining edges:
assert.deepEqual(
  rMerge([
    [1, 2],
    [2, 3],
    [9, 10],
  ]),
  [
    [1, 3],
    [9, 10],
  ],
);
