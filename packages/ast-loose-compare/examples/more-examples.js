// More Examples

import { strict as assert } from "assert";

import { looseCompare } from "../dist/ast-loose-compare.esm.js";

assert.equal(
  looseCompare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }),
  true,
);
// true, because second (smallObj) is subset of (or equal) first (bigObj).

assert.equal(
  looseCompare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }),
  false,
);
// false, because second (smallObj) is not a subset (or equal) to first (bigObj).

assert.equal(looseCompare(["a", "b", "c"], ["a", "b"]), true);
// true, because second is a subset of first

assert.equal(looseCompare(["a", "b"], ["a", "b", "c"]), false);
// false, because second is not a subset of first

assert.equal(looseCompare("aaaaa\nbbbbb", "aaaaa\nbbbbb"), true);
// true, because strings are equal

assert.equal(looseCompare({ a: "a" }), undefined);
// the second argument is missing
