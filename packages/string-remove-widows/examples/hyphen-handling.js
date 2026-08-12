// Keep a dash with its neighbouring words when hyphen handling is enabled

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

const input = "aaa bbb ccc - ddd";

assert.equal(
  removeWidows(input, { hyphens: true, minWordCount: 0, minCharCount: 0 }).res,
  "aaa bbb ccc&nbsp;-&nbsp;ddd",
);
assert.equal(
  removeWidows(input, { hyphens: false, minWordCount: 0, minCharCount: 0 }).res,
  "aaa bbb ccc -&nbsp;ddd",
);
