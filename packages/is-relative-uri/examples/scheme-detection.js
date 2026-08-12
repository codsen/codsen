// URI scheme detection

import { strict as assert } from "node:assert";

import { isRel } from "../dist/is-relative-uri.esm.js";

assert.deepEqual(isRel("mailto:user@example.com"), {
  res: false,
  message: null,
});

// Scheme detection can be disabled when another layer validates schemes.
assert.equal(
  isRel("mailto:user@example.com", { flagUpUrisWithSchemes: false }).res,
  true,
);
