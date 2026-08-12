// Compare array elements at their exact positions

import { strict as assert } from "node:assert";

import { deepContains } from "../dist/ast-deep-contains.esm.js";

const mismatches = [];

deepContains(
  [{ id: "first" }, { id: "second" }],
  [{ id: "second" }, { id: "first" }],
  (leftValue, rightValue) => {
    if (leftValue !== rightValue) {
      mismatches.push([leftValue, rightValue]);
    }
  },
  assert.fail,
  { arrayStrictComparison: true },
);

assert.deepEqual(mismatches, [
  ["first", "second"],
  ["second", "first"],
]);
