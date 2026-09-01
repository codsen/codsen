// Compare Plain Objects

import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

// Check whether the second object is equal to, or a subset of, the first.
assert.equal(compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }), true);
// true, because the second object is a subset of the first object.

assert.equal(compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }), false);
// false, because the second object is not a subset of the first object.
