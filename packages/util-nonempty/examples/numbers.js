// Treat every number, including zero and NaN, as non-empty

import { strict as assert } from "node:assert";

import { nonEmpty } from "../dist/util-nonempty.esm.js";

assert.equal(nonEmpty(0), true);
assert.equal(nonEmpty(42), true);
assert.equal(nonEmpty(Number.NaN), true);
