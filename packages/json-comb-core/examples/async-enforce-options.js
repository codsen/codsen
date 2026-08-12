import { strict as assert } from "node:assert";

import { enforceKeyset } from "../dist/json-comb-core.esm.js";

const result = await enforceKeyset(
  { profile: null },
  { profile: { name: false }, active: false },
  { useNullAsExplicitFalse: false },
);

assert.deepEqual(result, { active: false, profile: { name: false } });
