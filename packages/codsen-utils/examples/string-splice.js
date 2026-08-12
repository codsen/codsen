// Replace part of a string

import { strict as assert } from "node:assert";

import { stringSplice } from "../dist/codsen-utils.esm.js";

assert.equal(stringSplice("abcdef", 2, 2, "XY"), "abXYef");

// Negative indexes count from the end.
assert.equal(stringSplice("abcdef", -2, 1, "X"), "abcdXf");
