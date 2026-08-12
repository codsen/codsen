// Empty containers

import { strict as assert } from "node:assert";

import { allEq } from "../dist/object-all-values-equal-to.esm.js";

assert.equal(allEq({}, null), true);
assert.equal(allEq([], null), true);
