// Preserve empty range collections

import { strict as assert } from "node:assert";

import { rSort } from "../dist/ranges-sort.esm.js";

assert.deepEqual(rSort([]), []);
assert.equal(rSort(null), null);
