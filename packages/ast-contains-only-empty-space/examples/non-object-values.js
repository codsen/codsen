// Non-object values

import { strict as assert } from "node:assert";

import { empty } from "../dist/ast-contains-only-empty-space.esm.js";

// Only strings, arrays and plain objects are meaningful AST containers.
assert.equal(empty(null), false);
assert.equal(empty(true), false);
assert.equal(
  empty(() => {}),
  false,
);
