// No defaults means no variations

import { strict as assert } from "node:assert";

import { mixer } from "../dist/test-mixer.esm.js";

assert.deepEqual(mixer({}, {}), []);
