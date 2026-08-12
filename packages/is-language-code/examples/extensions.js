// Validate multiple uniquely prefixed extensions

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.deepEqual(isLangCode("en-a-myext-b-another"), {
  res: true,
  message: null,
});
