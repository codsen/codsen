// Convert an array of native indexes

import { strict as assert } from "node:assert";

import { nativeToUnicode } from "../dist/string-convert-indexes.esm.js";

assert.deepEqual(nativeToUnicode("\uD834\uDF06aa", [1, 0, 2, 3]), [0, 0, 1, 2]);
