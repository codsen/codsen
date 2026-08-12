// Distinguish plain objects from other object values

import { strict as assert } from "node:assert";

import { isPlainObject } from "../dist/codsen-utils.esm.js";

assert.equal(isPlainObject({ key: "value" }), true);
assert.equal(isPlainObject(Object.create(null)), true);
assert.equal(isPlainObject([]), false);
assert.equal(isPlainObject(new Date()), false);
