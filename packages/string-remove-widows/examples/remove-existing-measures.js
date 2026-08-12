// Remove an existing widow-prevention entity

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows("aaa bbb ccc&nbsp;ddd", {
    removeWidowPreventionMeasures: true,
    minCharCount: 5,
  }).res,
  "aaa bbb ccc ddd",
);
