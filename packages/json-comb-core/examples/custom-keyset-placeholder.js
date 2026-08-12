import { strict as assert } from "node:assert";

import { getKeysetSync } from "../dist/json-comb-core.esm.js";

assert.deepEqual(
  getKeysetSync([{ name: "Ada" }, { role: "admin" }], {
    placeholder: null,
  }),
  { name: null, role: null },
);
