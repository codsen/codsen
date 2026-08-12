// Treat nullish and Boolean values as empty

import { strict as assert } from "node:assert";

import { nonEmpty } from "../dist/util-nonempty.esm.js";

assert.equal(nonEmpty(null), false);
assert.equal(nonEmpty(undefined), false);
assert.equal(nonEmpty(true), false);
assert.equal(nonEmpty(false), false);

const callback = () => "z";

assert.equal(nonEmpty(callback), false);
