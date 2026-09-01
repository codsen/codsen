// Reuse caller-owned inputs instead of defensively cloning them

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

// Give the merge exclusive ownership of both inputs before enabling this
// option. The merge can return and mutate an input instead of cloning it.
const existing = { profile: { name: "Ada" } };
const incoming = { profile: { role: "author" } };
const result = mergeAdvanced(existing, incoming, { reuseInputs: true });

assert.equal(result, existing);
assert.deepEqual(existing, {
  profile: { name: "Ada", role: "author" },
});
