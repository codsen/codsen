// Quick Take

import { strict as assert } from "node:assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

const html = "<span>Text</span>";

assert.equal(isOpening(html, 0), true);
