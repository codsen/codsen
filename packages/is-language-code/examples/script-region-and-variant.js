// Validate language, script, region, and variant subtags together

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.deepEqual(isLangCode("hy-Latn-IT-arevela"), {
  res: true,
  message: null,
});
