// Pin one option while varying the others

import { strict as assert } from "node:assert";

import { mixer } from "../dist/test-mixer.esm.js";

const defaultOpts = {
  enabled: true,
  cached: false,
};

assert.deepEqual(mixer({ enabled: true }, defaultOpts), [
  { enabled: true, cached: false },
  { enabled: true, cached: true },
]);
