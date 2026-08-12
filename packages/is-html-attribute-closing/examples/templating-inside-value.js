// Ignore quotes that belong to templating code inside a value

import { strict as assert } from "node:assert";

import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";

const source = '<a href="https://example.com?p=<%= @param %>">';

assert.equal(isAttrClosing(source, 8, 44), true);
