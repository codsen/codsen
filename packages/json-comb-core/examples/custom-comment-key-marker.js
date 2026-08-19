// Mark comment keys with a custom suffix

import { strict as assert } from "node:assert";

import { findUnusedSync } from "../dist/json-comb-core.esm.js";

assert.deepEqual(
  findUnusedSync(
    [
      { title: "One", title_note: false, unused: false },
      { title: "Two", title_note: false, unused: false },
    ],
    { comments: "_note" },
  ),
  ["unused"],
);
