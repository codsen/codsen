// Match each unordered array element only once

import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

assert.equal(compare(["a", "b"], ["a", "a"], { arrayOrder: "any" }), false);
assert.equal(compare(["a", "a"], ["a", "a"], { arrayOrder: "any" }), true);
