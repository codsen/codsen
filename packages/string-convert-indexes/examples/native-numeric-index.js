// Convert a single native index

import { strict as assert } from "node:assert";

import { nativeToUnicode } from "../dist/string-convert-indexes.esm.js";

// At native index 3, the second "a" is Unicode index 2.
assert.equal(nativeToUnicode("\uD834\uDF06aa", 3), 2);
