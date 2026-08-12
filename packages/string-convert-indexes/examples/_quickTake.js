// Quick Take

import { strict as assert } from "node:assert";

import { nativeToUnicode } from "../dist/string-convert-indexes.esm.js";

// CONVERTING NATIVE JS INDEXES TO UNICODE-CHAR-COUNT-BASED
// 𝌆 - \uD834\uDF06

// at index 1, we have low surrogate, that's still grapheme index zero
assert.equal(nativeToUnicode("\uD834\uDF06aa", "1"), "0");
// notice it's retained as string. The same type as input is retained!
