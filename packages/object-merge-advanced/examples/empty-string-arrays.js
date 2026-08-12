// Clear an array merge when either array contains strings

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced(
    { tags: ["stable"] },
    { tags: ["esm"] },
    { mergeArraysContainingStringsToBeEmpty: true },
  ),
  { tags: [] },
);
