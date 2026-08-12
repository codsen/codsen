// Validate a private-use language tag

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.deepEqual(isLangCode("x-project-internal"), {
  res: true,
  message: null,
});
