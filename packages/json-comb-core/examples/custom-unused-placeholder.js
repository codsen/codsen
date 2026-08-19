// Find unused keys marked by a custom placeholder

import { strict as assert } from "node:assert";

import { findUnusedSync } from "../dist/json-comb-core.esm.js";

assert.deepEqual(
  findUnusedSync(
    [
      { name: "Ada", retired: null },
      { name: "Grace", retired: null },
    ],
    { placeholder: null },
  ),
  ["retired"],
);
