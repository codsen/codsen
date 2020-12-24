// Compare Plain Objects

import { strict as assert } from "assert";
import { compare } from "../dist/ast-compare.esm.js";

// Find out, does an object/array/string/nested-mix is a subset or equal to another input:
assert.equal(compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }), true);
// true, because second (smallObj) is subset of (or equal) first (bigObj).

assert.equal(compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }), false);
// => false, because second (smallObj) is not a subset (or equal) to first (bigObj).
