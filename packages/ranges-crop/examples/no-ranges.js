// No ranges to crop

import { strict as assert } from "node:assert";

import { rCrop } from "../dist/ranges-crop.esm.js";

assert.equal(rCrop(null, 10), null);
assert.deepEqual(rCrop([], 10), []);
