// Apply widow prevention only after the minimum word count is reached

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows("one two three", { minWordCount: 4, minCharCount: 0 }).res,
  "one two three",
);
assert.equal(
  removeWidows("one two three", { minWordCount: 3, minCharCount: 0 }).res,
  "one two&nbsp;three",
);
