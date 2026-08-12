// Intersect arrays in the first array's order

import { strict as assert } from "node:assert";

import { intersection } from "../dist/codsen-utils.esm.js";

assert.deepEqual(intersection([3, 1, 2, 1], [1, 3]), [3, 1]);
