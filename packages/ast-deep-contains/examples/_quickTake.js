// Quick Take

import { strict as assert } from "node:assert";

import { deepContains } from "../dist/ast-deep-contains.esm.js";

const gathered = [];
const errors = [];

deepContains(
  { title: "Release notes", author: "Ada", draft: false },
  { title: "Release notes", author: "Ada" },
  (leftSideVal, rightSideVal) => {
    gathered.push([leftSideVal, rightSideVal]);
  },
  (err) => {
    errors.push(err);
  },
);

assert.deepEqual(gathered, [
  ["Release notes", "Release notes"],
  ["Ada", "Ada"],
]);
assert.equal(errors.length, 0);
