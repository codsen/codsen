// Merge array values and omit duplicates instead of concatenating positions

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced(["a", "b"], ["b", "c"], {
    concatInsteadOfMerging: false,
  }),
  ["a", "b", "c"],
);
