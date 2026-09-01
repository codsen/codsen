// Non-plain objects

import { strict as assert } from "node:assert";

import { empty } from "../dist/ast-contains-only-empty-space.esm.js";

// Instances such as Date are meaningful opaque values, not empty containers.
assert.equal(empty(new Date(0)), false);
