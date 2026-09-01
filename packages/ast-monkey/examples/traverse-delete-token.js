// Delete during traversal with the collision-free token

import { strict as assert } from "node:assert";

import { DELETE, traverse } from "../dist/ast-monkey.esm.js";

assert.deepEqual(
  traverse([Number.NaN, "remove"], (value) =>
    value === "remove" ? DELETE : value,
  ),
  [Number.NaN],
);
