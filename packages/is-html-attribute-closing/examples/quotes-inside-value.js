// Distinguish quotes inside a value from its closing quote

import { strict as assert } from "node:assert";

import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";

const source = `<td style="font-family:'AbCd-Ef', 'AbCd', sans-serif;">`;

assert.equal(isAttrClosing(source, 10, 23), false);
assert.equal(isAttrClosing(source, 10, 31), false);
assert.equal(isAttrClosing(source, 10, 53), true);
