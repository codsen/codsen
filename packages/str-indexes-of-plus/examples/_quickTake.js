// Quick Take

import { strict as assert } from "node:assert";

import { strIndexesOfPlus } from "../dist/str-indexes-of-plus.esm.js";

// searches for string in a string, returns array:
assert.deepEqual(strIndexesOfPlus("abc-abc-abc-abc", "abc"), [0, 4, 8, 12]);
