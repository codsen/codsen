// Check whether an array contains a value

import { strict as assert } from "node:assert";

import { nonEmpty } from "../dist/util-nonempty.esm.js";

assert.equal(nonEmpty(["a"]), true);
assert.equal(nonEmpty([123]), true);
