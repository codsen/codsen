// Inspect each node's parent metadata

import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey-traverse.esm.js";

const metadata = [];

traverse({ users: [{ name: "Ada" }] }, (key, value, inner) => {
  const current = value !== undefined ? value : key;
  metadata.push([inner.path, inner.depth, inner.parentType, inner.topmostKey]);
  return current;
});

assert.deepEqual(metadata, [
  ["users", 0, "object", "users"],
  ["users.0", 1, "array", "users"],
  ["users.0.name", 2, "object", "users"],
]);
