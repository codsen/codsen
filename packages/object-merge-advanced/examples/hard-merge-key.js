// Take the incoming value for a selected clashing key

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced(
    { selected: ["old"], combined: ["left"] },
    { selected: ["new"], combined: ["right"] },
    { hardMergeKeys: ["selected"] },
  ),
  { selected: ["new"], combined: ["left", "right"] },
);
