// Terminate on cycles and reuse completed shared subtrees

import { strict as assert } from "node:assert";

import { isEmpty } from "../dist/ast-is-empty.esm.js";

const cycle = {};
cycle.self = cycle;
assert.equal(isEmpty(cycle), null);

const shared = { value: "" };
assert.equal(isEmpty([shared, shared]), true);
