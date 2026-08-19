// Ignore a less-than sign used for comparison

import { strict as assert } from "node:assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

const text = "When a < b, keep comparing; then render <strong>done</strong>.";

assert.equal(isOpening(text, text.indexOf("<")), false);
assert.equal(isOpening(text, text.indexOf("<strong>")), true);
