// Explain why a repeated variant is invalid

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.deepEqual(isLangCode("sl-rozaj-rozaj"), {
  res: false,
  message: 'Repeated variant subtag, "rozaj".',
});
