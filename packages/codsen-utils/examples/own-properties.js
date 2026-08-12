// Check own properties safely

import { strict as assert } from "node:assert";

import { hasOwnProp } from "../dist/codsen-utils.esm.js";

const value = { own: true };

assert.equal(hasOwnProp(value, "own"), true);
assert.equal(hasOwnProp(value, "toString"), false);
