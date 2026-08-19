// Traverse without mutating the input

import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey-traverse.esm.js";

const input = { count: 1 };
const result = traverse(input, (key, value) =>
  key === "count" ? value + 1 : value,
);

assert.deepEqual(input, { count: 1 });
assert.equal(result.count, 2);
