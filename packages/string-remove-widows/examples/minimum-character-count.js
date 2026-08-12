// Apply widow prevention only after the minimum character count is reached

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows("a b c d", { minWordCount: 0, minCharCount: 5 }).res,
  "a b c d",
);
assert.equal(
  removeWidows("a b c d", { minWordCount: 0, minCharCount: 1 }).res,
  "a b c&nbsp;d",
);
