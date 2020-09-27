/* eslint import/extensions:0, no-unused-vars:0 */

// Quick Take

import { strict as assert } from "assert";
import isLangCode from "../dist/is-language-code.esm";

assert.deepEqual(isLangCode("de-419-DE"), {
  res: false,
  message: 'Two region subtags, "419" and "de".',
});

assert.deepEqual(isLangCode("sr-Latn"), {
  res: true,
  message: null,
});
