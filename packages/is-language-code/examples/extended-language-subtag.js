// Validate an extended language subtag after its registered prefix

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.deepEqual(isLangCode("zh-cmn-Hans-CN"), {
  res: true,
  message: null,
});
