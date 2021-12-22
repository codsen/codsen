// Stop

import { strict as assert } from "assert";

import { traverse } from "../dist/ast-monkey-traverse.esm.js";

const input = { a: "1", b: { c: "2" } };
const result1 = [];

// the full traversal would look like this:
traverse(input, (key1, val1, innerObj) => {
  let current = val1 !== undefined ? val1 : key1;
  result1.push(innerObj.path);
  return current;
});
assert.deepEqual(result1, ["a", "b", "b.c"]);

// now let's stop the traversal at path "b" (that's real
// path, how object-path would reference it)
const result2 = [];
traverse(input, (key1, val1, innerObj, stop) => {
  let current = val1 !== undefined ? val1 : key1;
  result2.push(innerObj.path);
  if (innerObj.path === "b") {
    stop.now = true; // <---------------- !!!!!!!!!!
  }
  return current;
});
assert.deepEqual(result2, ["a", "b"]);
