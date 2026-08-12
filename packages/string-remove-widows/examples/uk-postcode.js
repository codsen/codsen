// Keep both halves of a UK postcode together

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows("Office: SW1A 1AA", {
    UKPostcodes: true,
    minWordCount: 99,
    minCharCount: 99,
  }).res,
  "Office: SW1A&nbsp;1AA",
);
