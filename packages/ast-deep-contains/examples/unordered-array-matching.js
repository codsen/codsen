// Match arrays of objects regardless of their order

import { strict as assert } from "node:assert";

import { deepContains } from "../dist/ast-deep-contains.esm.js";

const gathered = [];
const errors = [];

deepContains(
  [{ c: "2" }, { a: "1", b: "2", c: "3" }, { x: "8", y: "9", z: "0" }],
  [
    { a: "1", b: "2", c: "3" },
    { x: "8", y: "9" },
  ],
  (leftSideVal, rightSideVal) => {
    gathered.push([leftSideVal, rightSideVal]);
  },
  (error) => {
    errors.push(error);
  },
);

assert.deepEqual(gathered, [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["8", "8"],
  ["9", "9"],
]);
assert.equal(errors.length, 0);
