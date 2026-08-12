// Recover when spaces replace attribute equals signs

import { strict as assert } from "node:assert";

import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";

const source = "<a class \"button\" id 'example'>";

assert.equal(isAttrClosing(source, 9, 16), true);
assert.equal(isAttrClosing(source, 21, 29), true);
