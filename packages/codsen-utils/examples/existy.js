// Test whether a value exists

import { strict as assert } from "node:assert";

import { existy } from "../dist/codsen-utils.esm.js";

assert.equal(existy(null), false);
assert.equal(existy(undefined), false);
assert.equal(existy(false), true);
assert.equal(existy(0), true);
assert.equal(existy(""), true);
