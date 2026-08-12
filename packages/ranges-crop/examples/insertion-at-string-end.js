import { strict as assert } from "node:assert";

import { rCrop } from "../dist/ranges-crop.esm.js";

assert.deepEqual(rCrop([[5, 9, "!"]], 5), [[5, 5, "!"]]);
