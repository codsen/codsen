// Quick Take

import { strict as assert } from "assert";
import {
  nativeToUnicode,
  unicodeToNative,
} from "../dist/string-convert-indexes.esm.js";

// CONVERTING NATIVE JS INDEXES TO UNICODE-CHAR-COUNT-BASED
// 𝌆 - \uD834\uDF06

// at index 1, we have low surrogate, that's still grapheme index zero
assert.equal(nativeToUnicode("\uD834\uDF06aa", "1"), "0");
// notice it's retained as string. The same type as input is retained!

// at index 2, we have first letter a - that's second index, counting graphemes
assert.equal(nativeToUnicode("\uD834\uDF06aa", 3), 2);

// convert many indexes at once - any nested data structure is fine:
assert.deepEqual(nativeToUnicode("\uD834\uDF06aa", [1, 0, 2, 3]), [0, 0, 1, 2]);

// numbers from an AST-like complex structure are still picked out and converted:
assert.deepEqual(nativeToUnicode("\uD834\uDF06aa", [1, "0", [[[2]]], 3]), [
  0, // notice matching type is retained
  "0", // notice matching type is retained
  [[[1]]],
  2,
]);

// CONVERTING UNICODE-CHAR-COUNT-BASED TO NATIVE JS INDEXES
// 𝌆 - \uD834\uDF06

assert.deepEqual(unicodeToNative("\uD834\uDF06aa", [0, 1, 2]), [0, 2, 3]);

assert.deepEqual(unicodeToNative("\uD834\uDF06aa", [1, 0, 2]), [2, 0, 3]);

assert.throws(() => unicodeToNative("\uD834\uDF06aa", [1, 0, 2, 3]));
// throws an error!
// that's because there's no character (counting Unicode characters) with index 3
// we have only three Unicode characters, so indexes go only up until 2
