// Merge positioned array objects even when their key sets differ

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced([{ name: "Ada" }], [{ role: "author" }], {
    mergeObjectsOnlyWhenKeysetMatches: false,
  }),
  [{ name: "Ada", role: "author" }],
);
