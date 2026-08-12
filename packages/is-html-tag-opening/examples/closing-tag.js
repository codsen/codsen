import { strict as assert } from "node:assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

const html = "<p>Text</p>";

assert.equal(isOpening(html, html.indexOf("</")), true);
