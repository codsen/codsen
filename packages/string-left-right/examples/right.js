// Find the nearest non-whitespace character on the right

import { strict as assert } from "node:assert";

import { right } from "../dist/string-left-right.esm.js";

const source = "abc   def";

assert.equal(right(source, 2), 6);
assert.equal(source[right(source, 2)], "d");
