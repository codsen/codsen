// Explain an extended language subtag with the wrong prefix

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.deepEqual(isLangCode("en-cmn"), {
  res: false,
  message: 'Extended language subtag "cmn" must follow "zh".',
});
