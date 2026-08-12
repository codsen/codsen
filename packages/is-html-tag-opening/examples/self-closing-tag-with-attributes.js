import { strict as assert } from "node:assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

const html = 'before <img src="image.jpg" alt="Example" /> after';

assert.equal(isOpening(html, html.indexOf("<")), true);
