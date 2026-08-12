// Keep a chosen number of leading and trailing line breaks

import { strict as assert } from "node:assert";

import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

assert.equal(collWhitespace("\n\n\ncontent\n\n\n", 2), "\n\ncontent\n\n");
assert.equal(collWhitespace("\n\n\ncontent\n\n\n", 0), "content");
