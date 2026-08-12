// Quick Take

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.deepEqual(isLangCode("sr-Latn"), {
  res: true,
  message: null,
});
