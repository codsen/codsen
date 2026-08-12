// Reject text that does not resemble a language tag

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.deepEqual(isLangCode("en_US"), {
  res: false,
  message: "Does not resemble a language tag.",
});
