// Index a zero-width-joiner emoji sequence

import { strict as assert } from "node:assert";

import {
  nativeToUnicode,
  unicodeToNative,
} from "../dist/string-convert-indexes.esm.js";

const text = "a\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1b";

assert.deepEqual(nativeToUnicode(text, [1, 2, 8, 9]), [1, 1, 1, 2]);
assert.equal(unicodeToNative(text, 2), 9);
