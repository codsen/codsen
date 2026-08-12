// Invert an absent ranges collection

import { strict as assert } from "node:assert";

import { rInvert } from "../dist/ranges-invert.esm.js";

assert.deepEqual(rInvert(null, 5), [[0, 5]]);
assert.equal(rInvert(null, 0), null);
