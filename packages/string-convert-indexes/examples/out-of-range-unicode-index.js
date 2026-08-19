// Throw on an out-of-range Unicode index

import { strict as assert } from "node:assert";

import { unicodeToNative } from "../dist/string-convert-indexes.esm.js";

assert.throws(() => unicodeToNative("\uD834\uDF06aa", [1, 0, 2, 3]));
