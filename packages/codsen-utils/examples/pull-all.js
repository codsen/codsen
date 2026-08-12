// Remove selected array values without mutating the input

import { strict as assert } from "node:assert";

import { pullAll } from "../dist/codsen-utils.esm.js";

const source = [1, 2, 3, 2];

assert.deepEqual(pullAll(source, [2]), [1, 3]);
assert.equal(source.length, 4);
