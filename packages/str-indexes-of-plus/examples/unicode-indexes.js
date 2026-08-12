import { strict as assert } from "node:assert";

import { strIndexesOfPlus } from "../dist/str-indexes-of-plus.esm.js";

// Emoji count as one grapheme, regardless of their native JavaScript length.
assert.deepEqual(strIndexesOfPlus("🐴-🦄", "🦄"), [2]);
