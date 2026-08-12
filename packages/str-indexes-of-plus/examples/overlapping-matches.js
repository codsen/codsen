import { strict as assert } from "node:assert";

import { strIndexesOfPlus } from "../dist/str-indexes-of-plus.esm.js";

assert.deepEqual(strIndexesOfPlus("aaaa", "aa"), [0, 1, 2]);
