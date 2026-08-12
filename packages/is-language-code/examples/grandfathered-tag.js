// Accept an IANA-grandfathered language tag

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.deepEqual(isLangCode("i-klingon"), {
  res: true,
  message: null,
});
