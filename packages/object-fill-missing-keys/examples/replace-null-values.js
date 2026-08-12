// Fill null values when null is not an explicit opt-out

import { strict as assert } from "node:assert";

import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

assert.deepEqual(
  fillMissing({ a: null }, { a: ["z"] }, { useNullAsExplicitFalse: false }),
  { a: ["z"] },
);
