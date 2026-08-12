// Return false for unusable source indexes

import { strict as assert } from "node:assert";

import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";

assert.equal(isAttrClosing('<a href="x">', 8, 8), false);
assert.equal(isAttrClosing('<a href="x">', 8, 99), false);
assert.equal(isAttrClosing("", 0, 1), false);
