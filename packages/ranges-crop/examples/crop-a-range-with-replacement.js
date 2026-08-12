import { strict as assert } from "node:assert";

import { rCrop } from "../dist/ranges-crop.esm.js";

assert.deepEqual(rCrop([[5, 12, "replacement"]], 8), [[5, 8, "replacement"]]);
