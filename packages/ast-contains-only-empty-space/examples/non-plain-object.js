// Non-plain objects

import { strict as assert } from "node:assert";

import { empty } from "../dist/ast-contains-only-empty-space.esm.js";

// Instances such as Date are treated as opaque leaves, not traversed.
assert.equal(empty(new Date(0)), true);
