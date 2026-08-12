// Check whether an object contains a property

import { strict as assert } from "node:assert";

import { nonEmpty } from "../dist/util-nonempty.esm.js";

assert.equal(nonEmpty({ a: "" }), true);
assert.equal(nonEmpty({ a: "a" }), true);
assert.equal(nonEmpty({}), false);
