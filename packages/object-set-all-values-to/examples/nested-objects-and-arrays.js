// Set the values within nested objects and arrays

import { strict as assert } from "node:assert";

import { setAllValuesTo } from "../dist/object-set-all-values-to.esm.js";

assert.deepEqual(
  setAllValuesTo({ user: { name: "Ada", roles: [{ name: "admin" }] } }, null),
  { user: { name: null, roles: [{ name: null }] } },
);
