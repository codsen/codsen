// Encode the inserted non-breaking space for CSS

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows("aaa bbb ccc ddd", {
    targetLanguage: "css",
    minCharCount: 5,
  }).res,
  "aaa bbb ccc\\00A0ddd",
);
