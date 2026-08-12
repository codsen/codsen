import { strict as assert } from "node:assert";

import { enforceKeysetSync } from "../dist/json-comb-core.esm.js";

assert.deepEqual(
  enforceKeysetSync(
    { profile: null },
    { profile: { name: false }, active: false },
    { useNullAsExplicitFalse: false },
  ),
  { active: false, profile: { name: false } },
);
