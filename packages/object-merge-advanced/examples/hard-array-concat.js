// Concatenate every clashing pair of arrays

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced([1, 2], [2, 3], { hardArrayConcat: true }),
  [1, 2, 2, 3],
);
