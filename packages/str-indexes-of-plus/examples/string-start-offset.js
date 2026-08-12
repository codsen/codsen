import { strict as assert } from "node:assert";

import { strIndexesOfPlus } from "../dist/str-indexes-of-plus.esm.js";

assert.deepEqual(strIndexesOfPlus("one one one", "one", "4"), [4, 8]);
