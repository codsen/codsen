// Stop

import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey-traverse.esm.js";

const input = { a: "1", b: { c: "2" } };
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
