// Compatible With `object-path`

import { strict as assert } from "node:assert";
import op from "object-path";

import { traverse } from "../dist/ast-monkey-traverse.esm.js";

const input = { a: "1", b: [{ c: "2" }] };
Object.freeze(input); // let's freeze it, just for fun
const result1 = [];

// the full traversal would look like this:
traverse(input, (key1, val1, innerObj) => {
  let current = val1 !== undefined ? val1 : key1;
  result1.push(innerObj.path);
  return current;
});

// Each reported path is fully compatible with `object-path` get(). Notice that
// the path notation is "b.0.c", not "b[0].c".
assert.deepEqual(
  Object.fromEntries(result1.map((path) => [path, op.get(input, path)])),
  {
    a: "1",
    b: [{ c: "2" }],
    "b.0": { c: "2" },
    "b.0.c": "2",
  },
);
