// Detect the end of a single-quoted attribute value

import { strict as assert } from "node:assert";

import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";

const source = "<a href='https://example.com'>Example</a>";

assert.equal(isAttrClosing(source, 8, 28), true);
