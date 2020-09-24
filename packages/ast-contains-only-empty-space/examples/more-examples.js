/* eslint import/extensions:0 */

// More Examples

import { strict as assert } from "assert";
import containsOnlyEmptySpace from "../dist/ast-contains-only-empty-space.esm.js";

assert.equal(containsOnlyEmptySpace([{ content: {} }]), true);

assert.equal(containsOnlyEmptySpace([{ tag: "style" }]), false);

// Works on simple arrays as well:
assert.equal(containsOnlyEmptySpace(["   ", " "]), true);

// Works on strings as well:
assert.equal(containsOnlyEmptySpace("   "), true);

// Object keys that have values as null are considered empty:
assert.equal(containsOnlyEmptySpace({ a: null }), true);
