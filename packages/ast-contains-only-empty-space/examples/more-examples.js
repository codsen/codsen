// More Examples

import { strict as assert } from "assert";
import { empty } from "../dist/ast-contains-only-empty-space.esm.js";

assert.equal(empty([{ content: {} }]), true);

assert.equal(empty([{ tag: "style" }]), false);

// Works on simple arrays as well:
assert.equal(empty(["   ", " "]), true);

// Works on strings as well:
assert.equal(empty("   "), true);

// Object keys that have values as null are considered empty:
assert.equal(empty({ a: null }), true);
