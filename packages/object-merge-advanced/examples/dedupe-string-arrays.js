// Deduplicate and sort merged string arrays

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced(["b", "a"], ["b", "c"], {
    dedupeStringsInArrayValues: true,
  }),
  ["a", "b", "c"],
);
