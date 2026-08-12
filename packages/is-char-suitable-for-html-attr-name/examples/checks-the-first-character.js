import { strict as assert } from "node:assert";

import { isAttrNameChar } from "../dist/is-char-suitable-for-html-attr-name.esm.js";

assert.equal(isAttrNameChar("data-id"), true);
assert.equal(isAttrNameChar(" data-id"), false);
