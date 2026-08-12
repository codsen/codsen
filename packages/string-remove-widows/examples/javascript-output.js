// Encode the inserted non-breaking space for JavaScript

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows("aaa bbb ccc ddd", {
    targetLanguage: "js",
    minCharCount: 5,
  }).res,
  "aaa bbb ccc\\u00A0ddd",
);
