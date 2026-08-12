// Recover when an attribute value has no opening quote

import { strict as assert } from "node:assert";

import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";

const source = '<a href=example.com" class="button">Example</a>';

assert.equal(isAttrClosing(source, 8, 19), true);
assert.equal(isAttrClosing(source, 8, 27), false);
