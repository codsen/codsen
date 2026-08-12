import { strict as assert } from "node:assert";

import { nativeToUnicode } from "../dist/string-convert-indexes.esm.js";

const selection = { start: 2, end: 3, metadata: ["0"] };
const unicodeSelection = nativeToUnicode("\ud834\udf06aa", selection);

assert.deepEqual(unicodeSelection, { start: 1, end: 2, metadata: ["0"] });
