// Generate the one possible combination for an empty key set

import { strict as assert } from "node:assert";

import { combinations } from "../dist/object-boolean-combinations.esm.js";

assert.deepEqual(combinations({}), [{}]);
