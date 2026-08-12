// Insert a raw non-breaking space instead of an encoded entity

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows("aaa bbb ccc ddd", {
    convertEntities: false,
    minCharCount: 5,
  }).res,
  "aaa bbb ccc\u00a0ddd",
);
