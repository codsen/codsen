// Compare Arrays

import { strict as assert } from "assert";
import { compare } from "../dist/ast-compare.esm.js";

assert.equal(compare(["a", "b", "c"], ["a", "b"]), true);
// true, because second is a subset of first

assert.equal(compare(["a", "b", "c"], ["b", "a"]), false);
// => false, because order is wrong

assert.equal(compare(["a", "b"], ["a", "b", "c"]), false);
// => false, because second is not a subset of first (it's opposite)

assert.equal(
  compare([{ a: "b" }, { c: "d" }, { e: "f" }], [{ a: "b" }, { c: "d" }]),
  true
);
// => plain objects nested in arrays
