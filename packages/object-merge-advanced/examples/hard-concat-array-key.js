// Concatenate arrays on a selected key

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced(
    { tags: ["stable"] },
    { tags: ["stable", "esm"] },
    { hardArrayConcatKeys: ["tags"] },
  ),
  { tags: ["stable", "stable", "esm"] },
);
