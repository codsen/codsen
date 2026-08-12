// Decode CSS selector escapes

import { strict as assert } from "node:assert";

import { decodeCssSelector } from "../dist/string-extract-class-names.esm.js";

assert.equal(decodeCssSelector(".sm\\:hover"), ".sm:hover");
assert.equal(decodeCssSelector("#\\31 23"), "#123");
