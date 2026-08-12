import { strict as assert } from "node:assert";

import { unicodeToNative } from "../dist/string-convert-indexes.esm.js";

assert.deepEqual(unicodeToNative("\uD834\uDF06aa", [0, 1, 2]), [0, 2, 3]);
