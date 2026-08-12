// Match registered tags without regard to letter case

import { strict as assert } from "node:assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

assert.equal(isLangCode("SR-lAtN-rS").res, true);
assert.equal(isLangCode("I-KLINGON").res, true);
