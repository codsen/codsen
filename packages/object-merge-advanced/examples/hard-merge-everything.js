// Prefer incoming values for every clash

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced(
    { list: ["old"], retained: true },
    { list: ["new"], added: true },
    { hardMergeEverything: true },
  ),
  { list: ["new"], retained: true, added: true },
);
