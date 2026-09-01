// Validate a property whose key contains a literal dot

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.doesNotThrow(() => {
  checkTypesMini({ "cache.mode": "memory" }, null, {
    schema: { "cache\\.mode": "string" },
  });
});
