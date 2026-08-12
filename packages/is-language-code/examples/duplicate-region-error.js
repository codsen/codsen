// Explain a language tag containing two region subtags

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.deepEqual(isLangCode("de-419-DE"), {
  res: false,
  message: 'Two region subtags, "419" and "de".',
});
