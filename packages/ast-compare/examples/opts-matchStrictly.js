import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

const complete = { name: "Ada", role: "admin" };
const subset = { name: "Ada" };

assert.equal(compare(complete, subset), true);
assert.equal(compare(complete, subset, { matchStrictly: true }), false);
