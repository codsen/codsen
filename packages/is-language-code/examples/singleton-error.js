// Explain an extension singleton without extension content

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.deepEqual(isLangCode("en-a"), {
  res: false,
  message: 'Ends with singleton, "a".',
});
