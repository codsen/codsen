// Quick Take

import { strict as assert } from "node:assert";

import { mixer } from "../dist/test-mixer.esm.js";

// Generate all possible combinations of boolean options.
const defaultOpts = {
  enabled: true,
  cached: false,
};

assert.deepEqual(mixer({}, defaultOpts), [
  { enabled: false, cached: false },
  { enabled: true, cached: false },
  { enabled: false, cached: true },
  { enabled: true, cached: true },
]);
